import { COLORS, CONFIG, FLOOR_Y, LEVEL, VIEW } from '../config'
import { publishDebug } from '../debug'
import { Player } from '../entities/player'
import { BookGapPuzzle } from '../puzzles/bookGap'
import { ElevatorPuzzle } from '../puzzles/elevator'
import { WorkshopPuzzle } from '../puzzles/workshop'
import type { WorldApi } from '../puzzles/types'
import { resetSessionForPlay, session, showToast } from '../session'
import { settings } from '../settings'
import { Checkpoints } from '../systems/checkpoints'
import { Controls } from '../systems/controls'
import { clamp, lerp } from '../util'
import { drawBedroom } from '../world/bedroom'
import { makeSolid } from '../world/solids'

export class PlayScene extends Phaser.Scene {
  private pip!: Player
  private pebble!: Player
  private controls!: Controls
  private checkpoints!: Checkpoints
  private book!: BookGapPuzzle
  private elevator!: ElevatorPuzzle
  private workshop!: WorkshopPuzzle
  private solids: Phaser.GameObjects.Rectangle[] = []
  private ledges: Phaser.GameObjects.Rectangle[] = []
  private blocks: Phaser.GameObjects.Rectangle[] = []
  private glow!: Phaser.GameObjects.Graphics
  private simPaused = false
  private ending = false
  private endingT = 0

  constructor() {
    super({ key: 'play', active: false })
  }

  create(): void {
    resetSessionForPlay()
    this.ending = false
    this.endingT = 0
    this.simPaused = false
    this.solids = []
    this.ledges = []
    this.blocks = []
    this.physics.world.gravity.y = CONFIG.physics.gravity
    this.cameras.main.setBackgroundColor('#f7e3c8')
    drawBedroom(this)
    this.glow = this.add.graphics().setDepth(2)

    this.addFloor(LEVEL.book.leftFloor.x, LEVEL.book.leftFloor.y, LEVEL.book.leftFloor.w, LEVEL.book.leftFloor.h)
    this.addFloor(LEVEL.book.rightFloor.x, LEVEL.book.rightFloor.y, LEVEL.book.rightFloor.w, LEVEL.book.rightFloor.h)
    this.addFloor(1272, FLOOR_Y, LEVEL.worldW - 1272, 260)
    this.addFloor(-50, 0, 50, 900)
    this.addFloor(LEVEL.worldW, 0, 50, 900)

    const spawns = LEVEL.book.spawns
    this.pip = new Player(this, 'pip', spawns.pip, FLOOR_Y)
    this.pebble = new Player(this, 'pebble', spawns.pebble, FLOOR_Y)
    this.pip.checkpointId = 'book-l'
    this.pebble.checkpointId = 'book-l'
    this.pip.checkpoint.set(LEVEL.checkpoints[0].x, LEVEL.checkpoints[0].y)
    this.pebble.checkpoint.set(LEVEL.checkpoints[0].x, LEVEL.checkpoints[0].y)

    this.controls = new Controls(this)
    this.checkpoints = new Checkpoints(this)
    for (const flag of LEVEL.checkpoints) this.checkpoints.add(flag.id, flag.x, flag.y)

    const api: WorldApi = {
      scene: this,
      pip: this.pip,
      pebble: this.pebble,
      addSolid: (rect) => this.solids.push(rect),
      addLedge: (rect) => this.ledges.push(rect),
      addBlock: (rect) => this.blocks.push(rect),
      onRepaired: () => this.beginEnding(),
    }
    this.book = new BookGapPuzzle(api)
    this.elevator = new ElevatorPuzzle(api)
    this.workshop = new WorkshopPuzzle(api)
    this.book.create()
    this.elevator.create()
    this.workshop.create()

    this.physics.add.collider(this.pip.sprite, this.solids)
    this.physics.add.collider(this.pebble.sprite, this.solids)
    this.physics.add.collider(this.pip.sprite, this.ledges, undefined, (_player, ledge) => this.landOnLedge(this.pip, ledge))
    this.physics.add.collider(this.pebble.sprite, this.ledges, undefined, (_player, ledge) => this.landOnLedge(this.pebble, ledge))
    this.physics.add.collider(this.pip.sprite, this.blocks)
    this.physics.add.collider(this.pebble.sprite, this.blocks, undefined, () => !this.pebble.phasingBlock)

    this.cameras.main.centerOn(280, 480)
    if (!this.scene.isActive('hud')) this.scene.launch('hud')
    showToast('If you fall, you pop back. Your friend keeps their place.', 4200)
    this.publish()
  }

  update(time: number, delta: number): void {
    const dt = Math.min(delta, 48) / 1000
    this.publish()
    if (this.consumeRequests()) return

    if (session.paused) {
      this.freeze()
      return
    }
    if (this.simPaused) {
      this.simPaused = false
      this.physics.world.resume()
      this.controls.suppressUntilRelease()
    }
    if (session.complete) {
      this.pip.body.setVelocity(0, 0)
      this.pebble.body.setVelocity(0, 0)
      this.paint(time)
      return
    }

    const input = this.controls.read()
    this.pip.input = input.pip
    this.pebble.input = input.pebble
    this.pip.supported = false
    this.pebble.supported = false
    this.pip.phasingBlock = false
    this.pebble.phasingBlock = false
    this.pip.hintText = ''
    this.pebble.hintText = ''

    this.book.update(dt)
    this.elevator.update(dt)
    this.workshop.update(dt)
    this.pip.simulate(dt)
    this.pebble.simulate(dt)
    this.book.late(dt)
    this.elevator.late(dt)
    this.workshop.late(dt)
    this.applyLeash()
    this.hazards()
    this.checkpoints.update([this.pip, this.pebble])
    if (this.ending) {
      this.endingT += dt
      if (this.endingT > 1.7) session.complete = true
    }
    this.updateObjective()
    this.updateCamera(dt)
    this.paint(time)
    this.pip.prevX = this.pip.x
    this.pebble.prevX = this.pebble.x
  }

  private consumeRequests(): boolean {
    if (session.requestTitle) {
      session.requestTitle = false
      this.physics.world.resume()
      this.scene.stop('hud')
      this.scene.start('title')
      return true
    }
    if (session.requestReplay) {
      session.requestReplay = false
      this.physics.world.resume()
      this.scene.restart()
      return true
    }
    if (session.requestRestart) {
      session.requestRestart = false
      session.confirmRestart = false
      session.paused = false
      if (this.simPaused) {
        this.physics.world.resume()
        this.simPaused = false
      }
      this.restartPuzzle()
      this.controls.suppressUntilRelease()
    }
    return false
  }

  private restartPuzzle(): void {
    const mid = (this.pip.x + this.pebble.x) / 2
    if (mid < 1280) {
      this.book.reset()
      this.placePair(LEVEL.book.spawns.pip, LEVEL.book.spawns.pebble, 'book-l')
    } else if (mid < LEVEL.elevator.wallX + 30) {
      this.elevator.reset()
      this.placePair(LEVEL.elevator.spawns.pip, LEVEL.elevator.spawns.pebble, 'elev')
    } else {
      this.workshop.reset()
      this.placePair(LEVEL.workshop.spawns.pip, LEVEL.workshop.spawns.pebble, 'shop')
    }
    showToast('Puzzle restarted. The other rooms are unchanged.')
  }

  private placePair(pipX: number, pebbleX: number, flag: string): void {
    const flagY = LEVEL.checkpoints.find((item) => item.id === flag)?.y ?? FLOOR_Y
    this.pip.resetTo(pipX, flagY, flag)
    this.pebble.resetTo(pebbleX, flagY, flag)
  }

  private beginEnding(): void {
    if (this.ending) return
    this.ending = true
    this.pip.mode = 'celebrate'
    this.pebble.mode = 'celebrate'
    showToast('The bedroom glows.')
  }

  private freeze(): void {
    if (!this.simPaused) {
      this.simPaused = true
      this.pip.body.setVelocity(0, 0)
      this.pebble.body.setVelocity(0, 0)
      this.physics.world.pause()
    }
  }

  private applyLeash(): void {
    const dx = this.pip.x - this.pebble.x
    if (Math.abs(dx) <= CONFIG.leash) return
    if (dx > 0) {
      if (this.pip.mode === 'play' && this.pip.body.velocity.x > 0) {
        this.pip.body.setVelocityX(0)
        this.pip.hintText = 'Wait for Pebble'
      }
      if (this.pebble.mode === 'play' && this.pebble.body.velocity.x < 0) {
        this.pebble.body.setVelocityX(0)
        this.pebble.hintText = 'Wait for Pip'
      }
    } else {
      if (this.pip.mode === 'play' && this.pip.body.velocity.x < 0) {
        this.pip.body.setVelocityX(0)
        this.pip.hintText = 'Wait for Pebble'
      }
      if (this.pebble.mode === 'play' && this.pebble.body.velocity.x > 0) {
        this.pebble.body.setVelocityX(0)
        this.pebble.hintText = 'Wait for Pip'
      }
    }
  }

  private hazards(): void {
    const pillows = LEVEL.pillows
    for (const player of [this.pip, this.pebble]) {
      if (player.mode !== 'play') continue
      const inPillows =
        player.x > pillows.x &&
        player.x < pillows.x + pillows.w &&
        player.y > pillows.y &&
        player.y < pillows.y + pillows.h + 30
      if (player.y > LEVEL.killY || inPillows) player.triggerRespawn()
    }
  }

  private updateObjective(): void {
    const puzzle = !this.book.solved() ? this.book : !this.elevator.solved() ? this.elevator : this.workshop
    session.roomName = puzzle.name
    session.objective = puzzle.objective()
  }

  private updateCamera(dt: number): void {
    const cam = this.cameras.main
    const midX = (this.pip.x + this.pebble.x) / 2
    const aimX = this.ending ? lerp(midX, LEVEL.workshop.fireflyX, Math.min(1, this.endingT / 1.2)) : midX
    const focusY = clamp((this.pip.y + this.pebble.y) / 2 - 20, 440, 560)
    const dist = Math.abs(this.pip.x - this.pebble.x)
    const targetZoom = clamp(VIEW.width / (dist + CONFIG.camera.margin), CONFIG.camera.minZoom, 1)
    const k = settings.reducedMotion ? 1 : Math.min(1, 7 * dt)
    const zoom = settings.reducedMotion ? targetZoom : lerp(cam.zoom, targetZoom, k)
    cam.setZoom(zoom)
    const halfW = VIEW.width / (2 * zoom)
    const halfH = VIEW.height / (2 * zoom)
    const cx = clamp(aimX, halfW - 30, LEVEL.worldW - halfW + 30)
    const cy = clamp(focusY, halfH - 20, 760 - halfH)
    const scrollX = cx - halfW
    const scrollY = cy - halfH
    cam.scrollX = settings.reducedMotion ? scrollX : lerp(cam.scrollX, scrollX, k)
    cam.scrollY = settings.reducedMotion ? scrollY : lerp(cam.scrollY, scrollY, k)
  }

  private paint(time: number): void {
    this.book.paint()
    this.elevator.paint()
    this.workshop.paint(time)
    this.pip.paint(time)
    this.pebble.paint(time)
    this.glow.clear()
    const amount = Math.max(this.workshop.glowAmount(), this.ending ? Math.min(1, this.endingT / 1.3) : 0)
    if (amount > 0) {
      this.glow.fillStyle(COLORS.glow, 0.05 + amount * 0.16)
      this.glow.fillRect(-200, -200, LEVEL.worldW + 400, 1200)
    }
  }

  /** Shelves catch feet that cross the top on the way down, including a long frame. */
  private landOnLedge(player: Player, ledge: unknown): boolean {
    if (player.body.velocity.y < -30) return false
    const rect = ledge as Phaser.GameObjects.Rectangle
    const top = (rect.body as Phaser.Physics.Arcade.StaticBody).top
    const feet = player.body.bottom
    const prevFeet = player.body.prev.y + player.body.height
    const crossed = prevFeet <= top + 10 && feet >= top - 8
    const resting = Math.abs(feet - top) <= 18
    return crossed || resting
  }

  private addFloor(x: number, y: number, w: number, h: number): void {
    this.solids.push(makeSolid(this, x, y, w, h))
  }

  private publish(): void {
    publishDebug(() => ({
      scene: 'play',
      fps: Math.round(this.game.loop.actualFps),
      delta: Math.round(this.game.loop.delta),
      paused: session.paused,
      complete: session.complete,
      objective: session.objective,
      room: session.roomName,
      repair: session.repair,
      pip: this.actorState(this.pip),
      pebble: this.actorState(this.pebble),
      book: this.book.debug(),
      elevator: this.elevator.debug(),
      workshop: this.workshop.debug(),
    }))
  }

  private actorState(player: Player) {
    return {
      x: Math.round(player.x),
      y: Math.round(player.y),
      bottom: Math.round(player.body.bottom),
      vx: Math.round(player.body.velocity.x),
      vy: Math.round(player.body.velocity.y),
      grounded: player.isGrounded(),
      mode: player.mode,
      carrying: player.carrying,
      checkpoint: player.checkpointId,
    }
  }
}

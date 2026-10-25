import { audio } from '../audio'
import { COLORS, FLOOR_Y, LEVEL } from '../config'
import { paintCheck } from '../entities/sprites'
import type { Player } from '../entities/player'
import { settings } from '../settings'
import { showToast } from '../session'
import { burst } from '../effects'
import { moveToward } from '../util'
import { makeSolid, setSolid, syncStatic } from '../world/solids'
import { createBlock, tryPush, type SlideBlock } from './push'
import type { Puzzle, WorldApi } from './types'

const LAYOUT = LEVEL.elevator
type Phase = 'bottom' | 'rising' | 'top' | 'lowering'

export class ElevatorPuzzle implements Puzzle {
  readonly name = 'The Block Elevator'
  private block!: SlideBlock
  private lift!: Phaser.GameObjects.Rectangle
  private catwalk!: Phaser.GameObjects.Rectangle
  private wall!: Phaser.GameObjects.Rectangle
  private door!: Phaser.GameObjects.Rectangle
  private gfx!: Phaser.GameObjects.Graphics
  private phase: Phase = 'bottom'
  private latched = false
  private doorOpen = false
  private doorSlide = 0
  private liftY = LAYOUT.lift.bottom
  private ribbon = 0
  private rideDown = 0
  private call = 0
  private padDwell = 0
  private rescue = 0
  private needRelease = false

  constructor(private api: WorldApi) {}

  create(): void {
    const scene = this.api.scene
    const b = LAYOUT.block
    this.block = createBlock(scene, b.x, b.y, b.w, b.h, b.minX, b.maxX)
    this.api.addBlock(this.block.rect)

    const lift = LAYOUT.lift
    this.lift = makeSolid(scene, lift.x, this.liftY, lift.w, lift.h)
    setSolid(this.lift, false)
    this.api.addSolid(this.lift)

    const c = LAYOUT.catwalk
    this.catwalk = makeSolid(scene, c.x, c.y, c.w, c.h)
    this.api.addSolid(this.catwalk)

    this.wall = makeSolid(scene, LAYOUT.wallX, 0, LAYOUT.wallW, LAYOUT.doorTop)
    this.api.addSolid(this.wall)
    this.door = makeSolid(scene, LAYOUT.wallX, LAYOUT.doorTop, LAYOUT.wallW, FLOOR_Y - LAYOUT.doorTop)
    this.api.addSolid(this.door)

    this.gfx = scene.add.graphics().setDepth(4)
  }

  update(dt: number): void {
    this.updateLatch()
    this.updateCall(dt)
    this.updateRibbon(dt)
    this.updateRideDown(dt)
    this.updateRescue(dt)
    this.moveLift(dt)
    this.carryRiders()
    this.nudgeClear(dt)
    if (this.doorOpen) {
      const goal = settings.reducedMotion ? 1 : Math.min(1, this.doorSlide + dt / 0.55)
      this.doorSlide = goal
    }
  }

  late(dt: number): void {
    tryPush(this.block, this.api.pebble, this.api.pip, dt)
    if (!this.block.locked && this.nearBlock(this.api.pebble) && !this.api.pebble.input.abilityHeld) {
      this.api.pebble.hintText = this.api.pebble.hintText || 'Hold Enter to push'
    }
    if (!this.block.locked && this.nearBlock(this.api.pip)) {
      this.api.pip.hintText = this.api.pip.hintText || 'Pebble can push this'
    } else if (this.block.locked && this.nearBlock(this.api.pip)) {
      this.api.pip.hintText = this.api.pip.hintText || 'Jump over'
    }
  }

  reset(): void {
    const b = LAYOUT.block
    this.block.rect.x = b.x
    this.block.locked = false
    syncStatic(this.block.rect)
    this.phase = 'bottom'
    this.latched = false
    this.doorOpen = false
    this.doorSlide = 0
    this.liftY = LAYOUT.lift.bottom
    this.ribbon = 0
    this.rideDown = 0
    this.call = 0
    this.padDwell = 0
    this.rescue = 0
    this.needRelease = false
    this.lift.y = this.liftY
    setSolid(this.lift, false)
    setSolid(this.door, true)
    syncStatic(this.door)
  }

  solved(): boolean {
    return this.doorOpen
  }

  objective(): string {
    if (this.doorOpen) return 'The door is open. Ride the lift down and go through together.'
    if (this.latched) return 'Pip, ride the lift. At the top, hold E on the ribbon.'
    return 'Pebble, hold Enter and walk into the block until it sits on the square pad.'
  }

  debug(): Record<string, unknown> {
    return {
      latched: this.latched,
      phase: this.phase,
      liftY: this.liftY,
      doorOpen: this.doorOpen,
      ribbon: this.ribbon,
      solved: this.solved(),
      blockX: this.block.rect.x,
    }
  }

  private updateLatch(): void {
    if (this.latched) return
    const center = this.block.rect.x + this.block.w / 2
    if (Math.abs(center - LAYOUT.plateX) <= 34) {
      this.latched = true
      this.block.locked = true
      audio.success()
      burst(this.api.scene, LAYOUT.plateX, FLOOR_Y - 10, COLORS.good)
      showToast('The lift has power.')
    }
  }

  private updateCall(dt: number): void {
    if (!this.latched || (this.phase !== 'bottom' && this.phase !== 'top')) {
      this.call = Math.max(0, this.call - dt)
      return
    }
    const caller = [this.api.pip, this.api.pebble].find((p) => this.inCall(p) && p.input.abilityHeld)
    if (!caller) {
      this.call = Math.max(0, this.call - dt / 0.4)
      return
    }
    if (!this.latched) return
    caller.hintText = caller.hintText || (this.phase === 'bottom' ? 'Hold to send the lift up' : 'Hold to call the lift down')
    const need = caller.assist() ? 0.28 : 0.42
    this.call += dt / need
    if (this.call >= 1) {
      this.call = 0
      audio.click()
      if (this.phase === 'bottom') this.launchUp()
      else this.phase = 'lowering'
    }
  }

  private updateRibbon(dt: number): void {
    if (this.doorOpen) return
    const pip = this.api.pip
    const pad = pip.tune().pad
    const near =
      pip.mode === 'play' &&
      pip.isGrounded() &&
      Math.abs(pip.y - LAYOUT.catwalk.y) < 34 &&
      Math.abs(pip.x - LAYOUT.ribbonX) < 68 + pad
    if (near && pip.input.abilityHeld) {
      pip.hintText = 'Hold E'
      const need = pip.assist() ? 0.42 : 0.72
      this.ribbon = Math.min(1, this.ribbon + dt / need)
      if (this.ribbon >= 1) this.openDoor()
    } else if (near) {
      pip.hintText = 'Hold E on the ribbon'
      this.ribbon = Math.max(0, this.ribbon - dt / 0.45)
    } else {
      this.ribbon = Math.max(0, this.ribbon - dt / 0.45)
    }
  }

  private updateRideDown(dt: number): void {
    if (this.phase !== 'top' || !this.doorOpen) {
      this.rideDown = 0
      return
    }
    const rider = [this.api.pip, this.api.pebble].find((p) => this.onLift(p))
    if (!rider) {
      this.rideDown = Math.max(0, this.rideDown - dt)
      this.needRelease = false
      return
    }
    if (!rider.input.abilityHeld) this.needRelease = false
    const inRibbon = Math.abs(rider.x - LAYOUT.ribbonX) < 68 + rider.tune().pad
    if (rider.input.abilityHeld && !this.needRelease && !inRibbon) {
      rider.hintText = rider.hintText || 'Hold to ride down'
      const need = rider.assist() ? 0.24 : 0.36
      this.rideDown += dt / need
      if (this.rideDown >= 1) {
        this.rideDown = 0
        this.phase = 'lowering'
        audio.click()
      }
    } else {
      if (this.doorOpen && !rider.input.abilityHeld && !inRibbon) {
        rider.hintText = rider.hintText || 'Hold your ability to ride down'
      }
      this.rideDown = Math.max(0, this.rideDown - dt / 0.3)
    }
  }

  private updateRescue(dt: number): void {
    const someoneUp = this.onCatwalk(this.api.pip) || this.onCatwalk(this.api.pebble)
    const someoneDown = this.onLowerFloor(this.api.pip) || this.onLowerFloor(this.api.pebble)
    if (this.latched && this.phase === 'bottom' && someoneUp && !someoneDown) this.rescue += dt
    else this.rescue = 0
    if (this.rescue > 1.1) {
      this.rescue = 0
      this.launchUp()
    }

    if (this.phase === 'bottom' && this.latched) {
      const waiting = [this.api.pip, this.api.pebble].some((p) => this.onPad(p))
      this.padDwell = waiting ? this.padDwell + dt : 0
      if (this.padDwell > 0.28) {
        this.padDwell = 0
        this.launchUp()
      } else if (waiting) {
        const who = [this.api.pip, this.api.pebble].find((p) => this.onPad(p))
        if (who && !who.hintText) who.hintText = 'Step on — the lift will rise'
      }
    } else {
      this.padDwell = 0
    }
  }

  private launchUp(): void {
    if (this.phase !== 'bottom') return
    this.phase = 'rising'
    this.liftY = FLOOR_Y - 1
    this.lift.y = this.liftY
    setSolid(this.lift, true)
    syncStatic(this.lift)
    for (const p of [this.api.pip, this.api.pebble]) {
      if (this.onPad(p)) {
        p.place(p.x, this.liftY, p.body.velocity.x, 0)
        p.supported = true
      }
    }
    audio.click()
  }

  private moveLift(dt: number): void {
    const speed = 150
    if (this.phase === 'rising') {
      this.liftY = moveToward(this.liftY, LAYOUT.lift.top, speed * dt)
      if (this.liftY <= LAYOUT.lift.top + 0.4) {
        this.liftY = LAYOUT.lift.top
        this.phase = 'top'
        this.needRelease = [this.api.pip, this.api.pebble].some((p) => this.onLift(p) && p.input.abilityHeld)
      }
    } else if (this.phase === 'lowering') {
      this.liftY = moveToward(this.liftY, LAYOUT.lift.bottom, speed * dt)
      if (this.liftY >= LAYOUT.lift.bottom - 0.4) {
        this.liftY = LAYOUT.lift.bottom
        this.phase = 'bottom'
        setSolid(this.lift, false)
      }
    }
    this.lift.y = this.liftY
    if (this.phase !== 'bottom') syncStatic(this.lift)
  }

  private carryRiders(): void {
    if (this.phase === 'bottom') return
    const lift = LAYOUT.lift
    for (const p of [this.api.pip, this.api.pebble]) {
      if (p.mode !== 'play' || p.body.velocity.y < -20) continue
      // Scene update runs before the sprite receives this frame's physics move.
      // Nudge the body, and let postUpdate carry that delta onto the sprite.
      const x = p.body.x + p.body.width * 0.5
      if (x <= lift.x + 6 || x >= lift.x + lift.w - 6) continue
      const bottom = p.body.bottom
      if (bottom < this.liftY - 18 || bottom > this.liftY + 24) continue
      p.body.y += this.liftY - bottom
      p.body.setVelocityY(0)
      p.supported = true
    }
  }

  private nudgeClear(dt: number): void {
    if (this.phase !== 'rising' && this.phase !== 'lowering') return
    const lift = LAYOUT.lift
    for (const p of [this.api.pip, this.api.pebble]) {
      if (Math.abs(p.y - this.liftY) <= 18) continue
      if (!this.horizOnLift(p)) continue
      const head = p.y - p.height
      if (head < this.liftY + lift.h && p.y > this.liftY) {
        const dir = p.x < lift.x + lift.w / 2 ? -1 : 1
        p.place(p.x + dir * 180 * dt, p.y, p.body.velocity.x, p.body.velocity.y)
      }
    }
  }

  private openDoor(): void {
    if (this.doorOpen) return
    this.doorOpen = true
    this.doorSlide = settings.reducedMotion ? 1 : 0.01
    setSolid(this.door, false)
    audio.success()
    burst(this.api.scene, LAYOUT.wallX + 20, FLOOR_Y - 80, COLORS.bookYellow)
    showToast('The bookcase door is open.')
  }

  private onPad(p: Player): boolean {
    return p.mode === 'play' && p.isGrounded() && Math.abs(p.y - FLOOR_Y) < 22 && this.horizOnLift(p)
  }

  private onLift(p: Player): boolean {
    return p.mode === 'play' && this.horizOnLift(p) && Math.abs(p.y - this.liftY) < 22
  }

  private horizOnLift(p: Player): boolean {
    const lift = LAYOUT.lift
    return p.x > lift.x + 6 && p.x < lift.x + lift.w - 6
  }

  private onCatwalk(p: Player): boolean {
    const c = LAYOUT.catwalk
    return p.mode !== 'respawn' && p.y < 420 && p.x > c.x - 10 && p.x < c.x + c.w + 8
  }

  private onLowerFloor(p: Player): boolean {
    return p.mode !== 'respawn' && p.y > 540 && p.x > 1280 && p.x < LAYOUT.wallX - 10
  }

  private inCall(p: Player): boolean {
    return (
      p.mode === 'play' &&
      p.isGrounded() &&
      Math.abs(p.y - FLOOR_Y) < 28 &&
      Math.abs(p.x - LAYOUT.callX) < 54 + p.tune().pad
    )
  }

  private nearBlock(p: Player): boolean {
    const center = this.block.rect.x + this.block.w / 2
    return p.mode === 'play' && Math.abs(p.y - FLOOR_Y) < 30 && Math.abs(p.x - center) < this.block.w
  }

  paint(): void {
    const g = this.gfx
    g.clear()
    this.drawBlock()
    this.drawPad()
    this.drawCall()
    this.drawLift()
    this.drawCatwalk()
    this.drawRibbon()
    this.drawWall()
  }

  private drawBlock(): void {
    const g = this.gfx
    const r = this.block.rect
    g.fillStyle(0xe0b07a, 1)
    g.fillRoundedRect(r.x, r.y, r.width, r.height, 8)
    g.lineStyle(3, 0x8a5a32, 1)
    g.strokeRoundedRect(r.x, r.y, r.width, r.height, 8)
    g.fillStyle(0xc9843e, 1)
    g.fillRect(r.x + 10, r.y + 18, r.width - 20, 8)
    g.fillRect(r.x + 10, r.y + 40, r.width - 20, 8)
    // Arrow and circle show that Pebble pushes it.
    g.fillStyle(COLORS.pebble, 1)
    g.fillCircle(r.x + r.width / 2, r.y + 62, 8)
    g.fillStyle(COLORS.ink, 1)
    g.fillTriangle(r.x + r.width - 16, r.y + 28, r.x + r.width - 16, r.y + 44, r.x + r.width - 4, r.y + 36)
  }

  private drawPad(): void {
    const g = this.gfx
    const x = LAYOUT.plateX
    g.fillStyle(this.latched ? COLORS.good : 0xd7a15a, 1)
    g.fillRoundedRect(x - 34, FLOOR_Y - 10, 68, 14, 4)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeRoundedRect(x - 34, FLOOR_Y - 10, 68, 14, 4)
    g.strokeRect(x - 10, FLOOR_Y - 40, 20, 20)
    if (this.latched) paintCheck(g, x + 26, FLOOR_Y - 36)
  }

  private drawCall(): void {
    const g = this.gfx
    const x = LAYOUT.callX
    g.fillStyle(0x3c6e99, 1)
    g.fillRoundedRect(x - 16, FLOOR_Y - 48, 32, 48, 6)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeRoundedRect(x - 16, FLOOR_Y - 48, 32, 48, 6)
    g.fillStyle(COLORS.cream, 1)
    g.fillTriangle(x, FLOOR_Y - 38, x - 8, FLOOR_Y - 26, x + 8, FLOOR_Y - 26)
    g.fillTriangle(x, FLOOR_Y - 12, x - 8, FLOOR_Y - 24, x + 8, FLOOR_Y - 24)
    meter(g, x, FLOOR_Y - 70, this.call)
  }

  private drawLift(): void {
    const g = this.gfx
    const lift = LAYOUT.lift
    g.fillStyle(0xf6d7a8, 0.7)
    g.fillRect(lift.x + 8, LAYOUT.lift.top, lift.w - 16, FLOOR_Y - LAYOUT.lift.top)
    const y = this.phase === 'bottom' ? FLOOR_Y - lift.h : this.liftY
    g.fillStyle(0xc9843e, 1)
    g.fillRoundedRect(lift.x, y, lift.w, lift.h + 4, 6)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeRoundedRect(lift.x, y, lift.w, lift.h + 4, 6)
    if (this.latched && this.phase === 'bottom') {
      g.fillStyle(COLORS.good, 1)
      g.fillTriangle(lift.x + lift.w / 2, FLOOR_Y - 36, lift.x + lift.w / 2 - 10, FLOOR_Y - 20, lift.x + lift.w / 2 + 10, FLOOR_Y - 20)
    }
    if (this.phase === 'top') meter(g, lift.x + lift.w / 2, this.liftY - 28, this.rideDown)
  }

  private drawCatwalk(): void {
    const g = this.gfx
    const c = LAYOUT.catwalk
    g.fillStyle(0xe0b07a, 1)
    g.fillRect(c.x, c.y, c.w, c.h)
    g.lineStyle(3, 0x8a5a32, 1)
    g.strokeRect(c.x, c.y, c.w, c.h)
    g.fillRect(c.x + 20, c.y, 6, 80)
    g.fillRect(c.x + c.w - 30, c.y, 6, 70)
  }

  private drawRibbon(): void {
    const g = this.gfx
    const x = LAYOUT.ribbonX
    const y = LAYOUT.catwalk.y
    g.fillStyle(COLORS.bookRed, 1)
    g.fillRoundedRect(x - 8, y - 46, 16, 46, 4)
    g.fillCircle(x, y - 52, 8)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeCircle(x, y - 52, 8)
    meter(g, x, y - 78, this.doorOpen ? 1 : this.ribbon)
    if (this.doorOpen) paintCheck(g, x + 24, y - 48)
  }

  private drawWall(): void {
    const g = this.gfx
    const x = LAYOUT.wallX
    g.fillStyle(COLORS.bookBlue, 1)
    g.fillRect(x, 80, LAYOUT.wallW, LAYOUT.doorTop - 80)
    g.fillStyle(COLORS.bookGreen, 1)
    g.fillRect(x + 8, 100, LAYOUT.wallW - 16, 70)
    g.fillStyle(COLORS.bookYellow, 1)
    g.fillRect(x + 8, 180, LAYOUT.wallW - 16, 70)
    g.fillStyle(COLORS.bookRed, 1)
    g.fillRect(x + 8, 260, LAYOUT.wallW - 16, 70)
    const doorH = FLOOR_Y - LAYOUT.doorTop
    const slide = this.doorSlide * doorH
    g.fillStyle(0xf4d7a2, 1)
    g.fillRoundedRect(x + 6, LAYOUT.doorTop - slide, LAYOUT.wallW - 12, doorH, 6)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeRoundedRect(x + 6, LAYOUT.doorTop - slide, LAYOUT.wallW - 12, doorH, 6)
    if (!this.doorOpen) {
      g.fillStyle(COLORS.pebble, 1)
      g.fillCircle(x + 44, LAYOUT.doorTop + doorH / 2, 6)
    } else {
      paintCheck(g, x + 32, FLOOR_Y - 70)
    }
  }
}

function meter(g: Phaser.GameObjects.Graphics, x: number, y: number, t: number): void {
  if (t <= 0) return
  for (let i = 0; i < 4; i++) {
    const filled = t >= (i + 1) / 4 - 0.01
    g.fillStyle(filled ? COLORS.good : COLORS.cream, 1)
    g.fillCircle(x + (i - 1.5) * 14, y, 5)
    g.lineStyle(2, COLORS.ink, 1)
    g.strokeCircle(x + (i - 1.5) * 14, y, 5)
  }
}

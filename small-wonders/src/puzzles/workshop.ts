import { audio } from '../audio'
import { COLORS, CONFIG, FLOOR_Y, LEVEL } from '../config'
import { paintCheck, paintCog, paintFirefly, paintLens } from '../entities/sprites'
import type { Player } from '../entities/player'
import { settings } from '../settings'
import { session, showToast } from '../session'
import { burst } from '../effects'
import { createBlock, tryPush, type SlideBlock } from './push'
import { makeSolid, syncStatic } from '../world/solids'
import type { Puzzle, WorldApi } from './types'

const LAYOUT = LEVEL.workshop

export class WorkshopPuzzle implements Puzzle {
  readonly name = 'The Firefly Workshop'
  private block!: SlideBlock
  private gfx!: Phaser.GameObjects.Graphics
  private lensTaken = false
  private cogTaken = false
  private lensIn = false
  private cogIn = false
  private progress = 0
  private decayWait = 0
  private ticks = 0
  private done = false

  constructor(private api: WorldApi) {}

  create(): void {
    const scene = this.api.scene
    const step = LAYOUT.lensStep
    const shelf = LAYOUT.lensShelf
    const socketStep = LAYOUT.socketStep
    const socket = LAYOUT.lensSocket
    for (const box of [step, shelf, socketStep, socket]) {
      this.api.addSolid(makeSolid(scene, box.x, box.y, box.w, box.h))
    }
    const b = LAYOUT.block
    this.block = createBlock(scene, b.x, b.y, b.w, b.h, b.minX, b.maxX)
    this.api.addBlock(this.block.rect)
    this.gfx = scene.add.graphics().setDepth(3)
  }

  update(dt: number): void {
    const { pip, pebble } = this.api
    this.collect(pip, pebble)
    this.install(pip, pebble)
    this.repair(dt, pip, pebble)
  }

  late(dt: number): void {
    if (this.cogTaken) return
    tryPush(this.block, this.api.pebble, this.api.pip, dt)
    if (this.cogCovered() && this.nearBlock(this.api.pebble) && !this.api.pebble.input.abilityHeld) {
      this.api.pebble.hintText = this.api.pebble.hintText || 'Hold Enter to push'
    }
  }

  reset(): void {
    const b = LAYOUT.block
    this.block.rect.x = b.x
    this.block.locked = false
    syncStatic(this.block.rect)
    this.lensTaken = false
    this.cogTaken = false
    this.lensIn = false
    this.cogIn = false
    this.progress = 0
    this.decayWait = 0
    this.ticks = 0
    this.done = false
    if (this.api.pip.carrying === 'lens') this.api.pip.clearCarry()
    if (this.api.pebble.carrying === 'cog') this.api.pebble.clearCarry()
    session.repair = -1
    session.pipHolding = false
    session.pebbleHolding = false
  }

  solved(): boolean {
    return this.done
  }

  objective(): string {
    if (this.done) return 'The firefly is glowing.'
    if (this.lensIn && this.cogIn) return 'Both hold your ability buttons to mend the firefly. You can start at different moments.'
    if (this.lensIn || this.cogIn) return 'One piece is in. Carry the other to the socket with the same shape.'
    return 'Pip, jump up for the teal lens. Pebble, push the block aside and take the amber cog.'
  }

  debug(): Record<string, unknown> {
    return {
      lensTaken: this.lensTaken,
      cogTaken: this.cogTaken,
      lensIn: this.lensIn,
      cogIn: this.cogIn,
      progress: this.progress,
      solved: this.done,
      cogCovered: this.cogCovered(),
      blockX: this.block.rect.x,
    }
  }

  glowAmount(): number {
    if (this.done) return 1
    if (this.lensIn && this.cogIn) return 0.25 + this.progress * 0.5
    return this.lensIn || this.cogIn ? 0.12 : 0
  }

  private collect(pip: Player, pebble: Player): void {
    if (!this.lensTaken && pip.mode === 'play' && pip.carrying !== 'lens' && this.onLensShelf(pip)) {
      pip.carrying = 'lens'
      this.lensTaken = true
      audio.click()
      burst(this.api.scene, LAYOUT.lensX, LAYOUT.lensShelf.y - 16, COLORS.pip)
      showToast('Pip has the lens.')
    } else if (!this.lensTaken && pebble.mode === 'play' && this.onLensShelf(pebble)) {
      pebble.hintText = pebble.hintText || 'Pip can carry this lens'
    } else if (!this.lensTaken && pip.mode === 'play' && Math.abs(pip.x - LAYOUT.lensX) < 120 && pip.y > LAYOUT.lensShelf.y + 40) {
      pip.hintText = pip.hintText || 'Jump up for the lens'
    }

    if (!this.cogTaken && !this.cogCovered() && pebble.mode === 'play' && pebble.carrying !== 'cog' && this.nearCog(pebble)) {
      pebble.carrying = 'cog'
      this.cogTaken = true
      audio.click()
      burst(this.api.scene, LAYOUT.cogX, FLOOR_Y - 20, COLORS.pebble)
      showToast('Pebble has the cog.')
    } else if (!this.cogTaken && !this.cogCovered() && pip.mode === 'play' && this.nearCog(pip)) {
      pip.hintText = pip.hintText || 'Pebble can carry this cog'
    }
  }

  private install(pip: Player, pebble: Player): void {
    if (!this.lensIn && pip.carrying === 'lens' && this.onLensSocket(pip)) {
      pip.clearCarry()
      this.lensIn = true
      audio.success()
      burst(this.api.scene, LAYOUT.lensSocketX, LAYOUT.lensSocket.y - 10, COLORS.pip)
      showToast('The lens is in its socket.')
    } else if (pip.carrying === 'lens' && this.nearCogSocket(pip)) {
      pip.hintText = 'That socket wants the cog'
    }

    if (!this.cogIn && pebble.carrying === 'cog' && this.nearCogSocket(pebble)) {
      pebble.clearCarry()
      this.cogIn = true
      audio.success()
      burst(this.api.scene, LAYOUT.cogSocketX, FLOOR_Y - 10, COLORS.pebble)
      showToast('The cog is in its socket.')
    } else if (pebble.carrying === 'cog' && this.onLensSocket(pebble)) {
      pebble.hintText = 'That socket wants the lens'
    }
  }

  private repair(dt: number, pip: Player, pebble: Player): void {
    if (this.done) {
      session.repair = 1
      session.pipHolding = false
      session.pebbleHolding = false
      return
    }
    if (!this.lensIn || !this.cogIn) {
      session.repair = -1
      session.pipHolding = false
      session.pebbleHolding = false
      return
    }
    const inRoom = (p: Player) => p.x >= LAYOUT.startX && p.mode === 'play'
    const bothIn = inRoom(pip) && inRoom(pebble)
    const holding = bothIn && pip.input.abilityHeld && pebble.input.abilityHeld
    session.repair = this.progress
    session.pipHolding = bothIn && pip.input.abilityHeld
    session.pebbleHolding = bothIn && pebble.input.abilityHeld
    if (bothIn && !pip.hintText) pip.hintText = pip.input.abilityHeld ? 'Holding' : 'Hold E'
    if (bothIn && !pebble.hintText) pebble.hintText = pebble.input.abilityHeld ? 'Holding' : 'Hold Enter'

    const assisted = settings.pipAssist || settings.pebbleAssist
    const duration = assisted ? CONFIG.repair.assistedSeconds : CONFIG.repair.seconds
    if (holding) {
      this.decayWait = CONFIG.repair.decayDelay
      this.progress = Math.min(1, this.progress + dt / duration)
      const marks = Math.floor(this.progress * 8)
      if (marks > this.ticks) {
        this.ticks = marks
        audio.tick()
      }
      if (this.progress >= 1) {
        this.done = true
        session.repair = 1
        audio.fanfare()
        burst(this.api.scene, LAYOUT.fireflyX, FLOOR_Y - 150, COLORS.glow)
        this.api.onRepaired()
      }
    } else {
      this.decayWait -= dt
      if (this.decayWait <= 0) this.progress = Math.max(0, this.progress - CONFIG.repair.decay * dt)
    }
  }

  private onLensShelf(p: Player): boolean {
    const s = LAYOUT.lensShelf
    return p.isGrounded() && p.x > s.x && p.x < s.x + s.w && Math.abs(p.y - s.y) < 22
  }

  private onLensSocket(p: Player): boolean {
    const s = LAYOUT.lensSocket
    return p.isGrounded() && p.x > s.x - 8 && p.x < s.x + s.w + 8 && Math.abs(p.y - s.y) < 24
  }

  private nearCog(p: Player): boolean {
    return p.isGrounded() && Math.abs(p.y - FLOOR_Y) < 24 && Math.abs(p.x - LAYOUT.cogX) < 42 + p.tune().pad
  }

  private nearCogSocket(p: Player): boolean {
    return p.isGrounded() && Math.abs(p.y - FLOOR_Y) < 24 && Math.abs(p.x - LAYOUT.cogSocketX) < 48 + p.tune().pad
  }

  private cogCovered(): boolean {
    const left = this.block.rect.x
    const right = left + this.block.w
    return left < LAYOUT.cogX + 16 && right > LAYOUT.cogX - 16
  }

  private nearBlock(p: Player): boolean {
    const center = this.block.rect.x + this.block.w / 2
    return Math.abs(p.y - FLOOR_Y) < 30 && Math.abs(p.x - center) < this.block.w
  }

  paint(time: number): void {
    const g = this.gfx
    g.clear()
    this.drawPlatform(LAYOUT.lensStep, COLORS.bookBlue)
    this.drawPlatform(LAYOUT.lensShelf, COLORS.bookBlue)
    this.drawPlatform(LAYOUT.socketStep, COLORS.bookGreen)
    this.drawPlatform(LAYOUT.lensSocket, COLORS.bookGreen)
    this.drawBlock()
    if (!this.lensTaken) paintLens(g, LAYOUT.lensX, LAYOUT.lensShelf.y - 22, 1.3)
    if (!this.cogTaken && !this.cogCovered()) paintCog(g, LAYOUT.cogX, FLOOR_Y - 28, 1.4)
    paintFirefly(g, LAYOUT.fireflyX, FLOOR_Y - 168, this.glowAmount(), this.done, time / 1000, settings.reducedMotion)
    this.drawSocket(LAYOUT.cogSocketX, FLOOR_Y - 8, 'cog', this.cogIn)
    this.drawSocket(LAYOUT.lensSocketX, LAYOUT.lensSocket.y - 8, 'lens', this.lensIn)
    if (this.lensIn && this.cogIn && !this.done) {
      meter(g, LAYOUT.fireflyX, FLOOR_Y - 250, this.progress)
    }
  }

  private drawPlatform(box: { x: number; y: number; w: number; h: number }, color: number): void {
    const g = this.gfx
    g.fillStyle(color, 1)
    g.fillRoundedRect(box.x, box.y, box.w, box.h + 10, 4)
    g.lineStyle(3, COLORS.ink, 0.45)
    g.strokeRoundedRect(box.x, box.y, box.w, box.h + 10, 4)
  }

  private drawBlock(): void {
    const g = this.gfx
    const r = this.block.rect
    g.fillStyle(0xe0b07a, 1)
    g.fillRoundedRect(r.x, r.y, r.width, r.height, 8)
    g.lineStyle(3, 0x8a5a32, 1)
    g.strokeRoundedRect(r.x, r.y, r.width, r.height, 8)
    g.fillStyle(COLORS.pebble, 1)
    g.fillCircle(r.x + r.width / 2, r.y + r.height / 2, 10)
    g.fillStyle(COLORS.ink, 1)
    g.fillTriangle(r.x + r.width - 18, r.y + 24, r.x + r.width - 18, r.y + 42, r.x + r.width - 4, r.y + 33)
  }

  private drawSocket(x: number, y: number, kind: 'lens' | 'cog', filled: boolean): void {
    const g = this.gfx
    g.lineStyle(4, kind === 'lens' ? COLORS.pipDeep : COLORS.pebbleDeep, 1)
    if (kind === 'lens') {
      g.strokeTriangle(x, y - 18, x - 14, y, x + 14, y)
      g.strokeTriangle(x, y + 18, x - 14, y, x + 14, y)
    } else {
      g.strokeCircle(x, y, 16)
    }
    if (filled) {
      if (kind === 'lens') paintLens(g, x, y, 1.1)
      else paintCog(g, x, y, 1.15)
      paintCheck(g, x + 22, y - 8)
    }
  }
}

function meter(g: Phaser.GameObjects.Graphics, x: number, y: number, t: number): void {
  for (let i = 0; i < 8; i++) {
    const filled = t >= (i + 1) / 8 - 0.001
    g.fillStyle(filled ? COLORS.glow : COLORS.cream, 1)
    g.fillCircle(x + (i - 3.5) * 16, y, 6)
    g.lineStyle(2, COLORS.ink, 1)
    g.strokeCircle(x + (i - 3.5) * 16, y, 6)
  }
}

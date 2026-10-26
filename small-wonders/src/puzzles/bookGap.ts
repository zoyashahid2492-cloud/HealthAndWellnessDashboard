import { audio } from '../audio'
import { COLORS, FLOOR_Y, LEVEL } from '../config'
import { paintBridge, paintCheck } from '../entities/sprites'
import { settings } from '../settings'
import { showToast } from '../session'
import { burst } from '../effects'
import { makeSolid, setSolid, syncStatic } from '../world/solids'
import type { Puzzle, WorldApi } from './types'

const LAYOUT = LEVEL.book

export class BookGapPuzzle implements Puzzle {
  readonly name = 'The Book Gap'
  private bridge!: Phaser.GameObjects.Rectangle
  private book!: Phaser.GameObjects.Rectangle
  private gfx!: Phaser.GameObjects.Graphics
  private bridging = false
  private faceLeft = true
  private hold = 0
  private extra = 0
  private wobble = 0
  private plate = 0
  private latched = false
  private bookY = FLOOR_Y + 200

  constructor(private api: WorldApi) {}

  create(): void {
    const span = LAYOUT.bridge
    this.bridge = makeSolid(this.api.scene, span.x, FLOOR_Y, span.w, 30)
    setSolid(this.bridge, false)
    this.api.addSolid(this.bridge)

    this.book = makeSolid(this.api.scene, span.x - 4, this.bookY, span.w + 8, 56)
    setSolid(this.book, false)
    this.api.addSolid(this.book)
    this.gfx = this.api.scene.add.graphics().setDepth(4)
  }

  update(dt: number): void {
    const { pip, pebble } = this.api
    const pad = pip.tune().pad
    const engage = pip.assist() ? 0.04 : 0.09

    if (this.bridging) {
      this.wobble += dt * 7
      const left = LAYOUT.bridge.x
      const right = left + LAYOUT.bridge.w
      if (pip.input.abilityHeld && pip.mode === 'bridge') {
        this.extra = 0
      } else if (pebbleOnBridge(pebble, left, right)) {
        this.extra += dt
        pebble.hintText = pebble.hintText || 'Keep crossing'
        if (this.extra > 2.6) this.releaseBridge()
      } else {
        this.releaseBridge()
      }
    } else if (pip.mode === 'play' && pip.isGrounded() && pip.input.abilityHeld) {
      const side = this.nearAnchor(pip.x, pip.y, pad)
      if (side) {
        this.hold += dt
        pip.hintText = 'Hold E'
        if (this.hold >= engage) this.startBridge(side)
      } else {
        this.hold = 0
      }
    } else {
      this.hold = 0
      const side = pip.mode === 'play' ? this.nearAnchor(pip.x, pip.y, pad) : null
      if (side) pip.hintText = 'Hold E to bridge'
    }

    this.updatePlate(dt)
    this.updateBook(dt)
  }

  late(_dt: number): void {
    void _dt
  }

  reset(): void {
    this.api.pip.endBridge()
    this.bridging = false
    this.hold = 0
    this.extra = 0
    this.plate = 0
    this.latched = false
    this.bookY = FLOOR_Y + 200
    setSolid(this.bridge, false)
    this.book.y = this.bookY
    setSolid(this.book, false)
  }

  solved(): boolean {
    return this.latched && this.bookY <= FLOOR_Y + 1
  }

  objective(): string {
    if (this.solved()) return 'The book is across the gap. Head toward the wooden blocks.'
    if (!this.latched && this.pebbleAcross()) return 'Pebble, stand on the round button.'
    return 'Pip, hold E on a blue anchor to become a bridge.'
  }

  debug(): Record<string, unknown> {
    return { bridging: this.bridging, latched: this.latched, bookY: this.bookY, solved: this.solved() }
  }

  private pebbleAcross(): boolean {
    return this.api.pebble.x > LAYOUT.rightFloor.x + 20 && this.api.pebble.y < FLOOR_Y + 30
  }

  private nearAnchor(x: number, y: number, pad: number): 'l' | 'r' | null {
    if (Math.abs(y - FLOOR_Y) > 28) return null
    const range = 78 + pad
    if (Math.abs(x - LAYOUT.anchorL) <= range) return 'l'
    if (Math.abs(x - LAYOUT.anchorR) <= range) return 'r'
    return null
  }

  private startBridge(side: 'l' | 'r'): void {
    const x = side === 'l' ? LAYOUT.anchorL : LAYOUT.anchorR
    this.faceLeft = side === 'l'
    this.bridging = true
    this.extra = 0
    this.hold = 0
    this.bridge.y = FLOOR_Y
    setSolid(this.bridge, true)
    syncStatic(this.bridge)
    this.api.pip.beginBridge(x, FLOOR_Y)
    audio.bridge()
  }

  private releaseBridge(): void {
    this.bridging = false
    this.extra = 0
    setSolid(this.bridge, false)
    this.api.pip.endBridge()
  }

  private updatePlate(dt: number): void {
    if (this.latched) return
    const pebble = this.api.pebble
    const pip = this.api.pip
    const pad = pebble.tune().pad
    const on =
      pebble.mode === 'play' &&
      pebble.isGrounded() &&
      Math.abs(pebble.y - FLOOR_Y) < 24 &&
      Math.abs(pebble.x - LAYOUT.plateX) < 52 + pad
    if (on) {
      pebble.hintText = pebble.hintText || 'Standing'
      const need = pebble.assist() ? 0.22 : 0.38
      this.plate = Math.min(1, this.plate + dt / need)
      if (this.plate >= 1) {
        this.latched = true
        this.bookY = FLOOR_Y + 180
        this.book.y = this.bookY
        setSolid(this.book, true)
        syncStatic(this.book)
        audio.success()
        burst(this.api.scene, LAYOUT.plateX, FLOOR_Y - 20, COLORS.good)
        showToast('A picture book rises into the gap.')
      }
    } else {
      this.plate = Math.max(0, this.plate - dt / 0.35)
      const pipOn =
        pip.mode === 'play' && Math.abs(pip.x - LAYOUT.plateX) < 52 + pip.tune().pad && Math.abs(pip.y - FLOOR_Y) < 24
      if (pipOn && !on) pip.hintText = 'Pebble can press this'
    }
  }

  private updateBook(dt: number): void {
    if (!this.latched || this.bookY <= FLOOR_Y) return
    const speed = settings.reducedMotion ? 900 : 280
    this.bookY = Math.max(FLOOR_Y, this.bookY - speed * dt)
    this.book.y = this.bookY
    syncStatic(this.book)
    if (this.bookY <= FLOOR_Y) burst(this.api.scene, LAYOUT.bridge.x + LAYOUT.bridge.w / 2, FLOOR_Y - 20, COLORS.bookRed)
  }

  paint(): void {
    const g = this.gfx
    g.clear()
    this.drawAnchor(LAYOUT.anchorL, this.nearAnchor(this.api.pip.x, this.api.pip.y, this.api.pip.tune().pad) === 'l' || this.bridging)
    this.drawAnchor(LAYOUT.anchorR, this.nearAnchor(this.api.pip.x, this.api.pip.y, this.api.pip.tune().pad) === 'r' || this.bridging)
    if (!this.bridging && !this.solved()) {
      g.lineStyle(3, 0x2a6fbf, 0.7)
      const y = FLOOR_Y - 18
      for (let x = LAYOUT.bridge.x; x < LAYOUT.bridge.x + LAYOUT.bridge.w; x += 18) {
        g.lineBetween(x, y, x + 8, y)
      }
    }
    if (this.bridging) {
      paintBridge(g, LAYOUT.bridge.x, LAYOUT.bridge.x + LAYOUT.bridge.w, FLOOR_Y, this.wobble, this.faceLeft)
    }
    this.drawPlate()
    if (this.latched) this.drawBook()
    this.drawPillows()
  }

  private drawAnchor(x: number, hot: boolean): void {
    const g = this.gfx
    const pulse = hot ? 1 : 0.75 + Math.sin(performance.now() / 280) * 0.25
    g.fillStyle(0x2a6fbf, pulse)
    g.fillRoundedRect(x - 7, FLOOR_Y - 44, 14, 44, 4)
    g.lineStyle(3, hot ? 0x9fd4ff : COLORS.ink, 1)
    g.strokeCircle(x, FLOOR_Y - 58, 16)
    g.fillStyle(COLORS.pip, 1)
    g.fillTriangle(x, FLOOR_Y - 70, x - 7, FLOOR_Y - 58, x + 7, FLOOR_Y - 58)
    g.fillTriangle(x, FLOOR_Y - 46, x - 7, FLOOR_Y - 58, x + 7, FLOOR_Y - 58)
    g.lineStyle(3, COLORS.ink, 1)
    g.lineBetween(x - 18, FLOOR_Y - 24, x - 18, FLOOR_Y - 12)
    g.lineBetween(x + 18, FLOOR_Y - 24, x + 18, FLOOR_Y - 12)
    g.lineBetween(x - 18, FLOOR_Y - 18, x + 18, FLOOR_Y - 18)
  }

  private drawPlate(): void {
    const g = this.gfx
    const x = LAYOUT.plateX
    const depress = this.latched ? 8 : this.plate * 6
    g.fillStyle(0xc9844a, 1)
    g.fillEllipse(x, FLOOR_Y - 4, 92, 26)
    g.fillStyle(this.latched ? COLORS.good : COLORS.bookYellow, 1)
    g.fillCircle(x, FLOOR_Y - 18 + depress, 22)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeCircle(x, FLOOR_Y - 18 + depress, 22)
    g.fillStyle(COLORS.pebble, 1)
    g.fillCircle(x, FLOOR_Y - 18 + depress, 8)
    meter(g, x, FLOOR_Y - 64, this.latched ? 1 : this.plate)
    if (this.latched) paintCheck(g, x + 28, FLOOR_Y - 36)
  }

  private drawBook(): void {
    const g = this.gfx
    const x = this.book.x
    const y = this.bookY
    const w = this.book.width
    g.fillStyle(COLORS.bookRed, 1)
    g.fillRoundedRect(x, y, w, 52, 6)
    g.fillStyle(COLORS.bookYellow, 1)
    g.fillRect(x + 16, y + 8, w - 32, 36)
    g.fillStyle(COLORS.bookBlue, 1)
    g.fillCircle(x + w / 2, y + 26, 8)
    g.lineStyle(3, COLORS.ink, 1)
    g.strokeRoundedRect(x, y, w, 52, 6)
  }

  private drawPillows(): void {
    const g = this.gfx
    const p = LEVEL.pillows
    g.fillStyle(COLORS.pillow, 1)
    g.fillEllipse(p.x + 40, p.y + 20, 70, 36)
    g.fillEllipse(p.x + p.w / 2, p.y + 16, 80, 40)
    g.fillEllipse(p.x + p.w - 40, p.y + 22, 70, 36)
    g.lineStyle(2, 0xb85b6c, 0.8)
    g.strokeEllipse(p.x + p.w / 2, p.y + 16, 80, 40)
  }
}

function pebbleOnBridge(pebble: { x: number; y: number; mode: string }, left: number, right: number): boolean {
  return pebble.mode === 'play' && pebble.y <= FLOOR_Y + 8 && pebble.x > left + 8 && pebble.x < right - 8
}

function meter(g: Phaser.GameObjects.Graphics, x: number, y: number, t: number): void {
  for (let i = 0; i < 4; i++) {
    const filled = t >= (i + 1) / 4 - 0.01
    g.fillStyle(filled ? COLORS.good : COLORS.cream, 1)
    g.fillCircle(x + (i - 1.5) * 14, y, 5)
    g.lineStyle(2, COLORS.ink, 1)
    g.strokeCircle(x + (i - 1.5) * 14, y, 5)
  }
}

import { COLORS } from '../config'
import { textStyle } from './theme'

export class Button {
  private g: Phaser.GameObjects.Graphics
  private label: Phaser.GameObjects.Text
  private zone: Phaser.GameObjects.Zone
  private hovered = false
  focused = false

  constructor(
    scene: Phaser.Scene,
    private x: number,
    private y: number,
    private w: number,
    private h: number,
    text: string,
    private action: () => void,
    depth = 10,
  ) {
    this.g = scene.add.graphics().setDepth(depth)
    this.label = scene.add.text(x, y, text, textStyle(Math.min(28, Math.floor(h * 0.38)), COLORS.creamCss)).setOrigin(0.5).setDepth(depth + 1)
    this.zone = scene.add.zone(x, y, w, h).setDepth(depth + 2)
    this.zone.setInteractive({ useHandCursor: true })
    this.zone.on('pointerover', () => {
      this.hovered = true
      this.draw()
    })
    this.zone.on('pointerout', () => {
      this.hovered = false
      this.draw()
    })
    this.zone.on('pointerdown', () => this.action())
    this.draw()
  }

  setText(text: string): void {
    this.label.setText(text)
  }

  setAction(action: () => void): void {
    this.action = action
  }

  click(): void {
    this.action()
  }

  setFocused(on: boolean): void {
    if (this.focused === on) return
    this.focused = on
    this.draw()
  }

  setVisible(on: boolean): void {
    this.g.setVisible(on)
    this.label.setVisible(on)
    if (on) this.zone.setInteractive({ useHandCursor: true })
    else this.zone.disableInteractive()
  }

  contains(px: number, py: number): boolean {
    return Math.abs(px - this.x) <= this.w / 2 && Math.abs(py - this.y) <= this.h / 2
  }

  private draw(): void {
    const hot = this.focused || this.hovered
    this.g.clear()
    this.g.fillStyle(hot ? 0x3a2a22 : COLORS.ink, 1)
    this.g.fillRoundedRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 14)
    this.g.lineStyle(hot ? 6 : 3, COLORS.bookYellow, 1)
    this.g.strokeRoundedRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 14)
  }

  refresh(): void {
    this.draw()
  }
}

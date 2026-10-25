import { COLORS } from '../config'

export interface PaintOpts {
  time: number
  vx: number
  vy: number
  grounded: boolean
  reduced: boolean
  celebrate: boolean
  alpha: number
}

/** Draws Pip standing on feet at (x, y). Does not clear the graphics object. */
export function paintPip(g: Phaser.GameObjects.Graphics, x: number, y: number, o: PaintOpts): void {
  const bob = o.reduced ? 0 : Math.sin(o.time * (o.celebrate ? 8 : 4)) * (o.grounded ? (o.celebrate ? 4 : 1.6) : 0)
  const stretch = o.reduced ? 0 : clampStretch(-o.vy / 900)
  const squash = o.grounded && Math.abs(o.vx) > 40 ? 1.06 : 1
  const bodyH = 46 * (1 + stretch)
  const bodyW = 34 * squash
  const cy = y - 24 + bob

  g.fillStyle(COLORS.ink, 0.16 * o.alpha)
  g.fillEllipse(x, y - 3, o.grounded ? 30 : 18, 8)

  g.fillStyle(COLORS.pip, o.alpha)
  g.fillEllipse(x, cy, bodyW, bodyH)
  g.lineStyle(3, COLORS.pipDeep, o.alpha)
  g.strokeEllipse(x, cy, bodyW, bodyH)

  g.fillStyle(COLORS.pipBelly, o.alpha)
  g.fillEllipse(x, cy + 6, 16, 20)

  const eyeY = cy - 8
  g.fillStyle(COLORS.ink, o.alpha)
  g.fillCircle(x - 7, eyeY, 3.3)
  g.fillCircle(x + 7, eyeY, 3.3)
  g.fillStyle(COLORS.white, o.alpha)
  g.fillCircle(x - 6, eyeY - 1.2, 1.2)
  g.fillCircle(x + 8, eyeY - 1.2, 1.2)

  g.lineStyle(2.5, COLORS.ink, o.alpha)
  g.beginPath()
  g.arc(x, cy + 2, 6, 0.25, Math.PI - 0.25, false)
  g.strokePath()

  // Diamond badge so Pip reads as a shape, not only a colour.
  g.fillStyle(COLORS.pipDeep, o.alpha)
  g.fillTriangle(x, cy - bodyH / 2 - 10, x - 6, cy - bodyH / 2 - 4, x + 6, cy - bodyH / 2 - 4)
  g.fillTriangle(x, cy - bodyH / 2 + 2, x - 6, cy - bodyH / 2 - 4, x + 6, cy - bodyH / 2 - 4)
}

export function paintPebble(g: Phaser.GameObjects.Graphics, x: number, y: number, o: PaintOpts): void {
  const bob = o.reduced ? 0 : Math.sin(o.time * (o.celebrate ? 8 : 4) + 1) * (o.grounded ? (o.celebrate ? 3.5 : 1.4) : 0)
  const stretch = o.reduced ? 0 : clampStretch(-o.vy / 1100)
  const rX = 22 * (o.grounded && Math.abs(o.vx) > 40 ? 1.05 : 1)
  const rY = 22 * (1 + stretch)
  const cy = y - 22 + bob

  g.fillStyle(COLORS.ink, 0.16 * o.alpha)
  g.fillEllipse(x, y - 3, o.grounded ? 32 : 18, 8)

  g.fillStyle(COLORS.pebble, o.alpha)
  g.fillEllipse(x, cy, rX * 2, rY * 2)
  g.lineStyle(3, COLORS.pebbleDeep, o.alpha)
  g.strokeEllipse(x, cy, rX * 2, rY * 2)

  g.fillStyle(COLORS.pebbleBelly, o.alpha)
  g.fillEllipse(x, cy + 5, 16, 16)

  g.fillStyle(0xf27b88, 0.85 * o.alpha)
  g.fillCircle(x - 12, cy + 2, 3.2)
  g.fillCircle(x + 12, cy + 2, 3.2)

  const eyeY = cy - 4
  g.fillStyle(COLORS.ink, o.alpha)
  g.fillCircle(x - 7, eyeY, 3.2)
  g.fillCircle(x + 7, eyeY, 3.2)
  g.fillStyle(COLORS.white, o.alpha)
  g.fillCircle(x - 6, eyeY - 1.1, 1.2)
  g.fillCircle(x + 8, eyeY - 1.1, 1.2)

  g.lineStyle(2.5, COLORS.ink, o.alpha)
  g.beginPath()
  g.arc(x, cy + 4, 6, 0.2, Math.PI - 0.2, false)
  g.strokePath()

  // Feet that flip while walking.
  const step = o.reduced || !o.grounded ? 0 : Math.sin(o.time * 12) * Math.min(1, Math.abs(o.vx) / 200)
  g.fillStyle(COLORS.pebbleDeep, o.alpha)
  g.fillEllipse(x - 8, y - 4, 10, 6)
  g.fillEllipse(x + 8 + step * 2, y - 4, 10, 6)
}

export function paintLens(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.fillStyle(COLORS.pip, 1)
  g.fillTriangle(x, y - 12 * scale, x - 9 * scale, y, x + 9 * scale, y)
  g.fillTriangle(x, y + 12 * scale, x - 9 * scale, y, x + 9 * scale, y)
  g.lineStyle(2, COLORS.pipDeep, 1)
  g.strokeTriangle(x, y - 12 * scale, x - 9 * scale, y, x + 9 * scale, y)
  g.lineStyle(2, COLORS.white, 0.9)
  g.lineBetween(x - 3 * scale, y - 4 * scale, x + 2 * scale, y + 3 * scale)
}

export function paintCog(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.fillStyle(COLORS.pebble, 1)
  g.fillCircle(x, y, 8 * scale)
  g.fillStyle(COLORS.pebbleDeep, 1)
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    g.fillRect(x + Math.cos(a) * 7 * scale - 2 * scale, y + Math.sin(a) * 7 * scale - 2 * scale, 4 * scale, 4 * scale)
  }
  g.fillStyle(COLORS.cream, 1)
  g.fillCircle(x, y, 3.2 * scale)
}

export function paintCheck(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.lineStyle(4, COLORS.good, 1)
  g.beginPath()
  g.moveTo(x - 7, y)
  g.lineTo(x - 2, y + 6)
  g.lineTo(x + 8, y - 6)
  g.strokePath()
}

/** Stretched Pip. surfaceY is the walkable top; the body hangs just below it. */
export function paintBridge(
  g: Phaser.GameObjects.Graphics,
  x0: number,
  x1: number,
  surfaceY: number,
  wobble: number,
  faceOnLeft: boolean,
): void {
  const left = Math.min(x0, x1)
  const right = Math.max(x0, x1)
  const sag = Math.sin(wobble) * 4
  const top = surfaceY + sag
  g.fillStyle(COLORS.pip, 1)
  g.fillRoundedRect(left, top, right - left, 30, 12)
  g.lineStyle(3, COLORS.pipDeep, 1)
  g.strokeRoundedRect(left, top, right - left, 30, 12)
  const faceX = faceOnLeft ? left + 22 : right - 22
  g.fillStyle(COLORS.pip, 1)
  g.fillCircle(faceX, surfaceY - 18, 14)
  g.lineStyle(3, COLORS.pipDeep, 1)
  g.strokeCircle(faceX, surfaceY - 18, 14)
  g.fillStyle(COLORS.pipBelly, 1)
  g.fillEllipse(faceX, surfaceY - 14, 12, 10)
  g.fillStyle(COLORS.ink, 1)
  g.fillCircle(faceX - 5, surfaceY - 22, 2.4)
  g.fillCircle(faceX + 5, surfaceY - 22, 2.4)
  g.lineStyle(2, COLORS.ink, 1)
  g.beginPath()
  g.arc(faceX, surfaceY - 16, 5, 0.25, Math.PI - 0.25, false)
  g.strokePath()
}

export function paintFirefly(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  glow: number,
  repaired: boolean,
  time: number,
  reduced: boolean,
): void {
  const bob = reduced ? 0 : Math.sin(time * 2) * 2
  const cy = y + bob
  const wingA = repaired ? 0.55 : 0.35
  g.fillStyle(0xcfe8ff, wingA)
  g.fillEllipse(x - 58, cy - 10, 78, repaired ? 48 : 28)
  g.fillEllipse(x + 58, cy - 10, 78, repaired ? 48 : 28)
  g.lineStyle(2, 0x7eafd4, 0.8)
  g.strokeEllipse(x - 58, cy - 10, 78, repaired ? 48 : 28)
  g.strokeEllipse(x + 58, cy - 10, 78, repaired ? 48 : 28)

  g.fillStyle(0x6fbf73, 1)
  g.fillEllipse(x, cy, 86, 70)
  g.lineStyle(3, 0x3d7d45, 1)
  g.strokeEllipse(x, cy, 86, 70)

  g.fillStyle(COLORS.ink, 1)
  g.fillCircle(x - 16, cy - 8, 5)
  g.fillCircle(x + 16, cy - 8, 5)
  g.fillStyle(COLORS.white, 1)
  g.fillCircle(x - 14, cy - 10, 1.8)
  g.fillCircle(x + 18, cy - 10, 1.8)
  g.lineStyle(2.5, COLORS.ink, 1)
  g.beginPath()
  g.arc(x, cy + 6, 8, 0.2, Math.PI - 0.2, false)
  g.strokePath()

  // Antennae with round tips, friendly rather than sharp.
  g.lineStyle(3, 0x3d7d45, 1)
  g.lineBetween(x - 12, cy - 30, x - 24, cy - 52)
  g.lineBetween(x + 12, cy - 30, x + 24, cy - 52)
  g.fillStyle(0x3d7d45, 1)
  g.fillCircle(x - 24, cy - 52, 4)
  g.fillCircle(x + 24, cy - 52, 4)

  const lamp = repaired ? COLORS.glow : COLORS.dimLamp
  const pulse = repaired && !reduced ? 0.75 + Math.sin(time * 5) * 0.25 : repaired ? 1 : 0.85
  if (repaired && glow > 0 && !reduced) {
    g.fillStyle(COLORS.glow, 0.18 * glow * pulse)
    g.fillCircle(x, cy + 18, 70 + glow * 40)
    g.fillStyle(COLORS.glow, 0.12 * glow)
    g.fillCircle(x, cy + 18, 120 + glow * 30)
  }
  g.fillStyle(lamp, pulse)
  g.fillCircle(x, cy + 16, 14)
  g.lineStyle(2, repaired ? 0xc4922a : 0x5c564e, 1)
  g.strokeCircle(x, cy + 16, 14)
  if (!repaired) {
    g.lineStyle(2, 0x5c564e, 0.9)
    g.lineBetween(x - 6, cy + 12, x + 7, cy + 20)
  }
}

function clampStretch(v: number): number {
  return Math.max(-0.12, Math.min(0.22, v))
}

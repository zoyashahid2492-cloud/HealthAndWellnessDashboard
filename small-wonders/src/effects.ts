import { settings } from './settings'

export function burst(scene: Phaser.Scene, x: number, y: number, color: number): void {
  if (settings.reducedMotion) return
  for (let i = 0; i < 8; i++) {
    const dot = scene.add.circle(x, y, 4, color, 0.95).setDepth(30)
    const angle = (Math.PI * 2 * i) / 8
    scene.tweens.add({
      targets: dot,
      x: x + Math.cos(angle) * 34,
      y: y + Math.sin(angle) * 24 - 12,
      alpha: 0,
      scale: 0.3,
      duration: 420,
      onComplete: () => dot.destroy(),
    })
  }
}

import { audio } from '../audio'
import { COLORS } from '../config'
import type { Player } from '../entities/player'

interface Flag {
  id: string
  x: number
  y: number
}

/** Tripwire checkpoints. Crossing one updates only that player. */
export class Checkpoints {
  private flags: Flag[] = []
  private gfx: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    this.gfx = scene.add.graphics().setDepth(3)
  }

  add(id: string, x: number, y: number): void {
    this.flags.push({ id, x, y })
  }

  update(players: Player[]): void {
    for (const p of players) {
      if (p.mode === 'respawn' || p.mode === 'bridge') continue
      let best: Flag | null = null
      let bestDist = 80
      for (const flag of this.flags) {
        if (Math.abs(p.y - flag.y) > 190) continue
        const crossed = (p.prevX - flag.x) * (p.x - flag.x) <= 0 && Math.abs(p.x - p.prevX) > 0.4
        const standing = Math.abs(p.x - flag.x) < 46
        if (!crossed && !standing) continue
        const dist = Math.abs(p.x - flag.x)
        if (dist < bestDist) {
          best = flag
          bestDist = dist
        }
      }
      if (best && p.checkpointId !== best.id) {
        p.checkpointId = best.id
        p.checkpoint.set(best.x, best.y)
        audio.checkpoint()
      }
    }
    this.draw(players)
  }

  private draw(players: Player[]): void {
    const g = this.gfx
    g.clear()
    for (const flag of this.flags) {
      const pipHere = players.some((p) => p.id === 'pip' && p.checkpointId === flag.id)
      const pebHere = players.some((p) => p.id === 'pebble' && p.checkpointId === flag.id)
      g.fillStyle(0x8a5a32, 1)
      g.fillRect(flag.x - 3, flag.y - 54, 6, 54)
      g.fillStyle(COLORS.cream, 1)
      g.fillTriangle(flag.x + 3, flag.y - 52, flag.x + 3, flag.y - 32, flag.x + 28, flag.y - 42)
      g.lineStyle(2, COLORS.ink, 1)
      g.strokeTriangle(flag.x + 3, flag.y - 52, flag.x + 3, flag.y - 32, flag.x + 28, flag.y - 42)
      if (pipHere) {
        g.fillStyle(COLORS.pip, 1)
        g.fillTriangle(flag.x + 14, flag.y - 50, flag.x + 8, flag.y - 42, flag.x + 20, flag.y - 42)
        g.fillTriangle(flag.x + 14, flag.y - 34, flag.x + 8, flag.y - 42, flag.x + 20, flag.y - 42)
      }
      if (pebHere) {
        g.fillStyle(COLORS.pebble, 1)
        g.fillCircle(flag.x + 16, flag.y - 40, 5)
      }
    }
  }
}

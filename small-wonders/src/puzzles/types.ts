import type { Player } from '../entities/player'

export interface WorldApi {
  scene: Phaser.Scene
  pip: Player
  pebble: Player
  addSolid: (rect: Phaser.GameObjects.Rectangle) => void
  addBlock: (rect: Phaser.GameObjects.Rectangle) => void
  onRepaired: () => void
}

export interface Puzzle {
  readonly name: string
  create(): void
  update(dt: number): void
  late(dt: number): void
  reset(): void
  solved(): boolean
  objective(): string
  debug(): Record<string, unknown>
}

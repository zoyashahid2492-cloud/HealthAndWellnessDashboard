import { CONFIG } from '../config'
import type { Player } from '../entities/player'
import { clamp } from '../util'
import { syncStatic } from '../world/solids'

export interface SlideBlock {
  rect: Phaser.GameObjects.Rectangle
  w: number
  h: number
  minX: number
  maxX: number
  locked: boolean
  homeX: number
}

export function createBlock(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  minX: number,
  maxX: number,
): SlideBlock {
  const rect = scene.add.rectangle(x, y, w, h, 0xffffff, 0).setOrigin(0, 0).setVisible(false)
  scene.physics.add.existing(rect, true)
  syncStatic(rect)
  return { rect, w, h, minX, maxX, locked: false, homeX: x }
}

/** Pebble shoves a block along a track. Returns true while a push is happening. */
export function tryPush(block: SlideBlock, pebble: Player, other: Player, dt: number): boolean {
  if (block.locked || pebble.mode !== 'play' || !pebble.input.abilityHeld || !pebble.isGrounded()) return false
  const bottom = block.rect.y + block.h
  if (Math.abs(pebble.y - bottom) > 30) return false
  const center = block.rect.x + block.w / 2
  const onLeft = pebble.x < center
  const pressing = onLeft ? pebble.input.right : pebble.input.left
  if (!pressing) return false
  const pad = pebble.tune().pad
  const reach = block.w / 2 + pebble.halfW + 30 + pad
  if (Math.abs(pebble.x - center) > reach) return false

  const speed = pebble.assist() ? CONFIG.push.assistedSpeed : CONFIG.push.speed
  const dir = onLeft ? 1 : -1
  const next = clamp(block.rect.x + dir * speed * dt, block.minX, block.maxX)
  if (next === block.rect.x) return false

  const nextX = dir > 0 ? next - pebble.halfW - 2 : next + block.w + pebble.halfW + 2
  const nextGap = Math.abs(nextX - other.x)
  const oldGap = Math.abs(pebble.x - other.x)
  if (nextGap > CONFIG.leash && nextGap > oldGap) {
    pebble.hintText = 'Wait for Pip'
    return false
  }

  block.rect.x = next
  syncStatic(block.rect)
  pebble.phasingBlock = true
  pebble.place(nextX, pebble.y, dir * speed, 0)
  pebble.hintText = 'Pushing'
  return true
}

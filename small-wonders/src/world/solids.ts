export function makeSolid(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
): Phaser.GameObjects.Rectangle {
  const rect = scene.add.rectangle(x, y, w, h, 0xffffff, 0)
  rect.setOrigin(0, 0)
  rect.setVisible(false)
  scene.physics.add.existing(rect, true)
  const body = rect.body as Phaser.Physics.Arcade.StaticBody
  body.updateFromGameObject()
  return rect
}

export function syncStatic(rect: Phaser.GameObjects.Rectangle): void {
  const body = rect.body as Phaser.Physics.Arcade.StaticBody
  body.updateFromGameObject()
}

export function setSolid(rect: Phaser.GameObjects.Rectangle, on: boolean): void {
  const body = rect.body as Phaser.Physics.Arcade.StaticBody
  body.enable = on
  if (on) body.updateFromGameObject()
}

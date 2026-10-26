import { COLORS, FLOOR_Y, LEVEL } from '../config'
import { FONT } from '../ui/theme'

/** Static bedroom art. Gameplay colliders live elsewhere and use the same coordinates. */
export function drawBedroom(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(0)
  g.fillStyle(COLORS.wall, 1)
  g.fillRect(-80, -80, LEVEL.worldW + 160, 980)

  // Soft vertical bands so the wall is not a flat slab.
  for (let i = 0; i < 12; i++) {
    g.fillStyle(i % 2 === 0 ? COLORS.wall : COLORS.wallDeep, 0.35)
    g.fillRect(i * 340, -40, 170, FLOOR_Y - 20)
  }

  drawWindow(g, 430, 70)
  drawWindow(g, 1680, 70)
  drawWindow(g, 3000, 78)

  drawBooks(g, 40, 250)
  drawBooks(g, 980, 230)
  drawBlockStack(g, 1500, 250)
  drawBench(g, 3000, 250)

  // Baseboard and floor.
  g.fillStyle(0xf7f1e6, 1)
  g.fillRect(0, FLOOR_Y - 28, LEVEL.worldW, 28)
  g.fillStyle(COLORS.floor, 1)
  g.fillRect(0, FLOOR_Y, LEVEL.worldW, 320)
  g.fillStyle(COLORS.floorDark, 1)
  for (let x = 0; x < LEVEL.worldW; x += 84) {
    g.fillRect(x, FLOOR_Y, 4, 320)
  }
  for (let y = FLOOR_Y + 36; y < 920; y += 42) {
    g.fillRect(0, y, LEVEL.worldW, 3)
  }

  // The book gap is a dip full of pillows, not an empty hole.
  const gapL = LEVEL.book.leftFloor.x + LEVEL.book.leftFloor.w
  const gapR = LEVEL.book.rightFloor.x
  g.fillStyle(0xf8d9c4, 1)
  g.fillRect(gapL, FLOOR_Y, gapR - gapL, 220)
  g.fillStyle(COLORS.floorDark, 0.35)
  g.fillRect(gapL, FLOOR_Y, 8, 220)
  g.fillRect(gapR - 8, FLOOR_Y, 8, 220)

  drawRug(g, 120, FLOOR_Y - 8, 260, 36)
  drawRug(g, 1288, FLOOR_Y - 8, 220, 36)

  const plaques = [
    { x: 180, text: 'The Book Gap' },
    { x: 1500, text: 'The Block Elevator' },
    { x: 2860, text: 'The Firefly Workshop' },
  ]
  for (const plaque of plaques) {
    const t = scene.add
      .text(plaque.x, 248, plaque.text, {
        fontFamily: FONT,
        fontSize: '28px',
        color: '#241c16',
        fontStyle: 'bold',
        backgroundColor: '#fff6e8',
        padding: { x: 12, y: 6 },
      })
      .setDepth(1)
    t.setX(plaque.x)
  }

  scene.add
    .text((LEVEL.book.leftFloor.w + LEVEL.book.rightFloor.x) / 2, FLOOR_Y + 70, 'Soft landing', {
      fontFamily: FONT,
      fontSize: '18px',
      color: '#6a3b42',
      fontStyle: 'bold',
    })
    .setOrigin(0.5, 0)
    .setDepth(1)

  // Fairy-light dots along the top. Decorative only.
  for (let x = 40; x < LEVEL.worldW; x += 46) {
    const color = [COLORS.bookRed, COLORS.bookYellow, COLORS.pip, COLORS.bookBlue][(x / 46) % 4]
    g.fillStyle(color, 0.9)
    g.fillCircle(x, 36, 5)
  }
}

function drawWindow(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.fillStyle(0xffffff, 1)
  g.fillRoundedRect(x - 8, y - 8, 196, 156, 12)
  g.fillStyle(0xc5e6f8, 1)
  g.fillRoundedRect(x, y, 180, 140, 8)
  g.fillStyle(0xffe28a, 0.95)
  g.fillCircle(x + 130, y + 36, 18)
  g.lineStyle(6, 0xffffff, 1)
  g.lineBetween(x + 90, y, x + 90, y + 140)
  g.lineBetween(x, y + 70, x + 180, y + 70)
}

function drawBooks(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  const spines = [COLORS.bookRed, COLORS.bookBlue, COLORS.bookGreen, COLORS.bookYellow, COLORS.bookRed, COLORS.bookBlue]
  let cursor = x
  for (let i = 0; i < spines.length; i++) {
    const h = 110 + (i % 3) * 18
    g.fillStyle(spines[i], 0.85)
    g.fillRoundedRect(cursor, y + 140 - h, 28, h, 4)
    cursor += 34
  }
}

function drawBlockStack(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  const colors = [0xe0b07a, 0xd0894e, 0xf2c14e, 0xc9843e]
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3 - row; col++) {
      g.fillStyle(colors[(row + col) % colors.length], 0.9)
      g.fillRoundedRect(x + col * 48 + row * 16, y + 80 - row * 42, 44, 40, 6)
    }
  }
}

function drawBench(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.fillStyle(0xc9843e, 0.9)
  g.fillRoundedRect(x, y + 70, 220, 18, 4)
  g.fillRect(x + 16, y + 88, 12, 50)
  g.fillRect(x + 190, y + 88, 12, 50)
  g.fillStyle(COLORS.bookGreen, 0.8)
  g.fillRoundedRect(x + 24, y + 40, 36, 30, 4)
  g.fillStyle(COLORS.bookRed, 0.8)
  g.fillCircle(x + 90, y + 52, 14)
}

function drawRug(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
  g.fillStyle(0xe07a66, 1)
  g.fillRoundedRect(x, y, w, h, 10)
  g.fillStyle(0xf6d28b, 1)
  g.fillRoundedRect(x + 10, y + 6, w - 20, h - 12, 8)
}

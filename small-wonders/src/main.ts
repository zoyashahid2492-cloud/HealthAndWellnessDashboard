import Phaser from 'phaser'
import { resumeAudio } from './audio'
import { CONFIG } from './config'
import { BootScene } from './scenes/BootScene'
import { HudScene } from './scenes/HudScene'
import { PlayScene } from './scenes/PlayScene'
import { TitleScene } from './scenes/TitleScene'

const params = new URLSearchParams(window.location.search)

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: CONFIG.view.width,
  height: CONFIG.view.height,
  backgroundColor: '#f7e3c8',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: CONFIG.physics.gravity },
      debug: params.has('debug'),
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, PlayScene, HudScene],
  input: { keyboard: true },
  render: { antialias: true, pixelArt: false },
})

const blocked = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'NumpadEnter'])
window.addEventListener(
  'keydown',
  (event) => {
    if (blocked.has(event.code)) event.preventDefault()
  },
  { passive: false },
)

window.addEventListener('pointerdown', () => {
  resumeAudio()
  game.canvas?.focus()
})
window.addEventListener('keydown', () => resumeAudio(), { passive: true })

game.events.once('ready', () => {
  const canvas = game.canvas
  canvas.setAttribute('tabindex', '0')
  canvas.setAttribute('aria-label', 'Small Wonders, a cooperative two player game')
  canvas.focus()
})

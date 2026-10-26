import { COLORS, VIEW } from '../config'
import { publishDebug } from '../debug'
import { paintPebble, paintPip } from '../entities/sprites'
import { settings, saveSettings } from '../settings'
import { session } from '../session'
import { Button } from '../ui/button'
import { FONT } from '../ui/theme'

export class TitleScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics
  private buttons: Button[] = []
  private focus = 0
  private prevUp = false
  private prevDown = false
  private prevEnter = false
  private prevDigits = [false, false, false, false]
  private started = false

  constructor() {
    super({ key: 'title', active: false })
  }

  create(): void {
    session.mode = 'title'
    this.started = false
    this.cameras.main.setBackgroundColor('#f7e3c8')
    this.gfx = this.add.graphics()
    this.add
      .text(VIEW.width / 2, 62, 'Small Wonders', {
        fontFamily: FONT,
        fontSize: '68px',
        color: COLORS.inkCss,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
    this.add
      .text(VIEW.width / 2, 124, 'Two toy friends. One big bedroom. One keyboard.', {
        fontFamily: FONT,
        fontSize: '24px',
        color: '#5c4636',
      })
      .setOrigin(0.5)

    this.add
      .text(250, 175, '◆  Pip\nA D   move\nW   jump\nE   hold to bridge', {
        fontFamily: FONT,
        fontSize: '24px',
        color: COLORS.inkCss,
        align: 'left',
        lineSpacing: 6,
      })
      .setOrigin(0, 0)
    this.add
      .text(760, 175, '●  Pebble\n← →   move\n↑   jump\nEnter   hold to push', {
        fontFamily: FONT,
        fontSize: '24px',
        color: COLORS.inkCss,
        align: 'left',
        lineSpacing: 6,
      })
      .setOrigin(0, 0)

    this.buttons = [
      new Button(this, 640, 575, 440, 76, 'Play together', () => this.startGame()),
      new Button(this, 250, 470, 280, 62, '', () => this.toggle('pip')),
      new Button(this, 560, 470, 280, 62, '', () => this.toggle('pebble')),
      new Button(this, 870, 470, 250, 62, '', () => this.toggle('motion')),
      new Button(this, 1120, 470, 200, 62, '', () => this.toggle('sound')),
    ]
    this.refreshLabels()

    this.add
      .text(VIEW.width / 2, 660, 'Falling pops you back. Your friend keeps their place. Esc pauses.', {
        fontFamily: FONT,
        fontSize: '20px',
        color: '#5c4636',
      })
      .setOrigin(0.5)

    publishDebug(() => ({ scene: 'title' }))
  }

  update(time: number): void {
    this.drawBackdrop(time)
    this.refreshLabels()
    this.buttons.forEach((button, index) => button.setFocused(index === this.focus))
    const kb = this.input.keyboard
    if (!kb) return
    const K = Phaser.Input.Keyboard.KeyCodes
    const up = kb.addKey(K.UP).isDown || kb.addKey(K.W).isDown
    const down = kb.addKey(K.DOWN).isDown || kb.addKey(K.S).isDown
    const enter = kb.addKey(K.ENTER).isDown || kb.addKey(K.SPACE).isDown
    if (up && !this.prevUp) this.focus = (this.focus + this.buttons.length - 1) % this.buttons.length
    if (down && !this.prevDown) this.focus = (this.focus + 1) % this.buttons.length
    if (enter && !this.prevEnter) this.buttons[this.focus].click()
    const digits = [kb.addKey(K.ONE).isDown, kb.addKey(K.TWO).isDown, kb.addKey(K.THREE).isDown, kb.addKey(K.FOUR).isDown]
    const toggles = ['pip', 'pebble', 'motion', 'sound'] as const
    digits.forEach((down, index) => {
      if (down && !this.prevDigits[index]) this.toggle(toggles[index])
      this.prevDigits[index] = down
    })
    this.prevUp = up
    this.prevDown = down
    this.prevEnter = enter
  }

  private startGame(): void {
    if (this.started) return
    this.started = true
    this.scene.start('play')
  }

  private toggle(which: 'pip' | 'pebble' | 'motion' | 'sound'): void {
    if (which === 'pip') settings.pipAssist = !settings.pipAssist
    if (which === 'pebble') settings.pebbleAssist = !settings.pebbleAssist
    if (which === 'motion') settings.reducedMotion = !settings.reducedMotion
    if (which === 'sound') settings.muted = !settings.muted
    saveSettings()
    this.refreshLabels()
  }

  private refreshLabels(): void {
    this.buttons[1]?.setText(`Pip: ${settings.pipAssist ? 'Assisted' : 'Normal'}`)
    this.buttons[2]?.setText(`Pebble: ${settings.pebbleAssist ? 'Assisted' : 'Normal'}`)
    this.buttons[3]?.setText(settings.reducedMotion ? 'Motion: Reduced' : 'Motion: Full')
    this.buttons[4]?.setText(settings.muted ? 'Sound: Off' : 'Sound: On')
  }

  private drawBackdrop(time: number): void {
    const g = this.gfx
    g.clear()
    g.fillStyle(COLORS.floor, 1)
    g.fillRect(0, 560, VIEW.width, 160)
    g.fillStyle(0xf7f1e6, 1)
    g.fillRect(0, 540, VIEW.width, 24)
    paintPip(g, 560, 400, {
      time: time / 1000,
      vx: 0,
      vy: 0,
      grounded: true,
      reduced: settings.reducedMotion,
      celebrate: false,
      alpha: 1,
    })
    paintPebble(g, 700, 400, {
      time: time / 1000,
      vx: 0,
      vy: 0,
      grounded: true,
      reduced: settings.reducedMotion,
      celebrate: false,
      alpha: 1,
    })
  }
}

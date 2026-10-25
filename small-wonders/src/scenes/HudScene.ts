import { COLORS, VIEW } from '../config'
import { settings, saveSettings } from '../settings'
import { session } from '../session'
import { Button } from '../ui/button'
import { textStyle } from '../ui/theme'

export class HudScene extends Phaser.Scene {
  private bar!: Phaser.GameObjects.Graphics
  private overlay!: Phaser.GameObjects.Graphics
  private room!: Phaser.GameObjects.Text
  private objective!: Phaser.GameObjects.Text
  private pipHelp!: Phaser.GameObjects.Text
  private pebbleHelp!: Phaser.GameObjects.Text
  private toast!: Phaser.GameObjects.Text
  private completeTitle!: Phaser.GameObjects.Text
  private completeBody!: Phaser.GameObjects.Text
  private confirmText!: Phaser.GameObjects.Text
  private pauseButtons: Button[] = []
  private confirmButtons: Button[] = []
  private replayButton!: Button
  private restartButton!: Button
  private pauseButton!: Button
  private prev = { esc: false, up: false, down: false, left: false, right: false, enter: false }
  private escKey!: Phaser.Input.Keyboard.Key
  private upKey!: Phaser.Input.Keyboard.Key
  private downKey!: Phaser.Input.Keyboard.Key
  private leftKey!: Phaser.Input.Keyboard.Key
  private rightKey!: Phaser.Input.Keyboard.Key
  private enterKey!: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'hud', active: false })
  }

  create(): void {
    this.bar = this.add.graphics().setDepth(1)
    this.overlay = this.add.graphics().setDepth(5)
    this.room = this.add.text(VIEW.width / 2, 14, '', textStyle(18, '#5c4636')).setOrigin(0.5, 0).setDepth(4)
    this.objective = this.add
      .text(VIEW.width / 2, 40, '', { ...textStyle(22), wordWrap: { width: 500 }, align: 'center' })
      .setOrigin(0.5, 0)
      .setDepth(4)
    this.pipHelp = this.add.text(24, 16, '', { ...textStyle(18, COLORS.inkCss, true), align: 'left' }).setDepth(4)
    this.pebbleHelp = this.add
      .text(VIEW.width - 24, 16, '', { ...textStyle(18, COLORS.inkCss, true), align: 'right' })
      .setOrigin(1, 0)
      .setDepth(4)
    this.toast = this.add
      .text(VIEW.width / 2, 136, '', {
        ...textStyle(22),
        backgroundColor: COLORS.creamCss,
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setDepth(6)

    this.restartButton = new Button(this, 150, 684, 250, 48, 'Restart puzzle', () => {
      session.paused = true
      session.confirmRestart = true
      session.confirmIndex = 1
    }, 4)
    this.pauseButton = new Button(this, 1148, 684, 180, 48, 'Pause', () => {
      session.paused = true
      session.menuIndex = 0
      session.confirmRestart = false
    }, 4)

    const labels = [
      'Resume',
      'Restart puzzle',
      'Pip jumps',
      'Pebble jumps',
      'Motion',
      'Sound',
      'Back to title',
    ]
    this.pauseButtons = labels.map((label, index) => {
      const button = new Button(this, VIEW.width / 2, 214 + index * 54, 500, 48, label, () => this.activate(index))
      button.setVisible(false)
      return button
    })
    this.confirmText = this.add
      .text(VIEW.width / 2, 300, 'Restart this puzzle?\nBoth players return to the start of this room.\nOther rooms stay as they are.', {
        ...textStyle(26),
        align: 'center',
        wordWrap: { width: 640 },
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(12)
      .setVisible(false)
    this.confirmButtons = [
      new Button(this, 480, 450, 240, 64, 'Yes, restart', () => {
        session.requestRestart = true
      }),
      new Button(this, 800, 450, 240, 64, 'Cancel', () => {
        session.confirmRestart = false
      }),
    ]
    this.confirmButtons.forEach((button) => button.setVisible(false))

    this.completeTitle = this.add
      .text(VIEW.width / 2, 250, 'The firefly is glowing', textStyle(48, COLORS.inkCss))
      .setOrigin(0.5)
      .setDepth(12)
      .setVisible(false)
    this.completeBody = this.add
      .text(VIEW.width / 2, 320, 'You mended it together.', textStyle(28, '#5c4636', false))
      .setOrigin(0.5)
      .setDepth(12)
      .setVisible(false)
    this.replayButton = new Button(this, VIEW.width / 2, 430, 360, 76, 'Replay', () => {
      session.requestReplay = true
    }, 12)
    this.replayButton.setVisible(false)

    const kb = this.input.keyboard
    if (!kb) return
    const K = Phaser.Input.Keyboard.KeyCodes
    this.escKey = kb.addKey(K.ESC)
    this.upKey = kb.addKey(K.UP)
    this.downKey = kb.addKey(K.DOWN)
    this.leftKey = kb.addKey(K.LEFT)
    this.rightKey = kb.addKey(K.RIGHT)
    this.enterKey = kb.addKey(K.ENTER)
  }

  update(): void {
    this.drawBar()
    this.room.setText(session.roomName)
    this.objective.setText(session.objective)
    const pipMode = settings.pipAssist ? 'Assisted jumps' : 'Normal jumps'
    const pebMode = settings.pebbleAssist ? 'Assisted jumps' : 'Normal jumps'
    this.pipHelp.setText(`◆ Pip   ${pipMode}\nA D move    W jump\nE ability`)
    this.pebbleHelp.setText(`● Pebble   ${pebMode}\n← → move    ↑ jump\nEnter ability`)
    const showToast = performance.now() < session.toastUntil && !session.paused && !session.complete
    this.toast.setVisible(showToast)
    if (showToast) this.toast.setText(session.toast)

    const playing = session.mode === 'play' && !session.paused && !session.complete
    this.restartButton.setVisible(playing)
    this.pauseButton.setVisible(playing)
    this.pipHelp.setVisible(!session.complete)
    this.pebbleHelp.setVisible(!session.complete)
    this.room.setVisible(!session.paused && !session.complete)
    this.objective.setVisible(!session.paused && !session.complete)

    this.drawOverlay()
    this.updateMenus()
    this.readKeys()
  }

  private drawBar(): void {
    const g = this.bar
    g.clear()
    g.fillStyle(COLORS.cream, 0.94)
    g.fillRoundedRect(16, 8, VIEW.width - 32, 108, 16)
    g.lineStyle(3, COLORS.ink, 0.25)
    g.strokeRoundedRect(16, 8, VIEW.width - 32, 108, 16)
    if (session.repair >= 0 && !session.paused) {
      const t = session.repair
      for (let i = 0; i < 8; i++) {
        const filled = t >= (i + 1) / 8 - 0.001
        g.fillStyle(filled ? COLORS.glow : 0xffffff, 1)
        g.fillCircle(VIEW.width / 2 + (i - 3.5) * 18, 104, 6)
        g.lineStyle(2, COLORS.ink, 1)
        g.strokeCircle(VIEW.width / 2 + (i - 3.5) * 18, 104, 6)
      }
    }
  }

  private drawOverlay(): void {
    const g = this.overlay
    g.clear()
    if (!session.paused && !session.complete) return
    g.fillStyle(0x2a211c, 0.46)
    g.fillRect(0, 0, VIEW.width, VIEW.height)
    g.fillStyle(COLORS.cream, 1)
    if (session.complete) {
      g.fillRoundedRect(280, 180, 720, 340, 24)
      return
    }
    if (session.confirmRestart) {
      g.fillRoundedRect(250, 200, 780, 320, 24)
      return
    }
    g.fillRoundedRect(340, 160, 600, 460, 24)
  }

  private updateMenus(): void {
    const showPause = session.paused && !session.confirmRestart && !session.complete
    this.pauseButtons.forEach((button, index) => {
      button.setVisible(showPause)
      button.setFocused(showPause && index === session.menuIndex)
    })
    if (showPause) {
      this.pauseButtons[2].setText(`Pip jumps: ${settings.pipAssist ? 'Assisted' : 'Normal'}`)
      this.pauseButtons[3].setText(`Pebble jumps: ${settings.pebbleAssist ? 'Assisted' : 'Normal'}`)
      this.pauseButtons[4].setText(settings.reducedMotion ? 'Motion: Reduced' : 'Motion: Full')
      this.pauseButtons[5].setText(settings.muted ? 'Sound: Off' : 'Sound: On')
    }
    const showConfirm = session.paused && session.confirmRestart && !session.complete
    this.confirmText.setVisible(showConfirm)
    this.confirmButtons.forEach((button, index) => {
      button.setVisible(showConfirm)
      button.setFocused(showConfirm && index === session.confirmIndex)
    })
    this.completeTitle.setVisible(session.complete)
    this.completeBody.setVisible(session.complete)
    this.replayButton.setVisible(session.complete)
    this.replayButton.setFocused(session.complete)
  }

  private readKeys(): void {
    if (!this.escKey) return
    const esc = this.edge(this.escKey.isDown, 'esc')
    const up = this.edge(this.upKey.isDown, 'up')
    const down = this.edge(this.downKey.isDown, 'down')
    const left = this.edge(this.leftKey.isDown, 'left')
    const right = this.edge(this.rightKey.isDown, 'right')
    const enter = this.edge(this.enterKey.isDown, 'enter')
    if (session.mode !== 'play') return

    if (session.complete) {
      if (enter) session.requestReplay = true
      return
    }
    if (esc) {
      if (session.confirmRestart) session.confirmRestart = false
      else {
        session.paused = !session.paused
        session.menuIndex = 0
        session.confirmRestart = false
      }
    }
    if (!session.paused) return
    if (session.confirmRestart) {
      if (left || up) session.confirmIndex = 0
      if (right || down) session.confirmIndex = 1
      if (enter) this.confirmButtons[session.confirmIndex].click()
      return
    }
    if (up) session.menuIndex = (session.menuIndex + this.pauseButtons.length - 1) % this.pauseButtons.length
    if (down) session.menuIndex = (session.menuIndex + 1) % this.pauseButtons.length
    if (enter) this.pauseButtons[session.menuIndex].click()
  }

  private activate(index: number): void {
    if (index === 0) session.paused = false
    if (index === 1) {
      session.confirmRestart = true
      session.confirmIndex = 1
    }
    if (index === 2) settings.pipAssist = !settings.pipAssist
    if (index === 3) settings.pebbleAssist = !settings.pebbleAssist
    if (index === 4) settings.reducedMotion = !settings.reducedMotion
    if (index === 5) settings.muted = !settings.muted
    if (index >= 2 && index <= 5) saveSettings()
    if (index === 6) session.requestTitle = true
  }

  private edge(down: boolean, key: keyof HudScene['prev']): boolean {
    const fired = down && !this.prev[key]
    this.prev[key] = down
    return fired
  }
}

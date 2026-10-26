import type { ActorInput } from '../entities/player'

let numpadEnter = false
window.addEventListener('keydown', (event) => {
  if (event.code === 'NumpadEnter') numpadEnter = true
})
window.addEventListener('keyup', (event) => {
  if (event.code === 'NumpadEnter') numpadEnter = false
})

const BLANK: ActorInput = {
  left: false,
  right: false,
  jumpHeld: false,
  jumpPressed: false,
  abilityHeld: false,
  abilityPressed: false,
}

export class Controls {
  private a: Phaser.Input.Keyboard.Key
  private d: Phaser.Input.Keyboard.Key
  private w: Phaser.Input.Keyboard.Key
  private e: Phaser.Input.Keyboard.Key
  private left: Phaser.Input.Keyboard.Key
  private right: Phaser.Input.Keyboard.Key
  private up: Phaser.Input.Keyboard.Key
  private enter: Phaser.Input.Keyboard.Key
  private prevW = false
  private prevUp = false
  private prevE = false
  private prevEnter = false
  private suppressPip = false
  private suppressPeb = false

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard
    if (!kb) throw new Error('Keyboard input is not available')
    const K = Phaser.Input.Keyboard.KeyCodes
    this.a = kb.addKey(K.A)
    this.d = kb.addKey(K.D)
    this.w = kb.addKey(K.W)
    this.e = kb.addKey(K.E)
    this.left = kb.addKey(K.LEFT)
    this.right = kb.addKey(K.RIGHT)
    this.up = kb.addKey(K.UP)
    this.enter = kb.addKey(K.ENTER)
    this.suppressUntilRelease()
  }

  /** Ignore ability keys that were already held, so a menu press does not fire an ability. */
  suppressUntilRelease(): void {
    this.suppressPip = true
    this.suppressPeb = true
  }

  read(): { pip: ActorInput; pebble: ActorInput } {
    if (!this.e.isDown) this.suppressPip = false
    if (!this.enter.isDown && !numpadEnter) this.suppressPeb = false

    const w = this.w.isDown
    const up = this.up.isDown
    const e = this.e.isDown && !this.suppressPip
    const enter = (this.enter.isDown || numpadEnter) && !this.suppressPeb
    const a = this.a.isDown
    const d = this.d.isDown
    const left = this.left.isDown
    const right = this.right.isDown

    const pip: ActorInput = {
      left: a && !d,
      right: d && !a,
      jumpHeld: w,
      jumpPressed: w && !this.prevW,
      abilityHeld: e,
      abilityPressed: e && !this.prevE,
    }
    const pebble: ActorInput = {
      left: left && !right,
      right: right && !left,
      jumpHeld: up,
      jumpPressed: up && !this.prevUp,
      abilityHeld: enter,
      abilityPressed: enter && !this.prevEnter,
    }
    this.prevW = w
    this.prevUp = up
    this.prevE = e
    this.prevEnter = enter
    return { pip, pebble }
  }

  blank(): { pip: ActorInput; pebble: ActorInput } {
    return { pip: BLANK, pebble: BLANK }
  }
}

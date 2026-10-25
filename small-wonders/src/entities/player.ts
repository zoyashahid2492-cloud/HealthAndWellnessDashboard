import { audio } from '../audio'
import { CONFIG, type Tune } from '../config'
import { settings } from '../settings'
import { moveToward } from '../util'
import { paintCog, paintLens, paintPebble, paintPip, type PaintOpts } from './sprites'

export type ActorId = 'pip' | 'pebble'
export type Carry = 'lens' | 'cog' | null
export type ActorMode = 'play' | 'bridge' | 'slide' | 'respawn' | 'celebrate'

export interface ActorInput {
  left: boolean
  right: boolean
  jumpHeld: boolean
  jumpPressed: boolean
  abilityHeld: boolean
  abilityPressed: boolean
}

const EMPTY_INPUT: ActorInput = {
  left: false,
  right: false,
  jumpHeld: false,
  jumpPressed: false,
  abilityHeld: false,
  abilityPressed: false,
}

export class Player {
  readonly sprite: Phaser.GameObjects.Rectangle
  readonly body: Phaser.Physics.Arcade.Body
  readonly gfx: Phaser.GameObjects.Graphics
  readonly label: Phaser.GameObjects.Text
  readonly hint: Phaser.GameObjects.Text
  readonly halfW: number
  readonly height: number

  input: ActorInput = EMPTY_INPUT
  mode: ActorMode = 'play'
  carrying: Carry = null
  checkpoint = new Phaser.Math.Vector2()
  checkpointId = ''
  supported = false
  phasingBlock = false
  facing: 1 | -1 = 1
  prevX = 0
  hintText = ''

  private coyote = 0
  private jumpBuffer = 0
  private jumpAge = 0
  private cutArmed = false
  private respawnLeft = 0
  private invuln = 0
  private pinX = 0
  private pinY = 0
  private slideFrom = new Phaser.Math.Vector2()
  private slideTo = new Phaser.Math.Vector2()
  private slideLeft = 0
  private slideDur = 1
  private drawVisible = true
  private wasGrounded = false

  constructor(
    scene: Phaser.Scene,
    readonly id: ActorId,
    x: number,
    y: number,
  ) {
    const size = CONFIG.actors[id]
    this.halfW = size.w / 2
    this.height = size.h
    this.sprite = scene.add.rectangle(x, y, size.w, size.h, 0xffffff, 0)
    this.sprite.setOrigin(0.5, 1)
    this.sprite.setDepth(6)
    scene.physics.add.existing(this.sprite)
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body
    this.body.setSize(size.w, size.h, true)
    this.body.setCollideWorldBounds(false)
    this.body.setMaxVelocity(520, 1400)
    this.body.setDrag(0, 0)
    this.body.setFriction(0, 0)
    this.body.setBounce(0)
    this.gfx = scene.add.graphics().setDepth(7)
    const name = id === 'pip' ? 'Pip' : 'Pebble'
    const color = id === 'pip' ? '#176960' : '#8a4b0f'
    this.label = scene.add
      .text(x, y - size.h - 18, name, {
        fontFamily: '"Trebuchet MS", "Segoe UI", Verdana, sans-serif',
        fontSize: '16px',
        color,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 1)
      .setDepth(8)
    this.hint = scene.add
      .text(x, y - size.h - 40, '', {
        fontFamily: '"Trebuchet MS", "Segoe UI", Verdana, sans-serif',
        fontSize: '18px',
        color: '#241c16',
        backgroundColor: '#fff6e8',
        padding: { x: 8, y: 4 },
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 1)
      .setDepth(12)
      .setVisible(false)
    this.prevX = x
    this.checkpoint.set(x, y)
  }

  get x(): number {
    return this.sprite.x
  }

  get y(): number {
    return this.sprite.y
  }

  assist(): boolean {
    return this.id === 'pip' ? settings.pipAssist : settings.pebbleAssist
  }

  tune(): Tune {
    return this.assist() ? CONFIG.tune.assisted : CONFIG.tune.normal
  }

  isGrounded(): boolean {
    return this.supported || this.body.blocked.down || this.body.touching.down
  }

  place(x: number, y: number, vx = 0, vy = 0): void {
    this.sprite.setPosition(x, y)
    this.body.enable = true
    this.body.setAllowGravity(true)
    this.body.updateFromGameObject()
    this.body.setVelocity(vx, vy)
    // Physics postUpdate adds body.position - prevFrame onto the sprite.
    // Sync those snapshots so a teleport is not applied twice.
    this.body.prev.copy(this.body.position)
    this.body.prevFrame.copy(this.body.position)
  }

  beginBridge(x: number, y: number): void {
    this.mode = 'bridge'
    this.pinX = x
    this.pinY = y
    this.drawVisible = false
    this.body.setVelocity(0, 0)
    this.body.setAllowGravity(false)
    this.body.enable = false
    this.sprite.setPosition(x, y)
  }

  endBridge(): void {
    if (this.mode !== 'bridge') return
    this.mode = 'play'
    this.drawVisible = true
    this.place(this.pinX, this.pinY, 0, 0)
    this.coyote = this.tune().coyote
    this.cutArmed = false
  }

  beginSlide(x: number, y: number, duration: number): void {
    this.mode = 'slide'
    this.slideFrom.set(this.x, this.y)
    this.slideTo.set(x, y)
    this.slideDur = duration
    this.slideLeft = duration
    this.body.setVelocity(0, 0)
    this.body.setAllowGravity(false)
    this.body.enable = false
  }

  triggerRespawn(): void {
    if (this.mode === 'respawn' || this.mode === 'bridge' || this.mode === 'celebrate') return
    if (this.invuln > 0) return
    this.mode = 'respawn'
    this.respawnLeft = settings.reducedMotion ? 0.12 : CONFIG.respawn.hide
    this.drawVisible = false
    this.body.setVelocity(0, 0)
    this.body.setAllowGravity(false)
    this.body.enable = false
    this.hintText = ''
    audio.pop()
  }

  resetTo(x: number, y: number, checkpointId: string): void {
    this.mode = 'play'
    this.drawVisible = true
    this.place(x, y, 0, 0)
    this.checkpoint.set(x, y)
    this.checkpointId = checkpointId
    this.prevX = x
    this.invuln = CONFIG.respawn.invuln
    this.cutArmed = false
    this.jumpBuffer = 0
    this.coyote = 0
    this.hintText = ''
  }

  clearCarry(): void {
    this.carrying = null
  }

  simulate(dt: number): void {
    this.invuln = Math.max(0, this.invuln - dt)
    if (this.mode === 'respawn') this.simRespawn(dt)
    else if (this.mode === 'bridge') this.sprite.setPosition(this.pinX, this.pinY)
    else if (this.mode === 'slide') this.simSlide(dt)
    else if (this.mode === 'celebrate') this.body.setVelocityX(0)
    else this.applyMovement(dt)
  }

  paint(time: number): void {
    this.gfx.clear()
    const show = this.drawVisible && this.mode !== 'bridge'
    this.label.setVisible(show)
    this.sprite.setVisible(false)
    if (!show) {
      this.hint.setVisible(false)
      return
    }
    const opts: PaintOpts = {
      time: time / 1000,
      vx: this.body.velocity.x,
      vy: this.body.velocity.y,
      grounded: this.isGrounded(),
      reduced: settings.reducedMotion,
      celebrate: this.mode === 'celebrate',
      alpha: this.invuln > 0 && Math.sin(time / 40) > 0 ? 0.55 : 1,
    }
    if (this.id === 'pip') paintPip(this.gfx, this.x, this.y, opts)
    else paintPebble(this.gfx, this.x, this.y, opts)
    if (this.carrying === 'lens') paintLens(this.gfx, this.x, this.y - this.height - 8, 0.9)
    if (this.carrying === 'cog') paintCog(this.gfx, this.x, this.y - this.height - 6, 0.95)
    this.label.setPosition(this.x, this.y - this.height - 16)
    if (this.hintText) {
      this.hint.setText(this.hintText)
      this.hint.setPosition(this.x, this.y - this.height - 46)
      this.hint.setVisible(true)
    } else {
      this.hint.setVisible(false)
    }
    this.sprite.setDepth(6 + this.y / 10000)
    this.gfx.setDepth(7 + this.y / 10000)
  }

  private applyMovement(dt: number): void {
    const tune = this.tune()
    const grounded = this.isGrounded()
    if (grounded) this.coyote = tune.coyote
    else this.coyote -= dt

    if (this.input.jumpPressed) this.jumpBuffer = tune.jumpBuffer
    else this.jumpBuffer -= dt

    const target = this.input.left ? -tune.maxSpeed : this.input.right ? tune.maxSpeed : 0
    if (this.input.left) this.facing = -1
    if (this.input.right) this.facing = 1
    const rate = target === 0 ? tune.decel : grounded ? tune.accel : tune.airAccel
    const vx = moveToward(this.body.velocity.x, target, rate * dt)
    this.body.setVelocityX(vx)

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.body.setVelocityY(-tune.jumpSpeed)
      this.coyote = 0
      this.jumpBuffer = 0
      this.cutArmed = true
      this.jumpAge = 0
      this.supported = false
      audio.jump()
    } else if (this.cutArmed) {
      this.jumpAge += dt
      if (!this.input.jumpHeld && this.body.velocity.y < 0 && this.jumpAge > tune.minJumpHold) {
        this.body.setVelocityY(this.body.velocity.y * tune.cut)
        this.cutArmed = false
      }
    }

    if (grounded && !this.wasGrounded && this.body.velocity.y >= 0) audio.land()
    if (grounded && this.body.velocity.y >= 0) this.cutArmed = false
    this.wasGrounded = grounded
  }

  private simRespawn(dt: number): void {
    this.respawnLeft -= dt
    if (this.respawnLeft > 0) return
    this.mode = 'play'
    this.drawVisible = true
    const hop = settings.reducedMotion ? 0 : -CONFIG.respawn.hop
    this.place(this.checkpoint.x, this.checkpoint.y, 0, hop)
    this.invuln = CONFIG.respawn.invuln
    this.cutArmed = false
    this.coyote = 0
  }

  private simSlide(dt: number): void {
    this.slideLeft -= dt
    const t = 1 - Math.max(0, this.slideLeft) / this.slideDur
    const ease = t * t * (3 - 2 * t)
    const x = this.slideFrom.x + (this.slideTo.x - this.slideFrom.x) * ease
    const y = this.slideFrom.y + (this.slideTo.y - this.slideFrom.y) * ease
    this.sprite.setPosition(x, y)
    if (this.slideLeft <= 0) {
      this.mode = 'play'
      this.place(this.slideTo.x, this.slideTo.y, 0, 0)
    }
  }
}

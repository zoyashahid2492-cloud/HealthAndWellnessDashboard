/** Tuning and level layout for Small Wonders. Change feel here, not in gameplay code. */

export const VIEW = { width: 1280, height: 720 }

export const COLORS = {
  ink: 0x241c16,
  inkCss: '#241c16',
  cream: 0xfff6e8,
  creamCss: '#fff6e8',
  creamDeep: 0xf3e0c8,
  wall: 0xf7e3c8,
  wallDeep: 0xf0d2ae,
  floor: 0xe8b86a,
  floorDark: 0xc4843e,
  plank: 0xa86e34,
  pip: 0x2aa39a,
  pipDeep: 0x176960,
  pipBelly: 0xdffaf4,
  pebble: 0xf0a04a,
  pebbleDeep: 0xb56516,
  pebbleBelly: 0xffe4c2,
  bookRed: 0xe15b4c,
  bookBlue: 0x3c6e99,
  bookGreen: 0x3d9a72,
  bookYellow: 0xf2c14e,
  good: 0x2f9d62,
  white: 0xffffff,
  pillow: 0xf08b9a,
  glow: 0xffe28a,
  dimLamp: 0x8d8578,
}

export interface Tune {
  accel: number
  airAccel: number
  decel: number
  maxSpeed: number
  jumpSpeed: number
  coyote: number
  jumpBuffer: number
  /** Minimum time the jump keeps full strength, so a tap still clears a low step. */
  minJumpHold: number
  /** Multiplier applied to upward speed when the jump button is released. */
  cut: number
  /** Extra pixels added to interaction radii. */
  pad: number
}

const normalTune: Tune = {
  accel: 2800,
  airAccel: 1450,
  decel: 3800,
  maxSpeed: 300,
  jumpSpeed: 690,
  coyote: 0.12,
  jumpBuffer: 0.14,
  minJumpHold: 0.09,
  cut: 0.46,
  pad: 18,
}

const assistedTune: Tune = {
  accel: 3200,
  airAccel: 2100,
  decel: 4000,
  maxSpeed: 330,
  jumpSpeed: 830,
  coyote: 0.2,
  jumpBuffer: 0.22,
  minJumpHold: 0.08,
  cut: 0.58,
  pad: 40,
}

export const CONFIG = {
  view: VIEW,
  physics: { gravity: 1500 },
  tune: { normal: normalTune, assisted: assistedTune },
  leash: 1040,
  camera: { minZoom: 0.68, margin: 700, lerp: 0.12, reducedLerp: 1 },
  repair: {
    seconds: 2.5,
    assistedSeconds: 1.4,
    decayDelay: 0.8,
    decay: 0.22,
  },
  bridge: {
    engage: 0.09,
    assistedEngage: 0.04,
    /** How long a released bridge keeps holding while a friend is still on it. */
    extraHold: 2.6,
    range: 78,
  },
  push: { speed: 125, assistedSpeed: 170 },
  respawn: { hide: 0.32, hop: 260, invuln: 0.6 },
  actors: {
    pip: { w: 34, h: 50 },
    pebble: { w: 44, h: 44 },
  },
}

/** Feet rest on this line. */
export const FLOOR_Y = 624

export const LEVEL = {
  worldW: 3840,
  floorY: FLOOR_Y,
  killY: 980,
  pillows: { x: 530, y: 790, w: 250, h: 48 },
  book: {
    leftFloor: { x: 0, y: FLOOR_Y, w: 520, h: 240 },
    rightFloor: { x: 800, y: FLOOR_Y, w: 480, h: 240 },
    anchorL: 468,
    anchorR: 852,
    bridge: { x: 512, y: FLOOR_Y, w: 296, h: 32 },
    plateX: 1040,
    spawns: { pip: 190, pebble: 320 },
  },
  elevator: {
    block: { x: 1560, y: FLOOR_Y - 86, w: 86, h: 86, minX: 1480, maxX: 1848 },
    plateX: 1891,
    callX: 1988,
    lift: { x: 2060, w: 160, h: 22, top: 352, bottom: FLOOR_Y },
    catwalk: { x: 2208, y: 352, w: 172, h: 22 },
    ribbonX: 2310,
    wallX: 2380,
    wallW: 64,
    doorTop: 416,
    spawns: { pip: 1340, pebble: 1450 },
  },
  workshop: {
    lensStep: { x: 2500, y: 548, w: 150, h: 20 },
    lensShelf: { x: 2610, y: 430, w: 180, h: 20 },
    lensX: 2700,
    cogX: 2890,
    block: { x: 2820, y: FLOOR_Y - 96, w: 96, h: 96, minX: 2760, maxX: 3070 },
    cogSocketX: 3288,
    socketStep: { x: 3388, y: 558, w: 140, h: 20 },
    lensSocket: { x: 3496, y: 468, w: 190, h: 20 },
    lensSocketX: 3590,
    fireflyX: 3540,
    spawns: { pip: 2520, pebble: 2630 },
    startX: 2460,
  },
  checkpoints: [
    { id: 'book-l', x: 250, y: FLOOR_Y },
    { id: 'book-r', x: 980, y: FLOOR_Y },
    { id: 'elev', x: 1400, y: FLOOR_Y },
    { id: 'elev-top', x: 2290, y: 352 },
    { id: 'shop', x: 2580, y: FLOOR_Y },
  ],
}

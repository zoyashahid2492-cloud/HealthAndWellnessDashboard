import { settings } from './settings'

let ctx: AudioContext | null = null

function ac(): AudioContext | null {
  if (settings.muted) return null
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!ctx) ctx = new Ctx()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function resumeAudio(): void {
  ac()
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0): void {
  const context = ac()
  if (!context) return
  const start = context.currentTime + delay
  const osc = context.createOscillator()
  const amp = context.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  amp.gain.setValueAtTime(gain, start)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(amp)
  amp.connect(context.destination)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

export const audio = {
  jump: () => tone(520, 0.12, 'triangle', 0.04),
  land: () => tone(180, 0.08, 'sine', 0.03),
  bridge: () => tone(440, 0.18, 'sine', 0.05),
  click: () => tone(660, 0.08, 'square', 0.03),
  success: () => {
    tone(523, 0.12, 'triangle', 0.05)
    tone(659, 0.14, 'triangle', 0.05, 0.08)
    tone(784, 0.2, 'triangle', 0.05, 0.16)
  },
  pop: () => tone(700, 0.1, 'sine', 0.04),
  checkpoint: () => tone(880, 0.09, 'sine', 0.03),
  tick: () => tone(990, 0.05, 'sine', 0.025),
  fanfare: () => {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.05, i * 0.12))
  },
}

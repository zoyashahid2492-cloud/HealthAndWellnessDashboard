export interface Settings {
  pipAssist: boolean
  pebbleAssist: boolean
  reducedMotion: boolean
  muted: boolean
}

const KEY = 'small-wonders-settings-v1'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function load(): Settings {
  const base: Settings = {
    pipAssist: false,
    pebbleAssist: false,
    reducedMotion: prefersReducedMotion(),
    muted: false,
  }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      pipAssist: Boolean(parsed.pipAssist),
      pebbleAssist: Boolean(parsed.pebbleAssist),
      reducedMotion: parsed.reducedMotion === undefined ? base.reducedMotion : Boolean(parsed.reducedMotion),
      muted: Boolean(parsed.muted),
    }
  } catch {
    return base
  }
}

export const settings: Settings = load()

export function saveSettings(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    /* Private mode and blocked storage should not stop play. */
  }
}

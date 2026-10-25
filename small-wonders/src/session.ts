/** Shared UI state. The play scene writes it; the HUD scene reads it. */

export const session = {
  mode: 'boot' as 'boot' | 'title' | 'play',
  roomName: 'The Book Gap',
  objective: '',
  repair: -1,
  pipHolding: false,
  pebbleHolding: false,
  paused: false,
  complete: false,
  toast: '',
  toastUntil: 0,
  menuIndex: 0,
  confirmRestart: false,
  confirmIndex: 1,
  requestRestart: false,
  requestTitle: false,
  requestReplay: false,
}

export function resetSessionForPlay(): void {
  session.mode = 'play'
  session.roomName = 'The Book Gap'
  session.objective = ''
  session.repair = -1
  session.pipHolding = false
  session.pebbleHolding = false
  session.paused = false
  session.complete = false
  session.toast = ''
  session.toastUntil = 0
  session.menuIndex = 0
  session.confirmRestart = false
  session.confirmIndex = 1
  session.requestRestart = false
  session.requestTitle = false
  session.requestReplay = false
}

export function showToast(text: string, ms = 2600): void {
  session.toast = text
  session.toastUntil = performance.now() + ms
}

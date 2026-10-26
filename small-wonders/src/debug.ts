import { session } from './session'
import { settings } from './settings'

export interface DebugApi {
  settings: typeof settings
  session: typeof session
  state: () => unknown
}

declare global {
  interface Window {
    __WONDERS__?: DebugApi
  }
}

export function publishDebug(state: () => unknown): void {
  window.__WONDERS__ = { settings, session, state }
}

import sessionStorage from '../session-storage/sessionStorage'
import isBrowser from './isBrowser'

/**
 * Overrides the `window.localStorage` with the bridge's `sessionStorage` (BOS Component's Storage)
 */
export const overrideLocalStorage = () => {
  class BridgeLocalStorage {
    setItem(key: string, value: any) {
      sessionStorage.setItem(key, value)
    }

    getItem(key: string) {
      return sessionStorage.getItem(key)
    }

    removeItem(key: string) {
      sessionStorage.removeItem(key)
    }
  }

  const myLocalStorage = new BridgeLocalStorage()

  // Assign the newly created instance to localStorage
  if (isBrowser()) {
    Object.defineProperty(window, 'localStorage', {
      value: myLocalStorage,
      writable: true,
    })
  }
}

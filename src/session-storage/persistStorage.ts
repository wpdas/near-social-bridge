import { getConnectionStatus } from '../services/bridge-service'
// import isLocalDev from '../utils/isLocalDev'
import sessionStorage, { sessionStorageUpdateObservable } from './sessionStorage'

let isLocalStorageAccessible = true

try {
  // just try to read it
  window.localStorage
} catch (error) {
  isLocalStorageAccessible = false
}

const setItem = (key: string, value: any) => {
  return new Promise<void>((resolve) => {
    // if (isLocalDev && isLocalStorageAccessible) {
    if (isLocalStorageAccessible) {
      resolve(localStorage.setItem(key, value))
    } else {
      resolve(sessionStorage.setItem(key, value))
    }
  })
}

const getItem = (key: string) => {
  return new Promise((resolve) => {
    // Local host: localStorage
    // if (isLocalDev && isLocalStorageAccessible) {
    if (isLocalStorageAccessible) {
      resolve(localStorage.getItem(key))
      return
    }

    // Near Social View host: sessionStorage
    if (getConnectionStatus() !== 'connected') {
      const handler = () => {
        sessionStorageUpdateObservable.unsubscribe(handler)
        resolve(sessionStorage.getItem(key))
      }

      sessionStorageUpdateObservable.subscribe(handler)
    } else {
      resolve(sessionStorage.getItem(key))
    }
  })
}

const removeItem = (key: string) => {
  return new Promise<void>((resolve) => {
    // if (isLocalDev && isLocalStorageAccessible) {
    if (isLocalStorageAccessible) {
      resolve(localStorage.removeItem(key))
    } else {
      resolve(sessionStorage.removeItem(key))
    }
  })
}

/**
 * Provides automatic Redux state persistence for session (this is the only way to persist data using Near Social View)
 */
const persistStorage = {
  setItem,
  getItem,
  removeItem,
}

export default persistStorage

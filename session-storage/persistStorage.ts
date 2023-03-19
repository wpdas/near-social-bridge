import { getConnectionStatus } from '@lib/services/bridge-service'
import isLocalDev from '@lib/utils/isLocalDev'
import sessionStorage, { sessionStorageUpdateObservable } from './sessionStorage'

const setItem = (key: string, value: any) => {
  return new Promise<void>((resolve) => {
    if (isLocalDev && localStorage) {
      resolve(localStorage.setItem(key, value))
    } else {
      resolve(sessionStorage.setItem(key, value))
    }
  })
}

const getItem = (key: string) => {
  return new Promise((resolve) => {
    // Local host: localStorage
    if (isLocalDev && localStorage) {
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
    if (isLocalDev && localStorage) {
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

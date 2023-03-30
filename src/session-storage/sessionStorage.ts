import { REQUEST_KEYS } from '../constants'
import request from '../request/request'
import { onConnectObservable } from '../services/bridge-service'
import Observable from '../utils/observable'

/**
 * Notify with the current storage data every time the storage is updated
 */
export const sessionStorageUpdateObservable: Observable<{}> = new Observable()

let _storage: any = {}

const setItem = (key: string, value: any) => {
  const updatedStorage: any = { ..._storage }
  updatedStorage[key] = value
  _storage = updatedStorage
  hydrateViewer()
}

const getItem = (key: string) => _storage[key] || null

const removeItem = (key: string) => {
  const updatedStorage: any = {}
  Object.keys(_storage).forEach((currentKey: any) => {
    if (key !== currentKey) {
      updatedStorage[currentKey] = _storage[currentKey]
    }
  })

  _storage = updatedStorage
  hydrateViewer()
}

const clear = () => {
  _storage = {}
  hydrateViewer()
}

const keys = () => Object.keys(_storage)

/**
 * This will hydrate the Viewer "sessionStorageClone" object with the current storage data present on the App (external app)
 */
const hydrateViewer = async () => {
  // Hydrate the Viewer "sessionStorageClone" state with External App _storage object
  await request(REQUEST_KEYS.SESSION_STORAGE_HYDRATE_VIEWER, _storage)
  sessionStorageUpdateObservable.notify(_storage)
}

/**
 * This method is automatically called every time the bridge connection is established
 */
const hydrate = async () => {
  // Request to hydrate the external app
  const view_sessionStorageClone = await request(REQUEST_KEYS.SESSION_STORAGE_HYDRATE_APP, undefined, {
    forceTryAgain: true,
  })

  // Hydrate _storage with data stored in the Viewer "sessionStorageClone" state
  _storage = view_sessionStorageClone || {}
  sessionStorageUpdateObservable.notify(_storage)
}

// Every time the bridge connection is established, hydrate the storage
onConnectObservable.subscribe(hydrate)

/**
 * Stores data for one session. Data is lost when the browser tab is reloaded or closed
 */
const sessionStorage = {
  setItem,
  getItem,
  removeItem,
  clear,
  keys,
}

export default sessionStorage

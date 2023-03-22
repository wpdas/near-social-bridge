import isLocalDev from '../utils/isLocalDev'
import Observable from '../utils/observable'

export type UserInfo = {
  accountId: string
  profileInfo: {
    backgroundImage?: {
      url?: string
    }
    description?: string
    name?: string
    image?: {
      ipfs_cid: string
    }
    linktree?: {
      github?: string
      twitter?: string
      telegram?: string
      website?: string
    }
    tags?: any
  }
}

export type ConnectionPayload = {
  /**
   * Initial path to be rendered. This is optionally provided by the Near Social View
   */
  initialPath?: string
  /**
   * User info
   */
  userInfo?: UserInfo
}

/**
 * pending: the service was not initialized yet. You need to call initBridgeService().
 * waiting-for-viewer-signal: the service was initialized and is waiting for a positive signal from Viewer
 * connected: the service has a connection with the Viewer
 */
export type BridgeServiceStatus = 'pending' | 'waiting-for-viewer-signal' | 'connected'

let viewSource: any
let status: BridgeServiceStatus = 'pending'
let connectionPayload: ConnectionPayload = {}

export const bridgeServiceObservable: Observable<MessageEvent<any>> = new Observable()
export const onConnectObservable: Observable<ConnectionPayload> = new Observable()

/**
 * Post message
 * @param message
 * @returns
 */
export const postMessage = (message: any) => {
  if (!viewSource && !isLocalDev) return console.warn('Message source was not initialized!')

  viewSource?.postMessage(message, '*')
}

/**
 * On get answer from the View
 * @param event
 */
const onGetMessage = (event: MessageEvent<any>) => {
  if (!viewSource && status === 'waiting-for-viewer-signal') {
    // Set the Messager source
    viewSource = event.source
    status = 'connected'

    // Save the welcome payload (connect)
    if (event.data.type === 'connect') {
      connectionPayload = event.data.payload
      onConnectObservable.notify(connectionPayload)

      // Successful connection message
      console.log('%c --- Near Social Bridge initialized ---', 'background: #282C34; color:#fff')
    }
  }

  // Notify all observers
  bridgeServiceObservable.notify(event)
}

/**
 * Get the payload provided by the connection
 * @returns
 */
export const getConnectionPayload = <P extends ConnectionPayload>() => connectionPayload as P

/**
 * Get the current connection status
 */
export const getConnectionStatus = () => status

/**
 * Init the service
 * @param viewMessageSource
 */
export const initBridgeService = () => {
  if (status === 'pending') {
    status = 'waiting-for-viewer-signal'
    window.addEventListener('message', onGetMessage, false)

    //DEV - clear observables when the app reload
    const handler = () => {
      bridgeServiceObservable.clear()
      onConnectObservable.clear()
      window.removeEventListener('unload', handler)
    }

    window.addEventListener('unload', handler)
  }
}

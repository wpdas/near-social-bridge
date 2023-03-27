import isLocalDev from '../utils/isLocalDev'
import Observable from '../utils/observable'

export type UserInfo = {
  accountId: string
  profileInfo?: {
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
  error?: string
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

  /**
   * Any initial payload provided by VM
   */
  initialPayload?: any
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

/**
 * When any message comes
 */
export const bridgeServiceObservable: Observable<MessageEvent<any>> = new Observable()

/**
 * When the connection is established
 */
export const onConnectObservable: Observable<ConnectionPayload> = new Observable()

// Message concurrency controll
let lastMsgSentAt = new Date()

/**
 * Post message
 * @param message
 * @returns
 */
export const postMessage = (message: any) => {
  if (!viewSource && !isLocalDev) {
    // Present helpful message
    return console.warn('Message source was not initialized!')
  }

  // Wait half second before sending the next message (avoid msg without answer)
  if (Math.abs(lastMsgSentAt.getTime() - Date.now()) / 1000 >= 0.5) {
    lastMsgSentAt = new Date()
    viewSource?.postMessage(message, '*')
  } else {
    lastMsgSentAt = new Date()
    setTimeout(() => {
      viewSource?.postMessage(message, '*')
    }, 500)
  }
}

/**
 * On get answer from the View
 * @param event
 */
const onGetMessage = (event: MessageEvent<any>) => {
  if (!viewSource && status === 'waiting-for-viewer-signal') {
    // Set the Messager source
    viewSource = event.source

    // Save the welcome payload (connect)
    if (event.data.type === 'connect') {
      status = 'connected'

      // Successful connection message
      console.log('%c --- Near Social Bridge initialized ---', 'background: #282C34; color:#fff')

      // Set initial last message sent time
      lastMsgSentAt = new Date()

      // Dispath notification: connection established
      connectionPayload = event.data.payload
      onConnectObservable.notify(connectionPayload)
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

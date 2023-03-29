import { initBridgeService, bridgeServiceObservable, postMessage } from '../services/bridge-service'
import isDevelopment from '../utils/isDevelopment'
import isLocalDev from '../utils/isLocalDev'
import { getMockedResponse, globalMock } from './mock'

export type ResponseData<D extends {}> = {
  from: 'external-app'
  type: 'connect' | 'answer'
  requestType: string // must be handled on the viewer side
  payload: D
}

/**
 * Build a request body
 * @param type Request type to be handled inside the View
 * @param payload Request payload
 * @returns
 */
export const buildRequestBody = (type: string, payload?: {}) => {
  return {
    from: 'external-app',
    type,
    payload,
  }
}

/**
 * Send a request to the Near Social View
 * @param requestType Request type to be handled inside the View (you can use `buildRequestBody` in order to
 * follow the pattern)
 * @param payload Any payload to be sent to the View
 * @param {forceTryAgain: boolean, timeout: number} options Force the request to re-try every <timeout> (default is 1 second)
 * @returns
 */
const request = <Data extends {}>(
  requestType: string,
  payload?: {},
  options?: { forceTryAgain?: boolean; timeout?: number }
) => {
  // Use mock? -> is dev, is local, the "requestType" has a mock
  if (isDevelopment && isLocalDev && globalMock[requestType]) {
    return getMockedResponse<Data>(requestType, payload)
  }

  // Go the regular way
  initBridgeService()

  return new Promise<Data>((resolve, reject) => {
    let gotPayload = false
    let tries = 0
    // Observe it till get the answer from the View
    const checkMessage = (e: MessageEvent<ResponseData<Data>>) => {
      if (e.data.type === 'answer' && e.data.requestType === requestType) {
        gotPayload = true
        resolve(e.data.payload)
        bridgeServiceObservable.unsubscribe(checkMessage)
      }
    }

    bridgeServiceObservable.subscribe(checkMessage)

    // Post Message
    const message = buildRequestBody(requestType, payload)
    postMessage(message)

    // Timer to try again
    const checkAndTryAgain = () => {
      setTimeout(() => {
        if (!gotPayload) {
          if (tries < 10) {
            tries++
            postMessage(message)
            checkAndTryAgain()
          } else {
            reject(`the Widget did not send a answer for request of type ${requestType}`)
          }
        }
      }, options?.timeout || 1000)
    }
    if (options?.forceTryAgain) {
      checkAndTryAgain()
    } else {
      // If !forceTryAgain, Reject if it doesnt has an answer in 10 seconds
      setTimeout(() => {
        reject(`the Widget did not send a answer for request of type ${requestType}`)
      }, 10000)
    }
  })
}

export default request

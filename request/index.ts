import { initBridgeService, bridgeServiceObservable, postMessage } from '../services/bridge-service'

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
 * @returns
 */
const request = <Data extends {}>(requestType: string, payload?: {}) => {
  initBridgeService()

  return new Promise<Data>((resolve) => {
    // Observe it till get the answer from the View
    const checkMessage = (e: MessageEvent<ResponseData<Data>>) => {
      if (e.data.type === 'answer' && e.data.requestType === requestType) {
        resolve(e.data.payload)
        bridgeServiceObservable.unsubscribe(checkMessage)
      }
    }

    bridgeServiceObservable.subscribe(checkMessage)

    // Post Message
    const message = buildRequestBody(requestType, payload)
    postMessage(message)
  })
}

export default request

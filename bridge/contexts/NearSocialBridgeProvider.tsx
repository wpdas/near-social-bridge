import React from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'
import {
  bridgeServiceObservable,
  initBridgeService,
  postMessage as postMessageService,
} from '../../services/bridge-service'
import { GetMessageCallBack, NearSocialBridgeProps } from '../types'

const defaultValue: NearSocialBridgeProps = {
  postMessage: () => {
    throw new Error('postMessage must be defined!')
  },
  onGetMessage: () => {
    throw new Error('onGetMessage must be defined!')
  },
  simulateIFrameMessage: () => {
    throw new Error('simulateIFrameMessage must be defined!')
  },
}

export const NearSocialBridgeContext = createContext(defaultValue)

interface Props {
  children: React.ReactNode
}

const NearSocialBridgeProvider: React.FC<Props> = ({ children }) => {
  const [_onGetMessage, set_onGetMessage] = useState<{
    cb: GetMessageCallBack
  }>({ cb: () => {} })

  /**
   * Post Message
   */
  const postMessage = useCallback((message: any) => {
    postMessageService(message)
  }, [])

  /**
   * Set the onGetMessage handler
   */
  const onGetMessage = useCallback((cb: any | null) => {
    set_onGetMessage({ cb })
  }, [])

  /**
   * Simulate the iframe's message prop to send a message to the external app
   */
  const simulateIFrameMessage = useCallback((message: any) => {
    // NOTE: experimental, should be tested
    window.top?.postMessage(message)
  }, [])

  useEffect(() => {
    // Set up the message receiver
    const handler = (event: MessageEvent<any>) => {
      if (_onGetMessage.cb && event.type === 'message') {
        _onGetMessage.cb(event)
      }
    }

    bridgeServiceObservable.subscribe(handler)

    // Init Bridge Service
    initBridgeService()

    return () => {
      bridgeServiceObservable.unsubscribe(handler)
    }
  }, [_onGetMessage])

  return (
    <NearSocialBridgeContext.Provider value={{ postMessage, onGetMessage, simulateIFrameMessage }}>
      {children}
    </NearSocialBridgeContext.Provider>
  )
}

export default NearSocialBridgeProvider

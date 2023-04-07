import React, { createContext, useCallback, useEffect, useState } from 'react'
import AuthProvider from '../../auth/contexts/AuthProvider'
import {
  bridgeServiceObservable,
  onConnectObservable,
  initBridgeService,
  postMessage as postMessageService,
} from '../../services/bridge-service'
import { GetMessageCallBack, NearSocialBridgeProps } from '../types'
import isDevelopment from '../../utils/isDevelopment'
import { initRefreshService } from '../../utils/refresh'
import Spinner from '../../components/Spinner'
import './fixBadIframe.css' // DON'T REMOVE

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
  fallback?: React.ReactNode
}

/**
 * Provides the Near Social Bridge features.
 *
 * Fallback component is displayed (if provided) until the connection is established with the Widget
 * @returns
 */
const NearSocialBridgeProvider: React.FC<Props> = ({ children, fallback }) => {
  const [_onGetMessage, set_onGetMessage] = useState<{
    cb: GetMessageCallBack
  }>({ cb: () => {} })
  const [isConnected, setIsConnected] = useState(false)

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

  // Get to know when the connection is established. The children is going to render after the connection
  useEffect(() => {
    const handler = () => {
      setIsConnected(true)
    }
    onConnectObservable.subscribe(handler)

    return () => {
      onConnectObservable.unsubscribe(handler)
    }
  }, [])

  if (!isConnected) {
    if (fallback) return <>{fallback}</>
    return <Spinner />
  }

  return (
    <NearSocialBridgeContext.Provider value={{ postMessage, onGetMessage, simulateIFrameMessage }}>
      <AuthProvider>{children}</AuthProvider>
    </NearSocialBridgeContext.Provider>
  )
}

export default NearSocialBridgeProvider

// DEV Utils features
if (isDevelopment) {
  initRefreshService()
}

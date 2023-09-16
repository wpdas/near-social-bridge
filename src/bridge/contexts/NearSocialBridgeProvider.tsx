'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import AuthProvider from '../../auth/contexts/AuthProvider'
import {
  bridgeServiceObservable,
  onConnectObservable,
  initBridgeService,
  postMessage as postMessageService,
} from '../../services/bridge-service'
import { GetMessageCallBack, NearSocialBridgeProps } from '../types'
import { sessionStorageUpdateObservable } from '../../session-storage/sessionStorage'

const defaultValue: NearSocialBridgeProps = {
  postMessage: () => {
    throw new Error('postMessage must be defined!')
  },
  onGetMessage: () => {
    throw new Error('onGetMessage must be defined!')
  },
}

export const NearSocialBridgeContext = createContext(defaultValue)

interface Props {
  children: React.ReactNode
  /**
   * Fallback component that's going to be shown until the connection with the BOS Component is established or the BOS Component response timeout is reached.
   */
  fallback?: React.ReactNode
  /**
   * Wait for storage to be hydrated before render the children. Fallback component is going to be shown if provided.
   */
  waitForStorage?: boolean
}

/**
 * Provides the Near Social Bridge features.
 *
 * Fallback component is displayed (if provided) until the connection is established with the BOS Component
 * @returns
 */
const NearSocialBridgeProvider: React.FC<Props> = ({ children, fallback, waitForStorage }) => {
  const [_onGetMessage, set_onGetMessage] = useState<{
    cb: GetMessageCallBack
  }>({ cb: () => {} })
  const [isConnected, setIsConnected] = useState(false)
  const [isStorageReady, setIsStorageReady] = useState(false)

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

  // Check if storage is ready
  if (waitForStorage) {
    const handler = () => {
      sessionStorageUpdateObservable.unsubscribe(handler)
      setIsStorageReady(true)
    }
    sessionStorageUpdateObservable.subscribe(handler)
  }

  // Wait connection
  if (!isConnected) {
    if (fallback) {
      return <>{fallback}</>
    }

    // SSR - It's necessary. So that, `overrideLocalStorage`, it's going to work without issue
    return <div />
  }

  // Wait storage to be ready (optional)
  if (waitForStorage && !isStorageReady) {
    if (fallback) {
      return <>{fallback}</>
    }

    // SSR - It's necessary. So that, `overrideLocalStorage`, it's going to work without issue
    return <div />
  }

  return (
    <NearSocialBridgeContext.Provider value={{ postMessage, onGetMessage }}>
      <AuthProvider>{children}</AuthProvider>
    </NearSocialBridgeContext.Provider>
  )
}

export default NearSocialBridgeProvider

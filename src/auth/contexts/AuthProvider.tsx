'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import { getConnectionPayload, getConnectionStatus, onConnectObservable, UserInfo } from '../../services/bridge-service'
import getUserInfo from '../getUserInfo'

type Auth = {
  user?: UserInfo
  /**
   * Request for complete user data completed?
   */
  ready: boolean
}

const defaultValue: Auth = {
  user: undefined,
  ready: false,
}

export const AuthContext = createContext(defaultValue)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>()
  const [ready, setReady] = useState(false)

  const fetchUserInfo = useCallback(() => {
    getUserInfo()
      .then((userInfo) => {
        if (!userInfo.error) {
          setUser(userInfo)
        }
        setReady(true)
      })
      .catch(() => {
        setReady(true)
      })
  }, [])

  // Set the initial user info
  const setPreUserInfo = useCallback(() => {
    const preUserInfo = getConnectionPayload().userInfo
    if (preUserInfo?.accountId) {
      setUser(preUserInfo)
    }
  }, [])

  // Fetch user info
  useEffect(() => {
    if (getConnectionStatus() === 'connected') {
      setPreUserInfo()
    }

    const onConnectHandler = () => {
      setPreUserInfo()

      onConnectObservable.unsubscribe(onConnectHandler)
      fetchUserInfo()
    }

    fetchUserInfo()

    onConnectObservable.subscribe(onConnectHandler)
    return () => {
      onConnectObservable.unsubscribe(onConnectHandler)
    }
  }, [fetchUserInfo, setPreUserInfo])

  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>
}

export default AuthProvider

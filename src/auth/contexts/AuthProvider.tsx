'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import { getConnectionPayload, onConnectObservable, UserInfo } from '../../services/bridge-service'
import getUserInfo from '../getUserInfo'

type Auth = {
  user?: UserInfo
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

  // Fetch user info
  useEffect(() => {
    // Set the initial user info
    const preUserInfo = getConnectionPayload().userInfo
    if (preUserInfo) {
      setUser(preUserInfo)
    }

    const onConnectHandler = () => {
      onConnectObservable.unsubscribe(onConnectHandler)
      fetchUserInfo()
    }

    fetchUserInfo()

    onConnectObservable.subscribe(onConnectHandler)
    return () => {
      onConnectObservable.unsubscribe(onConnectHandler)
    }
  }, [fetchUserInfo])

  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>
}

export default AuthProvider

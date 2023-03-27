import React, { createContext, useEffect, useState } from 'react'
import request from '../../request'
import { REQUEST_KEYS } from '../../constants'
import { getConnectionStatus, onConnectObservable, UserInfo } from '../../services/bridge-service'
import isLocalDev from '../../utils/isLocalDev'

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

  // Fetch user info
  useEffect(() => {
    const onConnectHandler = () => {
      onConnectObservable.unsubscribe(onConnectHandler)
      setTimeout(() => {
        request<UserInfo>(REQUEST_KEYS.AUTH_GET_USER_INFO).then((userInfo) => {
          if (!userInfo.error) {
            setUser(userInfo)
          }
          setReady(true)
        })
      }, 1000)
    }

    // If it's connected already, just get the info
    // TODO: Refactor, this is the same code present above
    if (getConnectionStatus() === 'connected') {
      request<UserInfo>(REQUEST_KEYS.AUTH_GET_USER_INFO).then((userInfo) => {
        if (!userInfo.error) {
          setUser(userInfo)
        }
        setReady(true)
      })
    }

    // If it's DEV
    if (isLocalDev) {
      setReady(true)
    }

    onConnectObservable.subscribe(onConnectHandler)
    return () => {
      onConnectObservable.unsubscribe(onConnectHandler)
    }
  }, [])

  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>
}

export default AuthProvider

import React, { createContext, useEffect, useState } from 'react'
import request from '../../request'
import { REQUEST_KEYS } from '../../constants'
import { getConnectionStatus, onConnectObservable, UserInfo } from '../../services/bridge-service'

type Auth = {
  user?: UserInfo
}

const defaultValue: Auth = {
  user: undefined,
}

export const AuthContext = createContext(defaultValue)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>()
  // TODO: add "ready" to use inside Navigation, show fallback til this is true

  // Fetch user info
  useEffect(() => {
    const onConnectHandler = () => {
      onConnectObservable.unsubscribe(onConnectHandler)
      request<UserInfo>(REQUEST_KEYS.AUTH_GET_USER_INFO).then((userInfo) => setUser(userInfo))
    }

    // If it's connected already, just get the info
    if (getConnectionStatus() === 'connected') {
      request<UserInfo>(REQUEST_KEYS.AUTH_GET_USER_INFO).then((userInfo) => setUser(userInfo))
    }

    onConnectObservable.subscribe(onConnectHandler)
    return () => {
      onConnectObservable.unsubscribe(onConnectHandler)
    }
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export default AuthProvider

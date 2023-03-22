import React, { createContext, useEffect, useState } from 'react'
import { getConnectionPayload, onConnectObservable, UserInfo } from '../../services/bridge-service'

type Auth = {
  user?: UserInfo
}

const defaultValue: Auth = {
  user: undefined,
}

export const AuthContext = createContext(defaultValue)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>()

  // Fetch user info
  useEffect(() => {
    const onConnectHandler = () => {
      const userInfo = getConnectionPayload().userInfo
      setUser(userInfo)
    }

    onConnectObservable.subscribe(onConnectHandler)
    return () => {
      onConnectObservable.unsubscribe(onConnectHandler)
    }
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export default AuthProvider

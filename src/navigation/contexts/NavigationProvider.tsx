'use client'

import getPathParams from '../../utils/getPathParams'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { HistoryProps, NavigationProps, ParamListBase } from '../types'
import { Storage } from '../../api'

const NAVIGATION_PROPS_KEY = 'NAVIGATION_PROPS'

const defaultValue: NavigationProps<ParamListBase> = {
  push: () => {
    throw new Error('push must be defined!')
  },
  goBack: () => {
    throw new Error('goBack must be defined!')
  },
  replace: () => {
    throw new Error('replace must be defined!')
  },
  location: [],
  history: [],
  ready: false,
}

export const NavigationContext = createContext(defaultValue)

type NavigationProviderProps = {
  children: React.ReactNode
  /**
   * Should load the page according to the provided path?
   * You must wrap this Provider with the NearSocialBridgeProvider!
   * This is going to use the `urlParams` prop provided during the connection between the Viewer and this App
   *
   * Make sure you are passing thrhoug `urlParams` with the welcomePayload, e.g:
   *
   * SETUP: [Navigation] Get URL params
   * const urlParams = props.r;
   *
   * const welcomePayload = {
   *  type: "connect",
   *  payload: {
   *    urlParams
   * }
   *
   * SETUP: Set initial state
   * State.init({ currentMessage: welcomePayload });
   *
   */
  useCurrentPath?: boolean
}

/**
 * DEV - Used to keep the same route when the app is reloaded after the developer
 * makes change to the app code.
 *
 * This prop is used by the `createStackNavigator` method
 */
export let initialRoute: string | undefined = undefined

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  // DEV
  if (!initialRoute) {
    initialRoute = getPathParams()[0]
  }

  // navigation handler
  const [history, setHistory] = useState<HistoryProps[]>([])
  const [ready, setReady] = useState(false)

  // Load stored history
  useEffect(() => {
    Storage.get<string>(NAVIGATION_PROPS_KEY).then((storedHistory) => {
      setHistory(storedHistory ? JSON.parse(storedHistory) : [])
      setReady(true)
    })
  }, [])

  // Handle window location hash changes
  useEffect(() => {
    const handler = () => {
      const currentRoute = getPathParams()[0]

      // Check if the current path is the penultimate in the history, if so, remove the last one in the history
      const penultimateHistoryPath = history.at(-2)?.[0] || ''
      if (penultimateHistoryPath.toLowerCase() === currentRoute) {
        const updatedHistory = [...history.slice(0, history.length - 1)]
        setHistory(updatedHistory)
      }
    }

    window.addEventListener('hashchange', handler)

    return () => {
      window.removeEventListener('hashchange', handler)
    }
  }, [history])

  const push = useCallback(
    (screen: keyof ParamListBase, params?: {}) => {
      // Prevent to the same screen in line & history is ready
      if (history.at(-1)?.[0] !== screen && ready) {
        const updatedHistory = [...history]
        updatedHistory.push([screen, params])
        setHistory(updatedHistory)
        Storage.set(NAVIGATION_PROPS_KEY, JSON.stringify(updatedHistory))
      }
    },
    [history, ready]
  )

  const replace = useCallback((screen: keyof ParamListBase, params?: {}) => {
    setHistory([[screen, params]])
    Storage.set(NAVIGATION_PROPS_KEY, JSON.stringify([[screen, params]]))
  }, [])

  const goBack = useCallback(() => {
    const updatedHistory = [...history.slice(0, history.length - 1)]

    if (updatedHistory && updatedHistory.length > 0) {
      setHistory(updatedHistory)
      Storage.set(NAVIGATION_PROPS_KEY, JSON.stringify(updatedHistory))
    }
  }, [history])

  return (
    <NavigationContext.Provider
      value={{ push, goBack, replace, location: history.at(-1) as HistoryProps, history, ready }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider

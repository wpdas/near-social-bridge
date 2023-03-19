import getPathParams from '@lib/utils/getPathParams'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { HistoryProps, NavigationProps, ParamListBase } from '../types'

const defaultValue: NavigationProps<ParamListBase> = {
  push: () => {
    throw new Error('push must be defined!')
  },
  goBack: () => {
    throw new Error('goBack must be defined!')
  },
  location: [],
  history: [],
}

export const NavigationContext = createContext(defaultValue)

const updateBrowserUrl = (screenName: string) => {
  const windowHistory = window.history
  windowHistory.pushState({}, '', `#/${screenName.toLowerCase()}`)
}

type NavigationProviderProps = {
  children: React.ReactNode
  /**
   * Should load the page according to the provided path?
   * You must wrap this Provider with the NearSocialBridgeProvider!
   * This is going to use the `urlParams` prop provided during the connection between the Viewer and this App
   *
   * Make sure you are passing thrhoug `urlParams` with the welcomePayload, e.g:
   *
   * // SETUP: [Navigation] Get URL params
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
      const updatedHistory = [...history]
      updatedHistory.push([screen, params])
      setHistory(updatedHistory)
      updateBrowserUrl(screen)
    },
    [history]
  )

  const goBack = useCallback(() => {
    const updatedHistory = [...history.slice(0, history.length - 1)]

    if (updatedHistory && updatedHistory.length > 0) {
      setHistory(updatedHistory)
      const screen = updatedHistory.at(-1)?.[0]
      if (screen) {
        updateBrowserUrl(screen)
      }
    }
  }, [history])

  return (
    <NavigationContext.Provider value={{ push, goBack, location: history.at(-1) as HistoryProps, history }}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider

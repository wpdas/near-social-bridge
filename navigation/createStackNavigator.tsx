import {
  onConnectObservable,
  ConnectionPayload,
  getConnectionPayload,
  getConnectionStatus,
} from '@lib/services/bridge-service'
import getHostname from '@lib/utils/getHostname'
import getPathParams from '@lib/utils/getPathParams'
import React, { useCallback, useEffect, useState } from 'react'
import NavigationProvider, { initialRoute } from './contexts/NavigationProvider'
import useNavigation from './hooks/useNavigation'
import { syncContentHeight } from './syncContentHeight'
import { ParamListBase, Route } from './types'

/**
 * Create and provides a Navigator (Routes controler) and Screen (Route component).
 * You can provide a fallback component. If it's provided, it'll be shown until the connection
 * with the Viewer is established
 *
 * @param fallback Fallback component. If provided, it'll be shown until the connection
 * with the Viewer is established
 * @returns
 */
const createStackNavigator = function <T extends ParamListBase>(fallback?: React.ReactNode) {
  /**
   * Navigator Component (Routes controler)
   *
   * - This will send the content height (using Screen iframeHeight prop) to the iframe automatically, so that, the iframe will fit the right size
   *
   * @param param0
   * @returns
   */
  const Navigator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isReady, setIsReady] = useState(false)
    const navigation = useNavigation()
    const [screens] = useState(children as any[])
    const [currentScreen, setCurrentScreen] = useState<any>()

    const findScreenAndPopulateProps = useCallback((route?: string) => {
      const pathParams = route ? route.split('/') : []
      const routeParams = pathParams.slice(2)

      // Params to be mapped
      const params: any = {}

      // Search for the Screen by path
      const urlPath = pathParams[1]
      const foundScreen = screens.find((screen) => screen.props.name.toLowerCase() === urlPath)

      if (foundScreen) {
        if (foundScreen.props.pathParams) {
          // Map the props
          const foundScreenParamsKeys: [] = foundScreen.props.pathParams.split('/:').slice(1)

          foundScreenParamsKeys.forEach((key, index) => {
            params[key] = routeParams[index] || undefined
          })
        }

        // Set this screen (found by path) as the first to be rendered
        navigation.push(foundScreen.props.name)
      } else {
        // Set the first screen in the stack
        const firstChildName = screens[0].props.name
        navigation.push(firstChildName)
      }
    }, [])

    useEffect(() => {
      // Internal path (executing inside the iframe or local browser during development)
      const route = getConnectionPayload().initialPath || `/${initialRoute}` || undefined
      findScreenAndPopulateProps(route)
    }, [])

    useEffect(() => {
      // Use the bridge service to set the initial page
      // Wait the Viewer connection before rendering the page. Shows the fallback component while waiting.
      const handler = (connectionPayload: ConnectionPayload) => {
        const route = connectionPayload.initialPath
        findScreenAndPopulateProps(route)
        setIsReady(true)
      }

      if (getConnectionStatus() === 'connected') {
        setIsReady(true)
      }

      onConnectObservable.subscribe(handler)

      // DEV
      if (getHostname() === 'localhost') {
        handler({ initialPath: `/${initialRoute}` })
      }

      return () => {
        onConnectObservable.unsubscribe(handler)
      }
    }, [])

    /**
     * Send the content height to the iframe, so that it can fit the content properly
     */
    useEffect(() => {
      if (currentScreen?.props?.iframeHeight) {
        const screenElementContentHeight = currentScreen.props.iframeHeight

        // Sync Height
        syncContentHeight(screenElementContentHeight)
      }
    }, [currentScreen])

    // Handle the current screen
    useEffect(() => {
      const _currentScreen = screens.find((screen) => screen.props.name === navigation.location?.[0]) || null
      setCurrentScreen(_currentScreen)
    }, [navigation.location, screens])

    // Handle window location hash changes
    useEffect(() => {
      const handler = (event: HashChangeEvent) => {
        const currentRoute = getPathParams(event.newURL)[0]
        // Reset the screen
        const _currentScreen = screens.find((screen) => screen.props.name.toLowerCase() === currentRoute) || null
        if (_currentScreen) {
          setCurrentScreen(_currentScreen)
        }
      }

      window.addEventListener('hashchange', handler)

      return () => {
        window.removeEventListener('hashchange', handler)
      }
    }, [screens])

    // Shows the Fallback component while waiting for the connection
    if (!isReady) return fallback ? <>{fallback}</> : null

    return <>{currentScreen}</>
  }

  const WrappedNavigator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <NavigationProvider>
        <Navigator>{children}</Navigator>
      </NavigationProvider>
    )
  }

  /**
   * Screen Component (Route)
   *
   * @param param0
   * @returns
   */
  const Screen: React.FC<Route<keyof T>> = ({ key, name, component, pathParams }) => {
    const navigation = useNavigation()
    const Component = component

    // Internal path (executing inside the iframe)
    const url = new URL(window.location.href)
    const path = url.searchParams.get('r')

    return (
      <div id="nsb-navigation-screen">
        <Component
          {...{
            navigation,
            route: {
              key,
              name,
              params: { ...navigation.location[1] },
              path,
              pathParams,
            },
          }}
        />
      </div>
    )
  }

  return {
    Navigator: WrappedNavigator,
    Screen,
  }
}

export default createStackNavigator

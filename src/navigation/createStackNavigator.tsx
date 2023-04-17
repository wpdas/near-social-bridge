import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import {
  onConnectObservable,
  ConnectionPayload,
  getConnectionPayload,
  getConnectionStatus,
} from '../services/bridge-service'
import getHostname from '../utils/getHostname'
import getPathParams from '../utils/getPathParams'
import NavigationProvider, { initialRoute } from './contexts/NavigationProvider'
import useNavigation from './hooks/useNavigation'
import { ParamListBase, Route } from './types'
import { useAuth } from '../auth'
import { syncContentHeight } from './syncContentHeight'
import isBrowser from '../utils/isBrowser'

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
   * - use `autoHeightSync` to make it sync the iframe's height with the content's height.
   *
   * @returns
   */
  const Navigator: React.FC<{ children: React.ReactNode; autoHeightSync?: boolean }> = ({
    children,
    autoHeightSync,
  }) => {
    const auth = useAuth()
    const [isReady, setIsReady] = useState(false)
    const navigation = useNavigation()

    const [screens, setScreens] = useState<any[]>()

    const getScreens = useCallback(() => {
      // Get the Screen childrens
      const mainChildren = children as any
      let finalChildren: any

      // A list of Screen components wrapped with <></>
      if (mainChildren.props?.children?.length) {
        finalChildren = mainChildren.props?.children
        // A unique Screen component wrapped with <></>
      } else if (mainChildren.props?.children?.props?.name) {
        finalChildren = [mainChildren.props?.children]
        // A list of Screen components
      } else if (mainChildren.length) {
        finalChildren = mainChildren
        // Theres only one Screen component
      } else if (mainChildren.props?.name) {
        finalChildren = [mainChildren]
      }

      if (!finalChildren) {
        throw new Error('You have to provide at least one Screen!')
      }

      return finalChildren
    }, [children])

    // Initialize the current screen using the first child of the list of screens
    const [currentScreen, setCurrentScreen] = useState<any>(getScreens()[0])

    useEffect(() => {
      // Get the Screen childrens
      const screensList = getScreens()

      setScreens(screensList)
    }, [getScreens])

    const findScreenAndPopulateProps = useCallback(
      (route?: string) => {
        if (!screens) return

        const pathParams = route ? route.split('/') : []
        const routeParams = pathParams.slice(2)

        // Params to be mapped
        const params: any = {}

        // Search for the Screen by path
        const urlPath = pathParams[1]
        const foundScreen = screens.find((screen: any) => screen.props.name.toLowerCase() === urlPath)

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
      },
      [screens]
    )

    useEffect(() => {
      // Internal path (executing inside the iframe or local browser during development)
      const route = getConnectionPayload().initialPath || `/${initialRoute}` || undefined
      findScreenAndPopulateProps(route)
    }, [findScreenAndPopulateProps])

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
    }, [findScreenAndPopulateProps])

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

    /**
     * Get the content height and set it automatically to the iframe's height
     */
    useEffect(() => {
      if (currentScreen && isReady && auth.ready && autoHeightSync) {
        // Send the content height to the core.js
        syncContentHeight()
      }
    }, [currentScreen, isReady, auth.ready, autoHeightSync])

    // Handle the current screen
    useEffect(() => {
      if (!screen) return

      const _currentScreen = screens?.find((screen: any) => screen.props.name === navigation.location?.[0]) || null
      if (!currentScreen && _currentScreen) {
        setCurrentScreen(_currentScreen)
      }

      if (currentScreen?.props?.name !== _currentScreen?.props?.name) {
        setCurrentScreen(_currentScreen)
      }
    }, [navigation.location, screens, currentScreen])

    // Handle window location hash changes
    useEffect(() => {
      const handler = (event: HashChangeEvent) => {
        if (!screen) return

        const currentRoute = getPathParams(event.newURL)[0]
        // Reset the screen
        const _currentScreen = screens?.find((screen: any) => screen.props.name.toLowerCase() === currentRoute) || null
        if (_currentScreen) {
          setCurrentScreen(_currentScreen)
        }
      }

      window.addEventListener('hashchange', handler)

      return () => {
        window.removeEventListener('hashchange', handler)
      }
    }, [screens])

    // Shows the Fallback component while waiting for the connection and
    if (fallback) {
      if (!isReady || !auth.ready) return <>{fallback}</>
    }

    return <>{currentScreen}</>
  }

  /**
   * Navigator
   *
   * - use `autoHeightSync` to make it sync the iframe's height with the content's height.
   */
  const WrappedNavigator: React.FC<{ children: React.ReactNode; autoHeightSync?: boolean }> = ({ children }) => {
    return (
      <NavigationProvider>
        <Navigator autoHeightSync>{children}</Navigator>
      </NavigationProvider>
    )
  }

  /**
   * Screen Component (Route)
   *
   * @returns
   */
  const Screen: React.FC<Route<keyof T>> = ({ key, name, component, pathParams }) => {
    const navigation = useNavigation()
    const [params, setParams] = useState<any>()

    // Set params
    useLayoutEffect(() => {
      if (navigation?.location && !params) {
        setParams(navigation.location[1])
      }
    }, [navigation.location, params])

    const Component = component

    // Internal path (executing inside the iframe)
    let path: string | null = null
    if (isBrowser()) {
      const url = new URL(window.location.href)
      path = url.searchParams.get('r')
    }

    return (
      <div id="nsb-navigation-screen">
        <Component
          {...{
            navigation,
            route: {
              key,
              name,
              params: params ? { ...params } : {},
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

// Screen name, Params
export type HistoryProps = [keyof ParamListBase, {} | undefined]

export interface NavigationProps<S extends ParamListBase> {
  /**
   * Push new Screen
   * @param args
   */
  push<RouteName extends keyof S>(
    ...args: undefined extends S[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: S[RouteName]]
      : [screen: RouteName, params: S[RouteName]]
  ): void

  /**
   * Go to the previous screen
   * @returns
   */
  goBack: () => void

  /**
   * Current location props [screen name, props]
   */
  location: HistoryProps | []

  /**
   * An array containing the history of locations visited [[screen name, props], [screen name, props], ...]
   */
  history: HistoryProps[]
}

// Screen Input params
export declare type Route<RouteName> = Readonly<{
  /**
   * Unique key for the route.
   */
  key?: string
  /**
   * DEPRECATED (height is sync automatically now) - Height to sync with the Near Social Viewer Iframe
   */
  iframeHeight?: number
  /**
   * User-provided name for the route.
   */
  name: RouteName
  /**
   * Components to serve as page
   */
  component: React.ComponentType<any>
  /**
   * Path params associated with the route.
   * e.g: /:id/:name
   */
  pathParams?: string
}>

// Screen available props
export declare type ScreenRoute<RouteName, Params extends object | undefined = object | undefined> = Readonly<{
  /**
   * Unique key for the route.
   */
  key?: string
  /**
   * User-provided name for the route.
   */
  name: RouteName
  /**
   * Params provided internally between Screens. When calling navigation.push("Page-Name", {params: ...})
   */
  params: Params
  /**
   * Path associated with the route.
   * Usually present when the screen was opened from a deep link.
   */
  path: string
  /**
   * Path params associated with the route.
   * e.g: /:id/:name
   */
  pathParams?: string
}>

export declare type ParamListBase = Record<string, object | undefined>

declare type Keyof<T extends {}> = Extract<keyof T, string>

export type IFrameStackNavigationProp<ParamListBase> = {
  /**
   * Push new Screen
   * @param args
   */
  push<RouteName extends keyof ParamListBase>(
    ...args: undefined extends ParamListBase[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: ParamListBase[RouteName]]
      : [screen: RouteName, params: ParamListBase[RouteName]]
  ): void

  /**
   * Go to the previous screen
   * @returns
   */
  goBack: () => void

  /**
   * Current location props [screen name, props]
   */
  location: HistoryProps | []

  /**
   * An array containing the history of locations visited [[screen name, props], [screen name, props], ...]
   */
  history: HistoryProps[]
}

export declare type RouteProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = Keyof<ParamList>
> = Route<Extract<RouteName, string>>

// Used inside each Screen
export declare type ScreenRouteProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = Keyof<ParamList>
> = ScreenRoute<Extract<RouteName, string>, ParamList[RouteName]>

export declare type IFrameStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {
  navigation: IFrameStackNavigationProp<ParamList>
  route: ScreenRouteProp<ParamList, RouteName>
}

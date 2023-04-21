# <img src='./md/near-social-bridge-logo.png' height='24' alt='NEAR Social Bridge Logo' /> NEAR Social Bridge

[![Build Status](https://img.shields.io/github/actions/workflow/status/wpdas/near-social-bridge/publish.yml?style=for-the-badge&colorB=000000)](https://github.com/wpdas/near-social-bridge/actions?query=workflow%3Apublish)
[![Build Size](https://img.shields.io/bundlephobia/minzip/near-social-bridge/1.0.1?label=bundle%20size&style=for-the-badge&colorB=000000)](https://bundlephobia.com/package/near-social-bridge)
[![Version](https://img.shields.io/npm/v/near-social-bridge?style=for-the-badge&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)
[![Downloads](https://img.shields.io/npm/dt/near-social-bridge.svg?style=for-the-badge&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)

This library allows you to create a common application using ReactJS and inject it in a controlled way into a Widget on Near Social. Therefore, the Widget talks to the React application and vice versa, making it possible to consume Discovery API resources within the React application.

Library intended only for applications that will run within [Near Social](https://alpha.near.org/)

**Client-side render example: [ChatV2 Widget Repo](https://github.com/wpdas/chatv2-near-widget-app)**

**Server-side render example: [NextJS Widget Repo](https://github.com/wpdas/nextjs-near-widget-app)**

## Install

Install it using npm or yarn:

```sh
# npm
npm install near-social-bridge

# yarn
yarn add near-social-bridge
```

## Table of contents

- [Setup](#setup)
- [Requests](#requests)
  - [Simple Request](#simple-request)
  - [Create Requests Mocks](#create-requests-mocks)
  - [Handling the requests inside the Widget](#handling-the-requests-inside-the-widget)
  - [Using request handler Utils - Widget side](#using-request-handler-utils-widget-side)
  - [Requests - Knowing more](#requests---knowing-more)
- [Mock](#mock)
  - [Setup Mocks](#setup-mocks)
  - [Mock Authenticated User](#mock-authenticated-user)
  - [Mock Initial Payload](#mock-initial-payload)
  - [Create Requests Mocks - revisit](#create-requests-mocks-revisit)
- [Use Navigation](#use-navigation)
  - [Implementing routes](#implementing-routes)
- [Session Storage](#session-storage)
- [Persist Storage](#persist-storage)
- [Hooks](#hooks)
  - [useNearSocialBridge](#usenearsocialbridge)
  - [useInitialPayload](#useinitialpayload)
  - [useNavigation](#usenavigation)
  - [useSessionStorage](#usesessionstorage)
  - [useAuth](#useauth)
  - [useWidgetView](#usewidgetview)
  - [useSyncContentHeight](#usesynccontentheight)
- [Utils](#utils)
  - [initRefreshService](#initrefreshservice)
  - [overrideLocalStorage](#overridelocalstorage)
- [Preparing a new Widget](#preparing-a-new-widget)
- [Good to know](#good-to-know)
  - [Server-Side Rendering](#server-side-rendering)
- [Testing the Application Inside the Widget](#testing-the-application-inside-the-widget)

## Setup

You should import the `near-social-bridge.css` to your application.

```tsx
import 'near-social-bridge/near-social-bridge.css'
```

Then, you need to wrap your app with `NearSocialBridgeProvider` which will start the connection between the React App and the Widget inside Near Social. The connection only occurs when the application is running inside the Widget.

This component accepts a fallback component that's going to be shown until the connection with the Widget is established or the Widget response timeout is reached. You can set it using the `fallback` prop.

If your app is using (or has dependencies using) `localStorage` you'll need to override the `window.localStorage` with the Widget's `Storage` API as `localStorage` is not supported by the VM. You can do it using `overrideLocalStorage` like so:

```tsx
import { overrideLocalStorage } from 'near-social-bridge/utils'
overrideLocalStorage()
```

When using `overrideLocalStorage`, it's recommended that you set `NearSocialBridgeProvider.waitForStorage` as `true`, so that, the bridge is going to wait for the storage to be hydrated before rendering the children.

```tsx
import { NearSocialBridgeProvider, Spinner, overrideLocalStorage } from 'near-social-bridge'
import 'near-social-bridge/near-social-bridge.css'

overrideLocalStorage()

// ...
return (
  <NearSocialBridgeProvider waitForStorage fallback={<Spinner />}>
    <App />
  </NearSocialBridgeProvider>
)
```

## Requests

You can make requests to the Widget and each request must be handled appropriately by the Widget. You can also mock your requests so that they work locally while you are developing the application. All mocks will be automatically disabled when the app is running inside the Widget.

### Simple Request

```ts
import { request } from 'near-social-bridge'

// service
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload)

// using the service
getRoomsList({ limit: 2 })
  .then((response) => console.log(response))
  // Error: when not connected to the widget | has no mock | handler not found inside the Widget
  .catch((error) => console.error(error))
```

### Create Requests Mocks

This resource is extremely useful, as it allows you to simulate the contract of your application's requests, making it fully work locally. Therefore, you can create the handlers inside the Widget only when you start running the app inside the Widget.

Mock the _"get-rooms-list"_ request:

```ts
import { createMock } from 'near-social-bridge'

const rooms = ['room-1', 'room-2', 'room-3', 'room-4']
const getRoomsListMock = (payload: { limit: number }) => {
  return {
    // always use immutable pattern
    roomsList: [...rooms.slice(0, payload.limit)],
  }
}

// Create mock
createMock('get-rooms-list', getRoomsListMock)
```

Then in the app (running locally):

```ts
// service
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload)

// using the service
getRoomsList({ limit: 2 }).then((response) => console.log(response)) // ['room-1', 'room-2']
```

### Handling the requests inside the Widget

Then, when you test the app inside the widget, the mocks will be automatically disabled. Create a handler for each type of request:

```js
const requestHandler = (request, response) => {
  switch (request.type) {
    case 'get-rooms-list':
      getRoomsListHandler(request, response)
      break
  }
}

const getRoomsListHandler = (request, response) => {
  const { limit } = request.payload;
  // ... use Discovery API to fetch rooms list
  const rooms = Storage.privateGet("app:rooms-list"),
  // ... some logic
  response(request).send({ roomsList: rooms.slice(0, limit) });
};
```

### Using request handler Utils (Widget side)

In the Widget side, the handler is going to provide 3 props: `request` with its type and payload, `response` that is the way the app send a answer back to the React App and `utils` that provides some useful features like the `promisify`.

The `promisify` needs 4 parameters: `caller` which is going to request something, `resolve`, a method that is going to be called as soon as the _caller_ find an answer, `reject`, method that will be called when the service times out and `timeout`, a optional parameter where you can set the timeout for this promise. The default timeout is 10 seconds.

So, promisify implementation is

```ts
promisify(caller: () => any, resolve: () => void, reject: () => void, timeout: number)
```

Example of using the promisify feature inside the Widget:

```js
const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case 'get-rooms-list':
      getRoomsListHandler(request, response, Utils)
      break
  }
}

const getRoomsListHandler = (request, response, Utils) => {
  const { limit } = request.payload

  Utils.promisify(
    // Cached data (may take a while to return a value)
    () => Storage.privateGet('app:rooms-list'),
    (rooms) => {
      // Send the rooms list
      response(request).send({ roomsList: rooms.slice(0, limit) })
    }
  )
}
```

### Requests - Knowing more

Sometimes more than one request can be sent simultaneously. The library automatically controls request concurrency, however, you can force a request to be re-executed until a response is obtained. A maximum of 10 rerun attempts will be made. To use this function, just set `forceTryAgain` in the options to `true`.

```ts
import { request } from 'near-social-bridge'

// service
const options = { forceTryAgain: true }
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload, options)

// using the service
getRoomsList({ limit: 2 }).then((response) => console.log(response))
// Now, if for some reason this call does not get a response, new attempts to request the data will be made.
```

## Mock

As said before, the mock features can help you a lot while developing the app locally. Below are some more useful resources.

### Setup Mocks

You can configure how the mock will handle the requests. The only prop available is `delay` where you can set the delay before sending an answer for each request (simulates async call).

```ts
setupMock({ delay: 1000 })
// From now on, each mock request is going to take 1 second to get an answer.
```

### Mock Authenticated User

Use `mockUser` to mock authenticated user. You can use `createMockUser()` method to provide the user object.

```ts
import { createMockUser, mockUser } from 'near-social-bridge'

// You can optionally set default data. All the data is randomly generated.
const fakeUser = createMockUser({ firstName: 'Wenderson' })
mockUser(fakeUser)
// Now your app has an "authenticated" user
```

### Mock Initial Payload

Use `mockInitialPayload` to mock the initial payload (sent by the Widget).

```ts
// Mock
import { mockInitialPayload } from 'near-social-bridge'

mockInitialPayload({
  defaultRoom: 'dragon-ball-z',
})

// App
import { useInitialPayload } from 'near-social-bridge/hooks'

const MyComponent = () => {
  const { defaultRoom } = useInitialPayload() // 'dragon-ball-z'
}
```

### Create Requests Mocks (revisit)

You can revisit this session [here](#create-requests-mocks).

## Use Navigation

This feature was created to facilitate data passing between routes as the main domain will always be https://near.social or another fixed domain. It'll also maintain the same route after a page refresh during the development process. Please note that you will still be able to use any other routing solution.

To force the app to start in a specific route, you should set a `path` parameter like so `https://near.social/#/wendersonpires.near/widget/MyWidget?path=/profile` where the `?path=` is the param with the route value. E.g: `?path=/timeline`.

### Implementing routes

You can optionally create properties for each route. It will be useful for you to have a typed `navigation` and `route` object.

```ts
import { IFrameStackScreenProps } from 'near-social-bridge/navigation'

// Navigation props
export type NavigationProps = {
  Home: {
    title?: string
  }
  Profile: {
    ipfsCidAvatar?: string
    userName?: string
  }
}

// Screen props
export type PreHomeScreenProps = IFrameStackScreenProps<NavigationProps, 'Home'>
export type ProfileScreenProps = IFrameStackScreenProps<NavigationProps, 'Profile'>
```

Use the `createStackNavigator` method to receive the `Navigator` and `Screen` components. They will be used to manage each screen.

You can also set a fallback component to show while the connection is being established.

```tsx
import { createStackNavigator } from 'near-social-bridge/navigation'
import { Spinner } from 'near-social-bridge'
import { NavigationProps } from './NavigationProps'

// Optional Fallback Loading component to show while the connection is being established. Using
// Spinner component provided by the lib

const { Navigator, Screen } = createStackNavigator<NavigationProps>(<Spinner />)
```

When using `Navigator` with `autoHeightSync` set as `true`, the height of the iframe is automatically adjusted to the initial screen content. If more content is inserted inside the screen after the first render, you can use [`useSyncContentHeight`](#usesynccontentheight) hook to sync the height again.

The `Screen` component allows you to pass some useful properties, one of them is the `iframeHeight` which will set the initial iframe's height needed to show this screen within the Widget even before the first render. If `Navigator` was called with `autoHeightSync`, the height is going to be adjusted automatically when the screen content is rendered.

```tsx
return (
  <Navigator autoHeightSync>
    <Screen name="Home" component={Home} iframeHeight={420} />
    <Screen name="Profile" component={Profile} />
  </Navigator>
)
```

You can use the `route` property injected into each `Screen` to access the passed properties as well as use `navigation` to go to another route. It is possible to use the `useNavigation` hook to get access to some route resources.

```tsx
const Profile: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { ipfsCidAvatar, userName } = route.params
  //...
  const goToHomeHandler = () => {
    // push new Screen sending data
    navigation.push('Home', { title: 'My Nice App!' })
  }
}
```

## Session Storage

This feature stores data for one session. While testing inside a Widget, data is lost when the browser tab is reloaded or closed. You will have access to methods like `setItem`, `getItem`, `removeItem`, `clear` and `keys`. Data is automatically synchronized between the React App and the Widget.

```ts
import { sessionStorage } from 'near-social-bridge'

sessionStorage.setItem('name', 'Wenderson')
sessionStorage.getItem('name') // Wenderson
```

## Persist Storage

This feature provides automatic Redux state persistence for session. It relies on `sessionStorage`.

```ts
// Example using redux with @rematch
import { init } from '@rematch/core'
import persistPlugin from '@rematch/persist'
import { persistStorage } from 'near-social-bridge'
import { RootModel } from './models'

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'full' }>

export const store = init<RootModel>({
  models,
  plugins: [
    // Provides automatic Redux state persistence.
    // https://rematchjs.org/docs/plugins/persist/
    persistPlugin({
      key: 'root',
      storage: persistStorage,
    }),
  ],
})
```

## Hooks

### useNearSocialBridge

Allow to get message from Widget and send messages to Widget:

```tsx
import { useNearSocialBridge } from 'near-social-bridge'

const MyComponent = () => {
  const { onGetMessage, postMessage } = useNearSocialBridge()

  useEffect(() => {
    // Receives a message from Widget
    onGetMessage((message: any) => {
      console.log('Got message from Widget:', message)
    })

    return () => onGetMessage(null)
  }, [])

  const sendMessageToWidget = () => {
    // Sends a message to Widget
    postMessage('My awesome message! :D')
  }

  // ...
}
```

### useInitialPayload

Returns the initial payload sent by the Widget:

```ts
import { useInitialPayload } from 'near-social-bridge'

const MyComponent = () => {
  const initialPayload = useInitialPayload()
  console.log(initialPayload) // initial payload sent by the Widget
  // ...
}
```

### useNavigation

Expose features like `push` new route, `goBack` to the previous route, `location` with the current route location and props, `history` with the history of all routes visited and their props:

```ts
import { useNavigation } from 'near-social-bridge'

const MyComponent = () => {
  const navigation = useNavigation()
  // ...
  navigation.push('ProfileScreen')
  // ...
}
```

### useSessionStorage

Returns storage with the most updated items:

```ts
import { useSessionStorage } from 'near-social-bridge'

// Set item
sessionStorage.setItem('age', 32)

// Component
const MyComponent = () => {
  const storage = useSessionStorage()
  console.log(storage?.age) // 32
}
```

### useAuth

Returns the authenticated user info:

```ts
import { useAuth } from 'near-social-bridge'

const MyComponent = () => {
  const auth = useAuth()
  console.log(auth.ready) // true or false (it's true when the request to get the user info is completed)
  console.log(auth.user?.accountId) // E.g: wendersonpires.near
}
```

### useWidgetView

Provides access to methods and props which can affect the Widget View:

```ts
import { useWidgetView } from 'near-social-bridge'

const MyComponent = () => {
  const widgetView = useWidgetView()

  // Set the widget view height to 700px
  widgetView.setHeight(700)
}
```

### useSyncContentHeight

You can use this hook to do a content height sync. Thus, the height of the viewer's iframe will always have the updated height.

```ts
import { useSyncContentHeight } from 'near-social-bridge'

const MyComponent = () => {
  const { done, syncAgain } = useSyncContentHeight()
  console.log('is sync done?', done)

  const [list, setList] = useState(['a'])

  useEffect(() => {
    setList(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'])
    syncAgain()
  }, [])

  return (
    <div className="flex flex-col">
      <p>list</p>
      {list.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  )
}
```

Or, you can just use `useSyncContentHeight()`:

```ts
import { useSyncContentHeight } from 'near-social-bridge'

const MyComponent = () => {
  useSyncContentHeight()

  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']

  return (
    <div className="flex flex-col">
      <p>list</p>
      {list.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  )
}
```

## Utils

### initRefreshService

If you use this service during the development process, when you press "R" key 3 times, the app is going to refresh.

```ts
import { initRefreshService } from 'near-social-bridge/utils'

// ...
useEffect(() => {
  if (isDev) {
    initRefreshService()
  }
}, [])
// ...
```

### overrideLocalStorage

This is a feature that overrides the `window.localStorage` with the Widget's `Storage`, so that, you can keep using `window.localStorage` but the Widget's `Storage` is going to be the source of data.

**If using CSR:**

```ts
import { overrideLocalStorage } from 'near-social-bridge/utils'

// using `sessionStorage` under the hood
overrideLocalStorage()

// The Widget won't break
localStorage.setItem('name', 'Wenderson')
localStorage.getItem('name') // "Wenderson"
```

**If using SSR:**

```ts
// Page or index.tsx
import { useEffect } from 'react'
import { NearSocialBridgeProvider, overrideLocalStorage } from 'near-social-bridge'
import MyComponent from './MyComponent'

overrideLocalStorage()

const SSRApp = () => {
  useEffect(() => {
    localStorage.setItem('name', 'Wenderson')
  }, [])

  return (
    <NearSocialBridgeProvider waitForStorage>
      <MyComponent />
      <MyComponent2 />
    </NearSocialBridgeProvider>
  )
}

export default SSRApp

// MyComponent
const MyComponent = () => {
  console.log(localStorage.getItem('name')) // "Wenderson"
}

// MyComponent2
import { sessionStorage } from 'near-social-bridge'
const MyComponent2 = () => {
  console.log(sessionStorage.getItem('name')) // "Wenderson"
}
```

## Preparing a new Widget

Create a new Widget, copy [the content of file **widget-setup.js**](./widget-setup.js) and paste it inside your new Widget. Then set its initial props as you wish:

```js
/**
 * External App URL (must)
 */
const externalAppUrl = 'https://<external-app-link-here>'
/**
 * Initial Path (optional)
 */
const path = props.path
/**
 * Initial view height (optional)
 */
const initialViewHeight = 500
/**
 * Initial Payload (optional)
 */
const initialPayload = {}

/**
 * Request Handlers here
 */
const requestHandler = (request, response) => {
  switch (request.type) {
    case 'get-account-id':
      getAccountIdHandler(request, response)
      break
  }
}

const getAccountIdHandler = (request, response) => {
  // You have access to the request payload
  console.log(request.payload) // Any data sent by React App
  const accountId = context.accountId
  // Send a response to the React App
  // "response" needs the "request" object to know the type of the request
  response(request).send({ accountId })
}

// NearSocialBridgeCore widget is the core that makes all the "magic" happens
// use `wendersonpires.testnet/widget/NearSocialBridgeCore` as source if you want to use "testnet" environment
return (
  <Widget
    src={'wendersonpires.near/widget/NearSocialBridgeCore'}
    props={{
      externalAppUrl,
      path,
      initialViewHeight,
      initialPayload,
      requestHandler,
    }}
  />
)
```

**testnet:** Use `wendersonpires.testnet/widget/NearSocialBridgeCore` while creating your application using the testnet environment.

And that's basically it. Again, remember that once your application is running inside the Widget, if it is making requests, you must handle each one of them inside the Widget, otherwise the unhandled requests will fail.

## Good to know

### Server-Side Rendering

SSR is supported starting with version 1.3.0!

## Testing the Application Inside the Widget

To test your app, you can install the [**NEAR Social Local Viewer CLI**](https://github.com/wpdas/near-social-local-viewer). It will allow you to execute and test your Widget locally using all the Discovery API resources without any problem.

1 - Install NEAR Social Local Viewer CLI using npm or yarn:

```sh
# npm
npm install near-social-local-viewer --save-dev

# yarn
yarn add near-social-local-viewer -D
```

2 - Now you can create a script within `package.json` file:

```json
{
  "scripts": {
    "start:widget": "npx init-viewer path/to/widgets/"
  }
}
```

3 - or just run:

```sh
npx init-viewer path/to/widgets/

# e.g: npx init-viewer widgets/
```

4 - Once your Widget is ready, you can deploy it to Near Social: <br/>
4.1 - You can deploy it by copying and pasting; <br/>
4.2 - Or using [near-social CLI](https://github.com/FroVolod/near-social).

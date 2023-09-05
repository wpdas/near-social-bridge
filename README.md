# <img src='./md/near-social-bridge-logo.png' height='24' alt='NEAR Social Bridge Logo' /> NEAR Social Bridge

[![Build Status](https://img.shields.io/github/actions/workflow/status/wpdas/near-social-bridge/publish.yml?style=for-the-badge&colorB=000000)](https://github.com/wpdas/near-social-bridge/actions?query=workflow%3Apublish)
[![Build Size](https://img.shields.io/bundlephobia/minzip/near-social-bridge/1.0.1?label=bundle%20size&style=for-the-badge&colorB=000000)](https://bundlephobia.com/package/near-social-bridge)
[![Version](https://img.shields.io/npm/v/near-social-bridge?style=for-the-badge&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)
[![Downloads](https://img.shields.io/npm/dt/near-social-bridge.svg?style=for-the-badge&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)

This library allows you to create a common application using ReactJS and use it inside a BOS Component. Therefore, the BOS Component talks to the React application and vice versa, making it possible to consume Discovery API resources within the React application.

Library intended only for applications that will run within [BOS](https://near.org/)

## Lib Tests

As this is a library that works integrated with Blockchain OS, the tests were built to be executed in real-time.

[**Run the tests here**](#)

## Install

Install it using npm or yarn:

```sh
# npm
npm install near-social-bridge

# yarn
yarn add near-social-bridge
```

## Examples

Check out some examples:

- [Greeting App](https://github.com/wpdas/near-social-bridge/tree/main/examples/greeting-app)
- [Todo App](https://github.com/wpdas/near-social-bridge/tree/main/examples/todo-app)
- [Chat App](https://github.com/wpdas/chatv2-near-widget-app)
- [SSR NextJS Test App](https://github.com/wpdas/nextjs-near-widget-app)

## Quick Guide

Here's a quick guide to you get to know how to use Near Social Bridge with basic stuff.

- [Setup](#setup)
- [BOS API](#bos-api)
  - [Near API](#near-api)
  - [Social API](#social-api)
  - [Storage API](#storage-api)
- [Requests](#requests)
  - [Simple Request](#simple-request)
  - [Handling the requests inside the Widget](#handling-the-requests-inside-the-widget)
  - [Using request handler Utils - Widget side](#using-request-handler-utils-widget-side)
- [Persist Storage](#persist-storage)
- [Hooks](#hooks)
  - [useAuth](#useauth)
  - [useSyncContentHeight](#usesynccontentheight)
- [Preparing a new BOS Component](#preparing-a-new-bos-component)
- [Testing the Application Inside the Widget](#testing-the-application-inside-the-widget)

## Complete Guide

Here's a complete guide where you can go over all features provided by Near Social Bridge.

- [Setup](#setup)
- [BOS API](#bos-api)
  - [Near API](#near-api)
  - [Social API](#social-api)
  - [Storage API](#storage-api)
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
- [Preparing a new BOS Component](#preparing-a-new-bos-component)
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

const App = () => {
  return (
    <NearSocialBridgeProvider waitForStorage fallback={<Spinner />}>
      <Components />
    </NearSocialBridgeProvider>
  )
}
```

## BOS API

We've incorporated some APIs to allow your app to interact with different blockchains, websites, and store data in a decentralized way. These features are basically mirroring the [BOS API](https://docs.near.org/bos/api/home) features.

There is a deployed `Hello World` smart contract in the NEAR network at `nearsocialexamples.near` that we're going to use. The contract exposes two methods:

- `set_greeting(message: string): void`, which accepts a message and stores it in the contract state.
- `get_greeting(): string` which returns the stored greeting.

### Near API

A convenient API to interact with the NEAR blockchain. [Complete Docs Here](https://docs.near.org/bos/api/near).

**Near.view**

This will conduct a call to a smart contract that will get a stored message onchain.

```ts
import { Near } from 'near-social-bridge/api'

// Contract
const CONTRACT_ID = 'nearsocialexamples.near'

Near.view<string>(CONTRACT_ID, 'get_greeting').then((response) => console.log(response))
// {message: "The most recent stored greeting message"}
```

**Near.call**

This will conduct a call to a smart contract that will store a message onchain.

```ts
import { Near } from 'near-social-bridge/api'

// Contract
const CONTRACT_ID = 'nearsocialexamples.near'

// Set data
Near.call<{ message: string }>(CONTRACT_ID, 'set_greeting', { message: greeting })
```

### Social API

A convenient API to get data from the SocialDB contract. [Complete Docs Here](https://docs.near.org/bos/api/social).

**Social.get**

```ts
import { Social } from 'near-social-bridge/api'

Social.get('wendersonpires.testnet/widget/*').then((response) => console.log(response))
// {HelloWorld: '...', Chat: '...', ChatV2: '...'}
```

**Social.getr**

```ts
Social.getr('wendersonpires.testnet/profile').then((response) => console.log(response))
// {name: 'Wenderson Pires'}
```

**Social.set**

```ts
const data = { index: { experimental: JSON.stringify({ key: 'current_time', value: Date.now() }) } }
Social.set(data).then((response) => console.log(response))
// If Success: {wendersonpires.testnet: {index: {experimental: "..."}}}
// If Canceled: {error: 'the action was canceled'}
```

**Social.index**

```ts
const _index = await Social.index('experimental', 'current_time', {
  limit: 1000,
  order: 'desc',
}).then((response) => console.log(response))
// [{accountId: 'xyz', blockHeight: 99, value: '1693805434405'}, {...}, {...}, {...}]
```

**Social.keys**

```ts
Social.keys('wendersonpires.testnet/experimental').then((response) => console.log(response))
// {wendersonpires.testnet: {experimental: {...}}}
```

### Storage API

`Storage` object to store data for components that is persistent across refreshes. [Complete Docs Here](https://docs.near.org/bos/api/storage).

**Storage.set**

`Storage.set(key, value)` - sets the public value for a given key under the current widget. The value will be public, so other widgets can read it.

```ts
import { Storage } from 'near-social-bridge/api'

Storage.set('my-storage-key', JSON.stringify({ age: 33, name: 'Wendz' })).then((response) => console.log(response))
// {ok: true}
```

**Storage.get**

`Storage.get(key, widgetSrc?)` - returns the public value for a given key under the given widgetSrc or the current component if `widgetSrc` is omitted. Can only read public values.

```ts
Storage.get('my-storage-key').then((response) => console.log(response))
// {"age":33,"name":"Wendz"}
```

**Storage.privateSet**

`Storage.privateSet(key, value)` - sets the private value for a given key under the current component. The value is private, only the current component can read it.

```ts
Storage.privateSet('my-private-key', JSON.stringify({ age: 18, name: 'Wendz Private' })).then((response) =>
  console.log(response)
)
// {ok: true}
```

**Storage.privateGet**

`Storage.privateGet(key)` - returns the private value for a given key under the current component.

```ts
Storage.privateGet('my-private-key').then((response) => console.log(response))
// {"age":18,"name":"Wendz Private"}
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

If you use `Navigator` with `defaultRoute`, this route is going to be set every time the app reloads. If not used, the last route seen is going to be shown.

The `Screen` component allows you to pass some useful properties, one of them is the `iframeHeight` which will set the initial iframe's height needed to show this screen within the Widget even before the first render. If `Navigator` was called with `autoHeightSync`, the height is going to be adjusted automatically when the screen content is rendered.

```tsx
return (
  <Navigator autoHeightSync defaultRoute="Home">
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

This feature stores data for components that is persistent across refreshes. You will have access to methods like `setItem`, `getItem`, `removeItem`, `clear` and `keys`. Data is automatically synchronized between the React App and the BOS Component.

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

Allow to get message from BOS Component and send messages to BOS Component:

```tsx
import { useNearSocialBridge } from 'near-social-bridge'

const MyComponent = () => {
  const { onGetMessage, postMessage } = useNearSocialBridge()

  useEffect(() => {
    // Receives a message from BOS Component
    onGetMessage((message: any) => {
      console.log('Got message from BOS Component:', message)
    })

    return () => onGetMessage(null)
  }, [])

  const sendMessageToWidget = () => {
    // Sends a message to BOS Component
    postMessage('My awesome message! :D')
  }

  // ...
}
```

### useInitialPayload

Returns the initial payload sent by the BOS Component:

```ts
import { useInitialPayload } from 'near-social-bridge'

const MyComponent = () => {
  const initialPayload = useInitialPayload()
  console.log(initialPayload) // initial payload sent by the BOS Component
  // ...
}
```

### useNavigation

Expose features like `push` new route, `goBack` to the previous route, `location` with the current route location and props, `history` with the history of all routes visited and their props, `replace` performs a replaceState with arguments:

```ts
import { useNavigation } from 'near-social-bridge'

const MyComponent = () => {
  const navigation = useNavigation()
  // ...
  navigation.push('ProfileScreen')

  // navigation.goBack()
  // navigation.replace('Home', {myprops: "..."})
  // console.log(navigation.history)
  // console.log(navigation.location)
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

Provides access to methods and props which can affect the BOS Component View:

```ts
import { useWidgetView } from 'near-social-bridge'

const MyComponent = () => {
  const widgetView = useWidgetView()

  // Set the BOS Component view height to 700px
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

This is a feature that overrides the `window.localStorage` with the BOS Component's `Storage`, so that, you can keep using `window.localStorage` but the BOS Component's `Storage` is going to be the source of data.

**If using CSR:**

```ts
import { overrideLocalStorage } from 'near-social-bridge/utils'

// using `sessionStorage` under the hood
overrideLocalStorage()

// The BOS Component won't break
localStorage.setItem('name', 'Wenderson')
localStorage.getItem('name') // "Wenderson"
```

**If using SSR:**

```ts
// Page or index.tsx
import { useEffect } from 'react'
import { NearSocialBridgeProvider, overrideLocalStorage } from 'near-social-bridge'
import MyComponent from './MyComponent'
import MyComponent2 from './MyComponent2'

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

## Preparing a new BOS Component

Create a new BOS Component, copy [the content of file **widget-setup.js**](./widget-setup.js) and paste it inside your new BOS Component. Then set its initial props as you wish:

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

// NearSocialBridgeCore BOS Component is the core that makes all the "magic" happens
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

And that's basically it. Again, remember that once your application is running inside the BOS Component, if it is making requests, you must handle each one of them inside the BOS Component, otherwise the unhandled requests will fail.

## Good to know

### Server-Side Rendering

SSR is supported starting with version 1.3.0!

## Testing the Application Inside a Local Viewer

To test your app, you can install the [**NEAR Social Local Viewer CLI**](https://github.com/wpdas/near-social-local-viewer). It will allow you to execute and test your BOS Component locally using all the Discovery API resources without any problem.

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

4 - Once your BOS Component is ready, you can deploy it to Near Social: <br/>
4.1 - You can deploy it by copying and pasting; <br/>
4.2 - Or using [near-social CLI](https://github.com/FroVolod/near-social).

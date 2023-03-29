# <img src='./md/near-social-bridge-logo.png' height='24' alt='NEAR Social Bridge Logo' /> NEAR Social Bridge

[![Build Status](https://img.shields.io/github/actions/workflow/status/wpdas/near-social-bridge/publish.yml?style=flat&colorA=000000&colorB=000000)](https://github.com/wpdas/near-social-bridge/actions?query=workflow%3Apublish)
[![Version](https://img.shields.io/npm/v/near-social-bridge?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)
[![Downloads](https://img.shields.io/npm/dt/near-social-bridge.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/near-social-bridge)

This library allows you to create a common application using ReactJS and inject it in a controlled way into a Widget on Near Social. Therefore, the Widget talks to the React application and vice versa, making it possible to consume Discovery API resources within the React application.

Library destined only to applications that will run inside a Widget [(Near Social)](https://near.social)

You can try a live demo [here](https://near.social/#/wendersonpires.near/widget/ChatV2). The repository of this demo is [here](https://github.com/wpdas/chatv2-near-widget-app).

```sh
npm install near-social-bridge # or yarn add near-social-bridge
```

## Table of contents

- [First setup the library](#first-setup-the-library)
- [Create the requests](#create-the-requests)
  - [Simple Request](#simple-request)
  - [Create Requests Mocks](#create-requests-mocks)
  - [Handling the requests inside the Widget](#handling-the-requests-inside-the-widget)
  - [Using request handler Utils - Widget side](#using-request-handler-utils-widget-side)
  - [Requests - Knowing more](#requests---knowing-more)
- [Mock](#mock)
  - [Setup Mocks](#setup-mocks)
  - [Mock Authenticated User](#mock-authenticated-user)
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
- [Preparing a new Widget](#preparing-a-new-widget)
- [Good to know](#good-to-know)
  - [Shortcut to refresh the application](#shortcut-to-refresh-the-application)
  - [Production environment](#production-environment)
- [Testing the Application Inside the Widget](#testing-the-application-inside-the-widget)

## First setup the library

You should wrap your app with `NearSocialBridgeProvider` which will start the connection between the React App and the Widget inside Near Social. The connection only occurs when the application is running inside the Widget.

This component accepts a fallback component that's going to be shown ntil the connection with the Widget is established or the Widget response timeout is reached.. You can set it using the `fallback` prop.

```tsx
import { NearSocialBridgeProvider } from 'near-social-bridge'
// ...
return (
  <NearSocialBridgeProvider fallback={<p>Loading...</p>}>
    <App />
  </NearSocialBridgeProvider>
)
```

## Create the requests

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

The `promisify` needs 3 parameters: `caller` which is going to request something, `resolve`, a method that is going to be called as soon as the _caller_ find an answer and `reject`, method that will be called when the service times out.

So, promisify implementation is

```ts
promisify(caller: () => any, resolve: () => void, reject: () => void)
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

// You can optionally set default data. All the data is randomly generated using `@faker-js/faker` module.
const fakeUser = createMockUser({ firstName: 'Wenderson' })
mockUser(fakeUser)
// Now your app has an "authenticated" user
```

### Create Requests Mocks (revisit)

You can revisit this session [here](#create-requests-mocks).

## Use Navigation

This **optional** resource was created in order to facilitate the passage of data between routes, since the main domain will always be https://near.social or other fixed domain. Note that you will still be able to use any other routing solution.

While using the Widget, the url should be like `https://near.social/#/wendersonpires.near/widget/MyWidget?path=/profile`
where the `?path=` is the param with the route value. E.g: `?path=/timeline`.

While developing locally, you can just use the URL rendered by this lib. E.g: `http://localhost:1234/#/profile` where
`#/profile` is the current route.

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

```tsx
import { createStackNavigator } from 'near-social-bridge/navigation'
import { NavigationProps } from './NavigationProps'

// Optional Fallback Loading component to show while the connection is being established
const FallbackLoadingComponent = () => <p>Loading...</p>

const { Navigator, Screen } = createStackNavigator<NavigationProps>(<FallbackLoadingComponent />)
```

The `Screen` component allows you to pass some useful properties, one of them is the `iframeHeight` which will set the height of the iframe needed to show this screen within the Widget.

```tsx
return (
  <Navigator>
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

## Preparing a new Widget

Create a new Widget, copy [the content of file **widget-setup.js**](./widget-setup.js) and paste it inside your new Widget. Then set its initial props as you wish:

```js
/**
 * External App URL (must)
 */
const externalAppUrl = 'https://<external-app-link-here>'
/**
 * Initial Path (optional but recommended)
 */
const path = props.path
/**
 * Initial view height (optional but recommended)
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

And that's basically it. Again, remember that once your application is running inside the Widget, if it is making requests, you must handle each one of them inside the Widget, otherwise the unhandled requests will fail.

## Good to know

### Shortcut to refresh the application

During the development process, if you press "R" key 3 times, the app is going to refresh.

### Production environment

You must set the env var REACT_APP_ENV as "production" in your deployment script, in order to disable development functionalities:

```json
"build": "cross-env REACT_APP_ENV=production ... <the rest of the build script>"
```

## Testing the Application Inside the Widget

To test your app while developing, use a service like [ngrok](https://ngrok.com/) to help you, since it will expose your application globally to be accessed within the Widget.

If you used the `npx create-react-app` command, Ngrok with free plan won't work inside the Widget as a message from the service will block the app.

In order to bypass Ngrok's free account lock screen, you must create your application using [Next.js](https://nextjs.org/) and send the following parameter in the header:

```sh
# set Header key: value
"ngrok-skip-browser-warning": "any-value"
```

or

```sh
# set Header key: value
"User-Agent": "custom/non-standard browser"
```

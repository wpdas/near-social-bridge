# <img src='./md/near-social-bridge-logo.png' height='24' alt='NEAR Social Bridge Logo' /> NEAR Social Bridge

This library allows you to use a React App in a Widget created within Near Social and use it as a backend source.

## Install

```sh
yarn add near-social-bridge

#or

npm install near-social-bridge
```

## Widget Setup

Open up this initial file [**widget-setup.js**](./widget-setup.js), copy its content and paste inside your new Widget. [You can create a new Widget inside Near Social here.](https://near.social/#/edit)

Demo [**ChatV2**](https://near.social/#/wendersonpires.near/widget/ChatV2) Widget built using this library.

Give it a try. Join room id: **near-social-community**

The repository for this app can be found here: [**chatv2-near-widget-app**](https://github.com/wpdas/chatv2-near-widget-app)

## Resources

**Bridge**

- `NearSocialBridgeProvider` provider: start the connection between the External App and Near Social View. This component accepts a fallback component that's going to be shown until the connection with the Widget is established. You can set it using the `fallback` prop;
- `useNearSocialBridge` hook: allow get and send messages to Near Social View;
- `useInitialPayload` hook: returns the initial payload sent by the VM (Widget);

**Navigation**

This resource was created in order to facilitate the passage of properties between routes, since the main domain will always be https://near.social

- `createStackNavigator`: Provides the sources to navigate over the app
- - `Navigation`: Renders only the page we want inside the iframe. Allow us to send props between the screens.
- - `Screen`: Each screen component is provided with `navigation` (provided by `useNavigation` hook as well) and `route` props
- `NavigationProvider` provider: Handles screens, routes, history and others things
- `useNavigation` hook: expose features like `push` new route, `goBack` to the previous route, `location` with the current route location and props, `history` with the history of all routes visited and their props

While using the Widget, the url should be like `https://near.social/#/wendersonpires.near/widget/MyWidget?path=/profile`
where the `?path=` is the param with the route value. E.g: `?path=/timeline`.

While developing locally, you can just use the URL rendered by this lib. E.g: `http://localhost:1234/#/profile` where
`#/profile` is the current route.

**Request**

- `request`: Allow to make requests to the View using the Bridge Service. The Widget should handle each request properly. In the Widget side, the handler is going to provide 3 props: `request` with its type and payload, `response` that is the way the app send a answer back to the external app and `utils` that provides some useful features like the `promisify`.

- `request concurrency`: Sometimes more than one request can be sent simultaneously. The library automatically controls request concurrency, however, you can force a request to be re-executed until a response is obtained. A maximum of 10 rerun attempts will be made. To use this function, just set `forceTryAgain` in the options to `true`.

```ts
import { request } from 'near-social-bridge/request'

// service
const options = { forceTryAgain: true }
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload, options)

// using the service
getRoomsList({ limit: 2 })
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
// Now, if for some reason this call does not get a response, new attempts to request the data will be made.
```

You can see more below in the [Shortcut - How to use](#shortcut---how-to-use) session.

**Mock Requests**: This resource is extremely useful, as it allows you to simulate the contract of your application's requests, making it fully work locally. Therefore, you can create the handlers inside the Widget only when you start running the app inside the Widget.

- `createMock`: is used to create a mock for a given order.

_mock "get-rooms-list" request_

```ts
import { createMock } from 'near-social-bridge/request/mock'

const rooms = ['room-1', 'room-2', 'room-3', 'room-4']
const getRoomsListMock = (payload: { limit: number }) => {
  return {
    // use always immutable pattern
    roomsList: [...rooms.slice(0, payload.limit)],
  }
}

// Create mock
createMock('get-rooms-list', getRoomsListMock)
```

_then in your app_

```ts
// service
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload)

// using the service
getRoomsList({ limit: 2 }).then((response) => console.log(response)) // ['room-1', 'room-2']
```

_then, handling it inside the Widget when the tests inside it starts_: Mocks will be automatically disabled when running it inside the Widget.

```js
const getRoomDataHandler = (request, response) => {
  const { limit } = request.payload;
  // ... use Discovery API to fetch rooms list
  const roomsList = Storage.privateGet("app:rooms-list"),
  // ... some logic
  response(request).send({ roomsList: rooms.slice(0, limit) });
};
```

- `mockUser`: Mock authenticated user. You can use `createMockUser()` method to provide the user object

```ts
import { createMockUser, mockUser } from 'near-social-bridge/request/mock'

// You can optionally set default data. All the data is random generated using `@faker-js/faker` module.
const fakeUser = createMockUser({ firstName: 'Wenderson' })
mockUser(fakeUser)
// Now your app has an "authenticated" user
```

- `setupMock`: You can configure how the mock will handle the requests. The only prop available is `delay` where you can set the delay before sending an answer for each request (simulates async call).

```ts
setupMock({ delay: 1000 })
// From now on, each mock request is going to take 1 second to get an answer.
```

**Widget Utils**

- `utils`: is only available inside a request handler scope. This currently provides the `promisify` method.
- `promisify`: this method provides a way to expect a given method to return something. Some Discovery API resources are not Promises and therefore the data may not be available at the exact moment the application requests it. promisify will help to know when a data was returned:

```js
const requestHandler = (request, response, Utils) => {
  const accountId = context.accountId

  Utils.promisify(
    // Fetch profile info like { name, image, description, linktree, ... }
    // This is going to take some time to retrieve and Social.getr is not a Promise by default
    () => Social.getr(`${accountId}/profile`),
    (data) => {
      console.log(data) // { name, image, description, linktree, ... }
    },
    (error) => {
      console.log('error fetching profile data')
    }
  )
}
```

**Session Storage**

- `sessionStorage`: Stores data for one session. While testing inside a Widget, data is lost when the browser tab is reloaded or closed. You will have access to methods like `setItem`, `getItem`, `removeItem`, `clear` and `keys`. Data is automatically synchronized between the External App and the Widget View.
- `persistStorage`: Provides automatic Redux state persistence for session (this feature relies on `sessionStorage`)
- `useSessionStorage` hook: Returns storage with the most updated items

**Service**

- `bridgeService`: This is the core service that makes the connection and notifies observers when there is a new message or a connection is established.

**Auth**

- `useAuth` hook: returns the authenticated user info.

## Shortcut - How to use

You can explore a sample app here [Example Near Widget App](https://github.com/Wpdas/example-near-widget-app). But below are some shortcuts for you to configure your project.

1 - Wrap your App with NearSocialBridgeProvider (the `fallback` component is optional):

```tsx
root.render(
  // fallback is going to be shown until the connection with Widget is established.
  <NearSocialBridgeProvider fallback={<p>Loading...</p>}>
    <App />
  </NearSocialBridgeProvider>
)
```

2 - Use the `createStackNavigator` method to receive the `Navigator` and `Screen` components. They will be used to manage each screen.

```tsx
import { createStackNavigator } from 'near-social-bridge/navigation'
import { NavigationProps } from './NavigationProps'

// Optional Fallback Loading component to show while the connection is being established
const FallbackLoadingComponent = () => <p>Loading...</p>

const { Navigator, Screen } = createStackNavigator<NavigationProps>(<FallbackLoadingComponent />)
```

3 - You can optionally create properties for each route. It will be useful for you to have a typed `navigation` and `route` object.

```tsx
import { IFrameStackScreenProps } from 'near-social-bridge/navigation'

// Navigation props
export type NavigationProps = {
  Home: undefined
  Profile: {
    ipfsCidAvatar?: string
    userName?: string
  }
}

// Screen props
export type PreHomeScreenProps = IFrameStackScreenProps<NavigationProps, 'Home'>
export type ProfileScreenProps = IFrameStackScreenProps<NavigationProps, 'Profile'>
```

4 - The `Screen` component allows you to pass some useful properties, one of them is the `iframeHeight` which will set the size of the stage needed to show this screen within the Near Social View.

```tsx
<Navigator>
  <Screen name="Home" component={Home} iframeHeight={420} />
  <Screen name="Profile" component={Profile} />
</Navigator>
```

5 - You can use the `route` property injected into each `Screen` to access the passed properties as well as use `navigation` to go to another route. It is possible to use the `useNavigation` hook to get access to some route resources.

```tsx
const Profile: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { ipfsCidAvatar, userName } = route.params
  //...
  const goToHomeHandler = () => {
    navigation.goBack()
  }
}
```

6 - Creating requisitions. You can make requests to the Near Social View and each request must be properly handled within the View.

For example, if in the app you create a request with the following type "get-user-info", the View should respond accordingly.

**React App side:**

```tsx
import { request } from 'near-social-bridge/request'

interface GetUserResponse {
  accountId: string
}

// Send a request to Near Social View to get basic user info
const response = await request<GetUserResponse>('get-user-info')
console.log(response.accountId) // Signed in user accountId
```

**Widget side:**

```js
const requestsHandler = (request, response) => {
  switch (request.type) {
    case 'get-user-info':
      sendUserInfo(request, response)
      break
  }
}

// Send user info
const sendUserInfo = (request, response) => {
  const accountId = context.accountId
  // Send a response to the External App (React App)
  // "response" needs the "request" object to know the type of the request
  // you can read this as "a response to a request"
  response(request).send({ accountId })
}
```

You can optionally use the `utils` prop to use useful resources like the `promisify`. It helps when the app needs to wait for some cached data and then handle the success or failure. Look at this example below where the same request above is providing a more complex user data:

**Widget side:**

```js
const requestsHandler = (request, response, Utils) => {
  switch (request.type) {
    case 'get-user-info':
      sendUserInfo(request, response, Utils)
      break
  }
}

// Send user info [this is just an example, you can have this data by using the "useAuth()" hook]
const sendUserInfo = (request, response, Utils) => {
  const accountId = context.accountId

  // check if user is signed in
  if (!accountId) {
    response(request).send({ error: 'user is not signed in' })
    return
  }

  Utils.promisify(
    // Fetch profile info like { name, image, description, linktree, ... }
    // This is going to take some time to retrieve and Social.getr is not a Promise by default
    () => Social.getr(`${accountId}/profile`),
    (res) => {
      // Send the response
      response(request).send({
        accountId,
        profileInfo: res,
      })
    },
    (err) => {
      console.log('error fetching profile data', err)
    }
  )
}
```

## Util

**Refresh:** During the development process, if you press "R" key 3 times, the app is going to refresh.

**Production env:** You must set the env var REACT_APP_ENV as "production" in your deployment script, in order to disable development functionalities:

```json
"build": "cross-env REACT_APP_ENV=production ... <the rest of the build script>"
```

## Testing the Application Inside the Widget

You can develop using `localhost` without any problems, it's just that the app won't have access to the data the widget can provide. If you want to test your app while developing, use a service like [ngrok](https://ngrok.com/) to help you, since it will expose your application globally to be accessed within the Widget.

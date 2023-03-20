# Near Social Bridge - beta

This library allows you to use a React App in a Widget created within Near Social as well as send and receive data from it.

## Install

```sh
yarn add near-social-bridge

#or

npm install near-social-bridge
```

## Widget Setup

Open up this initial file [widget-setup.js](./widget-setup.js), copy its content and paste inside your new Widget. [You can create a new Widget inside Near Social here.](https://near.social/#/edit)

Demo Widget running with an external React App: [**NearSocialBridge_Demo**](https://near.social/#/wendersonpires.near/widget/NearSocialBridge_Demo) [It may not be available as I'm still testing the features a lot and I need to turn off the app sometimes.]

## Resources

**Bridge**

- `NearSocialBridgeProvider` provider: start the connection between the External App and Near Social View;
- `useNearSocialBridge` hook: allow get and send messages to Near Social View;

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

- `request`: Allow to make requests to the View using the Bridge Service. The Widget should handle each request properly.

**Session Storage**

- `sessionStorage`: Stores data for one session. While testing inside a Widget, data is lost when the browser tab is reloaded or closed. You will have access to methods like `setItem`, `getItem`, `removeItem`, `clear` and `keys`. Data is automatically synchronized between the External App and the Widget View.
- `persistStorage`: Provides automatic Redux state persistence for session (this feature relies on `sessionStorage`)
- `useSessionStorage` hook: Returns storage with the most updated items

**Service**

- `bridgeService`: This is the core service that makes the connection and notifies observers when there is a new message or a connection is established.

**Core JS file**

- `bridge.min.js` file: should be imported inside your Widget using CDN. You can see more here [widget-setup.js](./widget-setup.js).

## Shortcut - How to use

You can explore a sample app here [Example Near Widget App](https://github.com/Wpdas/example-near-widget-app). But below are some shortcuts for you to configure your project.

1 - Wrap your App with NearSocialBridgeProvider:

```tsx
root.render(
  <NearSocialBridgeProvider>
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

**Your app side:**

```tsx
import request from 'near-social-bridge/request'

interface GetUserResponse {
  accountId: string
  profileInfo: {
    name: string
    image: {
      ipfs_cid: string
    }
    linktree?: {
      github?: string
      twitter?: string
    }
  }
}

// Send a request to Near Social View to get basic user info
const response = await request<GetUserResponse>('get-user-info')
console.log(response.userInfo?.profileInfo.name) // Logged in user name
```

**Widget View side:**

```js
const requestsHandler = (message) => {
  switch (message.type) {
    case 'get-user-info':
      sendUserInfo(message.type, message.payload)
      break
  }
}

// Send user info
const sendUserInfo = (requestType, payload) => {
  const accountId = context.accountId ?? '*'
  const profileInfo = Social.getr(`${accountId}/profile`)
  const responseBody = buildAnswer(requestType, {
    accountId,
    profileInfo,
  })
  sendMessage(responseBody) // to ne External App
}
```

## Testing the Application Inside the Widget

You can develop using `localhost` without any problems, it's just that the app won't have access to the data the widget can provide. If you want to test your app while developing, use a service like [ngrok](https://ngrok.com/) to help you, since it will expose your application globally to be accessed within the Widget.

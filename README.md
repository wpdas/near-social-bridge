# Near Social Bridge Lib - alpha

This library allows you to use a React App in a Widget created within Near Social as well as send and receive data from it.

## Resources

**Bridge**

- `NearSocialBridgeProvider` provider: start the connection between the External App and Near Social View;
- `useNearSocialBridge` hook: allow get and send messages to Near Social View;

**Navigation**

- `createStackNavigator`: Provides the sources to navigate over the app
- - `Navigation`: Renders only the page we want inside the iframe. Allow us to send props between the screens.
- - `Screen`: Each screen component is provided with `navigation` (provided by `useNavigation` hook as well) and `route` props
- `NavigationProvider` provider: Handles screens, routes, history and others things
- `useNavigation` hook: expose features like `push` new route, `goBack` to the previous route, `location` with the current route location and props, `history` with the history of all routes visited and their props

**Request**

- `request`: Allow to make requests to the View using the Bridge Service. The Widget should handle each request properly.

**Session Storage**

- `sessionStorage`: Stores data for one session. While testing inside a Widget, data is lost when the browser tab is reloaded or closed
- `persistStorage`: Provides automatic Redux state persistence for session (this feature relies on `sessionStorage`)
- `useSessionStorage` hook: Returns storage with the most updated items

**Service**

- `bridgeService`: This is the core service that makes the connection and notifies observers when there is a new message or a connection is established.

**Core JS file**

- `bridge.min.js` file: you should import this file inside your widget using CDN. A tutorial of how to use it will be posted soon.

## Widget Setup

Open up this initial file [widget-setup.js](./widget-setup.js), copy its content and paste inside your new Widget. [You can create a new Widget inside Near Social here.](https://near.social/#/edit)

## How to use

This session is going to be ready very soon...

1 - Setup the React App: ...

99 - It is recommended to use a service like [ngrok](https://ngrok.com/) to help you during development. Since it will expose your application globally to be accessed within the Widget.

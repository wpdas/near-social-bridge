# Near Social Bridge Lib (In progress)

You must create a Widget for "development" and another one for "production". The widget setup code can be found
here in the `widget-setup.js` file

1 - Bridge Service: Is using MessageSource (a kind of Websocket Port to send and receive message)
This provides the connection between the View and External App. [See the "connect" message in the Widget]
1.1 - useNearSocialBridge hook: provides a way to send / receive messages between the View and the External App.
1.1 - Request: Make resquest to the View using the Bridge Service with some control. The Widget should handle each request properly.
1.2 - Custom Requests: We can create custom request similar to usual API call
1.2.1 - Every request will be a Promise, resolved when the View gives the anser

2 - Navigation: Renders only the page we want inside the iframe. Allow us to send props between the screens.
2.1 - Screen: Each screen component is provided with navigation and route
2.1.1 - Screen provides a way to optionally set the iframe height. E.g:

```js
<Navigator>
  <Screen name="Landing" component={Landing} iframeHeight={780} />
  <Screen name="Dummy" component={Dummy} />
  <Screen name="Profile" component={Profile} iframeHeight={1010} />
</Navigator>
```

2.2 - navigation prop: used to navigate between the screen. ex:

```js
// Push new Screen and its props
navigation.push('Task-Edit', {
  taskId: 'fakeID_1234',
  previousDescription: 'bla bla bla',
})

// Go to the previous screen
navigation.goBack()

// Current location props [screen name, props]
navigation.location

// An array containing the history of locations visited [[screen name, props], [screen name, props], ...]
navigation.history
```

2.2.1 - useNavigation hook: does the same as the provided navigation prop but in any level in the three
2.3 - route prop: basic route props like
2.4 - The user is able to go straight to a specific route:

- When using the Widget, the url should be like `https://near.social/#/wendersonpires.near/widget/MyWidget?path=/profile`
  where the `?path=` is the param with the route value. E.g: `?path=/timeline`.

- When developing locally, you can just use the URL rendered by this lib. E.g: `http://localhost:1234/#/profile` where
  `#/profile` is the current route.

```js
route: {
  key?: string | undefined;
  name: "Task-Edit";
  params: {
      tastId: string;
      previousDescription: string;
  };
  path: string;
  pathParams?: string | undefined;
}
```

3 - Session Storage: Stores data for one session. Data is lost when the browser tab is reloaded or closed.
The data is shared between the External App and the Viewer
3.1 - The External App storage data will hydrate the Viewer storage state every time there's a change;
3.2 - The Viewer will hydrate the External App every time there's a reconnection;
3.3 - useSessionStorage hook: can be used to access the most updated storage data, e.g:

```js
sessionStorage.setItem('age', 32)

// then

const storage = useSessionStorage()
console.log(storage?.age) // 32
```

3.4 - Persist Storage: Provides automatic Redux state persistence for session (this is the only way to persist data using Near Social View). [testing still]

# Good to know

**Redux:**

- `NearSocialBridgeProvider` must wrap up the redux `Provider` component

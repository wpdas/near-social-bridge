## Setup

You should import the `near-social-bridge.css` to your application.

```tsx
import 'near-social-bridge/near-social-bridge.css'
```

Then, you need to wrap your app with `NearSocialBridgeProvider` which will start the connection between the React App and the BOS Component inside Near Social. The connection only occurs when the application is running inside the BOS Component.

This component accepts a fallback component that's going to be shown until the connection with the BOS Component is established or the BOS Component response timeout is reached. You can set it using the `fallback` prop.

If your app is using (or has dependencies using) `localStorage` you'll need to override the `window.localStorage` as `localStorage` is not supported by the VM. You can do it using `overrideLocalStorage` like so:

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

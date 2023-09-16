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

### useConnectionStatus

Connection status. There are three possible values: `"pending"`, `"waiting-for-viewer-signal"`, `"connected"`.
This feature can be used outside the `NearSocialBridgeProvider` component.

```tsx
import { useConnectionStatus } from 'near-social-bridge'

const App = () => {
  const status = useConnectionStatus() // "pending" | "waiting-for-viewer-signal" | "connected"

  return <NearSocialBridgeProvider>{/* ... */}</NearSocialBridgeProvider>
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

## Navigation

This feature was created to facilitate data passing between routes as the main domain will always be https://near.org or another fixed domain. It'll also maintain the same route after a page refresh during the development process. Please note that you will still be able to use any other routing solution.

To force the app to start in a specific route, you should set a `path` parameter like so `https://near.org/wendersonpires.near/widget/MyWidget?path=/profile` where the `?path=` is the param with the route value. E.g: `?path=/timeline`.

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

When using `Navigator` the height of the iframe is automatically adjusted to the initial screen content's height. If more content is inserted inside the screen after the first render, you can use [`useSyncContentHeight`](#usesynccontentheight) hook to sync the height again.

If you use `Navigator` with `defaultRoute`, this route is going to be set every time the app reloads. If not used, the last route seen is going to be shown.

```tsx
return (
  <Navigator defaultRoute="Home">
    <Screen name="Home" component={Home} />
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

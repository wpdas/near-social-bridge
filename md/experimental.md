## Experimental Features

The features bellow are experimental.

`BOSComponent` and `useBOSComponent` are used to load a BOS Component passing its props and inject it inside the React App. It doesn't need to be wrapped by NearSocialBridgeProvider. Tested using CSR only.

### BOSComponent

```tsx
import { BOSComponent } from 'near-social-bridge/components'

const MyComponent = () => {
  return (
    <>
      <BOSComponent
          src="wendersonpires.near/widget/HelloWorld"
          fullWidth
          height={400}
          props={{ username:"Ricardo Goulard" age:"23" }}
        />
    </>
  )
}
```

### useBOSComponent

```tsx
import { useBOSComponent } from 'near-social-bridge/hooks'

const MyComponent = () => {
  const HelloWorld = useBOSComponent({
    src: 'wendersonpires.near/widget/HelloWorld',
    fullWidth: true,
    height: 500,
  })

  return (
    <>
      <HelloWorld username="Ricardo Goulard" age="23" />
    </>
  )
}
```

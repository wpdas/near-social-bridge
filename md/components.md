## Components

This library provides some simple components.

### Spinner

It's a spinner to show the "loading" status.

```tsx
import Spinner from 'near-social-bridge/Spinner'
```

### Container

This component is beneficial as it'll automatically sync the VM iframe's height according to its content height.

```tsx
import Container from 'near-social-bridge/Container'

const MyPage = () => {
  return (
    <Container>
      <p>My nice content</p>
    </Container>
  )
}
```

## Utils

### initRefreshService

If you use this service during the development process, when you press "R" key 3 times, the app is going to refresh.

```ts
import { initRefreshService } from 'near-social-bridge/utils'

// ...
useEffect(() => {
  if (isDev) {
    initRefreshService()
  }
}, [])
// ...
```

### overrideLocalStorage

This is a feature that overrides the `window.localStorage` with the BOS Component's `Storage`, so that, you can keep using `window.localStorage` but the BOS Component's `Storage` is going to be the source of data.

**If using CSR:**

```ts
import { overrideLocalStorage } from 'near-social-bridge/utils'

// using `sessionStorage` under the hood
overrideLocalStorage()

// The BOS Component won't break
localStorage.setItem('name', 'Wenderson')
localStorage.getItem('name') // "Wenderson"
```

**If using SSR:**

```ts
// Page or index.tsx
import { useEffect } from 'react'
import { NearSocialBridgeProvider, overrideLocalStorage } from 'near-social-bridge'
import MyComponent from './MyComponent'
import MyComponent2 from './MyComponent2'

overrideLocalStorage()

const SSRApp = () => {
  useEffect(() => {
    localStorage.setItem('name', 'Wenderson')
  }, [])

  return (
    <NearSocialBridgeProvider waitForStorage>
      <MyComponent />
      <MyComponent2 />
    </NearSocialBridgeProvider>
  )
}

export default SSRApp

// MyComponent
const MyComponent = () => {
  console.log(localStorage.getItem('name')) // "Wenderson"
}

// MyComponent2
import { sessionStorage } from 'near-social-bridge'
const MyComponent2 = () => {
  console.log(sessionStorage.getItem('name')) // "Wenderson"
}
```

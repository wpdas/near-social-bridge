## Session Storage

This feature stores data for components that is persistent across refreshes. You will have access to methods like `setItem`, `getItem`, `removeItem`, `clear` and `keys`. Data is automatically synchronized between the React App and the BOS Component.

```ts
import { sessionStorage } from 'near-social-bridge'

sessionStorage.setItem('name', 'Wenderson')
sessionStorage.getItem('name') // Wenderson
```

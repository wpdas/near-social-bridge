## Persist Storage

This feature provides automatic Redux state persistence for session. It relies on `sessionStorage`.

```ts
// Example using redux with @rematch
import { init } from '@rematch/core'
import persistPlugin from '@rematch/persist'
import { persistStorage } from 'near-social-bridge'
import { RootModel } from './models'

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'full' }>

export const store = init<RootModel>({
  models,
  plugins: [
    // Provides automatic Redux state persistence.
    // https://rematchjs.org/docs/plugins/persist/
    persistPlugin({
      key: 'root',
      storage: persistStorage,
    }),
  ],
})
```

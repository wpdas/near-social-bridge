## BOS API

We've incorporated some APIs to allow your app to interact with different blockchains, websites, and store data in a decentralized way. These features are basically mirroring the [BOS API](https://docs.near.org/bos/api/home) features.

There is a deployed `Hello World` smart contract in the NEAR network at `nearsocialexamples.near` that we're going to use. The contract exposes two methods:

- `set_greeting(message: string): void`, which accepts a message and stores it in the contract state.
- `get_greeting(): string` which returns the stored greeting.

### Near API

A convenient API to interact with the NEAR blockchain. [Complete Docs Here](https://docs.near.org/bos/api/near).

**Near.view**

This will conduct a call to a smart contract that will get a stored message onchain.

```ts
import { Near } from 'near-social-bridge/api'

// Contract
const CONTRACT_ID = 'nearsocialexamples.near'

Near.view<string>(CONTRACT_ID, 'get_greeting').then((response) => console.log(response))
// {message: "The most recent stored greeting message"}
```

**Near.call**

This will conduct a call to a smart contract that will store a message onchain.

```ts
import { Near } from 'near-social-bridge/api'

// Contract
const CONTRACT_ID = 'nearsocialexamples.near'

// Set data
Near.call<{ message: string }>(CONTRACT_ID, 'set_greeting', { message: greeting })
```

### Social API

A convenient API to get data from the SocialDB contract. [Complete Docs Here](https://docs.near.org/bos/api/social).

**Social.get**

```ts
import { Social } from 'near-social-bridge/api'

Social.get('wendersonpires.testnet/widget/*').then((response) => console.log(response))
// {HelloWorld: '...', Chat: '...', ChatV2: '...'}
```

**Social.getr**

```ts
Social.getr('wendersonpires.testnet/profile').then((response) => console.log(response))
// {name: 'Wenderson Pires'}
```

**Social.set**

```ts
const data = { index: { experimental: JSON.stringify({ key: 'current_time', value: Date.now() }) } }
Social.set(data).then((response) => console.log(response))
// If Success: {wendersonpires.testnet: {index: {experimental: "..."}}}
// If Canceled: {error: 'the action was canceled'}
```

**Social.index**

```ts
const _index = await Social.index('experimental', 'current_time', {
  limit: 1000,
  order: 'desc',
}).then((response) => console.log(response))
// [{accountId: 'xyz', blockHeight: 99, value: '1693805434405'}, {...}, {...}, {...}]
```

**Social.keys**

```ts
Social.keys('wendersonpires.testnet/experimental').then((response) => console.log(response))
// {wendersonpires.testnet: {experimental: {...}}}
```

### Storage API

`Storage` object to store data for components that is persistent across refreshes. [Complete Docs Here](https://docs.near.org/bos/api/storage).

**Storage.set**

`Storage.set(key, value)` - sets the public value for a given key under the current widget. The value will be public, so other widgets can read it.

```ts
import { Storage } from 'near-social-bridge/api'

Storage.set('my-storage-key', JSON.stringify({ age: 33, name: 'Wendz' })).then((response) => console.log(response))
// {ok: true}
```

**Storage.get**

`Storage.get(key, widgetSrc?)` - returns the public value for a given key under the given widgetSrc or the current component if `widgetSrc` is omitted. Can only read public values.

```ts
Storage.get('my-storage-key').then((response) => console.log(response))
// {"age":33,"name":"Wendz"}
```

**Storage.privateSet**

`Storage.privateSet(key, value)` - sets the private value for a given key under the current component. The value is private, only the current component can read it.

```ts
Storage.privateSet('my-private-key', JSON.stringify({ age: 18, name: 'Wendz Private' })).then((response) =>
  console.log(response)
)
// {ok: true}
```

**Storage.privateGet**

`Storage.privateGet(key)` - returns the private value for a given key under the current component.

```ts
Storage.privateGet('my-private-key').then((response) => console.log(response))
// {"age":18,"name":"Wendz Private"}
```

### Fetch API

Fetch data from the URL. It's a wrapper around the fetch function from the browser behind the BOS.

Regular / Vanilla Fetch API won't work while your React App is running within BOS. You need to use this feature in order to make API calls from inside the BOS.

**fetch**

```ts
import { fetch } from 'near-social-bridge/api'

fetch<any>('https://rpc.mainnet.near.org/status').then((response) => console.log(response))
//{ "ok":true, "status":200, "contentType":"application/json", "body":{...}}
```

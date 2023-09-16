## Requests

You can make requests to the BOS Component and each request must be handled appropriately by the BOS Component. You can also mock your requests so that they work locally while you are developing the application. All mocks will be automatically disabled when the app is running inside the BOS Component.

### Simple Request

```ts
import { request } from 'near-social-bridge'

// service
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload)

// using the service
getRoomsList({ limit: 2 })
  .then((response) => console.log(response))
  // Error: when not connected to the BOS Component | has no mock | handler not found inside the BOS Component
  .catch((error) => console.error(error))
```

### Handling requests inside the BOS Component

Then, when you test the app inside the BOS Component, the mocks will be automatically disabled. Create a handler for each type of request:

```js
const requestHandler = (request, response) => {
  switch (request.type) {
    case 'get-rooms-list':
      getRoomsListHandler(request, response)
      break
  }
}

const getRoomsListHandler = (request, response) => {
  const { limit } = request.payload;
  // ... use Discovery API to fetch rooms list
  const rooms = Storage.privateGet("app:rooms-list"),
  // ... some logic
  response(request).send({ roomsList: rooms.slice(0, limit) });
};

return (
  <Widget
    src={'wendersonpires.near/widget/NearSocialBridgeCore'}
    props={{
      externalAppUrl,
      requestHandler,
    }}
  />
)
```

### Using request Utils inside the BOS Component

In the BOS Component side, the handler is going to provide 3 props: `request` with its type and payload, `response` that is the way the app send a answer back to the React App and `utils` that provides some useful features like the `promisify`.

The `promisify` needs 4 parameters: `caller` which is going to request something, `resolve`, a method that is going to be called as soon as the _caller_ find an answer, `reject`, method that will be called when the service times out and `timeout`, a optional parameter where you can set the timeout for this promise. The default timeout is 10 seconds.

So, promisify implementation is

```ts
promisify(caller: () => any, resolve: () => void, reject: () => void, timeout: number)
```

Example of using the promisify feature inside the BOS Component:

```js
const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case 'get-rooms-list':
      getRoomsListHandler(request, response, Utils)
      break
  }
}

const getRoomsListHandler = (request, response, Utils) => {
  const { limit } = request.payload

  Utils.promisify(
    // Cached data (may take a while to return a value)
    () => Storage.privateGet('app:rooms-list'),
    (rooms) => {
      // Send the rooms list
      response(request).send({ roomsList: rooms.slice(0, limit) })
    }
  )
}

return (
  <Widget
    src={'wendersonpires.near/widget/NearSocialBridgeCore'}
    props={{
      externalAppUrl,
      requestHandler,
    }}
  />
)
```

### Requests - Concurrency

Sometimes more than one request can be sent simultaneously. The library automatically controls request concurrency, however, you can force a request to be re-executed until a response is obtained. A maximum of 10 rerun attempts will be made. To use this function, just set `forceTryAgain` in the options to `true`.

```ts
import { request } from 'near-social-bridge'

// service
const options = { forceTryAgain: true }
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload, options)

// using the service
getRoomsList({ limit: 2 }).then((response) => console.log(response))
// Now, if for some reason this call does not get a response, new attempts to request the data will be made.
```

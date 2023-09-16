## Mock

As said before, the mock features can help you a lot while developing the app locally. Below are some more useful resources.

### Setup Mocks

You can configure how the mock will handle the requests. The only prop available is `delay` where you can set the delay before sending an answer for each request (simulates async call).

```ts
setupMock({ delay: 1000 })
// From now on, each mock request is going to take 1 second to get an answer.
```

### Mock Authenticated User

Use `mockUser` to mock authenticated user. You can use `createMockUser()` method to provide the user object.

```ts
import { createMockUser, mockUser } from 'near-social-bridge'

// You can optionally set default data. All the data is randomly generated.
const fakeUser = createMockUser({ firstName: 'Wenderson' })
mockUser(fakeUser)
// Now your app has an "authenticated" user
```

### Mock Initial Payload

Use `mockInitialPayload` to mock the initial payload (sent by the Widget).

```ts
// Mock
import { mockInitialPayload } from 'near-social-bridge'

mockInitialPayload({
  defaultRoom: 'dragon-ball-z',
})

// App
import { useInitialPayload } from 'near-social-bridge/hooks'

const MyComponent = () => {
  const { defaultRoom } = useInitialPayload() // 'dragon-ball-z'
}
```

### Create Requests Mocks

This resource is extremely useful, as it allows you to simulate the contract of your application's requests, making it fully work locally. Therefore, you can create the handlers inside the Widget only when you start running the app inside the Widget.

Mock the _"get-rooms-list"_ request:

```ts
import { createMock } from 'near-social-bridge'

const rooms = ['room-1', 'room-2', 'room-3', 'room-4']
const getRoomsListMock = (payload: { limit: number }) => {
  return {
    // always use immutable pattern
    roomsList: [...rooms.slice(0, payload.limit)],
  }
}

// Create mock
createMock('get-rooms-list', getRoomsListMock)
```

Then in the app (running locally):

```ts
import { request } from 'near-social-bridge'

// service
const getRoomsList = (payload: { limit: number }) => request('get-rooms-list', payload)

// using the service
getRoomsList({ limit: 2 }).then((response) => console.log(response)) // ['room-1', 'room-2']
```

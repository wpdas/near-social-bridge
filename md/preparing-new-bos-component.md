## Preparing a new BOS Component

Create a new BOS Component, copy [the content of file **widget-setup.js**](./widget-setup.js) and paste it inside your new BOS Component. Then set its initial props as you wish:

```js
/**
 * External App URL (must)
 */
const externalAppUrl = 'https://<external-app-link-here>'
/**
 * Initial Path (optional)
 */
const path = props.path
/**
 * Initial view height (optional)
 */
const initialViewHeight = 500
/**
 * Initial Payload (optional)
 */
const initialPayload = {}

/**
 * Request Handlers here
 */
const requestHandler = (request, response) => {
  switch (request.type) {
    case 'get-account-id':
      getAccountIdHandler(request, response)
      break
  }
}

const getAccountIdHandler = (request, response) => {
  // You have access to the request payload
  console.log(request.payload) // Any data sent by React App
  const accountId = context.accountId
  // Send a response to the React App
  // "response" needs the "request" object to know the type of the request
  response(request).send({ accountId })
}

// NearSocialBridgeCore BOS Component is the core that makes all the "magic" happens
// use `wendersonpires.testnet/widget/NearSocialBridgeCore` as source if you want to use "testnet" environment
return (
  <Widget
    src={'wendersonpires.near/widget/NearSocialBridgeCore'}
    props={{
      externalAppUrl,
      path,
      initialViewHeight,
      initialPayload,
      requestHandler,
    }}
  />
)
```

**testnet:** Use `wendersonpires.testnet/widget/NearSocialBridgeCore` while creating your application using the testnet environment.

Remember that once your application is running inside the BOS Component, if it is making requests, you must handle each one of them inside the BOS Component, otherwise the unhandled requests will fail.

/**
 * External App URL (must)
 */
const externalAppUrl = 'https://<external-app-link-here>'
/**
 * Initial Path (optional but recommended)
 */
const path = props.path
/**
 * Initial view height (optional but recommended)
 */
const initialViewHeight = 500
/**
 * Initial Payload (optional) - Do not use async data here, it may fail to be ready before sending this initial payload.
 * If you want to get some data, make a "request"
 *
 * Use "useInitialPayload()" hook inside the external app to get this data
 */
const initialPayload = {
  myNiceProp: 'me gusta :D',
}

/**
 * Request Handlers - Backend.
 *
 * - request: payload sent by External App
 *
 * - response: method to send the answer back to the External App
 *
 * - utils: Utils features like
 *      - promisify: (caller, resolve, reject)
 *      There's no Promisse for some features yet, So this is util for when you need to get cached data using DiscoveryAPI, e.g:
 *      utils.promisify(() => Social.getr(`${context.accountId}/profile`), (res) => console.log(res), (err) => console.log(err))
 *
 * @param {{type: string, payload: {}}} request request with payload sent by External App
 * @param {(request) => {send: () => void}} response send the answer back to the External App
 * @param {{promisify:(caller: () => void, resolve: (data) => void, reject: (error) => void)}} utils Utils features like
 */
const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case 'get-account-id':
      getAccountIdHandler(request, response)
      break
  }
}

const getAccountIdHandler = (request, response) => {
  // You have acces to the request payload
  console.log(request.payload) // Any data sent by the External App
  // You can use any Discovery API feature here
  const accountId = context.accountId
  // Send a response to the External App (React App)
  // "response" needs the "request" object to know the type of the request
  // you can read this as "a response to a request"
  response(request).send({ accountId })
}

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

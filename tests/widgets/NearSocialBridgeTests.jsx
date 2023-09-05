const externalAppUrl = 'http://localhost:3000'
const initialViewHeight = 700
const initialPayload = {
  myNiceProp: 'fake value',
  numberProp: 33,
}

/**
 * Request Handlers.
 */
const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case 'request-01':
      exampleHandler(request, response)
      break
    default:
      defaultRequestHandler(request, response)
  }
}

const exampleHandler = (request, response) => {
  response(request).send({ ok: true, for: 'request-01', data_received: request.payload })
}

const defaultRequestHandler = (request, response) => {
  response(request).send({ ok: false, msg: `request handler for "${request.type}" not found.` })
}

return (
  <Widget
    src="wendersonpires.near/widget/NearSocialBridgeCore"
    props={{
      externalAppUrl,
      initialViewHeight,
      initialPayload,
      requestHandler,
    }}
  />
)

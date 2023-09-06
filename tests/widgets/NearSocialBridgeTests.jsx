const externalAppUrl = 'https://near-social-bridge-tests.vercel.app'
const initialViewHeight = 700
const initialPayload = {
  myNiceProp: 'fake value',
  numberProp: 33,
}

State.init({ libVersion: '' })

/**
 * Request Handlers.
 */
const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case 'request-01':
      exampleHandler(request, response)
      break
    case 'set-lib-version':
      setLibVersionHandler(request, response)
      break
    default:
      defaultRequestHandler(request, response)
  }
}

const exampleHandler = (request, response) => {
  response(request).send({ ok: true, for: 'request-01', data_received: request.payload })
}

const setLibVersionHandler = (request, response) => {
  const { libVersion } = request.payload
  State.update({ libVersion })
  response(request).send({ ok: true })
}

const defaultRequestHandler = (request, response) => {
  response(request).send({ ok: false, msg: `request handler for "${request.type}" not found.` })
}

return (
  <>
    <div style={{ marginLeft: '18px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Near Social Bridge {state.libVersion}</h2>
      <p>
        Live test stack for{' '}
        <a style={{ color: '#19b850' }} href="https://github.com/wpdas/near-social-bridge" target="_blank">
          near-social-bridge
        </a>{' '}
        lib
      </p>
    </div>
    <Widget
      src="wendersonpires.near/widget/NSLVWidget"
      props={{
        src: 'wendersonpires.near/widget/NearSocialBridgeCore',
        srcProps: { externalAppUrl, initialViewHeight, initialPayload, requestHandler },
      }}
    />
  </>
)

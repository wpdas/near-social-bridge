// Crucial checks
if (!props.externalAppUrl) {
  return (
    <p style={{ fontWeight: 600, color: '#AB2E28', fontFamily: 'Courier new' }}>
      Error: "externalAppUrl" prop must be provided
    </p>
  )
}

/**
 * Load React, React Dom and the Core Bridge library
 *
 * It's recommended to use VSCode to edit this code.
 * Save this code in the core.js file as well.
 */
const code = `
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<div id="bridge-root"></div>

<script>
// Viewer port
let viewerPort

// Outside of the component state controller
let state = {
  externalAppUrl: '',
  initialPath: null,
  iframeHeight: 480,
  userInfo: null,
  initialPayload: {},
  sessionStorageClone: {},
  connectMessageSent: false,
}

// Core Component
function NearSocialBridgeCore(props) {
  const [externalAppUrl, setExternalAppUrl] = React.useState(state.externalAppUrl)
  const [connectMessageSent, setConnectMessageSent] = React.useState(state.connectMessageSent)
  const [iframeHeight, setIframeHeight] = React.useState(state.iframeHeight)
  const [, setSessionStorageClone] = React.useState(state.sessionStorageClone)
  const [, setUserInfo] = React.useState(state.userInfo)

  React.useEffect(() => {
    const handler = (e) => {
      // Set the Viewer port
      if (!viewerPort && e.data.type === 'connect-view') {
        viewerPort = e.source
        setExternalAppUrl(e.data.externalAppUrl)
        setIframeHeight(e.data.initialIframeHeight || 480)
        setUserInfo(e.data.userInfo)
        state.externalAppUrl = e.data.externalAppUrl
        state.initialPath = e.data.initialPath
        state.userInfo = e.data.userInfo
        state.initialPayload = e.data.initialPayload
        state.iframeHeight = e.data.initialIframeHeight || 480
      }

      // When get a message from the View
      if (viewerPort && e.data.from === 'view') {
        // Is it message to the core?
        if (e.data.type.includes('core:')) {
          // process eventual message to core here
          return
        }

        // Send to external app
        sendMessage(e.data)
      }
    }

    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  const sendMessage = (message) => {
    var iframe = document.getElementById('myIframe')
    iframe.contentWindow.postMessage(message, '*')
  }

  const sendMessageToView = (message) => {
    viewerPort.postMessage(message, '*')
  }

  // Answer Factory
  const buildAnswer = (requestType, payload) => {
    return {
      from: 'core',
      type: 'answer',
      requestType,
      payload,
    }
  }

  // Build connection payload
  const buildConnectionPayload = () => ({
    type: 'connect',
    payload: {
      userInfo: state.userInfo,
      initialPath: state.initialPath,
      initialPayload: state.initialPayload,
    },
    created_at: Date.now(),
  })

  const onMessageHandler = (message) => {
    // Internal Request Handler
    if (message.data.from === 'external-app') {
      // Is to the Core
      if (message.data.type.includes('nsb:')) {
        internalRequestHandler(message.data)
      } else {
        // Is to the View
        // Send it straight to the View
        sendMessageToView(message.data)
      }
    }
  }

  /**
   * Core - Internal Request handlers
   * All core data "nsb" will pass here first
   * @param {*} message
   */
  const internalRequestHandler = (message) => {
    switch (message.type) {
      case 'nsb:session-storage:hydrate-viewer':
        sessionStorageHydrateViewer(message.type, message.payload)
        break
      case 'nsb:session-storage:hydrate-app':
        sessionStorageHydrateApp(message.type, message.payload)
        break
      case 'nsb:navigation:sync-content-height':
        syncContentHeight(message.type, message.payload)
        sendMessageToView(message) // The view need to handle it
        break
      case 'nsb:auth:get-user-info':
        sendMessageToView(message) // The view need to handle it
        break
    }
  }

  const sessionStorageHydrateViewer = (requestType, payload) => {
    if (payload) {
      setSessionStorageClone(payload)
      state.sessionStorageClone = payload
    }

    const responseBody = buildAnswer(requestType, payload)
    sendMessage(responseBody)
  }

  const sessionStorageHydrateApp = (requestType) => {
    const responseBody = buildAnswer(requestType, state.sessionStorageClone)
    sendMessage(responseBody)
  }

  const syncContentHeight = (requestType, payload) => {
    if (payload.height) {
      setIframeHeight(payload.height)
      state.iframeHeight = payload.height
    }

    const responseBody = buildAnswer(requestType)
    sendMessage(responseBody)
  }

  function onLoadHandler(e) {
    // On load iframe
    // On get msg from External App
    if (!connectMessageSent) {
      setConnectMessageSent(true)
      state.connectMessageSent = true
      window.addEventListener('message', onMessageHandler, false)
    }

    // Send the welcome message (connects with the external app)
    const welcomePayload = buildConnectionPayload()
    sendMessage(welcomePayload)

    // Wait a bit and send the message again to ensure the app and scripts are loaded and ready
    setTimeout(() => {
      sendMessage(buildConnectionPayload())
    }, 2000)
  }

  // Wait for the external app url to render the iframe
  if (!state.externalAppUrl) return null

  return React.createElement('iframe', {
    sandbox: 'allow-scripts',
    id: 'myIframe',
    src: externalAppUrl,
    style: { border: 'none', width: '100%', height: iframeHeight + 'px', margin: 0, padding: 0 },
    onLoad: onLoadHandler,
  })
}

const domContainer = document.querySelector('#bridge-root')
const root = ReactDOM.createRoot(domContainer)
root.render(React.createElement(NearSocialBridgeCore, {}))
</script>
`

// (i) Discovery API uses cached data structure
const Utils = {
  /**
   * Send message
   */
  sendMessage: (message) => {
    State.update({
      currentMessage: message,
    })
  },
  /**
   * Call resolve or reject for a given caller
   * E.g:
   * Utils.promisify(() => getCachedObject(), (res) => console.log(res), (err) => console.log(err))
   */
  promisify: (caller, resolve, reject) => {
    const timer = 1000
    const timeout = timer * 10
    let timeoutCheck = 0

    const find = () => {
      const response = caller()
      if (response) {
        resolve(response)
      } else {
        if (timeoutCheck < timeout) {
          // try again
          setTimeout(find, 1000)
          timeoutCheck += timer
        } else {
          reject(null)
        }
      }
    }

    // Fist attempt
    find()
  },
}

// External App Url
const externalAppUrl = props.externalAppUrl

// User Info
const accountId = context.accountId
const userInfo = { accountId }

// Initial Path
const initialPath = props.path

// Initial iframe height
const initialIframeHeight = props.initialViewHeight || 500

// Initial Payload (optional)
const initialPayload = props.initialPayload || {}

// Initial State
State.init({
  iframeHeight: initialIframeHeight,
  // (i) DON'T send async data, it's going to randonly fail
  // If you need to get new info, use "request" for that
  currentMessage: {
    type: 'connect-view',
    externalAppUrl,
    userInfo,
    initialPath,
    initialPayload,
    initialIframeHeight,
  },
})

// Answer Factory
const buildAnswer = (requestType, payload) => {
  return {
    from: 'view',
    type: 'answer',
    requestType,
    payload,
    created_at: Date.now(),
  }
}

/**
 * Widget response factory - closure
 *
 * E.g:
 * const response = responseFactory.build()
 * response({type: 'request-type'}).send({myPayloadHere: 123})
 */
const responseFactory = {
  build: () => {
    return (request) => {
      return {
        send: (payload) => {
          const responseBody = buildAnswer(request.type, payload)
          Utils.sendMessage(responseBody)
        },
      }
    }
  },
}

const onMessageHandler = (message) => {
  // Handles core calls
  if (message.type.includes('nsb:')) {
    handlerCoreRequests(message)
    return
  }

  // Handles Widget request calls:
  // - request: payload sent by External App
  // - response: method to send the answer back to the External App
  // - utils: Utils features like: promisify, ...
  const request = {
    type: message.type,
    payload: message.payload,
  }
  const utils = {
    promisify: Utils.promisify,
  }
  props.requestHandler(request, responseFactory.build(), utils)
}

// REQUEST HANDLERS BELOW
// Todos os tipos "nsb" passam pelo core.js primeiro
const handlerCoreRequests = (message) => {
  switch (message.type) {
    case 'nsb:navigation:sync-content-height':
      setIframeHeight(message.type, message.payload)
      break
    // NEW
    case 'nsb:auth:get-user-info':
      getUserInfo(message.type, message.payload)
      break
    // NEW
  }
}

// [DON'T REMOVE]: Set thew new iFrame height based on the new screen/route
const setIframeHeight = (requestType, payload) => {
  State.update({ iframeHeight: payload.height + 20 })
}

// NEW
// [DON'T REMOVE]
// Get user info
const getUserInfo = (requestType, payload) => {
  // check if user is signed in
  if (!accountId) {
    const responseBody = buildAnswer(requestType, {
      error: 'user is not signed in',
    })
    Utils.sendMessage(responseBody)
    return
  }

  Utils.promisify(
    () => Social.getr(`${accountId}/profile`), // profile info
    (res) => {
      const responseBody = buildAnswer(requestType, {
        accountId,
        profileInfo: res,
      })
      Utils.sendMessage(responseBody)
    },
    (err) => {
      console.log('error fetching profile data', err)
    }
  )
}
// NEW
// REQUEST HANDLERS ABOVE

return (
  <div>
    <iframe
      className="w-100"
      style={{ height: `${state.iframeHeight}px` }}
      srcDoc={code}
      message={state.currentMessage}
      onMessage={onMessageHandler}
    />
  </div>
)

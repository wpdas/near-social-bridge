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
    sandbox: 'allow-scripts allow-popups-to-escape-sandbox allow-popups',
    id: 'myIframe',
    src: externalAppUrl,
    style: { border: 'none', width: '100%', height: iframeHeight + 'px', margin: 0, padding: 0 },
    onLoad: onLoadHandler,
  })
}

const domContainer = document.querySelector('#bridge-root')
const root = ReactDOM.createRoot(domContainer)
root.render(React.createElement(NearSocialBridgeCore, {}))

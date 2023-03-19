// External App URL
const externalAppUrl = 'https://6fa4294326de.ngrok.app/'

// Viewer port
let viewerPort

// Possible values: 'development' | 'production'
const env = 'development'

// Outside of the component state controller
let state = {
  iframeHeight: 720,
  sessionStorageClone: {},
  connectMessageSent: false,
}

// Core Component
function NearSocialBridgeCore(props) {
  const [environment] = React.useState(env)
  const [connectMessageSent, setConnectMessageSent] = React.useState(state.connectMessageSent)
  const [iframeHeight, setIframeHeight] = React.useState(state.iframeHeight)
  const [sessionStorageClone, setSessionStorageClone] = React.useState(state.sessionStorageClone)

  React.useEffect(() => {
    const handler = (e) => {
      // Set the Viewer port
      if (!viewerPort && e.data === 'connect-view') {
        viewerPort = e.source
      }

      // When get a message from the View
      if (viewerPort && e.data.from === 'view') {
        console.log('Got a message from View', e.data)
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

  // // SETUP: Answer Factory
  const buildAnswer = (requestType, payload) => {
    return {
      from: 'core',
      type: 'answer',
      requestType,
      payload,
    }
  }

  // SETUP: Create connection payload
  const createConnectionPayload = () => {
    // Return the connect payload
    return {
      type: 'connect',
      created_at: Date.now(),
      payload: {
        // SETUP: initial path (tell the external app witch route should be rendered first)
        // initialPath, // pegar do View
        // additional data below (optional)
        // accountId,
        // ipfsCidAvatar: profileInfo.image?.ipfs_cid,
      },
    }
  }

  const onMessageHandler = (message) => {
    // Internal Request Handler
    if (message.data.from === 'external-app') {
      internalRequestHandler(message.data)
    }

    // Custom Request Handler
    // customRequestHandler(message.data); // TODO: IMPLEMENTAR
  }

  // SETUP: Internal Request handlers
  const internalRequestHandler = (message) => {
    // console.log(message)
    switch (message.type) {
      case 'nsb:session-storage:hydrate-viewer':
        sessionStorageHydrateViewer(message.type, message.payload)
        break
      case 'nsb:session-storage:hydrate-app':
        sessionStorageHydrateApp(message.type, message.payload)
        break
      case 'nsb:navigation:sync-content-height':
        syncContentHeight(message.type, message.payload)
        sendMessageToView(message)
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

  const sessionStorageHydrateApp = (requestType, payload) => {
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
    // Apos carregar o iframe
    // Ao receber msg do external App
    if (!connectMessageSent) {
      setConnectMessageSent(true)
      state.connectMessageSent = true
      window.addEventListener('message', onMessageHandler, false)
    }

    // Envia mensagem welcome
    // Wait a bit to send the "connect" payload only after all the scripts are loaded and the component
    // is ready
    // setTimeout(() => {
    // if (!connectMessageSent) {
    // setConnectMessageSent(true);
    const welcomePayload = createConnectionPayload()
    sendMessage(welcomePayload)
    // }
    // }, 1000)
  }

  return React.createElement('iframe', {
    sandbox: 'allow-scripts',
    id: 'myIframe',
    src: externalAppUrl,
    title: 'foo',
    style: { border: 'none', width: '100%', height: iframeHeight + 'px' },
    onLoad: onLoadHandler,
  })
}

const domContainer = document.querySelector('#react-root')
const root = ReactDOM.createRoot(domContainer)
root.render(React.createElement(NearSocialBridgeCore, {}))

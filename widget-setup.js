// Load React, React Dom and the Core Bridge library
const code = `
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<div id="bridge-root"></div>
<script src="https://unpkg.com/near-social-bridge@1.0.0-beta5/bridge.min.js" crossorigin></script>
`
// Utils
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
          console.log(timeoutCheck)
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
const externalAppUrl = 'https://<your-external-app-url>.ngrok.app/'

// User Info
const accountId = context.accountId
const userInfo = { accountId }

// Initial Path
const initialPath = props.path

// Initial iframe height
const initialIframeHeight = 500

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

const onMessageHandler = (message) => {
  requestsHandler(message)
}

// REQUEST HANDLERS BELOW
const requestsHandler = (message) => {
  switch (message.type) {
    case 'nsb:navigation:sync-content-height':
      setIframeHeight(message.type, message.payload)
      break
    case 'nsb:auth:get-user-info':
      getUserInfo(message.type, message.payload)
      break
  }
}

// [DON'T REMOVE]: Set thew new iFrame height based on the new screen/route
const setIframeHeight = (requestType, payload) => {
  State.update({ iframeHeight: payload.height + 20 })
}

const getUserInfo = (requestType, payload) => {
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
      console.error('error fetching profile data', err)
    }
  )
}
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

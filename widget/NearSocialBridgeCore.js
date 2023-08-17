/**
 * This Widget is part of the NEAR Social Bridge library.
 * Visit https://github.com/wpdas/near-social-bridge to get to know more.
 */

// Crucial checks
if (!props.externalAppUrl) {
  return (
    <div>
      <p style={{ fontWeight: 600, color: '#AB2E28', fontFamily: 'Courier new' }}>
        This Widget is part of the <a href="https://github.com/wpdas/near-social-bridge">"near-social-bridge"</a>{' '}
        library that makes it possible to develop common ReactJS applications and inject them into the BOS having access
        to all Discovery API resources.
      </p>
      <p style={{ fontWeight: 600, color: '#AB2E28', fontFamily: 'Courier new' }}>
        Learn more here:{' '}
        <a href="https://github.com/wpdas/near-social-bridge">https://github.com/wpdas/near-social-bridge</a>
      </p>
    </div>
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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reseter.css/1.0.8/reseter.min.css">
<div id="bridge-root"></div>
<script src="https://unpkg.com/near-social-bridge@1.3.0/widget/core.min.js" crossorigin></script>
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
   * var timeout = 5000 // 5sec
   * Utils.promisify(() => getCachedObject(), (res) => console.log(res), (err) => console.log(err), timeout)
   *
   * Default timeout is 10 seconds
   */
  promisify: (caller, resolve, reject, _timeout) => {
    const timer = 1000
    const timeout = _timeout || timer * 10
    let timeoutCheck = 0

    const find = () => {
      const response = caller()
      if (response !== undefined && response !== null) {
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

  if (props.requestHandler) {
    props.requestHandler(request, responseFactory.build(), utils)
  }
}

// REQUEST HANDLERS BELOW
const handlerCoreRequests = (message) => {
  switch (message.type) {
    case 'nsb:session-storage:hydrate-viewer':
      sessionStorageHydrateViewer(message.type, message.payload)
      break
    case 'nsb:session-storage:hydrate-app':
      sessionStorageHydrateApp(message.type, message.payload)
      break
    case 'nsb:navigation:sync-content-height':
      setIframeHeight(message.type, message.payload)
      break
    case 'nsb:auth:get-user-info':
      getUserInfo(message.type, message.payload)
      break

    // API NEAR
    case 'nsb:near:view':
      nearView(message.type, message.payload)
      break
    case 'nsb:near:call':
      nearCall(message.type, message.payload)
      break

    // API Social
    case 'nsb:social:get':
      socialGet(message.type, message.payload)
      break
    case 'nsb:social:getr':
      socialGetr(message.type, message.payload)
      break
    case 'nsb:social:keys':
      socialKeys(message.type, message.payload)
      break
    case 'nsb:social:index':
      socialIndex(message.type, message.payload)
      break
    case 'nsb:social:set':
      socialSet(message.type, message.payload)
      break

    // API Storage
    case 'nsb:storage:get':
      storageGet(message.type, message.payload)
      break
    case 'nsb:storage:set':
      storageSet(message.type, message.payload)
      break
    case 'nsb:storage:private-get':
      storagePrivateGet(message.type, message.payload)
      break
    case 'nsb:storage:private-set':
      storagePrivateSet(message.type, message.payload)
      break
  }
}

const CORE_STORAGE_KEY = 'app:storage'
// Store data
const sessionStorageHydrateViewer = (requestType, payload) => {
  if (payload) {
    // store data
    Storage.privateSet(CORE_STORAGE_KEY, payload)

    const responseBody = buildAnswer(requestType, payload)
    Utils.sendMessage(responseBody)
  }
}

// Retrieve stored data
const sessionStorageHydrateApp = (requestType) => {
  Utils.promisify(
    // get stored data
    () => Storage.privateGet(CORE_STORAGE_KEY),
    (storageData) => {
      const responseBody = buildAnswer(requestType, storageData)
      Utils.sendMessage(responseBody)
    },
    () => {
      // After 3 seconds, if no data is found, just send
      // an empty answer
      const responseBody = buildAnswer(requestType)
      Utils.sendMessage(responseBody)
    },
    3000
  )
}

// Set thew new iFrame height based on the new screen/route
const setIframeHeight = (requestType, payload) => {
  State.update({ iframeHeight: payload.height + 20 })
  const responseBody = buildAnswer(requestType, {})
  Utils.sendMessage(responseBody)
}

// Get user info
const getUserInfo = (requestType) => {
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
    () => {
      // Send the accountId only
      Utils.sendMessage({ accountId })
    }
  )
}

// NEAR.view
const nearView = (requestType, payload) => {
  const { contractName, methodName, args, blockId } = payload

  Utils.promisify(
    () => Near.view(contractName, methodName, args, blockId),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// NEAR.call
const nearCall = (requestType, payload) => {
  const { contractName, methodName, args, gas, deposit } = payload

  // Make the call
  Near.call(contractName, methodName, args, gas, deposit)

  // Send an immediate answer back to say it was done.
  // It's not possible for the time being to get the immediate result because the page is
  // going to refresh after the user accepts the transaction
  const response = buildAnswer(requestType)
  Utils.sendMessage(response)
}

// Social.get
const socialGet = (requestType, payload) => {
  const { patterns, finality } = payload

  Utils.promisify(
    () => Social.get(patterns, finality),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// Social.getr
const socialGetr = (requestType, payload) => {
  const { patterns, finality } = payload

  Utils.promisify(
    () => Social.getr(patterns, finality),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// Social.keys
const socialKeys = (requestType, payload) => {
  const { patterns, finality, options } = payload

  Utils.promisify(
    () => Social.keys(patterns, finality, options),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// Social.index
const socialIndex = (requestType, payload) => {
  const { action, key, options } = payload

  Utils.promisify(
    () => Social.index(action, key, options),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// Social.set
const socialSet = (requestType, payload) => {
  const { data } = payload

  Social.set(data, {
    force: true,
    onCommit: (res) => {
      const response = buildAnswer(requestType, res)
      Utils.sendMessage(response)
    },
    onCancel: () => {
      const response = buildAnswer(requestType, {
        error: 'the action was canceled',
      })
      Utils.sendMessage(response)
    },
  })
}

// Storage.get
const storageGet = (requestType, payload) => {
  const { key, widgetSrc } = payload

  Utils.promisify(
    () => Storage.get(key, widgetSrc),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// Storage.set
const storageSet = (requestType, payload) => {
  const { key, value } = payload
  Storage.set(key, value)

  // Send an immediate answer back to say it was done.
  const response = buildAnswer(requestType, { ok: true })
  Utils.sendMessage(response)
}

// Storage.privateGet
const storagePrivateGet = (requestType, payload) => {
  const { key } = payload

  Utils.promisify(
    () => Storage.privateGet(key),
    (data) => {
      const response = buildAnswer(requestType, data)
      Utils.sendMessage(response)
    },
    () => {
      const response = buildAnswer(requestType)
      Utils.sendMessage(response)
    }
  )
}

// Storage.privateSet
const storagePrivateSet = (requestType, payload) => {
  const { key, value } = payload
  Storage.privateSet(key, value)

  // Send an immediate answer back to say it was done.
  const response = buildAnswer(requestType, { ok: true })
  Utils.sendMessage(response)
}

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

// Viewer port
let viewerPort;

// Outside of the component state controller
let state = {
  externalAppUrl: "",
  initialPath: null,
  iframeHeight: 780,
  sessionStorageClone: {},
  connectMessageSent: false,
};

// Core Component
function NearSocialBridgeCore(props) {
  const [externalAppUrl, setExternalAppUrl] = React.useState(
    state.externalAppUrl
  );
  const [connectMessageSent, setConnectMessageSent] = React.useState(
    state.connectMessageSent
  );
  const [iframeHeight, setIframeHeight] = React.useState(state.iframeHeight);
  const [sessionStorageClone, setSessionStorageClone] = React.useState(
    state.sessionStorageClone
  );

  React.useEffect(() => {
    const handler = (e) => {
      // Set the Viewer port
      if (!viewerPort && e.data.type === "connect-view") {
        viewerPort = e.source;
        setExternalAppUrl(e.data.externalAppUrl);
        state.externalAppUrl = e.data.externalAppUrl;
        state.initialPath = e.data.initialPath;
      }

      // When get a message from the View
      if (viewerPort && e.data.from === "view") {
        // Is it message to the core?
        if (e.data.type.includes("core:")) {
          // process eventual message to core here
          return;
        }

        // Send to external app
        sendMessage(e.data);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const sendMessage = (message) => {
    var iframe = document.getElementById("myIframe");
    iframe.contentWindow.postMessage(message, "*");
  };

  const sendMessageToView = (message) => {
    viewerPort.postMessage(message, "*");
  };

  // Answer Factory
  const buildAnswer = (requestType, payload) => {
    return {
      from: "core",
      type: "answer",
      requestType,
      payload,
    };
  };

  // Create connection payload
  const createConnectionPayload = () => {
    // Return the connect payload
    return {
      type: "connect",
      payload: {
        initialPath: state.initialPath,
      },
      initialPath: state.initialPath,
      created_at: Date.now(),
    };
  };

  const onMessageHandler = (message) => {
    // Internal Request Handler
    if (message.data.from === "external-app") {
      // Is to the Core
      if (message.data.type.includes("nsb:")) {
        internalRequestHandler(message.data);
      } else {
        // Is to the View
        sendMessageToView(message.data);
      }
    }
  };

  // Internal Request handlers
  const internalRequestHandler = (message) => {
    switch (message.type) {
      case "nsb:session-storage:hydrate-viewer":
        sessionStorageHydrateViewer(message.type, message.payload);
        break;
      case "nsb:session-storage:hydrate-app":
        sessionStorageHydrateApp(message.type, message.payload);
        break;
      case "nsb:navigation:sync-content-height":
        syncContentHeight(message.type, message.payload);
        sendMessageToView(message);
        break;
    }
  };

  const sessionStorageHydrateViewer = (requestType, payload) => {
    if (payload) {
      setSessionStorageClone(payload);
      state.sessionStorageClone = payload;
    }

    const responseBody = buildAnswer(requestType, payload);
    sendMessage(responseBody);
  };

  const sessionStorageHydrateApp = (requestType, payload) => {
    const responseBody = buildAnswer(requestType, state.sessionStorageClone);
    sendMessage(responseBody);
  };

  const syncContentHeight = (requestType, payload) => {
    if (payload.height) {
      setIframeHeight(payload.height);
      state.iframeHeight = payload.height;
    }

    const responseBody = buildAnswer(requestType);
    sendMessage(responseBody);
  };

  function onLoadHandler(e) {
    // On load iframe
    // On get msg from External App
    if (!connectMessageSent) {
      setConnectMessageSent(true);
      state.connectMessageSent = true;
      window.addEventListener("message", onMessageHandler, false);
    }

    // Envia mensagem welcome
    const welcomePayload = createConnectionPayload();
    sendMessage(welcomePayload);
  }

  // Wait for the external app url to render the iframe
  if (!state.externalAppUrl) return null;

  return React.createElement("iframe", {
    sandbox: "allow-scripts",
    id: "myIframe",
    src: externalAppUrl,
    style: { border: "none", width: "100%", height: iframeHeight + "px" },
    onLoad: onLoadHandler,
  });
}

const domContainer = document.querySelector("#bridge-root");
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(NearSocialBridgeCore, {}));

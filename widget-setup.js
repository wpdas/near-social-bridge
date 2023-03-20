// Load React, React Dom and the Core Bridge library
const code = `
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<div id="bridge-root"></div>
<script src="https://unpkg.com/near-social-bridge@1.0.0-beta3/bridge.min.js" crossorigin></script>
`;

// External App Url
const externalAppUrl = "https://<your-external-app-url>.ngrok.app/";

// Initial Path
const initialPath = props.path;

// Initial iframe height
const initialIframeHeight = 500;

// Initial State
State.init({
  iframeHeight: initialIframeHeight,
  currentMessage: {
    type: "connect-view",
    externalAppUrl,
    initialPath,
    initialIframeHeight,
  },
});

// Message sender
const sendMessage = (message) => {
  State.update({
    currentMessage: message,
  });
};

// Answer Factory
const buildAnswer = (requestType, payload) => {
  return {
    from: "view",
    type: "answer",
    requestType,
    payload,
    created_at: Date.now(),
  };
};

const onMessageHandler = (message) => {
  requestsHandler(message);
};

// REQUEST HANDLERS BELOW
const requestsHandler = (message) => {
  switch (message.type) {
    case "nsb:navigation:sync-content-height":
      setIframeHeight(message.type, message.payload);
      break;
    case "get-user-info":
      sendUserInfo(message.type, message.payload);
      break;
  }
};

// [DON'T REMOVE]: Set thew new iFrame height based on the new screen/route
const setIframeHeight = (requestType, payload) => {
  State.update({ iframeHeight: payload.height + 20 });
};

// [E.g]Get user info
const sendUserInfo = (requestType, payload) => {
  const accountId = context.accountId ?? "*";
  const profileInfo = Social.getr(`${accountId}/profile`);
  const responseBody = buildAnswer(requestType, {
    accountId,
    profileInfo,
  });
  sendMessage(responseBody);
};
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
);

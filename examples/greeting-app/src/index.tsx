import { NearSocialBridgeProvider, Spinner } from "near-social-bridge";
import "near-social-bridge/near-social-bridge.css";

import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import "./App.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <NearSocialBridgeProvider fallback={<Spinner />}>
      <App />
    </NearSocialBridgeProvider>
  </>
);

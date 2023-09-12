// src/index.tsx
import ReactDOM from 'react-dom/client'
import './index.css'
import 'near-social-bridge/near-social-bridge.css'

import App from './App'
import { NearSocialBridgeProvider, Spinner } from 'near-social-bridge'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <NearSocialBridgeProvider fallback={<Spinner />}>
    <App />
  </NearSocialBridgeProvider>
)

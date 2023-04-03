import { useEffect, useState } from 'react'
import {
  ConnectionPayload,
  getConnectionPayload,
  getConnectionStatus,
  onConnectObservable,
} from '../services/bridge-service'

/**
 * Get the initial payload sent by View (VM)
 * @returns Initial payload sent by View
 */
const useInitialPayload = <T>() => {
  const [initialPayload, setInitialPayload] = useState<T>(getConnectionPayload().initialPayload as T)

  useEffect(() => {
    if (getConnectionStatus() === 'connected') {
      setInitialPayload(getConnectionPayload().initialPayload as T)
    }

    const handler = (payload: ConnectionPayload) => {
      setInitialPayload(payload.initialPayload)
    }

    onConnectObservable.subscribe(handler)

    return () => {
      onConnectObservable.unsubscribe(handler)
    }
  }, [])

  return initialPayload
}
export default useInitialPayload

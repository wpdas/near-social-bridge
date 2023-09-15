import { useEffect, useState } from 'react'
import { getConnectionStatus, onConnectObservable } from '../services/bridge-service'

/**
 * Get the connection status
 * @returns Connection status
 */
const useConnectionStatus = () => {
  const [status, setStatus] = useState(getConnectionStatus())

  useEffect(() => {
    const handler = () => {
      setStatus(getConnectionStatus())
    }

    onConnectObservable.subscribe(handler)

    return () => {
      onConnectObservable.unsubscribe(handler)
    }
  }, [status])

  return status
}
export default useConnectionStatus

import { useCallback, useEffect, useState } from 'react'
import { syncContentHeight } from '../navigation/syncContentHeight'

/**
 * Auto sync the iframe's height with content's height.
 * @returns true/false (is sync complete?)
 */
const useSyncContentHeight = () => {
  const [done, isDone] = useState(false)

  const sync = useCallback(() => {
    isDone(false)
    setTimeout(() => {
      syncContentHeight().finally(() => isDone(true))
    }, 0)
  }, [])

  useEffect(() => {
    sync()
  }, [sync])

  return {
    done,
    /**
     * Sync the content height again
     */
    syncAgain: () => {
      // Necessary to wait new components to be shown
      setTimeout(() => {
        sync()
      }, 0)
    },
  }
}

export default useSyncContentHeight

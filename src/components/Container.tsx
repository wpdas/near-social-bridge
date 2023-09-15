import React, { ReactNode, useEffect } from 'react'
import useSyncContentHeight from '../hooks/useSyncContentHeight'

type Props = {
  children: ReactNode
}

/**
 * This component is used to auto-update the VM iframe's height according to this component's content height
 */
const Container: React.FC<Props> = ({ children }) => {
  const { syncAgain } = useSyncContentHeight()
  useEffect(() => {
    setTimeout(() => {
      syncAgain()
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}

export default Container

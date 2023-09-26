import React, { useLayoutEffect, useState } from 'react'

// Source: https://github.com/uidotdev/usehooks/blob/main/index.js
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}

// NSB hook
export type ParamsProps = Record<string, unknown>
export type BOSComponentProps = {
  src: string
  fullWidth?: boolean
  fullHeight?: boolean
  width?: number
  height?: number
  networkId?: 'mainnet' | 'testnet'
  props?: ParamsProps
}

/** Parse props to query parameters */
const propsToQuery = (props?: ParamsProps) => {
  if (!props) {
    return ''
  }

  const queries: string[] = []

  const keys = Object.keys(props)
  keys.forEach((key, index) => {
    queries.push(`${index === 0 ? '?' : '&'}${key}=${props[key]}`)
  })

  const parsedQueries = queries.join('')
  return parsedQueries
}

/**
 * Experimental - Load BOS Components with props using iframe
 * @returns
 */
const BOSComponent = ({
  src,
  fullWidth = false,
  fullHeight = false,
  width = 400,
  height = 200,
  networkId = 'mainnet',
  props,
}: BOSComponentProps) => {
  const screenSize = useWindowSize()

  return (
    <div style={{ overflow: 'hidden' }}>
      <iframe
        style={{ marginTop: '-150px', border: 'none' }}
        src={`https://${networkId === 'testnet' ? 'test.near.org' : 'near.org'}/${src}${propsToQuery(props)}`}
        title="bos component"
        width={fullWidth ? screenSize.width : width}
        height={fullHeight ? screenSize.height + 150 : height}
      />
    </div>
  )
}

export default BOSComponent

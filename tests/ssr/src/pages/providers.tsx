'use client'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { NearSocialBridgeProvider, Spinner } from '@lib'

import '@lib-styles' // same as import "near-social-bridge/near-social-bridge.css";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NearSocialBridgeProvider fallback={<Spinner />}>
      <ChakraProvider>{children}</ChakraProvider>
    </NearSocialBridgeProvider>
  )
}

export default Providers

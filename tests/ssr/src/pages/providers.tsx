'use client'

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { NearSocialBridgeProvider, Spinner } from '@lib'
import TestStackProvider from '@app/contexts/TestStackProvider'

import '@lib-styles' // same as import "near-social-bridge/near-social-bridge.css";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NearSocialBridgeProvider fallback={<Spinner />}>
      <TestStackProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </TestStackProvider>
    </NearSocialBridgeProvider>
  )
}

export default Providers

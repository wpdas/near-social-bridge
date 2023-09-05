import { useCallback, useEffect, useState } from 'react'
import { Divider, Heading, Stack, Text } from '@chakra-ui/react'
import { useSyncContentHeight } from '@lib'

import Container from './components/Container'
import nsv_package from '../../../package.json'
import TestStatus from './components/TestStatus'
import { useTestStack } from '@app/contexts/TestStackProvider'

import TestStack from './stack/TestStack'
import NearAPIStack from './stack/NearAPIStack'
import SocialAPIStack from './stack/SocialAPIStack'
import StorageAPIStack from './stack/StorageAPIStack'
import RequestStack from './stack/RequestStack'
import MockStack from './stack/MockStack'
import UseAuthStack from './stack/UseAuthStack'
import NavigationStack from './stack/NavigationStack'
import SessionStorageStack from './stack/SessionStorageStack'
import PersistStorageStack from './stack/PersistStorageStack'
import UseNearSocialBridgeStack from './stack/UseNearSocialBridgeStack'
import UseInitialPayloadStack from './stack/UseInitialPayloadStack'
import UseNavigationStack from './stack/UseNavigationStack'
import UseSessionStorageStack from './stack/UseSessionStorageStack'
import UseWidgetViewStack from './stack/UseWidgetViewStack'
import UseSyncContentHeightStack from './stack/UseSyncContentHeightStack'

const initialStackState = {
  nearAPI: { run: true },
  socialAPI: { run: false },
  storageAPI: { run: false },
  request: { run: false },
  mock: { run: false },
  navigation: { run: false },
  sessionStorage: { run: false },
  persistStorage: { run: false },
  useNearSocialBridge: { run: false },
  useInitialPayload: { run: false },
  useNavigation: { run: false },
  useSessionStorage: { run: false },
  useAuth: { run: false },
  useWidgetView: { run: false },
  useSyncContentHeight: { run: false },
}

const STACK_KEYS = {
  nearAPI: 'nearAPI',
  socialAPI: 'socialAPI',
  storageAPI: 'storageAPI',
  request: 'request',
  mock: 'mock',
  navigation: 'navigation',
  sessionStorage: 'sessionStorage',
  persistStorage: 'persistStorage',
  useNearSocialBridge: 'useNearSocialBridge',
  useInitialPayload: 'useInitialPayload',
  useNavigation: 'useNavigation',
  useSessionStorage: 'useSessionStorage',
  useAuth: 'useAuth',
  useWidgetView: 'useWidgetView',
  useSyncContentHeight: 'useSyncContentHeight',
}

const Home = () => {
  const { timestamp } = useTestStack()
  const { syncAgain } = useSyncContentHeight()

  useEffect(() => {
    syncAgain()
  }, [timestamp])

  // Stacks
  const [stacks, updateStacks] = useState(initialStackState)

  // Go to next test stack
  const runNow = useCallback(
    (stackKey: string) => {
      updateStacks({ ...stacks, [stackKey]: { run: true } })
    },
    [stacks]
  )

  // On test is finished
  const testFinished = () => {
    console.log('Test Finished!!!')
    syncAgain()
    setInterval(() => {
      syncAgain()
    }, 1000)
  }

  return (
    <Container>
      <Stack>
        <Heading size="md">Near Social Bridge - v{nsv_package.version}</Heading>
        <Text>Live test stack</Text>

        {/* If this renders, Near Social Provider is working fine */}
        <Divider />
        <TestStatus
          test_id="test_near_social_provider"
          title="Near Social Provider"
          status="success"
          features={[{ name: 'Bridge service', status: 'success' }]}
        />

        {/* Test Stacks */}

        <TestStack
          title="Near API"
          description={'This is using contract "nearsocialexamples.near"'}
          TestStackComponent={NearAPIStack}
          run={stacks.nearAPI.run}
          onComplete={() => runNow(STACK_KEYS.socialAPI)}
        />

        <TestStack
          title="Social API"
          TestStackComponent={SocialAPIStack}
          run={stacks.socialAPI.run}
          onComplete={() => runNow(STACK_KEYS.storageAPI)}
        />

        <TestStack
          title="Storage API"
          TestStackComponent={StorageAPIStack}
          run={stacks.storageAPI.run}
          onComplete={() => runNow(STACK_KEYS.request)}
        />

        <TestStack
          title="Request"
          TestStackComponent={RequestStack}
          run={stacks.request.run}
          onComplete={() => runNow(STACK_KEYS.mock)}
        />

        <TestStack
          title="Mock"
          description="This is a mocked request"
          TestStackComponent={MockStack}
          run={stacks.mock.run}
          onComplete={() => runNow(STACK_KEYS.navigation)}
        />

        <TestStack
          title="Navigation"
          TestStackComponent={NavigationStack}
          run={stacks.navigation.run}
          onComplete={() => runNow(STACK_KEYS.sessionStorage)}
        />

        <TestStack
          title="Session Storage"
          TestStackComponent={SessionStorageStack}
          run={stacks.sessionStorage.run}
          onComplete={() => runNow(STACK_KEYS.persistStorage)}
        />

        <TestStack
          title="Persist Storage"
          TestStackComponent={PersistStorageStack}
          run={stacks.persistStorage.run}
          onComplete={() => runNow(STACK_KEYS.useNearSocialBridge)}
        />

        <TestStack
          title="useNearSocialBridge"
          TestStackComponent={UseNearSocialBridgeStack}
          run={stacks.useNearSocialBridge.run}
          onComplete={() => runNow(STACK_KEYS.useInitialPayload)}
        />

        <TestStack
          title="useInitialPayload"
          description="Check the SSRTest.jsx file to see the payload"
          TestStackComponent={UseInitialPayloadStack}
          run={stacks.useInitialPayload.run}
          onComplete={() => runNow(STACK_KEYS.useNavigation)}
        />

        <TestStack
          title="useNavigation"
          TestStackComponent={UseNavigationStack}
          run={stacks.useNavigation.run}
          onComplete={() => runNow(STACK_KEYS.useSessionStorage)}
        />

        <TestStack
          title="useSessionStorage"
          TestStackComponent={UseSessionStorageStack}
          run={stacks.useSessionStorage.run}
          onComplete={() => runNow(STACK_KEYS.useAuth)}
        />

        <TestStack
          title="useAuth"
          TestStackComponent={UseAuthStack}
          run={stacks.useAuth.run}
          onComplete={() => runNow(STACK_KEYS.useWidgetView)}
        />

        <TestStack
          title="useWidgetView"
          TestStackComponent={UseWidgetViewStack}
          run={stacks.useWidgetView.run}
          onComplete={() => runNow(STACK_KEYS.useSyncContentHeight)}
        />

        <TestStack
          title="useSyncContentHeight"
          TestStackComponent={UseSyncContentHeightStack}
          run={stacks.useSyncContentHeight.run}
          onComplete={testFinished}
        />
      </Stack>
    </Container>
  )
}

export default Home

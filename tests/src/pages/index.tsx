import { useCallback, useEffect, useState } from 'react'
import { Button, Divider, Heading, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useSyncContentHeight } from '@lib'

import Container from '../components/Container'
import nsv_package from '../../../package.json'
import TestStatus from '../components/TestStatus'
import { useTestStack } from '@app/contexts/TestStackProvider'
import setTestState from '@app/services/setTestState'

import TestStack from '@app/stack/TestStack'
import NearAPIStack from '@app/stack/NearAPIStack'
import SocialAPIStack from '@app/stack/SocialAPIStack'
import StorageAPIStack from '@app/stack/StorageAPIStack'
import RequestStack from '@app/stack/RequestStack'
import MockStack from '@app/stack/MockStack'
import UseAuthStack from '@app/stack/UseAuthStack'
import NavigationStack from '@app/stack/NavigationStack'
import SessionStorageStack from '@app/stack/SessionStorageStack'
import PersistStorageStack from '@app/stack/PersistStorageStack'
import UseNearSocialBridgeStack from '@app/stack/UseNearSocialBridgeStack'
import UseInitialPayloadStack from '@app/stack/UseInitialPayloadStack'
import UseNavigationStack from '@app/stack/UseNavigationStack'
import UseSessionStorageStack from '@app/stack/UseSessionStorageStack'
import UseWidgetViewStack from '@app/stack/UseWidgetViewStack'
import UseSyncContentHeightStack from '@app/stack/UseSyncContentHeightStack'
import FetchAPIStack from '@app/stack/FetchAPIStack'

const initialStackState = {
  nearAPI: { run: false, passing: false },
  socialAPI: { run: false, passing: false },
  storageAPI: { run: false, passing: false },
  fetchAPI: { run: false, passing: false },
  request: { run: false, passing: false },
  mock: { run: false, passing: false },
  navigation: { run: false, passing: false },
  sessionStorage: { run: false, passing: false },
  persistStorage: { run: false, passing: false },
  useNearSocialBridge: { run: false, passing: false },
  useInitialPayload: { run: false, passing: false },
  useNavigation: { run: false, passing: false },
  useSessionStorage: { run: false, passing: false },
  useAuth: { run: false, passing: false },
  useWidgetView: { run: false, passing: false },
  useSyncContentHeight: { run: false, passing: false },
}

const STACK_KEYS = {
  nearAPI: 'nearAPI',
  socialAPI: 'socialAPI',
  storageAPI: 'storageAPI',
  fetchAPI: 'fetchAPI',
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
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  // Stacks
  const [stacks, updateStacks] = useState(initialStackState)

  useEffect(() => {
    syncAgain()
  }, [timestamp])

  // Go to next test stack
  const runNow = useCallback(
    (currentStackKey: string, currentStackPassing: boolean, nextStackKey: string) => {
      updateStacks({
        ...stacks,
        [currentStackKey]: { run: true, passing: currentStackPassing },
        [nextStackKey]: { run: true },
      })
    },
    [stacks]
  )

  // On test is finished
  const testFinished = (currentStackKey: string, currentStackPassing: boolean) => {
    updateStacks({ ...stacks, [currentStackKey]: { run: true, passing: currentStackPassing } })
    syncAgain()
    setFinished(true)
    setInterval(() => {
      syncAgain()
    }, 1000)
  }

  useEffect(() => {
    if (finished) {
      ;(async () => {
        const currentStack: any = { ...stacks }
        let generalTestingPassing = true
        Object.keys(currentStack).forEach((key) => {
          if (currentStack[key].passing === false) {
            generalTestingPassing = false
          }
        })

        await setTestState(generalTestingPassing)
        console.log('Test Finished!!!')
      })()
    }
  }, [finished])

  const runTests = useCallback(() => {
    setRunning(true)
    updateStacks({ ...stacks, nearAPI: { run: true, passing: false } })
  }, [])

  if (!running) {
    return (
      <Container>
        <Stack>
          <Heading size="md">Near Social Bridge - v{nsv_package.version}</Heading>
          <Text>
            Live test stack for{' '}
            <Link style={{ color: '#19b850' }} href="https://github.com/wpdas/near-social-bridge" target="_blank">
              near-social-bridge
            </Link>{' '}
            lib
          </Text>
          <Button width="fit-content" bg="green.200" onClick={runTests}>
            Run Tests
          </Button>
        </Stack>
      </Container>
    )
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
          onComplete={(passing: boolean) => runNow(STACK_KEYS.nearAPI, passing, STACK_KEYS.socialAPI)}
        />

        <TestStack
          title="Social API"
          TestStackComponent={SocialAPIStack}
          run={stacks.socialAPI.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.socialAPI, passing, STACK_KEYS.storageAPI)}
        />

        <TestStack
          title="Storage API"
          TestStackComponent={StorageAPIStack}
          run={stacks.storageAPI.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.storageAPI, passing, STACK_KEYS.fetchAPI)}
        />

        <TestStack
          title="Fetch API"
          TestStackComponent={FetchAPIStack}
          run={stacks.fetchAPI.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.storageAPI, passing, STACK_KEYS.request)}
        />

        <TestStack
          title="Request"
          TestStackComponent={RequestStack}
          run={stacks.request.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.request, passing, STACK_KEYS.mock)}
        />

        <TestStack
          title="Mock"
          description="This is a mocked request"
          TestStackComponent={MockStack}
          run={stacks.mock.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.mock, passing, STACK_KEYS.navigation)}
        />

        <TestStack
          title="Navigation"
          TestStackComponent={NavigationStack}
          run={stacks.navigation.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.navigation, passing, STACK_KEYS.sessionStorage)}
        />

        <TestStack
          title="Session Storage"
          TestStackComponent={SessionStorageStack}
          run={stacks.sessionStorage.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.sessionStorage, passing, STACK_KEYS.persistStorage)}
        />

        <TestStack
          title="Persist Storage"
          TestStackComponent={PersistStorageStack}
          run={stacks.persistStorage.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.persistStorage, passing, STACK_KEYS.useNearSocialBridge)}
        />

        <TestStack
          title="useNearSocialBridge"
          TestStackComponent={UseNearSocialBridgeStack}
          run={stacks.useNearSocialBridge.run}
          onComplete={(passing: boolean) =>
            runNow(STACK_KEYS.useNearSocialBridge, passing, STACK_KEYS.useInitialPayload)
          }
        />

        <TestStack
          title="useInitialPayload"
          description="Check the NearSocialBridgeTests.dev.jsx file to see the payload"
          TestStackComponent={UseInitialPayloadStack}
          run={stacks.useInitialPayload.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.useInitialPayload, passing, STACK_KEYS.useNavigation)}
        />

        <TestStack
          title="useNavigation"
          TestStackComponent={UseNavigationStack}
          run={stacks.useNavigation.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.useNavigation, passing, STACK_KEYS.useSessionStorage)}
        />

        <TestStack
          title="useSessionStorage"
          TestStackComponent={UseSessionStorageStack}
          run={stacks.useSessionStorage.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.useSessionStorage, passing, STACK_KEYS.useAuth)}
        />

        <TestStack
          title="useAuth"
          TestStackComponent={UseAuthStack}
          run={stacks.useAuth.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.useAuth, passing, STACK_KEYS.useWidgetView)}
        />

        <TestStack
          title="useWidgetView"
          TestStackComponent={UseWidgetViewStack}
          run={stacks.useWidgetView.run}
          onComplete={(passing: boolean) => runNow(STACK_KEYS.useWidgetView, passing, STACK_KEYS.useSyncContentHeight)}
        />

        <TestStack
          title="useSyncContentHeight"
          TestStackComponent={UseSyncContentHeightStack}
          run={stacks.useSyncContentHeight.run}
          onComplete={(passing: boolean) => testFinished(STACK_KEYS.useSyncContentHeight, passing)}
        />
      </Stack>
    </Container>
  )
}

export default Home

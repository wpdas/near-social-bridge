import { useCallback, useEffect, useState } from 'react'
import { Divider, Heading, Stack, Text } from '@chakra-ui/react'
import { useSyncContentHeight } from '@lib'

import Container from './components/Container'
import nsv_package from '../../../../package.json'
import TestStatus from './components/TestStatus'
import { useTestStack } from '@app/contexts/TestStackProvider'

import TestStack from './stack/TestStack'
import NearAPIStack from './stack/NearAPIStack'
import SocialAPIStack from './stack/SocialAPIStack'
import UseAuthStack from './stack/UseAuthStack'
import StorageAPIStack from './stack/StorageAPIStack'

const initialStackState = {
  nearAPI: { run: true },
  socialAPI: { run: false },
  storageAPI: { run: false },
  useAuth: { run: false },
}

const STACK_KEYS = {
  nearAPI: 'nearAPI',
  socialAPI: 'socialAPI',
  storageAPI: 'storageAPI',
  useAuth: 'useAuth',
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
          onComplete={() => runNow(STACK_KEYS.useAuth)}
        />

        <TestStack
          title="useAuth"
          TestStackComponent={UseAuthStack}
          run={stacks.useAuth.run}
          onComplete={testFinished}
        />
      </Stack>
    </Container>
  )
}

export default Home

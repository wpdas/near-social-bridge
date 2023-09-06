import { Stack, Divider, Button } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { Near, useAuth } from '@lib'
import { Feature, StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'nearApi'
const CONTRACT_ID = 'nearsocialexamples.near'

const NearAPIStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()
  const [done, setDone] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const updateFeatures = (feature: Feature) => updateStackFeatures(TEST_STACK_KEY, feature)

  useEffect(() => {
    const go = async () => {
      try {
        setTestStatus('running')

        updateFeatures({ name: 'Near.view', status: 'running' })
        const view = await Near.view<string>(CONTRACT_ID, 'get_greeting')
        updateFeatures({ name: 'Near.view', status: view ? 'success' : 'error', jsonBody: view })

        setTestStatus('success')
        onComplete(true)
        setDone(true)
      } catch {
        setTestStatus('error')
        onComplete(false)
        setDone(true)
      }
    }

    if (auth.ready && !done) {
      go()
    }
  }, [auth, done])

  const testNearCall = async () => {
    if (auth.user) {
      updateFeatures({ name: 'Near.call', status: 'running' })
      await Near.call<{ message: string }>(CONTRACT_ID, 'set_greeting', {
        message: `Hello from ${auth.user?.accountId}`,
      })
      updateFeatures({ name: 'Near.call', status: 'success' })
    } else {
      updateFeatures({ name: 'Near.call', status: 'success', jsonBody: 'user is not authenticated' })
    }
  }

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_near_api"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
      <Button width="fit-content" colorScheme="teal" size="sm" onClick={testNearCall}>
        Test Near.call
      </Button>
    </Stack>
  )
}

export default NearAPIStack

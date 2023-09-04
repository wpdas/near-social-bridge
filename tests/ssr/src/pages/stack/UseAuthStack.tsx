import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { useAuth } from '@lib'
import { StackComponent } from './types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'auth'

const UseAuthStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const auth = useAuth()

  useEffect(() => {
    setTestStatus('running')
    if (!auth.ready) {
      updateStackFeatures(TEST_STACK_KEY, { name: 'useAuth', status: 'running', jsonBody: auth })
    } else {
      updateStackFeatures(TEST_STACK_KEY, { name: 'useAuth', status: 'success', jsonBody: auth })
      setTestStatus('success')
      onComplete()
    }
  }, [auth])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_auth"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseAuthStack

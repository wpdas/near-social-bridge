import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { useInitialPayload } from '@lib'
import { StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'use-initial-payload'

const UseInitialPayloadStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const initialPayload = useInitialPayload()

  useEffect(() => {
    setTestStatus('success')
    updateStackFeatures(TEST_STACK_KEY, { name: 'useInitialPayload', status: 'success', jsonBody: initialPayload })
    onComplete(true)
  }, [initialPayload])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_initial_payload"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseInitialPayloadStack

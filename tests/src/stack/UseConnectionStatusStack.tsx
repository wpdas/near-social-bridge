import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { useConnectionStatus } from '@lib'
import { StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'use-connection-status'

const UseConnectionStatusStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()
  const [done, setDone] = useState(false)

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const status = useConnectionStatus()

  useEffect(() => {
    if (!done) {
      updateStackFeatures(TEST_STACK_KEY, { name: 'status', status: 'success', jsonBody: status })
      setTestStatus('success')
      onComplete(true)
      setDone(true)
    }
  }, [done])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_connection_status"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseConnectionStatusStack

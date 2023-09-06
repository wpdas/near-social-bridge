import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { sessionStorage } from '@lib'
import { StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'sessionStorage'

const SessionStorageStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    setTestStatus('running')

    updateStackFeatures(TEST_STACK_KEY, { name: 'setItem', status: 'running' })
    sessionStorage.setItem('name', 'Wenderson')
    sessionStorage.setItem('age', 33)
    updateStackFeatures(TEST_STACK_KEY, { name: 'setItem', status: 'success' })

    updateStackFeatures(TEST_STACK_KEY, { name: 'getItem', status: 'running' })
    const storedValue = sessionStorage.getItem('name')
    updateStackFeatures(TEST_STACK_KEY, { name: 'getItem', status: 'success', jsonBody: storedValue })

    updateStackFeatures(TEST_STACK_KEY, { name: 'keys', status: 'running' })
    const keys = sessionStorage.keys()
    updateStackFeatures(TEST_STACK_KEY, { name: 'keys', status: 'success', jsonBody: keys })

    updateStackFeatures(TEST_STACK_KEY, { name: 'removeItem', status: 'running' })
    sessionStorage.removeItem('age')
    if (!sessionStorage.getItem('age')) {
      updateStackFeatures(TEST_STACK_KEY, { name: 'removeItem', status: 'success' })
    } else {
      updateStackFeatures(TEST_STACK_KEY, { name: 'removeItem', status: 'error' })
    }

    updateStackFeatures(TEST_STACK_KEY, { name: 'clear', status: 'running' })
    sessionStorage.clear()
    if (sessionStorage.keys().length === 0) {
      updateStackFeatures(TEST_STACK_KEY, { name: 'clear', status: 'success' })
    } else {
      updateStackFeatures(TEST_STACK_KEY, { name: 'clear', status: 'error' })
    }

    setTestStatus('success')
    onComplete(true)
  }, [])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_session_storage"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default SessionStorageStack

import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { sessionStorage, useInitialPayload, useSessionStorage } from '@lib'
import { StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'use-session-storage'

const UseSessionStorageStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()
  const storage = useSessionStorage()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    setTestStatus('running')
    updateStackFeatures(TEST_STACK_KEY, { name: 'useSessionStorage', status: 'running' })

    sessionStorage.setItem('address', 'fake address, 45, avenue')
  }, [])

  useEffect(() => {
    if (storage) {
      updateStackFeatures(TEST_STACK_KEY, { name: 'useSessionStorage', status: 'success', jsonBody: storage })

      setTestStatus('success')
      onComplete(true)
    }
  }, [storage])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_session_storage"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseSessionStorageStack

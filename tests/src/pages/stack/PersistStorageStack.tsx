import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { persistStorage } from '@lib'
import { StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'persistStorage'

const PersistStorageStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    setTestStatus('running')
    ;(async () => {
      updateStackFeatures(TEST_STACK_KEY, { name: 'setItem', status: 'running' })
      await persistStorage.setItem('name', 'Wenderson')
      await persistStorage.setItem('age', 33)
      updateStackFeatures(TEST_STACK_KEY, { name: 'setItem', status: 'success' })

      updateStackFeatures(TEST_STACK_KEY, { name: 'getItem', status: 'running' })
      const storedValue = await persistStorage.getItem('name')
      updateStackFeatures(TEST_STACK_KEY, { name: 'getItem', status: 'success', jsonBody: storedValue })

      updateStackFeatures(TEST_STACK_KEY, { name: 'removeItem', status: 'running' })
      await persistStorage.removeItem('age')
      if (!(await persistStorage.getItem('age'))) {
        updateStackFeatures(TEST_STACK_KEY, { name: 'removeItem', status: 'success' })
      } else {
        updateStackFeatures(TEST_STACK_KEY, { name: 'removeItem', status: 'error' })
      }
    })()

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

export default PersistStorageStack

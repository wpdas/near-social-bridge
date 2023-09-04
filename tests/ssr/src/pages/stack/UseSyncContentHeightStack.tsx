import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { StackComponent } from './types'
import { useTestStack } from '@app/contexts/TestStackProvider'
import { useSyncContentHeight } from '@lib'

const TEST_STACK_KEY = 'use-sync-content-height'

const UseSyncContentHeightStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()
  const { done, syncAgain } = useSyncContentHeight()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!finished) {
      setTestStatus('running')
      updateStackFeatures(TEST_STACK_KEY, { name: 'useSyncContentHeight', status: 'success' }) // Running internally
      syncAgain()
      updateStackFeatures(TEST_STACK_KEY, { name: 'syncAgain', status: 'success' }) // Running internally
      if (done) {
        updateStackFeatures(TEST_STACK_KEY, { name: 'done', status: 'success' }) // Running internally

        setTestStatus('success')
        onComplete()
        setFinished(true)
      }
    }
  }, [done])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_sync_content_height"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseSyncContentHeightStack

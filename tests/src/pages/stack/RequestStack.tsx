import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { request } from '@lib'
import { StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'request'

const RequestStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    const fetch = async () => {
      setTestStatus('running')

      try {
        updateStackFeatures(TEST_STACK_KEY, { name: 'request', status: 'running' })
        const res = await request('request-01', { timestamp: Date.now() }, { forceTryAgain: true })
        updateStackFeatures(TEST_STACK_KEY, { name: 'request', status: 'success', jsonBody: res })
        setTestStatus('success')
      } catch {
        updateStackFeatures(TEST_STACK_KEY, { name: 'request', status: 'error' })
        setTestStatus('error')
      }

      onComplete()
    }
    fetch()
  }, [])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_request"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default RequestStack

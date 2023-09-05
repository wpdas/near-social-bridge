import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { createMock, request } from '@lib'
import { StackComponent } from './types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'mock'

// Create Mocks
const rooms = ['room-1', 'room-2', 'room-3', 'room-4']
const getRoomsListMock = (payload: { limit: number }) => {
  return {
    // always use immutable pattern
    roomsList: [...rooms.slice(0, payload.limit)],
  }
}
createMock('get-rooms-list', getRoomsListMock)

const MockStack: StackComponent = ({ title, onComplete, description }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    const fetch = async () => {
      setTestStatus('running')

      try {
        updateStackFeatures(TEST_STACK_KEY, { name: 'createMock', status: 'running' })
        const res = await request('get-rooms-list', { limit: 2 })
        updateStackFeatures(TEST_STACK_KEY, { name: 'createMock', status: 'success', jsonBody: res })
        setTestStatus('success')
      } catch {
        updateStackFeatures(TEST_STACK_KEY, { name: 'createMock', status: 'error' })
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
        test_id="test_mock"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default MockStack

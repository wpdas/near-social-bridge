import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { useNearSocialBridge } from '@lib'
import { StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'use-near-social-bridge'

const UseNearSocialBridgeStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const [done, setDone] = useState(false)

  const { onGetMessage, postMessage } = useNearSocialBridge()

  useEffect(() => {
    setTestStatus('running')

    updateStackFeatures(TEST_STACK_KEY, { name: 'postMessage', status: 'running' })
    postMessage('My awesome message! :D')
    updateStackFeatures(TEST_STACK_KEY, { name: 'postMessage', status: 'success' })
  }, [])

  useEffect(() => {
    // Receives a message from BOS Component
    updateStackFeatures(TEST_STACK_KEY, { name: 'onGetMessage', status: 'running' })
    onGetMessage((_: any) => {
      // console.log(_) -> message
      if (!done) {
        setDone(true)
      }
    })

    return () => onGetMessage(null)
  }, [])

  useEffect(() => {
    updateStackFeatures(TEST_STACK_KEY, { name: 'onGetMessage', status: 'success' })
    setTestStatus('success')
    onComplete(true)
  }, [done])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_near_social_bridge"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseNearSocialBridgeStack

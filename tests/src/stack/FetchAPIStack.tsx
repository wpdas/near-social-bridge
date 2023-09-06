import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { fetch } from '@lib'
import { Feature, StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'fetchApi'

const FetchAPIStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()
  const [done, setDone] = useState(false)

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const updateFeatures = (feature: Feature) => updateStackFeatures(TEST_STACK_KEY, feature)

  useEffect(() => {
    const go = async () => {
      try {
        setTestStatus('running')

        updateFeatures({ name: 'fetch', status: 'running' })
        const response = await fetch<any>('https://rpc.mainnet.near.org/status')
        updateFeatures({ name: 'fetch', status: 'success', jsonBody: response })

        setTestStatus('success')
        onComplete(true)
        setDone(true)
      } catch {
        setTestStatus('error')
        onComplete(false)
        setDone(true)
      }
    }

    if (!done) {
      go()
    }
  }, [done])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_fetch_api"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default FetchAPIStack

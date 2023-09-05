import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { Storage } from '@lib'
import { Feature, StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'storageApi'

const StorageAPIStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const updateFeatures = (feature: Feature) => updateStackFeatures(TEST_STACK_KEY, feature)

  useEffect(() => {
    const go = async () => {
      try {
        setTestStatus('running')

        updateFeatures({ name: 'Storage.set', status: 'running' })
        const set = await Storage.set(
          'my-storage-key',
          JSON.stringify({ age: Math.round(Math.random() * 33), name: 'Wendz' })
        )
        updateFeatures({ name: 'Storage.set', status: set ? 'success' : 'error', jsonBody: set })

        updateFeatures({ name: 'Storage.get', status: 'running' })
        const get = await Storage.get('my-storage-key')
        updateFeatures({ name: 'Storage.get', status: get ? 'success' : 'error', jsonBody: get })

        updateFeatures({ name: 'Storage.privateSet', status: 'running' })
        const privateSet = await Storage.privateSet(
          'my-private-key',
          JSON.stringify({ age: Math.round(Math.random() * 33), name: 'Wendz Private' })
        )
        updateFeatures({ name: 'Storage.privateSet', status: privateSet ? 'success' : 'error', jsonBody: privateSet })

        updateFeatures({ name: 'Storage.privateGet', status: 'running' })
        const privateGet = await Storage.privateGet('my-private-key')
        updateFeatures({ name: 'Storage.privateGet', status: privateGet ? 'success' : 'error', jsonBody: privateGet })

        setTestStatus(set && get && privateSet && privateGet ? 'success' : 'error')
        onComplete()
      } catch {
        setTestStatus('error')
      }
    }

    go()
  }, [])
  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_storage_api"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default StorageAPIStack

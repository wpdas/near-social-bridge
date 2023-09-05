import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { Social, useAuth } from '@lib'
import { Feature, StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'socialApi'

const SocialAPIStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()
  const [done, setDone] = useState(false)

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const updateFeatures = (feature: Feature) => updateStackFeatures(TEST_STACK_KEY, feature)

  const auth = useAuth()

  useEffect(() => {
    const go = async () => {
      try {
        setTestStatus('running')
        const accountId = auth.user?.accountId || 'wendersonpires.near'

        updateFeatures({ name: 'Social.get', status: 'running' })
        const _get = await Social.get(`${accountId}/widget/*`)
        updateFeatures({ name: 'Social.get', status: _get ? 'success' : 'error', jsonBody: _get })

        updateFeatures({ name: 'Social.getr', status: 'running' })
        const _getr = await Social.getr(`${accountId}/profile`)
        updateFeatures({ name: 'Social.getr', status: _getr ? 'success' : 'error', jsonBody: _getr })

        let _set: any
        if (auth.user) {
          updateFeatures({ name: 'Social.set', status: 'running' })
          const data = { index: { experimental: JSON.stringify({ key: 'current_time', value: Date.now() }) } }

          _set = await Social.set(data)
          updateFeatures({ name: 'Social.set', status: _set ? 'success' : 'error', jsonBody: _set })
          // Social.set will open up a modal
        } else {
          updateFeatures({ name: 'Social.set', status: 'success', jsonBody: 'user is not authenticated' })
          _set = true
        }

        updateFeatures({ name: 'Social.index', status: 'running' })
        const _index = await Social.index('experimental', 'current_time', {
          limit: 2,
          order: 'desc',
        })
        updateFeatures({ name: 'Social.index', status: _index ? 'success' : 'error', jsonBody: _index })

        updateFeatures({ name: 'Social.keys', status: 'running' })
        const _keys = await Social.keys('wendersonpires.near/experimental')
        updateFeatures({ name: 'Social.keys', status: _keys ? 'success' : 'error', jsonBody: _keys })

        setTestStatus(_get && _getr && _set && _index && _keys ? 'success' : 'error')
        onComplete()
        setDone(true)
      } catch {
        setTestStatus('error')
      }
    }

    if (auth.ready && !done) {
      go()
    }
  }, [auth, done])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_social_api"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default SocialAPIStack

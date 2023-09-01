import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useCallback, useEffect, useState } from 'react'
import { Social } from '@lib'
import { Feature, Features, StackTest } from './types'

let _features: Features = []

// Test Social.get
const SocialAPIStack: StackTest = ({ run, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const [features, setFeatures] = useState<Features>([])

  const updateFeatures = (feature: Feature) => {
    let isNewFeature = true

    const checkedFeatures = _features.map((featureItem) => {
      if (featureItem.name === feature.name) {
        isNewFeature = false
        featureItem.status = feature.status
      }
      return featureItem
    })

    if (isNewFeature) {
      const updatedFeatures = [..._features, feature]
      setFeatures(updatedFeatures)
      _features = updatedFeatures
    } else {
      setFeatures(checkedFeatures)
      _features = checkedFeatures
    }
  }

  useEffect(() => {
    const go = async () => {
      try {
        setTestStatus('running')

        updateFeatures({ name: 'Social.get', status: 'running' })
        const _get = await Social.get('wendersonpires.testnet/widget/*')
        console.log('Social.get:', _get)
        updateFeatures({ name: 'Social.get', status: 'success' })

        updateFeatures({ name: 'Social.getr', status: 'running' })
        const _getr = await Social.getr('wendersonpires.testnet/profile')
        console.log('Social.getr:', _getr)
        updateFeatures({ name: 'Social.getr', status: 'success' })

        updateFeatures({ name: 'Social.index', status: 'running' })
        const _index = await Social.index('widget-chatv2-dev', 'room', {
          limit: 1000,
          order: 'desc',
        })
        console.log('Social.index:', _index)
        updateFeatures({ name: 'Social.index', status: 'success' })

        updateFeatures({ name: 'Social.set', status: 'running' })
        const data = { experimental: { test: 'test' } }
        const _set = await Social.set(data)
        console.log('Social.set:', _set)
        updateFeatures({ name: 'Social.set', status: 'success' })
        // Social.set will open up a modal

        updateFeatures({ name: 'Social.keys', status: 'running' })
        const _keys = await Social.keys('wendersonpires.testnet/experimental')
        console.log('Social.keys:', _keys)
        updateFeatures({ name: 'Social.keys', status: 'success' })
        setTestStatus('success')

        onComplete()
      } catch {
        setTestStatus('error')
      }
    }

    if (run) {
      go()
    }
  }, [run])
  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus title="Social API" status={testStatus} features={_features} />
    </Stack>
  )
}

export default SocialAPIStack

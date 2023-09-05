import { Feature, Features } from '@app/types'
import { createContext, useContext, useState } from 'react'

type FeaturesProps = {
  [key: string]: Features
}

type TestStackContextProps = {
  timestamp: number
  features: FeaturesProps
  registerNewStack: (featureKey: string) => void
  updateStackFeatures: (featureKey: string, feature: Feature) => void
  getStackFeatures: (featureKey: string) => Features
}

const defaultValue: TestStackContextProps = {
  timestamp: 0,
  features: {},
  registerNewStack: () => {
    throw new Error('registerNewStack must be defined')
  },
  updateStackFeatures: () => {
    throw new Error('updateStackFeatures must be defined')
  },
  getStackFeatures: () => {
    throw new Error('getStackFeatures must be defined')
  },
}

const TestStackContext = createContext(defaultValue)

export const useTestStack = () => useContext(TestStackContext)

const _features: FeaturesProps = {}

const TestStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeaturesProps>(_features)
  const [timestamp, setTimestamp] = useState(Date.now())

  const registerNewStack = (featureKey: string) => (_features[featureKey] = [])

  const updateStackFeatures = (featureKey: string, feature: Feature) => {
    let isNewFeature = true

    const checkedFeatures = _features[featureKey].map((featureItem) => {
      if (featureItem.name === feature.name) {
        isNewFeature = false
        featureItem.status = feature.status
        featureItem.jsonBody = feature.jsonBody
      }
      return featureItem
    })

    if (isNewFeature) {
      const updatedFeatures = [..._features[featureKey], feature]
      _features[featureKey] = updatedFeatures
      setFeatures(_features)
    } else {
      _features[featureKey] = checkedFeatures
      setFeatures(_features)
    }

    setTimestamp(Date.now())
  }

  const getStackFeatures = (featureKey: string) => _features[featureKey]

  return (
    <TestStackContext.Provider value={{ timestamp, features, registerNewStack, updateStackFeatures, getStackFeatures }}>
      {children}
    </TestStackContext.Provider>
  )
}

export default TestStackProvider

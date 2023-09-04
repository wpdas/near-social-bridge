import { Stack, Divider, Text } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { StackComponent } from './types'
import { useTestStack } from '@app/contexts/TestStackProvider'
import { IFrameStackScreenProps, createStackNavigator, useNavigation } from '@lib'

const TEST_STACK_KEY = 'use-navigation'

// Navigation Config/App - INIT
export type NavigationProps = {
  Home: undefined
  Profile: {
    userName: string
    finalize?: boolean
  }
  Dummy1: undefined
  Dummy2: undefined
}

// Screen props
type PreHomeScreenProps = IFrameStackScreenProps<NavigationProps, 'Home'>
type ProfileScreenProps = IFrameStackScreenProps<NavigationProps, 'Profile'>
type Dummy1ScreenProps = IFrameStackScreenProps<NavigationProps, 'Dummy1'>
type Dummy2ScreenProps = IFrameStackScreenProps<NavigationProps, 'Dummy2'>

const { Navigator, Screen } = createStackNavigator<NavigationProps>(<Text fontSize="sm">Loading Routes...</Text>)

const NavigationApp = () => {
  return (
    <Navigator autoHeightSync defaultRoute="Home">
      <Screen name="Home" component={Home} />
      <Screen name="Profile" component={Profile} />
      <Screen name="Dummy1" component={Dummy1} />
      <Screen name="Dummy2" component={Dummy2} />
    </Navigator>
  )
}

const Home: React.FC<PreHomeScreenProps> = () => {
  const { updateStackFeatures } = useTestStack()
  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      navigation.push('Profile', { userName: `Wendz-${Math.round(Math.random() * 100)}` })
    }, 1000)

    setTimeout(() => {
      navigation.push('Dummy1')
    }, 2000)

    setTimeout(() => {
      navigation.goBack()
      updateStackFeatures(TEST_STACK_KEY, { name: 'goBack', status: 'success' })
    }, 3000)

    setTimeout(() => {
      navigation.replace('Dummy2')
    }, 4000)
  }, [])

  return (
    <Stack>
      <Text fontSize="sm">This is Home</Text>
    </Stack>
  )
}

const Profile: React.FC<ProfileScreenProps> = ({ route }) => {
  const { updateStackFeatures } = useTestStack()

  const { userName } = route.params

  useEffect(() => {
    setTimeout(() => {
      updateStackFeatures(TEST_STACK_KEY, { name: 'push', status: 'success' })
    }, 1000)
  }, [])

  return (
    <Stack>
      <Text fontSize="sm">This is Profile. User Name: {userName}</Text>
    </Stack>
  )
}

const Dummy1: React.FC<Dummy1ScreenProps> = () => {
  return (
    <Stack>
      <Text fontSize="sm">This is Dummy1.</Text>
    </Stack>
  )
}

const Dummy2: React.FC<Dummy2ScreenProps> = () => {
  const { updateStackFeatures } = useTestStack()
  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      updateStackFeatures(TEST_STACK_KEY, { name: 'replace', status: 'success' })
      updateStackFeatures(TEST_STACK_KEY, {
        name: 'location',
        status: 'success',
        jsonBody: navigation.location,
      })
      updateStackFeatures(TEST_STACK_KEY, {
        name: 'history',
        status: 'success',
        jsonBody: navigation.history,
      })
    }, 1000)
  }, [])

  return (
    <Stack>
      <Text fontSize="sm">This is Dummy2.</Text>
    </Stack>
  )
}
// Navigation Config/App - END

const UseNavigationStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    setTestStatus('running')

    setTimeout(() => {
      setTestStatus('success')
      onComplete()
    }, 12000)
  }, [])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_navigation"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
      {testStatus !== 'success' && <NavigationApp />}
    </Stack>
  )
}

export default UseNavigationStack

import { Stack, Divider, Text } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'
import { IFrameStackScreenProps, createStackNavigator } from '@lib'

const TEST_STACK_KEY = 'navigation'

// Navigation Config/App - INIT
export type NavigationProps = {
  Home: undefined
  Profile: {
    userName: string
    finalize?: boolean
  }
}

// Screen props
type PreHomeScreenProps = IFrameStackScreenProps<NavigationProps, 'Home'>
type ProfileScreenProps = IFrameStackScreenProps<NavigationProps, 'Profile'>

const { Navigator, Screen } = createStackNavigator<NavigationProps>(<Text fontSize="sm">Loading Routes...</Text>)

const NavigationApp = () => {
  const { updateStackFeatures } = useTestStack()

  useEffect(() => {
    setTimeout(() => {
      updateStackFeatures(TEST_STACK_KEY, { name: 'createStackNavigator', status: 'success' })
      updateStackFeatures(TEST_STACK_KEY, { name: 'Navigator', status: 'success' })
    }, 0)
  }, [])

  return (
    <Navigator autoHeightSync defaultRoute="Home">
      <Screen name="Home" component={Home} />
      <Screen name="Profile" component={Profile} />
    </Navigator>
  )
}

const Home: React.FC<PreHomeScreenProps> = ({ navigation }) => {
  const { updateStackFeatures } = useTestStack()

  const goToProfile = () => {
    // push new Screen sending data
    navigation.push('Profile', { userName: `Wendz-${Math.round(Math.random() * 100)}` })
  }

  useEffect(() => {
    updateStackFeatures(TEST_STACK_KEY, { name: 'Screen', status: 'running' })

    setTimeout(() => {
      goToProfile()
    }, 1000)
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
      updateStackFeatures(TEST_STACK_KEY, { name: 'Screen', status: 'success' })
      updateStackFeatures(TEST_STACK_KEY, { name: 'Screen.navigation', status: 'success' })
      updateStackFeatures(TEST_STACK_KEY, { name: 'Screen.route', status: 'success' })
      updateStackFeatures(TEST_STACK_KEY, { name: 'Screen.navigation.push', status: 'success' }) // Running internally
      updateStackFeatures(TEST_STACK_KEY, { name: 'Screen.navigation.replace', status: 'success' }) // Running internally
      updateStackFeatures(TEST_STACK_KEY, { name: 'Screen.navigation.goBack', status: 'success' }) // Running internally
    }, 1000)
  }, [])

  return (
    <Stack>
      <Text fontSize="sm">This is Profile. User Name: {userName}</Text>
    </Stack>
  )
}
// Navigation Config/App - END

const NavigationStack: StackComponent = ({ title, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  useEffect(() => {
    setTestStatus('running')

    setTimeout(() => {
      setTestStatus('success')
      onComplete(true)
    }, 5000)
  }, [])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_navigation"
        title={title}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
      {testStatus !== 'success' && <NavigationApp />}
    </Stack>
  )
}

export default NavigationStack

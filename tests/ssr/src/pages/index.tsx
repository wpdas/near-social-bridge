import { Heading, Stack, Text } from '@chakra-ui/react'
import Container from './components/Container'
import { useAuth, useInitialPayload } from '@lib'
import { useCallback, useState } from 'react'
import SocialAPIStack from './stack/SocialAPI'

// type StacksControl = {[key: string ]: {run: boolean}}

const initialStackState = {
  nearAPI: { run: true }, // TODO
  socialAPI: { run: false },
}

const STACK_KEYS = {
  nearAPI: 'nearAPI',
  socialAPI: 'socialAPI',
}

const Home = () => {
  // Get auth
  const auth = useAuth()
  console.log(auth.user?.accountId)

  // Get initial payload
  const initialPayload = useInitialPayload()
  console.log(initialPayload)

  // Stacks
  const [stacks, updateStacks] = useState(initialStackState)

  // Go to next test stack
  const runNow = useCallback((stackKey: string) => {
    updateStacks({ ...stacks, [stackKey]: { run: true } })
  }, [])

  // On test is finished
  const testFinished = () => {
    console.log('Test Finished!!!')
  }

  return (
    <Container>
      <Stack>
        <Heading size="md">Near Social Bridge - SSR</Heading>
        <Text>Cada teste deve rodar em uma rota.</Text>
        <Text>Seguir a ordem do README.md</Text>

        <SocialAPIStack run={stacks.nearAPI.run} onComplete={testFinished} />
        {/* <SocialAPIStack run={stacks.nearAPI.run} onComplete={() => runNow(STACK_KEYS.socialAPI)} /> */}
        {/* <SocialAPIStack run={stacks.socialAPI.run} onComplete={testFinished} /> */}
      </Stack>
    </Container>
  )
}

export default Home

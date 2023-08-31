import { Heading, Stack, Text } from '@chakra-ui/react'
import Container from './components/Container'

const Home = () => {
  return (
    <Container>
      <Stack>
        <Heading size="md">Near Social Bridge - SSR Tests</Heading>
        <Text>Cada teste deve rodar em uma rota.</Text>
      </Stack>
    </Container>
  )
}

export default Home

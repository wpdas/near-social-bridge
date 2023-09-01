import { Highlight, Spinner, Stack, Text, Heading, Code } from '@chakra-ui/react'
import { Features } from '../stack/types'

export type TestStatusType = 'pending' | 'running' | 'success' | 'error'

const bg = {
  pending: 'gray.200',
  running: 'orange.200',
  success: 'green.200',
  error: 'red.200',
}

const label = {
  pending: 'pending',
  running: 'running',
  success: 'success',
  error: 'error',
}

type Props = {
  title: string
  status?: TestStatusType
  features?: Features
}

const TestStatus: React.FC<Props> = ({ status = 'pending', features }) => {
  return (
    <Stack>
      <Stack flexDirection="row" alignItems="center">
        <Heading size="sm">Social API - </Heading>
        <Highlight
          query={['pending', 'running', 'success', 'error']}
          styles={{ width: 'fit-content', px: '2', py: '1', rounded: 'full', bg: bg[status] }}
        >
          {label[status]}
        </Highlight>

        {status === 'running' && <Spinner color="orange.200" size="sm" />}
      </Stack>
      {status !== 'pending' && features && (
        <>
          {features.map((feature) => {
            return (
              <Stack key={feature.name} flexDirection="row" alignItems="center">
                <Text>
                  Feature: <Code>{feature.name}</Code>
                </Text>
                {feature.status === 'running' && <Spinner color="green.200" size="sm" />}
                {feature.status === 'success' && <Text>Success</Text>}
                {feature.status === 'error' && <Text>Error</Text>}
              </Stack>
            )
          })}
        </>
      )}
    </Stack>
  )
}

export default TestStatus

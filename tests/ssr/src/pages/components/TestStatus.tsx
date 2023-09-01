import { Highlight, Spinner, Stack, Text, Heading, Code } from '@chakra-ui/react'
import { Features } from '../stack/types'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'

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
  test_id: string
  title: string
  status?: TestStatusType
  features?: Features
}

const TestStatus: React.FC<Props> = ({ test_id, status = 'pending', features }) => {
  return (
    <Stack id={`${test_id}_${status}`}>
      <Stack flexDirection="row" alignItems="center">
        <Heading size="sm">Social API - </Heading>
        <Highlight
          query={['pending', 'running', 'success', 'error']}
          styles={{ width: 'fit-content', px: '2', py: '1', rounded: 'full', bg: bg[status] }}
        >
          {label[status]}
        </Highlight>

        {status === 'running' && <Spinner color="orange.300" size="sm" />}
      </Stack>
      {status !== 'pending' && features && (
        <>
          {features.map((feature) => {
            return (
              <Stack key={feature.name} flexDirection="row" alignItems="center">
                <Text>
                  Feature: <Code>{feature.name}</Code>
                </Text>
                {feature.status === 'running' && <Spinner color="green.300" size="sm" />}
                {feature.status === 'success' && <CheckIcon w={4} h={4} color="green.300" />}
                {feature.status === 'error' && <WarningIcon w={4} h={4} color="red.300" />}
              </Stack>
            )
          })}
        </>
      )}
    </Stack>
  )
}

export default TestStatus

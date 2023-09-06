import { Highlight, Spinner, Stack, Text, Heading, Code } from '@chakra-ui/react'
import { Features } from '../types'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import { JsonViewer } from '@textea/json-viewer'

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
  description?: string
  status?: TestStatusType
  features?: Features
}

const TestStatus: React.FC<Props> = ({ title, test_id, status = 'pending', features, description }) => {
  return (
    <Stack id={`${test_id}_${status}`}>
      <Stack flexDirection="row" alignItems="center">
        <Heading size="sm">{title} - </Heading>
        <Highlight
          query={['pending', 'running', 'success', 'error']}
          styles={{ width: 'fit-content', px: '2', py: '1', rounded: 'full', bg: bg[status] }}
        >
          {label[status]}
        </Highlight>

        {status === 'running' && <Spinner color="orange.300" size="sm" />}
      </Stack>
      {description && <Text fontSize="sm">{description}</Text>}
      {status !== 'pending' && features && (
        <>
          {features.map((feature) => {
            return (
              <Stack key={feature.name}>
                <Stack flexDirection="row" alignItems="center">
                  <Text>
                    Feature: <Code>{feature.name}</Code>
                  </Text>
                  {feature.status === 'running' && <Spinner color="green.300" size="sm" />}
                  {feature.status === 'success' && <CheckIcon w={4} h={4} color="green.300" />}
                  {feature.status === 'error' && <WarningIcon w={4} h={4} color="red.300" />}
                </Stack>
                {feature.jsonBody && (
                  <JsonViewer
                    defaultInspectControl={() => false}
                    indentWidth={4}
                    rootName={false}
                    value={feature.jsonBody}
                  />
                )}
              </Stack>
            )
          })}
        </>
      )}
    </Stack>
  )
}

export default TestStatus

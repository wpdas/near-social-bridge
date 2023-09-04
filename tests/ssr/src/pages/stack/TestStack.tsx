import { Divider, Stack } from '@chakra-ui/react'
import { StackTest } from './types'
import TestStatus from '../components/TestStatus'

const TestStack: StackTest = ({ title, TestStackComponent, run, onComplete, description }) => {
  if (!run) {
    return (
      <Stack mt={4}>
        <Divider />
        <TestStatus test_id="test_waiting" title={title} status="pending" features={[]} description={description} />
      </Stack>
    )
  }
  return <TestStackComponent {...{ onComplete, title, description }} />
}

export default TestStack

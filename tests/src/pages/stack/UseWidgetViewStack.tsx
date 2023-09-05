import { Stack, Divider } from '@chakra-ui/react'
import TestStatus, { TestStatusType } from '../components/TestStatus'
import { useEffect, useState } from 'react'
import { useWidgetView } from '@lib'
import { StackComponent } from '../../types'
import { useTestStack } from '@app/contexts/TestStackProvider'

const TEST_STACK_KEY = 'use-widget-view'

const UseWidgetViewStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  const widgetView = useWidgetView()

  useEffect(() => {
    setTestStatus('running')

    // Set the BOS Component view height to 700px
    updateStackFeatures(TEST_STACK_KEY, { name: 'setHeight', status: 'running' })
    widgetView.setHeight(200)
    updateStackFeatures(TEST_STACK_KEY, { name: 'setHeight', status: 'success' })

    setTestStatus('success')
    onComplete()
  }, [])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        test_id="test_use_widget_view"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseWidgetViewStack

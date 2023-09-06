# Contributing

Near Social Bridge is one of the first tools that enable integration between external React applications and [Blockchain Operating System (BOS)](https://near.org/) and it's in constant development. We’re still working out the kinks to make contributing to this project as easy and transparent as possible, but we’re not quite there yet. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

## Development workflow

To prepare the project's environment, clone the [Near Social Bridge](https://github.com/wpdas/near-social-bridge) repo. Go to the repo folder and install the dependencies by running:

```sh
yarn install
```

No you are ready to start changing the code. Every time you want to test your changes, run (from the root):

```sh
yarn build:for:tests
```

### Commit message convention

We follow the conventional commits specification for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, eg add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

## Testing changes / new features

Go to the `tests` folder (it's highly recommended that you open this folder in a separate IDE).

Run the command below:

```sh
yarn dev
```

This command is going to open up a new browser tab where you will see the React/Next App running within VM. Click on **NearSocialBridgeTests.dev** link to see the test app running or go straight to: **http://localhost:3001/#/view/NearSocialBridgeTests.dev**

Once the tests folder is open in your IDE and the test app is running, go to `src/stack/` and create a file according to the feature you've implemented. For instance, let's suppose you created a feature called "useNiceThing", the file should be named as "UseNiceThingStack.tsx".

Here's the template for this Stack file:

```tsx
import { useEffect, useState } from 'react'
import { Stack, Divider } from '@chakra-ui/react'
import { StackComponent } from '@app/types'
import { useTestStack } from '@app/contexts/TestStackProvider'
import TestStatus, { TestStatusType } from '../components/TestStatus'

import { useNiceThing } from '@lib' // the new feature / change you've implemented

const TEST_STACK_KEY = 'use-nice-thing' // unique stack key

const UseNiceThingStack: StackComponent = ({ title, description, onComplete }) => {
  const [testStatus, setTestStatus] = useState<TestStatusType>('pending')
  const { registerNewStack, updateStackFeatures, getStackFeatures } = useTestStack()

  useEffect(() => {
    registerNewStack(TEST_STACK_KEY)
  }, [])

  // The tests go here
  const niceThing = useNiceThing()

  useEffect(() => {
    // Set the main test status
    setTestStatus('running')

    // Set each feature test status
    updateStackFeatures(TEST_STACK_KEY, { name: 'foo', status: 'running' })
    niceThing.foo()
    // Update the feature test status
    updateStackFeatures(TEST_STACK_KEY, { name: 'foo', status: 'success' })

    updateStackFeatures(TEST_STACK_KEY, { name: 'bar', status: 'running' })
    niceThing.bar()
    updateStackFeatures(TEST_STACK_KEY, { name: 'bar', status: 'success' })

    updateStackFeatures(TEST_STACK_KEY, { name: 'fetchData', status: 'running' })
    niceThing.fetchData()
    updateStackFeatures(TEST_STACK_KEY, { name: 'fetchData', status: 'success', jsonBody: niceThing.data })

    // Set the final main test status
    setTestStatus('success')
    // setTestStatus('error')
    onComplete(true)
  }, [])

  return (
    <Stack mt={4}>
      <Divider />
      <TestStatus
        {/* unique test id */}
        test_id="test_use_nice_thing"
        title={title}
        description={description}
        status={testStatus}
        features={getStackFeatures(TEST_STACK_KEY)}
      />
    </Stack>
  )
}

export default UseNiceThingStack
```

Once the Stack file is ready, go to `src/pages/index.tsx` file. There, you initially will need to update the `initialStackState` and `STACK_KEYS` objects to include your new feature:

```ts
const initialStackState = {
  // ...
  useWidgetView: { run: false, passing: false },
  useSyncContentHeight: { run: false, passing: false },
  useNiceThing: { run: false, passing: false }, // <======== Your new feature here
}

const STACK_KEYS = {
  // ...
  useWidgetView: 'useWidgetView',
  useSyncContentHeight: 'useSyncContentHeight',
  useNiceThing: 'useNiceThing', // <======== Your new feature here
}
```

After that, go to the last <TestStack> component and change the `onComplete` property to:

```tsx
// e.g: in this scenario, UseWidgetViewStack is the last component currently being tested (before your new feature)
<TestStack
  // ...
  onComplete={(passing: boolean) => runNow(STACK_KEYS.useWidgetView, passing, STACK_KEYS.useNiceThing)}
/>
```

Now, below this `<TestStack>` you've just changed, create a new TestStack like so:

```tsx
<TestStack
  title="useNiceThing"
  description="My nice description for this feature" // This is optional
  TestStackComponent={UseNiceThingStack}
  run={stacks.useNiceThing.run}
  onComplete={(passing: boolean) => testFinished(STACK_KEYS.useNiceThing, passing)}
/>
```

## Update the README

After implementing and testing your new feature, update the README.md file with a description of how the new feature works and its purpose.

## Pull Request

Open a Pull Request with a list of the things that were updated / implemented.

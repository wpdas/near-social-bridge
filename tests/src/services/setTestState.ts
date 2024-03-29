import { fetch } from '@lib'

const setTestState = async (state: boolean) => {
  const env = process.env.NODE_ENV
  try {
    if (env === 'production') {
      await fetch(`${window.location.origin}/api/save-test-state?passing=${state === true ? 'true' : 'false'}`)
    }
  } catch (err) {
    console.error(err)
  }
}

export default setTestState

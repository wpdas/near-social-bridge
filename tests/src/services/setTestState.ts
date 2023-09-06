import { fetch as libFetch } from '@lib'

const setTestState = async (state: boolean) => {
  const env = process.env.NODE_ENV
  try {
    if (env === 'development') {
      // Vanilla Fetch
      await fetch(`/api/save-test-state?passing=${state === true ? 'true' : 'false'}`)
    } else {
      // Lib Fetch
      await libFetch(`${window.location.origin}/api/save-test-state?passing=${state === true ? 'true' : 'false'}`)
    }
  } catch (err) {
    console.error(err)
  }
}

export default setTestState

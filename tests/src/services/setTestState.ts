import { api } from './api'

const setTestState = async (state: boolean) => {
  try {
    // await api().get(`save-test-state?passing=${state === true ? 'true' : 'false'}`)
    await fetch(`/api/save-test-state?passing=${state === true ? 'true' : 'false'}`)
  } catch (err) {
    console.error(err)
  }
}

export default setTestState

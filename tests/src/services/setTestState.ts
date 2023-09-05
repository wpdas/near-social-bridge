const setTestState = async (state: boolean) => {
  try {
    // await api().get(`save-test-state?passing=${state === true ? 'true' : 'false'}`)
    await fetch(`/api/save-test-state?passing=${state === true ? 'true' : 'false'}`, {
      // headers: {
      // 'Access-Control-Allow-Credentials': true,
      // ''
      // },
      credentials: 'include',
      mode: 'no-cors',
    })
  } catch (err) {
    console.error(err)
  }
}

export default setTestState

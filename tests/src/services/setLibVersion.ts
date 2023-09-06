import { request } from '@lib'

const setLibVersion = (libVersion: string) => request('set-lib-version', { libVersion }, { forceTryAgain: true })

export default setLibVersion

import getHostname from './getHostname'

// If the app is running locally, use localStorage
const isLocalDev = getHostname() === 'localhost'
export default isLocalDev

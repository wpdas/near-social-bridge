/**
 * Check the process.env.REACT_APP_ENV env var to determine if
 * it's "development" or "production"
 */
const isDevelopment = process.env.REACT_APP_ENV !== 'production'

export default isDevelopment

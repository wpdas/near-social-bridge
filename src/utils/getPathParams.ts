import isBrowser from './isBrowser'

const getPathParams = (url?: string) => {
  if (!isBrowser()) {
    return ''
  }

  const newURL = new URL(url || window.location.href)
  const pathParams = newURL.hash.split('/').slice(1)
  return pathParams
}

export default getPathParams

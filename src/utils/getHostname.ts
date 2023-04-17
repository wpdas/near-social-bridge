import isBrowser from './isBrowser'

const getHostname = () => {
  if (!isBrowser()) {
    return ''
  }

  const url = new URL(window.location.href)
  return url.hostname
}

export default getHostname

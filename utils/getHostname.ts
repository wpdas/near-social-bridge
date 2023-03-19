const getHostname = () => {
  const url = new URL(window.location.href)
  return url.hostname
}

export default getHostname

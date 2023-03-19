const getPathParams = (url?: string) => {
  const newURL = new URL(url || window.location.href)
  const pathParams = newURL.hash.split('/').slice(1)
  return pathParams
}

export default getPathParams

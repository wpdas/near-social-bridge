/**
 * Refresh app when "R" key is pressed 3 times
 */
export const initRefreshService = () => {
  let previousKeys: string[] = []
  const handler = (e: KeyboardEvent) => {
    previousKeys.push(e.key)
    if (previousKeys.length > 3) {
      previousKeys = [previousKeys[1], previousKeys[2], previousKeys[3]]
    }
    if (previousKeys[0] === 'r' && previousKeys[1] === 'r' && previousKeys[2] === 'r') {
      window.location.reload()
    }
  }
  window.addEventListener('keypress', handler)
}

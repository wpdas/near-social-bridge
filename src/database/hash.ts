/**
    A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
    @param {string} text - String to hash
    @return {number} Resulting number.
*/
const hash = (text: string) => {
  let hash = 5381
  let index = text.length

  while (index) {
    hash = (hash * 33) ^ text.charCodeAt(--index)
  }

  return hash >>> 0
}

export default hash

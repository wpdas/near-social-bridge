import axios from 'axios'

export const api = () => {
  const base =
    process.env.NODE_ENV === 'development' ? window.location.origin : 'https://near-social-bridge-tests.vercel.app'

  return axios.create({
    baseURL: `${base}/api/`,
  })
}

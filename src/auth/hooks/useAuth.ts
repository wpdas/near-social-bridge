import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'

/**
 * Provides authenticated user info
 * @returns
 */
const useAuth = () => useContext(AuthContext)
export default useAuth

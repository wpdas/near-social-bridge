import { useContext } from 'react'
import { NearSocialBridgeContext } from '../contexts/NearSocialBridgeProvider'

const useNearSocialBridge = () => useContext(NearSocialBridgeContext)
export default useNearSocialBridge

import { REQUEST_KEYS } from '../constants'
import { UserInfo } from '../services/bridge-service'
import request from '../request/request'

const getUserInfo = () => request<UserInfo>(REQUEST_KEYS.AUTH_GET_USER_INFO, undefined, { forceTryAgain: true })
export default getUserInfo

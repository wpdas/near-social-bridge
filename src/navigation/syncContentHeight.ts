import { REQUEST_KEYS } from '../constants'
import request from '../request/request'

export const syncContentHeight = (height: number) =>
  request(REQUEST_KEYS.NAVIGATION_SYNC_CONTENT_HIGHT_VIEWER, { height }, { forceTryAgain: true })

import { REQUEST_KEYS } from '@lib/constants'
import request from '@lib/request'

export const syncContentHeight = (height: number) =>
  request(REQUEST_KEYS.NAVIGATION_SYNC_CONTENT_HIGHT_VIEWER, { height })

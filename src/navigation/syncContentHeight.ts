import { REQUEST_KEYS } from '../constants'
import request from '../request/request'

export const syncContentHeight = (height?: number) => {
  const contentHeight = height || window.document.body.scrollHeight
  return request(REQUEST_KEYS.NAVIGATION_SYNC_CONTENT_HIGHT_VIEWER, { height: contentHeight }, { forceTryAgain: true })
}

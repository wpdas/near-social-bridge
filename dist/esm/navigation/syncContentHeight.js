import { REQUEST_KEYS } from '../constants';
import request from '../request';
export var syncContentHeight = function (height) {
    return request(REQUEST_KEYS.NAVIGATION_SYNC_CONTENT_HIGHT_VIEWER, { height: height });
};
//# sourceMappingURL=syncContentHeight.js.map
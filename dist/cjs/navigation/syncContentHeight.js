"use strict";
exports.__esModule = true;
exports.syncContentHeight = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../constants");
var request_1 = tslib_1.__importDefault(require("../request"));
var syncContentHeight = function (height) {
    return (0, request_1["default"])(constants_1.REQUEST_KEYS.NAVIGATION_SYNC_CONTENT_HIGHT_VIEWER, { height: height });
};
exports.syncContentHeight = syncContentHeight;
//# sourceMappingURL=syncContentHeight.js.map
"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var getHostname_1 = tslib_1.__importDefault(require("./getHostname"));
// If the app is running locally, use localStorage
var isLocalDev = (0, getHostname_1["default"])() === 'localhost';
exports["default"] = isLocalDev;
//# sourceMappingURL=isLocalDev.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var getHostname_1 = __importDefault(require("./getHostname"));
// If the app is running locally, use localStorage
var isLocalDev = (0, getHostname_1["default"])() === 'localhost';
exports["default"] = isLocalDev;
//# sourceMappingURL=isLocalDev.js.map
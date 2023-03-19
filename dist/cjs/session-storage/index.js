"use strict";
exports.__esModule = true;
exports.useSessionStorage = exports.persistStorage = exports.sessionStorage = void 0;
var tslib_1 = require("tslib");
var sessionStorage_1 = tslib_1.__importDefault(require("./sessionStorage"));
exports.sessionStorage = sessionStorage_1["default"];
var persistStorage_1 = tslib_1.__importDefault(require("./persistStorage"));
exports.persistStorage = persistStorage_1["default"];
var useSessionStorage_1 = tslib_1.__importDefault(require("./hooks/useSessionStorage"));
exports.useSessionStorage = useSessionStorage_1["default"];
//# sourceMappingURL=index.js.map
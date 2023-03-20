"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useSessionStorage = exports.persistStorage = exports.sessionStorage = void 0;
var sessionStorage_1 = __importDefault(require("./sessionStorage"));
exports.sessionStorage = sessionStorage_1["default"];
var persistStorage_1 = __importDefault(require("./persistStorage"));
exports.persistStorage = persistStorage_1["default"];
var useSessionStorage_1 = __importDefault(require("./hooks/useSessionStorage"));
exports.useSessionStorage = useSessionStorage_1["default"];
//# sourceMappingURL=index.js.map
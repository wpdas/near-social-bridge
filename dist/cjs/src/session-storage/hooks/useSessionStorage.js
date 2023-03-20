"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var react_1 = require("react");
var sessionStorage_1 = __importStar(require("../sessionStorage"));
/**
 * Returns storage with the most updated items
 *
 * e.g:
 *
 * sessionStorage.setItem('age', 32)
 *
 * then
 *
 * const storage = useSessionStorage()
 * console.log(storage?.age); // 32
 * @returns
 */
var useSessionStorage = function () {
    var _a = (0, react_1.useState)(), storage = _a[0], setStorage = _a[1];
    (0, react_1.useEffect)(function () {
        var handle = function () {
            var updatedStorage = {};
            sessionStorage_1["default"].keys().forEach(function (storageKey) {
                updatedStorage[storageKey] = sessionStorage_1["default"].getItem(storageKey);
            });
            setStorage(updatedStorage);
        };
        // Update the storage every time it's updated
        sessionStorage_1.sessionStorageUpdateObservable.subscribe(handle);
        return function () {
            sessionStorage_1.sessionStorageUpdateObservable.unsubscribe(handle);
        };
    }, []);
    return storage;
};
exports["default"] = useSessionStorage;
//# sourceMappingURL=useSessionStorage.js.map
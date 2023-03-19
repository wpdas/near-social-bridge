"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var react_1 = require("react");
var sessionStorage_1 = tslib_1.__importStar(require("../sessionStorage"));
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
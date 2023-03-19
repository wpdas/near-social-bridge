"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var bridge_service_1 = require("@lib/services/bridge-service");
var isLocalDev_1 = tslib_1.__importDefault(require("@lib/utils/isLocalDev"));
var sessionStorage_1 = tslib_1.__importStar(require("./sessionStorage"));
var setItem = function (key, value) {
    return new Promise(function (resolve) {
        if (isLocalDev_1["default"] && localStorage) {
            resolve(localStorage.setItem(key, value));
        }
        else {
            resolve(sessionStorage_1["default"].setItem(key, value));
        }
    });
};
var getItem = function (key) {
    return new Promise(function (resolve) {
        // Local host: localStorage
        if (isLocalDev_1["default"] && localStorage) {
            resolve(localStorage.getItem(key));
            return;
        }
        // Near Social View host: sessionStorage
        if ((0, bridge_service_1.getConnectionStatus)() !== 'connected') {
            var handler_1 = function () {
                sessionStorage_1.sessionStorageUpdateObservable.unsubscribe(handler_1);
                resolve(sessionStorage_1["default"].getItem(key));
            };
            sessionStorage_1.sessionStorageUpdateObservable.subscribe(handler_1);
        }
        else {
            resolve(sessionStorage_1["default"].getItem(key));
        }
    });
};
var removeItem = function (key) {
    return new Promise(function (resolve) {
        if (isLocalDev_1["default"] && localStorage) {
            resolve(localStorage.removeItem(key));
        }
        else {
            resolve(sessionStorage_1["default"].removeItem(key));
        }
    });
};
/**
 * Provides automatic Redux state persistence for session (this is the only way to persist data using Near Social View)
 */
var persistStorage = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
};
exports["default"] = persistStorage;
//# sourceMappingURL=persistStorage.js.map
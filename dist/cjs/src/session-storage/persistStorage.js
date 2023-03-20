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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bridge_service_1 = require("../services/bridge-service");
var isLocalDev_1 = __importDefault(require("../utils/isLocalDev"));
var sessionStorage_1 = __importStar(require("./sessionStorage"));
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
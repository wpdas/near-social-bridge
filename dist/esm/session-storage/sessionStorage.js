import { __assign, __awaiter, __generator } from "tslib";
import { REQUEST_KEYS } from '@lib/constants';
import request from '@lib/request';
import { onConnectObservable } from '@lib/services/bridge-service';
import Observable from '@lib/utils/observable';
/**
 * Notify with the current storage data every time the storage is updated
 */
export var sessionStorageUpdateObservable = new Observable();
var _storage = {};
var setItem = function (key, value) {
    var updatedStorage = __assign({}, _storage);
    updatedStorage[key] = value;
    _storage = updatedStorage;
    hydrateViewer();
};
var getItem = function (key) { return _storage[key] || null; };
var removeItem = function (key) {
    var updatedStorage = {};
    Object.keys(_storage).forEach(function (currentKey) {
        if (key !== currentKey) {
            updatedStorage[currentKey] = _storage[currentKey];
        }
    });
    _storage = updatedStorage;
    hydrateViewer();
};
var clear = function () {
    _storage = {};
    hydrateViewer();
};
var keys = function () { return Object.keys(_storage); };
/**
 * This will hydrate the Viewer "sessionStorageClone" object with the current storage data present on the App (external app)
 */
var hydrateViewer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Hydrate the Viewer "sessionStorageClone" state with External App _storage object
            return [4 /*yield*/, request(REQUEST_KEYS.SESSION_STORAGE_HYDRATE_VIEWER, _storage)];
            case 1:
                // Hydrate the Viewer "sessionStorageClone" state with External App _storage object
                _a.sent();
                sessionStorageUpdateObservable.notify(_storage);
                return [2 /*return*/];
        }
    });
}); };
/**
 * This method is automatically called every time the bridge connection is estabilished
 */
var hydrate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var view_sessionStorageClone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request(REQUEST_KEYS.SESSION_STORAGE_HYDRATE_APP)
                // Hydrate _storage with data stored in the Viewer "sessionStorageClone" state
            ];
            case 1:
                view_sessionStorageClone = _a.sent();
                // Hydrate _storage with data stored in the Viewer "sessionStorageClone" state
                _storage = view_sessionStorageClone || {};
                sessionStorageUpdateObservable.notify(_storage);
                return [2 /*return*/];
        }
    });
}); };
// Every time the bridge connection is estabilished, hydrate the storage
onConnectObservable.subscribe(hydrate);
/**
 * Stores data for one session. Data is lost when the browser tab is reloaded or closed
 */
var sessionStorage = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem,
    clear: clear,
    keys: keys
};
export default sessionStorage;
//# sourceMappingURL=sessionStorage.js.map
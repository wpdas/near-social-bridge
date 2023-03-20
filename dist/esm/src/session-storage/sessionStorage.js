var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { REQUEST_KEYS } from '../constants';
import request from '../request';
import { onConnectObservable } from '../services/bridge-service';
import Observable from '../utils/observable';
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
 * This method is automatically called every time the bridge connection is established
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
// Every time the bridge connection is established, hydrate the storage
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
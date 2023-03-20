import { getConnectionStatus } from '../services/bridge-service';
import isLocalDev from '../utils/isLocalDev';
import sessionStorage, { sessionStorageUpdateObservable } from './sessionStorage';
var setItem = function (key, value) {
    return new Promise(function (resolve) {
        if (isLocalDev && localStorage) {
            resolve(localStorage.setItem(key, value));
        }
        else {
            resolve(sessionStorage.setItem(key, value));
        }
    });
};
var getItem = function (key) {
    return new Promise(function (resolve) {
        // Local host: localStorage
        if (isLocalDev && localStorage) {
            resolve(localStorage.getItem(key));
            return;
        }
        // Near Social View host: sessionStorage
        if (getConnectionStatus() !== 'connected') {
            var handler_1 = function () {
                sessionStorageUpdateObservable.unsubscribe(handler_1);
                resolve(sessionStorage.getItem(key));
            };
            sessionStorageUpdateObservable.subscribe(handler_1);
        }
        else {
            resolve(sessionStorage.getItem(key));
        }
    });
};
var removeItem = function (key) {
    return new Promise(function (resolve) {
        if (isLocalDev && localStorage) {
            resolve(localStorage.removeItem(key));
        }
        else {
            resolve(sessionStorage.removeItem(key));
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
export default persistStorage;
//# sourceMappingURL=persistStorage.js.map
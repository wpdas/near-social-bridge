import { useEffect, useState } from 'react';
import sessionStorage, { sessionStorageUpdateObservable } from '../sessionStorage';
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
    var _a = useState(), storage = _a[0], setStorage = _a[1];
    useEffect(function () {
        var handle = function () {
            var updatedStorage = {};
            sessionStorage.keys().forEach(function (storageKey) {
                updatedStorage[storageKey] = sessionStorage.getItem(storageKey);
            });
            setStorage(updatedStorage);
        };
        // Update the storage every time it's updated
        sessionStorageUpdateObservable.subscribe(handle);
        return function () {
            sessionStorageUpdateObservable.unsubscribe(handle);
        };
    }, []);
    return storage;
};
export default useSessionStorage;
//# sourceMappingURL=useSessionStorage.js.map
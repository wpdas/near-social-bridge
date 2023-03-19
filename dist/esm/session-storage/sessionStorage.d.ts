import Observable from '../utils/observable';
/**
 * Notify with the current storage data every time the storage is updated
 */
export declare const sessionStorageUpdateObservable: Observable<{}>;
/**
 * Stores data for one session. Data is lost when the browser tab is reloaded or closed
 */
declare const sessionStorage: {
    setItem: (key: string, value: any) => void;
    getItem: (key: string) => any;
    removeItem: (key: string) => void;
    clear: () => void;
    keys: () => string[];
};
export default sessionStorage;

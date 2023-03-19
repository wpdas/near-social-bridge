/**
 * Provides automatic Redux state persistence for session (this is the only way to persist data using Near Social View)
 */
declare const persistStorage: {
    setItem: (key: string, value: any) => Promise<void>;
    getItem: (key: string) => Promise<unknown>;
    removeItem: (key: string) => Promise<void>;
};
export default persistStorage;

import Observable from '../utils/observable';
export type ConnectionPayload = {
    /**
     * Initial path to be rendered. This is optionally provided by the Near Social View
     */
    initialPath?: string;
};
/**
 * pending: the service was not initialized yet. You need to call initBridgeService().
 * waiting-for-viewer-signal: the service was initialized and is waiting for a positive signal from Viewer
 * connected: the service has a connection with the Viewer
 */
export type BridgeServiceStatus = 'pending' | 'waiting-for-viewer-signal' | 'connected';
export declare const bridgeServiceObservable: Observable<MessageEvent<any>>;
export declare const onConnectObservable: Observable<ConnectionPayload>;
/**
 * Post message
 * @param message
 * @returns
 */
export declare const postMessage: (message: any) => void;
/**
 * Get the payload provided by the connection
 * @returns
 */
export declare const getConnectionPayload: <P extends ConnectionPayload>() => P;
/**
 * Get the current connection status
 */
export declare const getConnectionStatus: () => BridgeServiceStatus;
/**
 * Init the service
 * @param viewMessageSource
 */
export declare const initBridgeService: () => void;

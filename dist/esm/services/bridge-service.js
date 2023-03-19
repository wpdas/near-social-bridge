import isLocalDev from '../utils/isLocalDev';
import Observable from '../utils/observable';
var viewSource;
var status = 'pending';
var connectionPayload = {};
export var bridgeServiceObservable = new Observable();
export var onConnectObservable = new Observable();
/**
 * Post message
 * @param message
 * @returns
 */
export var postMessage = function (message) {
    if (!viewSource && !isLocalDev)
        return console.warn('Message source was not initialized!');
    viewSource === null || viewSource === void 0 ? void 0 : viewSource.postMessage(message, '*');
};
/**
 * On get answer from the View
 * @param event
 */
var onGetMessage = function (event) {
    if (!viewSource && status === 'waiting-for-viewer-signal') {
        // Set the Messager source
        viewSource = event.source;
        status = 'connected';
        // Save the welcome payload (connect)
        if (event.data.type === 'connect') {
            connectionPayload = event.data.payload;
            onConnectObservable.notify(connectionPayload);
        }
        // Successful connection message
        console.log('%c --- Near Social Bridge initialized ---', 'background: #282C34; color:#fff');
    }
    // Notify all observers
    bridgeServiceObservable.notify(event);
};
/**
 * Get the payload provided by the connection
 * @returns
 */
export var getConnectionPayload = function () { return connectionPayload; };
/**
 * Get the current connection status
 */
export var getConnectionStatus = function () { return status; };
/**
 * Init the service
 * @param viewMessageSource
 */
export var initBridgeService = function () {
    if (status === 'pending') {
        status = 'waiting-for-viewer-signal';
        window.addEventListener('message', onGetMessage, false);
        //DEV - clear observables when the app reload
        var handler_1 = function () {
            bridgeServiceObservable.clear();
            onConnectObservable.clear();
            window.removeEventListener('unload', handler_1);
        };
        window.addEventListener('unload', handler_1);
    }
};
//# sourceMappingURL=bridge-service.js.map
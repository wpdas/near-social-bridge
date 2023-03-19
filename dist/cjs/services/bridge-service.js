"use strict";
exports.__esModule = true;
exports.initBridgeService = exports.getConnectionStatus = exports.getConnectionPayload = exports.postMessage = exports.onConnectObservable = exports.bridgeServiceObservable = void 0;
var tslib_1 = require("tslib");
var isLocalDev_1 = tslib_1.__importDefault(require("@lib/utils/isLocalDev"));
var observable_1 = tslib_1.__importDefault(require("@lib/utils/observable"));
var viewSource;
var status = 'pending';
var connectionPayload = {};
exports.bridgeServiceObservable = new observable_1["default"]();
exports.onConnectObservable = new observable_1["default"]();
/**
 * Post message
 * @param message
 * @returns
 */
var postMessage = function (message) {
    if (!viewSource && !isLocalDev_1["default"])
        return console.warn('Message source was not initialized!');
    viewSource === null || viewSource === void 0 ? void 0 : viewSource.postMessage(message, '*');
};
exports.postMessage = postMessage;
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
            exports.onConnectObservable.notify(connectionPayload);
        }
        // Successful connection message
        console.log('%c --- Near Social Bridge initialized ---', 'background: #282C34; color:#fff');
    }
    // Notify all observers
    exports.bridgeServiceObservable.notify(event);
};
/**
 * Get the payload provided by the connection
 * @returns
 */
var getConnectionPayload = function () { return connectionPayload; };
exports.getConnectionPayload = getConnectionPayload;
/**
 * Get the current connection status
 */
var getConnectionStatus = function () { return status; };
exports.getConnectionStatus = getConnectionStatus;
/**
 * Init the service
 * @param viewMessageSource
 */
var initBridgeService = function () {
    if (status === 'pending') {
        status = 'waiting-for-viewer-signal';
        window.addEventListener('message', onGetMessage, false);
        //DEV - clear observables when the app reload
        var handler_1 = function () {
            exports.bridgeServiceObservable.clear();
            exports.onConnectObservable.clear();
            window.removeEventListener('unload', handler_1);
        };
        window.addEventListener('unload', handler_1);
    }
};
exports.initBridgeService = initBridgeService;
//# sourceMappingURL=bridge-service.js.map
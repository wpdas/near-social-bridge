"use strict";
exports.__esModule = true;
exports.buildRequestBody = void 0;
var bridge_service_1 = require("@lib/services/bridge-service");
/**
 * Build a request body
 * @param type Request type to be handled inside the View
 * @param payload Request payload
 * @returns
 */
var buildRequestBody = function (type, payload) {
    return {
        from: 'external-app',
        type: type,
        payload: payload
    };
};
exports.buildRequestBody = buildRequestBody;
/**
 * Send a request to the Near Social View
 * @param requestType Request type to be handled inside the View (you can use `buildRequestBody` in order to
 * follow the pattern)
 * @param payload Any payload to be sent to the View
 * @returns
 */
var request = function (requestType, payload) {
    (0, bridge_service_1.initBridgeService)();
    return new Promise(function (resolve) {
        // Observe it till get the answer from the View
        var checkMessage = function (e) {
            if (e.data.type === 'answer' && e.data.requestType === requestType) {
                resolve(e.data.payload);
                bridge_service_1.bridgeServiceObservable.unsubscribe(checkMessage);
            }
        };
        bridge_service_1.bridgeServiceObservable.subscribe(checkMessage);
        // Post Message
        var message = (0, exports.buildRequestBody)(requestType, payload);
        (0, bridge_service_1.postMessage)(message);
    });
};
exports["default"] = request;
//# sourceMappingURL=index.js.map
import { initBridgeService, bridgeServiceObservable, postMessage } from '@lib/services/bridge-service';
/**
 * Build a request body
 * @param type Request type to be handled inside the View
 * @param payload Request payload
 * @returns
 */
export var buildRequestBody = function (type, payload) {
    return {
        from: 'external-app',
        type: type,
        payload: payload
    };
};
/**
 * Send a request to the Near Social View
 * @param requestType Request type to be handled inside the View (you can use `buildRequestBody` in order to
 * follow the pattern)
 * @param payload Any payload to be sent to the View
 * @returns
 */
var request = function (requestType, payload) {
    initBridgeService();
    return new Promise(function (resolve) {
        // Observe it till get the answer from the View
        var checkMessage = function (e) {
            if (e.data.type === 'answer' && e.data.requestType === requestType) {
                resolve(e.data.payload);
                bridgeServiceObservable.unsubscribe(checkMessage);
            }
        };
        bridgeServiceObservable.subscribe(checkMessage);
        // Post Message
        var message = buildRequestBody(requestType, payload);
        postMessage(message);
    });
};
export default request;
//# sourceMappingURL=index.js.map
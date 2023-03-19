import React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import { bridgeServiceObservable, initBridgeService, postMessage as postMessageService, } from '../../services/bridge-service';
var defaultValue = {
    postMessage: function () {
        throw new Error('postMessage must be defined!');
    },
    onGetMessage: function () {
        throw new Error('onGetMessage must be defined!');
    },
    simulateIFrameMessage: function () {
        throw new Error('simulateIFrameMessage must be defined!');
    }
};
export var NearSocialBridgeContext = createContext(defaultValue);
var NearSocialBridgeProvider = function (_a) {
    var children = _a.children;
    var _b = useState({ cb: function () { } }), _onGetMessage = _b[0], set_onGetMessage = _b[1];
    /**
     * Post Message
     */
    var postMessage = useCallback(function (message) {
        postMessageService(message);
    }, []);
    /**
     * Set the onGetMessage handler
     */
    var onGetMessage = useCallback(function (cb) {
        set_onGetMessage({ cb: cb });
    }, []);
    /**
     * Simulate the iframe's message prop to send a message to the external app
     */
    var simulateIFrameMessage = useCallback(function (message) {
        var _a;
        // NOTE: experimental, should be tested
        (_a = window.top) === null || _a === void 0 ? void 0 : _a.postMessage(message);
    }, []);
    useEffect(function () {
        // Set up the message receiver
        var handler = function (event) {
            if (_onGetMessage.cb && event.type === 'message') {
                _onGetMessage.cb(event);
            }
        };
        bridgeServiceObservable.subscribe(handler);
        // Init Bridge Service
        initBridgeService();
        return function () {
            bridgeServiceObservable.unsubscribe(handler);
        };
    }, [_onGetMessage]);
    return (React.createElement(NearSocialBridgeContext.Provider, { value: { postMessage: postMessage, onGetMessage: onGetMessage, simulateIFrameMessage: simulateIFrameMessage } }, children));
};
export default NearSocialBridgeProvider;
//# sourceMappingURL=NearSocialBridgeProvider.js.map
"use strict";
exports.__esModule = true;
exports.NearSocialBridgeContext = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_2 = require("react");
var bridge_service_1 = require("../../services/bridge-service");
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
exports.NearSocialBridgeContext = (0, react_2.createContext)(defaultValue);
var NearSocialBridgeProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_2.useState)({ cb: function () { } }), _onGetMessage = _b[0], set_onGetMessage = _b[1];
    /**
     * Post Message
     */
    var postMessage = (0, react_2.useCallback)(function (message) {
        (0, bridge_service_1.postMessage)(message);
    }, []);
    /**
     * Set the onGetMessage handler
     */
    var onGetMessage = (0, react_2.useCallback)(function (cb) {
        set_onGetMessage({ cb: cb });
    }, []);
    /**
     * Simulate the iframe's message prop to send a message to the external app
     */
    var simulateIFrameMessage = (0, react_2.useCallback)(function (message) {
        var _a;
        // NOTE: experimental, should be tested
        (_a = window.top) === null || _a === void 0 ? void 0 : _a.postMessage(message);
    }, []);
    (0, react_2.useEffect)(function () {
        // Set up the message receiver
        var handler = function (event) {
            if (_onGetMessage.cb && event.type === 'message') {
                _onGetMessage.cb(event);
            }
        };
        bridge_service_1.bridgeServiceObservable.subscribe(handler);
        // Init Bridge Service
        (0, bridge_service_1.initBridgeService)();
        return function () {
            bridge_service_1.bridgeServiceObservable.unsubscribe(handler);
        };
    }, [_onGetMessage]);
    return (react_1["default"].createElement(exports.NearSocialBridgeContext.Provider, { value: { postMessage: postMessage, onGetMessage: onGetMessage, simulateIFrameMessage: simulateIFrameMessage } }, children));
};
exports["default"] = NearSocialBridgeProvider;
//# sourceMappingURL=NearSocialBridgeProvider.js.map
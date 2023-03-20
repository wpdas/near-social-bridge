"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bridge_service_1 = require("../services/bridge-service");
var getHostname_1 = __importDefault(require("../utils/getHostname"));
var getPathParams_1 = __importDefault(require("../utils/getPathParams"));
var react_1 = __importStar(require("react"));
var NavigationProvider_1 = __importStar(require("./contexts/NavigationProvider"));
var useNavigation_1 = __importDefault(require("./hooks/useNavigation"));
var syncContentHeight_1 = require("./syncContentHeight");
/**
 * Create and provides a Navigator (Routes controler) and Screen (Route component).
 * You can provide a fallback component. If it's provided, it'll be shown until the connection
 * with the Viewer is established
 *
 * @param fallback Fallback component. If provided, it'll be shown until the connection
 * with the Viewer is established
 * @returns
 */
var createStackNavigator = function (fallback) {
    /**
     * Navigator Component (Routes controler)
     *
     * - This will send the content height (using Screen iframeHeight prop) to the iframe automatically, so that, the iframe will fit the right size
     *
     * @param param0
     * @returns
     */
    var Navigator = function (_a) {
        var children = _a.children;
        var _b = (0, react_1.useState)(false), isReady = _b[0], setIsReady = _b[1];
        var navigation = (0, useNavigation_1["default"])();
        var screens = (0, react_1.useState)(children)[0];
        var _c = (0, react_1.useState)(), currentScreen = _c[0], setCurrentScreen = _c[1];
        var findScreenAndPopulateProps = (0, react_1.useCallback)(function (route) {
            var pathParams = route ? route.split('/') : [];
            var routeParams = pathParams.slice(2);
            // Params to be mapped
            var params = {};
            // Search for the Screen by path
            var urlPath = pathParams[1];
            var foundScreen = screens.find(function (screen) { return screen.props.name.toLowerCase() === urlPath; });
            if (foundScreen) {
                if (foundScreen.props.pathParams) {
                    // Map the props
                    var foundScreenParamsKeys = foundScreen.props.pathParams.split('/:').slice(1);
                    foundScreenParamsKeys.forEach(function (key, index) {
                        params[key] = routeParams[index] || undefined;
                    });
                }
                // Set this screen (found by path) as the first to be rendered
                navigation.push(foundScreen.props.name);
            }
            else {
                // Set the first screen in the stack
                var firstChildName = screens[0].props.name;
                navigation.push(firstChildName);
            }
        }, []);
        (0, react_1.useEffect)(function () {
            // Internal path (executing inside the iframe or local browser during development)
            var route = (0, bridge_service_1.getConnectionPayload)().initialPath || "/".concat(NavigationProvider_1.initialRoute) || undefined;
            findScreenAndPopulateProps(route);
        }, []);
        (0, react_1.useEffect)(function () {
            // Use the bridge service to set the initial page
            // Wait the Viewer connection before rendering the page. Shows the fallback component while waiting.
            var handler = function (connectionPayload) {
                var route = connectionPayload.initialPath;
                findScreenAndPopulateProps(route);
                setIsReady(true);
            };
            if ((0, bridge_service_1.getConnectionStatus)() === 'connected') {
                setIsReady(true);
            }
            bridge_service_1.onConnectObservable.subscribe(handler);
            // DEV
            if ((0, getHostname_1["default"])() === 'localhost') {
                handler({ initialPath: "/".concat(NavigationProvider_1.initialRoute) });
            }
            return function () {
                bridge_service_1.onConnectObservable.unsubscribe(handler);
            };
        }, []);
        /**
         * Send the content height to the iframe, so that it can fit the content properly
         */
        (0, react_1.useEffect)(function () {
            var _a;
            if ((_a = currentScreen === null || currentScreen === void 0 ? void 0 : currentScreen.props) === null || _a === void 0 ? void 0 : _a.iframeHeight) {
                var screenElementContentHeight = currentScreen.props.iframeHeight;
                // Sync Height
                (0, syncContentHeight_1.syncContentHeight)(screenElementContentHeight);
            }
        }, [currentScreen]);
        // Handle the current screen
        (0, react_1.useEffect)(function () {
            var _currentScreen = screens.find(function (screen) { var _a; return screen.props.name === ((_a = navigation.location) === null || _a === void 0 ? void 0 : _a[0]); }) || null;
            setCurrentScreen(_currentScreen);
        }, [navigation.location, screens]);
        // Handle window location hash changes
        (0, react_1.useEffect)(function () {
            var handler = function (event) {
                var currentRoute = (0, getPathParams_1["default"])(event.newURL)[0];
                // Reset the screen
                var _currentScreen = screens.find(function (screen) { return screen.props.name.toLowerCase() === currentRoute; }) || null;
                if (_currentScreen) {
                    setCurrentScreen(_currentScreen);
                }
            };
            window.addEventListener('hashchange', handler);
            return function () {
                window.removeEventListener('hashchange', handler);
            };
        }, [screens]);
        // Shows the Fallback component while waiting for the connection
        if (!isReady)
            return fallback ? react_1["default"].createElement(react_1["default"].Fragment, null, fallback) : null;
        return react_1["default"].createElement(react_1["default"].Fragment, null, currentScreen);
    };
    var WrappedNavigator = function (_a) {
        var children = _a.children;
        return (react_1["default"].createElement(NavigationProvider_1["default"], null,
            react_1["default"].createElement(Navigator, null, children)));
    };
    /**
     * Screen Component (Route)
     *
     * @param param0
     * @returns
     */
    var Screen = function (_a) {
        var key = _a.key, name = _a.name, component = _a.component, pathParams = _a.pathParams;
        var navigation = (0, useNavigation_1["default"])();
        var Component = component;
        // Internal path (executing inside the iframe)
        var url = new URL(window.location.href);
        var path = url.searchParams.get('r');
        return (react_1["default"].createElement("div", { id: "nsb-navigation-screen" },
            react_1["default"].createElement(Component, __assign({}, {
                navigation: navigation,
                route: {
                    key: key,
                    name: name,
                    params: __assign({}, navigation.location[1]),
                    path: path,
                    pathParams: pathParams
                }
            }))));
    };
    return {
        Navigator: WrappedNavigator,
        Screen: Screen
    };
};
exports["default"] = createStackNavigator;
//# sourceMappingURL=createStackNavigator.js.map
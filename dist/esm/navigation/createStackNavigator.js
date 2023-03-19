import { __assign } from "tslib";
import { onConnectObservable, getConnectionPayload, getConnectionStatus, } from '@lib/services/bridge-service';
import getHostname from '@lib/utils/getHostname';
import getPathParams from '@lib/utils/getPathParams';
import React, { useCallback, useEffect, useState } from 'react';
import NavigationProvider, { initialRoute } from './contexts/NavigationProvider';
import useNavigation from './hooks/useNavigation';
import { syncContentHeight } from './syncContentHeight';
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
        var _b = useState(false), isReady = _b[0], setIsReady = _b[1];
        var navigation = useNavigation();
        var screens = useState(children)[0];
        var _c = useState(), currentScreen = _c[0], setCurrentScreen = _c[1];
        var findScreenAndPopulateProps = useCallback(function (route) {
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
        useEffect(function () {
            // Internal path (executing inside the iframe or local browser during development)
            var route = getConnectionPayload().initialPath || "/".concat(initialRoute) || undefined;
            findScreenAndPopulateProps(route);
        }, []);
        useEffect(function () {
            // Use the bridge service to set the initial page
            // Wait the Viewer connection before rendering the page. Shows the fallback component while waiting.
            var handler = function (connectionPayload) {
                var route = connectionPayload.initialPath;
                findScreenAndPopulateProps(route);
                setIsReady(true);
            };
            if (getConnectionStatus() === 'connected') {
                setIsReady(true);
            }
            onConnectObservable.subscribe(handler);
            // DEV
            if (getHostname() === 'localhost') {
                handler({ initialPath: "/".concat(initialRoute) });
            }
            return function () {
                onConnectObservable.unsubscribe(handler);
            };
        }, []);
        /**
         * Send the content height to the iframe, so that it can fit the content properly
         */
        useEffect(function () {
            var _a;
            if ((_a = currentScreen === null || currentScreen === void 0 ? void 0 : currentScreen.props) === null || _a === void 0 ? void 0 : _a.iframeHeight) {
                var screenElementContentHeight = currentScreen.props.iframeHeight;
                // Sync Height
                syncContentHeight(screenElementContentHeight);
            }
        }, [currentScreen]);
        // Handle the current screen
        useEffect(function () {
            var _currentScreen = screens.find(function (screen) { var _a; return screen.props.name === ((_a = navigation.location) === null || _a === void 0 ? void 0 : _a[0]); }) || null;
            setCurrentScreen(_currentScreen);
        }, [navigation.location, screens]);
        // Handle window location hash changes
        useEffect(function () {
            var handler = function (event) {
                var currentRoute = getPathParams(event.newURL)[0];
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
            return fallback ? React.createElement(React.Fragment, null, fallback) : null;
        return React.createElement(React.Fragment, null, currentScreen);
    };
    var WrappedNavigator = function (_a) {
        var children = _a.children;
        return (React.createElement(NavigationProvider, null,
            React.createElement(Navigator, null, children)));
    };
    /**
     * Screen Component (Route)
     *
     * @param param0
     * @returns
     */
    var Screen = function (_a) {
        var key = _a.key, name = _a.name, component = _a.component, pathParams = _a.pathParams;
        var navigation = useNavigation();
        var Component = component;
        // Internal path (executing inside the iframe)
        var url = new URL(window.location.href);
        var path = url.searchParams.get('r');
        return (React.createElement("div", { id: "nsb-navigation-screen" },
            React.createElement(Component, __assign({}, {
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
export default createStackNavigator;
//# sourceMappingURL=createStackNavigator.js.map
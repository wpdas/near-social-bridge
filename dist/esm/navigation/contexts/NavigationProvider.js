import { __spreadArray } from "tslib";
import getPathParams from '@lib/utils/getPathParams';
import React, { createContext, useCallback, useEffect, useState } from 'react';
var defaultValue = {
    push: function () {
        throw new Error('push must be defined!');
    },
    goBack: function () {
        throw new Error('goBack must be defined!');
    },
    location: [],
    history: []
};
export var NavigationContext = createContext(defaultValue);
var updateBrowserUrl = function (screenName) {
    var windowHistory = window.history;
    windowHistory.pushState({}, '', "#/".concat(screenName.toLowerCase()));
};
/**
 * DEV - Used to keep the same route when the app is reloaded after the developer
 * makes change to the app code.
 *
 * This prop is used by the `createStackNavigator` method
 */
export var initialRoute = undefined;
var NavigationProvider = function (_a) {
    var children = _a.children;
    // DEV
    if (!initialRoute) {
        initialRoute = getPathParams()[0];
    }
    // navigation handler
    var _b = useState([]), history = _b[0], setHistory = _b[1];
    // Handle window location hash changes
    useEffect(function () {
        var handler = function () {
            var _a;
            var currentRoute = getPathParams()[0];
            // Check if the current path is the penultimate in the history, if so, remove the last one in the history
            var penultimateHistoryPath = ((_a = history.at(-2)) === null || _a === void 0 ? void 0 : _a[0]) || '';
            if (penultimateHistoryPath.toLowerCase() === currentRoute) {
                var updatedHistory = __spreadArray([], history.slice(0, history.length - 1), true);
                setHistory(updatedHistory);
            }
        };
        window.addEventListener('hashchange', handler);
        return function () {
            window.removeEventListener('hashchange', handler);
        };
    }, [history]);
    var push = useCallback(function (screen, params) {
        var updatedHistory = __spreadArray([], history, true);
        updatedHistory.push([screen, params]);
        setHistory(updatedHistory);
        updateBrowserUrl(screen);
    }, [history]);
    var goBack = useCallback(function () {
        var _a;
        var updatedHistory = __spreadArray([], history.slice(0, history.length - 1), true);
        if (updatedHistory && updatedHistory.length > 0) {
            setHistory(updatedHistory);
            var screen_1 = (_a = updatedHistory.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
            if (screen_1) {
                updateBrowserUrl(screen_1);
            }
        }
    }, [history]);
    return (React.createElement(NavigationContext.Provider, { value: { push: push, goBack: goBack, location: history.at(-1), history: history } }, children));
};
export default NavigationProvider;
//# sourceMappingURL=NavigationProvider.js.map
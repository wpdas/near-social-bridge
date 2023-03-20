"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.createStackNavigator = exports.useNavigation = exports.NavigationProvider = void 0;
var NavigationProvider_1 = __importDefault(require("./contexts/NavigationProvider"));
exports.NavigationProvider = NavigationProvider_1["default"];
var useNavigation_1 = __importDefault(require("./hooks/useNavigation"));
exports.useNavigation = useNavigation_1["default"];
var createStackNavigator_1 = __importDefault(require("./createStackNavigator"));
exports.createStackNavigator = createStackNavigator_1["default"];
//# sourceMappingURL=index.js.map
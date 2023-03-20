"use strict";
exports.__esModule = true;
var react_1 = require("react");
var NavigationProvider_1 = require("../contexts/NavigationProvider");
var useNavigation = function () {
    return (0, react_1.useContext)(NavigationProvider_1.NavigationContext);
};
exports["default"] = useNavigation;
//# sourceMappingURL=useNavigation.js.map
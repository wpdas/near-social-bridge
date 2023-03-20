"use strict";
exports.__esModule = true;
var getHostname = function () {
    var url = new URL(window.location.href);
    return url.hostname;
};
exports["default"] = getHostname;
//# sourceMappingURL=getHostname.js.map
var getPathParams = function (url) {
    var newURL = new URL(url || window.location.href);
    var pathParams = newURL.hash.split('/').slice(1);
    return pathParams;
};
export default getPathParams;
//# sourceMappingURL=getPathParams.js.map
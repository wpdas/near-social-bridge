import getHostname from './getHostname';
// If the app is running locally, use localStorage
var isLocalDev = getHostname() === 'localhost';
export default isLocalDev;
//# sourceMappingURL=isLocalDev.js.map
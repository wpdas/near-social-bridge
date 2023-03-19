"use strict";
exports.__esModule = true;
var Observable = /** @class */ (function () {
    function Observable() {
        this.observers = [];
    }
    Observable.prototype.subscribe = function (handler) {
        if (!this.observers.includes(handler)) {
            this.observers.push(handler);
        }
    };
    Observable.prototype.unsubscribe = function (handler) {
        this.observers = this.observers.filter(function (subscriber) { return subscriber !== handler; });
    };
    Observable.prototype.notify = function (data) {
        this.observers.forEach(function (observer) { return observer(data); });
    };
    Observable.prototype.clear = function () {
        this.observers = [];
    };
    return Observable;
}());
exports["default"] = Observable;
//# sourceMappingURL=observable.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ScrollEvent = /** @class */ (function (_super_1) {
    __extends(ScrollEvent, _super_1);
    function ScrollEvent(type, bubbles, cancelable, data) {
        return _super_1.call(this, type, bubbles, cancelable, data) || this;
    }
    // 到达终点
    ScrollEvent.REACH_END = "reach_end";
    // 中间
    ScrollEvent.REACH_RANGE = "reach_range";
    // 到达起点
    ScrollEvent.REACH_START = "reach_start";
    return ScrollEvent;
}(egret.Event));

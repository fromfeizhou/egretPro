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
var com_main;
(function (com_main) {
    /**
     *
     * @author
     *
     */
    var TweenAnim = /** @class */ (function (_super_1) {
        __extends(TweenAnim, _super_1);
        function TweenAnim(target, props, pluginData) {
            var _this = _super_1.call(this, target, props, pluginData) || this;
            _this.updateTime = 0;
            return _this;
        }
        TweenAnim.get = function (target, props, pluginData, override) {
            if (props === void 0) { props = null; }
            if (pluginData === void 0) { pluginData = null; }
            if (override === void 0) { override = false; }
            if (override) {
                TweenAnim.removeTweens(target);
            }
            return new TweenAnim(target, props, pluginData);
        };
        TweenAnim.prototype.tick = function (delta) {
            var frameTime = TweenAnim.TWEENANIM_FRAME_TIME;
            this.updateTime += delta;
            while (this.updateTime >= frameTime) {
                // super.tick(delta);
                //钟凯宇
                this.updateTime -= frameTime;
            }
        };
        TweenAnim.TWEENANIM_FRAME_TIME = 16;
        return TweenAnim;
    }(egret.Tween));
    com_main.TweenAnim = TweenAnim;
})(com_main || (com_main = {}));

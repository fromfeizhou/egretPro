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
    var NumberRollAction = /** @class */ (function (_super_1) {
        __extends(NumberRollAction, _super_1);
        function NumberRollAction() {
            var _this = _super_1.call(this) || this;
            _this.isLife = false;
            return _this;
        }
        NumberRollAction.prototype.onDestroy = function () {
            this.m_pTarget = null;
            this.m_pFunFlag = null;
            _super_1.prototype.onDestroy.call(this);
        };
        NumberRollAction.prototype.roll = function (value, duration, listener, thisObject) {
            this.m_pFrameTime = 0;
            this.m_pTarget = thisObject;
            this.m_pRollValue = value;
            this.m_pSpeed = value / duration;
            this.m_pFunFlag = listener;
            this.isLife = true;
            this.m_pAllTime = duration;
        };
        NumberRollAction.prototype.onEnterFrame = function (delta) {
            this.m_pFrameTime += delta;
            var curVal = Utils.number2int(this.m_pSpeed * this.m_pFrameTime);
            if (this.m_pFrameTime >= this.m_pAllTime) {
                curVal = this.m_pRollValue;
                this.isLife = false;
            }
            this.m_pFunFlag.call(this.m_pTarget, curVal, this.m_pTarget);
        };
        return NumberRollAction;
    }(com_main.Animate));
    com_main.NumberRollAction = NumberRollAction;
})(com_main || (com_main = {}));

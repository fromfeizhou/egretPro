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
/**
 * 网络连接失败提示
 * AGame.R.app.netLevel
 */
var com_main;
(function (com_main) {
    var PromtDynamicTextWnd = /** @class */ (function (_super_1) {
        __extends(PromtDynamicTextWnd, _super_1);
        function PromtDynamicTextWnd() {
            var _this = _super_1.call(this, AGame.R.app.netLevel, "resource/skins/app/common/TextTipScroll.exml", UIAlignStyle.MiddleCenter, UIShowStyle.Normal, true, true) || this;
            _this.setMaskAlpha(0);
            _this.touchChildren = true;
            return _this;
        }
        PromtDynamicTextWnd.getInstance = function (check) {
            if (check === void 0) { check = false; }
            if (check)
                return PromtDynamicTextWnd._mInstance;
            if (PromtDynamicTextWnd._mInstance == null) {
                PromtDynamicTextWnd._mInstance = new PromtDynamicTextWnd();
            }
            return PromtDynamicTextWnd._mInstance;
        };
        PromtDynamicTextWnd.prototype.initialized = function () {
        };
        PromtDynamicTextWnd.prototype.showPromptWithTime = function (head, tail, limitTime) {
            _super_1.prototype.show.call(this);
            this.m_pHeadText = head;
            this.m_pTailText = tail;
            this.m_pLimitTime = limitTime;
            this.m_pTipsText.text = head + limitTime.toString() + tail;
            Utils.TimerManager.remove(this.updateText, this);
            Utils.TimerManager.doTimer(1000, limitTime, this.updateText, this);
        };
        PromtDynamicTextWnd.prototype.updateText = function () {
            this.m_pLimitTime--;
            if (this.m_pLimitTime > 0) {
                this.m_pTipsText.text = this.m_pHeadText + this.m_pLimitTime.toString() + this.m_pTailText;
            }
            else {
                this.hide();
            }
        };
        PromtDynamicTextWnd.prototype.onShow = function () {
            _super_1.prototype.onShow.call(this);
            PromtDynamicTextWnd.mIsShow = true;
        };
        PromtDynamicTextWnd.prototype.onHide = function () {
            PromtDynamicTextWnd.mIsShow = false;
            Utils.TimerManager.remove(this.updateText, this);
        };
        Object.defineProperty(PromtDynamicTextWnd.prototype, "isShow", {
            get: function () {
                return PromtDynamicTextWnd.mIsShow;
            },
            enumerable: true,
            configurable: true
        });
        PromtDynamicTextWnd.prototype.addEvent = function () {
            _super_1.prototype.addEvent.call(this);
        };
        PromtDynamicTextWnd.prototype.removeEvent = function () {
            _super_1.prototype.removeEvent.call(this);
            Utils.TimerManager.remove(this.updateText, this);
        };
        PromtDynamicTextWnd.prototype.onResize = function () {
            _super_1.prototype.onReSize.call(this);
        };
        PromtDynamicTextWnd.mIsShow = false;
        return PromtDynamicTextWnd;
    }(UIElement));
    com_main.PromtDynamicTextWnd = PromtDynamicTextWnd;
})(com_main || (com_main = {}));

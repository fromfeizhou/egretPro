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
    var LostConnectionTipsView = /** @class */ (function (_super_1) {
        __extends(LostConnectionTipsView, _super_1);
        // private _mIsShowCancel:boolean = true;
        function LostConnectionTipsView() {
            var _this = _super_1.call(this, AGame.R.app.netLevel, "resource/skins/app/common/PromptTipsWnd.exml", UIAlignStyle.MiddleCenter, UIShowStyle.Normal, true, true) || this;
            _this._mCallBackSure = null;
            _this._mCallBackCancel = null;
            _this._mThisObj = null;
            // this.skinName = ResManager.x2ComponentsName("PromptTipsWnd");
            //this.initMask(true);
            _this.touchChildren = true;
            _this.name = LostConnectionTipsView.NAME;
            _this.setMaskAlpha(0.8);
            return _this;
        }
        LostConnectionTipsView.getInstance = function (check) {
            if (check === void 0) { check = false; }
            if (check)
                return LostConnectionTipsView._mInstance;
            if (LostConnectionTipsView._mInstance == null) {
                LostConnectionTipsView._mInstance = new LostConnectionTipsView();
            }
            return LostConnectionTipsView._mInstance;
        };
        LostConnectionTipsView.prototype.initialized = function () {
            this.m_apopUp.setTitleLabel("提 示");
            this.m_apopUp.addCloseListener(this, function () { this.hide(); });
            this.m_apopUp.historyShow = false;
            this.m_pBtnSure.setTitleLabel("确定");
            this.m_pBtnCancel.setTitleLabel("取消");
        };
        /**
         * 没有按钮的提示
         */
        LostConnectionTipsView.prototype.showOnlyWords = function (text) {
            this.showPrompt(text);
            this.m_pBtnSure.visible = false;
            this.m_pBtnCancel.visible = false;
        };
        /**
         * 没有取消按钮的提示
         * @param text
         * @param callBackSure
         * @param thisObj
         */
        LostConnectionTipsView.prototype.showTip = function (text, callBackSure, thisObj) {
            if (callBackSure === void 0) { callBackSure = null; }
            if (thisObj === void 0) { thisObj = null; }
            this.showPrompt(text, callBackSure, thisObj, null, false);
        };
        LostConnectionTipsView.prototype.showPrompt = function (text, callBackSure, thisObj, callBackCancel, isShowBtnCancel, customLabel, pid) {
            if (callBackSure === void 0) { callBackSure = null; }
            if (thisObj === void 0) { thisObj = null; }
            if (callBackCancel === void 0) { callBackCancel = null; }
            if (isShowBtnCancel === void 0) { isShowBtnCancel = true; }
            if (customLabel === void 0) { customLabel = null; }
            if (pid === void 0) { pid = 0; }
            _super_1.prototype.show.call(this);
            this.m_pPromptId = pid;
            this.m_pTipsText.text = text;
            this._mCallBackSure = callBackSure;
            this._mCallBackCancel = callBackCancel;
            this._mThisObj = thisObj;
            this.m_pBtnCancel.visible = true;
            // this.m_pPromptClose.visible = false;
        };
        LostConnectionTipsView.prototype.onBtnSure = function () {
            this.hide();
            if (this._mCallBackSure)
                this._mCallBackSure.apply(this._mThisObj);
        };
        LostConnectionTipsView.prototype.onBtnCancel = function () {
            this.hide();
            if (this._mCallBackCancel)
                this._mCallBackCancel.apply(this._mThisObj);
        };
        LostConnectionTipsView.prototype.clearPrompt = function () {
            if (this.m_pPromptId && this._mIsShow) {
                this.m_pPromptId = 0;
                this.hide();
            }
        };
        LostConnectionTipsView.prototype.onBtnClose = function () {
            this.hide();
        };
        LostConnectionTipsView.prototype.onShow = function () {
            _super_1.prototype.onShow.call(this);
            this.m_pBtnSure.visible = true;
            this.m_pBtnCancel.visible = true;
        };
        LostConnectionTipsView.prototype.onHide = function () {
        };
        LostConnectionTipsView.prototype.addEvent = function () {
            _super_1.prototype.addEvent.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnSure, this, this.onBtnSure);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnCancel, this, this.onBtnCancel);
            // EventManager.addTouchScaleListener(this.m_pPromptClose, this, this.onBtnClose);
        };
        LostConnectionTipsView.prototype.removeEvent = function () {
            _super_1.prototype.removeEvent.call(this);
            com_main.EventManager.getInstance().removeEventListener(this.m_pBtnSure);
            com_main.EventManager.getInstance().removeEventListener(this.m_pBtnCancel);
            // EventManager.getInstance().removeEventListener(this.m_pPromptClose);
        };
        LostConnectionTipsView.NAME = 'LostConnectionTipsView';
        return LostConnectionTipsView;
    }(UIElement));
    com_main.LostConnectionTipsView = LostConnectionTipsView;
})(com_main || (com_main = {}));

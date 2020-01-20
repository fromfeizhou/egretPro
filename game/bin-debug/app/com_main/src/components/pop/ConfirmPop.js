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
    /**确认弹窗 */
    var ConfirmPop = /** @class */ (function (_super_1) {
        __extends(ConfirmPop, _super_1);
        function ConfirmPop() {
            var _this = _super_1.call(this) || this;
            _this.m_richText = null; //富文本
            _this.name = ConfirmPop.NAME;
            _this.initCom("Pop/pop_confirm.exml");
            return _this;
        }
        ConfirmPop.getInstance = function () {
            if (ConfirmPop.instance == null) {
                ConfirmPop.instance = new ConfirmPop();
            }
            return ConfirmPop.instance;
        };
        ConfirmPop.prototype.onDestroy = function () {
            //不执行父类 移除事件方法
        };
        ConfirmPop.prototype.$onRemoveFromStage = function () {
            if (this.m_richText) {
                Utils.removeFromParent(this.m_richText);
                this.m_richText = null;
            }
            this.resetData();
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        ConfirmPop.prototype.show = function (tips, state, noticeType, confirm, cancel, thisArg) {
            if (state === void 0) { state = 'style1'; }
            this.m_callbackConfirm = confirm;
            this.m_callbackCancel = cancel;
            this.m_thisArg = thisArg;
            this.m_sTips = tips;
            this.m_noticeType = noticeType;
            if (state) {
                this.currentState = state;
                this.commitProperties();
            }
            this.m_APopUp.initEvent();
            //富文本初始化
            this.m_richText = new com_main.CCRichText(this.m_labTips);
            this.m_richText.imageScale = 1;
            this.m_groupTips.addChild(this.m_richText);
            this.m_richText.lineSpacing = 10;
            this.m_richText.textAlign = true;
            this.m_richText.text = this.m_sTips;
            com_main.UpManager.popSmallView(this, null, false, 0.8);
        };
        ConfirmPop.prototype.resetData = function () {
            this.m_sTips = null;
            this.m_callbackCancel = null;
            this.m_callbackConfirm = null;
            this.m_thisArg = null;
        };
        ConfirmPop.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel('提 示');
            this.m_btnConfirm.setTitleLabel('确定');
            this.m_btnCancel.setTitleLabel('取消');
            this.m_btnCancel["sound_cancel"] = SoundData.getCancelSound();
            this.m_checkBox.selected = false;
            com_main.EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onConfirmClick);
            com_main.EventManager.addTouchScaleListener(this.m_btnCancel, this, this.onCancelClick);
        };
        ConfirmPop.prototype.onConfirmClick = function () {
            var func = this.m_callbackConfirm;
            var obj = this.m_thisArg;
            if (this.m_checkBox.selected && this.m_noticeType) {
                LocalModel.recordNotice(this.m_noticeType, this.m_checkBox.selected);
            }
            com_main.UpManager.history.call(this);
            if (func && obj) {
                func.call(obj);
            }
        };
        ConfirmPop.prototype.onCancelClick = function () {
            // if (this.m_callbackCancel && this.m_thisArg) {
            // 	this.m_callbackCancel.call(this.m_thisArg);
            // }
            com_main.UpManager.history.call(this);
        };
        ConfirmPop.NAME = "ConfirmPop";
        ConfirmPop.instance = null;
        return ConfirmPop;
    }(com_main.CView));
    com_main.ConfirmPop = ConfirmPop;
})(com_main || (com_main = {}));

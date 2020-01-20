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
    var EqDeCompSureWnd = /** @class */ (function (_super_1) {
        __extends(EqDeCompSureWnd, _super_1);
        function EqDeCompSureWnd(tips, items, confirm, thisArg) {
            var _this = _super_1.call(this) || this;
            _this.name = EqDeCompSureWnd.NAME;
            _this.m_callbackConfirm = confirm;
            _this.m_thisArg = thisArg;
            _this.m_sTips = tips;
            _this.m_tItems = items;
            _this.initApp("equip/EqDeCompSureWndSkin.exml");
            return _this;
        }
        EqDeCompSureWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EqDeCompSureWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.RECOVER));
            this.m_btnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            this.m_labTips.textFlow = Utils.htmlParser(this.m_sTips);
            for (var i = 0; i < this.m_tItems.length; i++) {
                var info = this.m_tItems[i];
                var itemView = com_main.ComItemNew.create('count');
                itemView.setItemInfo(info.itemId, info.count);
                this.m_pRewardItems.addChild(itemView);
            }
            com_main.EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onConfirmClick);
        };
        EqDeCompSureWnd.prototype.onConfirmClick = function () {
            if (this.m_callbackConfirm && this.m_thisArg) {
                this.m_callbackConfirm.call(this.m_thisArg);
            }
            com_main.UpManager.history();
        };
        EqDeCompSureWnd.NAME = "EqDeCompSureWnd";
        return EqDeCompSureWnd;
    }(com_main.CView));
    com_main.EqDeCompSureWnd = EqDeCompSureWnd;
})(com_main || (com_main = {}));

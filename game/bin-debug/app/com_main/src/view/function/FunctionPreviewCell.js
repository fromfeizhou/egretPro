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
     * 功能预览
     * @exportFunctionPreviewCell
     * @class
     * @extends eui.ItemRenderer
     */
    var FunctionPreviewCell = /** @class */ (function (_super_1) {
        __extends(FunctionPreviewCell, _super_1);
        function FunctionPreviewCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/function/FunctionPreviewCellSkin.exml");
            com_main.EventManager.addTouchScaleListener(_this.m_pBtn, _this, _this.onClickTurn);
            return _this;
        }
        FunctionPreviewCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        FunctionPreviewCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        FunctionPreviewCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**跳转前往 */
        FunctionPreviewCell.prototype.onClickTurn = function () {
            FunctionModel.funcToPanel(this.m_tData.turnPanel);
        };
        FunctionPreviewCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            var isOpen = FunctionModel.isFunctionOpen(this.m_tData.id);
            this.m_pLbName.text = this.m_tData.name;
            this.m_pIco.source = FunctionModel.getBtnSource(this.m_tData.id);
            this.m_pLbContent.textFlow = (new egret.HtmlTextParser).parser(GLan(this.m_tData.text));
            this.m_pOpenLev.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.m_tData.openLevel);
            this.m_pOpenLev.visible = !isOpen;
            this.m_pBtnGo.visible = this.m_tData.turnPanel != 0;
            if (isOpen) {
                this.m_pBtn.enabled = true;
                this.m_pBtn.setTitleLabel(GCodeFromat(CLEnum.GO_TO));
                Utils.isGray(false, this.m_pBtn);
            }
            else {
                this.m_pBtn.enabled = false;
                this.m_pBtn.setTitleLabel(GCodeFromat(CLEnum.FUNC_UNOPEN));
                Utils.isGray(true, this.m_pBtn);
            }
        };
        return FunctionPreviewCell;
    }(eui.ItemRenderer));
    com_main.FunctionPreviewCell = FunctionPreviewCell;
})(com_main || (com_main = {}));

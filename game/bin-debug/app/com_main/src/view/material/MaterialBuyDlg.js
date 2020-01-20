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
    var MaterialBuyDlg = /** @class */ (function (_super_1) {
        __extends(MaterialBuyDlg, _super_1);
        function MaterialBuyDlg(data) {
            var _this = _super_1.call(this) || this;
            _this.m_valueCount = 0;
            _this.name = MaterialBuyDlg.NAME;
            _this.m_tData = data;
            _this.initApp("material/MaterialBuyDlgSkin.exml");
            return _this;
        }
        MaterialBuyDlg.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickBuy);
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onChangSlider, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.BUY));
            this.m_comCostTextButton.setCostImg(RoleData.GetMaterialIconPathById(this.m_tData.itemId));
            this.m_tData.itemId == 18 ? this.m_comCostTextButton.setCostImgScale(0.8) : this.m_comCostTextButton.setCostImgScale(1.0);
            this.initCount();
            this.upDateValue(1);
        };
        /**初始化购买次数 */
        MaterialBuyDlg.prototype.initCount = function () {
            this.m_slider.maximum = this.m_tData.maxNum;
            this.m_itemNum.text = this.m_tData.maxNum.toString();
            this.m_slider.minimum = 1;
        };
        MaterialBuyDlg.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**确认购买 */
        MaterialBuyDlg.prototype.onClickBuy = function () {
            if (this.m_valueCount == 0) {
                EffectUtils.showTips(GCode(CLEnum.BUY_NUM_FAL), 1, true);
            }
            else {
                if (PropModel.isItemEnough(this.m_tData.itemId, this.m_tData.price * this.m_valueCount, 2)) {
                    MaterialProxy.C2S_MATERIAL_BUY(this.m_tData.type, this.m_valueCount);
                    com_main.UpManager.history();
                }
            }
        };
        MaterialBuyDlg.prototype.onChangSlider = function (event) {
            var values = event.currentTarget.value;
            var curvalue = Math.floor(values);
            if (curvalue == 0) {
                curvalue = 1;
            }
            if (curvalue > this.m_tData.maxNum) {
                curvalue = this.m_tData.maxNum;
            }
            this.upDateValue(curvalue);
        };
        /**
         * --
         */
        MaterialBuyDlg.prototype.onClickSub = function () {
            this.m_valueCount--;
            if (this.m_valueCount < 1) {
                this.m_valueCount = 1;
                return;
            }
            this.upDateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        };
        /**
         * ++
         */
        MaterialBuyDlg.prototype.onClickAdd = function () {
            this.m_valueCount++;
            if (this.m_valueCount > this.m_tData.maxNum) {
                this.m_valueCount = this.m_tData.maxNum;
                return;
            }
            this.upDateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        };
        MaterialBuyDlg.prototype.upDateValue = function (value) {
            this.m_valueCount = value;
            this.m_itemSelectNum.text = value + '/' + this.m_tData.maxNum;
            this.m_comCostTextButton.setCostLabel("" + value * this.m_tData.price);
        };
        MaterialBuyDlg.NAME = 'MaterialBuyDlg';
        return MaterialBuyDlg;
    }(com_main.CView));
    com_main.MaterialBuyDlg = MaterialBuyDlg;
})(com_main || (com_main = {}));

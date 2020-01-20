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
     * 联盟面板相关
     */
    var ShopBuyDlg = /** @class */ (function (_super_1) {
        __extends(ShopBuyDlg, _super_1);
        function ShopBuyDlg(data) {
            var _this = _super_1.call(this) || this;
            _this.m_stockNum = 0; //库存
            _this.m_valueCount = 0; //当前的1/10  之1
            _this.m_data = null;
            _this.name = ShopBuyDlg.NAME;
            _this.m_data = data;
            _this.initApp("shop/ShopBuyDlgSkin.exml");
            return _this;
        }
        ShopBuyDlg.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        ShopBuyDlg.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.TAVERN_ATTRACT: {
                    break;
                }
            }
        };
        ShopBuyDlg.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickBuy);
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.BUY));
            this.m_stockNum = this.m_data.info.stock;
            this.m_slider.maximum = this.m_data.info.stock;
            this.m_slider.minimum = 1;
            this.m_consume = Utils.parseCommonItemServSingle(this.m_data.info.coumses);
            this.ShowDetails(this.m_data.info.itemId);
        };
        ShopBuyDlg.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ShopBuyDlg.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**确认购买 */
        ShopBuyDlg.prototype.onClickBuy = function () {
            if (this.m_valueCount == 0) {
                EffectUtils.showTips(GCode(CLEnum.BUY_NUM_FAL), 1, true);
            }
            else {
                var str = this.m_comCostTextButton.getCostLabel();
                str = RoleData.getTipsisbeyond(this.m_consume.itemId, Number(str));
                if (str == "") {
                    if (this.m_data.activityId > 0) {
                        ShopProxy.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY(this.m_data.activityId, this.m_data.info.id, this.m_valueCount);
                    }
                    else {
                        ShopProxy.send_MERCHANT_BUY_GOODS(this.m_data.storeId, this.m_data.info.id, this.m_valueCount);
                    }
                }
                else {
                    EffectUtils.showTips(str, 1, true);
                }
                com_main.UpManager.history();
            }
        };
        ShopBuyDlg.prototype.ShowDetails = function (id) {
            var cfg = PropModel.getCfg(id);
            Utils.setPropLabName(id, this.m_ItemName);
            this.m_Description.text = cfg.description;
            // this.m_ItemNum.text = this.m_data.stock;
            this.m_ItemNum.text = PropModel.getPropNum(id).toString();
            // this.m_ComItem.itemId = id;
            this.m_ComItem.setItemInfo(id);
            // Utils.TimerManager.doTimer(100,1,()=>{
            this.updateValue(1);
            // },this);
        };
        ShopBuyDlg.prototype.onchangSlider = function (event) {
            var values = event.currentTarget.value;
            var curvalue = Math.floor(values);
            if (curvalue == 0) {
                curvalue = 1;
            }
            this.updateValue(curvalue);
        };
        /**
         * --
         */
        ShopBuyDlg.prototype.onClickSub = function () {
            this.m_valueCount--;
            if (this.m_valueCount < 1) {
                this.m_valueCount = 1;
                return;
            }
            this.updateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        };
        /**
         * ++
         */
        ShopBuyDlg.prototype.onClickAdd = function () {
            this.m_valueCount++;
            if (this.m_valueCount > this.m_stockNum) {
                this.m_valueCount = this.m_stockNum;
                return;
            }
            this.updateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        };
        ShopBuyDlg.prototype.updateValue = function (value) {
            this.m_valueCount = value;
            this.m_ItemSelectNum.text = value + '/' + this.m_stockNum;
            this.m_comCostTextButton.setCostLabel(Math.ceil((value * this.m_consume.count * this.m_data.info.discount / 100)).toString());
            this.m_comCostTextButton.setCostImg(RoleData.GetMaterialIconPathById(this.m_consume.itemId));
            this.m_consume.itemId == 18 ? this.m_comCostTextButton.setCostImgScale(0.8) : this.m_comCostTextButton.setCostImgScale(1.0);
        };
        ShopBuyDlg.NAME = 'ShopBuyDlg';
        return ShopBuyDlg;
    }(com_main.CView));
    com_main.ShopBuyDlg = ShopBuyDlg;
})(com_main || (com_main = {}));

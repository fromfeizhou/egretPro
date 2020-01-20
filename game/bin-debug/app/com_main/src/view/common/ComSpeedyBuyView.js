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
    var ComSpeedyBuyView = /** @class */ (function (_super_1) {
        __extends(ComSpeedyBuyView, _super_1);
        /**便捷购买通用界面 */
        function ComSpeedyBuyView(parem) {
            var _this = _super_1.call(this) || this;
            _this.m_valueCount = 0; //当前的1/10 
            _this.m_unitPrice = 0; //单价
            _this.m_goldId = 0; //购买消耗的id
            _this.m_itemId = 0; //购买的物品id
            _this.m_buyTpye = 0; //购买梯度  0为1手
            _this.m_canBuyNum = 0; //可购买数量
            _this.m_stockNum = 0; //配置表总的购买数量
            _this.ifShow = false; //界面显示
            _this.name = ComSpeedyBuyView.NAME;
            _this.initApp("common/ComSpeedyBuyViewSkin.exml");
            _this.m_itemId = parem.goodsId;
            _this.m_buyTpye = parem.priceIndex;
            _this.m_canBuyNum = parem.canButCount;
            _this.ifShow = true;
            return _this;
        }
        ComSpeedyBuyView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS,
                ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS,
            ];
        };
        /**处理协议号事件 */
        ComSpeedyBuyView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS: { //购买返回
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS(this.m_itemId);
                    break;
                }
                case ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS: { //界面信息
                    var data = body;
                    this.m_canBuyNum = data.canButCount;
                    this.refrech(data);
                    break;
                }
            }
        };
        ComSpeedyBuyView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ComSpeedyBuyView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.ifShow = false;
            this.removeEvent();
        };
        ComSpeedyBuyView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (!PropModel.getCfg(this.m_itemId))
                return;
            this.m_APopUp.setTitleLabel(GLan(PropModel.getCfg(this.m_itemId).name) + GCode(CLEnum.SOURCE));
            this.m_APopUp.setBottomBorder();
            this.m_ComItem.openTips = false;
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_groupRender.dataProvider = this.m_pCollection;
            this.m_groupRender.itemRenderer = ComSpeedyBuyRender;
            this.addEvent();
            this.getCfgSourePrice(this.m_itemId, this.m_buyTpye, this.m_canBuyNum);
            this.initPanel();
        };
        /**监听事件 */
        ComSpeedyBuyView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickBuy);
            com_main.EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            com_main.EventManager.addTouchScaleListener(this.m_pLessTen, this, this.onLessHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pLessOne, this, this.onLessHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pAddTen, this, this.onAddHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pAddOne, this, this.onAddHandler);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            this.m_labBuyCount.addEventListener(egret.Event.CHANGE, this.initScroller, this);
        };
        /**移除事件 */
        ComSpeedyBuyView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            this.m_slider.removeEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            this.m_labBuyCount.removeEventListener(egret.Event.CHANGE, this.initScroller, this);
        };
        //----------------------------------------------------------------------------------------------------------------------------------------------------------- 
        ComSpeedyBuyView.prototype.onLessHandler = function (event) {
            var param = event.currentTarget;
            switch (param) {
                case this.m_pLessTen: {
                    this.onClickLessTen(10);
                    break;
                }
                case this.m_pLessOne: {
                    this.onClickLessTen(1);
                    break;
                }
            }
        };
        ComSpeedyBuyView.prototype.onAddHandler = function (event) {
            var param = event.currentTarget;
            switch (param) {
                case this.m_pAddTen: {
                    this.onClickAddTen(10);
                    break;
                }
                case this.m_pAddOne: {
                    this.onClickAddTen(1);
                    break;
                }
            }
        };
        /**增加1或10 */
        ComSpeedyBuyView.prototype.onClickLessTen = function (num) {
            this.m_valueCount -= this.m_unitPrice * num;
            if (this.m_valueCount < this.m_unitPrice) {
                this.m_valueCount = this.m_unitPrice;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
        };
        /**减少1或10 */
        ComSpeedyBuyView.prototype.onClickAddTen = function (num) {
            this.m_valueCount += this.m_unitPrice * num;
            if (this.m_valueCount < this.m_unitPrice) {
                this.m_valueCount = this.m_unitPrice;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
        };
        //输入购买数量
        ComSpeedyBuyView.prototype.initScroller = function () {
            var num = Number(this.getBLen(this.m_labBuyCount.text));
            // if(num<=0)num=1;
            this.m_labBuyCount.text = num + '';
            this.m_labBuyCount.restrict = "0-9";
            this.updateValue(num, this.m_canBuyNum);
        };
        ComSpeedyBuyView.prototype.getBLen = function (str) {
            if (str == null)
                return 1;
            if (typeof str != "string") {
                str += "";
            }
            return str.slice(0, 5);
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------------      
        /**确认购买 */
        ComSpeedyBuyView.prototype.onClickBuy = function () {
            if (this.m_valueCount == 0) {
                EffectUtils.showTips(GCode(CLEnum.BUY_NUM_FAL), 1, true);
            }
            else {
                var str = this.m_comCostTextButton.getCostLabel();
                str = RoleData.getTipsisbeyond(this.m_goldId, Number(str));
                if (str == "") {
                    QuickBuyProxy.C2S_QUCKLY_SHOP_BUY_GOODS(this.m_itemId, this.m_valueCount);
                }
                else {
                    EffectUtils.showTips(str, 1, true);
                    if (this.m_goldId == PropEnum.GOLD)
                        PropModel.goldLessToCharge(true);
                }
            }
        };
        ComSpeedyBuyView.prototype.onchangSlider = function (event) {
            var values = event.currentTarget.value;
            var curvalue = Math.floor(values);
            if (curvalue == 0) {
                curvalue = 1;
            }
            this.updateValue(curvalue * this.m_unitPrice, this.m_canBuyNum);
        };
        /**
      * --
      */
        ComSpeedyBuyView.prototype.onClickSub = function () {
            this.m_valueCount -= this.m_unitPrice;
            if (this.m_valueCount < this.m_unitPrice) {
                this.m_valueCount = this.m_unitPrice;
                return;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
            this.m_slider.value = Math.floor(this.m_valueCount / this.m_unitPrice);
        };
        /**
         * ++
         */
        ComSpeedyBuyView.prototype.onClickAdd = function () {
            this.m_valueCount += this.m_unitPrice;
            if (this.m_valueCount > this.m_canBuyNum) {
                this.m_valueCount = this.m_canBuyNum;
                return;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
            this.m_slider.value = Math.floor(this.m_valueCount / this.m_unitPrice);
        };
        ComSpeedyBuyView.prototype.updateValue = function (value, canBuyNum) {
            this.m_valueCount = value;
            var currGlod = CommonUtils.numOutLenght(value);
            var allGlod = CommonUtils.numOutLenght(canBuyNum);
            this.m_ItemSelectNum.text = currGlod + "";
            this.m_labBuyCount.text = currGlod + "";
            var price = this.setPrice();
            this.m_comCostTextButton.setCostLabel("" + price); //所需要的元宝
            this.m_comCostTextButton.setCostImg(RoleData.GetMaterialIconPathById(this.m_goldId));
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.BUY));
        };
        /**设置按钮金额 */
        ComSpeedyBuyView.prototype.setPrice = function () {
            var moreThanGold = 0;
            var lessThan = 0;
            var changeNum = this.m_valueCount;
            for (var i = 0; i < this.m_date.length; i++) {
                var residue = this.m_stockNum - this.m_canBuyNum; //总的量减去可购买的量
                if ((changeNum - residue) >= this.m_date[i][4]) { //购买的数量大于第1梯度总数量，计算购买第1梯度总数量的金额
                    moreThanGold += this.m_date[i][4] / this.m_date[i][0] * this.m_date[i][3];
                    changeNum = changeNum - this.m_date[i][4];
                }
                else {
                    if (changeNum > 0) {
                        lessThan = changeNum / this.m_date[i][0] * this.m_date[i][3];
                        changeNum = 0;
                    }
                }
            }
            return moreThanGold + lessThan;
        };
        /**刷新面板 */
        ComSpeedyBuyView.prototype.initPanel = function () {
            this.m_ComItem.itemId = this.m_itemId;
            // Utils.setPropLabName(this.m_itemId, this.m_labName);
            var itemConfig = PropModel.getCfg(this.m_itemId);
            if (itemConfig.id == PropEnum.FOOD || itemConfig.id == PropEnum.WOOD || itemConfig.id == PropEnum.IRON || itemConfig.id == PropEnum.SILVER) {
                this.currentState = 'resource';
            }
            else {
                this.currentState = 'ten';
            }
            this.m_labBuyNum.text = CommonUtils.numOutLenght(this.m_unitPrice);
            this.m_labName.text = GCode(CLEnum.SOURCE_PATH);
            this.refreshItemNum();
            this.m_ItemName.text = GLanFormat(itemConfig.name);
            this.m_Description.text = itemConfig.description;
            var sourceList = [];
            var sourceids = itemConfig.sourcePage.split(",");
            for (var i = 0; i < sourceids.length; i++) {
                var sourceId = Number(sourceids[i]);
                if (sourceId > 0) {
                    var data = { id: sourceId };
                    sourceList.push(data);
                }
            }
            this.m_pCollection.replaceAll(sourceList);
            this.updateValue(this.m_unitPrice, this.m_canBuyNum);
        };
        /**物品数量变化 */
        ComSpeedyBuyView.prototype.onPropItemChange = function (itemId) {
            if (itemId == this.m_itemId && this.ifShow) {
                this.refreshItemNum();
            }
        };
        /**刷新数量 */
        ComSpeedyBuyView.prototype.refreshItemNum = function () {
            var itemCfg = C.ItemConfig[this.m_itemId];
            var isResource = itemCfg.type == PropType.RESOURCE; //是否是资源
            var itemNum = 0;
            if (itemCfg) {
                if (isResource) {
                    itemNum = RoleData.GetMaterialNumById(this.m_itemId);
                }
                else {
                    itemNum = PropModel.getPropNum(this.m_itemId);
                }
            }
            this.m_ItemNum.text = itemNum.toString();
        };
        /**根据梯度取对应数据 */
        ComSpeedyBuyView.prototype.getCfgSourePrice = function (goodId, buyType, canBuyNum) {
            this.m_date = NormalModel.setQuickBuyCfg(goodId);
            var allCount = 0;
            for (var i = 0; i < this.m_date.length; i++) {
                allCount += this.m_date[i][4];
            }
            this.m_unitPrice = this.m_date[buyType][0]; //单价
            this.m_goldId = this.m_date[buyType][2]; //消耗的物品Id
            this.m_stockNum = allCount; //总数
            this.m_labFullTip.visible = canBuyNum > 0 ? false : true;
            this.m_pComRoot.visible = canBuyNum > 0 ? true : false;
            this.m_slider.maximum = Math.floor(canBuyNum / this.m_unitPrice);
            this.m_slider.minimum = 1;
        };
        /**购买刷新*/
        ComSpeedyBuyView.prototype.refrech = function (data) {
            this.getCfgSourePrice(data.goodsId, data.priceIndex, data.canButCount);
            this.onPropItemChange(data.goodsId);
            this.updateValue(this.m_unitPrice, data.canButCount);
        };
        ComSpeedyBuyView.NAME = "ComSpeedyBuyView";
        return ComSpeedyBuyView;
    }(com_main.CView));
    com_main.ComSpeedyBuyView = ComSpeedyBuyView;
    /**
    * @extends eui.ItemRenderer
    */
    var ComSpeedyBuyRender = /** @class */ (function (_super_1) {
        __extends(ComSpeedyBuyRender, _super_1);
        function ComSpeedyBuyRender() {
            return _super_1.call(this) || this;
        }
        ComSpeedyBuyRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ComSpeedyBuyRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_sourItem = new com_main.ItemSourceViewRender();
            this.addChild(this.m_sourItem);
        };
        ComSpeedyBuyRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_sourItem.setItemId(this.m_tData.id);
        };
        return ComSpeedyBuyRender;
    }(eui.ItemRenderer));
    com_main.ComSpeedyBuyRender = ComSpeedyBuyRender;
})(com_main || (com_main = {}));

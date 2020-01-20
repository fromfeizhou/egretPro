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
    var GiftBagItem = /** @class */ (function (_super_1) {
        __extends(GiftBagItem, _super_1);
        function GiftBagItem(param) {
            var _this = _super_1.call(this) || this;
            _this.name = GiftBagItem.NAME;
            _this.giftId = param.giftBagId;
            _this.giftState = param.giftBagStatus;
            _this.giftTime = param.getCountDown();
            _this.giftVo = param;
            _this.initApp("activity/giftBag/GiftBagItemSkin.exml");
            return _this;
        }
        GiftBagItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        GiftBagItem.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        GiftBagItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        GiftBagItem.prototype.initView = function () {
            if (this.bInit)
                return;
            this.addEvent();
            this.m_labTime.text = this.getCountDown();
            this.InitShowItem();
            this.onRefreshImg();
            this.onRefreshImgPic();
            this.bInit = true;
            window["ta"].track('GiftWnd', { giftId: this.giftId, 'trigger_time': new Date() });
        };
        /**显示物品 */
        GiftBagItem.prototype.InitShowItem = function () {
            this.m_groupAward.removeChildren();
            var arwardList = Utils.parseCommonItemServ(this.giftVo.rechargeConfig.reward);
            for (var i = 0; i < arwardList.length; i++) {
                var itemView = com_main.ComItemNew.create("count");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_groupAward.addChild(itemView);
            }
            this.m_labGen.text = this.giftVo.rechargeConfig.description;
            this.refreshBtn();
        };
        /**设置宽高 */
        GiftBagItem.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pRoot);
        };
        /**倒计时回调 */
        GiftBagItem.prototype.timeCall = function () {
            if (this.giftTime < 0)
                return;
            this.giftTime--;
            this.giftTime = Math.max(0, this.giftTime);
            this.m_labTime.text = this.getCountDown();
        };
        /**刷新形象 */
        GiftBagItem.prototype.onRefreshImg = function () {
            var source;
            if (this.giftVo.giftBagType == GiftItemEnum.redGen) {
                source = Utils.getPlayerBigHeadSource(1, this.giftVo.condition.toString());
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.roleLv) {
                source = Utils.getPlayerBigHeadSource(RoleData.headType, RoleData.headId.toString());
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.genUpLv || this.giftVo.giftBagType == GiftItemEnum.genTupo) {
                source = Utils.getPlayerBigHeadSource(1, this.giftVo.condition.toString());
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.haveGenGm) {
                source = Utils.getPlayerBigHeadSource(1, this.giftVo.condition.toString());
            }
            else {
                source = Utils.getPlayerBigHeadSource(RoleData.headType, RoleData.headId.toString());
            }
            this.m_imgRole.source = source;
        };
        /**刷新美术字显示 */
        GiftBagItem.prototype.onRefreshImgPic = function () {
            var source;
            if (this.giftVo.giftBagType == GiftItemEnum.redGen) {
                source = 'lb_hjzslb_png';
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.roleLv) {
                source = 'lb_jzdjlb_png';
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.genTupo) {
                source = 'lb_wjtplb_png';
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.roleVipGm) {
                source = 'lb_gzlb_png';
            }
            else if (this.giftVo.giftBagType == GiftItemEnum.genUpLv) {
                source = 'lb_wjdjlb_png';
            }
            else {
                source = 'lb_qylb_png';
            }
            this.m_imgPic.source = source;
        };
        /**刷新显示 */
        GiftBagItem.prototype.refreshView = function () {
            this.refreshBtn();
        };
        /**按钮显示 */
        GiftBagItem.prototype.refreshBtn = function () {
            if (GiftBagModel.getButtonState(this.giftId) == 1) {
                this.m_btnBuy.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.setbtnInfo(true);
            }
            else {
                this.m_btnBuy.cost = this.giftVo.rechargeConfig.price;
                this.setbtnInfo(false);
            }
            // let prices = this.giftVo.rechargeConfig.price;
            // let sources = GiftBagModel.getButtonState(this.giftId) == 1 ? '': PropModel.getPropIcon(prices[0].key);
            // let str = GiftBagModel.getButtonState(this.giftId) == 1 ? GCode(CLEnum.TAKE_OUT) : '' + prices[0].value;
            // this.m_btnBuy.setCostLabel(str);
            // this.m_btnBuy.setCostImg(sources);
        };
        /**设置按钮位置显示 */
        GiftBagItem.prototype.setbtnInfo = function (boo) {
            if (boo) {
                this.m_payRoot.x = 258;
                this.m_goldRoot.visible = false;
            }
            else {
                this.m_payRoot.x = VipModel.isHVipGoldDis() ? 107 : 258;
                this.m_goldRoot.visible = VipModel.isHVipGoldDis();
                var price = VipModel.getHVipGoldBuyPrice(this.giftVo.rechargeConfig.price);
                this.m_btnVipBuy.setCostLabel(price.toString());
                this.m_labTip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HEIGHT_VIP_BUY, VipModel.getHVipGoldLv()));
            }
        };
        /**刷新列表数据 */
        GiftBagItem.prototype.refresh = function () {
        };
        /**人民币购买 */
        GiftBagItem.prototype.OnClickHander = function () {
            if (GiftBagModel.getButtonState(this.giftId) == 0) {
                PayProxy.C2S_RECHARGE(this.giftId, this.giftVo.rechargeConfig.price);
            }
            else {
                GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_AWARD(this.giftId);
            }
        };
        /**vip10购买 */
        GiftBagItem.prototype.OnGoldBuyBtn = function (e) {
            var price = VipModel.getHVipGoldBuyPrice(this.giftVo.rechargeConfig.price);
            if (VipModel.canHVipBuy(price)) {
                PayProxy.C2S_GOLD_BUY(this.giftId);
            }
        };
        GiftBagItem.prototype.getCountDown = function () {
            return Utils.DateUtils.getCountDownStrBySecond(this.giftTime);
        };
        GiftBagItem.prototype.getLeftTime = function () {
            return this.giftTime;
        };
        GiftBagItem.prototype.getTitle = function () {
            return this.giftVo.rechargeConfig.name;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        GiftBagItem.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnBuy, this, this.OnClickHander);
            com_main.EventManager.addTouchScaleListener(this.m_btnVipBuy, this, this.OnGoldBuyBtn);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.refreshView, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this.onGiftBagUpdate, this);
        };
        /**移除事件 */
        GiftBagItem.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
        };
        GiftBagItem.prototype.onGiftBagUpdate = function (id) {
            if (id == this.giftId) {
                this.refreshView();
            }
        };
        GiftBagItem.NAME = 'GiftBagItem';
        return GiftBagItem;
    }(com_main.CView));
    com_main.GiftBagItem = GiftBagItem;
})(com_main || (com_main = {}));

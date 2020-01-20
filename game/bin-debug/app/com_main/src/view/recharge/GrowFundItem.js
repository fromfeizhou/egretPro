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
    var GrowFundItem = /** @class */ (function (_super_1) {
        __extends(GrowFundItem, _super_1);
        function GrowFundItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/pay/PayShopAwardItemSkin.exml");
            return _this;
        }
        GrowFundItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_pBtnGet);
        };
        GrowFundItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //初始化
        GrowFundItem.prototype.init = function (data) {
            this.m_id = data.id;
            this.m_reward = data.reward;
            this.m_num = data.num;
            this.m_desc = data.desc;
            this.vo = data.vo;
            this.refreshBtnView();
            this.refreshView();
        };
        GrowFundItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = GrowFundItemRender;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
            // this.refreshView();
        };
        /**刷新界面 */
        GrowFundItem.prototype.refreshView = function () {
            if (this.m_reward) {
                var res = [];
                for (var i = 0; i < this.m_reward.length; i++) {
                    res.push(IItemInfoPool.create(this.m_reward[i].itemId, this.m_reward[i].count));
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_labTip.text = GCode(CLEnum.GEN_ROLE_LEVEL);
            this.m_pLbGold.x = this.m_labTip.x + this.m_labTip.width;
            this.m_pLbGold.text = this.m_num.toString();
            this.m_labtxt.text = GCode(CLEnum.GEN_LEVEL1);
            this.m_labtxt.x = this.m_pLbGold.x + this.m_pLbGold.width;
        };
        /**刷新按钮显示 */
        GrowFundItem.prototype.refreshBtnView = function () {
            var planStr = "<font color=#abb7d1>" + GCode(CLEnum.AC_PROGRESS) + "</font>";
            var vo = this.vo;
            this.m_status = vo.getGrowFundBtnRed(this.m_num, this.m_id);
            this.m_percentNum = this.m_status == ActivityStatus.FINISH ? planStr + GCode(CLEnum.AC_FINISH) : planStr + RoleData.level + "/" + this.m_num;
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH ? true : false;
            this.m_pAwardState.visible = this.m_status == ActivityStatus.REWARD ? true : false;
            this.m_pPlanRoot.visible = this.m_status == ActivityStatus.REWARD ? false : true;
            this.m_pLbPercent.text = '';
            this.m_pBtnGet.y = 64;
            Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_pBtnGet);
            this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
            this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
        };
        /**领取奖励 */
        GrowFundItem.prototype.onBtnGetHandler = function (e) {
            if (!this.vo.buyGrowthFund) {
                var cfg = this.vo.getRechargeCfg();
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
                return;
            }
            ActivityProxy.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD(this.vo.id, this.m_id);
        };
        return GrowFundItem;
    }(com_main.CComponent));
    com_main.GrowFundItem = GrowFundItem;
    var GrowFundItemRender = /** @class */ (function (_super_1) {
        __extends(GrowFundItemRender, _super_1);
        function GrowFundItemRender() {
            return _super_1.call(this) || this;
        }
        GrowFundItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GrowFundItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('name_num');
            this.addChild(this.m_item);
        };
        GrowFundItemRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        };
        return GrowFundItemRender;
    }(eui.ItemRenderer));
    com_main.GrowFundItemRender = GrowFundItemRender;
})(com_main || (com_main = {}));

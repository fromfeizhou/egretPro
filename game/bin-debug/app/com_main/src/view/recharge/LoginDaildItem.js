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
    var RechargeItemRender = /** @class */ (function (_super_1) {
        __extends(RechargeItemRender, _super_1);
        function RechargeItemRender() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        RechargeItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        RechargeItemRender.prototype.dataChanged = function () {
            var list = this.parent;
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            if (!this.m_bInit) {
                if (this.m_tData.type == 0) {
                    this.m_item = new LoginDaildItem();
                }
                else if (this.m_tData.type == 1) {
                    this.m_item = new com_main.PayShopAwardItem();
                }
                else if (this.m_tData.type == 2) {
                    this.m_item = new PurchageGiftBagItem();
                }
                else if (this.m_tData.type == 3) {
                    this.m_item = new com_main.GrowFundItem();
                }
                this.addChild(this.m_item);
                this.m_item.width = this.m_tData.width;
                this.m_bInit = true;
            }
            this.m_item.init({ id: this.m_tData.id, reward: this.m_tData.reward, num: this.m_tData.num, desc: this.m_tData.desc, vo: this.m_tData.vo });
        };
        return RechargeItemRender;
    }(eui.ItemRenderer));
    com_main.RechargeItemRender = RechargeItemRender;
    var LoginDaildItem = /** @class */ (function (_super_1) {
        __extends(LoginDaildItem, _super_1);
        function LoginDaildItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/pay/PayShopAwardItemSkin.exml");
            return _this;
        }
        LoginDaildItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_pBtnGet);
        };
        LoginDaildItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //初始化
        LoginDaildItem.prototype.init = function (data) {
            this.m_id = data.id;
            this.m_reward = data.reward;
            this.m_num = data.num;
            this.m_desc = data.desc;
            this.vo = data.vo;
            this.refreshBtnView();
            this.refreshView();
        };
        LoginDaildItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.width = this.parent.width;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = AwardItemRender;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
            // this.refreshView();
        };
        /**刷新界面 */
        LoginDaildItem.prototype.refreshView = function () {
            if (this.m_reward) {
                var res = [];
                for (var i = 0; i < this.m_reward.length; i++) {
                    res.push(IItemInfoPool.create(this.m_reward[i].itemId, this.m_reward[i].count));
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_labtxt.visible = false;
            this.m_labTip.text = GCodeFromat(CLEnum.AC_GET_DAY, Global.getChineseNum(this.m_num));
            this.m_pLbGold.text = '';
            this.m_labOpDay.text = GCodeFromat(CLEnum.AC_GET_DAY_AFTER, this.vo.getCurday(this.m_num));
        };
        /**刷新按钮显示 */
        LoginDaildItem.prototype.refreshBtnView = function () {
            var planStr = GCode(CLEnum.AC_CO_PROGRESS);
            var currpro;
            this.m_status = this.vo.getLoginDailyBtnRed(this.m_num, this.m_id);
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH ? true : false;
            this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
            this.m_pBtnGet.y = 64;
            Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_pBtnGet);
            this.m_pAwardState.visible = this.m_status == ActivityStatus.REWARD || this.m_status == ActivityStatus.FAILURE ? true : false;
            Utils.isGray(this.m_status == ActivityStatus.FAILURE, this.m_imgBg);
            this.m_labOpDay.visible = this.m_status == ActivityStatus.PROCESSING ? true : false;
            this.m_labState.text = this.m_status == ActivityStatus.FAILURE ? GCode(CLEnum.AC_GET_SX) : GCode(CLEnum.TAKE_OUT_END);
            this.m_pPlanRoot.visible = false;
            this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
        };
        /**领取奖励 */
        LoginDaildItem.prototype.onBtnGetHandler = function (e) {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(this.vo.id, this.m_id);
        };
        return LoginDaildItem;
    }(com_main.CComponent));
    com_main.LoginDaildItem = LoginDaildItem;
    var PurchageGiftBagItem = /** @class */ (function (_super_1) {
        __extends(PurchageGiftBagItem, _super_1);
        function PurchageGiftBagItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/pay/PurchargeGiftBagItemSkin.exml");
            return _this;
        }
        PurchageGiftBagItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_pBtnGet);
            com_main.EventManager.removeEventListener(this.m_pBtnGet1);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
        };
        PurchageGiftBagItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //初始化
        PurchageGiftBagItem.prototype.init = function (data) {
            this.m_id = data.id;
            this.m_reward = data.reward;
            this.m_num = data.num;
            this.m_desc = data.desc;
            this.vo = data.vo;
            this.refreshBtnView();
            this.refreshView();
            this.refreshVipBtnInfo();
        };
        PurchageGiftBagItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = AwardItemRender;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet1, this, this.onBtnbyVip);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.refreshVipBtnInfo, this);
            // this.refreshView();
        };
        /**刷新界面 */
        PurchageGiftBagItem.prototype.refreshView = function () {
            if (this.m_reward) {
                var res = [];
                for (var i = 0; i < this.m_reward.length; i++) {
                    res.push(IItemInfoPool.create(this.m_reward[i].itemId, this.m_reward[i].count));
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_labDesc.text = "" + L.getInstance().getLanguage(this.m_desc);
            this.m_pLbPercent.textFlow = Utils.htmlParser((GCodeFromat(CLEnum.AC_SHOP_LIMIT, this.vo.getbuyCount(this.m_id), this.vo.getbuyLimitCout(this.m_id))));
        };
        /**刷新按钮显示 */
        PurchageGiftBagItem.prototype.refreshBtnView = function () {
            this.m_status = this.vo.getPurchageGiftBagBtnRed(this.m_id);
            this.m_status = this.vo.getPurchageGiftBagBtnRed(this.m_id);
            this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING;
            // let sources = this.m_status != ActivityStatus.FINISH?PropModel.getPropIcon(this.m_num[0].key):'';
            // let price = this.m_status != ActivityStatus.FINISH ? this.m_num : GCode(CLEnum.TAKE_OUT);
            if (this.m_status != ActivityStatus.FINISH) {
                this.m_pBtnGet.cost = this.m_num;
            }
            else {
                this.m_pBtnGet.otherLabel = GCode(CLEnum.TAKE_OUT);
            }
            Utils.isGray(this.m_status !== ActivityStatus.PROCESSING, this.m_pBtnGet);
        };
        /**刷新vip购买按钮显示 */
        PurchageGiftBagItem.prototype.refreshVipBtnInfo = function () {
            var price = VipModel.getHVipGoldBuyPrice(this.m_num);
            this.m_pBtnGet1.setCostLabel(price.toString());
            this.m_pLabTip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HEIGHT_VIP_BUY, VipModel.getHVipGoldLv()));
            this.m_vipRoot.visible = VipModel.isHVipGoldDis();
        };
        /**领取奖励 */
        PurchageGiftBagItem.prototype.onBtnGetHandler = function (e) {
            if (this.m_status == ActivityStatus.PROCESSING) {
                // if (PropModel.isItemEnough(PropEnum.YU, this.m_num[0].value, 1)) {
                //     PayProxy.C2S_JADE_BUY(this.m_id);
                //     // UpManager.history();
                //     return;
                // }
                PayProxy.C2S_RECHARGE(this.m_id, this.m_num);
            }
        };
        /**vip10购买 */
        PurchageGiftBagItem.prototype.onBtnbyVip = function (e) {
            var price = VipModel.getHVipGoldBuyPrice(this.m_num);
            if (VipModel.canHVipBuy(price)) {
                PayProxy.C2S_GOLD_BUY(this.m_id);
            }
        };
        return PurchageGiftBagItem;
    }(com_main.CComponent));
    com_main.PurchageGiftBagItem = PurchageGiftBagItem;
    var AwardItemRender = /** @class */ (function (_super_1) {
        __extends(AwardItemRender, _super_1);
        function AwardItemRender() {
            return _super_1.call(this) || this;
        }
        AwardItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        AwardItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('name_num');
            this.addChild(this.m_item);
        };
        AwardItemRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        };
        return AwardItemRender;
    }(eui.ItemRenderer));
    com_main.AwardItemRender = AwardItemRender;
})(com_main || (com_main = {}));

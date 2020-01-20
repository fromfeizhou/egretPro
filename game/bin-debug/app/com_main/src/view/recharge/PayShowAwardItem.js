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
    var PayShopAwardItem = /** @class */ (function (_super_1) {
        __extends(PayShopAwardItem, _super_1);
        function PayShopAwardItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/pay/PayShopAwardItemSkin.exml");
            return _this;
        }
        PayShopAwardItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_pBtnGet);
        };
        PayShopAwardItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //初始化
        PayShopAwardItem.prototype.init = function (data) {
            this.m_id = data.id;
            this.m_reward = data.reward;
            this.m_num = data.num;
            this.m_desc = data.desc;
            this.vo = data.vo;
            this.refreshBtnView();
            this.refreshView();
        };
        PayShopAwardItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.width = this.parent.width;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = com_main.AwardItemRender;
            // this.refreshView();
        };
        /**刷新界面 */
        PayShopAwardItem.prototype.refreshView = function () {
            if (this.m_reward) {
                var res = [];
                for (var i = 0; i < this.m_reward.length; i++) {
                    res.push(IItemInfoPool.create(this.m_reward[i].itemId, this.m_reward[i].count));
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_pLbGold.text = this.m_num.toString();
            this.m_labtxt.x = this.m_pLbGold.x + this.m_pLbGold.width;
            this.m_labTip.text = this.m_desc;
        };
        /**刷新按钮显示 */
        PayShopAwardItem.prototype.refreshBtnView = function () {
            var planStr = "<font color=#abb7d1>" + GCode(CLEnum.AC_PROGRESS) + "</font>";
            var currpro;
            if (this.vo.viewType == AcViewType.RECHARGE_SINGLE) {
                var vo = this.vo;
                this.m_status = vo.getRechargeOneBtnRed(this.m_num, this.m_id);
                currpro = 0;
            }
            else if (this.vo.viewType == AcViewType.RECHARGE_ADD_UP) {
                var vo = this.vo;
                this.m_status = vo.getAllRechargeBtnRed(this.m_num, this.m_id);
                currpro = vo.paySum;
            }
            else if (this.vo.viewType == AcViewType.CONSUME_GIFT) {
                var vo = this.vo;
                this.m_status = vo.getConsumptionBtnRed(this.m_num, this.m_id);
                currpro = vo.consumeSum;
            }
            this.m_percentNum = this.m_status == ActivityStatus.FINISH ? planStr + GCode(CLEnum.AC_FINISH) : planStr + currpro + "/" + this.m_num;
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH || this.m_status == ActivityStatus.PROCESSING ? true : false;
            this.m_pAwardState.visible = this.m_status == ActivityStatus.REWARD ? true : false;
            this.m_pPlanRoot.visible = this.m_status == ActivityStatus.REWARD ? false : true;
            this.m_pLbPercent.textFlow = Utils.htmlParser(this.m_percentNum);
            if (this.vo.viewType == AcViewType.CONSUME_GIFT) {
                Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_pBtnGet);
                this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
                this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            }
            else {
                this.m_pBtnGet.currentState = this.m_status == ActivityStatus.FINISH ? 'style1' : 'style6';
                var str = this.m_status == ActivityStatus.FINISH ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.GO_TO);
                this.m_pBtnGet.setTitleLabel(str);
            }
        };
        /**领取奖励 */
        PayShopAwardItem.prototype.onBtnGetHandler = function (e) {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            if (this.vo.viewType == AcViewType.RECHARGE_SINGLE) { //单笔充值领取
                ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD(this.vo.id, this.m_id);
            }
            else if (this.vo.viewType == AcViewType.RECHARGE_ADD_UP) { //累计充值领取
                ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD(this.vo.id, this.m_id);
            }
            else if (this.vo.viewType == AcViewType.CONSUME_GIFT) { //消费豪礼领取
                ActivityProxy.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD(this.vo.id, this.m_id);
            }
        };
        return PayShopAwardItem;
    }(com_main.CComponent));
    com_main.PayShopAwardItem = PayShopAwardItem;
})(com_main || (com_main = {}));

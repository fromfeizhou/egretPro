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
    var SevenIIChargeItem = /** @class */ (function (_super_1) {
        __extends(SevenIIChargeItem, _super_1);
        function SevenIIChargeItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIIChargeItemSkin.exml");
            return _this;
        }
        SevenIIChargeItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
        };
        SevenIIChargeItem.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        SevenIIChargeItem.prototype.dataChanged = function () {
            var list = this.parent;
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.creatItem();
            var currpro;
            if (this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_2 || this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_3) {
                var vo = this.m_tData.vo;
                this.m_status = vo.getRechargeOneBtnRed(this.m_tData.num, this.m_tData.id);
                currpro = 0;
                this.m_imgTitle.source = 'lb_dbczyb_png';
            }
            else if (this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_3 || this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_5) {
                var vo = this.m_tData.vo;
                this.m_status = vo.getAllRechargeBtnRed(this.m_tData.num, this.m_tData.id);
                currpro = vo.paySum;
                this.m_imgTitle.source = 'lb_ljczyb_png';
            }
            var planStr = "<font color=#abb7d1>" + GCode(CLEnum.AC_PROGRESS) + "</font>";
            var currProTxt = this.m_status == ActivityStatus.FINISH ? planStr + GCode(CLEnum.AC_FINISH) : planStr + currpro + "/" + this.m_tData.num;
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH || this.m_status == ActivityStatus.PROCESSING ? true : false;
            this.m_pState.visible = this.m_status == ActivityStatus.REWARD ? true : false;
            this.m_labBuyNum.textFlow = Utils.htmlParser(currProTxt);
            this.m_labBuyNum.visible = this.m_status == ActivityStatus.REWARD ? false : true;
            this.m_pLbGold.text = this.m_tData.num.toString();
            this.m_pBtnGet.currentState = this.m_status == ActivityStatus.FINISH ? 'style1' : 'style6';
            var str = this.m_status == ActivityStatus.FINISH ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.GO_TO);
            this.m_pBtnGet.setTitleLabel(str);
        };
        /**奖励显示*/
        SevenIIChargeItem.prototype.creatItem = function () {
            this.m_group.removeChildren();
            for (var i = 0; i < this.m_tData.reward.length; i++) {
                var itemInfo = this.m_tData.reward[i];
                var item = com_main.ComItemNew.create("count");
                item.setItemInfo(itemInfo.itemId, itemInfo.count);
                this.m_group.addChild(item);
            }
        };
        /**领取奖励 */
        SevenIIChargeItem.prototype.onBtnGetHandler = function (e) {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            if (this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_2 || this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_3) { //单笔充值领取
                ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD(this.m_tData.vo.id, this.m_tData.id);
            }
            else if (this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_3 || this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_5) { //累计充值领取
                ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD(this.m_tData.vo.id, this.m_tData.id);
            }
        };
        return SevenIIChargeItem;
    }(eui.ItemRenderer));
    com_main.SevenIIChargeItem = SevenIIChargeItem;
})(com_main || (com_main = {}));

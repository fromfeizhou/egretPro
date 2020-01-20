// TypeScript file
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
    var NewGenLimitBuyPanel = /** @class */ (function (_super_1) {
        __extends(NewGenLimitBuyPanel, _super_1);
        // private m_config: ActivityTotalPayRewardConfig;
        function NewGenLimitBuyPanel() {
            var _this = _super_1.call(this) || this;
            _this.dynamicSkinName = Utils.getAppSkin("activity/newGeneral/NewGenLimitBuySkin.exml");
            return _this;
        }
        NewGenLimitBuyPanel.prototype.onShow = function () {
            var _this = this;
            this.initEvent();
            this.m_vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
            if (!this.m_vo)
                return;
            var config = this.m_vo.rechargeCfgs[0];
            this.refreshReward(Utils.parseCommonItemServ(config.reward));
            this.refreshBtnState();
            var vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
            eui.getAssets(vo.getNewGenRewordCfg().titleStr1 + '_png', function () {
                var tex = RES.getRes(vo.getNewGenRewordCfg().titleStr1 + '_png');
                _this.m_titleImg.source = tex;
                _this.m_titleImg.anchorOffsetX = _this.m_titleImg.width / 2;
                _this.m_titleImg.anchorOffsetY = _this.m_titleImg.height / 2;
                _this.m_once.x = _this.m_titleImg.x + _this.m_titleImg.width / 2 - 15;
            }, this);
        };
        NewGenLimitBuyPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.clearBtnEff();
        };
        NewGenLimitBuyPanel.prototype.refreshBtnState = function () {
            var state = this.m_vo.getLimitStatu();
            this.m_btnGet['commitProperties']();
            if (state == 0) { //未购买
                var config = this.m_vo.rechargeCfgs[0];
                this.m_btnGet.cost = config.price;
                this.setEff();
            }
            else if (state == 1) { //领取
                this.m_btnGet.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.clearBtnEff();
            }
            else if (state == 2) { //已领取
                this.m_btnGet.otherLabel = GCode(CLEnum.TAKE_OUT_END);
                this.m_btnGet.disabled = true;
            }
        };
        /**按钮特效 */
        NewGenLimitBuyPanel.prototype.setEff = function () {
            if (!this.m_effect) {
                this.m_effect = new MCDragonBones();
                this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
                this.m_effect.play(IETypes.EUI_BtnEffect02);
                this.m_effect.x = 135;
                this.m_effect.y = 47.5;
                this.m_btnGet.addChild(this.m_effect);
            }
        };
        NewGenLimitBuyPanel.prototype.clearBtnEff = function () {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        //设置奖励列表
        NewGenLimitBuyPanel.prototype.refreshReward = function (reward) {
            this.m_itemList.removeChildren();
            for (var _i = 0, reward_1 = reward; _i < reward_1.length; _i++) {
                var item = reward_1[_i];
                var itemView = com_main.ComItemNew.create('count', true, true);
                itemView.setItemInfo(item.itemId, item.count);
                this.m_itemList.addChild(itemView);
            }
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        NewGenLimitBuyPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnGet, this, this.onClicGet);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GEN_LIM, this.refreshBtnState, this);
        };
        NewGenLimitBuyPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GEN_LIM, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        //领取奖励
        NewGenLimitBuyPanel.prototype.onClicGet = function (e) {
            var state = this.m_vo.getLimitStatu();
            if (state == 0) { //未购买
                var config = this.m_vo.rechargeCfgs[0];
                PayProxy.C2S_RECHARGE(config.id, config.price);
                return;
            }
            else if (state == 1) { //领取
                ActivityProxy.send_C2S_ACTIVITY_AWARD_GENERAL_BAG(this.m_vo.id);
            }
            else if (state == 2) { //已经领取过了
                EffectUtils.showTips(GCode(CLEnum.TAKE_OUT_END), 1, true);
            }
        };
        return NewGenLimitBuyPanel;
    }(com_main.DynamicComponent));
    com_main.NewGenLimitBuyPanel = NewGenLimitBuyPanel;
})(com_main || (com_main = {}));

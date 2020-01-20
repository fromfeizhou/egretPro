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
    var NewGenVisPanel = /** @class */ (function (_super_1) {
        __extends(NewGenVisPanel, _super_1);
        function NewGenVisPanel() {
            var _this = _super_1.call(this) || this;
            _this.dynamicSkinName = Utils.getAppSkin("activity/newGeneral/NewGenVisSkin.exml");
            return _this;
        }
        NewGenVisPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.clearBtnEff();
        };
        NewGenVisPanel.prototype.onShow = function () {
            this.m_vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
            this.initEvent();
            // this.m_btnVis.setTitleLabel(GCode(CLEnum.NEW_GEN_BF));
            this.m_btnChange.setTitleLabel(GCode(CLEnum.NEW_GEN_GHJL));
            this.m_onceCostNum = this.m_vo.getVisCost().count;
            this.m_btnVis.setTitleLabel('拜访1次');
            // this.m_btnVis.setCostImg('common_prop_1001_png');
            // this.m_btnVis.setCostLabel('X' + this.m_onceCostNum);
            this.m_tenCostNum = this.m_vo.getVisCost10().count;
            this.m_btnVisTen.setTitleLabel('拜访10次');
            // this.m_btnVisTen.setCostImg('common_prop_1001_png');
            // this.m_btnVisTen.setCostLabel('X' + this.m_tenCostNum);
            // this.m_lbDes.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.NEW_GEN_CZXW, this.m_vo.getNewGenRewordCfg().perPay)); //Utils.htmlParser('每充值<font color=#feee3b>100个元宝</font><font color=#ffffff>可获得一个信物</font>');
            this.setEff();
            this.refreshMyReward();
            this.refreshCostNum();
        };
        /**按钮特效 */
        NewGenVisPanel.prototype.setEff = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 133;
            this.m_effect.y = 45;
            this.m_btnVisTen.addChild(this.m_effect);
        };
        NewGenVisPanel.prototype.clearBtnEff = function () {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        NewGenVisPanel.prototype.addItem = function (info) {
            var itemView = com_main.ComItemNew.create('count', true, true);
            itemView.setItemInfo(info.itemId, info.count);
            itemView.scaleX = itemView.scaleY = 1.1;
            this.m_itemList.addChild(itemView);
        };
        //设置自选奖励
        NewGenVisPanel.prototype.refreshMyReward = function () {
            this.m_itemList.removeChildren();
            var list = this.m_vo.getChooseList();
            var staticInfo = this.m_vo.getNewGenRewordCfg().requiredRward[0];
            this.addItem(staticInfo);
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var i = list_1[_i];
                this.addItem(i);
            }
        };
        //累计消耗信物数量
        NewGenVisPanel.prototype.refreshCostNum = function () {
            var count = this.m_vo.getCostKeepsake();
            var cfg = this.m_vo.getKeepsakeRewardCfg();
            var cCount = cfg[cfg.length - 1].keepsakeCount;
            this.m_lbUseNum.textFlow = Utils.htmlParser("<font>" + count + "</font>"); //count.toString();
            this.m_boxPro.setPro(cCount /*200*/, count);
            this.refreshNeedCost();
        };
        NewGenVisPanel.prototype.refreshNeedCost = function () {
            // 信物
            var itemId = this.m_vo.getVisCost().itemId;
            var haveCount = PropModel.getPropNum(itemId);
            this.m_pCostIcon0.source = PropModel.getPropIcon(itemId);
            Utils.setPropLabName(itemId, this.m_pLbCostName0);
            this.m_pLbCostName0.text = "信物";
            var color0 = PropModel.isItemEnough(itemId, this.m_onceCostNum) ? 0xe9e9e6 : 0xff0000;
            this.m_pLbCost0.textFlow = Utils.htmlParser("<font color=" + color0 + ">" + haveCount + "</font><font color=0xe9e9e6>/" + this.m_onceCostNum + "</font>");
            this.m_pCostIcon1.source = PropModel.getPropIcon(itemId);
            Utils.setPropLabName(itemId, this.m_pLbCostName1);
            this.m_pLbCostName1.text = "信物";
            var color1 = PropModel.isItemEnough(itemId, this.m_tenCostNum) ? 0xe9e9e6 : 0xff0000;
            this.m_pLbCost1.textFlow = Utils.htmlParser("<font color=" + color1 + ">" + haveCount + "</font><font color=0xe9e9e6>/" + this.m_tenCostNum + "</font>");
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        NewGenVisPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnChange, this, this.onClickChange);
            com_main.EventManager.addTouchScaleListener(this.m_btnVis, this, this.onClickVis);
            com_main.EventManager.addTouchScaleListener(this.m_btnVisTen, this, this.onClickVis10);
            // EventManager.addTouchScaleListener(this.m_btnRecharge, this, this.onClickRecharge);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD, this.refreshCostNum, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this.refreshMyReward, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD, this.refreshCostNum, this);
            // EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.refreshXinwu, this);
        };
        NewGenVisPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD, this);
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        //选择奖励
        NewGenVisPanel.prototype.onClickChange = function (e) {
            Utils.open_view(TASK_UI.POP_ACTIVITY_SELECT_REWARD);
        };
        //拜访
        NewGenVisPanel.prototype.onClickVis = function (e) {
            // let itemNum = PropModel.getPropNum(this.m_vo.getXwItemId());
            // if(itemNum >= this.m_vo.getPerOnceNum()){
            // 	if(this.m_vo.getChooseList().length != 4){
            // 		EffectUtils.showTips(GCode(CLEnum.NEW_GEN_SEL_TIP), 1, true);
            // 		return;
            // 	}
            // 	ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD(this.m_vo.id);
            // }else{
            // 	EffectUtils.showTips(GCode(CLEnum.NEW_GEN_XWBZ), 1, true);
            // }
            this.vis(1);
        };
        NewGenVisPanel.prototype.onClickVis10 = function (e) {
            this.vis(2);
        };
        //拜访武将 type1 抽1次 type2 10次
        NewGenVisPanel.prototype.vis = function (type) {
            if (this.m_vo.getChooseList().length != 4) {
                EffectUtils.showTips(GCode(CLEnum.NEW_GEN_SEL_TIP), 1, true);
                return;
            }
            var costNum;
            var num = PropModel.getPropNum(PropEnum.XW); //幸运转盘数量
            if (type == 1) {
                costNum = this.m_onceCostNum;
            }
            else {
                costNum = this.m_tenCostNum;
            }
            if (num < costNum) {
                if (PlatConst.isRmbPay()) {
                    var cfg_1 = this.m_vo.rechargeCfgs[type];
                    Utils.showConfirmPop("\u62DC\u8BBF\u4FE1\u7269\u4E0D\u8DB3\uFF0C\u662F\u5426\u82B1\u8D39<font color =0xffff00>\uFFE5" + cfg_1.price + "</font>\u76F4\u63A5\u62DC\u8BBF?", function () {
                        PayProxy.C2S_RECHARGE(cfg_1.id, cfg_1.price);
                    }, this);
                }
                else {
                    Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { itemId: PropEnum.XW, count: costNum - num, buyType: 0 });
                }
            }
            else {
                ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD(this.m_vo.id, type);
            }
        };
        return NewGenVisPanel;
    }(com_main.DynamicComponent));
    com_main.NewGenVisPanel = NewGenVisPanel;
})(com_main || (com_main = {}));

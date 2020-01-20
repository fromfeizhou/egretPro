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
// 新7天活动聚宝盆
var com_main;
(function (com_main) {
    var SevenIICornucopiaPanel = /** @class */ (function (_super_1) {
        __extends(SevenIICornucopiaPanel, _super_1);
        function SevenIICornucopiaPanel(actType) {
            var _this = _super_1.call(this) || this;
            /**=====================================================================================
            * 事件监听 end
            * =====================================================================================
            */
            _this.endAwardNum = 88888;
            _this.m_actType = actType;
            _this.dynamicSkinName = Utils.getAppSkin("activity/sevenII/SevenIICornucopiaSkin.exml");
            return _this;
        }
        SevenIICornucopiaPanel.prototype.onShow = function () {
            this.m_imgTips.source = this.m_actType == AcViewType.TREASEURE_BOWL ? 'lb_7t_zcjbcygj_png' : 'lb_7t_cyggynyd_png';
            this.m_vo = ActivityModel.getActivityVo(this.m_actType);
            this.initEvent();
            this.setEff();
            this.refreshView();
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        // 	this.m_vo = ActivityModel.getActivityVo<AcCornucopiaVo>(AcViewType.TREASEURE_BOWL);
        // 	this.initEvent();
        // 	this.setEff();
        //     this.refreshView();
        // }
        SevenIICornucopiaPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.clearBtnEff();
        };
        SevenIICornucopiaPanel.prototype.refreshView = function () {
            var info = this.m_vo.getInfo();
            // let str = '聚宝重置<font color=#e7c772>%d</font>次后重置进度，当前聚宝第<font color=#e7c772>%d</font>次';
            var str = '每充值<font color=#e7c772>%d</font>元宝可聚宝一次，聚宝<font color=#e7c772>%d</font>次后重置进度，您还可聚宝<font color=#e7c772>%d</font>次';
            this.m_lbButtonDis.textFlow = Utils.htmlParser(GLanFormat(str, this.m_vo.getConfigs().perPay, 10 - info.curCount + 1, info.totalCount));
            var _a = this.m_vo.getMinMax(10), min1 = _a[0], hight = _a[1];
            this.m_lb_hight.textFlow = Utils.htmlParser(GLanFormat('最高获得<font color=#e7c772>%d</font>元宝', hight));
            var _b = this.m_vo.getMinMax(info.curCount), min = _b[0], max = _b[1];
            this.lb_down.text = min.toString();
            this.lb_up.text = max.toString();
            if (info.totalCost == 0) {
                this.m_awardBtn.setTitleLabel('免费聚宝');
            }
            else if (info.totalCount > 0) {
                this.m_awardBtn.setTitleLabel('聚宝');
            }
            else {
                this.m_awardBtn.setTitleLabel('充值');
            }
        };
        //抽奖返回
        SevenIICornucopiaPanel.prototype.rewardReturn = function (arg) {
            this.m_rewardMsg = arg;
            this.m_curNum = 0;
            this.refreshView();
            var num = 0;
            for (var _i = 0, arg_1 = arg; _i < arg_1.length; _i++) {
                var i = arg_1[_i];
                if (i.itemId == 1) {
                    num = i.count;
                }
            }
            this.endAwardNum = num;
            Utils.TimerManager.doTimer(0, 10000, this.changeNum, this);
            this.isRunEffect = true;
        };
        /**按钮特效 */
        SevenIICornucopiaPanel.prototype.setEff = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_awardBtn.addChild(this.m_effect);
        };
        SevenIICornucopiaPanel.prototype.clearBtnEff = function () {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        SevenIICornucopiaPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_awardBtn, this, this.onClickAward);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR, this.refreshView, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD, this.rewardReturn, this);
        };
        SevenIICornucopiaPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_7DAY_COR, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD, this);
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.changeNum, this);
            Utils.TimerManager.remove(this.showReward, this);
        };
        //领奖
        SevenIICornucopiaPanel.prototype.onClickAward = function (e) {
            //转动中不能点
            if (this.isRunEffect) {
                return;
            }
            var info = this.m_vo.getInfo();
            if (info.totalCost == 0 || info.totalCount > 0) {
                ActivityProxy.send_C2S_ACTIVITY_TREASEURE_BOWL_REWARD(this.m_vo.id);
            }
            else {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
            }
        };
        SevenIICornucopiaPanel.prototype.getStep = function (start, end) {
            var dis = end - start;
            if (dis > 10000) {
                return 1111;
            }
            else if (dis > 1000) {
                return 111;
            }
            else if (dis > 100) {
                return 11;
            }
            else if (dis > 15) {
                return 3;
            }
            else {
                return 1;
            }
        };
        SevenIICornucopiaPanel.prototype.changeNum = function () {
            this.m_curNum = this.m_curNum + this.getStep(this.m_curNum, this.endAwardNum);
            if (this.m_curNum > this.endAwardNum) {
                this.m_curNum = this.endAwardNum;
                Utils.TimerManager.remove(this.changeNum, this);
                Utils.TimerManager.doTimer(350, 1, this.showReward, this);
            }
            this.m_awardNum.text = StringUtils.pad(this.m_curNum, 5);
        };
        SevenIICornucopiaPanel.prototype.showReward = function () {
            this.isRunEffect = false;
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.m_rewardMsg);
        };
        return SevenIICornucopiaPanel;
    }(com_main.DynamicComponent));
    com_main.SevenIICornucopiaPanel = SevenIICornucopiaPanel;
})(com_main || (com_main = {}));

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
    /**英雄寻宝 */
    var TurnTableView = /** @class */ (function (_super_1) {
        __extends(TurnTableView, _super_1);
        function TurnTableView(activiType) {
            var _this = _super_1.call(this) || this;
            _this.activityType = activiType;
            _this.initApp("activity/turntable/TurnTableViewSkin.exml");
            return _this;
        }
        TurnTableView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        TurnTableView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        TurnTableView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TurnTableView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            Utils.TimerManager.remove(this.updateDownTime, this);
            Utils.TimerManager.remove(this.timerFunc, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.TURNTABLE_UI]);
        };
        TurnTableView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_points = [];
            for (var i = 0; i < 14; i++) {
                var item = this["m_turnItem" + i];
                this.m_points.push({ x: item.x, y: item.y });
            }
            this.m_tCollects = new eui.ArrayCollection();
            this.m_TurnBoxList.dataProvider = this.m_tCollects;
            this.m_TurnBoxList.itemRenderer = TurnTableBoxRender;
            this.m_TurnBoxList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            this.m_btnTen.setTitleLabel('寻宝十次');
            this.m_labTip.textFlow = Utils.htmlParser(GCode(CLEnum.TURNTABLE_TIP));
        };
        TurnTableView.prototype.onTouchTab = function (e) {
            this.m_scrollV = e.currentTarget.scrollV;
            this.m_boxItem = e.item;
            if (this.m_turnTableVo.accumulates.indexOf(this.m_boxItem.boxId) == -1) {
                if (this.m_boxItem.boxState <= 0) {
                    Utils.open_view(TASK_UI.NOR_BOX_INFO_PANEL, { awards: this.m_boxItem.award });
                }
                else {
                    TurnTableProxy.C2S_ACTIVITY_DRAW_PRIZE_REWARD(this.m_turnTableVo.id, this.m_boxItem.boxId);
                }
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.QUA_BOX_TIPS), 1, false);
            }
        };
        /**初始化界面 */
        TurnTableView.prototype.initView = function () {
            if (this.bInit)
                return;
            this.bInit = true;
            this.isTurn = false;
            this.m_turnTableVo = ActivityModel.getActivityVo(this.activityType);
            this.m_checkBox.selected = this.m_turnTableVo.isSkip;
            // this[`m_turnItem${this.m_turnTableVo.playNum}`].select(true);
            this.m_prizeCfgDic = {};
            this.message = [];
            if (this.m_turnTableVo) {
                this.creatItem();
                this.initm_boxItem();
                this.refreshView();
                this.refreshCost();
                this.refreshBtn();
                this.updateDownTime();
                Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            }
            this.addEvent();
        };
        TurnTableView.prototype.updateDownTime = function () {
            var str = Utils.DateUtils.getCountdownStrByCfg(this.m_turnTableVo.closeDate - TimerUtils.getServerTimeMill(), 1);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_turnTime.textFlow = Utils.htmlParser(timeStr + "<font color=#E9E9E6>" + str + "</font>");
        };
        /**设置宽高 */
        TurnTableView.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pRoot);
        };
        /**初始化宝箱列表 */
        TurnTableView.prototype.initm_boxItem = function () {
            var boxArr = [];
            var prizeCfg = [];
            var boxState = 0;
            for (var key in this.m_turnTableVo.configsII) {
                prizeCfg.push(this.m_turnTableVo.configsII[key]);
            }
            for (var i = 0; i < prizeCfg.length; i++) {
                var vo = prizeCfg[i];
                if (this.m_turnTableVo.accumulates.indexOf(vo.id) == -1) {
                    boxState = vo.accumulate <= this.m_turnTableVo.account ? 1 : 0;
                }
                else {
                    boxState = 2;
                }
                var data = { boxId: vo.id, lotteryNum: vo.accumulate, boxState: boxState, award: vo.award };
                boxArr.push(data);
            }
            this.m_tCollects.replaceAll(boxArr);
        };
        /**刷新宝箱列表数据 */
        TurnTableView.prototype.refreshBox = function () {
            var boxState = 0;
            for (var i = 0; i < this.m_tCollects.source.length; i++) {
                var data = this.m_tCollects.source[i];
                if (this.m_turnTableVo.accumulates.indexOf(data.boxId) == -1) {
                    boxState = data.lotteryNum <= this.m_turnTableVo.account ? 1 : 0;
                }
                else {
                    boxState = 2;
                }
                data.boxState = boxState;
                this.m_tCollects.replaceItemAt(data, i);
            }
            this.m_tCollects.refresh();
            this.m_TurnBoxList.useVirtualLayout = true;
            this.m_TurnBoxList.validateNow();
            this.m_TurnBoxList.scrollV = this.m_scrollV;
        };
        /**奖励物品显示 */
        TurnTableView.prototype.creatItem = function () {
            if (!this.bInit)
                return;
            var turnTableCfg = [];
            for (var key in this.m_turnTableVo.configs) {
                turnTableCfg.push(this.m_turnTableVo.configs[key]);
            }
            for (var i = 0; i < turnTableCfg.length; i++) {
                var item = this["m_turnItem" + i];
                item.refreshItem(turnTableCfg[i].award.itemId, turnTableCfg[i].award.count, turnTableCfg[i].reset);
                this.m_prizeCfgDic[turnTableCfg[i].id] = this.m_points[i];
            }
        };
        /**刷新显示 */
        TurnTableView.prototype.refreshView = function () {
            if (!this.bInit)
                return;
            this.m_lablunckNum.text = this.m_turnTableVo.luncky.toString();
            this.m_labCount.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TURNTABLE_OTHER_PIRCE, this.m_turnTableVo.account));
        };
        /**刷新消耗显示 */
        TurnTableView.prototype.refreshCost = function () {
            if (!this.bInit)
                return;
            this.prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE); //幸运转盘数量
            this.prizeInfo = ConstUtil.getItems(IConstEnum.PRIZE_RECRUIT_RECRUIT_CONSUME)[0];
            this.m_comCost0.setInfo(this.prizeInfo.itemId, this.prizeInfo.count);
            this.m_comCost1.setInfo(this.prizeInfo.itemId, this.prizeInfo.count * 10);
        };
        /**刷新按钮显示 */
        TurnTableView.prototype.refreshBtn = function () {
            var btnStr = this.m_turnTableVo.freeCount > 0 ? '免费一次' : '寻宝一次';
            this.m_btnOne.setTitleLabel(btnStr);
        };
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        TurnTableView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnOne, this, this.onOneStart);
            com_main.EventManager.addTouchScaleListener(this.m_btnTen, this, this.onTenStart);
            com_main.EventManager.addTouchTapListener(this.m_pCheckBox, this, this.onCheckBox);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, this.onDrawCard, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, this.refreshBox, this);
            com_main.EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.openRedGenTip, this);
        };
        /**移除事件 */
        TurnTableView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
        };
        /**跳过动画 */
        TurnTableView.prototype.onCheckBox = function () {
            var state = !this.m_turnTableVo.isSkip;
            this.m_checkBox.selected = state;
            this.m_turnTableVo.isSkip = state;
        };
        /**点击一次寻宝 */
        TurnTableView.prototype.onOneStart = function () {
            if (this.isTurn) {
                EffectUtils.showTips('正在抽奖中', 1, false);
                return;
            }
            this.m_currBtnType = 0;
            this.prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE); //幸运转盘数量
            if (this.prizeNum <= 0 && this.m_turnTableVo.freeCount <= 0) {
                Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { turnTableVoId: this.m_turnTableVo.id, itemId: this.prizeInfo.itemId, count: this.prizeInfo.count, buyType: this.m_currBtnType });
            }
            else {
                this.getReward();
            }
        };
        /**点击十次寻宝 */
        TurnTableView.prototype.onTenStart = function () {
            if (this.isTurn) {
                EffectUtils.showTips('正在抽奖中', 1, false);
                return;
            }
            this.m_currBtnType = 1;
            this.prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE); //幸运转盘数量
            var allItemNum = this.m_turnTableVo.freeCount + this.prizeNum; //免费次数加道具数量
            if (allItemNum < 10) {
                Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { turnTableVoId: this.m_turnTableVo.id, itemId: this.prizeInfo.itemId, count: this.prizeInfo.count * (10 - this.m_turnTableVo.freeCount - this.prizeNum), buyType: this.m_currBtnType });
            }
            else {
                this.getReward();
            }
        };
        /**寻宝请求获得物品 */
        TurnTableView.prototype.getReward = function () {
            TurnTableProxy.C2S_ACTIVITY_PRIZE_PLAY(this.m_turnTableVo.id, this.m_currBtnType);
        };
        /**点击寻宝返回 */
        TurnTableView.prototype.onDrawCard = function (message) {
            this.message = message;
            this.isTurn = true;
            if (this.m_turnTableVo.isSkip) { //跳过动画直接弹奖励
                this.showSkipAni();
            }
            else {
                this.Continue();
            }
            this.refreshView(); //刷新幸运值
            this.refreshBox();
            this.refreshBtn(); //刷新按钮显示
        };
        /**转两圈 */
        TurnTableView.prototype.Continue = function () {
            this.closeLastItemLight();
            var ITEM_NUM = 14;
            this.m_runIndex = 0;
            Utils.TimerManager.doTimer(100, ITEM_NUM * 1, this.timerFunc, this, this.turnTwoEnd, this);
        };
        /**减速转一圈 在走到奖励位置 */
        TurnTableView.prototype.turnTwoEnd = function () {
            var playNum = 0;
            if (this.m_turnTableVo.playNum % 14 == 0) {
                playNum = 14;
            }
            else {
                playNum = this.m_turnTableVo.playNum % 14;
            }
            Utils.TimerManager.doTimer(200, playNum, this.timerFunc, this, this.ShowMessage, this);
        };
        TurnTableView.prototype.closeLastItemLight = function () {
            if (this.m_runIndex == undefined || this.m_runIndex == null)
                return;
            var lastPoint = this.m_runIndex - 1 > -1 ? this.m_runIndex - 1 : 13;
            var lastSelectItem = this['m_turnItem' + lastPoint];
            lastSelectItem.select(false);
        };
        TurnTableView.prototype.timerFunc = function (event) {
            this.closeLastItemLight();
            var curSelectItem = this['m_turnItem' + this.m_runIndex];
            curSelectItem.select(true);
            this.m_runIndex += 1;
            if (this.m_runIndex >= 14)
                this.m_runIndex = 0;
        };
        TurnTableView.prototype.ShowMessage = function () {
            var _this = this;
            Utils.TimerManager.doTimer(500, 1, function () {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, _this.message);
                _this.isTurn = false;
            }, this);
        };
        /**跳过动画直接弹奖励 */
        TurnTableView.prototype.showSkipAni = function () {
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.message);
            this.isTurn = false;
        };
        /**全部奖励播放完再弹 */
        TurnTableView.prototype.openRedGenTip = function () {
            if (GiftBagModel.isPopItem) {
                Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
            }
        };
        return TurnTableView;
    }(com_main.CView));
    com_main.TurnTableView = TurnTableView;
    /**
    * 宝箱
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var TurnTableBoxRender = /** @class */ (function (_super_1) {
        __extends(TurnTableBoxRender, _super_1);
        function TurnTableBoxRender() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/turntable/TurnTableBoxSkin.exml");
            _this.width = 106;
            _this.height = 109;
            return _this;
        }
        TurnTableBoxRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            this.onDestroy();
        };
        TurnTableBoxRender.prototype.onDestroy = function () {
            this.clearBoxStarEffect();
        };
        TurnTableBoxRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TurnTableBoxRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.commitProperties();
            this.m_labName.text = this.m_tData.lotteryNum + '次';
            if (this.m_tData.boxState == 2) {
                this.m_imgBox.source = 'hang_bx_1_png';
                Utils.isGray(false, this.m_imgBox);
                this.clearBoxStarEffect();
            }
            else {
                this.m_imgBox.source = 'hang_bx_png';
                Utils.isGray(this.m_tData.boxState <= 0, this.m_imgBox);
                if (this.m_tData.boxState <= 0) {
                    this.clearBoxStarEffect();
                }
                else {
                    this.createBoxStarEffect();
                }
            }
        };
        /**设置星光特效 */
        TurnTableBoxRender.prototype.createBoxStarEffect = function () {
            if (this.m_boxStarEff)
                return;
            this.m_boxStarEff = NormalMcMgr.createMc(IETypes.EUI_BoxEffect02, true);
            // this.m_boxStarEff.scaleX = 1;
            // this.m_boxStarEff.scaleY = 1;
            this.m_boxStarEff.x = 53;
            this.m_boxStarEff.y = 40;
            // this.m_boxStarEff.visible = false;
            this.m_pEffectRoot.addChildAt(this.m_boxStarEff, 1);
        };
        /**清除星光特效 */
        TurnTableBoxRender.prototype.clearBoxStarEffect = function () {
            if (this.m_boxStarEff) {
                NormalMcMgr.removeMc(this.m_boxStarEff);
                this.m_boxStarEff = null;
            }
        };
        return TurnTableBoxRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));

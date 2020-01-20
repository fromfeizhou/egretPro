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
    /**
     * 在线奖励
     */
    var OnlineWnd = /** @class */ (function (_super_1) {
        __extends(OnlineWnd, _super_1);
        function OnlineWnd() {
            var _this = _super_1.call(this) || this;
            _this.name = OnlineWnd.NAME;
            _this.initApp("activity/online/OnlineWndSkin.exml");
            return _this;
        }
        OnlineWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_ONLINE_REWARD,
            ];
        };
        /**处理协议号事件 */
        OnlineWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_ONLINE_REWARD: {
                    this.inittem();
                    break;
                }
            }
        };
        OnlineWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.removeEvent();
            OnLineModel.viewState = false;
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
            SceneResGroupCfg.clearModelRes([ModuleEnums.ONLINE_UI]);
        };
        /**监听事件 */
        OnlineWnd.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_imgBtnClose, this, this.onHide);
            com_main.EventMgr.addEvent(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this.closePanel, this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onGetReward);
            com_main.EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
        };
        /**移除事件 */
        OnlineWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this);
        };
        OnlineWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.inittem();
            this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.addEvent();
        };
        /**初始化 */
        OnlineWnd.prototype.inittem = function () {
            this.gifCfg = OnLineModel.getCurCfgInfo();
            if (!this.gifCfg)
                return;
            this.showItem(this.gifCfg.reward);
            this.reFreshCardTime();
        };
        /**刷新倒计时显示 */
        OnlineWnd.prototype.reFreshCardTime = function () {
            var time = OnLineModel.onlineTime;
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.alltime = this.gifCfg.minutes * 60 - time;
            Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
            this.m_labOnline.text = this.alltime > 0 ? Utils.DateUtils.getFormatBySecond(this.alltime, 4) : GCode(CLEnum.TAKE_OUT_IN);
            Utils.isGray(this.alltime > 0, this.m_pBtnGet);
            this.m_pBtnGet.enabled = this.alltime > 0 ? false : true;
            if (this.alltime < 0) {
                this.setEff();
            }
            else {
                this.delEff();
            }
        };
        OnlineWnd.prototype.closePanel = function (ft) {
            if (ft !== FunctionType.ONLINE)
                return;
            com_main.UpManager.history();
        };
        /**刷新倒计时 */
        OnlineWnd.prototype.updateRemainTime = function () {
            if (this.alltime > 0) {
                if (--this.alltime > 0) {
                    this.m_labOnline.text = Utils.DateUtils.getFormatBySecond(this.alltime, 4);
                }
            }
            else {
                this.m_labOnline.text = GCode(CLEnum.TAKE_OUT_IN);
                Utils.TimerManager.remove(this.updateRemainTime, this);
                Utils.isGray(this.alltime > 0, this.m_pBtnGet);
                this.m_pBtnGet.enabled = this.alltime > 0 ? false : true;
            }
        };
        /**显示奖励 */
        OnlineWnd.prototype.showItem = function (reward) {
            var arwardList = Utils.parseCommonItemJson(reward);
            var i = 0;
            for (i = 0; i < arwardList.length; i++) {
                if (this.m_pOnlineGroup.numChildren > i) {
                    this.m_pOnlineGroup.getChildAt(i).setItemInfo(arwardList[i].itemId, arwardList[i].count);
                }
                else {
                    var itemView = com_main.ComItemNew.create("name_num");
                    itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                    this.m_pOnlineGroup.addChild(itemView);
                }
            }
            for (; i < this.m_pOnlineGroup.numChildren; i++) {
                this.m_pOnlineGroup.removeChildAt(i);
            }
        };
        OnlineWnd.prototype.onGetReward = function () {
            if (!this.gifCfg)
                return;
            ActivityProxy.C2S_ONLINE_REWARD(this.gifCfg.id);
        };
        /**按钮特效 */
        OnlineWnd.prototype.setEff = function () {
            if (this.m_effect)
                return;
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_pBtnGet.addChild(this.m_effect);
        };
        /**删除特效 */
        OnlineWnd.prototype.delEff = function () {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        OnlineWnd.prototype.onHide = function () {
            com_main.UpManager.history();
        };
        OnlineWnd.prototype.hidePanel = function () {
            if (!this.gifCfg) {
                com_main.UpManager.history();
                com_main.EventMgr.dispatchEvent(TASK_EVT.POP_FUNCTION_PANEL_CLOSE, FunctionType.ONLINE);
            }
        };
        OnlineWnd.NAME = 'OnlineWnd';
        return OnlineWnd;
    }(com_main.CView));
    com_main.OnlineWnd = OnlineWnd;
})(com_main || (com_main = {}));

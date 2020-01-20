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
     * 封王战
     */
    var KingBattleView = /** @class */ (function (_super_1) {
        __extends(KingBattleView, _super_1);
        function KingBattleView() {
            var _this = _super_1.call(this) || this;
            _this.name = KingBattleView.NAME;
            _this.initApp("activity/kingBattle/KingBattleSkin.exml");
            return _this;
        }
        KingBattleView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        KingBattleView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.S2C_ONLINE_REWARD: {
                //     this.inittem();
                //     break;
                // }
            }
        };
        KingBattleView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Utils.TimerManager.remove(this.updateTime, this);
            this.removeEvent();
        };
        /**监听事件 */
        KingBattleView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_BtnPlayIntroduce, this, this.onPlayIntroduce);
            com_main.EventManager.addTouchScaleListener(this.m_cdCity.getChildAt(1), this, this.onClickChendu);
            com_main.EventManager.addTouchScaleListener(this.m_lyCity.getChildAt(1), this, this.onClickLuoyang);
            com_main.EventManager.addTouchScaleListener(this.m_jyCity.getChildAt(1), this, this.onClickJianye);
            // EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onGetReward);
            // EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
            // this.m_cdCity.getChildAt(1)["pixelHitTest"] = true;
            // this.m_lyCity.getChildAt(1)["pixelHitTest"] = true;
            // this.m_jyCity.getChildAt(1)["pixelHitTest"] = true;
        };
        /**移除事件 */
        KingBattleView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        KingBattleView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.AC_KING_TITLE));
            this.addEvent();
            this.m_kingPrivilegeTitle.text = (GCode(CLEnum.AC_KING_PT));
            this.m_kingPrivilegeContent.textFlow = Utils.htmlParser(GCode(CLEnum.AC_KING_PC));
            this.m_statusTitle.text = (GCode(CLEnum.AC_KING_ST));
            this.m_statusContent.textFlow = Utils.htmlParser(GCode(CLEnum.AC_KING_SC));
            this.refreshTime();
            this.showItem();
            // this.updateCountry();
        };
        // public updateCountry() {
        //     const data: string[] = [GCode(CLEnum.STATE_WEI), GCode(CLEnum.STATE_SHU), GCode(CLEnum.STATE_WU), GCode(CLEnum.STATE_ZL)]
        //     const cityInfos: number[] = [48, 16, 42]
        //     for (let index = 0; index < cityInfos.length; index++) {
        //         let cityInfo: gameProto.ICityInfo = WorldModel.getCityBuildInfo(cityInfos[index]);
        //         if (isNull(cityInfo))
        //             continue;
        //         let cityLab = this[`m_${cityInfos[index]}_Coun`] as eui.Label;
        //         cityLab.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.AC_KING_BLONG, data[cityInfo.country - 1]));
        //     }
        // }
        /**刷新倒计时显示 */
        KingBattleView.prototype.refreshTime = function () {
            this.m_tAcVo = ActivityModel.getActivityVo(AcViewType.THRONE);
            if (!this.m_tAcVo || TimerUtils.getServerTimeMill() > this.m_tAcVo.openDate) {
                this.m_lbTime.visible = false;
                return;
            }
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            this.updateTime();
        };
        /**刷新倒计时 */
        KingBattleView.prototype.updateTime = function () {
            if (TimerUtils.getServerTimeMill() > this.m_tAcVo.openDate) {
                Utils.TimerManager.remove(this.updateTime, this);
                this.m_lbTime.visible = false;
                return;
            }
            var time = Math.floor((this.m_tAcVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
            if (time <= 0) {
                Utils.TimerManager.remove(this.updateTime, this);
                return;
            }
            this.m_lbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.AC_KING_TIME, Utils.DateUtils.getFormatBySecond(time, 1)));
        };
        /**显示奖励 */
        KingBattleView.prototype.showItem = function () {
            var reward = ConstUtil.getString(IConstEnum.AC_KING_BATTLE_AWARD);
            var arwardList = Utils.parseCommonItemJson(reward);
            this.m_awardList.removeChildren();
            for (var i = 0; i < arwardList.length; i++) {
                var itemView = com_main.ComItemNew.create("base");
                itemView.scaleX = itemView.scaleY = 0.8;
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_awardList.addChild(itemView);
            }
        };
        //点击玩法介绍
        KingBattleView.prototype.onPlayIntroduce = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.AC_KING_DES), title: GCode(CLEnum.AC_KING_TITLE) });
        };
        //点击成都
        KingBattleView.prototype.onClickChendu = function () {
            var param = { type: 106, param: 5, tips: "1" };
            FunctionModel.turnWorldMap(param);
        };
        //点击洛阳
        KingBattleView.prototype.onClickLuoyang = function () {
            var param = { type: 106, param: 16, tips: "1" };
            FunctionModel.turnWorldMap(param);
        };
        //点击建业
        KingBattleView.prototype.onClickJianye = function () {
            var param = { type: 106, param: 42, tips: "1" };
            FunctionModel.turnWorldMap(param);
        };
        KingBattleView.NAME = 'KingBattleView';
        return KingBattleView;
    }(com_main.CView));
    com_main.KingBattleView = KingBattleView;
})(com_main || (com_main = {}));

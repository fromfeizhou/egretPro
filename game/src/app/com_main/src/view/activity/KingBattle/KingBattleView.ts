module com_main {
	/**
	 * 封王战
	 */
    export class KingBattleView extends CView {
        public static NAME = 'KingBattleView';
        public m_apopUp: com_main.APopUp;
        public m_cdCity: eui.Group;
        public m_48_Coun: eui.Label;
        public m_lyCity: eui.Group;
        public m_16_Coun: eui.Label;
        public m_jyCity: eui.Group;
        public m_42_Coun: eui.Label;
        public m_BtnPlayIntroduce: com_main.ComButton;
        public m_lbTime: eui.Label;
        public m_gKingPrivilege: eui.Group;
        public m_kingPrivilegeTitle: eui.Label;
        public m_kingPrivilegeContent: eui.Label;
        public m_gStatus: eui.Group;
        public m_statusTitle: eui.Label;
        public m_statusContent: eui.Label;
        public m_awardList: eui.Group;




        private m_tAcVo: ActivityVo;
        private m_nCountTime: number;

        public constructor() {
            super();
            this.name = KingBattleView.NAME;
            this.initApp("activity/kingBattle/KingBattleSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.S2C_ONLINE_REWARD: {
                //     this.inittem();
                //     break;
                // }
            }
        }
        public onDestroy(): void {
            super.onDestroy();
            Utils.TimerManager.remove(this.updateTime, this);
            this.removeEvent();
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_BtnPlayIntroduce, this, this.onPlayIntroduce);
            EventManager.addTouchScaleListener(this.m_cdCity.getChildAt(1), this, this.onClickChendu);
            EventManager.addTouchScaleListener(this.m_lyCity.getChildAt(1), this, this.onClickLuoyang);
            EventManager.addTouchScaleListener(this.m_jyCity.getChildAt(1), this, this.onClickJianye);

            // EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onGetReward);
            // EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);

            // this.m_cdCity.getChildAt(1)["pixelHitTest"] = true;
            // this.m_lyCity.getChildAt(1)["pixelHitTest"] = true;
            // this.m_jyCity.getChildAt(1)["pixelHitTest"] = true;
        }

        /**移除事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_apopUp.setTitleLabel(GCode(CLEnum.AC_KING_TITLE));

            this.addEvent();

            this.m_kingPrivilegeTitle.text = (GCode(CLEnum.AC_KING_PT));
            this.m_kingPrivilegeContent.textFlow = Utils.htmlParser(GCode(CLEnum.AC_KING_PC));

            this.m_statusTitle.text = (GCode(CLEnum.AC_KING_ST));
            this.m_statusContent.textFlow = Utils.htmlParser(GCode(CLEnum.AC_KING_SC));

            this.refreshTime();
            this.showItem();
            // this.updateCountry();
        }
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
        private refreshTime() {
            this.m_tAcVo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.THRONE);
            if (!this.m_tAcVo || TimerUtils.getServerTimeMill() > this.m_tAcVo.openDate) {
                this.m_lbTime.visible = false;
                return;
            }
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            this.updateTime();
        }

        /**刷新倒计时 */
        private updateTime() {
            if (TimerUtils.getServerTimeMill() > this.m_tAcVo.openDate) {
                Utils.TimerManager.remove(this.updateTime, this);
                this.m_lbTime.visible = false;
                return;
            }
            let time = Math.floor((this.m_tAcVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
            if (time <= 0) {
                Utils.TimerManager.remove(this.updateTime, this);
                return;
            }
            this.m_lbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.AC_KING_TIME, Utils.DateUtils.getFormatBySecond(time, 1)));

        }

        /**显示奖励 */
        private showItem() {
            let reward = ConstUtil.getString(IConstEnum.AC_KING_BATTLE_AWARD)
            let arwardList = Utils.parseCommonItemJson(reward);
            this.m_awardList.removeChildren();
            for (let i = 0; i < arwardList.length; i++) {
                let itemView = ComItemNew.create("base");
                itemView.scaleX = itemView.scaleY = 0.8;
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_awardList.addChild(itemView);
            }
        }

        //点击玩法介绍
        public onPlayIntroduce() {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.AC_KING_DES), title: GCode(CLEnum.AC_KING_TITLE) });
        }

        //点击成都
        public onClickChendu() {
            let param: com_main.IWorldMapData = { type: 106, param: 5, tips: "1" };
            FunctionModel.turnWorldMap(param);
        }
        //点击洛阳
        public onClickLuoyang() {
            let param: com_main.IWorldMapData = { type: 106, param: 16, tips: "1" };
            FunctionModel.turnWorldMap(param);
        }
        //点击建业
        public onClickJianye() {
            let param: com_main.IWorldMapData = { type: 106, param: 42, tips: "1" };
            FunctionModel.turnWorldMap(param);
        }

    }
}
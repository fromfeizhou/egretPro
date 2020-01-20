module com_main {

    /**
     * 军营系统
     * @export
     * @class CampNorView
     * @extends CView
     */
    export class CrossServerDetailWnd extends CView {

        public static readonly NAME = "CrossServerDetailWnd";
        public m_MainTopNew: com_main.MainTopNew;
        public m_pRoot: eui.Group;
        public m_bRule: com_main.CImage;
        public m_lbCity: com_main.CLabel;
        public m_pBtn: com_main.ComButton;
        public m_btnWelfare: eui.Group;
        public m_ownKing: com_main.CrossServerJobCell;
        public m_ownGeneral_0: com_main.CrossServerJobCell;
        public m_ownGeneral_1: com_main.CrossServerJobCell;
        public m_ownGeneral_2: com_main.CrossServerJobCell;
        public m_ownResult: eui.Group;
        public m_ownResultImg: eui.Image;
        public m_enemyKing: com_main.CrossServerJobCell;
        public m_enemyGeneral_0: com_main.CrossServerJobCell;
        public m_enemyGeneral_1: com_main.CrossServerJobCell;
        public m_enemyGeneral_2: com_main.CrossServerJobCell;
        public m_enemyResult: eui.Group;
        public m_enemyResultImg: eui.Image;
        public m_cityIcon: com_main.CImage;
        public m_cityName: com_main.CLabel;
        public m_pAWard: eui.Group;
        public m_RewardRoot: eui.Group;
        public m_pGTime: eui.Group;
        public m_openTime: com_main.CLabel;
        public m_pStateBtn: com_main.ComButton;






        private m_ownServerWarVo: gameProto.ServerWarVo;
        private m_emenyServerWarVo: gameProto.ServerWarVo;
        private m_city: number
        private m_ownWin = CrossServerResultState.NO_RESULT;
        public constructor() {
            super();
            this.name = CrossServerCampView.NAME;

            this.initApp("cross/CrossServerDetailWndSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {



            }
        }
        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_pBtn.setTitleLabel(GCode(CLEnum.CROSS_SAND_VIEW));
            this.addEvent();
            this.refreshDetailView();
        }
        /**刷新界面数据 */
        public refreshDetailView() {
            let data: gameProto.IS2C_CROSS_SERVER_WAR_RIVAL_INFO = CrossModel.getCrossDetialData();
            this.m_ownServerWarVo = data.warA;
            this.m_emenyServerWarVo = data.warB;
            this.m_ownWin = data.win;
            this.m_city = data.warCityId;
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CROSS_WAR_TITLE))
            if (this.m_ownServerWarVo) {
                this.refreshCampData(true, this.m_ownServerWarVo)
            }
            if (this.m_emenyServerWarVo) {
                this.refreshCampData(false, this.m_emenyServerWarVo)
            }
            this.refreshCityData();
            this.refrshState();
            this.refrshOpenTime();
            this.updateWelfare();
            Utils.toStageBestScaleHeigt(this.m_pRoot);
        }
        /**刷新我方和敌方数据*/
        public refreshCampData(isOwn: boolean = true, serverWarVo: gameProto.ServerWarVo) {
            let camp: string = isOwn ? "own" : "enemy";
            (this[`m_${camp}King`] as com_main.CrossServerJobCell).Init(serverWarVo.emperorData, GCode(CLEnum.CROSS_JOB_KING), serverWarVo.serverId);
            (this[`m_${camp}General_0`] as com_main.CrossServerJobCell).Init(serverWarVo.weiKingData, GCode(CLEnum.CROSS_JOB_L));
            (this[`m_${camp}General_1`] as com_main.CrossServerJobCell).Init(serverWarVo.shuKingData, GCode(CLEnum.CROSS_JOB_M));
            (this[`m_${camp}General_2`] as com_main.CrossServerJobCell).Init(serverWarVo.wuKingData, GCode(CLEnum.CROSS_JOB_R));
        }
        /**刷新城池数据 */
        public refreshCityData() {
            let crossCityCfg: CrossServerCityConfig = C.CrossServerCityConfig[this.m_city];
            this.m_cityIcon.visible = unNull(crossCityCfg);
            this.m_pAWard.visible = unNull(crossCityCfg);
            if (isNull(crossCityCfg)) {
                this.m_lbCity.text = GCode(CLEnum.CROSS_TIPS1);
                // this.m_cityName.text = GCode(CLEnum.CROSS_TIPS1);
                this.m_cityName.text = CrossModel.getStateName()
                this.m_RewardRoot.removeChildren();
                return;
            }
            this.m_lbCity.text = `${CrossModel.getCrossCityTypeName(crossCityCfg.cityType)}【${crossCityCfg.cityName}】`;
            this.m_cityName.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CROSS_CITY_NAME, crossCityCfg.cityName, crossCityCfg.cityType))

            this.m_cityIcon.texture = RES.getRes(`${crossCityCfg.icon}_png`);
            this.m_RewardRoot.removeChildren();
            let rewardCfg = CrossModel.getCrossServerRewardConfig(CrossRewardType.WIN_SERVER, crossCityCfg.cityType);
            let rewardList0 = rewardCfg.reward as IItemInfo[];
            for (let i = 0, len = rewardList0.length; i < len; i++) {
                let itemView = ComItemNew.create("count");
                itemView.scaleX = 0.8;
                itemView.scaleY = 0.8;
                itemView.setItemInfo(rewardList0[i].itemId, rewardList0[i].count);
                this.m_RewardRoot.addChild(itemView);
            }
        }
        /**刷新时间 */
        public refrshOpenTime() {
            let time = CrossModel.openTime;
            let subTime = CrossModel.openTime - TimerUtils.getServerTime();
            this.m_pGTime.visible = unNull(subTime) && subTime > 0;
            let timeStr = Utils.DateUtils.getDateStr(time, 2)
            this.m_openTime.textFlow = Utils.htmlParser(timeStr);
        }
        /**刷新按钮状态 */
        public refrshState() {
            this.updateCampResult(true)//我方
            this.updateCampResult(false)//对方
            this.m_pStateBtn.setTitleLabel(GCode(CLEnum.CROSS_ENTER_WAR));
            this.m_pBtn.setTitleLabel(GCode(CLEnum.CROSS_SAND_VIEW));
            this.m_pStateBtn.visible = CrossModel.isWar() || CrossModel.crossStatus == CrossServerState.MATCH_SUC;
        }
        public updateCampResult(isOwn: boolean = true) {
            let camp: string = isOwn ? "own" : "enemy";
            (this[`m_${camp}Result`] as eui.Group).visible = this.m_ownWin != CrossServerResultState.NO_RESULT;
            (this[`m_${camp}ResultImg`] as eui.Image).visible = this.m_ownWin != CrossServerResultState.NO_RESULT;
            (this[`m_${camp}ResultImg`] as eui.Image).source = (this.m_ownWin == CrossServerResultState.WIN && isOwn) || (this.m_ownWin == CrossServerResultState.FAIL && !isOwn) ? "lb_ty1_s_png" : "lb_ty4_b_png"
        }
        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pStateBtn, this, this.onBtnStateHandler);
            EventManager.addTouchScaleListener(this.m_pBtn, this, this.onBtnSandTable);
            EventManager.addTouchScaleListener(this.m_bRule, this, this.onBtnRule);
            EventManager.addTouchScaleListener(this.m_btnWelfare, this, this.onclickWelfare);
            EventMgr.addEvent(CrossWarEvent.CROSS_SERVER_STATUS, this.onServerStatus, this);
        }
        private removeEvent() {
            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(CrossWarEvent.CROSS_SERVER_STATUS, this);
        }
        private onServerStatus() {
            this.updateWelfare();
        }
        /**更新每日福利 */
        private updateWelfare() {
            // 每日福利
            this.m_btnWelfare.visible = CrossModel.rewardStatus == 1;
        }
        private onBtnStateHandler(pvt: egret.TouchEvent) {
            switch (CrossModel.crossStatus) {
                case CrossServerState.MATCH_SUC:
                case CrossServerState.WALL_WAR: {
                    SceneManager.enterScene(SceneEnums.CROSS_WALL_WAR_MAP);
                    break;
                }
                case CrossServerState.CITY_WAR: {
                    SceneManager.enterScene(SceneEnums.CROSS_WAR_MAP);
                }
            }
        }
        private onclickWelfare() {
            CrossProxy.C2S_CROSS_SERVER_GET_DAY_REWARD();
        }
        private onBtnSandTable() {
            CrossModel.openSandTable();
        }
        private onBtnRule() {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.CROSS_BZWD), title: GCode(CLEnum.WOR_HELP_TITLE) });
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
    }

}

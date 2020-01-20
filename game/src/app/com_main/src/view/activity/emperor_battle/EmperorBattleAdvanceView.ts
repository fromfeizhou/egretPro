module com_main {
    /**
     * 襄阳战（帝位争夺）
     * 1.预告UI Advance
     */
    export class EmperorBattleAdvanceView extends CView {
        public static NAME = 'EmperorBattleAdvanceView';
        // UI控件
        private m_apopUp: com_main.APopUp;
        private m_pBtnInfo: eui.Group;
        private m_awardList: eui.Group;
        private m_pBtnGet: com_main.ComButton;
        private m_pBtnJoin: com_main.ComButton;
        private m_labDes: eui.Label;
        private m_labTime: eui.Label;
        private m_labPrivilege: eui.Label;
        private m_labEffect: eui.Label;
        private m_btnEmp: com_main.CImage;
        private m_labPrivilegeContent: eui.Label;
        private m_labEffectContent: eui.Label;
        private m_labEffectNum: eui.Label;
        private m_xyCity: eui.Group;
        private m_imgXy: eui.Image;
        private m_labEmp: eui.Label;
        private m_imgCountry: eui.Image;
        // vo数据
        private m_empVo: AcEmperorBattleVO;

        public constructor() {
            super();
            this.name = EmperorBattleAdvanceView.NAME;
            this.initApp("activity/emperorBattle/EmperorBattleAdvanceSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_XIANGYANG_EMPROR_COUNTRY_REWARD,
                ProtoDef.S2C_COUNTRY_EMPEROR_INFO
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_EMPROR_COUNTRY_REWARD: {
                    let data = body as gameProto.IS2C_XIANGYANG_EMPROR_COUNTRY_REWARD;
                    if (data) this.refreshGetItem(data.message);
                    break;
                }
                case ProtoDef.S2C_COUNTRY_EMPEROR_INFO: {
                    CountryModel.setCountryEmperorInfo(body);
                    this.refreshBtnGet();
                    this.refreshEmperor();
                    break;
                }
            }
        }

        public onDestroy(): void {
            Utils.TimerManager.remove(this.updateTime, this);
            this.removeEvent();
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.XIANGYANG_ADVANCE_VIEW]);
        }

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnInfo, this, this.onclickInfo);
            EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onclickGet);
            EventManager.addTouchScaleListener(this.m_pBtnJoin, this, this.onclickJoin);
            EventManager.addTouchScaleListener(this.m_btnEmp, this, this.onclickEmp);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_apopUp.setTitleLabel(GCode(CLEnum.XIANGYANG_TITLE));
            this.addEvent();

            this.m_empVo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);

            // this.m_labDes.text = GCode(CLEnum.AC_KING_PT/*襄阳战开始后，第一队世界编队将自动参战*/);
            this.m_labDes.visible = false;

            this.m_labPrivilege.text = (GCode(CLEnum.XIANGYANG_PRIVILEGE));
            this.m_labPrivilegeContent.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_PRIVILEGE_DES));
            this.m_labEffect.text = (GCode(CLEnum.XIANGYANG_EFFECT));
            this.m_labEffectContent.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_EFFECT_DES));
            this.m_labEffectNum.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_EFFECT_NUM));

            // 城池发光
            Utils.isGlow(true, this.m_imgXy, 0XEECE79, 0.8);

            this.refreshBtnJoin();
            this.refreshBtnGet();
            this.refreshEmperor();
            this.showItem();
            this.refreshTime();
        }

        private refreshTime() {
            if (!this.m_empVo || TimerUtils.getServerTimeMill() > this.m_empVo.closeDate) {
                // SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
                this.m_labTime.text = "襄阳战停战期";
                AcBattleProxy.C2S_XIANGYANG_INFO();
                CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
                return;
            }
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            this.updateTime();
        }

        /**刷新倒计时 */
        private updateTime() {
            if (TimerUtils.getServerTimeMill() > this.m_empVo.closeDate) {
                Utils.TimerManager.remove(this.updateTime, this);
                // SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
                this.m_labTime.text = "襄阳战停战期";
                AcBattleProxy.C2S_XIANGYANG_INFO();
                CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
                return;
            }
            let time = Math.floor((this.m_empVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
            if (time <= 0) {
                // let stopTime = Math.floor((this.m_empVo.closeDate - TimerUtils.getServerTimeMill()) / 1000);
                // this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_FIGHT_TIME, Utils.DateUtils.getFormatBySecond(stopTime, 4)));
                EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_TASK, CLEnum.XIANGYANG_TITLE));
                UpManager.history();
                return;
            }
            this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_FIGHT_TIME, Utils.DateUtils.getFormatBySecond(time, 4)));
        }

        //点击规则说明
        private onclickInfo() {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.XIANGYANG_DES), title: GCode(CLEnum.XIANGYANG_TITLE) });
        }

        //点击领取按钮
        private onclickGet(e: egret.Event) {
            if (this.m_empVo.m_data.emperorCountryReard) {
                AcBattleProxy.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD();
            } else {
                error("MissionView: data is null!");
            }
        }

        //点击报名按钮
        private onclickJoin(e: egret.Event) {
            let minJoinLevel: number = ConstUtil.getValue(IConstEnum.XIANGYANG_LEVEL_LIMIT);
            if (RoleData.level < minJoinLevel) {
                EffectUtils.showTips(GCodeFromat(CLEnum.XIANGYANG_JOIN_LEVEL, minJoinLevel));
            } else {
                EffectUtils.showTips(GCode(CLEnum.XIANGYANG_JOIN));
                if (!this.m_empVo.isJoin) {
                    this.m_empVo.isJoin = true;
                    this.refreshBtnJoin();
                }
            }
        }

        //点击称帝特权详情
        private onclickEmp(e: egret.Event) {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.XIANGYANG_PRIVILEGE_TXT), title: GCode(CLEnum.XIANGYANG_PRIVILEGE) });
        }

        /**显示奖励 */
        private showItem() {
            let militoryAwardCfg: XiangyangEveryDayRewardConfig = C.XiangyangEveryDayRewardConfig[1];
            let reward = militoryAwardCfg.reward;
            let rewardList = Utils.parseCommonItemJson(reward);
            this.m_awardList.removeChildren();
            for (let i = 0; i < rewardList.length; i++) {
                let itemView = ComItemNew.create("name_num");
                itemView.scaleX = itemView.scaleY = 0.8;
                itemView.setItemInfo(rewardList[i].itemId, rewardList[i].count);
                this.m_awardList.addChild(itemView);
            }
        }

        private refreshGetItem(message?: gameProto.IValuesMessage[]) {
            GetRewardView.getInstance().show(message);
            this.m_empVo.m_data.emperorCountryReard = false;
            this.refreshBtnGet();
        }

        private refreshBtnJoin() {
            Utils.isGray(this.m_empVo.isJoin, this.m_pBtnJoin);
            this.m_pBtnJoin.setTitleLabel(this.m_empVo.isJoin ? GCode(CLEnum.JOIN_DONE) : GCode(CLEnum.JOIN));
            this.m_pBtnJoin.enabled = !this.m_empVo.isJoin;
        }

        private refreshBtnGet() {
            // 数值显示
            let ecrState: boolean = isNull(this.m_empVo.m_data) ? false : this.m_empVo.m_data.emperorCountryReard;
            // 是不是皇帝国家成员
            let info: gameProto.S2C_COUNTRY_EMPEROR_INFO = CountryModel.getCountryEmperorInfo();
            let btnGetLabel = GCode(CLEnum.TAKE_OUT);
            if (Object.keys(info).length == 0) {
                btnGetLabel = GCode(CLEnum.TAKE_OUT);
            } else {
                if (info.country === RoleData.countryId) {
                    btnGetLabel = ecrState ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.TAKE_OUT_END);
                    this.m_pBtnGet.enabled = ecrState;
                } else {
                    btnGetLabel = GCode(CLEnum.TAKE_OUT);
                }
            }
            Utils.isGray(!ecrState, this.m_pBtnGet);
            this.m_pBtnGet.setTitleLabel(btnGetLabel);
            this.m_pBtnGet.enabled = ecrState;
        }

        /**显示上一届皇帝 */
        private refreshEmperor() {
            let info: gameProto.S2C_COUNTRY_EMPEROR_INFO = CountryModel.getCountryEmperorInfo();
            if (Object.keys(info).length == 0) {
                this.m_imgCountry.visible = false;
                this.m_imgCountry.source = "common_country1_" + CountryType.NONE + "_png";
                this.m_labEmp.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_CITY));
            } else {
                this.m_imgCountry.visible = true;
                this.m_imgCountry.source = "common_country1_" + info.country + "_png";
                this.m_labEmp.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_EMPEROR_NAME, info.nickName));
            }

        }
    }
}
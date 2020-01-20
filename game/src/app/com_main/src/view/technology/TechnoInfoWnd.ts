module com_main {
    export class TechnoInfoWnd extends CView {
        public static NAME = 'TechnoInfoWnd';

        public m_pPopUp: com_main.APopUp;
        public m_technoCell: com_main.TechnoCell;
        public m_labPower: eui.Label;
        public m_labDec: com_main.CLabel;
        public m_labCurDesc: com_main.CLabel;
        // public m_labCurLv: com_main.CLabel;
        public m_labNextDesc: com_main.CLabel;
        // public m_labNextLv: com_main.CLabel;
        public m_pBtnRoot: eui.Group;
        public m_btnStudyNow: com_main.ComCostTextButton;
        public m_btnStudy: com_main.ComCostTextButton;
        public m_pList: eui.List;


        private m_nId: number;
        private m_tTechVo: TechnoVo;
        private m_tcollection: eui.ArrayCollection;
        private m_tTimeData: gameProto.ITechnologyUpgradeState;

        public constructor(id: number) {
            super();
            this.name = TechnoInfoWnd.NAME;
            this.m_nId = id;
            this.m_tTechVo = TechnoModel.getTechVoById(this.m_nId);
            this.initApp("technology/TechnoInfoWndSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_TECHNOLOGY_UPGRADE,
                ProtoDef.S2C_TECHNOLOGY_INFO,
				ProtoDef.S2C_BUILDING_SPEED,//建筑加速
                ProtoDef.S2C_BUILDING_UPLEVEL,//建筑升级
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
				case ProtoDef.S2C_BUILDING_SPEED://建筑加速
				case ProtoDef.S2C_BUILDING_UPLEVEL://建筑升级
                case ProtoDef.S2C_TECHNOLOGY_INFO:
                case ProtoDef.S2C_TECHNOLOGY_UPGRADE: {
                    this.refreshView();
                    break;
                }

            }
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeTimer();
            EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH, this);
            EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_TIME_UP, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            EventManager.addTouchScaleListener(this.m_btnStudyNow, this, this.onClickStudyNow);
            EventManager.addTouchScaleListener(this.m_btnStudy, this, this.onClickStudy);
            EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH, this.onInfoWndSwitch, this);
            EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoTimeUp, this);
            /**资源更新 */
            EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);

            this.m_tcollection = new eui.ArrayCollection([]);
            this.m_pList.itemRenderer = com_levelup_conditions_cell;
            this.m_pList.dataProvider = this.m_tcollection;
            this.refreshView();


        }
        /**资源更新 */
        public onRoleResource() {
            let lvCfg = TechnoModel.getTechnoLvCfg(this.m_nId, this.m_tTechVo.level);
            if (!lvCfg) return;
            this.refreshCostView(lvCfg);
        }
        /**切换 */
        private onInfoWndSwitch(id: number) {
            if (this.m_nId == id) return;
            this.m_nId = id;
            this.m_tTechVo = TechnoModel.getTechVoById(this.m_nId);
            this.refreshView();
        }

        /**升级 */
        private onTechnoTimeUp(id: number) {
            if (this.m_nId == id) {
                this.refreshView();
            }
        }

        /**刷新显示 */
        private refreshView() {
            if (!this.m_tTechVo) return;
            this.m_tTechVo = TechnoModel.getTechVoById(this.m_nId);
            this.m_tTechVo.init();
            this.removeTimer();

            if (TechnoModel.isInUpLv(this.m_nId)) {
                this.currentState = 'inSpeed';
                this.m_btnStudy.setTitleLabel(GCode(CLEnum.SPEED_AD));
                this.startTimer();
            } else {
                if (this.m_tTechVo.level >= this.m_tTechVo.maxLevel) {
                    this.currentState = 'max';
                } else {
                    this.currentState = 'base';
                }
                this.m_btnStudy.setTitleLabel(GCode(CLEnum.TEC_UP_START));
            }
            let cfg = this.m_tTechVo.techCfg;
            this.m_technoCell.technoId = this.m_nId;
            this.m_technoCell.removeRed();
            this.m_pPopUp.setTitleLabel(GLan(cfg.name));

            // this.m_labCurLv.text = this.m_tTechVo.level + '';
            // this.m_labNextLv.text = (this.m_tTechVo.level + 1) + '';

            //上一等级增强效果
            this.m_labCurDesc.text = this.m_tTechVo.techLvlCfg.Desc + "";
            let strs: string[] = this.m_tTechVo.techLvlCfg.effect.split("_");
            // if (strs.length <= 1) {
            //     this.m_labCurLv.text = ``;
            // } else {
            //     let val = strs[1];
            //     this.m_labCurLv.text = ``;
            //     // this.m_labCurLv.text = this.m_tTechVo.techEffCfg.valType ? `${parseInt(val) / 100}%` : `${val}`;
            // }
            // this.m_labCurLv.x = this.m_labCurDesc.x + this.m_labCurDesc.width + 10;

            //下一等级增强效果
            // this.m_labNextDesc.x = this.m_labCurLv.x + this.m_labCurLv.width + 50;
            let nextTechCfg = C.TechnologyConfig[this.m_tTechVo.techCfg.id];
            let nextTechLvlCfg = TechnoModel.getTechnoLvCfg(this.m_tTechVo.id, this.m_tTechVo.level + 1);
            let nextTechEffCfg = C.TechnologyEffectConfig[this.m_tTechVo.techCfg.id];
            if (isNull(nextTechLvlCfg)||isNull(nextTechEffCfg)||!nextTechLvlCfg.level || nextTechLvlCfg.level == 0 || this.m_tTechVo.level == this.m_tTechVo.maxLevel) {
                this.m_labNextDesc.text = GCode(CLEnum.TEC_LEVEL_MAX);
                // this.m_labNextLv.text = ``;
            } else {
                this.m_labNextDesc.text = nextTechLvlCfg.Desc + "";
                let strs2: string[] = nextTechLvlCfg.effect.split("_");
                // if (strs2.length <= 1) {
                //     this.m_labNextLv.text = ``;
                // } else {
                //     let val2 = strs2[1];
                //     this.m_labNextLv.text = ``;
                //     // this.m_labNextLv.text = nextTechEffCfg.valType ? `${parseInt(val2) / 100}%` : `${val2}`;
                // }
                // this.m_labNextLv.x = this.m_labNextDesc.x + this.m_labNextDesc.width + 10;
            }

            let lvCfg = TechnoModel.getTechnoLvCfg(this.m_nId, this.m_tTechVo.level);
            if (!lvCfg) return;
            this.m_labPower.text = lvCfg.power + '';
            // this.m_labDec.text = TechnoModel.getTechnoEffDesc(lvCfg.effect);
            this.m_labDec.text = this.m_tTechVo.techEffCfg.effectDesc;

            let vipLineCfg = C.VipPrivillegesConfig[VipPrivillType.TECHNOLOGY_TIME_REDUCTION];
            let offLine = Number(vipLineCfg['vip' + RoleData.vipLevel]);
            let technoTime = lvCfg.duration - offLine * 60;
            this.m_btnStudyNow.setCostLabel(Utils.TimeGold(technoTime)!=0?Utils.TimeGold(technoTime).toString():GCode(CLEnum.AC_FREE));
            this.m_btnStudyNow.setTitleLabel(GCode(CLEnum.TEC_UP_NOW));
            this.m_btnStudyNow.setCostImg('icon_source_gold_png');

            this.m_btnStudy.setCostLabel(Utils.DateUtils.getFormatBySecond(technoTime, 1));
            this.m_btnStudy.setCostImg('icon_time_png');
            this.refreshCostView(lvCfg);
        }
        // /**重新刷新 */
        // public onRefresh(body?): void {
        //     this.refreshView();
        // }
        /**刷新材料显示 */
        private refreshCostView(lvCfg: TechnologyLevelConfig) {
            if (this.m_tTechVo.isMaxLevel()) {
                this.m_tcollection.replaceAll([]);
            } else {
                let datas = [];
                //等级限制
                if (lvCfg.limitLv > 0) datas.push(new LvUpConditionsBuildInfo(BuildingType.MINISTRY_DEFENCE, lvCfg.limitLv));
                //前置条件 
                let limits = StringUtils.keyValsToNumberArray(lvCfg.limitTechs);
                for (let i = 0; i < limits.length; i++) {
                    datas.push(new LvUpConditionsTechnologyInfo(limits[i].key, limits[i].value));
                }
                //材料
                let itemCosts = Utils.parseCommonItemJson(lvCfg.consume);
                if (itemCosts) {
                    for (let i = 0; i < itemCosts.length; i++) {
                        datas.push(new LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count));
                    }
                }
                this.m_tcollection.replaceAll(datas);
            }
        }

        public startTimer() {
            this.removeTimer()
            this.m_tTimeData = TechnoModel.getTimeData();
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
            this.timeCallback();
        }

        public removeTimer() {
            Utils.TimerManager.remove(this.timeCallback, this);
        }

        public timeCallback() {
            let time = (this.m_tTimeData.end - this.m_tTimeData.speed) - TimerUtils.getServerTime();
            if (time > 0) {
                this.m_btnStudyNow.setCostLabel(Utils.TimeGold(time) + '');
                this.m_btnStudy.setCostLabel(Utils.DateUtils.getFormatBySecond(time, 1));

            } else {
                this.removeTimer();
            }
        }

        private onClickClosebtn() {
            UpManager.history();
        }


        private onClickStudyNow() {
            if (!this.commonUpLvCheck()) return;

            let goldCost = Number(this.m_btnStudyNow.getCostLabel());

            if (PropModel.isItemEnough(PropEnum.GOLD, goldCost, 1)) {
                TechnologyProxy.C2S_TECHNOLOGY_UPGRADE(this.m_nId, true);
            }
        }
        private onClickStudy() {
            //当前科技升级
            if (TechnoModel.isInUpLv(this.m_nId)) {
                Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                    propSpeedType: PropSpeedType.Technology, targetId: this.m_nId,
                    startTime: this.m_tTimeData.start,
                    endTime: this.m_tTimeData.end,
                    speedUpTime: this.m_tTimeData.speed
                });
                return;
            }
            if (!this.commonUpLvCheck()) return;

            TechnologyProxy.C2S_TECHNOLOGY_UPGRADE(this.m_nId, false);
        }

        /**通用检查 */
        private commonUpLvCheck() {
            if (TechnoModel.isInLevelCd()) {
                EffectUtils.showTips(GCode(CLEnum.TEC_UP_FAL), 1, true);
                return false;
            }
            for (let i = 0; i < this.m_tcollection.length; i++) {
                let data = this.m_tcollection.getItemAt(i) as LvUpConditionsBaseInfo;
                if (!data.IsMatch) return false;
            }
            return true;
        }
    }
}
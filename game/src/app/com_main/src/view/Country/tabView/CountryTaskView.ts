module com_main {
    export class CountryTaskView extends DynamicComponent {
        public static NAME = 'CountryTaskView';

        public m_bgRole: com_main.CImage;
        public m_textGroup: eui.Group;
        public m_Title: com_main.CLabel;
        public m_Describe: com_main.CLabel;
        public m_labPro: com_main.CLabel;
        public m_ProgressBar: com_main.ComProgressBar;
        public m_ItemRoot: eui.Group;
        public m_BtnFinish: com_main.ComButton;

        private m_items: ComItemNew[];

        public constructor() {
            super();
            this.name = CountryTaskView.NAME;
            // this.initApp('Country/tabView/CountryTaskViewSkin.exml');
            this.dynamicSkinName = Utils.getAppSkin("Country/tabView/CountryTaskViewSkin.exml");
        }

        protected onShow(){
            this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_ProgressBar.Progress = 0;
            let scaleY = (453 - GameConfig.getSub()) / 453;
            this.m_textGroup.scaleX = scaleY;
            this.m_textGroup.scaleY = scaleY;
            if (RoleData.countryId == CountryType.WEI) {
                this.m_bgRole.source = "icon_wj_b_10_png";
            } else if (RoleData.countryId == CountryType.SHU) {
                this.m_bgRole.source = "icon_wj_b_7_png";
            } else if (RoleData.countryId == CountryType.WU) {
                this.m_bgRole.source = "icon_wj_b_17_png";
            }
            this.addEvent();
            this.Refresh();
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
        //     this.m_ProgressBar.Progress = 0;
        //     let scaleY = (453 - GameConfig.getSub()) / 453;
        //     this.m_textGroup.scaleX = scaleY;
        //     this.m_textGroup.scaleY = scaleY;
        //     if (RoleData.countryId == CountryType.WEI) {
        //         this.m_bgRole.source = "icon_wj_b_10_png";
        //     } else if (RoleData.countryId == CountryType.SHU) {
        //         this.m_bgRole.source = "icon_wj_b_7_png";
        //     } else if (RoleData.countryId == CountryType.WU) {
        //         this.m_bgRole.source = "icon_wj_b_17_png";
        //     }
        //     this.addEvent();
        //     this.Refresh();
        // }



        public Refresh(): void {
            let condition = MissionModel.getCountryTask();
            if (condition) {
                let conditionCfg = C.TaskConditionConfig[condition.conditionBaseId];
                let taskCfg = C.TaskConfig[conditionCfg.taskId];

                this.m_Title.text = taskCfg.title;
                this.m_Describe.text = conditionCfg.title;
                if(condition.state == TaskStatus.REWARD){
                    this.m_Describe.text = '凌晨5点重置'
                }
                this.RefreshRewards(conditionCfg.rewardItem);

                this.m_labPro.text =`${condition.count}/${condition.maxCount}`;
                this.m_ProgressBar.Progress = condition.count / condition.maxCount;

                if (condition.state == TaskStatus.FINISH) {
                    this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
                    this.m_BtnFinish.disabled = false;
                } else {
                    this.m_BtnFinish.setTitleLabel(GCode(CLEnum.GO_TO));
                    if (conditionCfg.turnPanel > 0) {
                        this.m_BtnFinish.disabled = false;
                    } else {
                        this.m_BtnFinish.disabled = true;
                    }
                }
            }
        }


        private RefreshRewards(awards: IItemInfo[]): void {
            if (this.m_items && this.m_items.length > 0) {
                for (let i = 0; i < this.m_items.length; i++) {
                    this.m_ItemRoot.removeChild(this.m_items[i]);
                }
            }
            this.m_items = [];
            let reward: any[] = awards;
            for (let i = 0; i < reward.length; i++) {
                let item: ComItemNew = ComItemNew.create("name_num");
                item.setItemInfo(reward[i].itemId, reward[i].count)
                this.m_items.push(item);
                this.m_ItemRoot.addChild(item);
            }
        }


        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onAddMissionInfo, this);
            EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);

            EventManager.addTouchScaleListener(this.m_BtnFinish, this, this.onBtnFinish);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);

            EventManager.removeEventListeners(this);
        }

        /**领奖 */
        private onBtnFinish(): void {
            let condition = MissionModel.getCountryTask();
            if (condition) {
                let conditionCfg = C.TaskConditionConfig[condition.conditionBaseId];
                if (condition.state == TaskStatus.FINISH) {
                    MissionProxy.send_MISSION_REWARD(conditionCfg.taskId, condition.conditionBaseId);
                } else {
                    if (conditionCfg.turnPanel > 0)
                        FunctionModel.funcToPanel(conditionCfg.turnPanel);
                }
            }
        }

        private onAddMissionInfo(data: IMissionEvt) {
            if (data.type != TaskType.Country && data.type != TaskType.CountryRepeat) return;
            this.Refresh();
        }

        private onUpdateMissionInfo(data: IMissionEvt) {
            if (data.type != TaskType.Country && data.type != TaskType.CountryRepeat) return;
            this.Refresh();
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}
module com_main {
    export class MissionNorView extends CComponent {
        public static NAME = 'MissionNorView';

        public m_scroll: eui.Scroller;
        public m_listItem: eui.List;
        public m_pViewRoot: eui.Group;
        public m_pAllGetRoot: eui.Group;

        protected m_nType: TaskType;
        protected m_tCollection: eui.ArrayCollection;
        private m_nItemWidth: number;
        public m_pBtnAll: com_main.ComButton;
        protected rpyArres: any[];

        public constructor(type: TaskType, width: number, height: number, skinName: string = '') {
            super();
            this.name = MissionNorView.NAME;
            this.m_nType = type;
            this.width = width;
            this.height = height;
            this.skinName = skinName == '' ? Utils.getAppSkin("mission/MissionNorViewSkin.exml") : skinName;
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_scroll.scrollPolicyH = "ScrollPolicy.OFF";
            this.initItemList();
            this.addEvent();
            if (this.m_nType == TaskType.Cultivate || this.m_nType == TaskType.MainCity) this.m_pBtnAll.setTitleLabel(GCode(CLEnum.TASK_GET_ALL));
            Utils.toStageBestScale(this.m_pViewRoot);
        }

        /**获得任务类型 */
        public get taskType() {
            return this.m_nType;
        }

        private initItemList() {
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItem.itemRenderer = MissionViewCell;
            this.m_listItem.dataProvider = this.m_tCollection;
            let res: IMissionEvt[] = [];
            let infos: MissionInfoVo[] = MissionModel.getMissionInfoList(this.m_nType);

            if (infos) {
                for (let i = 0; i < infos.length; i++) {
                    let info = infos[i].getPriorityTask();
                    if (info) {
                        res.push({ taskId: infos[i].taskId, conditionId: info.conditionBaseId, activityId: infos[i].activityId, type: infos[i].taskType });
                    }
                }
            }

            res.sort(this.sortByState.bind(this))
            this.m_tCollection.replaceAll(res);
            this.isShowAllgetBtn();
        }
        private isShowAllgetBtn() {
            /**保存类型为培养的可领取任务 */
            this.rpyArres = MissionModel.getFinishCidByType(this.m_nType);
            this.currentState = ((this.m_nType == TaskType.Cultivate || this.m_nType == TaskType.MainCity) && this.rpyArres && this.rpyArres.length > 0) ? 'foster' : 'base';
        }

        /**排序 */
        public sortByState(a: IMissionEvt, b: IMissionEvt) {
            let stateA = MissionModel.getConditoinInfoById(a.taskId, a.conditionId).state;
            let stateB = MissionModel.getConditoinInfoById(b.taskId, b.conditionId).state;
            
            if (stateA != stateB) {
                if (stateA != TaskStatus.REWARD) {
                    stateA = stateA ^ 1;
                }
                if (stateB != TaskStatus.REWARD) {
                    stateB = stateB ^ 1;
                }
                return stateA - stateB;
            }
            if (a.taskId != b.taskId)
                return a.taskId - b.taskId;
            return a.conditionId - b.conditionId;
        }



        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        protected addEvent() {
            EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);
            EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onAddMissionInfo, this);
            EventMgr.addEvent(MissionEvent.MISSION_DELETE_INFO, this.onDeleteMissionInfo, this);

            EventManager.addTouchScaleListener(this.m_pBtnAll, this, this.onAllClickTask);
        }

        protected removeEvent() {
            EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
            EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            EventMgr.removeEventByObject(MissionEvent.MISSION_DELETE_INFO, this);

            EventManager.removeEventListeners(this);
        }
        /**一键领取 */
        private onAllClickTask() {
            if (this.rpyArres && this.rpyArres.length > 0) {
                MissionProxy.send_MISSION_REWARD_Multi(this.rpyArres);
                this.currentState = ' base';
            }

        }

        private onAddMissionInfo(data: IMissionEvt) {
            if (this.m_nType != data.type) return;
            this.m_tCollection.addItem(data);
            this.m_tCollection.source.sort(this.sortByState.bind(this));
            this.m_tCollection.refresh();
        }

        private onDeleteMissionInfo(data: IMissionEvt) {
            if (this.m_nType != data.type) return;
            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let tmpData: IMissionEvt = this.m_tCollection.source[i];
                if (tmpData.conditionId == data.conditionId) {
                    this.m_tCollection.removeItemAt(i);
                    this.isShowAllgetBtn();
                    break;
                }
            }
        }
        protected onUpdateMissionInfo(data: IMissionEvt) {
            if (this.m_nType != data.type) return;

            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let tmpData: IMissionEvt = this.m_tCollection.source[i];
                if (tmpData.conditionId == data.conditionId) {
                    this.m_tCollection.replaceItemAt(data, i);
                    break;
                }
            }
            this.m_tCollection.source.sort(this.sortByState.bind(this));
            this.m_tCollection.refresh();
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}
module com_main {
    export class SevenDayActivityView extends CView {
        public static NAME = 'SevenDayActivityView';
        public m_pViewRoot: eui.Group;
        public m_lbTime: eui.Label;
        public m_itemScroll: eui.Scroller;
        public m_actiList: eui.List;

        private m_tCollections: eui.ArrayCollection
        private m_acTaskVo: AcTaskVo;
        private m_nTaskId: number;
        private subDay: number;//到第几天了

        public constructor(width: number, height: number, subDay: number) {
            super();
            this.name = SevenDayActivityView.NAME;
            this.initApp("activity/seven/SevenDayActivityViewSkin.exml");
            this.width = width;
            this.height = height;
            this.subDay = subDay;
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

            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_actiList.dataProvider = this.m_tCollections;
            this.m_actiList.itemRenderer = SevenDayActivityCell;
            Utils.toStageBestScale(this.m_pViewRoot);
            this.addEvent();
        }
        /**设置等级 */
        public initData(taskId: number) {
            this.m_itemScroll.stopAnimation();
            this.m_itemScroll.viewport.scrollV = 0;
            this.m_nTaskId = taskId;
            this.m_acTaskVo = ActivityModel.getActivityVo<AcTaskVo>(AcViewType.OPEN_SEVEN);
            if (!this.m_acTaskVo) return;
            this.refreshActiviCell();
        }
        /**
         * 创建列表数据
         */
        public refreshActiviCell() {
            if (!this.m_acTaskVo) return;

            let vo: MissionInfoVo = this.m_acTaskVo.taskInfoDic[this.m_nTaskId];
            let res: ISevenDayAcCell[] = [];
            for (let condition of vo.condition) {
                let cId = condition.conditionBaseId;
                let cfg = this.m_acTaskVo.configsII[cId];
                res.push({
                    taskId: vo.taskId, cId: cId, subDay: this.subDay, title: cfg.title,
                    condintion: condition, rewardDay: vo.cfg.rewardDay, rewardItem: cfg.rewardItem
                });
            }
            res.sort(this.sortByState.bind(this))
            this.m_tCollections.replaceAll(res);
        }

        /**排序 */
        public sortByState(a: ISevenDayAcCell, b: ISevenDayAcCell) {
            let stateA = this.m_acTaskVo.taskInfoDic[a.taskId].getTaskConditionState(a.cId);
            let stateB = this.m_acTaskVo.taskInfoDic[b.taskId].getTaskConditionState(b.cId);
            if (stateA != stateB) {
                if (stateA != TaskStatus.REWARD) {
                    stateA = stateA ^ 1;
                }
                if (stateB != TaskStatus.REWARD) {
                    stateB = stateB ^ 1;
                }
                return stateA - stateB;
            }
            return a.cId - b.cId;
        }

        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onMissionUpdate, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
        }

        /**任务更新 */
        protected onMissionUpdate(data: IMissionEvt) {
            let vo = ActivityModel.getActivityVoById<AcTaskVo>(data.activityId);
            if (vo && vo.viewType == AcViewType.OPEN_SEVEN) {
                this.refreshActiviCell();
            }
        }

    }
}
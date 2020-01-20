module com_main {
    export class RepeatActivityView extends CView implements IRepeatActivityWnd {
        public static NAME = 'RepeatActivityView';
        public m_pViewRoot: eui.Group;
        public m_listItem: eui.List;
        public m_imgIcon: eui.Image;

        /**面板类型 */
        public activityType: AcViewType;

        public bInit: boolean;
        private m_tCollection: eui.ArrayCollection
        private m_nTaskId: number = 0;
        private m_acTaskVo: AcTaskVo;
        public constructor(activiType: number, taskId = 0) {
            super();
            this.activityType = activiType;
            this.m_nTaskId = taskId;
            this.name = RepeatActivityView.NAME;
            this.initApp("activity/RepeatActivityViewSkin.exml");

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

            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItem.dataProvider = this.m_tCollection;
            this.m_listItem.itemRenderer = RepeatActivityCell;

        }
        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            this.bInit = true;

            let activiVo = ActivityModel.getActivityVo<AcTaskVo>(AcViewType.NOR_SEVEN);
            this.m_imgIcon.source = Utils.GetResName('hd_' + activiVo.viewType + '_jpg');
            if (!activiVo) return;
            this.m_acTaskVo = activiVo;

            let vo = activiVo.taskInfoDic[this.m_nTaskId];
            let list = vo.getTaskConditionList();
            let res = [];
            for (let i = 0; i < list.length; i++) {
                let condition = list[i];
                let conditionId = condition.conditionBaseId;
                let cfg = this.m_acTaskVo.configsII[conditionId]
                let param: IActivityCellRD = {
                    taskId: vo.taskId, conditionId: conditionId, title: cfg.title,
                    condition: condition, rewardItem: cfg.rewardItem
                };
                res.push(param);
            }
            this.refreshActiviData(res);
            this.refresh();

            this.addEvent();
        }
        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pViewRoot);
        }

        /**刷新显示 */
        public refreshView() {
            this.refresh();
        }
        /**
         * 创建列表数据
         */
        public refreshActiviData(res: IActivityCellRD[]) {
            res.sort(this.sortBystate.bind(this));
            this.m_tCollection.replaceAll(res);

        }
        /**排序 */
        public sortBystate(a: IActivityCellRD, b: IActivityCellRD) {
            let astate = this.m_acTaskVo.taskInfoDic[a.taskId].getTaskConditionState(a.conditionId);
            let bstate = this.m_acTaskVo.taskInfoDic[b.taskId].getTaskConditionState(b.conditionId);
            if (astate != bstate) {
                if (astate != TaskStatus.REWARD) {
                    astate = astate ^ 1;
                }
                if (bstate != TaskStatus.REWARD) {
                    bstate = bstate ^ 1;
                }
                return astate - bstate;
            }
            if (a.conditionId > b.conditionId) {
                return 1;
            } else if (a.conditionId < b.conditionId) {
                return -1;
            } else {
                return 0;
            }
        }

        /**刷新列表数据 */
        private refresh() {
            this.m_tCollection.source.sort(this.sortBystate.bind(this));
            this.m_tCollection.refresh();
        }
        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

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
            if (vo && vo.viewType == AcViewType.NOR_SEVEN) {
                this.refreshView();
            }
        }

    }

    interface IActivityCellRD {
        taskId: number;
        conditionId: number;
        condition: gameProto.ITaskCondition;
        title: string;
        rewardItem: IItemInfo[];
    }
    class RepeatActivityCell extends eui.ItemRenderer {
        public m_labName: eui.Label;
        public m_labCount: eui.Label;
        public m_RewardRoot: eui.Group;
        public m_pBtn: com_main.ComButton;
        public m_pAwardState: eui.Group;
        public m_LboxState: eui.Label;

        private m_status: number;
        private m_tData: IActivityCellRD;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/RepeatActivityCellSkin.exml");
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickAward);
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        public onDestroy() {
            EventManager.removeEventListener(this.m_pBtn);
        }

        private onClickAward(e) {
            if (this.m_status !== TaskStatus.FINISH)
                return;
            MissionProxy.send_MISSION_REWARD(this.m_tData.taskId, this.m_tData.conditionId);
        }

        public dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (!this.m_tData) return;

            let arwardList = this.m_tData.rewardItem;
            let cdInfo = this.m_tData.condition;
            this.m_status = cdInfo.state;

            let mProgressValue = cdInfo.count > cdInfo.maxCount ? cdInfo.maxCount : cdInfo.count;
            this.m_labCount.text = mProgressValue + "/" + cdInfo.maxCount;

            Utils.isGray(cdInfo.state == TaskStatus.PROCESSING, this.m_pBtn);
            this.m_pBtn.visible = cdInfo.state != TaskStatus.REWARD;
            this.m_pBtn.enabled = cdInfo.state !== TaskStatus.PROCESSING;

            this.m_pBtn.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_pAwardState.visible = cdInfo.state == TaskStatus.REWARD;
            this.m_labName.textFlow = Utils.htmlParser(this.m_tData.title);
            let i = 0;
            for (i = 0; i < arwardList.length; i++) {
                if (this.m_RewardRoot.numChildren > i) {
                    (this.m_RewardRoot.getChildAt(i) as ComItemNew).setItemInfo(arwardList[i].itemId, arwardList[i].count);
                } else {
                    let itemView = ComItemNew.create("count");
                    itemView.scaleX = 0.8;
                    itemView.scaleY = 0.8;
                    itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                    this.m_RewardRoot.addChild(itemView);
                }
            }
            for (; i < this.m_RewardRoot.numChildren; i++) {
                this.m_RewardRoot.removeChildAt(i);
            }

        }


    }
}
module com_main {
    export class MissionDailyView extends MissionNorView {
        public static NAME = 'MissionDailyView';
        public static PRO_MAX = 940;

        public m_labActivite: com_main.CLabel;
        public m_imgProcess: com_main.CImage;
        public m_pViewRoot:eui.Group;
        public m_itemcell1: com_main.MissionViewItemBox;
        public m_itemcell2: com_main.MissionViewItemBox;
        public m_itemcell3: com_main.MissionViewItemBox;
        public m_itemcell4: com_main.MissionViewItemBox;
        public m_itemcell5: com_main.MissionViewItemBox;

        public constructor(type: TaskType, width: number, height: number) {
            super(type, width, height, Utils.getAppSkin("mission/MissionDailyViewSkin.exml"));
        }

        public onDestroy(): void {
            super.onDestroy();
        }


        protected childrenCreated(): void {
            super.childrenCreated();
            let list = MissionModel.getActiveInfoList();
            for (let i = 1; i <= 5; i++) {
                let item = this[`m_itemcell${i}`] as MissionViewItemBox;
                let info = list[i];
                if (info) {
                    let cfg = C.LivesRewardConfig[info.id];
                    item.x = 112 + cfg.liveness / MissionModel.LIVENESS_MAX * MissionDailyView.PRO_MAX - 30;
                    item.init(info.id);
                }
            }
            this.refreshView();
            Utils.toStageBestScale(this.m_pViewRoot);
        }


        //活跃度刷新
        private refreshView() {
            for (let i = 1; i <= 5; i++) {
                let item = this[`m_itemcell${i}`] as MissionViewItemBox;
                item.updateCell();
            }

            let curVal = MissionModel.getCurActiveNum();
            let rate = curVal / MissionModel.LIVENESS_MAX;
            rate = Math.min(rate, 1);
            this.m_imgProcess.width = rate * MissionDailyView.PRO_MAX;
            this.m_labActivite.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TASK_ACTIVITY_NUM,curVal));
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        protected addEvent() {
            super.addEvent();
            EventMgr.addEvent(MissionEvent.MISSION_UPDATE_LIVENESS, this.onUpdateLiveness, this);
        }

        protected removeEvent() {
            super.removeEvent();
            EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_LIVENESS, this);
        }

        /**活跃度刷新 */
        private onUpdateLiveness() {
            this.refreshView();
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
    }
}
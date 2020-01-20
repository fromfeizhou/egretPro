module com_main {
    export interface IActivityTask {
        taskId: number;//任务id
        cId: number;
    }

	/**
	 * 七日活动主界面
	 */
    export class SevenDayActivityPanel extends CView {
        public static NAME = 'SevenDayActivityPanel';

        public m_btn_close: com_main.CImage;
        public m_downTime: eui.Label;
        public m_tabViewStack: eui.ViewStack;
        public m_comTabTopGroup: com_main.ComTabTopGroup;
        public m_comTabGroup: com_main.ComTabGroup;


        private m_tViews: any[] = [];

        private m_curIndex = 0;
        private m_tabData: { [name: string]: { tag: number } };
        private m_topData: { [name: string]: { tag: number, id: number } };
        private m_dayActiviListMap: { [day: number]: MissionInfoVo[] } = {}
        private m_dayActiveNameMap: { [day: number]: string[] }
        private subDay: number;//到第几天了
        private activiVo: AcTaskVo;
        public oldIndex: number = 0;
        public constructor() {
            super();
            this.name = SevenDayActivityPanel.NAME;
            this.initApp("activity/seven/SevenDayActivityPanelSkin.exml");
        }

        public onDestroy(): void {
            this.m_tViews = null;
            Utils.TimerManager.remove(this.updateDownTime, this);
            this.removeEvent();
            super.onDestroy();

            SceneResGroupCfg.clearModelRes([ModuleEnums.SEV_DAY_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_comTabTopGroup.cacheAsBitmap = true;
            this.m_comTabTopGroup.cacheAsBitmap = true;

            this.activiVo = ActivityModel.getActivityVo<AcTaskVo>(AcViewType.OPEN_SEVEN);
            if(!this.activiVo) return;

            this.refreshData();
            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY1)] = { tag: 0 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY2)] = { tag: 1 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY3)] = { tag: 2 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY4)] = { tag: 3 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY5)] = { tag: 4 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY6)] = { tag: 5 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY7)] = { tag: 6 };

            let curtime = TimerUtils.getServerTimeMill();
           
            this.subDay = Math.ceil((curtime - this.activiVo.openDate) / 86400000);
            this.subDay = this.subDay > 7 ? 1 : this.subDay;
            this.refreshTabBtns();
            this.updateTopData(this.subDay);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabTopGroup.setChangeCallback(this.changeTopTag, this);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            let activityView = new SevenDayActivityView(width, height, this.subDay);
            this.m_tabViewStack.addChild(activityView);

            this.m_tViews.push(activityView);
            this.validateNow();
            this.m_curIndex = this.subDay - 1;
            this.initView(this.m_curIndex);
            this.initTopView(0);
            this.initEvent();
            // this.changeTag(th)
            /**一分鐘執行一次 */
            this.updateDownTime();
            Utils.TimerManager.doTimer(10000, 0, this.updateDownTime, this);
        }

        public updateDownTime() {
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.activiVo.closeDate)
                return;
            let str = Utils.DateUtils.getCountdownStrByCfg(this.activiVo.closeDate - curtime, 1);
            this.m_downTime.text = str;
        }
        /**构建七日目标的基础数据 */
        public refreshData() {
            let taskDatas = this.activiVo.taskInfoDic;
            let infos:MissionInfoVo[] = [];
            for(let key in taskDatas){
                if(taskDatas[key]) infos.push(taskDatas[key]);
            }
            infos.sort(this.sortByState)
            this.m_dayActiviListMap = {};
            this.m_dayActiveNameMap = {};
            if (infos) {
                for (let i = 0; i < infos.length; i++) {
                    let infoVo = infos[i];
                    let activityArr: MissionInfoVo[] = this.m_dayActiviListMap[infoVo.cfg.rewardDay];
                    if (!activityArr) {
                        this.m_dayActiviListMap[infoVo.cfg.rewardDay] = [];
                        this.m_dayActiveNameMap[infoVo.cfg.rewardDay] = [];
                    }
                    this.m_dayActiviListMap[infoVo.cfg.rewardDay].push(infoVo);
                    this.m_dayActiveNameMap[infoVo.cfg.rewardDay].push(infoVo.cfg.title)
                }
            }
        }
        /**排序 */
        public sortByState(a: MissionInfoVo, b: MissionInfoVo) {
            return a.taskId - b.taskId;
        }

        /**
         * 构建顶部导航栏
         */
        public updateTopData(day: number) {
            if (this.m_dayActiveNameMap == {})
                return;
            let activiNameList: string[] = this.m_dayActiveNameMap[day];
            if (isNull(activiNameList)) {
                EffectUtils.showTips(GCode(CLEnum.FUNC_UNOPEN), 1, true);
                return;
            }
            this.m_topData = {};
            let activityList: MissionInfoVo[] = this.m_dayActiviListMap[day];
            if (!activityList)
                return;
            for (let index = 0; index < activityList.length; index++) {
                let activiItem = activityList[index];
                this.m_topData[`${activiItem.cfg.title}`] = { tag: index, id: activiItem.taskId };
            }
            this.m_comTabTopGroup.clearTabBtn();
            let tagTops = activiNameList.slice(0, activiNameList.length);
            this.m_comTabTopGroup.initNorTabBtns(tagTops);
            this.changeTopTag(0);

            for (let i = 0; i < tagTops.length; i++) {
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabTopGroup.getTabBtnByName(tagTops[i]), { x: 95, y: -3, scale: 0.9 }, [RedEvtType.OPEN_SEVEN], 2, { dayTaskId: activityList[i].taskId });
            }
        }

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private initEvent() {
            EventManager.addTouchTapListener(this.m_btn_close, this, () => {
                UpManager.history();
            });

        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        private changeTag(selIndex: number) {
            // let activiNameList: string[] = this.m_dayActiveNameMap[selIndex + 1];
            // if (isNull(activiNameList)) {
            //     EffectUtils.showTips(GCode(CLEnum.FUNC_UNOPEN), 1, true);
            //     return;
            // }
            // if (selIndex > this.subDay) {
            //     EffectUtils.showTips(GCode(CLEnum.FUNC_UNOPEN), 1, true);
            //     return;
            // }
            this.initView(selIndex);
            this.updateTopData(selIndex + 1);
        }
        private changeTopTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initTopView(selIndex);
        }
        /**刷新切卡 */
        private refreshTabBtns() {
            this.m_comTabGroup.clearTabBtn();
            let tags = [
                GCode(CLEnum.AC_SEVEN_DAY1),
                GCode(CLEnum.AC_SEVEN_DAY2),
                GCode(CLEnum.AC_SEVEN_DAY3),
                GCode(CLEnum.AC_SEVEN_DAY4),
                GCode(CLEnum.AC_SEVEN_DAY5),
                GCode(CLEnum.AC_SEVEN_DAY6),
                GCode(CLEnum.AC_SEVEN_DAY7)];
            this.m_comTabGroup.initNorTabBtns(tags);
            for (let i = 1; i <= 7; i++) {
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(tags[i - 1]), { x: 78, y: -5, scale: 0.9 }, [RedEvtType.OPEN_SEVEN], 2, { dayAc: i });
            }
        }
        private initTopView(tag) {
            this.m_comTabTopGroup.selectedIndex = tag;
            let name = this.m_comTabTopGroup.selName;
            let data = this.m_topData[name];
            if (data) {
                if (this.m_tViews[0])
                    this.m_tViews[0].initData(data.id);
            }
        }

        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            let name = this.m_comTabGroup.selName;
            let data = this.m_tabData[name];
        }

    }

}
module com_main {


	/**
	 * 装备主界面
	 */
    export class MissionWnd extends CView {
        public static NAME = 'MissionWnd';

        public m_tabViewStack: eui.ViewStack;
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;

        private m_nTaskType: TaskType;   //聊天类型
        private m_tags = [TaskType.Daily, TaskType.MainLine, TaskType.Cultivate, TaskType.MainCity];   //下标栏

        public constructor(param?) {
            super();
            this.name = MissionWnd.NAME;
            this.m_nTaskType = param || TaskType.Daily;
            this.initApp("mission/MissionWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TASK));
            let tags = [GCode(CLEnum.TASK_TAB_RC),GCode(CLEnum.TASK_TAB_ZX),GCode(CLEnum.TASK_TAB_PY),
            GCode(CLEnum.TASK_TAB_ZC)];
            this.m_comTabGroup.initNorTabBtns(tags);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            let views: MissionNorView[] = [
                new MissionDailyView(TaskType.Daily, width, height),
                new MissionNorView(TaskType.MainLine, width, height),
                new MissionNorView(TaskType.Cultivate, width, height),
                new MissionNorView(TaskType.MainCity, width, height)];

            for (let i = 0; i < views.length; i++) {
                this.m_tabViewStack.addChild(views[i]);
                if (views[i].taskType == this.m_nTaskType) {
                    this.changeTag(i);
                }
            }


            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(tags[0]), { x: 132, y: -5 }, [RedEvtType.TASK, RedEvtType.TASK_ACTIVITY], 1, { taskType: TaskType.Daily });
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(tags[1]), { x: 132, y: -5 }, [RedEvtType.TASK], 1, { taskType: TaskType.MainLine });
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(tags[2]), { x: 132, y: -5 }, [RedEvtType.TASK], 1, { taskType: TaskType.Cultivate });
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(tags[3]), { x: 132, y: -5 }, [RedEvtType.TASK], 1, { taskType: TaskType.MainCity });

            this.validateNow();
        }

        private changeTag(selIndex: number) {
            this.initView(selIndex);
        }

        private initView(index: number) {
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
        }

    }

}
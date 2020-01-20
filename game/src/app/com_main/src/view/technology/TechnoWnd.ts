module com_main {
	/**
	 * 科技主面板相关
	 */
    export class TechnoWnd extends CView {
        public static NAME = 'TechnoWnd';

        public m_tabViewStack: eui.ViewStack;
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;

        private m_tViews: any[] = [];
        private m_curIndex = 0;
        private m_tTimeData: gameProto.ITechnologyUpgradeState;
        private m_nTimeIndex: number;
        private m_nType:{[type:number]:number}={};
        private m_tabInfo = [
            { name: GCode(CLEnum.ARMY_BB), endTime: "" },
            { name: GCode(CLEnum.ARMY_GB), endTime: "" },
            { name: GCode(CLEnum.ARMY_QIB), endTime: "" },
            { name: GCode(CLEnum.ARMY_QB), endTime: "" },
            { name: GCode(CLEnum.TEC_FZ), endTime: "" },
            // { name: GCode(CLEnum.TEC_FZKJ), endTime: "" }
        ];

        public constructor(param?) {
            super();
            this.name = TechnoWnd.NAME;
            this.m_curIndex = param || 0;
            this.initApp("technology/TechnoWndSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
        }

        public onDestroy(): void {
            super.onDestroy();
            EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_TIME_UP, this);
            this.delTimeHandler();
            EventManager.removeEventListeners(this);
            this.m_tViews = null;
            SceneResGroupCfg.clearModelRes([ModuleEnums.TECHNOLOGY]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TEC));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            for (let i = 0; i < this.m_tabInfo.length; i++) {
                this.m_comTabGroup.addTabBtnData(this.m_tabInfo[i]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);

            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            let list = [TechnoType.SOLDIER_BB, TechnoType.SOLDIER_GB, TechnoType.SOLDIER_QIB,TechnoType.SOLDIER_QB, TechnoType.PRODUCE];
            for (let i = 0; i < list.length; i++) {
                let view = new TechnoTabView(list[i], width, height);
                this.m_tabViewStack.addChild(view);
                this.m_tViews.push(view);
                this.m_nType[list[i]]=i;
                //红点处理
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(this.m_tabInfo[i].name), { x: 132, y: -5 }, [RedEvtType.TECHNO], 2, { teachType: list[i] });

            }

            // this.validateNow();
            this.initView(this.m_curIndex);

            EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoTimeUp, this);

        }

        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }
        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
            this.m_tViews[tag].onShow();
            
            if (TechnoModel.isInLevelCd()) {
                this.addTimeHandler();
            } else {
                this.delTimeHandler();
            }
        }

        /**刷新倒计时 */
        private refreshTime(index: number, str: string) {
            let info = this.m_tabInfo[index];
            let newInfo: ITabBtnData = { name: '', endTime: '' };
            newInfo.name = info.name;
            // newInfo.source = info.source;
            newInfo.endTime = str;
            this.m_comTabGroup.resetTabBtnData(newInfo, index);
        }

        /**添加倒计时 */
        private addTimeHandler() {
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_tTimeData = TechnoModel.getTimeData();
            let id = this.m_tTimeData.id;
            let cfg = C.TechnologyConfig[id];
            this.m_nTimeIndex = this.m_nType[cfg.type];
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        }

        /**移除倒计时 */
        private delTimeHandler() {
            if (this.m_nTimeIndex >= 0) this.refreshTime(this.m_nTimeIndex, '');
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_tTimeData = null;
        }

        /**倒计时回调 */
        private timeCall() {
            let time = this.m_tTimeData.end - this.m_tTimeData.speed - TimerUtils.getServerTime();
            if (time < 0) {
                this.delTimeHandler();
                return;
            }
            let timeStr = Utils.DateUtils.getFormatBySecond(time, 1);
            this.refreshTime(this.m_nTimeIndex, timeStr);
        }

        /**升级 */
        private onTechnoTimeUp() {
            if (TechnoModel.isInLevelCd()) {
                this.addTimeHandler();
            } else {
                this.delTimeHandler();
            }
        }

    }

}
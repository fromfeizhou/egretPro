module com_main {
    export interface IEmperorBattleDetailsWnd {
        nType: number;
        bInit: boolean;
        setViewSize(width: number, height: number): void;
        initView(): void;
        refreshView(): void;
    }
    /**
     * 襄阳战（帝位争夺）
     * 2.战况UI Details
     */
    export class EmperorBattleDetailsWnd extends CView {
        public static NAME = 'EmperorBattleDetailsWnd';

        private m_MainTopNew: com_main.MainTopNew;
        private m_labTitle: com_main.CLabel;
        private m_comTabGroup: com_main.ComTabGroup;
        private m_pViewRoot: eui.Group;
        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_pViews: Array<IEmperorBattleDetailsWnd> = [];

        public constructor() {
            super();
            this.name = EmperorBattleDetailsWnd.NAME;
            this.initApp("activity/emperorBattle/EmperorBattleDetailsWndSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {

            }
        }

        public onDestroy(): void {
            this.m_pViews = null;
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.XIANGYANG_DETAILS_VIEW]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            let self = this;
            self.m_MainTopNew.setTitleName("");
            self.validateNow();

            self.m_labTitle.text = GCode(CLEnum.XIANGYANG_DETAILS_TITLE);//读表

            self.addCurrentDetailsView();

            let width = self.m_tabViewStack.width;
            let height = self.m_tabViewStack.height;
            for (let i = 0; i < self.m_pViews.length; i++) {
                self.m_pViews[i].setViewSize(width, height);
            }
            let index = 0;

            self.m_comTabGroup.setChangeCallback(self.changeTag, self);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);

            Utils.toStageBestScale(this.m_pViewRoot);
        }

        /**切换当前卡 */
        private changeTag(index: number) {
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        }

        /**添加当前战局 */
        private addCurrentDetailsView() {
            let type = 0;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.XIANGYANG_TAP_CUR) });
            let details = new CurrentDetailsView(type);
            this.m_tabViewStack.addChild(details);
            this.m_pViews.push(details);
        }
    }
}
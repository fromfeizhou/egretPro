module com_main {


	/**
	 * 血战群雄主界面
	 */
    export class BossMainWnd extends CView {
        public static NAME = 'BossMainWnd';

        private m_curIndex = 0;
        private m_MainTopNew: MainTopNew;    //标题
        private m_comTabGroup: ComTabGroup;
        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_tViews: any[] = [];


        public constructor(param?) {
            super();
            this.name = BossMainWnd.NAME;
            if (param.type == BossEnum.Rank) {
                this.m_curIndex = 1;
            } else if (param.type == BossEnum.World) {
                this.m_curIndex = 2;
            } else {
                this.m_curIndex = 0;
            }
            this.initApp("boss/BossMainWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.m_tViews = null;
            BossModel.challType = 0;
            EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.BOSS_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.BOSS_TITLE));
            this.m_MainTopNew.setResources([PropEnum.GOLD]);
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BOSS_TAB_GR) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BOSS_TAB_PM) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BOSS_TAB_SJ) });
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            let tabView1 = new BossChallView(BossEnum.Single, width, height);
            this.m_tabViewStack.addChild(tabView1);

            let tabView2 = new BossChallView(BossEnum.Rank, width, height);
            this.m_tabViewStack.addChild(tabView2);

            let tabView3 = new BossChallView(BossEnum.World, width, height);
            this.m_tabViewStack.addChild(tabView3);

            this.m_tViews.push(tabView1);
            this.m_tViews.push(tabView2);
            this.m_tViews.push(tabView3);

            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.BOSS_TAB_GR)), { x: 132, y: -5 }, [RedEvtType.BOSS_SINGLE], 2);
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.BOSS_TAB_PM)), { x: 132, y: -5 }, [RedEvtType.BOSS_RANK], 2);
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.BOSS_TAB_SJ)), { x: 132, y: -5 }, [RedEvtType.BOSS_WORLD], 2);
            this.validateNow();
            this.initView(this.m_curIndex);

            /**检查新手引导面板条件 */
            this.onGuideCondition();
        }

        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);

            let ids = [IGUIDECD.BOSS_TAB_PRI, IGUIDECD.BOSS_TAB_RANK, IGUIDECD.BOSS_TAB_WOR];
            this.onGuideConditionTab(ids[selIndex]);
        }


        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
        }


        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.BOSS_WND);
        }

        /**检查新手引导面板条件 */
        public onGuideConditionTab(id: IGUIDECD) {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        }


    }

}
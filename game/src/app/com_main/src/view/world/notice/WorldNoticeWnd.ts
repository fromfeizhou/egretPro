module com_main {


	/**
	 * 国战预告主界面
	 */
    export class WorldNoticeWnd extends CView {
        public static NAME = 'WorldNoticeWnd';

        private m_curIndex = 0;
        private m_MainTopNew: MainTopNew;    //标题
        private m_comTabGroup: ComTabGroup;
        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_tViews: any[] = [];


        public constructor() {
            super();
            this.name = WorldNoticeWnd.NAME;
            this.initApp("world/notice/WorldNoticeWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.m_tViews = null;
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.WORLD_NOTICE_TITLE));
    
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.WORLD_NOTICE_DESC) });
            // this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.WORLD_NOTICE_FIGHT) });
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            let tabView1 = new WorldWarExplainView(width, height);
            this.m_tabViewStack.addChild(tabView1);

            // let tabView2 = new WorldWarExplainView(width, height);
            // this.m_tabViewStack.addChild(tabView2);

            this.validateNow();
            this.initView(this.m_curIndex);

            /**检查新手引导面板条件 */
            this.onGuideCondition();
        }

        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }
        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
        }
 
    }

}
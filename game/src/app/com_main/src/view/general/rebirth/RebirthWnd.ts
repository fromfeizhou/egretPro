module com_main {
    export interface IRebirthTabView {
        initView(): void;
        changeTag(index: number): void
        m_bInit: boolean;
    }
	/**
	 * 重生主界面
	 */
    export class RebirthWnd extends CView {
        public static NAME = 'RebirthWnd';
        public m_tabViewStack: eui.ViewStack;
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;

        private m_tViews: any[] = [];
        private m_curIndex = 0;
        public constructor(param?) {
            super();
            this.name = RebirthWnd.NAME;
            this.m_curIndex = (param && param.tag) ? param.tag : 0;
            this.initApp("general/rebirth/RebirthWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();

            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.REBIRTH));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

            this.m_comTabGroup.initNorTabBtns([
                GCode(CLEnum.REBIRTH)
            ]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();

            let rebirthView = new RebirthView(this.m_tabViewStack.width, this.m_tabViewStack.height);
            this.m_tabViewStack.addChild(rebirthView);

            this.m_tViews.push(rebirthView);

           this.changeTag(0);
        }

        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }
        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
             this.m_tViews[tag].initView();
             this.m_tViews[tag].changeTag(tag);
        }
    }

}
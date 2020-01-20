module com_main {


	/**
	 * 联盟面板相关
	 */
    export class LegionMainWnd extends CView {
        public static NAME = 'LegionMainWnd';

        public m_tabViewStack: eui.ViewStack;
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;

        private m_nCurIndex = 0;
        private m_tabSize: ISize;
        private m_tViews: any;
        public constructor(param?) {
            super();
            this.m_nCurIndex = param&&param.tag ? param.tag : 0;
            this.name = LegionMainWnd.NAME;
            this.initApp("legion/LegionMainWndSkin.exml");
        }

        public onDestroy(): void {
            this.m_tViews = null;
            super.onDestroy();

            SceneResGroupCfg.clearModelRes([ModuleEnums.LEGION_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_MainTopNew.setTitleName(GCode(CLEnum.GUILD));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

            this.m_comTabGroup.initNorTabBtns([GCode(CLEnum.GUILD), GCode(CLEnum.GUILD_TAB_TECHNO), GCode(CLEnum.GUILD_TAB_SHOP)]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            for (let i = 0; i < 4; i++) {
                this.m_tabViewStack.addChild(new egret.DisplayObjectContainer());
            }
            this.validateNow();
            this.m_tabSize = { width: this.m_tabViewStack.width, height: this.m_tabViewStack.height };
            this.m_tViews = {};

            this.changeTag(this.m_nCurIndex);
        }

        /**创建子面板 */
        private createTabView(index: number) {
            if (this.m_tViews[index]) return;
            let tabView = null;
            switch (this.m_comTabGroup.selName) {
                case GCode(CLEnum.GUILD): {
                    tabView = new LegionInfoView(this.m_tabSize);
                    break;
                }
                case GCode(CLEnum.GUILD_TAB_TECHNO): {
                    tabView = new LegionDonationView(this.m_tabSize);
                    break;
                }
                case GCode(CLEnum.GUILD_TAB_SHOP): {
                    tabView = new LegionShopView(this.m_tabSize);
                    break;
                }
                // case '排行': {
                //     tabView = new LegionRankView(this.m_tabSize);
                //     break;
                // }
            }
            if (tabView) {
                this.m_tViews[index] = tabView;
                let container = this.m_tabViewStack.getChildAt(index) as egret.DisplayObjectContainer;
                container.addChild(tabView);
            }
        }


        private changeTag(index: number) {
            this.initView(index);

        }

        private initView(index: number) {
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
            this.createTabView(index);
            if (index == 2) {
                this.m_MainTopNew.setResources([PropEnum.GUILD_POINT]);
            } else {
                this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            }

        }

    }
}
module com_main {
    export interface ITreaTabView{
        initView():void;
        changeTag(index:number):void
        m_bInit:boolean;
    }

	/**
	 * 藏宝阁
	 */
    export class TreaMainWnd extends CView {
        public static NAME = 'TreaMainWnd';

        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;
        public m_tabViewStack: eui.ViewStack;

        private m_tabList:TreaTabList;
        private m_tabCompo:TreaTabCompo;

        public constructor(param?) {
            super();
            this.name = TreaMainWnd.NAME;
            this.initApp("treasure/TreaMainWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
             if (this.m_tabList) {
                this.m_tabList.onDestroy();
                this.m_tabList = null;
            }
            if (this.m_tabCompo) {
                this.m_tabCompo.onDestroy();
                this.m_tabCompo = null;
            }
            SceneResGroupCfg.clearModelRes([ModuleEnums.TREA_VIEW]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TREA_TITLE));
           

            this.m_comTabGroup.initNorTabBtns([
                GCode(CLEnum.TREA_TAB_ALL), GCode(CLEnum.TREA_TAB_BQ),GCode(CLEnum.TREA_TAB_MP), 
                GCode(CLEnum.TREA_TAB_ZB), GCode(CLEnum.TREA_TAG_HC)
            ]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();

            this.m_tabList = new TreaTabList(this.m_tabViewStack.width,this.m_tabViewStack.height);
            this.m_tabViewStack.addChild(this.m_tabList);

            this.m_tabCompo = new TreaTabCompo(this.m_tabViewStack.width,this.m_tabViewStack.height);
            this.m_tabViewStack.addChild(this.m_tabCompo);

            this.changeTag(0);
        }

        private changeTag(selIndex: number) {
            this.initView(selIndex);
        }

        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            if(tag > 3){
                this.m_tabCompo.initView();
                this.m_tabViewStack.selectedIndex = 1;
            }else{
                this.m_tabViewStack.selectedIndex = 0;
                this.m_tabList.initView();
                this.m_tabList.changeTag(tag)
            }
        }
       
    }

}
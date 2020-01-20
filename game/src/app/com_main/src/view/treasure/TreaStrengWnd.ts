module com_main {
    /**宝物强化界面 */
    export class TreaStrengWnd extends CView {
        public static NAME = 'TreaStrengWnd';

        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;
        public m_tabViewStack: eui.ViewStack;

        private m_nItemId: number;
        private m_tabStreng: TreaTabStreng;
        // private m_tabCompo: TreaTabCompo;

        public constructor(id: number) {
            super();
            this.m_nItemId = id;
            this.name = TreaStrengWnd.NAME;
            this.initApp("treasure/TreaStrengWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            if (this.m_tabStreng) {
                this.m_tabStreng.onDestroy();
                this.m_tabStreng = null;
            }
            // if (this.m_tabCompo) {
            //     this.m_tabCompo.onDestroy();
            //     this.m_tabCompo = null;
            // }
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TREA));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

            if (TreasureModel.isOwner(this.m_nItemId)) {
                this.m_comTabGroup.initNorTabBtns([
                    GCode(CLEnum.TREA_TAG_SX), GCode(CLEnum.TREA_TAG_QH), GCode(CLEnum.TREA_TAG_SXI),
                    GCode(CLEnum.TREA_TAG_XQ)
                ]);
            } else {
                this.m_comTabGroup.initNorTabBtns([
                    GCode(CLEnum.TREA_TAG_SX)
                ]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;
            this.m_tabStreng = new TreaTabStreng(width, height, this.m_nItemId);
            this.m_tabViewStack.addChild(this.m_tabStreng);

            // this.m_tabCompo = new TreaTabCompo(width, height);
            // this.m_tabViewStack.addChild(this.m_tabCompo);
            //刷新子节点宽高适配
            this.validateNow();

            if (TreasureModel.isOwner(this.m_nItemId)) {
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TREA_TAG_QH)),
                    { x: 132, y: -5 }, [RedEvtType.TREA_STRENG], 2, { treaId: this.m_nItemId });
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TREA_TAG_SXI)),
                    { x: 132, y: -5 }, [RedEvtType.TREA_STAR], 2, { treaId: this.m_nItemId });
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TREA_TAG_XQ)),
                    { x: 132, y: -5 }, [RedEvtType.TREA_INLAY], 2, { treaId: this.m_nItemId });
            }

            this.changeTag(0);
        }

        private changeTag(selIndex: number) {
            this.initView(selIndex);
        }

        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            // if (tag <= 3) {
                this.m_tabStreng.changeTag(tag);
                // this.m_tabViewStack.selectedIndex = 0;
                // return;
            // }

            // this.m_tabViewStack.selectedIndex = tag - 3;
        }

    }

}
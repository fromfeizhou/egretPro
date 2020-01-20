module com_main {
	/**
	 * 材料副本主界面
	 */
    export class MaterialWnd extends CView {
        public static NAME = 'MaterialWnd';
        public static TYPE_TO_ID = {
            [MaterialEnum.Streng]: 1,
            [MaterialEnum.Lorder]: 2,
            [MaterialEnum.Refin]: 3,
            // [MaterialEnum.Destiny]: 4,
            [MaterialEnum.SoldRefin]: 4,
        }
        private m_curIndex = 0;
        private m_MainTopNew: MainTopNew;    //标题
        private m_comTabGroup: ComTabGroup;
        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_tViews: any[] = [];
        private m_tabInfo = [
            { name: GCode(CLEnum.MAT_TAB_YL) },
            { name: GCode(CLEnum.MAT_TAB_QH) },
            { name: GCode(CLEnum.MAT_TAB_SJ) },
            { name: GCode(CLEnum.MAT_TAB_JL) },
            { name: GCode(CLEnum.MAT_TAB_BD) }];

        public constructor(param?) {
            super();
            this.name = MaterialWnd.NAME;
            this.m_curIndex = param.tag ? MaterialWnd.TYPE_TO_ID[param.tag] : 0;
            this.m_curIndex = this.m_curIndex || 0
            this.initApp("material/MaterialWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.m_tViews = null;
            MaterialModel.copyType = 0;
            EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.BOSS_UI,ModuleEnums.ARENA_UI]);
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.MAT));
            for (let i = 0; i < this.m_tabInfo.length; i++) {
                this.m_comTabGroup.addTabBtnData(this.m_tabInfo[i]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            this.initTabView();

            this.initView(this.m_curIndex);
            this.onGuideCondition();
        }
        /**界面初始化 */
        private initTabView() {
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;
            let list = MaterialModel.materialList;
            for (let i = 0; i < list.length; i++) {
                let view = new MaterialView(list[i], width, height);
                this.m_tabViewStack.addChild(view);
                this.m_tViews.push(view);
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(this.m_tabInfo[i].name), { x: 132, y: -5 }, [RedEvtType.MATER_WAR], 2, { materialEnum: list[i] });
            }
        }
        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }
        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
            this.m_tViews[tag].initView();
            if (tag == 0) {//银两副本
                this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER]);
            } else {
                this.m_MainTopNew.setResources([PropEnum.GOLD]);
            }
        }
        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MATERIA_CAMP_WND);
        }
    }

}
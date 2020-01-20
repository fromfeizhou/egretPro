module com_main {
    /**顶导航栏 */
    export class ComTabTopGroup extends ComTabGroup {
        private m_groupLine: eui.Group;

        public constructor() {
            super();
            // this.skinName = Utils.getAppSkin("common/com_tab_top_group.exml");
        }

        protected childrenCreated() {
            super.childrenCreated();
        }

        /**设置排版格式 和 按钮皮肤
        * @param skinName (tab_btntop_render tab_btntop_renderII)
        */
        public setTabBtnSkin(skinName: string = "tab_btntop_render") {
            this.m_tabBtn.itemRendererSkinName = skinName;
        }


        /**
        *  添加按钮
        * @param data 通用 {name:xxx}
        */
        public addTabBtnData(data:  {name:string},isShowLine = true): void {
            super.addTabBtnData(data);
            if (this.m_tCollection.length > 0 && isShowLine) {
                let imgLine: CImage = new CImage("line_1004_png");
                this.m_groupLine.addChild(imgLine);
            }
        }


        /**清理 */
        public clearTabBtn() {
            this.m_groupLine.removeChildren();
            super.clearTabBtn();
        }

    }
}
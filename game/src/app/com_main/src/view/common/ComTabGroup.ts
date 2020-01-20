module com_main {
    export interface ITabBtnData {
        name: string,
        endTime?: string,
    }
    /**侧导航栏 */
    export class ComTabGroup extends CComponent {

        public m_pScroll: com_main.CScroller;
        public m_tabBtn: eui.TabBar;

        protected m_tCollection: eui.ArrayCollection;
        private m_changeCallback: Function;
        private m_changeThisArg: any;

        public constructor() {
            super();
            // this.skinName = Utils.getAppSkin("common/com_tab_group.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            if (this.m_tabBtn) {
                this.m_tabBtn.removeEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
            }
            super.$onRemoveFromStage(isclear);
        }

        protected childrenCreated() {
            super.childrenCreated();
           
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            if (instance == this.m_tabBtn) {
                this.m_tCollection = new eui.ArrayCollection();
                this.m_tabBtn.dataProvider = this.m_tCollection;
                this.m_tabBtn.addEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
                //复用 显示对象关闭 使数据位置与ui位置一致 外部访问ui使用
                this.m_tabBtn.useVirtualLayout = false;
            }
        }

        /**设置排版格式 和 按钮皮肤
        * @param skinName (tab_btntop_render tab_btntop_renderII)
        */
        public setTabBtnSkin(skinName: string = "tab_btntop_render") {
            this.m_tabBtn.itemRendererSkinName = skinName;
        }

        /**
         * 设置切卡回调
         */
        public setChangeCallback(callback: Function, thisArg: any) {
            this.m_changeCallback = callback;
            this.m_changeThisArg = thisArg;
        }

        /**
        *  添加按钮
        * @param data 通用 {name:xxx}
        */
        public addTabBtnData(data: ITabBtnData): void {
            this.m_tCollection.addItem(data);
            this.commitProperties();
        }
        /**
       *  移除按钮
       * @param data 通用 {name:xxx}
       */
        public delTabBtnData(index: number): void {
            this.m_tCollection.removeItemAt(index);
            this.commitProperties();
        }
        /**
       *  初始化按钮
       * @param data 通用 {name:xxx}
       */
        public initNorTabBtns(tags: string[]): void {
            this.clearTabBtn();
            for (let i = 0; i < tags.length; i++) {
                this.addTabBtnData({ name: tags[i] });
            }
            this.validateNow();
        }

        /**清理 */
        public clearTabBtn() {
            this.m_tabBtn.selectedIndex = -1;
            this.m_tCollection.removeAll();
        }

        /**替换数据 */
        public resetTabBtnData(data: ITabBtnData, index: number) {
            let tempData = this.m_tCollection.replaceItemAt(data, index);
            this.m_tCollection.itemUpdated(tempData);
        }

        /**设置切卡回调 */
        public onTabBtnClick(e: egret.Event) {
            let selectedIndex = e.currentTarget.selectedIndex;
            if (this.m_changeCallback && this.m_changeThisArg) {
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.m_changeCallback.call(this.m_changeThisArg, selectedIndex);

            }
            Sound.playTap();
        }

        // /**下标 */
        public set selectedIndex(id: number) {
            this.m_tabBtn.selectedIndex = id;
        }
        public get selectedIndex(): number {
            if (this.m_tabBtn) {
                return this.m_tabBtn.selectedIndex;
            }
            return 0;
        }

        /**获得数据长度 */
        public get dataNum() {
            return (this.m_tCollection && this.m_tCollection.source.length) || 0;
        }
        /**滑动距离 */
        public setScorllorV(index:number) {
            if (this.m_pScroll) {
                return this.m_pScroll.scrollTo(this.m_tabBtn,index);
            }
        }


        /**获得当前选中 节点名字 */
        public get selName(): string {
            if (!this.m_tCollection) return '';
            let data = this.m_tCollection.getItemAt(this.m_tabBtn.selectedIndex) as ITabBtnData
            return data ? data.name : '';
        }

        /**获取对应节点下标 */
        public getIndexByName(name: string): number {
            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let data = this.m_tCollection.source[i] as ITabBtnData;
                if (data.name == name) {
                    return i;
                }
            }
            return 0;
        }

        /**获得对应的tab组件 */
        public getTabBtnByName(name: string) {
            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let data = this.m_tCollection.source[i] as ITabBtnData;
                if (data.name == name) {
                    return this.m_tabBtn.getElementAt(i);
                }
            }
            this.m_tabBtn.getElementAt(0);
        }
    }
}
//自定义逻辑控制器
declare interface TabCompont {
        m_tabIndex: number;

        setTabIndex(index: number);

        getTabIndex():number;

        setSelectState(boo: boolean);
    }
module com_main {
    

	export class ComTabLogic extends egret.DisplayObject{

        private m_curSelectIndex: number = -1;
        private m_tabList: TabCompont[];
        private m_panelList: egret.DisplayObject[];

		public constructor() {
			super();
		}

        public init(tabList: TabCompont[], panelList: egret.DisplayObject[]){
			if(tabList.length != panelList.length){
                error("按钮和面板数量不一致");
                return ;
            }

            this.m_tabList = tabList;
            this.m_panelList = panelList;

            for(let i = 0; i < this.m_tabList.length; i++){
                let tab = this.m_tabList[i];
                tab.setTabIndex(i);
            }

            this.showPanelByIndex(0);
            this.initEvent();
		}

        public onDestory(){
            this.m_tabList = null;
            this.m_panelList = null;
            this.removeEvent();
        }

        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            for(let tab of this.m_tabList){
                let tab1 = tab as any;
                EventManager.addTouchScaleListener(tab1, this, this.onCloseTab);
            }
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

        private onCloseTab(e: egret.TouchEvent){
            let target = e.target;
            let i = 0;
            while(isNull(target.getTabIndex) && i < 10){
                target = target.parent;
                i++;
            }
            if(target.getTabIndex() >= 0){
                this.showPanelByIndex(target.getTabIndex());
            }
        }

        public showPanelByIndex(index){
            if(this.m_curSelectIndex == index){
                return;
            }
            this.m_curSelectIndex = index;
            for(let panel of this.m_panelList){
                panel.visible = false;
            }

            for(let tab of this.m_tabList){
                tab.setSelectState(false);
            }

            if(this.m_panelList[index]){
                this.m_panelList[index].visible = true;
            }
            if(this.m_tabList[index]){
                this.m_tabList[index].setSelectState(true);
            }
        }
	}
}
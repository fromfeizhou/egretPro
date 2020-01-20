module com_main {

    export class SelectedTab extends ListItemRenderer {
        private y_TabBar: eui.TabBar;
		public constructor(isAddSkin?:boolean) {
    		super();
    		
    		if(isAddSkin){
                // this.skinName = Utils.getComExml("pop","PopTabSkin.exml");
                this.skinName = Utils.getComSkin("PopTabSkin.exml");
    		}
		}
		
        protected createChildren(): void {
            this.currentState = "left";
            EventManager.removeEventListeners(this);
            super.createChildren();
        }
		
		public set tabBar(tabBar:eui.TabBar){
		    this.y_TabBar = tabBar;
		}
		
        public selectTab():void{
            this.data = this.y_TabBar.selectedItem;
            this.setSelectTabPosition();
        }
		
        private setSelectTabPosition() {
            this.currentState = this.y_TabBar.selectedIndex == 0 ? "left" : this.y_TabBar.selectedIndex == (this.y_TabBar.numElements - 1) ? "right" : "down";
            if(this.y_TabBar.numElements < 4 && this.currentState == 'right') this.currentState = 'down';
            // debug("this.m_pSelectTab.currentState",this.currentState);

            this.x = 15 + this.y_TabBar.selectedIndex * this.width;
        }
	}
}

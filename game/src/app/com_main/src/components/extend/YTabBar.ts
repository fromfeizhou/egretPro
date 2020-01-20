
module com_main {

    import superGetter = egret.superGetter;
    export class YTabBarItem extends ListItemRenderer{
        private Img_Bg:eui.Image;
        private Img_Icon:eui.Image;
        private Lbl_Title:eui.Label;

        public constructor() {
            super();
            this.skinName = Utils.getComSkin("PopTabSkin.exml");
        }

        $onRemoveFromStage(): void {
            this.data = null;
            super.$onRemoveFromStage();
        }

        protected dataChanged(): void{
            if(!this.data) return;
            this.Img_Bg.source = this.data.enabled ? "Common_Tab1_png" : "Common_Tab1_png";
            this.Img_Icon.source = this.data.icon;
        }

        protected onTouchBegin(event: egret.TouchEvent): void{
            if (this.data.enabled){
                super.onTouchBegin(event);
            }else{
                if (this.data.enabledTips){
                    MessageTip.AddMessageError(this.data.enabledTips);
                }
                event.stopImmediatePropagation();
            }
        }
    }


    export class YTabBar extends eui.TabBar {
        private m_iOldIndex:number;

        public constructor() {
            super();
            this.m_iOldIndex = 0;
        }

        protected createChildren(): void {
            super.createChildren();
            this.itemRenderer = YTabBarItem;
        }
    }
}

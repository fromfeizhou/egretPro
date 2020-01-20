module com_main {

    export enum PayItemWidgetType {
        NONE,
        NUM_LEFT,
        NUM_MIDDLE,
        NUM_RIGHT,
        NAME_TOP_LEFT,
        NAME_TOP_MIDDLE,
        NAME_TOP_RIGHT,
        NAME_BOTTOM_LEFT,
        NAME_BOTTOM_MIDDLE,
        NAME_BOTTOM_RIGHT
    }

    /**
     * 
     */
    export class PayItemWidget extends CComponent {

        private m_nType: number = 0;

        private m_pGMain:eui.Group;
        private m_pImgQuality:eui.Image;
        private m_pImgMain:eui.Image;
        private m_pLbNum:eui.Label;
        private m_pLbName:eui.Label;


        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/pay/pay_item_widget.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            
        }

        public initType(ty: PayItemWidgetType): void {
            this.m_nType = ty;
            switch(this.m_nType) {
                case PayItemWidgetType.NONE:
                    this.m_pLbName.visible = false;
                    this.m_pLbNum.visible = true;
                    this.height = 122;
                    break;
                case PayItemWidgetType.NUM_RIGHT:
                    this.setView()
                    break;
                case PayItemWidgetType.NUM_MIDDLE:
                    this.setView(32, 122, false, egret.HorizontalAlign.CENTER);
                    break;
                case PayItemWidgetType.NUM_LEFT:
                    this.setView(5, 122, false, egret.HorizontalAlign.LEFT);
                    break;
                case PayItemWidgetType.NAME_BOTTOM_RIGHT:
                    this.setView(60.5, 150, true, egret.HorizontalAlign.RIGHT, true);
                    break;
                case PayItemWidgetType.NAME_BOTTOM_MIDDLE:
                    this.setView(32, 150, true, egret.HorizontalAlign.CENTER, true);
                    break;
                case PayItemWidgetType.NAME_BOTTOM_LEFT:
                    this.setView(5, 150, true, egret.HorizontalAlign.LEFT, true);
                    break;
                case PayItemWidgetType.NAME_TOP_RIGHT:
                    this.setView(60.5, 150, true, egret.HorizontalAlign.RIGHT, false);
                    break;
                case PayItemWidgetType.NAME_TOP_MIDDLE:
                    this.setView(32, 150, true, egret.HorizontalAlign.CENTER, false);
                    break;
                case PayItemWidgetType.NAME_TOP_LEFT:
                    this.setView(5, 150, true, egret.HorizontalAlign.LEFT, false);
                    break;
                default:
                    this.setView();
                    break;
            }
        }

        private setView(x?: number, h?: number, b?: boolean, t?: string, d?: boolean): void {
            this.m_pLbNum.textAlign = t || egret.HorizontalAlign.RIGHT;
            this.m_pLbNum.x = x || 60.5;
            this.m_pLbName.visible = b || false;
            this.height = h || 122;
            this.m_pLbName.y = d ? 124 : 2;
            this.m_pGMain.y = d ? 0 : 28;
        }
    

    }

}
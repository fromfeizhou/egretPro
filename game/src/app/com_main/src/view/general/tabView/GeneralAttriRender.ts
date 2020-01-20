module com_main {
    export interface GeneralAttriRD {
        state: string;
        name: string;
        value: string;
        icon: number;
        isGay?: boolean;

    }
    /**属性 */
    export class GeneralAttriRender extends eui.ItemRenderer {
        public m_labName: eui.Label;
        public m_labVal: eui.Label;
        public m_imgIcon: eui.Image;

        protected m_tData: GeneralAttriRD;
        protected m_bInit: boolean;
        private m_attriTip: GeneralAttriTip;
        public list: { [key: number]: string };
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            if (this.m_attriTip) {
                Utils.removeFromParent(this.m_attriTip);
            }
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnVipShopHandler, this);
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.hideTips, this);
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_END, this.hideTips, this);
            this.m_imgIcon.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.hideTips, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.list = {};
            this.list[AttriType.POWER] = 'common_pow';
            this.list[AttriType.INTELLIGENCE] = 'common_intell';
            this.list[AttriType.LEADERSHIP] = 'common_leader';
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnVipShopHandler, this);
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.hideTips, this);
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_END, this.hideTips, this);
            this.m_imgIcon.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.hideTips, this);
            // EventManager.addTouchScaleListener(this.m_imgIcon, this, this.onBtnVipShopHandler);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.currentState = this.m_tData.state;
                this.commitProperties();
            }
            this.refresh();

            let isGay = this.m_tData.isGay;
            if (isGay == null) return;
            Utils.isGray(isGay, this);
        }

        protected refresh() {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.text = this.m_tData.value;
            this.m_imgIcon.source = this.list[this.m_tData.icon] + '_png';
        }
        /**属性提示 */
        private onBtnVipShopHandler(e: egret.TouchEvent) {
            var target = e.currentTarget as egret.DisplayObject;
            var point: egret.Point = target.parent.localToGlobal(target.x, target.y);
            if (this.m_attriTip) {
                this.m_attriTip.visible = true;
                this.m_attriTip.doAction(true);
            } else {
                this.m_attriTip = new GeneralAttriTip(this.m_tData.icon);
                this.m_attriTip.y = 200;
                point.x = point.x + target.width - 180;
                this.m_attriTip.x = point.x;

                this.m_attriTip.doAction(true);
                AGame.R.app.topLevel.addChild(this.m_attriTip);
            }
            e.stopPropagation();
        }
        /**隐藏提示 */
        private hideTips() {
            if (this.m_attriTip && this.m_attriTip.visible) {
                this.m_attriTip.visible = false;
            }
            if (this.m_attriTip && this.m_attriTip.visible) {
                this.m_attriTip.visible = false;
            }
        }
    }


    /**属性 */
    export class GeneralAttriRenderII extends GeneralAttriRender {

        public constructor() {
            super();
        }

        protected refresh() {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.textFlow = Utils.htmlParser(this.m_tData.value);
        }
    }
}
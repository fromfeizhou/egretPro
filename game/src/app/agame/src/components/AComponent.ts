module AGame {
    export class AComponent extends eui.Component {

        private m_pParam: any;

        public set param(param: number) {
            this.m_pParam = param;
        }

        public constructor() {
            super();
        }

        public onDestroy(): void {
            
        }

        public removeFromParent(): void {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }

        $onRemoveFromStage(isclear = true): void {
            if (isclear) {
                this.m_pParam = null;
                this.setSkin(null);
            }
            super.$onRemoveFromStage();
        }

        public get skinName(): any {
            return this.$Component[eui.sys.ComponentKeys.skinName];
        }

        public set skinName(value: any) {
            ThemeUtils.setSkinFunc(this, value);
        }
    }

    export class AButton extends eui.Button {
        $onRemoveFromStage(isclear = false): void {
            if (isclear) {
                this.setSkin(null);
            }
            super.$onRemoveFromStage();
        }

        public constructor() {
            super();
        }

        public removeFromParent(): void {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }

        public get skinName(): any {
            return this.$Component[eui.sys.ComponentKeys.skinName];
        }

        public set skinName(value: any) {
            ThemeUtils.setSkinFunc(this, value);
        }
    }

    export class ARadioButton extends eui.RadioButton {
        public constructor() {
            super();
        }
        public get skinName(): any {
            return this.$Component[eui.sys.ComponentKeys.skinName];
        }

        public set skinName(value: any) {
            ThemeUtils.setSkinFunc(this, value);
        }

        $onRemoveFromStage(): void {
            this.setSkin(null);
            super.$onRemoveFromStage();
        }
    }

    export class AHSlider extends eui.HSlider {
        public constructor() {
            super();
            this.liveDragging = true;
        }
        public get skinName(): any {
            return this.$Component[eui.sys.ComponentKeys.skinName];
        }

        public set skinName(value: any) {
            ThemeUtils.setSkinFunc(this, value);
        }

        protected onTrackTouchBegin(event: egret.TouchEvent) {
            super.onTrackTouchBegin(event);
            this.thumb.once(egret.TouchEvent.TOUCH_MOVE, this.onThumbTouchBegin, this);
        }

        $onRemoveFromStage(): void {
            this.setSkin(null);
            super.$onRemoveFromStage();
        }
    }


}
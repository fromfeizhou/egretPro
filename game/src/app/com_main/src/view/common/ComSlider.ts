module com_main {
	/**
	 * 道具
	 */
    export class ComSlider extends CComponent {
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("common/ComSliderSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated() {
            super.childrenCreated();
        }
    }
}
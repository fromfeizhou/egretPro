module com_main {
	export class CComponent extends AGame.AComponent{
		protected lan:any;

		public constructor() {
			super();
			this.lan = L.getInstance().getObject();
		}

        public onDestroy(): void {
            super.onDestroy();
        }

		$onRemoveFromStage(isclear = true): void {
			this.lan = null;
            super.$onRemoveFromStage(isclear);
        }

        /**检查新手引导面板条件 */
		public onGuideCondition(){
			// EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION,IGUIDECD.SCENE);
		}
	}

    /**显示时才加载的组件 */
    export class DynamicComponent extends CComponent{

        private skinSrc: string;

		public constructor() {
			super();
		}

        public set dynamicSkinName(value: any) {
            this.skinSrc = value;
            // AGame.ThemeUtils.setSkinFunc(this, value);
        }

        public set visible(boo: boolean) {
			if (boo && (this.skinName == '' || isNull(this.skinName)) && this.skinSrc) {
                this.skinName = this.skinSrc;
				this.onShow();
			}
			if (boo != this.visible) {
				this.$setVisible(boo);
			}
		}

        protected onShow(){

        }

	}

	export class CCButton extends AGame.AButton {

    }

    export class CCRadioButton extends AGame.ARadioButton {
        public constructor() {
            super();
        }
    }

    export class CCHSlider extends AGame.AHSlider{
        public constructor() {
            super();
        }
    }

    export class CImage extends AGame.AImage{

    }

    export class CList extends eui.List {
        $onRemoveFromStage(): void {
            var dataProvider = <eui.ArrayCollection>this.dataProvider;
            if(dataProvider){
                dataProvider.replaceAll([]);
                this.dataProvider = null;
                this.itemRenderer = null;
            }
            super.$onRemoveFromStage();
        }
    }
}
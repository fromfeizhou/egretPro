module com_main {
	export class ListItemRenderer extends eui.ItemRenderer {
		protected ContentGroup: eui.Group;

		public constructor() {
			super();
		}

		protected childrenCreated(): void {
            super.childrenCreated();
			if (this.ContentGroup) {
				EventManager.addItemRenderAnim(this.ContentGroup);
			}
        }

        $onRemoveFromStage(): void {
            if (this.ContentGroup) {
                EventManager.removeEventListener(this.ContentGroup);
                this.ContentGroup.removeChildren();
            }
            EventManager.removeEventListeners(this);
			this.setSkin(null);
            super.$onRemoveFromStage();
        }
        
        public get skinName(): any {
            return this.$Component[eui.sys.ComponentKeys.skinName];
        }

        public set skinName(value: any) {
            AGame.ThemeUtils.setSkinFunc(this,value);
        }
	}
}
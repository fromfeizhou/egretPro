module com_main {
	export class SoldierUpComsumeCell extends eui.ItemRenderer {

		private m_ParmLabel:eui.Label;
		private m_CurParm:eui.Label;
		private m_CurAtt:eui.Label;
		private m_PreAtt:eui.Label;
		private m_Icon:eui.Image;
		public constructor() {
			super();
			this.touchChildren = true;
			// this.skinName = Utils.getSkinName("app/soldier/SoldierUpComsumeCellSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
		}
		$onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }
        protected dataChanged(): void {
        super.dataChanged();
            if( this.data ){
				this.m_Icon.source = this.data.icon;
                this.m_CurParm.text = this.data.curParm;
                this.m_CurAtt.text = this.data.curAtt;
                this.m_PreAtt.text = this.data.preAtt;
            }
        
        }
	}
}
module com_main {
	export class BuildTitle extends CComponent {
		public m_lbGroup:eui.Group;
		public m_pTipsRoot:eui.Group;
		public m_pTips:com_main.CImage;
		public m_pLbName:com_main.CLabel;

		public m_labelPos;
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/build/buildTitleSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.setAnchorCenter();
			// this.x -= this.anchorOffsetX;
			//this.y -= this.anchorOffsetY;
			this.scaleX = 1.5;
			this.scaleY = 1.5;

		}

		private onRefreshView() {

		}
		public setTitleName(name: string) {
			this.m_pLbName.text = name;
			this.m_lbGroup.width = this.m_pLbName.width;
			this.setAnchorCenter();
		}

		public setTipsIcon(isShow: boolean) {
			
			if(isShow){
				this.m_pTips.width = 21;
				this.m_pTipsRoot.width = 14;
				this.m_lbGroup.width = this.m_pLbName.width + 14;
				this.m_pLbName.x = this.m_labelPos.x - this.width * 0.5 * 1.5 + 21 * 1.5;
			}else{
				this.m_pTips.width = 0;
				this.m_pTipsRoot.width =  0;
				this.m_lbGroup.width = this.m_pLbName.width;
				this.m_pLbName.x = this.m_labelPos.x - this.width * 0.5 * 1.5;
			}
		}

		public getTitleWidth(): number {
			return this.m_pLbName.width;
		}

		public setAnchorCenter(){
			this.anchorOffsetX = this.width * 0.5;
			this.anchorOffsetY = this.height * 0.5;

			if(this.m_labelPos && this.width){
				this.m_pLbName.x = this.m_labelPos.x - this.width * 0.5 * 1.5;
				this.m_pLbName.y = this.m_labelPos.y - 2;
			}
		}

		public set visible(bool:boolean){
			super.$setVisible(bool);
			this.m_pLbName.visible = bool;
		}

		public addLabelToObj(obj: egret.DisplayObjectContainer){

			this.validateNow();
			let pos = this.m_lbGroup.parent.localToGlobal(this.m_pLbName.x, this.m_pLbName.y);

			this.m_labelPos = obj.parent.globalToLocal(pos.x,pos.y);
			// this.m_labelPos.x += 15
			
			obj.addChild(this.m_pLbName);

			this.m_pLbName.anchorOffsetX = this.m_pLbName.width  / 2;
			this.m_pLbName.anchorOffsetY = this.m_pLbName.height / 2;

			this.m_pLbName.scaleX = 1.5;
			this.m_pLbName.scaleY = 1.5;

			this.m_labelPos.x += this.m_pLbName.width*1.5  / 2 ;
			// this.m_labelPos.y += 6;
			this.m_labelPos.y += this.m_pLbName.height*1.5 / 2 ;
			this.m_pLbName.x = this.m_labelPos.x;
			this.m_pLbName.y = this.m_labelPos.y;

		}
	}
}
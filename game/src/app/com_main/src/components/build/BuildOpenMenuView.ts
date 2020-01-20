module com_main {
	export class BuildOpenMenuView extends CComponent{
		private m_groupIcon:eui.Group;
		private m_bIsAction:boolean;
		private m_imgEffect:eui.Image;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/build/BuildOpenMenuViewSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
            this.anchorOffsetX = this.width*0.5;
            this.anchorOffsetY = this.height*0.5;
			this.m_bIsAction = false
		}

		public onDestroy(){
			if(this.m_bIsAction && this.m_groupIcon){
				egret.Tween.removeTweens(this.m_groupIcon);
				egret.Tween.removeTweens(this.m_imgEffect);
			}
		}

        public resreshTips(tipStr:string,isOpen:boolean = false){
            let stateName = isOpen ? "open" : "lock";
			this.currentState = stateName;
			if(isOpen && !this.m_bIsAction){
				this.m_bIsAction = true;
				EffectUtils.macIconShake(this.m_groupIcon, this.m_groupIcon.x, this.m_groupIcon.y);
				egret.Tween.get(this.m_imgEffect,{loop:true}).to({rotation:360},2000);
			}
        }
		
	}
}
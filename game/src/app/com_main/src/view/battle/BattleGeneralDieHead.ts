module com_main {
	export class BattleGeneralDieHead extends CComponent{

		public g_group:eui.Group;
		public img_head:eui.Image;
		public img_faction:eui.Image;
		public line_red:eui.Image;

		private faction:FactionType;

		private leftAction:egret.tween.TweenGroup; //动画
		private rightAction:egret.tween.TweenGroup; //动画

		public constructor() {
			super();
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage(false);
		}

		protected childrenCreated(): void {
            super.childrenCreated();
			this.leftAction.addEventListener("complete", this.onPlayComplete, this);
			this.rightAction.addEventListener("complete", this.onPlayComplete, this);
        }

		public setInfo(faction:FactionType,generalId:number){
			// this.roleId = roleId;
			this.faction = faction;

			let gCfg = GeneralModel.getGeneralConfig(generalId);
			if (gCfg){
				this.img_head.source =  GeneralModel.getCircleLogo(gCfg.role);
			}

			let belongType = BattleModel.getBelongTypeByFaction(this.faction);
			if(belongType == BelongType.OWN){
				this.img_faction.source = "battle_lb_wf_png";
			}else{
				this.img_faction.source = "battle_lb_df_png";
			}

			Utils.isGray(true,this.img_head);
			if(faction == FactionType.ATK){
				Utils.TimerManager.doTimer(1, 1, ()=>{this.playLeft()}, this);
			}else{
				Utils.TimerManager.doTimer(1, 1, ()=>{this.playRight()}, this);
			}
		}

		public playLeft(){
			if(!this.leftAction){
				return ;
			}
			this.leftAction.play(0);
			this.visible = true;
		}

		public playRight(){
			if(!this.rightAction){
				return ;
			}
			this.rightAction.play(0);
			this.visible = true;
		}

		public onPlayComplete(){
			BattleModel.playGeneralDieComplete(this.faction);
			this.visible = false;
		}

	}
}

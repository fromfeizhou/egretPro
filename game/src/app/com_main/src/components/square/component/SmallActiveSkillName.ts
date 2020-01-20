// TypeScript file

module com_main {
	/**
	 * 释放主动技能
	 */
	export class SmallActiveSkillName extends CComponent {

        public group:eui.Group;
		public heng_bg:eui.Image;
		public bg:eui.Image;
		public headImage:eui.Image;
		public headFrame:eui.Image;
		public skillNameImage:eui.Image;

        private animation: egret.tween.TweenGroup; //动画
        
        // private avo: SkillAtkVo;
		private csquare: CSquare; // 发动技能单位
        public unitInfo:UnitInfoVo;
		public skillId:number = 0;
		public attackID: number;
		private m_skilldata:SkillConfig;

        public constructor(avo: SkillAtkVo,csquare?: CSquare) {
			super();
			this.skinName = Utils.getAppSkin("battle_new/components/smallActiveSkillNameSkin.exml");
			this.unitInfo = BattleModel.getUnit(avo.attackData.id);
			this.skillId = avo.skillId;
			this.csquare = csquare;
			// this.avo = avo;
			this.attackID = avo.attackData.id;
			this.m_skilldata = avo.getSkillConfig();
		}

        public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			
			// this.name_lb.text = this.m_content;
            this.anchorOffsetX = this.width >> 1;
            this.anchorOffsetY = this.height >> 1;

            this.animation.play();
            this.animation.addEventListener("complete", this.onTweenComplete, this);

			if(this.unitInfo){
				let config = C.GeneralConfig[this.unitInfo.sysId];
				if(config){
					this.headImage.source = GeneralModel.getCircleLogo(config.role);
				}
			}
            
            this.skillNameImage.source = Utils.getSkillNameImage(this.skillId) + "_png";

			let belongType = BattleModel.getBelongTypeById(this.attackID);
			if(belongType == BelongType.OWN){
				this.heng_bg.source = "battle_skill_bg_3_png";
				this.headFrame.source = "battle_head_bg_3_png";
			}else{
				this.heng_bg.source = "battle_skill_bg_2_png";
				this.headFrame.source = "battle_head_bg_2_png";				
			}
		}

        /**
		 * 动画组播放完成
		 */
		private onTweenComplete(): void {
			// Utils.removeFromParent(this);
            // egret.Tween.get(this).wait(170).call(() =>{
            //     this.csquare.startSkill(this.m_skilldata.skillEffectId);
            // })
			egret.Tween.get(this).wait(170)
			.wait(330)
			.to({alpha:0},170).call(() =>{
                Utils.removeFromParent(this);
            });
            
			
			// console.log("释放 技能id ~~~~~~~~~~",this.avo.skillId);
			// console.log("skilldata.skillEffectId:",skilldata.skillEffectId);
			
		}
    }

}

module com_main {
	export class BattleSkillName extends CComponent {

		public unitInfo:UnitInfoVo;
		public skillId:number = 0;

		public rect:eui.Rect;
		public m_effectNode:eui.Group;
		public m_generalGroup:eui.Group;
		public m_pBoneMask:eui.Image;
		public generalImage:eui.Image;
		public m_dargonLayer:eui.Group;

		private callbackFunc: Function;
		private callbackObj: any;
		// private avo: SkillAtkVo;
		private csquare: CSquare; // 发动技能单位
		private m_effect: MCDragonBones;
		private m_heroMc: MCDragonBones;
		private m_skilldata:SkillConfig;

		public constructor(avo: SkillAtkVo,csquare?: CSquare) {
			super();
			this.skinName = Utils.getAppSkin("battle_new/skill/battle_skill_start_name.exml");
			this.unitInfo = BattleModel.getUnit(avo.attackData.id);
			this.skillId = avo.skillId;
			this.csquare = csquare;
			this.m_skilldata = avo.getSkillConfig();
		}

		protected childrenCreated(): void {

			this.width = this.stage.stageWidth;
			this.height = this.stage.stageHeight;

			this.rect.width = this.stage.stageWidth + 100;
			this.rect.height = this.stage.stageHeight + 100;

			let config = C.GeneralConfig[this.unitInfo.sysId];
			

			this.m_effect = new MCDragonBones();
			this.m_effect.setCallback(this.effectEndCallback,this);
			this.m_effect.bindInitCallback(this.initCallbcak,this);
			this.m_effect.initAsync("HongjiangSkillBefore");
			this.m_effect.play("HongjiangSkillBefore",1,true);
			this.m_effectNode.addChild(this.m_effect);
			this.m_effect.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			
			if (GeneralModel.hasSoliderLogoAnima(config.role)) {
				if(config){
					this.m_heroMc = new MCDragonBones();
					this.m_heroMc.initAsync("Gen_Anim_" + config.role);
					this.m_heroMc.play("animation");
					this.m_heroMc.touchEnabled = false;
					this.m_heroMc.touchChildren = false;
					// Utils.toStageHeightScale(this.m_heroMc);
					this.m_dargonLayer.addChild(this.m_heroMc);
					this.m_dargonLayer.mask = this.m_pBoneMask;
				}
			} else {
				if(config){
					this.generalImage.visible = true;
					this.generalImage.source = GeneralModel.getSoldierBigLogo(config.role);
					this.generalImage.mask = this.m_pBoneMask;
				}
			}

        }

		public setCallback(obj:any,callbackFunc:Function){
			this.callbackObj = obj;
			this.callbackFunc = callbackFunc;
		}

		public initCallbcak(){
			let skillSorce = Utils.getSkillNameImage(this.skillId);
			this.m_effect.setNewSlot("sw1",skillSorce + "_1" +"_png" ,53  ,53);
			this.m_effect.setNewSlot("sw2",skillSorce + "_2" +"_png" ,53  ,53);
			this.m_effect.setNewSlot("sw3",skillSorce + "_3" +"_png" ,53  ,53);
			this.m_effect.setNewSlot("sw4",skillSorce + "_4" +"_png" ,53  ,53);
		}

		public frozenScene(){
			this.visible = false;
		}

		public startScene(){
			// egret.Tween.removeTweens(this);
			// egret.Tween.removeTweens(this.rect);
			this.onDestory();
		}

		public onDestory(){
			// let skilldata = this.avo.getSkillConfig();
			// this.csquare.startSkill(this.m_skilldata.skillEffectId)
			this.csquare.startSkillEffect(this.m_skilldata.skillEffectId);
			Utils.removeFromParent(this);

			if (this.m_effect) {
				this.m_effect.destroy();
				this.m_effect = null;
			}

			if (this.m_heroMc) {
				this.m_heroMc.destroy();
				this.m_heroMc = null;
			}

			// EventMgr.removeEventByObject(EventEnum.BATTLE_FROZEN_SCENE,this.frozenScene);
			// EventMgr.removeEventByObject(EventEnum.BATTLE_START_SCENE,this.startScene);
		}

		$onRemoveFromStage(isclear = true): void {
			// egret.Tween.removeTweens(this);
			// egret.Tween.removeTweens(this.rect)

            super.$onRemoveFromStage(isclear);
        }

		public effectEndCallback(){
			var tw2 = egret.Tween.get(this);
			tw2.wait( 100 )
			.to( {alpha:0}, 150)
			.call(()=>{
				this.onDestory();
			} );
		}

		private frame_event(evt:dragonBones.FrameEvent)
        {
			if(evt.frameLabel == "changeGeneral"){

				let config = C.GeneralConfig[this.unitInfo.sysId];
				let image = new eui.Image()
				image.source = GeneralModel.getSoldierBigLogo(config.role);

				Utils.removeFromParent(this.m_generalGroup);
				this.m_generalGroup.visible = true;
				this.m_effect.setSlotDisplay("general",this.m_generalGroup, 0, 0);
			}
        }
	}


}
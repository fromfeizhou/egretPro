module com_main {
	export class BattleSoldierHpBar extends CComponent{
		public hpBg_image:eui.Image;
        public HP_image:eui.Image;
		public static BATTLE_SOLDIER_HP_SHOW_TIME:number;
		public static BATTLE_SOLDIER_HP_DISAPPLLE_TIME:number;
		public static BATTLE_SOLDIER_HP_MOVE_TIME:number;

		private m_pUnitInfo: UnitInfoVo;
		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("battle_new/components/soldierHpBarSkin.exml");
		}

		$onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

		public onDestroy() {
			super.onDestroy();
			this.removeFromParent();
			this.m_pUnitInfo = null;

			BattleSoldierHpBar.BATTLE_SOLDIER_HP_SHOW_TIME = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_HP_SHOW_TIME); //小兵被攻击血条显示时间
            BattleSoldierHpBar.BATTLE_SOLDIER_HP_DISAPPLLE_TIME = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_HP_DISAPPLLE_TIME); //小兵血条小时渐变消失时间
            BattleSoldierHpBar.BATTLE_SOLDIER_HP_MOVE_TIME = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_HP_MOVE_TIME); //小兵血条掉血量移动时间
		}
		protected childrenCreated(): void {
			super.childrenCreated();

			if(!this.m_pUnitInfo){
				return ;
			}
			this.initHP();
		}

		public setData(unitInfo: UnitInfoVo) {
			this.m_pUnitInfo = unitInfo;
		}

		public initHP(){
			if(this.m_pUnitInfo.faction == FactionType.ATK){
				this.HP_image.source = "pro_017_png";
			}else if (this.m_pUnitInfo.faction == FactionType.DEF){
				this.HP_image.source = "pro_016_png";
			}
		}

		public setHP(hp:number){
            Tween.removeTweens(this.HP_image);
            Tween.removeTweens(this);

			if(this.HP_image){
				let width = Math.min(1,hp/this.m_pUnitInfo.getMaxHp())  * 34;
                Tween.get(this.HP_image).to({width:width},BattleSoldierHpBar.BATTLE_SOLDIER_HP_MOVE_TIME)
			}
            Tween.get(this).wait(BattleSoldierHpBar.BATTLE_SOLDIER_HP_SHOW_TIME).to({alpha:0},BattleSoldierHpBar.BATTLE_SOLDIER_HP_DISAPPLLE_TIME).call(()=>{
                this.visible = false;
            });

            this.visible = true;
			this.alpha = 1;
		}

		public setHpNoTween(hp:number){
			Tween.removeTweens(this.HP_image);
			let width = Math.min(1,hp/this.m_pUnitInfo.getMaxHp())  * 34;
            this.HP_image.width = width;
		}
	}
}
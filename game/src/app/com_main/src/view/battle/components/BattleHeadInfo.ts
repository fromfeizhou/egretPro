module com_main {
	export class BattleHeadInfo extends CComponent{

		public hpBg_image:eui.Image;
		public HP_image:eui.Image;
		public m_lbName:eui.Label;
		public country:eui.Label;

		private m_pUnitInfo: UnitInfoVo;
		// private m_guajiInfo:{name: string,factionName: string,isSelf: boolean}

		public constructor() {
			super();
			// this.initApp("role/roel_battle_head_info.exml");
			this.skinName = Utils.getAppSkin("battle_new/components/roel_battle_head_info.exml");
		}

		public onDestroy() {
			super.onDestroy();
			this.removeFromParent();
			this.m_pUnitInfo = null;
		}
		protected childrenCreated(): void {
			super.childrenCreated();

			if(!this.m_pUnitInfo){
				// this.showPlayerName();
				return ;
			}

			this.setPlayerName();
			this.initHP();
			this.setCountryText();
		}

		public setData(unitInfo: UnitInfoVo) {
			this.m_pUnitInfo = unitInfo;
		}

		// public setPlayerLevel(level) {
		// 	this.m_lbLevel.text = level + "";
		// }

		public setCountryText(){
			let info = GeneralModel.getNationText(this.m_pUnitInfo.sysId);
			this.country.text = info.text;
			this.country.textColor = info.color;
		}

		public setCountryByCountryId(countryId){
			let info = GeneralModel.getNationTextByCountryId(countryId);
			this.country.text = info.text;
			this.country.textColor = info.color;
		}

		public setPlayerName() {
			this.m_lbName.text = this.m_pUnitInfo.generalName;
			if(this.m_pUnitInfo.faction == FactionType.ATK){
				this.m_lbName.textColor = 0x00C6FF;
			}else if (this.m_pUnitInfo.faction == FactionType.DEF){
				this.m_lbName.textColor = 0xFF0000;
			}
		}

		public initHP(){
			if(this.m_pUnitInfo.faction == FactionType.ATK){
				this.HP_image.source = "pro_017_png";
			}else if (this.m_pUnitInfo.faction == FactionType.DEF){
				this.HP_image.source = "pro_016_png";
			}
		}

		public setHP(hp:number){
			if(this.HP_image){
				let width = Math.min(1,hp/this.m_pUnitInfo.getMaxHp())  * 62;
				this.HP_image.width = width;
			}
		}

		/**
		 * 显示玩家名字，国家
		 */
		public showPlayerName(guajiInfo:IGenHeadTitle){
			this.hpBg_image.visible = false;
			this.HP_image.visible = false;

			if(guajiInfo.isSelf){
				this.m_lbName.text = RoleData.nickName;
				this.m_lbName.textColor = 0x4BFE47;
			}else{
				this.m_lbName.text = guajiInfo.name;
				this.m_lbName.textColor = 0xFF37EA;
			}

			this.setCountryByCountryId(guajiInfo.countryId);
		}

		/**
		 * 显示玩家阵营，
		 */
		public showFactionName(guajiInfo:{ name: string,faction: number}){
			this.hpBg_image.visible = false;
			this.HP_image.visible = false;

			this.m_lbName.text = guajiInfo.name;
			if(guajiInfo.faction == CrossModel.getSelfGroup()){
				this.m_lbName.textColor = 0x4BFE47;
				this.country.text = '我';
				this.country.textColor = 0x44d0f3;
			}else{
				this.m_lbName.textColor = 0xFF37EA;
				this.country.text = '敌';
				this.country.textColor = 0xff2727;
			}
		}

		// public setGuajiPlayerInfo(info:{name: string,factionName: string,isSelf: boolean}){
		// 	this.m_guajiInfo = info;
		// }

		// public setPlayerHead(icon: string) {
		// 	this.m_imgHead.source = icon;
		// }

		// public setHeadBgByInfo(sideId) {
		// 	this.m_imgHeadBg.source = "battle_head_bg_" + sideId;
		// }

		// public flush() {
		// 	if (!hasParent(this)) return;
		// 	if (isNull(this.m_pUnitInfo)) return;

		// 	if (this.m_pUnitInfo.type == UnitType.PLAYER_GENERAL) {
		// 		if (this.m_pPlayerInfo) {
		// 			this.setPlayerName(this.m_pPlayerInfo.name);
		// 			this.setPlayerLevel(this.m_pPlayerInfo.level);
		// 			Utils.setPlayerHeadImg(this.m_imgHead, this.m_pPlayerInfo.head, false);
		// 		}
		// 	} else if (this.m_pUnitInfo.type == UnitType.NPC_GENERAL) {
		// 		if (this.m_pPlayerInfo && this.m_pPlayerInfo.getVirtual()) {
		// 			this.setPlayerName(GLan(this.m_pPlayerInfo.name));
		// 			this.setPlayerLevel(this.m_pPlayerInfo.level);
		// 			Utils.setPlayerHeadImg(this.m_imgHead, this.m_pPlayerInfo.head, false);
		// 		} else {
		// 			// let unitConfig = this.m_pUnitInfo.getUnitConfig();
		// 			// this.setPlayerName(GLan(unitConfig.unit.npcName));
		// 			this.setPlayerName(this.m_pUnitInfo.name);
		// 		}
		// 	}

		// 	let sideId = Utils.getUnitFlagEffectId(this.m_pUnitInfo.faction, this.m_pUnitInfo.playerId);
		// 	this.setHeadBgByInfo(sideId);
		// }
	}
}
module com_main {
	export class MyHeadRender extends CComponent {

		private m_pHead:com_main.GeneralHeadRender;
		private m_pLbNum:eui.Label;

		private m_pBattle: ItfSiegeBase = null;
		
		public constructor(data: ItfSiegeBase) {
			super();
			this.m_pBattle = data;

			if (data.battleId > 0) {
				this.currentState = "battle";
			} else {
				this.currentState = "base";
			}

            this.skinName = Utils.getAppSkin("battle_new/gongchengzhan/MyHead.exml");
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		
		protected childrenCreated(): void {
            super.childrenCreated();
			// this.m_pLbNum.text = `${this.m_pBattle.pos}`;
			this.m_pHead.setGenId(this.m_pBattle.mainGid);
			
			EventManager.addTouchTapListener(this, this, e=> {
				// SceneManager.enterScene(SceneEnums.BATTLE_MAP, this.m_pBattle,false);
				// if (this.m_pBattle.battleId > 0) {
				// 	SceneManager.enterScene(SceneEnums.BATTLE_MAP, nextSiege,false);
				// }

				if(BattleModel.getJoinedBattleId() != this.m_pBattle.battleId){
					BattleProxy.send_C2S_WAR_REENTRY_BATTLE(this.m_pBattle.battleId);
					WorldModel.setCurWatchTeamId(RoleData.playerId,this.m_pBattle.teamId);
				}
			})
		}
		
		public onDestroy() {
			EventManager.removeEventListeners(this);
			super.onDestroy();
			this.m_pBattle = null;
		}

	}

    
}
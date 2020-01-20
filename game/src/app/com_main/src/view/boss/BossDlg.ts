// module com_main {
// 	/**boss */
// 	export class BossDlg extends CView {


// 		public static NAME = 'BossDlg';
// 		private m_PopUp: com_main.APopUp;
// 		private m_generalName: eui.Label;
// 		private m_startGroup: eui.Group;
// 		private m_fight: eui.Label;
// 		private m_contentGroup: eui.Group;
// 		private m_needCondition: eui.Label;
// 		private m_BtnchangeGeneral: com_main.ComButton;
// 		private m_BtnChallenge: com_main.ComButton;
// 		private m_ImageType: eui.Image;
// 		private image_general_all: eui.Image;
// 		private m_heroMc: MCDragonBones;
// 		private m_dargonLayer: eui.Group;
// 		private m_mask: eui.Image;
// 		private m_boosTileName = ['', '登门切磋', '敌将攻城', '城内治安'];
// 		// 第二个参数key为条件内容，$hallLevel$为大殿等级，$patrolscore$为巡查杀敌数,$buildingsilver$为主城收银币数
// 		// ，$buildinggrain$为主城收粮食数，$buildingwood$主城收木材数，$buildingiron$为主城收铁矿数
// 		private m_info;
// 		private m_bossType = BossType.NOTES;
// 		private bOpenView = false;
// 		public constructor(data?) {
// 			super();
// 			this.name = BossDlg.NAME;
// 			if (data) {
// 				this.m_info = data;
// 				this.m_bossType = Number(data.type) || BossType.NOTES;
// 			}
// 			this.initApp("boss/BossDlgSkin.exml");
// 		}
// 		protected listenerProtoNotifications(): any[] {
// 			return [
// 				// ProtoDef.GET_BOSS,
// 			];
// 		}

// 		/**处理协议号事件 */
// 		protected executes(notification: AGame.INotification) {
// 			let body = notification.getBody();
// 			let protocol: number = Number(notification.getName());
// 			debug("TechnologyPanel:execute -------->protocol, body:", protocol, body)
// 			switch (protocol) {
// 				// case ProtoDef.GET_BOSS: {
// 				// 	let info = BossModel.getInfobyType(this.m_bossType); //
// 				// 	this.initPanel(info);
// 				// }
// 				// break;
// 			}
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.m_PopUp.setTitleLabel(this.m_boosTileName[this.m_bossType]);
// 			this.m_BtnchangeGeneral.setTitleLabel('布阵');
// 			this.m_BtnChallenge.setTitleLabel('挑战');
// 			EventManager.addTouchScaleListener(this.m_BtnchangeGeneral, this, () => {
// 				Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: TeamType.BOSS });
// 			});
// 			EventManager.addTouchScaleListener(this.m_BtnChallenge, this, () => {
// 				Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: TeamType.BOSS, battleId: this.m_bossType });
// 			});
// 			BossProxy.C2S_GET_BOSS();
// 		}
// 		public onDestroy(): void {
// 			super.onDestroy();
// 			this.clearHeroMc();
// 			EventManager.removeEventListeners(this);
// 		}
// 		private initPanel(info) {
// 			let bossCfg = C.BossConfig[info.id];
// 			this.updateGeneral(bossCfg);
// 			this.updataStar(bossCfg);
// 			this.updateConsume(bossCfg);
// 			/**判断条件 */
// 			this.JudgeCondition();
// 		}
// 		/**刷新消耗武将 */
// 		private updateGeneral(bossCfg) {
// 			let cfg = GeneralData.getGeneralConfig(Number(bossCfg.model));
// 			this.m_generalName.text = GLan(cfg.name);
// 			let generalOccupation = GeneralModel.getGeneralOccupation(Number(bossCfg.model));

// 			this.m_ImageType.source = GeneralModel.getSoldierTypeIcon(generalOccupation, 1);
// 			this.m_fight.text = bossCfg.power + "";
// 			this.refreshCardView(Number(bossCfg.model));
// 			this.image_general_all.source = GeneralModel.getSoldierBigLogo(cfg.role);
// 			// Utils.toStageHeightScale(this.image_general_all);
// 		}
// 		/**刷新消耗星星 */
// 		private updataStar(config) {
// 			let star = config.star;
// 			for (let i = 0; i < 5; i++) {
// 				this[`m_start${i}`].visible = false;
// 			}
// 			for (let i = 0; i < 5; i++) {
// 				this[`m_start${i}`].visible = i < star;
// 			}
// 		}
// 		/**刷新消耗资源 */
// 		private updateConsume(bossCfg) {
// 			this.m_contentGroup.removeChildren();
// 			let rewardArr = JSON.parse(bossCfg.reward);

// 			for (let i = 0; i < rewardArr.length; i++) {
// 				let item = ComItemNew.create("count");
// 				item.setItemInfo(rewardArr[i][1])
// 				item.refreshCount(rewardArr[i][2]);
// 				this.m_contentGroup.addChild(item);
// 			}
// 		}
// 		private JudgeCondition() {
// 			// let data = BossModel.JudgeIsFight(this.m_bossType);
// 			// if (data.res) {
// 			// 	this.m_BtnChallenge.visible = true;
// 			// 	this.m_needCondition.visible = false;
// 			// } else {
// 			// 	this.m_BtnChallenge.visible = false;
// 			// 	this.m_needCondition.visible = true;
// 			// 	if (data.condition) {
// 			// 		var key = data.condition.key;
// 			// 		var min = data.condition.min;
// 			// 		if (key == "$hallLevel$") {
// 			// 			this.m_needCondition.text = '需要大殿等级' + min + '级';
// 			// 		} else if (key == "$patrolscore$") {
// 			// 			this.m_needCondition.text = '需要巡查杀敌数' + min + '个';
// 			// 		} else if (key == "$buildingsilver$") {
// 			// 			this.m_needCondition.text = '需要为主城收集银两' + min;
// 			// 		} else if (key == "$buildinggrain$") {
// 			// 			this.m_needCondition.text = '需要为主城收集粮食' + min;
// 			// 		} else if (key == "$buildingwood$") {
// 			// 			this.m_needCondition.text = '需要为主城收集木材' + min;
// 			// 		} else if (key == "$buildingiron$") {
// 			// 			this.m_needCondition.text = '需要为主城收集铁矿' + min;
// 			// 		}
// 			// 	}
// 			// }
// 		}
		
// 		/**刷新卡牌 */
// 		private refreshCardView(generalId) {
// 			this.clearHeroMc();
// 			this.image_general_all.visible = false;
// 			let config = GeneralData.getGeneralConfig(generalId);
// 			let roleId = config.role;
// 			if (GeneralModel.hasSoliderLogoAnima(roleId)) {
// 				this.m_heroMc = new MCDragonBones();
// 				this.m_heroMc.initAsync("Gen_Anim_" + roleId);
// 				this.m_heroMc.play("animation");
// 				this.m_heroMc.touchEnabled = false;
// 				this.m_heroMc.touchChildren = false;
// 				// Utils.toStageHeightScale(this.m_heroMc);
// 				this.m_heroMc.y = -30;
// 				this.m_dargonLayer.addChild(this.m_heroMc);
// 				this.m_dargonLayer.mask = this.m_mask;

// 			} else {
// 				this.image_general_all.visible = true;
// 				this.image_general_all.source = GeneralModel.getSoldierBigLogo(roleId);
// 				// Utils.toStageHeightScale(this.image_general_all);
// 				this.image_general_all.mask = this.m_mask;
// 			}
// 		}
// 		/**清理动画 */
// 		private clearHeroMc() {
// 			if (this.m_heroMc) {
// 				this.m_heroMc.destroy();
// 				this.m_heroMc = null;
// 			}
// 		}
// 		private soldierType = [100, 101, 102];//bu qi gong 
// 		private getSoldierType(sType) {
// 			for (let i = 0; i < this.soldierType.length; i++) {
// 				if (this.soldierType[i] == sType) {
// 					return (i + 1);
// 				}
// 			}
// 			return 1;
// 		}

// 	}
// }
// module com_main {
// 	export class BuildInfoView extends CView {
// 		/// 数据
// 		private m_pInfo: any;
// 		private m_pViewInfo: any;
// 		////// 组件成员 //////
// 		private m_pLbTopPlayerName: eui.Label;
// 		// 进攻人数
// 		private m_pLbAckNums: eui.Label;
// 		// 防守的人数
// 		private m_pLbDefNums: eui.Label;
// 		// 城主的名字
// 		private m_pLbOwnerName: eui.Label;
// 		// 守军人数
// 		private m_pLbDefendSoldiers: eui.Label;
// 		// 血量
// 		private m_pHp: com_main.CCProgress;
// 		// 按钮
// 		private m_pBtn: com_main.ComButton;
// 		// 保护剩余时间
// 		private m_pLbProtectRemainTime: eui.Label;
// 		// 保护剩余时间
// 		private m_pRemainTime: number = 0;
// 		public constructor(info: any) {
// 			super();
// 			this.m_pViewInfo = info;
// 			this.m_pInfo = WorldMapModel.getCityBuildInfo(this.m_pViewInfo.id);
// 			debug("建筑数据：", this.m_pInfo);
// 			debug("面板数据：", this.m_pViewInfo);
// 			this.initApp("map/build/map_build_info_view.exml");
// 		}
// 		public onDestroy(): void {
// 			// 需要解除引用的数据
// 			this.m_pInfo = null;
// 			this.m_pViewInfo = null;
// 			EventManager.removeEventListeners(this);
// 			if (this.m_pHp != null) {
// 				Utils.removeFromParent(this.m_pHp);
// 				this.m_pHp = null;
// 			}
// 			Utils.TimerManager.remove(this.updateRemainTime, this);
// 			super.onDestroy();
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			// 初始化城池信息
// 			this.initBuilInfo();
// 		}
// 		// protected listenerProtoNotifications(): any[] {
// 		// 	return [[]];
// 		// }
// 		// protected executes(notification: AGame.INotification) {
// 		// 	let body = notification.getBody();
// 		// 	let protocol: number = Number(notification.getName());
// 		// 	switch (protocol) {
// 		// 	}
// 		// }
// 		/**
//          * 初始化城池信息
//          */
// 		private initBuilInfo() {
// 			// 初始化通用信息
// 			this.initCommonBuildInfo();
// 			this.initOhterInfo();
// 		}
// 		/**初始化通用信息 */
// 		private initCommonBuildInfo() {
// 			let cfg = C.WorldMapConfig[this.m_pViewInfo.id];
// 			// 设置守兵与hp
// 			this.initDefendSoldiersAndHp(cfg.cpId.valueOf());
// 			// 设置攻城猛将的名字
// 			if (this.m_pViewInfo.hitWallWarrior && this.m_pViewInfo.hitWallWarrior.name) {
// 				let playerName = this.m_pViewInfo.hitWallWarrior.name;
// 				let countryId = this.m_pViewInfo.hitWallWarrior.countryId;
// 				let countryName = Utils.getCountyName(countryId);
// 				this.m_pLbTopPlayerName.text = "[" + countryName + "]" + playerName;
// 			} else {
// 				this.m_pLbTopPlayerName.text = "暂无";
// 			}
// 		}
// 		/**
// 		 * 初始化守城人数和血量
// 		 */
// 		private initDefendSoldiersAndHp(cpId: number) {
// 			let cpCfg = BattleData.getCheckPointConfig(cpId);
// 			// todo 这里需要获取世界等级
// 			let worldLevel = 1;
// 			let unitCfgs = C.UnitConfig;
// 			for (let key in unitCfgs) {
// 				let cfg = unitCfgs[key];
// 				if (cfg.npcCategory == cpId && cfg.minWorldLevel <= worldLevel && worldLevel <= cfg.maxWorldLevel) {
// 					// 设置守兵人数
// 					let strUnit: string = "守兵";
// 					if (this.m_pViewInfo.troop != null) {
// 						this.m_pLbDefendSoldiers.text = this.m_pViewInfo.troop + strUnit;
// 					} else {
// 						this.m_pLbDefendSoldiers.text = cfg.lead + strUnit;
// 					}
// 					// 设置城池血量
// 					let percent: number = 0;
// 					let maxHp: number = cfg.hp.valueOf();
// 					if (this.m_pViewInfo.maxWallHp != null) {
// 						maxHp = this.m_pViewInfo.maxWallHp;
// 					}
// 					debug("maxHp: ", maxHp);
// 					debug("this.m_pViewInfo.wallHp", this.m_pViewInfo.wallHp);
// 					if (this.m_pViewInfo.wallHp != null) {
// 						percent = this.m_pViewInfo.wallHp / maxHp;
// 					} else {
// 						percent = maxHp / maxHp;
// 					}
// 					if (this.m_pHp == null) {
// 						this.m_pHp = new com_main.CCProgress(ProgressTypes.PT_BUILD_HP);
// 						Utils.addChild(this, this.m_pHp);
// 						this.m_pHp.x = 322;
// 						this.m_pHp.y = 358;
// 					}
// 					// 根据当前百分比，计算出要显示的百分比
// 					percent = Utils.getVirtualBlood(percent);
// 					this.m_pHp.value = (percent * 100);
// 					break;
// 				}
// 			}
// 		}
// 		/**
// 		 * 根据建筑状态初始化其他信息面板信息
// 		 */
// 		private initOhterInfo() {
// 			/**建筑状态 */
// 			switch (this.m_pInfo.type) {
// 				case BuildEffectType.NOT_TO_ATTACK: { 		//（敌国建筑）我国不可攻打
// 					this.initNormalBuildInfo(false);
// 					break;
// 				}
// 				case BuildEffectType.ORTHER_ATTACK: {	//（敌国建筑）敌方开战状态（另外2国的战斗）
// 					this.initNormalBuildInfo(true);
// 					break;
// 				}
// 				case BuildEffectType.CAN_ATTACK: { //（敌国建筑）除国家任务外我国可攻打
// 					// 有战场ID
// 					if (this.m_pViewInfo.battleId) {
// 						this.initBattleBuildInfo(false);
// 					} else {
// 						this.initNormalBuildInfo(false, true);
// 					}
// 					break;
// 				}
// 				case BuildEffectType.Raid: 			//偷袭状态
// 				case BuildEffectType.ATTACK: {		//（敌国建筑-显示攻击图标）国家任务攻击状态					
// 					this.initBattleBuildInfo(false);
// 					break;
// 				}
// 				case BuildEffectType.BE_ATTACK:		//（我国建筑-显示摧毁图标）除国家任务外我方被攻击状态
// 				case BuildEffectType.DEFEND: {		//（我国建筑-显示防守图标）国家任务防守状态					
// 					this.initBattleBuildInfo(true);
// 					break;
// 				}
// 				default: {
// 					this.initNormalBuildInfo(false);
// 					break;
// 				}
// 			}
// 		}
// 		/**
// 		 * 初始化普通状态城池信息
// 		 */
// 		private initNormalBuildInfo(isFighting: boolean, isCanFight: boolean = false) {
// 			this.currentState = "normal";
// 			// 更新对象属性绑定 
// 			this.validateNow();
// 			// 设置城主信息
// 			let noMayor: string = "未有城主";
// 			this.m_pLbOwnerName.text = ((this.m_pViewInfo.mayor == "" || this.m_pViewInfo.mayor == null) ? noMayor : this.m_pViewInfo.mayor);
// 			if (isCanFight) {
// 				this.m_pBtn.touchEnabled = true;
// 				this.m_pBtn.setTitleImg("font_cjzd_png");
// 				EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickBtn);
// 			} else {
// 				// 设置按钮上的文字
// 				if (isFighting) {
// 					this.m_pBtn.setTitleImg("font_tgzdz_png");
// 				} else {
// 					this.m_pBtn.setTitleImg("font_hp_png");
// 				}
// 				// 设置按钮置灰
// 				this.m_pBtn.disabled = true;
// 			}
// 			// 上一轮属于我的国家并且保护时间大于0
// 			if (this.m_pInfo.lastCountry && this.m_pInfo.protectEndTime && this.m_pInfo.lastCountry == RoleData.countryId) {
// 				let endTime = Number(this.m_pInfo.protectEndTime);
// 				let serverTime = TimerUtils.getServerTimeMill();
// 				if (endTime > serverTime) {
// 					this.m_pBtn.disabled = true;
// 					this.m_pRemainTime = Math.ceil((endTime - serverTime) / 1000);
// 					this.m_pLbProtectRemainTime.visible = true;
// 					this.m_pLbProtectRemainTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
// 					Utils.TimerManager.doTimer(1000, this.m_pRemainTime + 1, this.updateRemainTime, this);
// 				}
// 			}
// 		}
// 		/**
// 		 * 初始化战斗中城池信息
// 		 */
// 		private initBattleBuildInfo(isDefend: boolean) {
// 			this.currentState = "battle";
// 			// 更新对象属性绑定
// 			this.validateNow();
// 			// 设置攻守人数			
// 			if (this.m_pViewInfo.atkPlayerNum != null) {
// 				//攻击方玩家数
// 				this.m_pLbAckNums.text = "" + this.m_pViewInfo.atkPlayerNum;
// 			}
// 			if (this.m_pViewInfo.defPlayerNum != null) {
// 				//防守方玩家数
// 				this.m_pLbDefNums.text = "" + this.m_pViewInfo.defPlayerNum;
// 			}
// 			// // 设置战况信息
// 			// this.setBuildState(isDefend);
// 			// // 设置排队人数
// 			// if (this.m_pViewInfo.queueNum) {
// 			// 	this.m_pWaitingNum.text = this.m_pViewInfo.queueNum.toString();
// 			// } else {
// 			// 	this.m_pWaitingNum.text = (<number>0).toString();
// 			// }
// 			// // 设置场上玩家头像
// 			// this.initBattlePlayersInfo();
// 			EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickBtn);
// 		}
// 		private updateRemainTime() {
// 			if (--this.m_pRemainTime > -1) {
// 				this.m_pLbProtectRemainTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
// 			} else {
// 				this.m_pBtn.disabled = false;
// 				this.m_pLbProtectRemainTime.visible = false;
// 				Utils.TimerManager.remove(this.updateRemainTime, this);
// 			}
// 		}
// 		/**
// 		 * 点击按钮
// 		 */
// 		private onClickBtn() {
// 			// 士兵打架中不能参加战斗
// 			if (TavernModel.isFighting()) {
// 				let desc = "士兵打架中";
// 				let tmpDesc = GLan(550015);
// 				if (tmpDesc && tmpDesc != "") {
// 					desc = tmpDesc;
// 				}
// 				EffectUtils.showTips(desc, 1, true);
// 				return;
// 			}
// 			// 没有上阵武将不能参加战斗
// 			if (GeneralModel.getOnBattleGeneralInfo().length <= 0) {
// 				let desc = "没有上阵的武将"
// 				let tmpDesc = GLan(500076);
// 				if (tmpDesc && tmpDesc != "") {
// 					desc = tmpDesc;
// 				}
// 				EffectUtils.showTips(desc, 1, true);
// 				return;
// 			}
// 			// /**进入战斗 */
// 			let bid = this.m_pViewInfo.battleId;
// 			if (bid && bid != 0) {
// 				SceneManager.enterScene(SceneEnums.BATTLE_MAP, bid);
// 			} else {
// 				WorldMapProxy.send_CITY_BATTLE_ENTER(this.m_pInfo.id);
// 			}
// 			UpManager.history();
// 		}
// 	}
// }

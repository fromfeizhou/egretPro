// module com_main {
// 	// 城池面板
// 	export class BuildInfo extends CView {

// 		/// 数据
// 		private m_pInfo: any;
// 		private m_pViewInfo: any;

// 		/// 组件成员
// 		// 面板按钮
// 		public m_pBtn: com_main.ComButton;
// 		// 封地按钮
// 		public m_pBtnBiref: com_main.ComButton;
// 		// 城主名字		
// 		public m_pOwnerName: eui.Label;
// 		// 防守的士兵数量
// 		public m_pDefendSoldiers: eui.Label;
// 		// 城池图片
// 		public m_pBuildImg: com_main.CImage;
// 		// 城池背景图片
// 		public m_pBuildTerrain: com_main.CImage;
// 		// 城池血量图片
// 		public m_pBuildHp: com_main.CImage;
// 		// 城池血量背景图
// 		public m_pBuildHpBg: com_main.CImage;
// 		// 攻城猛将的名字
// 		public m_pTopPlayerName: eui.Label;
// 		// 城池战斗状态
// 		public m_pBattleState: eui.Label;
// 		// 进攻国家标识
// 		public m_pAttackCount: com_main.CImage;
// 		// 防守国家标识
// 		public m_pDefendCount: com_main.CImage;
// 		// 排队人数
// 		public m_pWaitingNum: eui.Label;
// 		// 战场上玩家的头像
// 		public m_pBattlePlayers: eui.Group;

// 		public constructor(info: any) {
// 			super();

// 			this.m_pViewInfo = info;
// 			this.m_pInfo = WorldMapModel.getCityBuildInfo(this.m_pViewInfo.id);

// 			debug("建筑数据：", this.m_pInfo);
// 			debug("面板数据：", this.m_pViewInfo);

// 			this.initApp("map/build/map_build_info.exml");
// 		}

// 		public onDestroy(): void {
// 			super.onDestroy();

// 			// 需要解除引用的数据
// 			this.m_pInfo = null;
// 			this.m_pViewInfo = null;

// 			//EventManager.removeEventListeners(this);
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			// 初始化城池信息
// 			this.initBuilInfo();
// 		}

// 		protected listenerProtoNotifications(): any[] {
// 			return [[ProtoDef.CITY_BATTLE_GET_FIEFS]];
// 		}


// 		protected executes(notification: AGame.INotification) {
// 			let body = notification.getBody();
// 			let protocol: number = Number(notification.getName());
// 			switch (protocol) {
// 				case ProtoDef.CITY_BATTLE_GET_FIEFS:
// 					if (!body.fiefInfo) { error("数据为空"); return; }
// 					Utils.open_view(TASK_UI.POP_BUILD_FIEF_CONSTRU_PANEL, body.fiefInfo.id);
// 					break;
// 			}
// 		}

// 		/**
//          * 初始化城池信息
//          */
// 		private initBuilInfo() {
// 			// 初始化面板其他信息
// 			this.initOhterInfo();
// 			// 初始化通用信息
// 			this.initCommonBuildInfo();
// 			this.initBriefInfo();
// 		}

// 		/**
//          * 初始化通用城池信息
//          */
// 		private initCommonBuildInfo() {
// 			let cfg = C.WorldMapConfig[this.m_pViewInfo.id];
// 			// 设置地形图片
// 			Utils.setImageFromSource(this.m_pBuildTerrain, Utils.getBuildTerrainSource(cfg.terrain.valueOf()));
// 			// 设置城池图片
// 			this.setBuildImg(cfg.type.valueOf());
// 			// 设置城主信息
// 			let noMayor: string = "未有城主";
// 			this.m_pOwnerName.text = ((this.m_pViewInfo.mayor == "" || this.m_pViewInfo.mayor == null) ? noMayor : this.m_pViewInfo.mayor);
// 			// 设置守兵与hp
// 			this.initDefendSoldiersAndHp(cfg.cpId.valueOf());
// 			// 设置攻城猛将的名字
// 			if (this.m_pViewInfo.hitWallWarrior && this.m_pViewInfo.hitWallWarrior.name) {
// 				let playerName = this.m_pViewInfo.hitWallWarrior.name;
// 				let countryId = this.m_pViewInfo.hitWallWarrior.countryId;
// 				let countryName = Utils.getCountyName(countryId);
// 				this.m_pTopPlayerName.text = "[" + countryName + "]" + playerName;
// 			} else {
// 				this.m_pTopPlayerName.text = "暂无";
// 			}
// 		}

// 		/**
//          * 初始化普通状态城池信息
//          */
// 		private initNormalBuildInfo(isFighting: boolean, isCanFight: boolean = false) {
// 			this.currentState = "normal";
// 			// 更新对象属性绑定 
// 			this.validateNow();

// 			if (isCanFight) {
// 				this.m_pBtn.touchEnabled = true;
// 				this.m_pBtn.setTitleImg("font_cjzd_png");
// 				EventManager.addTouchScaleListener(this.m_pBtn, this, this.on_click);
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
// 		}

// 		/**
// 		 * 设置封地
// 		 */
// 		private initBriefInfo() {
// 			// 我的国家
// 			if (this.m_pInfo.country == RoleData.countryId) {
// 				this.m_pBtn.x = 25;
// 				this.m_pBtnBiref.setTitleImg("");
// 				this.m_pBtnBiref.visible = true;
// 				EventManager.addTouchScaleListener(this.m_pBtnBiref, this, this.onClickBiref);
// 			}
// 		}

// 		/**
//          * 初始化战斗中城池信息
//          */
// 		private initBattleBuildInfo(isDefend: boolean) {
// 			this.currentState = "battle";
// 			// 更新对象属性绑定
// 			this.validateNow();

// 			// 设置战况信息
// 			this.setBuildState(isDefend);
// 			// 设置排队人数
// 			if (this.m_pViewInfo.queueNum) {
// 				this.m_pWaitingNum.text = this.m_pViewInfo.queueNum.toString();
// 			} else {
// 				this.m_pWaitingNum.text = (<number>0).toString();
// 			}

// 			// 设置场上玩家头像
// 			this.initBattlePlayersInfo();

// 			EventManager.addTouchScaleListener(this.m_pBtn, this, this.on_click);
// 		}

// 		/**
// 		 * 初始化场上玩家信息
// 		 */
// 		private initBattlePlayersInfo() {
// 			debug("initBattlePlayersInfo");
// 			debug(this.m_pBattlePlayers.numElements);
// 			this.m_pBattlePlayers.touchChildren = true;
// 			for (let i = 0; i < this.m_pBattlePlayers.numElements; i++) {
// 				let ele: com_main.ComHeadImgLv = <com_main.ComHeadImgLv>this.m_pBattlePlayers.getElementAt(i);
// 				if (i < this.m_pViewInfo.battlePlayer.length) {
// 					ele.setInfo(RoleData.headId, this.m_pViewInfo.battlePlayer[i].level, this.m_pViewInfo.battlePlayer[i].name);
// 					ele.touchEnabled = true;
// 					ele.visible = true;
// 				} else {
// 					ele.visible = false;
// 				}
// 			}
// 		}

// 		private setBuildState(isDefend: boolean) {
// 			// 设置城池状态（战况）
// 			if (isDefend) {
// 				this.m_pBattleState.text = "防守中";
// 			} else {
// 				this.m_pBattleState.text = "进攻中";
// 			}

// 			if (this.m_pInfo.country && this.m_pInfo.atkCountry) {
// 				this.m_pDefendCount.visible = true;
// 				this.m_pAttackCount.visible = true;
// 				let defenedImg = Utils.getCountyFlagById(this.m_pInfo.country);
// 				let attackImg = Utils.getCountyFlagById(this.m_pInfo.atkCountry);
// 				Utils.setImageFromSource(this.m_pDefendCount, defenedImg);
// 				Utils.setImageFromSource(this.m_pAttackCount, attackImg);
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
// 		 * 初始化守城人数
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
// 						this.m_pDefendSoldiers.text = this.m_pViewInfo.troop + strUnit;
// 					} else {
// 						this.m_pDefendSoldiers.text = cfg.lead + strUnit;
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
// 					// 防止血条超出范围
// 					percent = (percent > 1 ? 1 : percent);
// 					this.m_pBuildHp.width = this.m_pBuildHpBg.width * percent;

// 					break;
// 				}
// 			}
// 		}

// 		// 设置城池图片
// 		private setBuildImg(type: number) {
// 			// 设置缩放比例
// 			let scale = 1;
// 			if (type == 1) {
// 				scale = 0.6;
// 			} else if (type == 2) {
// 				scale = 0.75;
// 			} else {
// 				scale = 0.9
// 			}

// 			Utils.setImageFromSource(this.m_pBuildImg, Utils.getBuildTypeSource(type));
// 			this.m_pBuildImg.scaleX = this.m_pBuildImg.scaleY = scale;
// 			this.m_pBuildImg.anchorOffsetX = this.m_pBuildImg.width / 2;
// 			this.m_pBuildImg.anchorOffsetY = this.m_pBuildImg.height / 2;
// 			this.m_pBuildImg.x = this.m_pBuildImg.parent.width / 2 - 5;
// 			this.m_pBuildImg.y = this.m_pBuildImg.parent.height / 2;
// 		}

// 		public on_click() {
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

// 		/**
// 		 * 封地按钮点击响应
// 		 */
// 		public onClickBiref() {
// 			// 建筑ID;
// 			let id = this.m_pViewInfo.id;
// 			debug("onClickBiref", id);
// 			FiefProxy.send_CITY_BATTLE_GET_FIEFS(id);
// 		}
// 	}
// }
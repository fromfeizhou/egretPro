module com_main {
	export class Bootstrap {
		private static m_pResCount: number = 0;
		private static m_pResAllCount: number = 0;
		private static m_nState: number = 0;// 0正常进入 1进入新手战斗
		private static m_bInit: boolean;

		public static startup(): void {
			if (this.m_bInit) {
				this.connect()
				return;
			}
			Utils.EgretExpandUtils.init();

			if (LoginConst.systemType() != "windows") {
				this.initBackRun();
				GameConfig.setIsNotchScreen(egret.MainContext.instance.stage.stageWidth / egret.MainContext.instance.stage.stageHeight > 2 ? true : false);
				GameConfig.setWHRatio(egret.MainContext.instance.stage.stageWidth / egret.MainContext.instance.stage.stageHeight);
			}

			if ($Platform == 0) {
				egret.Logger.logLevel = egret.Logger.ALL;
			} else {
				egret.Logger.logLevel = egret.Logger.ERROR;
			}

			TestSettingView.settingData()

			EffectData.initConfig();
			ProgressData.initConfig();
			Sound.init();
			this.initializeProxy();
			this.initializeController();
			GameConfig.initBestScale();

			//全局定时器
			Utils.TimerManager.remove(this.updateTime, this);
			Utils.TimerManager.doFrame(1, 0, this.updateTime, this);
			this.m_bInit = true;

			this.connect()
		}



		/**全局定时器 */
		public static updateTime(dt) {
			TimerUtils.ServerTime += dt;
		}


		/**重新进入登录界面 */
		public static logoutGame(): void {
			ObjectPool.clear();
			Models.clear();
			LoginManager.showLoginScene();
		}

		/**设置加载进度 */
		public static setProgress(progress: number, total: number, resName?: string): void {
			let pro = Math.floor(progress / total * 80) + 20;
			LoginManager.setLoadinProcess(resName, pro);
		}

		/**
		 * 加载配置
		 * 1 创角色
		 * 2 正常登陆
		 *  */
		public static loadConfig(): void {
			LoginManager.setLoadinProcess('加载配置表', 5);
			ConfigBuilder.getInstance().loadConfig(() => {
				Models.init();

				this.m_pResCount++;
				LoginManager.setLoadinProcess('加载配置表', 10);
				//加载语言包
				L.getInstance().loadConfig(() => {
					this.loadConfigComp();
				}, this);
			}, this);
		}
		/**配置加载完成 */
		private static loadConfigComp() {
			this.m_pResCount++;

			if (this.m_nState == 0) {
				LoginManager.setLoadinProcess('网络数据', 15);
				//请求模块数据
				LoginProxy.initData();
			} else {
				LoginManager.setLoadinProcess('加载资源', 20);
				Bootstrap.loadFirstRes();
			}
		}

		/**单组资源加载完毕 */
		private static onResCompeleOne(groupName: string): void {
			this.m_pResCount++;
			debug("Bootstrap:onResCompeleOne--->>加载完成单组", groupName, this.m_pResCount);
			if (this.m_pResAllCount > 1) {
				this.setProgress(this.m_pResCount, this.m_pResAllCount, '加载资源');
			}
			if (this.m_pResCount >= this.m_pResAllCount) {
				debug("Bootstrap:onResCompeleAll--->>加载完全部资源", this.m_pResCount);
				this.enterGame();
			}
		}

		/**开始游戏 */
		public static enterGame(): void {
			if (this.m_nState == 0) {
				SceneManager.enterScene(GuideModel.getGuideScene());
			} else {
				com_main.UpManager.close();
				Utils.open_view(TASK_UI.GUIDE_INTRODUCTION_VIEW);
			}
		}

		/**连接服务器（重连不调用）*/
		private static connect() {
			if (AGame.CSocket.getInstance().isConnected()) {
				LoginProxy.C2S_PLAYER_LOGIN_ACT();
			} else {
				console.log("正在连接游戏服... ", GameConfig.server_ip);
				LoginProxy.ResetSocketState();
				LoginProxy.connect(true);
			}

		}

		/**正常登陆 */
		public static loginSeccess() {
			this.m_nState = 0;
			Bootstrap.loadConfig();
		}

		/**创建角色  */
		public static createRole() {
			this.m_nState = 1;
			Bootstrap.loadConfig();
		}

		/**模块数据加载完毕(请求场景资源) */
		public static requestModelDataCom() {
			//存在登录界面进度由登录界面刷新
			if (LoginManager.loginScene) {
				this.m_pResCount = 0;
				let resGroup = SceneResGroupCfg.getResGroup(GuideModel.getGuideScene());
				this.m_pResAllCount = resGroup.length;
				this.setProgress(this.m_pResCount, this.m_pResAllCount, '资源');
				AGame.ResUtils.loadGroups(resGroup, Bootstrap.onResCompeleOne, () => { }, this);
			} else {
				SceneManager.enterScene(GuideModel.getGuideScene());
			}
		}

		/**第一次玩游戏加载资源 */
		public static loadFirstRes() {
			if (GameConfig.bGuideIsOpen) {
				let resGroup = SceneResGroupCfg.getFirstRes();
				this.m_pResCount = 0;
				this.m_pResAllCount = resGroup.length;
				this.setProgress(this.m_pResCount, this.m_pResAllCount, '资源');
				AGame.ResUtils.loadGroups(resGroup, Bootstrap.onResCompeleOne, () => { }, this);
			} else {
				Utils.open_view(TASK_UI.POP_GUIDE_SELECT_COUNTRY);
			}
		}


		/**=====================================================================================
		 * 控制器初始化 begin
		 * =====================================================================================
		 */
		private static initializeController(): void {
			(new LoadingCtrl()).register();
			(new MenuCtrl()).register();
			(new MapCtrl()).register();
			// (new SkillCtrl()).register();
			(new SquareCtrl()).register();
			(new BuildCtrl()).register();
			(new RewardCtrl()).register();
			(new ChatCtrl()).register();
			(new TestCtrl()).register();
			// (new MilitaryExploitCtrl()).register();
			(new TavernCtrl()).register();
			(new GeneralCtrl()).register();
			(new GuideCtrl()).register();
			(new NoticeCtrl()).register();
			(new RoleCtrl()).register();
			// (new VersusCtrl()).register();
			(new LoginCtrl()).register();
			(new ResultCtrl()).register();
			(new ArenaCtrl()).register();
			// (new CelebrationCtrl()).register();
			(new TechnoCtrl()).register();
			// (new WarcraftCtrl()).register();
			(new RankCtrl()).register();
			(new MailCtrl()).register();
			// (new templeCtrl()).register();
			// (new ThreeVisitsCtrl()).register();
			(new ActivityCtrl()).register();
			(new GiftBagCtrl()).register();
			// (new TankCtrl()).register();
			// (new SecretaryCtrl()).register();
			(new FunctionCtrl()).register();
			(new BagCtrl()).register();
			(new LegionCtrl()).register();
			(new ShopCtrl()).register();
			(new TreasureCtrl()).register();
			(new PayCtrl()).register();
			// (new WelfareCtrl()).register();
			(new MissionCtrl()).register();
			(new WorldCtrl()).register();
			(new CountryCtrl()).register();
			(new PvpArenaCtrl()).register();
			(new TurnplateCtrl()).register();
			(new HeadQuartersCtrl()).register();
			(new HistoryWarCtrl()).register();
			(new CampCtrl()).register();
			(new PatrolCtrl()).register();
			(new BossCtrl()).register();
			(new EquipCtrl()).register();
			(new NormalCtrl()).register();
			(new MaterialCtrl()).register();
			(new VipCtrl()).register();
			(new ArmsCtrl).register();
			(new BattleCtrl).register();

			(new WorshipCtrl()).register();
			(new FateCtrl()).register();
			(new RebirthCtrl()).register();
			(new CrossCtrl()).register();
			(new DailySurpriseCtrl()).register();
		}

		private static initializeProxy(): void {
			// (new TestProxy).register();
			(new ErrorProxy()).register();
			(new LoginProxy()).register();
			(new BattleProxy()).register();
			(new WorldMapProxy()).register();
			(new ResultProxy()).register();
			(new ChatProxy()).register();
			(new TavernProxy()).register();
			(new GeneralProxy()).register();
			(new NoticeProxy()).register();
			// (new MilitaryExploitProxy()).register();
			(new PropProxy()).register();
			// (new VersusProxy()).register();
			// (new CelebrationProxy()).register();
			(new GuideProxy()).register();
			(new MainMapProxy()).register();
			(new FiefProxy()).register();
			(new TechnologyProxy()).register();
			(new ValueBuffAddProxy()).register();
			// (new WarcraftProxy()).register();
			(new RankProxy()).register();
			(new MailProxy()).register();
			(new ActivityProxy()).register();
			(new AcBattleProxy()).register();
			// (new templeProxy()).register();
			// (new TankProxy()).register();
			(new SecretaryProxy()).register();
			(new FunctionProxy()).register();
			(new NoviceMapProxy()).register();
			(new LegionProxy()).register();
			(new ShopProxy()).register();
			(new ArenaProxy()).register();
			(new CornucopiaProxy()).register();
			(new WelfareProxy()).register();
			// (new ActivationProxy()).register();
			(new SoldierProxy()).register();
			(new PayProxy()).register();
			(new WorldProxy()).register();
			(new MissionProxy()).register();
			(new CountryProxy()).register();
			(new PvpArenaProxy()).register();
			(new HeadQuartersProxy()).register();
			// (new CampProxy()).register();
			(new TreasureProxy()).register();
			(new EquipProxy()).register();
			(new PatrolProxy()).register();
			(new BossProxy()).register();
			(new TeamProxy()).register();
			(new NormalProxy()).register();
			(new MaterialProxy()).register();
			(new VipProxy()).register();
			(new QuickBuyProxy()).register();
			(new GiftBagProxy()).register();
			(new FateProxy()).register();
			(new WorshipProxy()).register();
			(new TurnTableProxy()).register();
			(new HistoryBattleProxy()).register();
			(new CityBuildProxy()).register();
			(new CrossProxy()).register();
			(new DailySurpriseProxy()).register();
		}
		/**=====================================================================================
		 * 控制器初始化 end
		 * =====================================================================================
		 */

		/**后台挂起 */
		private static initBackRun() {
			egret.lifecycle.onPause = () => {
				console.log("进入后台");
				egret.ticker.pause();

				Sound.stopAllEffect();
				Sound.pauseBgMusic();
				GameConfig.isBackRun = true;
			}

			com_main.EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, () => {
				Bootstrap.continue();
			}, this);

			egret.lifecycle.onResume = () => {
				Bootstrap.continue();
			}

		}

		/**继续游戏 */
		private static continue() {
			if (!GameConfig.isBackRun) return;
			console.log("回到游戏");
			egret.ticker.resume();
			Sound.resumeBgMusic();
			GameConfig.isBackRun = false;
			AGame.ServiceBuilder.notifyProtoHandler(AGame.CSocket.CONNECTED_CLOSE);
		}
	}
}
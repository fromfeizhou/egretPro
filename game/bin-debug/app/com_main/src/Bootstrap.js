var com_main;
(function (com_main) {
    var Bootstrap = /** @class */ (function () {
        function Bootstrap() {
        }
        Bootstrap.startup = function () {
            if (this.m_bInit) {
                this.connect();
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
            }
            else {
                egret.Logger.logLevel = egret.Logger.ERROR;
            }
            com_main.TestSettingView.settingData();
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
            this.connect();
        };
        /**全局定时器 */
        Bootstrap.updateTime = function (dt) {
            TimerUtils.ServerTime += dt;
        };
        /**重新进入登录界面 */
        Bootstrap.logoutGame = function () {
            ObjectPool.clear();
            Models.clear();
            LoginManager.showLoginScene();
        };
        /**设置加载进度 */
        Bootstrap.setProgress = function (progress, total, resName) {
            var pro = Math.floor(progress / total * 80) + 20;
            LoginManager.setLoadinProcess(resName, pro);
        };
        /**
         * 加载配置
         * 1 创角色
         * 2 正常登陆
         *  */
        Bootstrap.loadConfig = function () {
            var _this = this;
            LoginManager.setLoadinProcess('加载配置表', 5);
            ConfigBuilder.getInstance().loadConfig(function () {
                Models.init();
                _this.m_pResCount++;
                LoginManager.setLoadinProcess('加载配置表', 10);
                //加载语言包
                L.getInstance().loadConfig(function () {
                    _this.loadConfigComp();
                }, _this);
            }, this);
        };
        /**配置加载完成 */
        Bootstrap.loadConfigComp = function () {
            this.m_pResCount++;
            if (this.m_nState == 0) {
                LoginManager.setLoadinProcess('网络数据', 15);
                //请求模块数据
                LoginProxy.initData();
            }
            else {
                LoginManager.setLoadinProcess('加载资源', 20);
                Bootstrap.loadFirstRes();
            }
        };
        /**单组资源加载完毕 */
        Bootstrap.onResCompeleOne = function (groupName) {
            this.m_pResCount++;
            debug("Bootstrap:onResCompeleOne--->>加载完成单组", groupName, this.m_pResCount);
            if (this.m_pResAllCount > 1) {
                this.setProgress(this.m_pResCount, this.m_pResAllCount, '加载资源');
            }
            if (this.m_pResCount >= this.m_pResAllCount) {
                debug("Bootstrap:onResCompeleAll--->>加载完全部资源", this.m_pResCount);
                this.enterGame();
            }
        };
        /**开始游戏 */
        Bootstrap.enterGame = function () {
            if (this.m_nState == 0) {
                SceneManager.enterScene(GuideModel.getGuideScene());
            }
            else {
                com_main.UpManager.close();
                Utils.open_view(TASK_UI.GUIDE_INTRODUCTION_VIEW);
            }
        };
        /**连接服务器（重连不调用）*/
        Bootstrap.connect = function () {
            if (AGame.CSocket.getInstance().isConnected()) {
                LoginProxy.C2S_PLAYER_LOGIN_ACT();
            }
            else {
                console.log("正在连接游戏服... ", GameConfig.server_ip);
                LoginProxy.ResetSocketState();
                LoginProxy.connect(true);
            }
        };
        /**正常登陆 */
        Bootstrap.loginSeccess = function () {
            this.m_nState = 0;
            Bootstrap.loadConfig();
        };
        /**创建角色  */
        Bootstrap.createRole = function () {
            this.m_nState = 1;
            Bootstrap.loadConfig();
        };
        /**模块数据加载完毕(请求场景资源) */
        Bootstrap.requestModelDataCom = function () {
            //存在登录界面进度由登录界面刷新
            if (LoginManager.loginScene) {
                this.m_pResCount = 0;
                var resGroup = SceneResGroupCfg.getResGroup(GuideModel.getGuideScene());
                this.m_pResAllCount = resGroup.length;
                this.setProgress(this.m_pResCount, this.m_pResAllCount, '资源');
                AGame.ResUtils.loadGroups(resGroup, Bootstrap.onResCompeleOne, function () { }, this);
            }
            else {
                SceneManager.enterScene(GuideModel.getGuideScene());
            }
        };
        /**第一次玩游戏加载资源 */
        Bootstrap.loadFirstRes = function () {
            if (GameConfig.bGuideIsOpen) {
                var resGroup = SceneResGroupCfg.getFirstRes();
                this.m_pResCount = 0;
                this.m_pResAllCount = resGroup.length;
                this.setProgress(this.m_pResCount, this.m_pResAllCount, '资源');
                AGame.ResUtils.loadGroups(resGroup, Bootstrap.onResCompeleOne, function () { }, this);
            }
            else {
                Utils.open_view(TASK_UI.POP_GUIDE_SELECT_COUNTRY);
            }
        };
        /**=====================================================================================
         * 控制器初始化 begin
         * =====================================================================================
         */
        Bootstrap.initializeController = function () {
            (new com_main.LoadingCtrl()).register();
            (new com_main.MenuCtrl()).register();
            (new com_main.MapCtrl()).register();
            // (new SkillCtrl()).register();
            (new com_main.SquareCtrl()).register();
            (new com_main.BuildCtrl()).register();
            (new com_main.RewardCtrl()).register();
            (new com_main.ChatCtrl()).register();
            (new com_main.TestCtrl()).register();
            // (new MilitaryExploitCtrl()).register();
            (new com_main.TavernCtrl()).register();
            (new com_main.GeneralCtrl()).register();
            (new com_main.GuideCtrl()).register();
            (new com_main.NoticeCtrl()).register();
            (new com_main.RoleCtrl()).register();
            // (new VersusCtrl()).register();
            (new com_main.LoginCtrl()).register();
            (new com_main.ResultCtrl()).register();
            (new com_main.ArenaCtrl()).register();
            // (new CelebrationCtrl()).register();
            (new com_main.TechnoCtrl()).register();
            // (new WarcraftCtrl()).register();
            (new com_main.RankCtrl()).register();
            (new com_main.MailCtrl()).register();
            // (new templeCtrl()).register();
            // (new ThreeVisitsCtrl()).register();
            (new com_main.ActivityCtrl()).register();
            (new com_main.GiftBagCtrl()).register();
            // (new TankCtrl()).register();
            // (new SecretaryCtrl()).register();
            (new com_main.FunctionCtrl()).register();
            (new com_main.BagCtrl()).register();
            (new com_main.LegionCtrl()).register();
            (new com_main.ShopCtrl()).register();
            (new com_main.TreasureCtrl()).register();
            (new com_main.PayCtrl()).register();
            // (new WelfareCtrl()).register();
            (new com_main.MissionCtrl()).register();
            (new com_main.WorldCtrl()).register();
            (new com_main.CountryCtrl()).register();
            (new com_main.PvpArenaCtrl()).register();
            (new com_main.TurnplateCtrl()).register();
            (new com_main.HeadQuartersCtrl()).register();
            (new com_main.HistoryWarCtrl()).register();
            (new com_main.CampCtrl()).register();
            (new com_main.PatrolCtrl()).register();
            (new com_main.BossCtrl()).register();
            (new com_main.EquipCtrl()).register();
            (new com_main.NormalCtrl()).register();
            (new com_main.MaterialCtrl()).register();
            (new com_main.VipCtrl()).register();
            (new com_main.ArmsCtrl).register();
            (new com_main.BattleCtrl).register();
            (new com_main.WorshipCtrl()).register();
            (new com_main.FateCtrl()).register();
            (new com_main.RebirthCtrl()).register();
            (new com_main.CrossCtrl()).register();
            (new com_main.DailySurpriseCtrl()).register();
        };
        Bootstrap.initializeProxy = function () {
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
        };
        /**=====================================================================================
         * 控制器初始化 end
         * =====================================================================================
         */
        /**后台挂起 */
        Bootstrap.initBackRun = function () {
            egret.lifecycle.onPause = function () {
                console.log("进入后台");
                egret.ticker.pause();
                Sound.stopAllEffect();
                Sound.pauseBgMusic();
                GameConfig.isBackRun = true;
            };
            com_main.EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, function () {
                Bootstrap.continue();
            }, this);
            egret.lifecycle.onResume = function () {
                Bootstrap.continue();
            };
        };
        /**继续游戏 */
        Bootstrap.continue = function () {
            if (!GameConfig.isBackRun)
                return;
            console.log("回到游戏");
            egret.ticker.resume();
            Sound.resumeBgMusic();
            GameConfig.isBackRun = false;
            AGame.ServiceBuilder.notifyProtoHandler(AGame.CSocket.CONNECTED_CLOSE);
        };
        Bootstrap.m_pResCount = 0;
        Bootstrap.m_pResAllCount = 0;
        Bootstrap.m_nState = 0; // 0正常进入 1进入新手战斗
        return Bootstrap;
    }());
    com_main.Bootstrap = Bootstrap;
})(com_main || (com_main = {}));

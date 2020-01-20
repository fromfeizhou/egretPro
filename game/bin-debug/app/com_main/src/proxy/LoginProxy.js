var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LoginProxy = /** @class */ (function (_super_1) {
    __extends(LoginProxy, _super_1);
    function LoginProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    // /**显示网络连接 倒计时tips显示状态 */
    // private static connectTipsViewState: boolean = false;
    LoginProxy.prototype.listenerProtoNotifications = function () {
        return [
            [AGame.CSocket.CONNECTED_LOGIN, this, '', ''],
            [AGame.CSocket.CONNECTED_CLOSE, this, '', ''],
            [ProtoDef.PUSH_FATIGUE_INFO, this, '', 'PushFatigueInfo'],
            [ProtoDef.PUSH_REMOTE_LOGIN, this, '', 'PushRemoteLogin'],
        ];
    };
    /**第二版协议监听 */
    LoginProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_SYS_HEARTBEAT, this, 'C2S_SYS_HEARTBEAT', ProxyEnum.SEND],
            [ProtoDef.S2C_SYS_HEARTBEAT, this, 'S2C_SYS_HEARTBEAT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAYER_LOGIN_ACT, this, 'C2S_PLAYER_LOGIN_ACT', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_LOGIN_ACT, this, 'S2C_PLAYER_LOGIN_ACT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAYER_CREATE, this, 'C2S_PLAYER_CREATE', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_CREATE_NOTICE, this, 'S2C_PLAYER_CREATE_NOTICE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_PLAYER_LOGIN_DATA, this, 'S2C_PLAYER_LOGIN_DATA', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAYER_RECOMMEND_COUNTRY, this, 'C2S_PLAYER_RECOMMEND_COUNTRY', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_RECOMMEND_COUNTRY, this, 'S2C_PLAYER_RECOMMEND_COUNTRY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAYER_RANDOM_NAME, this, 'C2S_PLAYER_RANDOM_NAME', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_RANDOM_NAME, this, 'S2C_PLAYER_RANDOM_NAME', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_DATAINIT_START, this, 'C2S_DATAINIT_START', ProxyEnum.SEND],
            [ProtoDef.C2S_DATAINIT_END, this, 'C2S_DATAINIT_END', ProxyEnum.SEND],
            [ProtoDef.S2C_DATAINIT_END, this, 'S2C_DATAINIT_END', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAYER_RESET_NICKNAME, this, 'C2S_PLAYER_RESET_NICKNAME', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_RESET_NICKNAME, this, 'S2C_PLAYER_RESET_NICKNAME', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAYER_SETTING, this, 'C2S_PLAYER_SETTING', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_SETTING, this, 'S2C_PLAYER_SETTING', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GET_ACTIVITY_CDKEY_REWARD, this, 'C2S_GET_ACTIVITY_CDKEY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_ACTIVITY_CDKEY_REWARD, this, 'S2C_GET_ACTIVITY_CDKEY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CROSS_DAY, this, 'S2C_CROSS_DAY', ProxyEnum.RECEIVE] //跨天
        ];
    };
    LoginProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        if (protocol == AGame.CSocket.CONNECTED_LOGIN) {
            debug('LoginProxy:execute--->> loginGame');
            LoginProxy.HEAR_REC_TIME = new Date().getTime();
            LoginProxy.startHearBeat();
            /**测试代码 连接服务器成功 发送角色创建 */
            LoginProxy.C2S_PLAYER_LOGIN_ACT(); //获取角色列表
            console.log("连上服务器");
            Utils.TimerManager.remove(this.onShowLostConnectionBack, this);
            com_main.LostConnectionTipsView.getInstance().hide();
            com_main.PromtDynamicTextWnd.getInstance().hide();
        }
        else if (protocol == AGame.CSocket.CONNECTED_CLOSE) {
            //泽标
            // Utils.TimerManager.remove(LoginProxy.send_PLAYER_HEARTBEAT, LoginProxy);
            console.log('LoginProxy:execute--->> socket close');
            this.falseConnect();
        }
        else {
            switch (protocol) {
                case ProtoDef.S2C_PLAYER_LOGIN_ACT: {
                    AGame.R.notifyView("LOADING_HIDE");
                    LoginProxy.clearLoginTimeOut();
                    var data = body;
                    platform.loginCallback(data.isp, data.param);
                    break;
                }
                case ProtoDef.S2C_PLAYER_CREATE_NOTICE: {
                    AGame.R.notifyView("LOADING_HIDE");
                    LoseProxy.sendBuff();
                    if (RoleData.isCreateAccount)
                        return;
                    RoleData.isCreateAccount = true;
                    com_main.Bootstrap.createRole();
                    break;
                }
                case ProtoDef.S2C_PLAYER_LOGIN_DATA: {
                    LoginProxy.HEAR_REC_TIME = new Date().getTime();
                    AGame.R.notifyView("LOADING_HIDE");
                    // TimerUtils.ServerTime = (<Long>body.serverTime;
                    TimerUtils.ServerTime = body.serverTime;
                    TimerUtils.OpenServerTime = body.openServerTime;
                    // TimerUtils.ServerTimeStamp = new Date().getTime();
                    var playerbase = body.playerInfo;
                    //zb
                    // RoleData.playerId = playerbase.playerId);
                    //重置聊天发送者结构
                    RoleData.chatSender = null;
                    RoleData.playerId = playerbase.playerId;
                    RoleData._countryId = playerbase.countryId;
                    RoleData.gender = playerbase.sex; //性别
                    RoleData.nickName = playerbase.nickName;
                    RoleData.level = playerbase.level;
                    RoleData.recharge = playerbase.recharge;
                    RoleData._governmentPost = playerbase.governmentPost;
                    RoleData._exp = playerbase.exp;
                    RoleData.lastExp = playerbase.exp;
                    RoleData._vipLevel = playerbase.vipLevel;
                    RoleData._vipIntegral = playerbase.vipIntegral;
                    RoleData._yu = playerbase.jade;
                    RoleData._gold = playerbase.gold;
                    RoleData._food = playerbase.grain;
                    RoleData._silver = playerbase.silver;
                    RoleData.headType = playerbase.headType;
                    RoleData.headId = playerbase.head;
                    RoleData._ironCount = playerbase.iron;
                    RoleData._pvpMedal = playerbase.medal;
                    RoleData._recruit = playerbase.recruitVolumn;
                    RoleData._conquer = playerbase.arenaPoint;
                    RoleData._bossScore = playerbase.generalSoulCoin;
                    RoleData._honor = playerbase.honor;
                    //创建时间
                    RoleData.createTimestamp = playerbase.createTimestamp;
                    RoleData.offlineStamp = playerbase.offlineStamp;
                    //联盟积分
                    RoleData._guildContribute = playerbase.guildContribute;
                    RoleData._wood = playerbase.wood;
                    /**军功 */
                    RoleData.military = playerbase.militaryMeritsGain; //累计军功
                    RoleData._militaryCoin = playerbase.militaryMeritsAvailiable; //可消耗军功
                    RoleData._militayWeekExp = playerbase.militaryMeritsWeek; //周军功
                    RoleData.militaryDayExp = playerbase.militaryMeritsDay; //日军功
                    RoleData.hasCityRevenue = playerbase.hasCityRevenue;
                    WorshipModel.worshipState = playerbase.worshipState; //膜拜状况
                    // PlatformApi.role_info(playerbase.createTimestamp);
                    GameConfig.CLEAR_TIME = TimerUtils.getServerTime();
                    com_main.EventMgr.dispatchEvent(EventEnum.LOGIN_SUCCESS, null);
                    // console.log("登陆成功协议");
                    // if (ConfigBuilder.getInstance().isInit) { //创建账号直接跳到主场景
                    // 	LoginProxy.initData();
                    // 	if (!LoginProxy.isLoginMsgRecFinish()) SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
                    // }
                    //角色信息回调
                    com_main.Bootstrap.loginSeccess();
                    LoginProxy.setPlatConstData();
                    //提交创角记录
                    if (RoleData.isCreateAccount) {
                        platform.reportRegister(); //注册上报
                    }
                    //登陆上报
                    window["ta"].setSuperProperties({ 'channel_id': $Platform + '', 'server_id': PlatConst.zoneId + '' });
                    if (PlatConst.platformUid) {
                        window["ta"].login(PlatConst.channelId + PlatConst.platformUid);
                    }
                    window["ta"].track('start_game', { 'trigger_time': new Date() });
                    break;
                }
                case ProtoDef.S2C_CROSS_DAY: {
                    TimerUtils.ServerTime = body.serverTime;
                    com_main.EventMgr.dispatchEvent(NormalEvent.NORMAL_CROSS_DAY, null);
                    break;
                }
                case ProtoDef.S2C_SYS_HEARTBEAT: { //心跳包
                    if (AGame.CSocket.getInstance().isOffConnected())
                        return;
                    TimerUtils.ServerTime = body.serverTime;
                    var time = new Date().getTime();
                    //心跳超时
                    if (time - LoginProxy.HEAR_REC_TIME > LoginProxy.HEAR_BEAT_TIME * 3) {
                        AGame.CSocket.getInstance().close();
                        return;
                    }
                    LoginProxy.HEAR_REC_TIME = time;
                    // debug('心跳');
                    //zb
                    // TimerUtils.ServerTime = (<Long>body.serverTime;
                    // TimerUtils.ServerTime = body.serverTime;
                    // console.log(TimerUtils.getServerTimeYmd());
                    // TimerUtils.ServerTimeStamp = new Date().getTime();
                    break;
                }
                case ProtoDef.S2C_PLAYER_RANDOM_NAME: { //随机角色名字
                    var data = body;
                    RoleData.nickName = data.nickName;
                    break;
                }
                case ProtoDef.S2C_PLAYER_RECOMMEND_COUNTRY: { //查询人数最少的国家
                    var countryId = body.countryId;
                    RoleData.defaultCountryId = countryId;
                    break;
                }
                case ProtoDef.PUSH_FATIGUE_INFO: { //疲劳值推送
                    var infos = body.fatigueInfos;
                    RoleData.addFatigue(infos);
                    break;
                }
                case ProtoDef.PUSH_REMOTE_LOGIN: { //异地登陆
                    this.onShowLoginOther();
                    break;
                }
                //玩家申请数据最后一条
                case ProtoDef.S2C_DATAINIT_END: {
                    //断线重连 或服务器 后台推送活动 不处理
                    if (!LoginProxy.isLoginMsgRecFinish()) {
                        LoginProxy.INIT_LOGIN_DATA = LoginProxy.INIT_LOGIN_DATA | 2;
                        //新手引导初始化(未选择国家 等待国家选择结束启动)
                        GuideModel.init();
                        //添加离线收益判断
                        ScenePopQueWnd.addOffLineWnd();
                        //切换场景
                        com_main.Bootstrap.requestModelDataCom();
                    }
                    break;
                }
                case ProtoDef.S2C_PLAYER_RESET_NICKNAME: { //改名
                    var data = body;
                    if (data && data.code == 0) {
                        RoleData.nickName = data.nickName;
                        EffectUtils.showTips(GCode(CLEnum.LOGIN_CNAME), 1, false);
                        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_NAME, null);
                    }
                    break;
                }
                case ProtoDef.S2C_PLAYER_SETTING: { //更换头像
                    var data = body;
                    if (data && data.code == 0) {
                        RoleData.headId = data.headPic;
                        EffectUtils.showTips(GCode(CLEnum.LOGIN_CIMG), 1, false);
                        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_HEADIMG, null);
                    }
                    break;
                }
                case ProtoDef.S2C_GET_ACTIVITY_CDKEY_REWARD: { //兑换领取奖励响应
                    var data = body;
                    if (data && data.code == 0) {
                        EffectUtils.showTips(GCode(CLEnum.EXCHANGE_SUC), 1, false);
                        com_main.EventMgr.dispatchEvent(RoleEvent.GIFT_DUIHUAN, null);
                        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.reward);
                    }
                    break;
                }
            }
            AGame.ServiceBuilder.notifyView(notification);
        }
    };
    /**连接失败 */
    LoginProxy.prototype.falseConnect = function () {
        /**后台运行不做重连计数 */
        if (GameConfig.isBackRun)
            return;
        //异地登录询问框
        if (LoginProxy.LOGIN_OTHER_STATE) {
            var func = function () {
                SceneManager.enterScene(SceneEnums.NONE_MAP);
            };
            Utils.showConfirmPop("账号异地登录", func, this);
            return;
        }
        if (com_main.PromtDynamicTextWnd.getInstance().isShow)
            return;
        if (com_main.LostConnectionTipsView.getInstance()._mIsShow)
            return;
        if (!AGame.CSocket.getInstance().isOffConnected())
            return;
        if (AGame.CSocket.CONNECTED_TIME >= 1) {
            com_main.LostConnectionTipsView.getInstance().showTip("服务器断开连接\n点击确定重新连接服务器", this.onSure, this);
            //如果登录场景 恢复登录场景点击事件
            LoginManager.wakeupLoginScene();
            return;
        }
        if (AGame.CSocket.CONNECTED_TIME == 0) {
            LoginProxy.connect(false);
            com_main.PromtDynamicTextWnd.getInstance().showPromptWithTime("网络不稳定，正在努力加载中（", "s）...", 10);
            Utils.TimerManager.doTimer(10000, 1, this.onShowLostConnectionBack, this);
        }
    };
    /**连接服务器
     * @param isTimeOut 是否添加连接计时（ 连接失败回调 falseConnect 不调用限时 并关闭菊花 显示Prompt倒计时提示）
    */
    LoginProxy.connect = function (isConst) {
        if (isConst === void 0) { isConst = false; }
        /**异地登录 不重连 */
        if (LoginProxy.LOGIN_OTHER_STATE)
            return;
        AGame.R.notifyView("LOADING_HIDE");
        AGame.CSocket.getInstance().setConnectInfo(GameConfig.server_ip, GameConfig.server_port);
        AGame.CSocket.getInstance().connect(isConst);
    };
    /**显示网络连接失败弹窗 */
    LoginProxy.prototype.onShowLostConnectionBack = function () {
        AGame.R.notifyView("LOADING_HIDE");
        com_main.PromtDynamicTextWnd.getInstance().hide();
        if (AGame.CSocket.getInstance().isOffConnected()) {
            this.falseConnect();
        }
    };
    /**异地登陆 */
    LoginProxy.prototype.onShowLoginOther = function () {
        LoginProxy.LOGIN_OTHER_STATE = true;
        AGame.CSocket.getInstance().close();
    };
    LoginProxy.prototype.onSure = function () {
        LoginProxy.connect();
    };
    /**
     * 登陆游戏
     * playerId 玩家id
     *  */
    // public static send_PLAYER_LOGIN(token: string, playerId?: Long) {
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.PLAYER_LOGIN);
    // 	data.playerId = 1;
    // 	data.token = token; //RoleData.token;
    // 	GameConfig.m_Token = token;
    // 	data.systemVersion = GameConfig.version;
    // 	// data.accountName = GameConfig.userName;
    // 	AGame.ServiceBuilder.sendMessage(data);
    // 	debug('egret.Capabilities.os:', egret.Capabilities.os);
    // }
    LoginProxy.send_PLAYER_HEARTBEAT = function (delta) {
        if (!AGame.CSocket.getInstance().isConnected())
            return;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SYS_HEARTBEAT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    // //退出游戏
    // public static logoutGame() {
    // 	SceneManager.enterScene(SceneEnums.NONE_MAP);
    // 	debug("LoginProxy:logoutGame--------->>", "退出游戏");
    // }
    // public static enterGame() {
    // 	debug("LoginProxy:enterGame--------->>", "进入游戏");
    // 	com_main.Bootstrap.enterGame();
    // }
    LoginProxy.startHearBeat = function () {
        Utils.TimerManager.doTimer(LoginProxy.HEAR_BEAT_TIME, 0, LoginProxy.send_PLAYER_HEARTBEAT, LoginProxy);
    };
    LoginProxy.stopHearBeat = function () {
        Utils.TimerManager.remove(LoginProxy.send_PLAYER_HEARTBEAT, LoginProxy);
    };
    /**重连请求数据 */
    LoginProxy.initDataReconnect = function () {
        //闪断重连(刷新 相关模块数据避免不同步)
        LoginProxy.C2S_DATAINIT_START();
        /**获取城池变更信息 */
        CountryProxy.send_C2S_CITY_CHANGE_INFO_LIST();
        TeamProxy.C2S_TEAM_LIST(1 /* WORLD */);
        PropProxy.send_BACKPACK_QUERY(false);
        MissionProxy.send_GET_PLAYER_MISSION();
        MissionProxy.send_MISSION_ACTIVE_INFO();
        ActivityModel.reconnected();
        GiftBagModel.requestData();
        CrossProxy.C2S_CROSS_SERVER_INFO();
        //丢失协议重发
        LoseProxy.sendBuff();
        if (BattleModel.getJoinedBattleId()) {
            BattleModel.isReConnectBattle = true;
            BattleProxy.send_C2S_WAR_REENTRY_BATTLE(BattleModel.getJoinedBattleId());
        }
    };
    /**进入游戏需要请求的数据 */
    LoginProxy.initData = function () {
        /**已经发送过登录相关协议 不在发送 短断网使用
         * 后续工作1 时间过长 回归登录界面
         * 后续工作2 登录数据获得异常 返回登录界面(状态重置)
         * 后续工作3 状态值设置 与 进入游戏 添加登录完成协议（登录相关协议请求 放置最后一条） 处理
         */
        //登录数据没接收完全 从走登录流程
        if (LoginProxy.isLoginMsgRecFinish()) {
            this.initDataReconnect();
            return;
        }
        LoginProxy.INIT_LOGIN_DATA = 0;
        /**申请服务器数据开始标记协议（必须在 第一条） */
        LoginProxy.C2S_DATAINIT_START();
        // com_main.WorldMap.LAST_X = 9999999;
        // com_main.WorldMap.LAST_Y = 9999999;
        /**初始化武将 */
        GeneralModel.init();
        /**请求功能开放(除特殊功能模块数据 其他功能相关数据（需登录请求数据 非点击图标获得的数据） 可在功能模块请求) */
        FunctionProxy.send_C2S_FUNCTION_INFO();
        /**请求模块次数 */
        NormalProxy.send_C2S_SYS_FUNCOUNT();
        /**请求主城建筑信息 */
        MainMapProxy.send_BUILDING_INFO();
        /**请求背包列表 */
        PropProxy.send_BACKPACK_QUERY(false);
        /**请求任务列表 */
        MissionProxy.send_GET_PLAYER_MISSION();
        MissionProxy.send_MISSION_ACTIVE_INFO();
        /**玩家个人限时礼包信息 */
        GiftBagModel.requestData();
        /** 请求装备数据 */
        EquipProxy.C2S_GET_EQUIPMENT_LIST();
        /**请求宝物数据*/
        TreasureProxy.send_TREASURE_ALL_INFO();
        /** 请求武将数据 */
        GeneralProxy.send_GENERAL_ALL();
        /**请求最大队伍数 */
        TeamProxy.send_C2S_TEAM_COUNT();
        /**布阵数据 */
        TeamProxy.C2S_TEAM_LIST(0 /* ALL */);
        /**查询结盟信息 */
        WorldMapProxy.send_COUNTRY_ALLIANCE();
        /**充值信息 */
        // PayProxy.send_RECHARGE_INFO();
        /**获取各个战斗类型的自动状态 */
        BattleProxy.send_C2S_WAR_AUTO_LIST();
        PayProxy.C2S_RECHARGE_INFO();
        /**请求新手引导记录 */
        GuideProxy.C2S_GUIDE_RECORD();
        /**请求城池信息 */
        CountryProxy.C2S_COUNTRY_CITY_INFO();
        /**获取城池变更信息 */
        CountryProxy.send_C2S_CITY_CHANGE_INFO_LIST();
        /**膜拜信息 */
        CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
        /**请求通用充值配置 */
        PayProxy.C2S_RECHARGE_CONFIGS(0, PayModel.NORMAL_RECHARGE_CFG);
        ActivityProxy.C2S_ACTIVITY_NOTICE_CONFIGS();
        CityBuildProxy.C2S_CITY_MADE_INFO(0);
        /**跨服信息 */
        CrossProxy.C2S_CROSS_SERVER_INFO();
        /**惊喜商城 */
        DailySurpriseProxy.C2S_SURPRISE_MARKET();
        /**请求活动数据(活动相关数据 在活动模块请求) 必须在 最后一行*/
        ActivityProxy.C2S_ACTIVITY_LIST();
    };
    /** 申请服务器数据结束标记协议*/
    LoginProxy.sendEndLogin = function () {
        LoginProxy.C2S_DATAINIT_END();
    };
    /**登录消息接收完毕 */
    LoginProxy.isLoginMsgRecFinish = function () {
        console.log("isLoginMsgRecFinish===================>>", LoginProxy.INIT_LOGIN_DATA, LoginProxy.INIT_LOGIN_DATA == 2);
        return LoginProxy.INIT_LOGIN_DATA == 2;
    };
    /**重置协议状态 */
    LoginProxy.ResetSocketState = function () {
        AGame.CSocket.LOST_NET_TIME = null;
        LoginProxy.LOGIN_OTHER_STATE = false;
        LoginProxy.INIT_LOGIN_DATA = 0;
        AGame.CSocket.CONNECTED_TIME = 0;
        LoseProxy.clearBuff();
        RoleData.isCreateAccount = false;
        LoginProxy.clientTime = new Date().getTime() / 1000;
    };
    /**获取角色列表 */
    LoginProxy.C2S_PLAYER_LOGIN_ACT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_LOGIN_ACT);
        if (PlatConst.getIpsId() == IPSeEnum.QI_YUAN) {
            if (GameConfig.account == '') {
                LoginManager.showTips('登录参数异常，请重新登录!错误平台号: ' + PlatConst.platform);
                LoginManager.wakeupLoginScene();
                return;
            }
            data.param = GameConfig.account;
            data.device = '';
            data.deviceSys = LoginConst.systemType();
            data.deviceBrand = '';
            data.deviceType = '';
            data.ISP = PlatConst.getIpsId();
            data.platform = PlatConst.channelId;
            data.loginFlag = LoginProxy.clientTime;
        }
        else {
            data.param = PlatConst.token; //'{"username":"123456","uid":"1000000000","token":"a7687d17bac7c53ae82bedb1bb3641f1","channelId":"99","type":"login"}';//
            data.device = '';
            data.deviceSys = LoginConst.systemType();
            data.deviceBrand = '';
            data.deviceType = '';
            data.ISP = PlatConst.getIpsId();
            data.platform = PlatConst.channelId;
            data.loginFlag = LoginProxy.clientTime;
            data.distinctId = window['ta'].getDistinctId();
        }
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
        //消息超时等待
        // this.clearLoginTimeOut();
        // this.LOGIN_TIME_OUT = egret.setTimeout(() => {
        // 	AGame.CSocket.getInstance().close();
        // }, this, 3000)
    };
    /**登录消息超时 */
    LoginProxy.clearLoginTimeOut = function () {
        if (this.LOGIN_TIME_OUT) {
            egret.clearTimeout(LoginProxy.LOGIN_TIME_OUT);
            this.LOGIN_TIME_OUT = null;
        }
    };
    /**
     * 创建角色
     * name 角色名
     * roleId 角色id
     *  */
    LoginProxy.C2S_PLAYER_CREATE = function (name, roleId, countryId, gender) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_CREATE);
        data.nikeName = name; //用户名
        data.head = roleId; //roleId;//角色id
        data.gender = gender; //roleId;//性别
        data.countryId = countryId;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**随机角色名字 */
    LoginProxy.C2S_PLAYER_RANDOM_NAME = function (gender) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_RANDOM_NAME);
        data.gender = gender; //roleId;//性别
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**查询人数最少的国家 */
    LoginProxy.C2S_PLAYER_RECOMMEND_COUNTRY = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_RECOMMEND_COUNTRY);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**玩家登录开始协议 */
    LoginProxy.C2S_DATAINIT_START = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_DATAINIT_START);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**玩家登录结束协议 */
    LoginProxy.C2S_DATAINIT_END = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_DATAINIT_END);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*改名字 */
    LoginProxy.C2S_PLAYER_RESET_NICKNAME = function (nickName) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_RESET_NICKNAME);
        data.nickName = nickName;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*更换头像 */
    LoginProxy.C2S_PLAYER_SETTING = function (headPic, headType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_SETTING);
        data.headPic = headPic;
        data.headType = headType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*兑换 */
    LoginProxy.C2S_GET_ACTIVITY_CDKEY_REWARD = function (cdKey) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_ACTIVITY_CDKEY_REWARD);
        data.cdKey = cdKey;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**设置平台登录 收录参数 */
    LoginProxy.setPlatConstData = function () {
        PlatConst.createTimestamp = RoleData.createTimestamp;
        PlatConst.playerId = RoleData.playerId;
        PlatConst.nickName = RoleData.nickName;
        PlatConst.level = RoleData.level;
        PlatConst.vipLevel = RoleData.vipLevel;
        PlatConst.gender = RoleData.gender;
        PlatConst.gold = RoleData.gold;
        PlatConst.countryId = RoleData.countryId;
        var name = '魏国';
        if (RoleData.countryId == CountryType.SHU)
            name = '蜀国';
        if (RoleData.countryId == CountryType.WU)
            name = '吴国';
        PlatConst.countryName = name;
        PlatConst.guildId = 0;
        PlatConst.guildName = '';
        PlatConst.norCopyId = 0; //副本挑战进度
        PlatConst.power = RoleData.level;
    };
    LoginProxy.INIT_LOGIN_DATA = 0; //登录接收消息计数
    LoginProxy.INIT_LOGIN_DATA_WAIT = 0; //登录数据等待时间
    /**异地登录 */
    LoginProxy.LOGIN_OTHER_STATE = false;
    LoginProxy.RECONNECT_TIME = 3; //重连次数
    LoginProxy.HEAR_BEAT_TIME = 10000; //心跳包发送间隔 20s
    return LoginProxy;
}(BaseProxy));

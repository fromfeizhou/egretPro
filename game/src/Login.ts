// module com_main {
//     export class Login extends CView {
//         public m_imgLoginBg: eui.Image;
//         public effectGroup: eui.Group;
//         public m_pProgressGroup: eui.Group;
//         public m_pStateLbl: com_main.CLabel;
//         public m_pProgressImg: com_main.CImage;
//         public m_mainGroup: eui.Group;
//         public m_pStartGame: eui.Group;
//         public m_pServerGroup: eui.Group;
//         public m_pServerName: com_main.CLabel;
//         public m_pBtnchangeIp: com_main.CLabel;
//         public m_IpGroup: eui.Group;
//         public m_curIp: eui.Label;
//         public m_pVersion2: com_main.CLabel;
//         public tiaoshi: eui.Group;
//         public gameSetting: eui.Label;
//         public m_accGroup: eui.Group;
//         public m_pAccountGroup: eui.Group;
//         public m_pAccount: eui.EditableText;

//         private m_effectMC: MCDragonBones;
//         private m_effect: MCDragonBones;	//按钮特效
//         private m_isCreateRole: boolean;    //是否正在创建角色

//         public static NAME = 'Login';
//         public constructor() {
//             super();
//             this.skinName = "resource/skins/loading/login.exml";
//             this.name = Login.NAME;
//         }

//         public onDestroy(): void {
//             super.onDestroy();
//             this.removeEvent();
//             if (this.m_effect) {
//                 this.m_effect.destroy();
//                 this.m_effect = null;
//             }
//             if (this.m_effectMC) {
//                 this.m_effectMC.destroy();
//                 this.m_effectMC = null;
//             }
//             SceneResGroupCfg.clearModelRes([ModuleEnums.LOGIN]);
//         }

//         protected childrenCreated(): void {
//             super.childrenCreated();
//             //启动打点
//             let isFirstLaunch = LocalData.getData('isFirstLaunch', "0");
//             LocalData.setData('isFirstLaunch', "1");

//             let $LoginTimestamp = (new Date()).getTime();
            
            
//             if(isFirstLaunch == "0"){
//                 window["ta"].track('first_launch_game',  {first_launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString()});
//                 console.log("###################################################################")
//                 console.log("游戏首次启动耗时 ： ",$LoginTimestamp - window['$Htmltimestamp'],"毫秒")
//             }else{
//                 window["ta"].track('launch_game',  {launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString()});
//                 console.log("###################################################################")
//                 console.log("游戏非首次启动耗时 ： ",$LoginTimestamp - window['$Htmltimestamp'],"毫秒")
//             }
            
//             // 初始化设置
//             TestSettingView.settingData()

//             // //关闭加载界面 微信小游戏不用执行
//             if (!PlatConst.isLowMcMachine()) {
//                 egret.callLater(() => {
//                     removeLoadingDiv();
//                 }, this);
//             }
//             // com_main.Bootstrap.startup(this.enterGame, this);
//             // //微信小游戏不要登陆动画
//             // if (!GameConfig.isLowMcMachine()) {
//             //     let effectMC = new MCDragonBones();
//             //     this.m_effectMC = effectMC;
//             //     effectMC.initAsync("denglujiemian");
//             //     effectMC.play("denglujiemian", 0, true);

//             //     this.effectGroup.addChild(effectMC);
//             //     Utils.toStageMaxScale(effectMC);
//             // }
//             Utils.toStageMaxScale(this.m_imgLoginBg);

//             // if($Platform != 0)this.m_pAccount.maxChars = 6;//限制输入6个字位/字母
//             this.m_pAccount.text = GameConfig.account;

//             this.m_pServerGroup.visible = false;
//             // let def_data = GameConfig.getServerData();
//             // this.m_pServerName.text = def_data.name;

//             this.m_pStateLbl.text = "首次进游戏需加载更多资源，疯狂载入中...";
//             this.showProgress(false);
//             this.setProgress(0, 0);

//             this.initEvent();

//             // this.m_pVersion1.text = "当前版本：" + GameConfig.version;
//             this.m_pVersion2.text = "当前版本：" + GameConfig.version;

//             Sound.playName(SoundData.getLoginSound());

//             this.m_effect = new MCDragonBones();
//             this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
//             this.m_effect.play(IETypes.EUI_BtnEffect02);
//             this.m_effect.x = 154;
//             this.m_effect.y = 57;
//             this.m_pStartGame.addChild(this.m_effect);

//             //按照比例缩小
//             let scaleY = (750 - GameConfig.getSub()) / 750;
//             this['m_mainGroup'].scaleX = scaleY;
//             this['m_mainGroup'].scaleY = scaleY;
//             //适配
//             this.width = AGame.R.app.stageWidth;
//             //调试
//             com_main.EventManager.addTouchScaleListener(this.tiaoshi, this, () => {
//                 ConfigBuilder.getInstance().loadConfig(() => {
//                     SceneManager.enterScene(SceneEnums.TEST_MAP);
//                 }, this);
//             });

//             //加载游戏资源
//             AGame.CSocket.getInstance().setConnectInfo(GameConfig.server_ip, GameConfig.server_port);
//             // com_main.Bootstrap.requestGame();
//             /**初始化服务器列表 */
//             ServerList.initServerList(() => {
//                 this.m_pServerGroup.visible = true;
//                 //默认选最后一个服务器
//                 // let defId = (ServerList.getDatas().length).toString();
//                 let recommend = ServerList.getRecommendServerIndex();
//                 let saveIndex = LocalData.getData('IP_PORT', recommend + '');
//                 let numIndex = Number(saveIndex);
//                 this.onChangeServerSel(numIndex);

//                 //登录公告
//                 switch (PlatConst.platform) {
//                     case PlatEnum.MZYW_WEB:
//                     case PlatEnum.MZYW_ALL_APK:
//                         Utils.open_view(TASK_UI.POP_LOGIN_NOTICE);
//                 }
                
//             }, this);

//             if (PlatConst.isHideAccount()) {
//                 this.tiaoshi.visible = false;
//                 this.m_accGroup.visible = false;
//                 this.tiaoshi.visible = false;
//                 this.m_IpGroup.visible = false;
//                 this.gameSetting.visible = false;
//             }


//         }

//         private initEvent() {
//             // com_main.EventMgr.addEvent(EventEnum.CONFIG_LOAD_COMPLETE, this.loadConfigCall, this);
//             // com_main.EventMgr.addEvent(EventEnum.LOGIN_SUCCESS, this.loginSeccess, this);
//             // com_main.EventMgr.addEvent(EventEnum.CREATE_NOTICE, this.createRole, this);

//             this.m_pAccount.addEventListener(egret.Event.CHANGE, this.onAccountChange, this);
//             com_main.EventManager.addTouchScaleListener(this.m_pStartGame, this, this.onStartGame);
//             com_main.EventManager.addTouchScaleListener(this.m_pBtnchangeIp, this, this.onChangeIp);

//             //点击设置按钮
//             com_main.EventManager.addTouchScaleListener(this.gameSetting, this, () => {
//                 Utils.open_view(TestNav.TEST_SETTING);
//             });

//         }

//         private removeEvent() {
//             com_main.EventManager.removeEventListeners(this);
//             this.m_pAccount.removeEventListener(egret.Event.CHANGE, this.onAccountChange, this);
//             com_main.EventManager.removeEventListener(this.m_pBtnchangeIp);
//             // com_main.EventMgr.removeEventByObject(EventEnum.CONFIG_LOAD_COMPLETE, this);
//             // com_main.EventMgr.removeEventByObject(EventEnum.LOGIN_SUCCESS, this);
//             // com_main.EventMgr.removeEventByObject(EventEnum.CREATE_NOTICE, this);
//         }



//         /**修改ip点击回调 */
//         private onChangeIp(e) {
//             Utils.open_view(TASK_UI.POP_LOGIN_SERVER_LIST);
//         }
//         /**修改服务器选择 */
//         private onChangeServerSel(index: number) {
//             LocalData.setData('IP_PORT', index);
//             let serverData = ServerList.getDataByIndex(index);
//             this["m_curIp"].text = "IP：" + serverData.ip;
//             this.m_pServerName.text = serverData.name;

//             PlatConst.zoneId = serverData.id;
//             PlatConst.zoneName = serverData.name;

//             GameConfig.server_ip = serverData.ip
//             GameConfig.server_port = serverData.port
//         }

//         public onAccountChange(evt: egret.Event) {
//             Sound.playTap();
//             let input = evt.target;
//             input.text = Utils.trim(input.text);//过滤空格
//             input.text = Utils.filterStr(input.text);//过滤特殊字符
//             /**过滤敏感字 */
//             // GameConfig.setLoginData(null, null, input.text);
//         }

//         public setProgress(progress: number, total: number, resName?: string, anim: boolean = true): void {
//             if (resName) {
//                 this.m_pStateLbl.text = format("正在加载{1} ({2}/{3})", resName, progress, total);
//             } else {
//                 this.m_pStateLbl.text = format("首次进游戏需加载更多资源，疯狂载入中({1}/{2})", progress, total);
//             }

//             /**移除缓动动画 */
//             egret.Tween.removeTweens(this.m_pProgressImg);

//             if (progress > total) progress = total;
//             let percent = progress / total;
//             let w = this.m_pProgressGroup.width * percent;

//             if (progress == 0) {
//                 this.m_pProgressImg.width = 0;
//             } else {
//                 if (anim) {//, { loop: true }
//                     egret.Tween.get(this.m_pProgressImg)
//                         .to({ width: w }, 500);
//                 } else {
//                     this.m_pProgressImg.width = w;
//                 }
//             }
//         }

//         public showProgress(visible: boolean = true): void {
//             this.m_pProgressGroup.visible = visible;
//             this.m_pStateLbl.visible = visible;
//             if (visible) {
//                 this.m_mainGroup.visible = false;
//                 // this.m_pServerGroup.visible = false;
//                 // this.m_pAccountGroup.visible = false;
//             }
//         }

//         public loginSeccess() {
//             // Bootstrap.loadConfig();
//             this.showProgress(true);
//         }

//         public createRole() {
//             this.m_isCreateRole = true;
//             // Bootstrap.loadConfig();
//             this.showProgress(true);
//         }

//         //加载外配置回调
//         public loadConfigCall() {
//             if (this.m_isCreateRole) {
//                 //Utils.open_view(TASK_UI.POP_GUIDE_SELECT_COUNTRY);
//                 if (GameConfig.bGuideIsOpen) {
//                     //  Utils.open_view(TASK_UI.GUIDE_INTRODUCTION_VIEW);
//                     Bootstrap.loadFirstRes();
//                 } else {
//                     Utils.open_view(TASK_UI.POP_GUIDE_SELECT_COUNTRY);
//                     this.m_isCreateRole = false;
//                     this.visible = false;
//                 }


//             } else {
//                 //加载网络数据
//                 // Bootstrap.getInternetData();
//             }
//         }

//         /**开始游戏 */
//         public onStartGame() {
//             window["ta"].track('novice_guide',  {step: 10000+""});

//             let serverId = Number(LocalData.getData('IP_PORT'));
//             let serDate = ServerList.getDataByIndex(serverId);
//             let serStatus = Number(serDate.status);
//             if(serStatus == 3){
//                 //登录公告
//                 Utils.open_view(TASK_UI.POP_LOGIN_NOTICE,serDate.notice || "停服维护");
//             }else{
//                 if (!this.m_pAccount.text) {
//                     this.m_pAccount.prompt = "请输入账号";
//                 } else {
//                     platform.login();
//                 }
//             }
//         }

//         public enterGame(): void {
//             if (RoleData.isCreateAccount) {
//                 com_main.UpManager.close();
//                 Utils.open_view(TASK_UI.GUIDE_INTRODUCTION_VIEW);
//                 this.m_isCreateRole = false;
//                 this.visible = false;
//             } else {
//                 SceneManager.enterScene(GuideModel.getGuideScene());
//             }
//         }

//         /**测试获取服务器列表 */
//         public lists_call(data: any): void {
//             Loading.hide();
//             console.log('测试获取服务器列表:', data);
//             Utils.open_view(TASK_UI.POP_LOGIN_SERVER_LIST);
//         }

//         /**打开选服列表 */
//         public onSelClick() {
//             Loading.show();
//             // PlatformApi.lists(this.lists_call, this, RoleData.open_id, GameConfig.platform, GameConfig.version);
//         }



//         /**外部静态调用 修改服务器选择 */
//         public static changeServerSel(index: number) {
//             let obj = Login.getClass();
//             if (obj) {
//                 obj.onChangeServerSel(index);
//             }
//         }

//         public static getClass(): Login {
//             let obj = SceneManager.getClass(LayerEnums.POPUP, Login.NAME);
//             return obj;
//         }
//     }

// }

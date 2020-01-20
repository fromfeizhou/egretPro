// class Main extends eui.UILayer {

//     /**
//      * 加载进度界面
//      * loading process interface
//      */
//     private isThemeLoadEnd: boolean = false;
//     private isResLoadEnd: boolean = false;
//     private m_pResGroups: any[] = [];
//     private m_pResCount: number = 0;

//     protected createChildren(): void {

//         super.createChildren();

//         let $LoginTimestamp = (new Date()).getTime();
//         window["ta"].track('launch_main', { launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });

//         egret.ImageLoader.crossOrigin = "anonymous";

//         if ($Platform == 0) {
//             egret.Logger.logLevel = egret.Logger.ALL;
//         } else {
//             egret.Logger.logLevel = egret.Logger.ERROR;
//         }

//         egret.lifecycle.addLifecycleListener((context) => {
//             // custom lifecycle plugin
//         })

//         if (LoginConst.systemType() != "windows")
//             this.initBackRun();

//         egret.TextField.default_fontFamily = "Microsoft YaHei";
//         var timeStr: string = new Date().getTime().toString();
//         RES.setMaxLoadingThread(5);

//         //inject the custom material parser
//         //注入自定义的素材解析器
//         // let assetAdapter = new AssetAdapter();
//         // egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
//         // egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

//         AGame.R.startup(this);
//         this.runGame().catch(e => {
//             console.log(e);
//         });
//     }

//     /**后台挂起 */
//     private initBackRun() {
//         egret.lifecycle.onPause = () => {
//             console.log("进入后台");
//             egret.ticker.pause();

//             Sound.stopAllEffect();
//             Sound.pauseBgMusic();
//             GameConfig.isBackRun = true;
//         }

//         com_main.EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, () => {
//             if (!GameConfig.isBackRun) return;
//             console.log("回到游戏");
//             egret.ticker.resume();
//             Sound.resumeBgMusic();
//             GameConfig.isBackRun = false;
//         }, this);

//         egret.lifecycle.onResume = () => {
//             if (!GameConfig.isBackRun) return;
//             console.log("回到游戏");
//             egret.ticker.resume();
//             Sound.resumeBgMusic();
//             GameConfig.isBackRun = false;
//         }

//     }

//     private async runGame() {
//         await this.loadResource()
//         // await platform.login();
//         // await platform.showShareMenu();
//         // const userInfo = await platform.getUserInfo();
//         // console.log(userInfo);
//         this.createScene();
//         platform.showShareMenu();
//     }
//     /**加载资源配置 */
//     private async loadResource() {
//         try {
//             await this.loadGameConfg();
//             await RES.loadConfig(GameConfig.getResourName(), GameConfig.getResRemoteUrl());
//             await this.loadTheme();
//         }
//         catch (e) {
//             console.error(e);
//         }
//     }


//     /**加载主题配置 */
//     private loadTheme() {
//         return new Promise((resolve, reject) => {
//             // load skin theme configuration file, you can manually modify the file. And replace the default skin.
//             //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
//             let url = GameConfig.getThemeUrl();
//             let theme = new eui.Theme(url, this.stage);
//             theme.addEventListener(eui.UIEvent.COMPLETE, () => {
//                 resolve();
//             }, this);
//         })
//     }
//     /**加载配置文件 */
//     private loadGameConfg() {
//         return new Promise((resolve, reject) => {
//             ClientConfig.setup(() => {
//                 resolve();
//             }, this);
//         })
//     }

//     // private appBackGround(){
//     //     if(SoundController.getInstance(true) != null){
//     //         SoundController.getInstance().pauseMusicAndSound();
//     //     }
//     //     musicManager.getInstance().setBgValume(0);
//     //     musicManager.getInstance().setEffectValume(0);
//     //     // let data = AGame.ServiceBuilder.newClazz(ProtoDef.CLICK_HOME_EVENT);
//     //     // AGame.ServiceBuilder.sendMessage(data);
//     // }

//     // private appFront(){
//     //     if(SoundController.getInstance(true) != null){
//     //         mLog.log("重开音乐");
//     //         SoundController.getInstance().rePlayMusicAndSound();
//     //     }
//     //     musicManager.getInstance().recoverSound();
//     //     // if( MahjongDesk.getInstance()._mIsShow && MahjongDesk.getInstance().nShowDesk>0){
//     //     //    let data0 = AGame.ServiceBuilder.newClazz(ProtoDef.ROOM_GET);
//     //     //    AGame.ServiceBuilder.sendMessage(data0);
//     //     // }

//     //     // let data = AGame.ServiceBuilder.newClazz(ProtoDef.DISCONNECTED);
//     //     // AGame.ServiceBuilder.sendMessage(data);
//     // }
//     // public showLoginView(){
//     //     mLog.log("当前时间="+TimerUtils.getTimeSecStr());
//     //     // updateLoadingTips("正在加载登录界面...");
//     //     LoginView.loadLoading();
//     // }

//     // //屏幕尺寸改变
//     // private onReSize(){
//     //     this.width = egret.MainContext.instance.stage.stageWidth;
//     //     this.height = egret.MainContext.instance.stage.stageHeight;
//     //     let scale:number = this.width/GameConst.CONTENT_WIDTH;
//     //     if(scale > 1){
//     //         scale = 1;
//     //     }
//     //     GameConst.VIEW_SCALE = scale;
//     //     EventCustomMgr.dispatchEventWith(UIEvenType.SCREEN_RESIZE);
//     // }

//     // //自动调整适配模式
//     // autoWindowSize = function () {
//     //     // if (window.innerWidth > window.innerHeight) {
//     //     //     this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
//     //     //     if (window.innerWidth / window.innerHeight <= 1280 / 720) {
//     //     //         this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
//     //     //     }
//     //     // } else {
//     //     //     this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
//     //     //     if (window.innerHeight / window.innerWidth <= 1280 / 720) {
//     //     //         this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
//     //     //     }
//     //     // }

//     //     this.width = egret.MainContext.instance.stage.stageWidth;
//     //     this.height = egret.MainContext.instance.stage.stageHeight;
//     //     let scale:number = this.width/GameConst.CONTENT_WIDTH;
//     //     if(scale > 1){
//     //         scale = 1;
//     //     }
//     //     GameConst.VIEW_SCALE = scale;
//     //     EventCustomMgr.dispatchEventWith(UIEvenType.SCREEN_RESIZE);
//     // }

//     /**
//      * 创建场景界面
//      * Create scene interface
//      */
//     private createScene(): void {
//         GameConfig.setIsNotchScreen(egret.MainContext.instance.stage.stageWidth / egret.MainContext.instance.stage.stageHeight > 2 ? true : false);
//         GameConfig.setWHRatio(egret.MainContext.instance.stage.stageWidth / egret.MainContext.instance.stage.stageHeight);
//         this.createLoginView();
//     }

//     private createLoginView(): void {
//         ObjectPool.clear();
//         // if (GameConfig.isLowMcMachine()) {
//         //     SceneResGroupCfg.setResGroup(ModuleEnums.LOGIN, ['b_login', 'loading', 'denglujiemian']);
//         // }
//         SceneManager.openView("com_main.Login", null, null, com_main.UpManager.STYLE_FULL, false, false);
//     }


// }





// var WebAudioDecode = (function () {
//     function WebAudioDecode() {
//     }
//     /**
//      * @private
//      *
//      */
//     WebAudioDecode["decodeAudios"] = function () {
//         if (WebAudioDecode["decodeArr"]["length"] <= 0) {
//             return;
//         }
//         if (WebAudioDecode["isDecoding"]) {
//             return;
//         }
//         WebAudioDecode["isDecoding"] = true;
//         var decodeInfo = WebAudioDecode["decodeArr"].shift();
//         WebAudioDecode["ctx"].decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
//             decodeInfo["self"].audioBuffer = audioBuffer;
//             if (decodeInfo["success"]) {
//                 decodeInfo["success"]();
//             }
//             WebAudioDecode["isDecoding"] = false;
//             WebAudioDecode["decodeAudios"]();
//         }, function () {
//             // mLog.log("sound decode error: " + decodeInfo["url"] + "！\nsee http://edn.egret.com/cn/docs/page/156");
//             if (decodeInfo["fail"]) {
//                 decodeInfo["fail"]();
//             }
//             WebAudioDecode["isDecoding"] = false;
//             WebAudioDecode["decodeAudios"]();
//         });
//     };
//     return WebAudioDecode;
// } ());

// // (function(){
// //     var count = egret.$hashCount;
// //     setInterval(()=>{
// //         var newCount = egret.$hashCount;
// //         var diff = newCount - count;
// //         count = newCount;
// //         console.log('===========>>',diff)
// //     },1000)
// // })();
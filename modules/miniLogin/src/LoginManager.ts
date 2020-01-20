class LoginManager {
    public static isCodeInit: boolean = false;   //代码初始化

    private static stage: egret.Stage;
    private static root: eui.UILayer;
    public static loginScene: Mini.LoginScene;
    public static stageWidth: number;
    public static stageHeight: number;
    public static setup(stage: egret.Stage, root: eui.UILayer) {
        this.stage = stage;
        this.root = root;
        
        ClientConfig.setup(() => {
            if (removeLoadingDiv) removeLoadingDiv();
            //分渠道显示忠告
            if(PlatConst.platform == PlatEnum.DDT_WE_CHAT){
                this.createWarnImg();
            }else{
                this.showLoginScene();
            }
        }, this);
    }

    /**创建图片 */
    private static createWarnImg() {
        if (PlatConst.platform == PlatEnum.DDT_WE_CHAT){
            let group = new eui.Group;
            this.stage.addChildAt(group, 9999);
            let img = new eui.Rect(GameConfig.curWidth(), GameConfig.curHeight(), 0x222222);
            group.addChild(img);
            let img2 = LoginConst.createImage('loginWarn.jpg');
            img2.verticalCenter = 0;
            img2.horizontalCenter = 0;
            group.addChild(img2);
            img2.alpha = 0.5;

            let tw = egret.Tween.get(img2);
            tw.to({ alpha: 1 }, 1000);

            setTimeout(function () {
                this.stage.removeChild(group);
                this.showLoginScene();
            }.bind(this), 3000);
        }
    }

    /**游戏启动(配置加载完毕) */
    public static startGame() {
        if (PlatConst.isWxApp()) {
            this.initGame();
        } else {
            this.initCode();
        }
    }

    /**显示登陆确认框 */
    public static showConfirmPop(tips: string, callback: Function, thisObj: any) {
        if (this.loginScene) {
            this.loginScene.showConfirmPop(tips, callback, thisObj);
        }
    }

    /**初始化环境 */
    public static initCode() {
        if (this.isCodeInit) return;
        this.loadCode();
    }

    /**初始化游戏 */
    public static async initGame() {
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        await this.loadResource();
        console.log('initGame')
        AGame.R.startup(this.root);

        //ios打开键盘收缩bug
        this.root.addEventListener(egret.FocusEvent.FOCUS_OUT,function(){
            window.scrollTo(0,0)
        },true);

        com_main.UpManager.addPanelInPopLayer(this.loginScene);
        this.hideLoadinProcess();
        this.isCodeInit = true;

        //登录公告
        if (PlatConst.isShowNotice()) {
            this.loginScene.showNoticeWnd();
        }
    }

    /**加载资源配置 */
    private static async loadResource() {
        try {
            this.setLoadinProcess(`初始化资源配置`, 80);
            await RES.loadConfig(GameConfig.getResourName(), GameConfig.getResRemoteUrl());
            this.setLoadinProcess(`初始化主题配置`, 90);
            await this.loadTheme();
        }
        catch (e) {
            console.error(e);
        }
    }

    /**加载主题配置 */
    private static loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let url = GameConfig.getThemeUrl();
            let theme = new eui.Theme(url, this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }

    /**进入游戏 */
    public static runGame() {
        com_main.Bootstrap.startup();
        this.loginScene.touchEnabled = false;
        this.loginScene.touchChildren = false;
    }

    /**唤醒 */
    public static wakeupLoginScene() {
        if (this.loginScene) {
            this.loginScene.touchEnabled = true;
            this.loginScene.touchChildren = true;
        }
    }

    /**重新进入 */
    public static showLoginScene() {
        if (this.loginScene) {
            this.wakeupLoginScene();
            return;
        }
        this.loginScene = new Mini.LoginScene();
        if (this.isCodeInit) {
            com_main.UpManager.addPanelInPopLayer(this.loginScene);
        } else {
            this.root.addChildAt(this.loginScene, 99);
        }
    }

    /**修改登录服务器 */
    public static changeServerSel(id: number) {
        if (this.loginScene) {
            this.loginScene.changeServerSel(id);
        }
    }

    /**设置加载进度 */
    public static setLoadinProcess(name: string, process: number) {
        if (this.loginScene) this.loginScene.setProcess(name, process);
    }

    /**设置加载进度 */
    public static hideLoadinProcess() {
        if (this.loginScene) this.loginScene.hideProcess();
    }

    /**简单提示*/
    public static showTips(tips: string) {
        if (this.loginScene) this.loginScene.showTips(tips);
    }

    /**=====================================================================================
     * 代码加载 begin
     * =====================================================================================
     */
    private static loaded: number;
    private static loadCode() {
        this.loaded = 0;
        try {
            //加载游戏代码
            throw new Error("zip解压下载失败");
            // this.loadZip($PlatformSrc + "js/js.zip?v=" + Math.random());
        }
        catch (e) {
            //压缩失败,实际项目这里需要改为加载没压缩的
            this.loadScript();
        }
    }

    /**zip包加载 */
    private static loadZip(url) {
        this.setLoadinProcess(`初始化环境1-1`, 30);
        let xhrZip = new XMLHttpRequest();
        xhrZip.open("GET", url, true);
        xhrZip.responseType = "arraybuffer";
        xhrZip.addEventListener("load", function (oEvent) {
            if (xhrZip.status == 200 || xhrZip.status == 304) {
                let arrayBuffer = xhrZip.response;
                if (!arrayBuffer) {
                    throw new Error("zip解压异常");
                }
                LoginManager.createScript(new JSZip(arrayBuffer))
            } else {
                throw new Error("zip解压下载失败");
            }

        })
        xhrZip.send(null);
    }

    /**解压zip包 */
    private static createScript(zip) {
        this.setLoadinProcess(`初始化环境1-2`, 40);
        for (let i of mainfestCfg.game) {
            var scriptFileName = i.substr(3);
            if (!zip.files[scriptFileName]) {
                throw new Error("zip读取错误 " + scriptFileName);
            }
            var text = zip.files[scriptFileName].asText();
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.text = text;
            document.body.appendChild(script);
            document.body.removeChild(script);
        }
        LoginManager.initGame();
    }

    /**加载代码 */
    private static loadScript() {
        this.setLoadinProcess(`初始化环境2-1 ${this.loaded}/${mainfestCfg.game.length}`, 50);
        this.loadNext();
    };

    private static loadNext() {
        
        loadSingleScript($PlatformSrc + mainfestCfg.game[LoginManager.loaded], function () {
            LoginManager.loaded++;
            let process = Math.floor(30 * (LoginManager.loaded / mainfestCfg.game.length));
            LoginManager.setLoadinProcess(`初始化环境2-1 ${LoginManager.loaded}/${mainfestCfg.game.length}`, 50 + process);
            if (LoginManager.loaded >= mainfestCfg.game.length) {
                LoginManager.initGame();
            }
            else {
                LoginManager.loadNext();
            }
        })
    }
    
    /**=====================================================================================
     * 代码加载 end
     * =====================================================================================
     */
}

module Mini {
    export class MiniMain extends eui.UILayer {
        protected createChildren(): void {
            super.createChildren();
            console.log("==============>>>MiniMain")
            let $LoginTimestamp = (new Date()).getTime();
            window["ta"].track('launch_main', { launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });
            this.initConfig();
            LoginManager.setup(this.stage, this);
        }

        private initConfig() {
            egret.ImageLoader.crossOrigin = "anonymous";

            egret.TextField.default_fontFamily = GameConfig.fontDefault;

            RES.setMaxLoadingThread(5);
        }

    }
}

var WebAudioDecode = (function () {
    function WebAudioDecode() {
    }
    /**
     * @private
     *
     */
    WebAudioDecode["decodeAudios"] = function () {
        if (WebAudioDecode["decodeArr"]["length"] <= 0) {
            return;
        }
        if (WebAudioDecode["isDecoding"]) {
            return;
        }
        WebAudioDecode["isDecoding"] = true;
        var decodeInfo = WebAudioDecode["decodeArr"].shift();
        WebAudioDecode["ctx"].decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
            decodeInfo["self"].audioBuffer = audioBuffer;
            if (decodeInfo["success"]) {
                decodeInfo["success"]();
            }
            WebAudioDecode["isDecoding"] = false;
            WebAudioDecode["decodeAudios"]();
        }, function () {
            // mLog.log("sound decode error: " + decodeInfo["url"] + "！\nsee http://edn.egret.com/cn/docs/page/156");
            if (decodeInfo["fail"]) {
                decodeInfo["fail"]();
            }
            WebAudioDecode["isDecoding"] = false;
            WebAudioDecode["decodeAudios"]();
        });
    };
    return WebAudioDecode;
} ());

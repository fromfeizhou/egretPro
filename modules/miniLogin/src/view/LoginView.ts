module Mini {
    export class LoginScene extends eui.Component {
        private m_imgBg: eui.Image;
        private m_pAcount: eui.Group;
        private m_editLabel: eui.EditableText;

        private m_pServer: eui.Group;
        private m_labServer: eui.Label;

        private m_labVersion: eui.Label;    //版本号
        private m_btnEnter: eui.Group;  //开始游戏按钮

        private m_pPro: eui.Group;
        private m_imgPro: eui.Image; //进度条
        private m_labPro: eui.Label; //进度条文本

        private m_soundBg: egret.Sound;     //背景音效
        private m_channelBg: egret.SoundChannel;
        private m_nTimeOut: number;   //登录按钮计时
        private m_bInEnter: boolean; //状态值

        private m_btnMc: BitmapMovie;

        private m_tipsLabs: eui.Label[];    //提示
        private m_labDebug: eui.Label;

        public constructor() {
            super();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
        }

        public onDestroy(): void {
            this.removeEvent();
            egret.Tween.removeTweens(this.m_imgPro);
            if (this.m_nTimeOut) egret.clearTimeout(this.m_nTimeOut);
            if (this.m_btnMc) {
                this.m_btnMc.onDestroy();
                this.m_btnMc = null;
            }
            if (this.m_tipsLabs) {
                for (let i = 0; i < this.m_tipsLabs.length; i++) {
                    egret.Tween.removeTweens(this.m_tipsLabs[i]);
                }
                this.m_tipsLabs = null;
            }
            LoginManager.loginScene = null;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_tipsLabs = [];

            //启动打点
            let isFirstLaunch = LocalData.getData('isFirstLaunch', "0");
            LocalData.setData('isFirstLaunch', "1");

            let $LoginTimestamp = (new Date()).getTime();


            if (isFirstLaunch == "0") {
                window["ta"].track('first_launch_game', { first_launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });
                console.log("###################################################################")
                console.log("游戏首次启动耗时 ： ", $LoginTimestamp - window['$Htmltimestamp'], "毫秒")
            } else {
                window["ta"].track('launch_game', { launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });
                console.log("###################################################################")
                console.log("游戏非首次启动耗时 ： ", $LoginTimestamp - window['$Htmltimestamp'], "毫秒")
            }

            this.createView();
            this.m_labVersion.text = "当前版本：" + GameConfig.version;
            this.startLogin();
            this.initEvent();
            platform.showShareMenu();
        }

        /**启动登录界面 */
        private startLogin() {
            ServerList.initServerList(() => {
                this.m_pServer.visible = true;
                //默认选最后一个服务器
                // let defId = (ServerList.getDatas().length).toString();
                let recommend = ServerList.getRecommendServerIndex();
                let saveIndex = LocalData.getData('IP_PORT', recommend + '');
                let numIndex = Number(saveIndex);
                this.changeServerSel(numIndex);
            }, this)

            //播放背景音乐
            if (GameConfig.MusicIsPlay) {
                this.playLoginSound();
            }

            //客户端配置加载完毕
            LoginManager.startGame();
        }

        private createView() {
            this.m_imgBg = LoginConst.createImage('login_bg.jpg');
            this.m_imgBg.horizontalCenter = 0;
            this.m_imgBg.verticalCenter = 0;
            let scale = Math.max(egret.MainContext.instance.stage.stageWidth / 1334, egret.MainContext.instance.stage.stageHeight / 750);
            this.m_imgBg.scaleX = scale;
            this.m_imgBg.scaleY = scale;
            this.addChild(this.m_imgBg);

            let flag = LoginConst.createImage('login_lb_qysg.png')
            flag.right = 8;
            flag.top = 15;
       //     this.addChild(flag);
            // let img = new eui.Image;
            // img.source = LoginConst.getImgUrl('loading_img.gif');
            // img.horizontalCenter = 0;
            // img.verticalCenter = 0;
            // this.addChild(img)
            this.createAcount();
            this.createServer();

            this.createProcess();

            this.m_labVersion = LoginConst.createLabel('', 0, 0, 20, 0xE9E9E6)
            this.m_labVersion.bottom = 30;
            this.m_labVersion.right = 25;
            this.addChild(this.m_labVersion);

            this.m_btnEnter = new eui.Group;
            this.m_btnEnter.horizontalCenter = 0;
            this.m_btnEnter.bottom = 61;
            this.m_btnEnter.width = 308;
            this.m_btnEnter.height = 114;
            this.m_btnEnter.anchorOffsetX = 159;
            this.m_btnEnter.anchorOffsetY = 57;
            this.addChild(this.m_btnEnter);

            let img = LoginConst.createImage('login_btn.png')
            this.m_btnEnter.addChild(img);

            this.createBtnEff();

            //隐藏调试入口
            if (PlatConst.isHideAccount()) {
                this.m_pAcount.visible = false;
            } else {
                this.m_labDebug = LoginConst.createLabel('调试', 0, 0, 30, 0xffffff, true);
                this.m_labDebug.right = 25;
                this.m_labDebug.bottom = 61;
                this.addChild(this.m_labDebug)
                LoginConst.addTouchEvent(this.m_labDebug, this.onDebug, this);
            }
        }

        /**调试回调 */
        private onDebug() {
            if (!LoginManager.isCodeInit) return;
            let editorView = new com_main.TestSettingView();
            com_main.UpManager.popView(editorView);
        }

        /**账号 */
        private createAcount() {
            this.m_pAcount = new eui.Group;
            this.m_pAcount.horizontalCenter = 0;
            this.m_pAcount.bottom = 245;
            this.addChild(this.m_pAcount);

            let imgBg = LoginConst.createImage('login_border_1005.png', 0, 0, 414, 46);
            imgBg.horizontalCenter = 0;
            this.m_pAcount.addChild(imgBg);

            let label = LoginConst.createLabel('账号', 146, 7, 30, 0xffffff)
            this.m_pAcount.addChild(label);

            GameConfig.account = LocalData.getData('account');
            this.m_editLabel = new eui.EditableText;
            this.m_editLabel.size = 30;
            this.m_editLabel.text = GameConfig.account;
            this.m_editLabel.textColor = 0x8A8A9E;
            this.m_editLabel.x = 233;
            this.m_editLabel.y = 7;
            this.m_editLabel.width = 300;
            this.m_pAcount.addChild(this.m_editLabel);

        }

        /**服务器 */
        private createServer() {
            this.m_pServer = new eui.Group;
            this.m_pServer.horizontalCenter = 0;
            this.m_pServer.bottom = 198;
            this.addChild(this.m_pServer);
            this.m_pServer.visible = false;

            let imgBg = LoginConst.createImage('login_border_1005.png', 0, 0, 512, 38);
            imgBg.horizontalCenter = 0;
            this.m_pServer.addChild(imgBg);

            this.m_labServer = LoginConst.createLabel('', 123, 7, 22, 0xffffff)
            this.m_pServer.addChild(this.m_labServer);

            let label = LoginConst.createLabel('点击选服', 320, 7, 22, 0xE7C772)
            this.m_pServer.addChild(label);
        }

        /**进度条 */
        private createProcess() {
            let border = LoginConst.createImage('border_1019.png', null, null, this.width, 122);
            border.bottom = 0;
            this.addChild(border);

            this.m_pPro = new eui.Group;
            this.m_pPro.width = this.width;
            this.m_pPro.bottom = 0;
            this.addChild(this.m_pPro);
            this.m_pPro.visible = false;

            let imgBg = LoginConst.createImage('login_proBg_003.png', null, null, this.width);
            imgBg.height = 9;
            imgBg.bottom = 0;
            this.m_pPro.addChild(imgBg);

            this.m_imgPro = LoginConst.createImage('login_pro_001.png', null, null, 0);
            this.m_imgPro.bottom = 0;
            this.m_imgPro.width = 0;
            this.m_pPro.addChild(this.m_imgPro);
            this.m_labPro = LoginConst.createLabel('', 0, 0, 18, 0x8A8A9E);
            this.m_labPro.horizontalCenter = 0;
            this.m_labPro.bottom = 20;
            this.m_pPro.addChild(this.m_labPro);
        }

        /**登陆背景音效 */
        private playLoginSound() {
            this.m_soundBg = new egret.Sound;
            this.m_soundBg.addEventListener(egret.Event.COMPLETE, this.onSoundComp, this);
            this.m_soundBg.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundError, this);
            this.m_soundBg.load(LoginConst.getResUrl('denglujiemian.mp3'));
        }

        /**创建按钮特效 */
        private createBtnEff() {
            var imageLoader: egret.ImageLoader = new egret.ImageLoader();
            imageLoader.crossOrigin = "anonymous";
            imageLoader.once(egret.Event.COMPLETE, () => {
                if (this.m_btnEnter && imageLoader.data) {
                    let texture = new egret.Texture();
                    texture._setBitmapData(imageLoader.data);
                    let bitmap = new egret.Bitmap(texture);
                    this.m_btnMc = new BitmapMovie();
                    this.m_btnMc.initByBitmap(bitmap, 7, 1, 0, 7, 318, 140);
                    this.m_btnMc.play(9999);
                    this.m_btnMc.x = -5;
                    this.m_btnMc.y = -15;
                    this.m_btnMc.touchEnabled = false;
                    this.m_btnEnter.addChild(this.m_btnMc);
                }
            }, this);
            imageLoader.load(LoginConst.getResUrl('btnEffect.png'));
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            this.m_pServer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServerHandler, this);
            LoginConst.addTouchEvent(this.m_btnEnter, this.onBtnEnter, this);
            this.m_editLabel.addEventListener(egret.Event.CHANGE, this.onAccountChange, this);
        }

        private removeEvent() {
            this.m_pServer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onServerHandler, this);
            LoginConst.removeTouchEvent(this.m_btnEnter, this.onBtnEnter, this);
            this.m_editLabel.removeEventListener(egret.Event.CHANGE, this.onAccountChange, this);
            if (this.m_labDebug) {
                LoginConst.removeTouchEvent(this.m_labDebug, this.onDebug, this);
            }

            if (this.m_soundBg) {
                this.m_soundBg.removeEventListener(egret.Event.COMPLETE, this.onSoundComp, this);
                this.m_soundBg.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundError, this);
                this.m_soundBg = null;
                if (this.m_channelBg) {
                    this.m_channelBg.stop();
                    this.m_channelBg = null;
                }
            }

        }
        /**登录输入 */
        public onAccountChange(evt: egret.Event) {
            let input = evt.target;
            let text = this.trim(input.text);//过滤空格
            text = this.filterStr(text);//过滤特殊字符
            if (input.text == '') return;
            input.text = input.text;
            GameConfig.account = input.text;
            LocalData.setData('account', GameConfig.account);
        }



        /**开始游戏 */
        private onBtnEnter() {
            window["ta"].track('novice_guide', { step: 10000 + "" });

            let serverId = Number(LocalData.getData('IP_PORT'));
            let serDate = ServerList.getDataByIndex(serverId);
            let serStatus = Number(serDate.status);
            if (serStatus == 3) {
                //登录公告
                this.showNoticeWnd(serDate.notice || "停服维护");
            } else {
                if (this.m_pAcount.visible && this.m_editLabel.text == '') {
                    this.m_editLabel.prompt = "请输入账号";
                } else {
                    this.login();
                }
            }
        }

        /**登录 */
        private login() {
            //环境未初始化
            if (!LoginManager.isCodeInit) {
                this.showTips('初始化中 请稍后');
                return;
            }

            if (this.m_bInEnter) {
                this.showTips('操作频繁 请稍后');
                return;
            }
            this.m_bInEnter = true;
            this.m_nTimeOut = egret.setTimeout(() => {
                this.m_bInEnter = false;
            }, this, 2000);
            platform.login();
        }

        /**选服点击 */
        private onServerHandler() {
            this.showLoginServerList();
        }


        /**声音加载完毕 */
        private onSoundComp() {
            this.m_channelBg = this.m_soundBg.play(0, 0);
        }

        /**声音加载错误 */
        private onSoundError() {
            console.error("loaded error!", event);
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
        /**显示进度条 */
        public setProcess(tips: string, process: number) {
            this.m_pPro.visible = true;
            this.m_labPro.text = `${tips} ${Math.floor(process)}%`;
            egret.Tween.removeTweens(this.m_imgPro);
            let tw = egret.Tween.get(this.m_imgPro);
            tw.to({ width: this.width * (process / 100) }, 100)
        }
        /**隐藏进度条 */
        public hideProcess() {
            egret.Tween.removeTweens(this.m_imgPro);
            this.m_imgPro.width = 0;
            this.m_pPro.visible = false;
        }

        /**弹出提示 */
        public showTips(tips: string) {
            let label = LoginConst.createLabel(tips, this.width * 0.5, this.height * 0.5, 30, 0xffffff);
            label.horizontalCenter = 0;
            label.alpha = 0.5;
            let tw = egret.Tween.get(label);
            tw.to({ y: label.y - 100, alpha: 1 }, 500, egret.Ease.cubicOut);
            tw.to({ alpha: 0 }, 300);
            tw.call(() => {
                if (label && label.parent) {
                    for (let i = 0; i < this.m_tipsLabs.length; i++) {
                        if (this.m_tipsLabs[i].hashCode == label.hashCode) {
                            this.m_tipsLabs.splice(i, 1);
                            break;
                        }
                    }
                    label.parent.removeChild(label);
                    label = null;
                }
            }, this);
            this.m_tipsLabs.push(label);
            this.addChildAt(label, 999)
        }

        /**修改服务器选择 */
        public changeServerSel(id: number) {
            LocalData.setData('IP_PORT', id);
            let serverData = ServerList.getDataByIndex(id);

            if(serverData.status == 4){
                this.m_labServer.textFlow = new egret.HtmlTextParser().parser('<font color=#90FC5B>新服 </font>'+serverData.name);
            }else{
                this.m_labServer.text = serverData.name;
            }
            
            PlatConst.zoneId = serverData.id;
            PlatConst.zoneName = serverData.name;

            GameConfig.server_ip = serverData.ip
            GameConfig.server_port = serverData.port
        }


        /**询问框 */
        public showConfirmPop(tips: string, callback: Function, thisObj: any) {
            let view = new ConfirmPop(tips, callback, thisObj);
            this.addChildAt(view, 99);
        }

        /**显示选服菜单 */
        public showLoginServerList() {
            if (!ServerList.SERVER_INIT_SUCCESS) {
                this.showTips('服务器列表未下载');
                return;
            }
            let view = new LoginServerList();
            this.addChild(view);
        }

        /**显示公告 */
        public showNoticeWnd(notice?: string) {
            let view = new LoginNoticeWnd(notice)
            this.addChild(view);
        }

        /**去除所有空格 */
        public trim(str: string): string {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            result = result.replace(/\s/g, "");
            return result;
        }

        /**    
          * 过滤特殊字符
          **/
        public filterStr(str: string): string {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；�：”“'。，、？%+]");
            var specialStr = "";
            for (var i = 0; i < str.length; i++) {
                specialStr += str.substr(i, 1).replace(pattern, '');
            }
            return specialStr;
        }

        /* UpManager调用接口 容错处理*/
        public onRefresh() {

        }

    }

}

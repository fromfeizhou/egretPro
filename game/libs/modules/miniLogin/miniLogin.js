var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
//九紫Apk(三国志国战版)
var JzApk3Platform = (function () {
    function JzApk3Platform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    JzApk3Platform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    JzApk3Platform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.channelId = 512;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        });
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    JzApk3Platform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: PlatConst.token,
                        qyChannelId: "512",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 512;
                    LoginManager.runGame();
                }
                return [2 /*return*/];
            });
        });
    };
    JzApk3Platform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    JzApk3Platform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    JzApk3Platform.prototype.share = function (data) {
    };
    JzApk3Platform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, callbackinfo, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString() + "~uid=" + PlatConst.platformUid.toString() + "~" + "sid=" + PlatConst.zoneId.toString() + "~" + "cp_orderid=" + orderNo.toString();
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "role_id": PlatConst.playerId.toString(),
                    "palyerName": PlatConst.nickName,
                    "serverName": PlatConst.zoneName,
                    "roleLevel": PlatConst.level,
                    "serverId": PlatConst.zoneId.toString(),
                    "cpOderId": orderNo.toString(),
                    "ratio": 10,
                    "callbackinfo": callbackinfo,
                    "goods": name,
                    "money": amount,
                    "shopId": shopId.toString(),
                    "vipLevel": PlatConst.vipLevel.toString(),
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    JzApk3Platform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    JzApk3Platform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    JzApk3Platform.prototype.reportData = function (dateType) {
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "ServerId": PlatConst.zoneId.toString(),
            "ServerName": PlatConst.zoneName,
            "RoleVipLv": PlatConst.vipLevel.toString(),
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    JzApk3Platform.prototype.WXattention = function () {
    };
    JzApk3Platform.prototype.isHidePayFunc = function () {
        return false;
    };
    JzApk3Platform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return JzApk3Platform;
}());
__reflect(JzApk3Platform.prototype, "JzApk3Platform", ["Platform"]);
var LoginManager = (function () {
    function LoginManager() {
    }
    LoginManager.setup = function (stage, root) {
        var _this = this;
        this.stage = stage;
        this.root = root;
        ClientConfig.setup(function () {
            if (removeLoadingDiv)
                removeLoadingDiv();
            //分渠道显示忠告
            if (PlatConst.platform == PlatEnum.DDT_WE_CHAT) {
                _this.createWarnImg();
            }
            else {
                _this.showLoginScene();
            }
        }, this);
    };
    /**创建图片 */
    LoginManager.createWarnImg = function () {
        if (PlatConst.platform == PlatEnum.DDT_WE_CHAT) {
            var group_1 = new eui.Group;
            this.stage.addChildAt(group_1, 9999);
            var img = new eui.Rect(GameConfig.curWidth(), GameConfig.curHeight(), 0x222222);
            group_1.addChild(img);
            var img2 = LoginConst.createImage('loginWarn.jpg');
            img2.verticalCenter = 0;
            img2.horizontalCenter = 0;
            group_1.addChild(img2);
            img2.alpha = 0.5;
            var tw = egret.Tween.get(img2);
            tw.to({ alpha: 1 }, 1000);
            setTimeout(function () {
                this.stage.removeChild(group_1);
                this.showLoginScene();
            }.bind(this), 3000);
        }
    };
    /**游戏启动(配置加载完毕) */
    LoginManager.startGame = function () {
        if (PlatConst.isWxApp()) {
            this.initGame();
        }
        else {
            this.initCode();
        }
    };
    /**显示登陆确认框 */
    LoginManager.showConfirmPop = function (tips, callback, thisObj) {
        if (this.loginScene) {
            this.loginScene.showConfirmPop(tips, callback, thisObj);
        }
    };
    /**初始化环境 */
    LoginManager.initCode = function () {
        if (this.isCodeInit)
            return;
        this.loadCode();
    };
    /**初始化游戏 */
    LoginManager.initGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var assetAdapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetAdapter = new AssetAdapter();
                        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
                        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
                        return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        console.log('initGame');
                        AGame.R.startup(this.root);
                        //ios打开键盘收缩bug
                        this.root.addEventListener(egret.FocusEvent.FOCUS_OUT, function () {
                            window.scrollTo(0, 0);
                        }, true);
                        com_main.UpManager.addPanelInPopLayer(this.loginScene);
                        this.hideLoadinProcess();
                        this.isCodeInit = true;
                        //登录公告
                        if (PlatConst.isShowNotice()) {
                            this.loginScene.showNoticeWnd();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**加载资源配置 */
    LoginManager.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.setLoadinProcess("\u521D\u59CB\u5316\u8D44\u6E90\u914D\u7F6E", 80);
                        return [4 /*yield*/, RES.loadConfig(GameConfig.getResourName(), GameConfig.getResRemoteUrl())];
                    case 1:
                        _a.sent();
                        this.setLoadinProcess("\u521D\u59CB\u5316\u4E3B\u9898\u914D\u7F6E", 90);
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**加载主题配置 */
    LoginManager.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var url = GameConfig.getThemeUrl();
            var theme = new eui.Theme(url, _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**进入游戏 */
    LoginManager.runGame = function () {
        com_main.Bootstrap.startup();
        this.loginScene.touchEnabled = false;
        this.loginScene.touchChildren = false;
    };
    /**唤醒 */
    LoginManager.wakeupLoginScene = function () {
        if (this.loginScene) {
            this.loginScene.touchEnabled = true;
            this.loginScene.touchChildren = true;
        }
    };
    /**重新进入 */
    LoginManager.showLoginScene = function () {
        if (this.loginScene) {
            this.wakeupLoginScene();
            return;
        }
        this.loginScene = new Mini.LoginScene();
        if (this.isCodeInit) {
            com_main.UpManager.addPanelInPopLayer(this.loginScene);
        }
        else {
            this.root.addChildAt(this.loginScene, 99);
        }
    };
    /**修改登录服务器 */
    LoginManager.changeServerSel = function (id) {
        if (this.loginScene) {
            this.loginScene.changeServerSel(id);
        }
    };
    /**设置加载进度 */
    LoginManager.setLoadinProcess = function (name, process) {
        if (this.loginScene)
            this.loginScene.setProcess(name, process);
    };
    /**设置加载进度 */
    LoginManager.hideLoadinProcess = function () {
        if (this.loginScene)
            this.loginScene.hideProcess();
    };
    /**简单提示*/
    LoginManager.showTips = function (tips) {
        if (this.loginScene)
            this.loginScene.showTips(tips);
    };
    LoginManager.loadCode = function () {
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
    };
    /**zip包加载 */
    LoginManager.loadZip = function (url) {
        this.setLoadinProcess("\u521D\u59CB\u5316\u73AF\u58831-1", 30);
        var xhrZip = new XMLHttpRequest();
        xhrZip.open("GET", url, true);
        xhrZip.responseType = "arraybuffer";
        xhrZip.addEventListener("load", function (oEvent) {
            if (xhrZip.status == 200 || xhrZip.status == 304) {
                var arrayBuffer = xhrZip.response;
                if (!arrayBuffer) {
                    throw new Error("zip解压异常");
                }
                LoginManager.createScript(new JSZip(arrayBuffer));
            }
            else {
                throw new Error("zip解压下载失败");
            }
        });
        xhrZip.send(null);
    };
    /**解压zip包 */
    LoginManager.createScript = function (zip) {
        this.setLoadinProcess("\u521D\u59CB\u5316\u73AF\u58831-2", 40);
        for (var _i = 0, _a = mainfestCfg.game; _i < _a.length; _i++) {
            var i = _a[_i];
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
    };
    /**加载代码 */
    LoginManager.loadScript = function () {
        this.setLoadinProcess("\u521D\u59CB\u5316\u73AF\u58832-1 " + this.loaded + "/" + mainfestCfg.game.length, 50);
        this.loadNext();
    };
    ;
    LoginManager.loadNext = function () {
        loadSingleScript($PlatformSrc + mainfestCfg.game[LoginManager.loaded], function () {
            LoginManager.loaded++;
            var process = Math.floor(30 * (LoginManager.loaded / mainfestCfg.game.length));
            LoginManager.setLoadinProcess("\u521D\u59CB\u5316\u73AF\u58832-1 " + LoginManager.loaded + "/" + mainfestCfg.game.length, 50 + process);
            if (LoginManager.loaded >= mainfestCfg.game.length) {
                LoginManager.initGame();
            }
            else {
                LoginManager.loadNext();
            }
        });
    };
    LoginManager.isCodeInit = false; //代码初始化
    return LoginManager;
}());
__reflect(LoginManager.prototype, "LoginManager");
var Mini;
(function (Mini) {
    var MiniMain = (function (_super) {
        __extends(MiniMain, _super);
        function MiniMain() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MiniMain.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            console.log("==============>>>MiniMain");
            var $LoginTimestamp = (new Date()).getTime();
            window["ta"].track('launch_main', { launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });
            this.initConfig();
            LoginManager.setup(this.stage, this);
        };
        MiniMain.prototype.initConfig = function () {
            egret.ImageLoader.crossOrigin = "anonymous";
            egret.TextField.default_fontFamily = GameConfig.fontDefault;
            RES.setMaxLoadingThread(5);
        };
        return MiniMain;
    }(eui.UILayer));
    Mini.MiniMain = MiniMain;
    __reflect(MiniMain.prototype, "Mini.MiniMain");
})(Mini || (Mini = {}));
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
}());
//中手游微信小游戏
var ZsyWxPlatform = (function () {
    function ZsyWxPlatform() {
        //<script src="https://h5game.cmge.com/js/cmge_h5game_v1.js"></script>
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
        this.m_sign = "";
        this.d_platform = "";
        this.d_openid = "";
        this.d_time = "";
        this.d_extinfo = "";
        this.d_invited_role_id = "";
        this.d_callback_url = "";
        this.s_gameUID = "";
        this.s_channelUID = "";
        this.count = 1;
    }
    ZsyWxPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    ZsyWxPlatform.prototype.initPlatform = function () {
        var info = PlatConst.getUrlGet();
        window['cmgeH5GameSDK']['login'](function (objectLogin) {
            console.log('login: ', objectLogin); //测试数据
            var actionType = {
                gameUID: objectLogin.gameUID,
                channelUID: objectLogin.channelUID,
                cmgePlayerId: objectLogin.cmgePlayerId,
                loginTime: objectLogin.loginTime,
                sign: objectLogin.sign,
                channelUserId: objectLogin.channelUserId,
                platformID: objectLogin.platformID,
                mixChannelUID: objectLogin.mixChannelUID,
                cps: objectLogin.cps,
                channel_id: "508",
                type: "login_sign",
            };
            console.log('cpUserLogin json--: ', JSON.stringify(actionType)); //测试数据
            Mini.HttpClient.get(function (data) {
                if (data == '0') {
                    // PlatConst.platformUid = 0;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: "",
                        qyChannelId: "508",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 508;
                }
                else {
                    console.log("登录失败：" + data.msg);
                }
            }, this, "code=17&jstr=" + JSON.stringify(actionType), 'https://h5.373yx.com/sdk/SdkSendData');
        });
    };
    ZsyWxPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                LoginManager.runGame();
                return [2 /*return*/];
            });
        });
    };
    ZsyWxPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    ZsyWxPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ZsyWxPlatform.prototype.share = function (data) {
    };
    ZsyWxPlatform.prototype.loginGame = function (uid, token, channelId, username) {
    };
    ZsyWxPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var signJson, dp_time, serverID, oldServerID, serverName, oldServerName, roleName, oldRoleName, roleId, subject, coinNumber, cpExtend, money, itemID, version, productID, productName, roleLevel, roleVipLevel, actionSignType;
            return __generator(this, function (_a) {
                dp_time = (new Date()).getTime();
                serverID = PlatConst.zoneId.toString();
                oldServerID = PlatConst.zoneId.toString();
                serverName = PlatConst.zoneName;
                oldServerName = PlatConst.zoneName;
                roleName = PlatConst.nickName;
                oldRoleName = PlatConst.nickName;
                roleId = PlatConst.playerId.toString();
                subject = shopName;
                coinNumber = 0;
                cpExtend = "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString();
                money = price * 100;
                itemID = shopId;
                version = 3;
                productID = shopId;
                productName = shopName;
                roleLevel = PlatConst.level;
                roleVipLevel = PlatConst.vipLevel;
                actionSignType = {
                    gameUID: window['cmgeH5GameSDK'].gameUID,
                    channelUID: window['cmgeH5GameSDK'].channelUID,
                    cmgePlayerId: window['cmgeH5GameSDK'].cmgePlayerId,
                    serverID: serverID.toString(),
                    oldServerID: oldServerID.toString(),
                    serverName: serverName,
                    oldServerName: oldServerName,
                    roleId: roleId.toString(),
                    roleName: roleName,
                    oldRoleName: oldRoleName,
                    subject: subject,
                    coinNumber: coinNumber.toString(),
                    money: money.toString(),
                    itemID: itemID.toString(),
                    version: version.toString(),
                    productID: productID.toString(),
                    productName: productName,
                    roleLevel: roleLevel.toString(),
                    roleVipLevel: roleVipLevel.toString(),
                    cpExtend: cpExtend,
                    orderNo: orderNo
                };
                Mini.HttpClient.get(function (data) {
                    signJson = JSON.parse(data);
                    window['cmgeH5GameSDK']['pay']({
                        money: money,
                        cmgePlayerId: window['cmgeH5GameSDK'].cmgePlayerId,
                        serverID: serverID,
                        oldServerID: oldServerID,
                        serverName: serverName,
                        oldServerName: oldServerName,
                        roleName: roleName,
                        oldRoleName: oldRoleName,
                        orderNo: orderNo.toString(),
                        subject: subject,
                        coinNumber: coinNumber,
                        itemID: itemID,
                        cpExtend: cpExtend,
                        version: version,
                        sign: signJson.sign,
                        productID: productID,
                        productName: productName,
                        roleId: roleId,
                        roleLevel: roleLevel,
                        roleVipLevel: roleVipLevel.toString(),
                        payType: 1,
                    });
                }, this, "code=15&jstr=" + JSON.stringify(actionSignType), 'https://h5.373yx.com/sdk/SdkSendData');
                return [2 /*return*/];
            });
        });
    };
    ZsyWxPlatform.prototype.reportRegister = function () {
        this.zsyReportData("1");
    };
    ZsyWxPlatform.prototype.reportLogin = function () {
        this.zsyReportData("2");
    };
    ZsyWxPlatform.prototype.reportData = function (dateType) {
        if (dateType == 'levelUp') {
            this.zsyReportData("3");
        }
    };
    ZsyWxPlatform.prototype.zsyReportData = function (dateType) {
        var dp_time = (new Date()).getTime();
        var object = {
            gameType: '武侠',
            serverId: PlatConst.zoneId.toString(),
            oldServerID: '1',
            serverName: PlatConst.zoneName.toString(),
            oldServerName: '1',
            roleId: PlatConst.playerId.toString(),
            roleName: PlatConst.nickName.toString(),
            level: PlatConst.level,
            viplevel: PlatConst.vipLevel,
            power: 1,
            coinNumber: 0,
            isNew: 1,
            createTime: PlatConst.createTimestamp,
            lastUpgradeTime: dp_time //角色最后升级时间戳（精确到秒），类型int，没有就设为0
        };
        //   window['cmgeH5GameSDK']['transPlayerInfo'](object); //向渠道传玩家的信息
    };
    ZsyWxPlatform.prototype.WXattention = function () {
    };
    ZsyWxPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    ZsyWxPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return ZsyWxPlatform;
}());
__reflect(ZsyWxPlatform.prototype, "ZsyWxPlatform", ["Platform"]);
var BattleQualityEnum;
(function (BattleQualityEnum) {
    /**高品质 */
    BattleQualityEnum[BattleQualityEnum["HIGHT"] = 0] = "HIGHT";
    /**低品质 */
    BattleQualityEnum[BattleQualityEnum["LOW"] = 1] = "LOW";
})(BattleQualityEnum || (BattleQualityEnum = {}));
/**
  * 游戏配置文件
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved.
  * 存放游戏的配置数据
  * 比如：游戏界面尺寸、分享随机百分比、获取系统数据
  */
var GameConfig = (function () {
    function GameConfig() {
    }
    GameConfig.getLanUrls = function () {
        var lan_url = [];
        lan_url =
            [
                this.getResRemoteUrl(true) + "language.zip" + "?v=" + GameConfig.version
            ];
        return lan_url;
    };
    GameConfig.getConfigUrls = function () {
        var config_url = [];
        config_url =
            [
                this.getResRemoteUrl(true) + "config.zip" + "?v=" + GameConfig.version
            ];
        return config_url;
    };
    GameConfig.getLanUrl = function () {
        var index = parseInt(LocalData.getData('lan_config_index', "0"));
        var urls = this.getLanUrls();
        if (!true)
            index = 0;
        return urls[index];
    };
    GameConfig.getConfigUrl = function () {
        var index = parseInt(LocalData.getData('cfg_config_index', "0"));
        var urls = this.getConfigUrls();
        if (!true)
            index = 0;
        return urls[index];
    };
    /**配置文件 每次重新下载 */
    GameConfig.getClientConfigUrl = function () {
        return this.getResRemoteUrl(true) + "gameConfig.json" + "?v=" + Math.random();
    };
    /**资源配置配置名字 */
    GameConfig.getResourName = function () {
        return this.getResRemoteUrl() + "default.res.json" + "?v=" + GameConfig.version;
    };
    /**皮肤配置地址 */
    GameConfig.getThemeUrl = function () {
        return this.getResRemoteUrl(true) + "default.thm.json" + "?v=" + GameConfig.version;
    };
    /**服务器列表地址 */
    GameConfig.getServerListUrl = function () {
        return LoginConst.getResUrl('serverList.json?v=' + Math.random(), '');
    };
    /**登录公告地址 */
    GameConfig.getNoticeUrl = function () {
        return LoginConst.getResUrl('notice.txt?v=' + Math.random(), '');
    };
    /**新手录像地址 */
    GameConfig.getBattleVideoUrl = function () {
        return this.getResRemoteUrl() + "battleVideo.zip" + "?v=" + GameConfig.version;
    };
    /**是否刘海屏 */
    GameConfig.getIsNotchScreen = function () {
        return this.m_notchScreen;
    };
    /**设置是否刘海屏 */
    GameConfig.setIsNotchScreen = function (bool) {
        this.m_notchScreen = bool;
    };
    /**设置宽高比 */
    GameConfig.setWHRatio = function (ratio) {
        this.WH_Ratio = ratio;
    };
    /**获取宽高比 */
    GameConfig.getWHRatio = function () {
        return this.WH_Ratio;
    };
    // //是不是大屏
    // public static isBigScreen(): boolean {
    // 	return (document.body.clientHeight / document.body.clientWidth > 1.32);
    // }
    //当前舞台
    GameConfig.curStage = function () {
        return egret.MainContext.instance.stage;
    };
    //当前游戏宽度
    GameConfig.curWidth = function () {
        return egret.MainContext.instance.stage.stageWidth;
    };
    //当前游戏宽度
    GameConfig.curHeight = function () {
        return egret.MainContext.instance.stage.stageHeight;
    };
    GameConfig.initBestScale = function () {
        this.bestScale = Math.min(egret.MainContext.instance.stage.stageWidth / 1334, egret.MainContext.instance.stage.stageHeight / 750);
        if (this.bestScale > 1) {
            this.bestScale = 1;
        }
    };
    GameConfig.getBestScale = function () {
        this.initBestScale();
        return this.bestScale;
    };
    /**
     * 游戏资源路径 通用	/resource/
     * 游戏资源资源服务器	(微信小游戏)https://files.373yx.com/resource/resource1/
     */
    GameConfig.getResRemoteUrl = function (isConfig) {
        if (isConfig === void 0) { isConfig = false; }
        return PlatConst.getResRemoteUrl(isConfig);
    };
    GameConfig.getSub = function () {
        return 750 - egret.MainContext.instance.stage.stageHeight > 0 ? 750 - egret.MainContext.instance.stage.stageHeight : 0;
    };
    /**账号 */
    GameConfig.account = "b";
    GameConfig.notchPixel = 60;
    GameConfig.BTEELE_QUALITY = BattleQualityEnum.HIGHT; //战斗品质
    //其他业务逻辑预定义
    GameConfig.MusicIsPlay = true;
    GameConfig.EffectIsPlay = true;
    GameConfig.bGuideIsOpen = true;
    GameConfig.testGuideIds = '';
    // -----------------------------------------------------------------------------------
    /**游戏默认字体 */
    GameConfig.fontDefault = "Microsoft YaHei";
    //全局字体颜色表--可以扩展
    GameConfig.TextColors = {
        white: 0xFFFFFF,
        milkWhite: 0xfbf1af,
        grayWhite: 0x8a8a9e,
        gray: 0x878785,
        fontWhite: 0xe9e9e6,
        yellow: 0xffff00,
        lightYellow: 0xffd375,
        orangeYellow: 0xff9900,
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x1a94d7,
        grayBlue: 0x2f5177,
        purple: 0xe938f2,
        pink: 0xFF3030,
        black: 0x2e2d2d,
        golden: 0xFFD700,
        stroke: 0x5e3c16,
        stroke2: 0x825757,
        stroke3: 0x4f3823,
        goldYellow: 0xffc517,
        goldYellow2: 0xffc000,
        quality0: 0xa6835f,
        quality1: 0x70f145,
        quality2: 0x44d0f3,
        quality3: 0xf159f3,
        quality4: 0xf3a549,
        quality5: 0xff2727,
    };
    //全局字体大小表--可以扩展
    GameConfig.LabelFontSize = {
        littleSize: 12,
        middleSize: 18,
        normalSize: 24,
        bigSize: 36 //大型字体大小
    };
    //最佳分辨率
    GameConfig.bestScale = 1;
    return GameConfig;
}());
__reflect(GameConfig.prototype, "GameConfig");
//中手游
var ZsyPlatform = (function () {
    function ZsyPlatform() {
        //<script src="https://h5game.cmge.com/js/cmge_h5game_v1.js"></script>
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
        this.m_sign = "";
        this.d_platform = "";
        this.d_openid = "";
        this.d_time = "";
        this.d_extinfo = "";
        this.d_invited_role_id = "";
        this.d_callback_url = "";
        this.s_gameUID = "";
        this.s_channelUID = "";
        this.count = 1;
    }
    ZsyPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    ZsyPlatform.prototype.initPlatform = function () {
        var _this = this;
        var info = PlatConst.getUrlGet();
        console.log('initPlatform info: ', info); //测试数据
        this.s_gameUID = info["gameUID"]; //游戏标识,初始化时通过url传过给游戏
        this.s_channelUID = info["channelUID"]; //渠道标识,初始化时通过url传过给游戏
        PlatConst.platformUid = info["cmgePlayerId"];
        //必需要在最前面进行加载，不能放在其它其它方法中，不要包装该方法，且不可以在每次页面加载时多次重复初始化
        window['cmgeH5GameSDK'] = new window['CmgeH5GameSDK']({
            //游戏标识,初始化时通过url传过来,这值是必须的（如果渠道不能引用中手游的js文件，则研发这里自己写死，中手游不传参数过来）
            gameUID: info["gameUID"],
            //渠道标识,初始化时通过url传过来,这值是必须的（如果渠道不能引用中手游的js文件，则研发这里自己写死，中手游不传参数过来）
            channelUID: info["channelUID"],
            loginTime: info["loginTime"],
            cmgePlayerId: info["cmgePlayerId"],
            //渠道的用户id，游戏内要保存这个值，不参与签名，通过url获取,中手游传给游戏的,部分渠道没有传该值，则让该值初始为空
            channelUserId: info["channelUserId"],
            //渠道的平台(可以认为是渠道自己的渠道)id，游戏内要保存这个值，不参与签名，通过url获取,中手游传给游戏的,部分渠道没有传该值，则让该值初始为空
            platformID: info["platformID"],
            cps: info["cps"],
            mixChannelUID: info["mixChannelUID"],
            //扩展字段，通过url获取,中手游传给游戏的,值为json字符串，例如：{'errorCode':0,'errorMessage':'登录成功'},如果不是，则要进行 decodeURIComponent 转换下,部分渠道没有传该值，则让该值初始为空
            extend: decodeURIComponent(info["extend"]),
            sign: info["sign"],
            share: {
                timeline: {
                    title: "分享朋友圈标题",
                    //分享朋友圈jpg或png正方形图片(建议尺寸为50*50，不大于3KB)链接，研发根据自己实际进行初始化该值
                    imgUrl: "分享朋友圈图片链接",
                    success: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 分享朋友圈成功'); },
                    cancel: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 取消朋友圈分享'); } //分享朋友圈取消回调函数，研发根据自己实际进行初始化该值
                },
                friend: {
                    title: "分享给好友的标题",
                    desc: "分享给好友的描述",
                    imgUrl: "https://download.cmge.com/web/cmge-117-vertical.png",
                    success: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 分享朋友成功'); },
                    cancel: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 取消朋友分享'); } //分享好友取消回调函数，研发根据自己实际进行初始化该值
                },
                shareCustomParam: {
                    cp_param1: "参数值1",
                    cp_param2: "参数值2",
                    cp_title: "cp分享标题",
                    cp_desc: "cp分享描述",
                    cp_icon: "",
                    callback: function (result) { alert('分享成功'); console.info(result); },
                }
            },
            subscribe: {
                success: function () { alert('关注成功'); /*关注 成功回调 成功回调 成功回调 */ },
                cancel: function () { alert('取消关注'); /*关注失败 回调 回调 */ },
            },
            shortcut: {
                name: "游戏名称",
                icon: "",
                callback: function (result) {
                    alert('快捷方式发送完成');
                    console.info(result);
                },
            }
        });
        window['cmgeH5GameSDK']['cpUserLogin'] = function (objectLogin) {
            console.log('cpUserLogin: ', objectLogin); //测试数据
            var actionType = {
                gameUID: _this.s_gameUID,
                channelUID: _this.s_channelUID,
                cmgePlayerId: objectLogin.cmgePlayerId,
                loginTime: objectLogin.loginTime,
                sign: objectLogin.sign,
                channelUserId: objectLogin.channelUserId,
                platformID: objectLogin.platformID,
                mixChannelUID: objectLogin.mixChannelUID,
                cps: objectLogin.cps,
                channel_id: "507",
                type: "login_sign",
            };
            console.log('cpUserLogin json--: ', JSON.stringify(actionType)); //测试数据
            Mini.HttpClient.get(function (data) {
                if (data == '0') {
                    // PlatConst.platformUid = 0;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: "",
                        qyChannelId: "507",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 507;
                }
                else {
                    console.log("登录失败：" + data.msg);
                }
            }, _this, "code=14&jstr=" + JSON.stringify(actionType), 'https://h5.373yx.com/sdk/SdkSendData');
        };
    };
    ZsyPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                LoginManager.runGame();
                return [2 /*return*/];
            });
        });
    };
    ZsyPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    ZsyPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ZsyPlatform.prototype.share = function (data) {
    };
    ZsyPlatform.prototype.loginGame = function (uid, token, channelId, username) {
    };
    ZsyPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var signJson, dp_time, serverID, oldServerID, serverName, oldServerName, roleName, oldRoleName, roleId, subject, coinNumber, cpExtend, money, itemID, version, productID, productName, roleLevel, roleVipLevel, actionSignType;
            return __generator(this, function (_a) {
                dp_time = (new Date()).getTime();
                serverID = PlatConst.zoneId.toString();
                oldServerID = PlatConst.zoneId.toString();
                serverName = PlatConst.zoneName;
                oldServerName = PlatConst.zoneName;
                roleName = PlatConst.nickName;
                oldRoleName = PlatConst.nickName;
                roleId = PlatConst.playerId.toString();
                subject = shopName;
                coinNumber = 0;
                cpExtend = "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString();
                money = price * 100;
                itemID = shopId;
                version = 3;
                productID = shopId;
                productName = shopName;
                roleLevel = PlatConst.level;
                roleVipLevel = PlatConst.vipLevel;
                actionSignType = {
                    gameUID: window['cmgeH5GameSDK'].gameUID,
                    channelUID: window['cmgeH5GameSDK'].channelUID,
                    cmgePlayerId: window['cmgeH5GameSDK'].cmgePlayerId,
                    serverID: serverID.toString(),
                    oldServerID: oldServerID.toString(),
                    serverName: serverName,
                    oldServerName: oldServerName,
                    roleId: roleId.toString(),
                    roleName: roleName,
                    oldRoleName: oldRoleName,
                    subject: subject,
                    coinNumber: coinNumber.toString(),
                    money: money.toString(),
                    itemID: itemID.toString(),
                    version: version.toString(),
                    productID: productID.toString(),
                    productName: productName,
                    roleLevel: roleLevel.toString(),
                    roleVipLevel: roleVipLevel.toString(),
                    cpExtend: cpExtend //扩展字段,可为空值,长度不超过250个字符，该参数会在支付回调时原样返回
                };
                Mini.HttpClient.get(function (data) {
                    signJson = JSON.parse(data);
                    window['cmgeH5GameSDK'].Pay({
                        money: money,
                        cmgePlayerId: window['cmgeH5GameSDK'].cmgePlayerId,
                        serverID: serverID,
                        oldServerID: oldServerID,
                        serverName: serverName,
                        oldServerName: oldServerName,
                        roleName: roleName,
                        oldRoleName: oldRoleName,
                        orderNo: orderNo.toString(),
                        subject: subject,
                        coinNumber: coinNumber,
                        itemID: itemID,
                        cpExtend: cpExtend,
                        version: version,
                        sign: signJson.sign,
                        productID: productID,
                        productName: productName,
                        roleId: roleId,
                        roleLevel: roleLevel //roleLevel    //角色等级 
                    });
                }, this, "code=15&jstr=" + JSON.stringify(actionSignType), 'https://h5.373yx.com/sdk/SdkSendData');
                return [2 /*return*/];
            });
        });
    };
    ZsyPlatform.prototype.reportRegister = function () {
        this.zsyReportData("1");
    };
    ZsyPlatform.prototype.reportLogin = function () {
        this.zsyReportData("2");
    };
    ZsyPlatform.prototype.reportData = function (dateType) {
        if (dateType == 'levelUp') {
            this.zsyReportData("3");
        }
    };
    ZsyPlatform.prototype.zsyReportData = function (dateType) {
        var dp_time = (new Date()).getTime();
        var object = {
            gameType: '武侠',
            serverId: PlatConst.zoneId.toString(),
            oldServerID: '1',
            serverName: PlatConst.zoneName.toString(),
            oldServerName: '1',
            roleId: PlatConst.playerId.toString(),
            roleName: PlatConst.nickName.toString(),
            level: PlatConst.level,
            viplevel: PlatConst.vipLevel,
            power: 1,
            coinNumber: 0,
            isNew: 1,
            createTime: PlatConst.createTimestamp,
            lastUpgradeTime: dp_time //角色最后升级时间戳（精确到秒），类型int，没有就设为0
        };
        window['cmgeH5GameSDK'].transPlayerInfo(object); //向渠道传玩家的信息
    };
    ZsyPlatform.prototype.WXattention = function () {
    };
    ZsyPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    ZsyPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return ZsyPlatform;
}());
__reflect(ZsyPlatform.prototype, "ZsyPlatform", ["Platform"]);
var LoginConst = (function () {
    function LoginConst() {
    }
    LoginConst.getResUrl = function (name, root) {
        if (root === void 0) { root = 'login'; }
        if (!name || name == '')
            return '';
        var url = $Platform == 0 ? 'http://192.168.0.18:7979/' : $PlatformSrc;
        return root == '' ? "" + url + name : "" + url + root + "/" + name + "?v=" + GameConfig.version;
        ;
    };
    /**获得浏览器类型 */
    LoginConst.systemType = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        }
        else if (("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        }
        else if (("" + ua.match(/android/i)) == "android") {
            return "android";
        }
        else if (("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        }
        else if (("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        }
        else if (("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        }
        else if (("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        }
        else {
            console.log("未知系统类型");
        }
    };
    //是不是微信浏览
    LoginConst.isWeiXin = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (microStr == "null") {
            return false;
        }
        else if (microStr == "micromessenger") {
            return true;
        }
    };
    //获得平台类型 如 微信、qqzone、qq、微博、校内、facebook
    LoginConst.platformType = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (("" + ua.match(/micromessenger/i)) == "micromessenger") {
            return "micromessenger";
        }
        else if (("" + ua.match(/qzone/i)) == "qzone") {
            return "qzone";
        }
        else if (("" + ua.match(/weibo/i)) == "weibo") {
            return "weibo";
        }
        else if (("" + ua.match(/qq/i)) == "qq") {
            return "qq";
        }
        else if (("" + ua.match(/renren/i)) == "renren") {
            return "renren";
        }
        else if (("" + ua.match(/txmicroblog/i)) == "txmicroblog") {
            return "txmicroblog";
        }
        else if (("" + ua.match(/douban/i)) == "douban") {
            return "douban";
        }
        else {
            return "other";
        }
    };
    /**低画质平台 */
    LoginConst.isLowMcMachine = function () {
        return PlatConst.isLowMcMachine();
    };
    /**服务器列表 文字颜色(中文不要塞语言包 没读取) */
    LoginConst.getSerStateLab = function (status) {
        if (status == 1) {
            return "<font color=#FF0000>[\u7206\u6EE1]</font>";
        }
        else if (status == 2) {
            return "<font color=#90FC5B>[\u6D41\u7545]</font>";
        }
        else if (status == 3) {
            return "<font color=#8A8A9E>[\u7EF4\u62A4]</font>";
        }
        else if (status == 4) {
            return "<font color=#90FC5B>[\u63A8\u8350]</font>";
        }
        return "<font color=#8A8A9E>[\u7EF4\u62A4]</font>";
    };
    /**=====================================================================================
    * 简单ui类库 begin
    * =====================================================================================
    */
    LoginConst.addTouchEvent = function (target, callBack, thisObj) {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onScaleTouch, thisObj);
        target.addEventListener(egret.TouchEvent.TOUCH_END, this.onScaleTouch, thisObj);
        target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onScaleTouch, thisObj);
        target.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onScaleTouch, thisObj);
        target['$touchFunc'] = callBack;
        target['$touchTaget'] = thisObj;
    };
    LoginConst.removeTouchEvent = function (target, callBack, thisObj) {
        target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onScaleTouch, thisObj);
        target.removeEventListener(egret.TouchEvent.TOUCH_END, this.onScaleTouch, thisObj);
        target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onScaleTouch, thisObj);
        target.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onScaleTouch, thisObj);
        delete target['$touchFunc'];
        delete target['$touchTaget'];
    };
    LoginConst.onScaleTouch = function (event) {
        var object = event.currentTarget;
        event.stopImmediatePropagation();
        egret.Tween.removeTweens(object);
        var tw = egret.Tween.get(object);
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                tw.to({ scaleX: TOUCH_SCALE_XY, scaleY: TOUCH_SCALE_XY }, TOUCH_SCALE_DEALY);
                break;
            case egret.TouchEvent.TOUCH_END: {
                tw.to({ scaleX: 1, scaleY: 1 }, TOUCH_SCALE_DEALY);
                if (object['$touchFunc'] && object['$touchTaget']) {
                    object['$touchFunc'].call(object['$touchTaget']);
                }
                break;
            }
            case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
            case egret.TouchEvent.TOUCH_CANCEL:
                var tw = egret.Tween.get(object);
                tw.to({ scaleX: 1, scaleY: 1 }, TOUCH_SCALE_DEALY);
                break;
        }
    };
    /**创建图片 */
    LoginConst.createImage = function (name, x, y, width, height, touch) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (touch === void 0) { touch = false; }
        var image = new eui.Image(LoginConst.getResUrl(name));
        image.x = x;
        image.y = y;
        if (width > 0)
            image.width = width;
        if (height > 0)
            image.height = height;
        image.touchEnabled = touch;
        return image;
    };
    /**创建文本 */
    LoginConst.createLabel = function (text, x, y, size, color, touch) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (size === void 0) { size = 20; }
        if (color === void 0) { color = 0xe9e9e6; }
        if (touch === void 0) { touch = false; }
        var label = new eui.Label(text);
        label.x = x;
        label.y = y;
        label.size = size;
        label.textColor = color;
        label.touchEnabled = touch;
        return label;
    };
    return LoginConst;
}());
__reflect(LoginConst.prototype, "LoginConst");
//拓世平台
var TSWeiduanPlatform = (function () {
    function TSWeiduanPlatform() {
    }
    TSWeiduanPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    TSWeiduanPlatform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.uid;
                PlatConst.platformUsername = data.name;
                PlatConst.token = message;
                PlatConst.channelId = Number(data.channelId);
            }
        });
    };
    TSWeiduanPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                LoginManager.runGame();
                return [2 /*return*/];
            });
        });
    };
    TSWeiduanPlatform.prototype.loginCallback = function (isp, param) {
    };
    TSWeiduanPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    TSWeiduanPlatform.prototype.share = function (data) {
    };
    TSWeiduanPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "ext": "1234567",
                    "roleId": PlatConst.playerId.toString(),
                    "roleName": PlatConst.nickName,
                    "roleLevel": PlatConst.level.toString(),
                    "zoneId": PlatConst.zoneId.toString(),
                    "zoneName": PlatConst.zoneName,
                    "balance": PlatConst.gold.toString(),
                    "callbackinfo": "",
                    "callbackurl": "",
                    "amount": amount + '',
                    "count": count + '',
                    "cp_order_id": orderNo,
                    "describe": describe,
                    "pname": name,
                    "viplevel": PlatConst.vipLevel.toString(),
                    "partyname": PlatConst.guildName,
                    "product_id": shopId,
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    TSWeiduanPlatform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    TSWeiduanPlatform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    TSWeiduanPlatform.prototype.reportData = function (dateType) {
        var gameRoleGender = PlatConst.gender ? "女" : "男";
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "zoneiId": PlatConst.zoneId.toString(),
            "zoneName": PlatConst.zoneName,
            "balance": PlatConst.gold.toString(),
            "viplevel": PlatConst.vipLevel.toString(),
            "partyName": PlatConst.guildName,
            "extra": "",
            "roleCreateTime": PlatConst.createTimestamp.toString(),
            "gameRoleGender": gameRoleGender,
            "rolePower": PlatConst.power.toString(),
            "partyRoleId": "123456",
            "partyId": PlatConst.guildId.toString(),
            "partyRoleName": "",
            "professionId": PlatConst.countryId.toString(),
            "profession": PlatConst.countryName,
            "chapter": PlatConst.norCopyId,
            "friendList": "无",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    TSWeiduanPlatform.prototype.WXattention = function () {
    };
    TSWeiduanPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    TSWeiduanPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return TSWeiduanPlatform;
}());
__reflect(TSWeiduanPlatform.prototype, "TSWeiduanPlatform", ["Platform"]);
/**群黑 */
var QunHeiPlatform = (function () {
    function QunHeiPlatform() {
        this.m_httpServerUrl2 = "https://h5.373yx.com/sdk/SdkSendData";
        this.time = 0; //登录时间(UNIX时间戳)
        this.isadult = 0; //防沉迷标识(1是成年，0是未成年)
        this.qhzoneId = 0;
    }
    QunHeiPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    QunHeiPlatform.prototype.initPlatform = function () {
        var info = PlatConst.getUrlGet();
        PlatConst.platformUsername = info["username"];
        this.qhzoneId = info["serverid"];
        this.time = info["time"];
        this.isadult = info["isadult"];
        this.uimg = info["uimg"];
        this.nname = info["nname"];
        this.unid = info["unid"];
        this.qhchannel = info["qhchannel"];
        this.qhchannelid = info["qhchannelid"];
        this.showbtn = info["showbtn"];
        this.flag = info["flag"];
        var initdata = {
            "username": PlatConst.platformUsername,
            "gid": '4537',
            "qhchannel": this.qhchannel,
            "qhchannelid": this.qhchannelid,
            "time": this.time //用户登录时间戳，群黑登录接口里面time参数
        };
        window['qhsdk'].init(initdata);
        console.log(JSON.stringify(initdata));
    };
    QunHeiPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                PlatConst.token = JSON.stringify({
                    username: PlatConst.platformUsername,
                    uid: PlatConst.platformUsername,
                    qyChannelId: "502",
                    type: "login",
                    token: PlatConst.platformUsername
                });
                PlatConst.channelId = 502;
                LoginManager.runGame();
                return [2 /*return*/];
            });
        });
    };
    QunHeiPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    QunHeiPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window['qhsdk'].share(function (e) {
                    if (e.data == 'shareok') {
                        // 分享成功
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    QunHeiPlatform.prototype.share = function (data) {
    };
    QunHeiPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, goodsId, goodsName, ext, md, sign, paydata;
            return __generator(this, function (_a) {
                amount = price;
                goodsId = shopId;
                goodsName = shopName;
                ext = "serverid=" + PlatConst.zoneId + "|productid=" + goodsId + "|cp_order_id=" + orderNo;
                md = new md5();
                sign = md.hex_md5("" + amount + PlatConst.platformUsername + ext + "17c3385d0b97b1ac553a90e851a09384");
                paydata = {
                    "userId": PlatConst.platformUsername,
                    "gid": '4537',
                    "roleName": this.nname,
                    "goodsId": goodsId.toString(),
                    "goodsName": goodsName.toString(),
                    "money": amount,
                    "ext": ext,
                    "serverId": this.qhzoneId,
                    "roleId": PlatConst.playerId.toString(),
                    "sign": sign
                };
                // Utils.open_view(TASK_UI.COM_HELP_DOC, {content:JSON.stringify(paydata),title:GCode(CLEnum.WOR_HELP_TITLE)});
                window['qhsdk'].pay(paydata, function (code, msg) {
                    //充值结果通知，code为编号，msg为信息。该结果不能作为发货依据。该回调已经取消！！请使用后端回调判断发货
                    console.log(code + ',' + msg);
                });
                return [2 /*return*/];
            });
        });
    };
    QunHeiPlatform.prototype.reportRegister = function () {
        var PlatConst = { "act": "1", "serverid": PlatConst.zoneId, "rolename": this.nname, "roleid": PlatConst.playerId, "level": PlatConst.level, "power": PlatConst.power };
        window['qhsdk'].role(PlatConst);
    };
    QunHeiPlatform.prototype.reportLogin = function () {
    };
    QunHeiPlatform.prototype.reportData = function (dateType) {
    };
    QunHeiPlatform.prototype.WXattention = function () {
    };
    QunHeiPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    QunHeiPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return QunHeiPlatform;
}());
__reflect(QunHeiPlatform.prototype, "QunHeiPlatform", ["Platform"]);
var Mini;
(function (Mini) {
    var CMaskWnd = (function (_super) {
        __extends(CMaskWnd, _super);
        function CMaskWnd() {
            var _this = _super.call(this) || this;
            _this.width = GameConfig.curWidth();
            _this.height = GameConfig.curHeight();
            return _this;
        }
        CMaskWnd.prototype.onDestroy = function () {
            this.m_rectMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);
            LoginConst.removeTouchEvent(this.m_imgClose, this.onMaskClickListener, this);
            if (this.parent)
                this.parent.removeChild(this);
        };
        CMaskWnd.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.m_rectMask = new eui.Rect(GameConfig.curWidth(), GameConfig.curHeight(), 0x000000);
            this.m_rectMask.alpha = 0.6;
            this.addChild(this.m_rectMask);
            this.m_rectMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);
            this.m_pRoot = new eui.Group();
            this.m_pRoot.horizontalCenter = 0;
            this.m_pRoot.verticalCenter = 0;
            this.addChild(this.m_pRoot);
            this.m_imgBg = new eui.Image(LoginConst.getResUrl('login_frame.jpg'));
            this.m_imgBg.scale9Grid = new egret.Rectangle(257, 77, 318, 33);
            this.m_pRoot.addChild(this.m_imgBg);
            this.m_labTitle = new eui.Label('公 告');
            this.m_labTitle.y = 12;
            this.m_labTitle.horizontalCenter = 0;
            this.m_labTitle.size = 36;
            this.m_labTitle.textColor = 0xffff99;
            this.m_pRoot.addChild(this.m_labTitle);
            this.m_imgClose = LoginConst.createImage('close_btn.png', null, null, null, null, true);
            this.m_imgClose.top = -5;
            this.m_imgClose.right = -10;
            this.m_pRoot.addChildAt(this.m_imgClose, 999);
            LoginConst.addTouchEvent(this.m_imgClose, this.onMaskClickListener, this);
        };
        CMaskWnd.prototype.setSize = function (width, heigth) {
            this.m_imgBg.width = width;
            this.m_imgBg.height = heigth;
        };
        CMaskWnd.prototype.setTitle = function (title) {
            this.m_labTitle.text = title;
        };
        CMaskWnd.prototype.onMaskClickListener = function () {
            this.onDestroy();
        };
        return CMaskWnd;
    }(eui.Component));
    Mini.CMaskWnd = CMaskWnd;
    __reflect(CMaskWnd.prototype, "Mini.CMaskWnd");
})(Mini || (Mini = {}));
// 运营商id
var IPSeEnum;
(function (IPSeEnum) {
    IPSeEnum[IPSeEnum["QI_YUAN"] = 0] = "QI_YUAN";
    IPSeEnum[IPSeEnum["TUO_SHI"] = 1] = "TUO_SHI";
    IPSeEnum[IPSeEnum["MO_LE"] = 2] = "MO_LE";
    IPSeEnum[IPSeEnum["QUN_HEI"] = 3] = "QUN_HEI";
    IPSeEnum[IPSeEnum["MZ_YW"] = 4] = "MZ_YW";
    IPSeEnum[IPSeEnum["DD_T"] = 5] = "DD_T";
    IPSeEnum[IPSeEnum["DDT_WX"] = 6] = "DDT_WX";
    IPSeEnum[IPSeEnum["MZYW_APK"] = 7] = "MZYW_APK";
    IPSeEnum[IPSeEnum["ZS_Y"] = 8] = "ZS_Y";
    IPSeEnum[IPSeEnum["J_Z"] = 9] = "J_Z";
    IPSeEnum[IPSeEnum["H_Y"] = 10] = "H_Y";
})(IPSeEnum || (IPSeEnum = {}));
/**资源平台枚举(每个平台100个段位) */
var PlatEnum;
(function (PlatEnum) {
    /**常规 */
    PlatEnum[PlatEnum["NORMAL"] = 0] = "NORMAL";
    /**微信 */
    PlatEnum[PlatEnum["WE_CHAT"] = 1] = "WE_CHAT";
    /**QQ */
    PlatEnum[PlatEnum["QQ_CHAT"] = 2] = "QQ_CHAT";
    /**外网 */
    PlatEnum[PlatEnum["WEB"] = 3] = "WEB";
    /**拓世微端 */
    PlatEnum[PlatEnum["TS_WEIDUAN"] = 101] = "TS_WEIDUAN";
    /**魔乐微信网页 */
    PlatEnum[PlatEnum["MOLE_WEB"] = 201] = "MOLE_WEB";
    /**群黑 */
    PlatEnum[PlatEnum["QUNHEI_WEB"] = 301] = "QUNHEI_WEB";
    /**拇指游玩 */
    PlatEnum[PlatEnum["MZYW_WEB"] = 401] = "MZYW_WEB";
    /**拇指游玩IOS */
    PlatEnum[PlatEnum["MZYW_IOS"] = 402] = "MZYW_IOS";
    /**达达兔 */
    PlatEnum[PlatEnum["DDT_WEB"] = 501] = "DDT_WEB";
    /**达达兔微信小游戏(每个平台100个段位 错误编号 以后不能再加) */
    PlatEnum[PlatEnum["DDT_WE_CHAT"] = 601] = "DDT_WE_CHAT";
    /**拇指游玩全资源端 (每个平台100个段位 错误编号 以后不能再加)*/
    PlatEnum[PlatEnum["MZYW_ALL_APK"] = 701] = "MZYW_ALL_APK";
    /**中手游链端 */
    PlatEnum[PlatEnum["ZSY_WEB"] = 801] = "ZSY_WEB";
    /**中手游微信小游戏 */
    PlatEnum[PlatEnum["ZSY_WE_CHAT"] = 802] = "ZSY_WE_CHAT";
    /**九指微端(权战三国) */
    PlatEnum[PlatEnum["JZ_APK"] = 901] = "JZ_APK";
    /**九指微端(重写三国志) */
    PlatEnum[PlatEnum["JZ_APK2"] = 902] = "JZ_APK2";
    /**九指微端(三国志国战版) */
    PlatEnum[PlatEnum["JZ_APK3"] = 903] = "JZ_APK3";
    /**九指微端(挂机三国志BT版) */
    PlatEnum[PlatEnum["JZ_APK4"] = 904] = "JZ_APK4";
    /**九指H5 */
    PlatEnum[PlatEnum["JZ_H5"] = 905] = "JZ_H5";
    /**乾游微端(权游三国) */
    PlatEnum[PlatEnum["HY_APK"] = 1001] = "HY_APK";
})(PlatEnum || (PlatEnum = {}));
// 上报类型
var ReportType = (function () {
    function ReportType() {
    }
    ReportType.levelup = "levelUp"; //升级
    ReportType.enterServer = "enterServer"; //进入游戏
    ReportType.createRole = "createRole"; //创建游戏
    return ReportType;
}());
__reflect(ReportType.prototype, "ReportType");
var PlatConst = (function () {
    function PlatConst() {
    }
    //获取运营商id
    PlatConst.getIpsId = function () {
        switch (this.platform) {
            case PlatEnum.TS_WEIDUAN: {
                return IPSeEnum.TUO_SHI;
            }
            case PlatEnum.MOLE_WEB: {
                return IPSeEnum.MO_LE;
            }
            case PlatEnum.QUNHEI_WEB: {
                return IPSeEnum.QUN_HEI;
            }
            case PlatEnum.MZYW_WEB:
            case PlatEnum.MZYW_IOS: {
                return IPSeEnum.MZ_YW;
            }
            case PlatEnum.DDT_WEB: {
                return IPSeEnum.DD_T;
            }
            case PlatEnum.DDT_WE_CHAT: {
                return IPSeEnum.DDT_WX;
            }
            case PlatEnum.MZYW_ALL_APK: {
                return IPSeEnum.MZYW_APK;
            }
            case PlatEnum.ZSY_WEB:
            case PlatEnum.ZSY_WE_CHAT: {
                return IPSeEnum.ZS_Y;
            }
            case PlatEnum.JZ_APK:
            case PlatEnum.JZ_APK2:
            case PlatEnum.JZ_APK3:
            case PlatEnum.JZ_APK4:
            case PlatEnum.JZ_H5: {
                return IPSeEnum.J_Z;
            }
            case PlatEnum.HY_APK: {
                return IPSeEnum.H_Y;
            }
            default:
                return IPSeEnum.QI_YUAN;
        }
    };
    /**资源sdn地址 */
    PlatConst.getResRemoteUrl = function (isConfig) {
        if (isConfig === void 0) { isConfig = false; }
        if (!isConfig && $Platform == PlatEnum.MZYW_ALL_APK) {
            return '/resource/';
        }
        return $PlatformSrc + 'resource/';
    };
    /**低画质平台 */
    PlatConst.isLowMcMachine = function () {
        switch (this.platform) {
            case PlatEnum.WE_CHAT:
            case PlatEnum.QQ_CHAT:
            case PlatEnum.DDT_WE_CHAT:
            case PlatEnum.ZSY_WE_CHAT:
                return true;
            default:
                return false;
        }
    };
    /**是否走正常充值 */
    PlatConst.isNormalPay = function () {
        switch (this.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.WEB:
                return false;
            default:
                return true;
        }
    };
    /**是否隐藏输入账号 */
    PlatConst.isHideAccount = function () {
        switch (this.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.WEB:
                return false;
            default:
                return true;
        }
    };
    /**是否显示公告 */
    PlatConst.isShowNotice = function () {
        switch (PlatConst.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.MZYW_WEB:
            case PlatEnum.MZYW_ALL_APK:
            case PlatEnum.JZ_APK:
            case PlatEnum.JZ_APK2:
            case PlatEnum.JZ_APK3:
            case PlatEnum.JZ_APK4:
            case PlatEnum.JZ_H5:
            case PlatEnum.HY_APK:
                return true;
        }
        return false;
    };
    /**九紫平台 */
    PlatConst.isPlatJZ = function () {
        if (PlatConst.platform == PlatEnum.NORMAL || this.getIpsId() == IPSeEnum.J_Z)
            return true;
        return false;
    };
    /**是否小程序 */
    PlatConst.isWxApp = function () {
        switch (PlatConst.platform) {
            case PlatEnum.DDT_WE_CHAT:
            case PlatEnum.WE_CHAT:
            case PlatEnum.ZSY_WE_CHAT:
                return true;
        }
        return false;
    };
    /**获取网址信息 */
    PlatConst.getUrlGet = function () {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (u[1]) {
            u = u[1].split("&");
            var gets = {};
            for (var i in u) {
                var j = u[i].split("=");
                gets[j[0]] = j[1];
            }
            return gets;
        }
        return {};
    };
    /**是否调试平台 */
    PlatConst.isDebugPlat = function () {
        switch (PlatConst.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.WEB:
                return true;
        }
        return false;
    };
    /**支付类型(rmb 勾玉) */
    PlatConst.isRmbPay = function () {
        switch (PlatConst.platform) {
            case PlatEnum.MZYW_IOS:
                return false;
        }
        return true;
    };
    PlatConst.zoneId = 1; // 服务器id
    PlatConst.zoneName = ""; // 服务器名字
    PlatConst.channelId = 0; //渠道id
    PlatConst.token = ""; //平台token
    PlatConst.timestamp = ""; //公用时间戳
    PlatConst.platformId = ""; //平台id
    PlatConst.platformUid = ""; //平台uid
    PlatConst.platformUsername = ""; //平台用户名
    PlatConst.platform = 0; /**资源平台 */
    PlatConst.power = 0; //战斗力
    PlatConst.vipLevel = 0; //vip等级
    PlatConst.guildId = 0; //工会名字
    PlatConst.guildName = ''; //工会名字
    PlatConst.nickName = ''; //玩家名字
    PlatConst.gold = 0; //金币
    PlatConst.gender = 0; //男女
    PlatConst.countryId = 0; //国家
    PlatConst.countryName = ''; //国家名
    PlatConst.norCopyId = 0; //通过章节
    return PlatConst;
}());
__reflect(PlatConst.prototype, "PlatConst");
var LocalData = (function () {
    function LocalData() {
    }
    /**本地文件保存数据 */
    LocalData.setData = function (key, data) {
        egret.localStorage.setItem(key, data);
    };
    /**通过本地文件获取数据 */
    LocalData.getData = function (key, def) {
        if (def === void 0) { def = ''; }
        var data;
        data = egret.localStorage.getItem(key);
        return data ? data : def;
    };
    /**移除本地文件数据 */
    LocalData.removeData = function (key) {
        egret.localStorage.removeItem(key);
    };
    LocalData.setOpenId = function (openId) {
        this.setData(this.OPEN_ID, openId);
    };
    LocalData.getOpenId = function () {
        return this.getData(this.OPEN_ID) || 'huanggj';
    };
    LocalData.OPEN_ID = "h5sdk.openid";
    return LocalData;
}());
__reflect(LocalData.prototype, "LocalData");
/*
* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
* Digest Algorithm, as defined in RFC 1321.
* Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*/
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var md5 = (function () {
    function md5() {
        this.hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
        this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    }
    /*
     * These are the privates you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    md5.prototype.hex_md5 = function (s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
    md5.prototype.b64_md5 = function (s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
    md5.prototype.any_md5 = function (s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
    md5.prototype.hex_hmac_md5 = function (k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    md5.prototype.b64_hmac_md5 = function (k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    md5.prototype.any_hmac_md5 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
    /*
     * Perform a simple self-test to see if the VM is working
     */
    md5.prototype.md5_vm_test = function () {
        return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    };
    /*
     * Calculate the MD5 of a raw string
     */
    md5.prototype.rstr_md5 = function (s) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    };
    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    md5.prototype.rstr_hmac_md5 = function (key, data) {
        var bkey = this.rstr2binl(key);
        if (bkey.length > 16)
            bkey = this.binl_md5(bkey, key.length * 8);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };
    /*
     * Convert a raw string to a hex string
     */
    md5.prototype.rstr2hex = function (input) {
        try {
            this.hexcase;
        }
        catch (e) {
            this.hexcase = 0;
        }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
    /*
     * Convert a raw string to a base-64 string
     */
    md5.prototype.rstr2b64 = function (input) {
        try {
            this.b64pad;
        }
        catch (e) {
            this.b64pad = '';
        }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8)
                    output += this.b64pad;
                else
                    output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    };
    /*
     * Convert a raw string to an arbitrary string encoding
     */
    md5.prototype.rstr2any = function (input, encoding) {
        var divisor = encoding.length;
        var i, j, q, x, quotient;
        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }
        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. All remainders are stored for later
         * use.
         */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)));
        var remainders = Array(full_length);
        for (j = 0; j < full_length; j++) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }
        /* Convert the remainders to the output string */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);
        return output;
    };
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    md5.prototype.str2rstr_utf8 = function (input) {
        var output = "";
        var i = -1;
        var x, y;
        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }
            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        }
        return output;
    };
    /*
     * Encode a string as utf-16
     */
    md5.prototype.str2rstr_utf16le = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    };
    md5.prototype.str2rstr_utf16be = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
        return output;
    };
    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    md5.prototype.rstr2binl = function (input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        return output;
    };
    /*
     * Convert an array of little-endian words to a string
     */
    md5.prototype.binl2rstr = function (input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        return output;
    };
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    md5.prototype.binl_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    };
    /*
     * These privates implement the four basic operations the algorithm uses.
     */
    md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    md5.prototype.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    md5.prototype.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    return md5;
}());
__reflect(md5.prototype, "md5");
//拇指游玩
var MzywPlatform = (function () {
    function MzywPlatform() {
        //<script src="http://cdn.91muzhi.com/pic/h5sdk/jquery-1.10.2.min.js"></script>
        //<script src="http://91muzhicom-1251304591.file.myqcloud.com/pic/h5sdk/gameh5sdk.js"></script>
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
        this.m_sign = "";
        this.count = 1;
    }
    MzywPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    MzywPlatform.prototype.initPlatform = function () {
        var info = PlatConst.getUrlGet();
        PlatConst.platformUid = info["userId"];
        this.m_sign = info["sign"];
    };
    MzywPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                actionType = {
                    "channel_id": "503",
                    "sign": this.m_sign,
                    "userId": PlatConst.platformUid.toString(),
                    "type": "login_sign",
                };
                Mini.HttpClient.get(function (data) {
                    if (data == '0') {
                        // PlatConst.platformUid = 0;
                        PlatConst.platformUsername = "";
                        PlatConst.token = JSON.stringify({
                            username: "",
                            uid: "",
                            qyChannelId: "503",
                            type: "login",
                            token: PlatConst.platformUid.toString()
                        });
                        PlatConst.channelId = 503;
                        LoginManager.runGame();
                    }
                    else {
                        console.log("登录失败：" + data.msg);
                    }
                }, this, "code=5&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    MzywPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    MzywPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    MzywPlatform.prototype.share = function (data) {
    };
    MzywPlatform.prototype.loginGame = function (uid, token, channelId, username) {
    };
    MzywPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var callbackinfo, amount, signJson, actionSignType;
            return __generator(this, function (_a) {
                callbackinfo = "rolename=" + PlatConst.nickName;
                amount = price * 100;
                actionSignType = {
                    "cp_order_id": orderNo.toString(),
                    "amount": amount,
                    "userId": PlatConst.platformUid.toString(),
                    "level": PlatConst.level,
                    "server_id": PlatConst.zoneId.toString(),
                };
                Mini.HttpClient.get(function (data) {
                    signJson = JSON.parse(data);
                    window['mzh5sdk'].placeOrder({
                        userId: PlatConst.platformUid.toString(),
                        packetId: signJson.packetId,
                        coin_name: '钻石',
                        game_id: signJson.gameId,
                        pay_type: 'iospay',
                        cp_order_id: orderNo.toString(),
                        amount: amount,
                        server_id: PlatConst.zoneId.toString(),
                        level: PlatConst.level,
                        transData: callbackinfo,
                        role_id: PlatConst.playerId.toString(),
                        roduct_id: shopId.toString,
                        sign: signJson.sign,
                    });
                }, this, "code=6&jstr=" + JSON.stringify(actionSignType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    MzywPlatform.prototype.reportRegister = function () {
        console.log("---mzh5sdk uploadRole");
        window['mzh5sdk'].uploadRole({
            "u": PlatConst.platformUid.toString(),
            "g": '1189',
            "s": PlatConst.zoneId.toString(),
            "sn": PlatConst.zoneName.toString(),
            "r": PlatConst.playerId.toString(),
            "rn": PlatConst.nickName.toString(),
            "rl": PlatConst.level.toString(),
            "cn": '0',
            "rvl": PlatConst.vipLevel.toString()
        });
    };
    MzywPlatform.prototype.reportLogin = function () {
        // this.reportRegister();
    };
    MzywPlatform.prototype.reportData = function (dateType) {
    };
    MzywPlatform.prototype.WXattention = function () {
    };
    MzywPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    MzywPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return MzywPlatform;
}());
__reflect(MzywPlatform.prototype, "MzywPlatform", ["Platform"]);
//达达兔
var DdtPlatform = (function () {
    function DdtPlatform() {
        //<script type="text/javascript" src="https://m.ddt.lynaqi.com/static/JS-SDK/ddt.sdk.js"></script>
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
        this.m_sign = "";
        this.d_platform = "";
        this.d_openid = "";
        this.d_time = "";
        this.d_extinfo = "";
        this.d_invited_role_id = "";
        this.d_callback_url = "";
        this.count = 1;
    }
    DdtPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DdtPlatform.prototype.initPlatform = function () {
        var info = PlatConst.getUrlGet();
        PlatConst.platformUid = info["uid"];
        this.m_sign = info["sign"];
        this.d_platform = info["platform"];
        this.d_openid = info["openid"];
        this.d_appid = info["appid"];
        this.d_sid = info["sid"];
        this.d_time = info["time"];
        this.d_extinfo = info["extinfo"];
        this.d_invited_role_id = info["invited_role_id"];
        this.d_callback_url = info["callback_url"];
        window['DDTGame'].inIt({
            platform: this.d_platform,
            uid: PlatConst.platformUid,
            appid: this.d_appid,
            openid: this.d_openid,
            extInfo: this.d_extinfo,
            debug: false,
        });
    };
    DdtPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                actionType = {
                    "channel_id": "504",
                    "sign": this.m_sign,
                    "appid": this.d_appid,
                    "callback_url": this.d_callback_url,
                    "extinfo": this.d_extinfo,
                    "invited_role_id": this.d_invited_role_id,
                    "openid": this.d_openid,
                    "platform": this.d_platform,
                    "sid": this.d_sid,
                    "time": this.d_time,
                    "uid": PlatConst.platformUid.toString(),
                    "type": "login_sign",
                };
                Mini.HttpClient.get(function (data) {
                    if (data == '0') {
                        // PlatConst.platformUid = 0;
                        PlatConst.platformUsername = "";
                        PlatConst.token = JSON.stringify({
                            username: "",
                            uid: "",
                            qyChannelId: "504",
                            type: "login",
                            token: PlatConst.platformUid.toString()
                        });
                        PlatConst.channelId = 504;
                        LoginManager.runGame();
                    }
                    else {
                        console.log("登录失败：" + data.msg);
                    }
                }, this, "code=8&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    DdtPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    DdtPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DdtPlatform.prototype.share = function (data) {
    };
    DdtPlatform.prototype.loginGame = function (uid, token, channelId, username) {
    };
    DdtPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var callbackinfo, amount, signJson, dp_time, actionSignType;
            return __generator(this, function (_a) {
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString();
                amount = price;
                dp_time = (new Date()).getTime();
                actionSignType = {
                    "cp_orderid": orderNo.toString(),
                    "amount": amount,
                    "uid": PlatConst.platformUid,
                    "cp_extinfo": callbackinfo,
                    "extinfo": this.d_extinfo,
                    "item_id": shopId,
                    "item_name": shopName,
                    "role_name": PlatConst.nickName,
                    "sid": PlatConst.zoneId,
                    "time": dp_time,
                };
                Mini.HttpClient.get(function (data) {
                    signJson = JSON.parse(data);
                    window['DDTGame'].Pay({
                        cp_orderid: orderNo.toString(),
                        amount: amount,
                        uid: PlatConst.platformUid,
                        appid: signJson.gameId,
                        role_name: PlatConst.nickName,
                        item_name: shopName,
                        sid: PlatConst.zoneId,
                        "cp_extinfo": callbackinfo,
                        "extinfo": _this.d_extinfo,
                        item_id: shopId,
                        time: dp_time,
                        sign: signJson.sign,
                    });
                }, this, "code=7&jstr=" + JSON.stringify(actionSignType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    DdtPlatform.prototype.reportRegister = function () {
        this.ddtReportData("1");
    };
    DdtPlatform.prototype.reportLogin = function () {
        this.ddtReportData("2");
    };
    DdtPlatform.prototype.reportData = function (dateType) {
        if (dateType == 'levelUp') {
            this.ddtReportData("3");
        }
    };
    DdtPlatform.prototype.ddtReportData = function (dateType) {
        var dp_time = (new Date()).getTime();
        var actionSignType = {
            "type": dateType,
            "uid": PlatConst.platformUid.toString(),
            "roleid": PlatConst.playerId.toString(),
            "role_name": PlatConst.nickName.toString(),
            "sid": PlatConst.zoneId.toString(),
            "server_name": PlatConst.zoneName.toString(),
            "level": PlatConst.level.toString(),
            "power": "0",
            "vip": PlatConst.vipLevel.toString(),
            "time": dp_time.toString(),
            "create_time": PlatConst.createTimestamp.toString(),
        };
        Mini.HttpClient.get(function (data) {
            var signJson = JSON.parse(data);
            window['DDTGame'].onUserInfo({
                "type": dateType,
                "appid": signJson.gameId,
                "uid": PlatConst.platformUid,
                "roleid": PlatConst.playerId.toString(),
                "role_name": PlatConst.nickName,
                "sid": PlatConst.zoneId,
                "server_name": PlatConst.zoneName,
                "level": PlatConst.level,
                "power": 0,
                "vip": PlatConst.vipLevel.toString(),
                "time": dp_time,
                "create_time": PlatConst.createTimestamp,
                sign: signJson.sign,
            });
        }, this, "code=9&jstr=" + JSON.stringify(actionSignType), this.m_httpServerUrl);
    };
    DdtPlatform.prototype.WXattention = function () {
    };
    DdtPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    DdtPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return DdtPlatform;
}());
__reflect(DdtPlatform.prototype, "DdtPlatform", ["Platform"]);
//达达兔微信小游戏
var DdtWxPlatform = (function () {
    function DdtWxPlatform() {
        //lbgame.sdk.js
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
        this.d_openid = "";
        this.d_pf_ver = "";
        this.count = 1;
    }
    DdtWxPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DdtWxPlatform.prototype.initPlatform = function () {
    };
    DdtWxPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, actionType;
            return __generator(this, function (_a) {
                info = JSON.parse(JSON.stringify($loginInfo));
                PlatConst.platformUid = info["pf_uid"];
                this.d_openid = info["openid"];
                this.d_pf_appid = info["pf_appid"];
                this.d_pf_UqGatv = info["pf_UqGatv"];
                this.d_pf_ver = info["pf_ver"];
                this.d_time = info["time"];
                this.m_token = info["token"];
                console.log('ts达达兔微信小游戏login数据:', PlatConst.platformUid);
                actionType = {
                    "channel_id": "505",
                    "openid": this.d_openid.toString(),
                    "pf_appid": this.d_pf_appid.toString(),
                    "pf_UqGatv": this.d_pf_UqGatv.toString(),
                    "pf_ver": this.d_pf_ver.toString(),
                    "time": this.d_time.toString(),
                    "token": this.m_token.toString(),
                    "pf_uid": PlatConst.platformUid.toString(),
                    "type": "login_sign",
                };
                Mini.HttpClient.get(function (data) {
                    if (data == '0') {
                        PlatConst.platformUsername = "";
                        PlatConst.token = JSON.stringify({
                            username: "",
                            uid: "",
                            qyChannelId: "505",
                            type: "login",
                            token: PlatConst.platformUid.toString()
                        });
                        PlatConst.channelId = 505;
                        LoginManager.runGame();
                    }
                    else {
                        LoginManager.showTips("登录失败：" + data.msg);
                    }
                }, this, "code=12&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    DdtWxPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    DdtWxPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var id = 'uhX7C6jGThOpS/wwMN3gBA==';
                        var url = 'https://mmocgame.qpic.cn/wechatgame/Z8iaqQZ8v1fKNDu6Qv1rdVic7ick3lWBWghSg1tGhicmgSvgCdq0wWADLhgvyjFDibDJ0/0';
                        wx.showShareMenu({
                            withShareTicket: true,
                            success: function (res) {
                                console.log(res, "转发成功");
                            },
                            fail: function (res) {
                                console.log(res, "转发失败");
                            },
                            complete: function (res) {
                                console.log(res, "转发完成");
                            }
                        });
                        wx.onShareAppMessage(function () {
                            return {
                                title: '别惹三国ol',
                                imageUrlId: id,
                                imageUrl: url
                            };
                        });
                    })];
            });
        });
    };
    DdtWxPlatform.prototype.share = function (data) {
    };
    DdtWxPlatform.prototype.loginGame = function (uid, token, channelId, username) {
    };
    DdtWxPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var callbackinfo, amount, signJson, dp_time, actionSignType;
            return __generator(this, function (_a) {
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString();
                amount = price;
                dp_time = Math.floor(((new Date()).getTime()) / 1000);
                actionSignType = {
                    "cp_orderid": orderNo.toString(),
                    "amount": amount,
                    "uid": PlatConst.platformUid,
                    "appid": this.d_pf_appid,
                    "cp_extinfo": callbackinfo,
                    "extinfo": "null",
                    "item_id": shopId,
                    "item_name": shopName,
                    "role_name": PlatConst.nickName,
                    "sid": PlatConst.zoneId,
                    "time": dp_time
                };
                Mini.HttpClient.get(function (data) {
                    signJson = JSON.parse(data);
                    window['LBGame'].SylxTK({
                        cp_orderid: orderNo.toString(),
                        amount: amount,
                        uid: PlatConst.platformUid,
                        appid: signJson.gameId,
                        role_name: PlatConst.nickName,
                        item_name: shopName.toString(),
                        sid: PlatConst.zoneId.toString(),
                        cp_extinfo: signJson.cpextinfo64,
                        extinfo: "null",
                        item_id: shopId,
                        time: dp_time,
                        sign: signJson.sign,
                    });
                }, this, "code=10&jstr=" + JSON.stringify(actionSignType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    DdtWxPlatform.prototype.reportRegister = function () {
        this.ddtReportData("1");
    };
    DdtWxPlatform.prototype.reportLogin = function () {
        this.ddtReportData("2");
    };
    DdtWxPlatform.prototype.reportData = function (dateType) {
        if (dateType == 'levelUp') {
            this.ddtReportData("3");
        }
    };
    DdtWxPlatform.prototype.ddtReportData = function (dateType) {
        var dp_time = (new Date()).getTime();
        var actionSignType = {
            "type": dateType,
            "uid": PlatConst.platformUid.toString(),
            "roleid": PlatConst.playerId.toString(),
            "role_name": PlatConst.nickName.toString(),
            "sid": PlatConst.zoneId.toString(),
            "server_name": PlatConst.zoneName.toString(),
            "level": PlatConst.level.toString(),
            "power": "0",
            "vip": PlatConst.vipLevel.toString(),
            "time": dp_time.toString(),
            "create_time": PlatConst.createTimestamp.toString(),
        };
        Mini.HttpClient.get(function (data) {
            var signJson = JSON.parse(data);
            window['LBGame'].onRoleInfo({
                "type": dateType,
                "appid": signJson.gameId,
                "uid": PlatConst.platformUid,
                "roleid": PlatConst.playerId.toString(),
                "role_name": PlatConst.nickName,
                "sid": PlatConst.zoneId,
                "server_name": PlatConst.zoneName,
                "level": PlatConst.level,
                "power": 0,
                "vip": PlatConst.vipLevel.toString(),
                "time": dp_time,
                "create_time": PlatConst.createTimestamp.toString(),
                sign: signJson.sign,
            });
        }, this, "code=11&jstr=" + JSON.stringify(actionSignType), this.m_httpServerUrl);
    };
    DdtWxPlatform.prototype.WXattention = function () {
    };
    DdtWxPlatform.prototype.isHidePayFunc = function () {
        if ($PlatformSrc.indexOf("sh") != -1) {
            return true;
        }
        else {
            return !this.d_pf_UqGatv;
        }
    };
    DdtWxPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        //   callback.call(target,true);
        var actionType = {
            content: msg
        };
        Mini.HttpClient.get(function (data) {
            if (data == "0" || data == "42001" || data == "FAILURE") {
                callback.call(target, true);
            }
            else {
                callback.call(target, false);
            }
        }, this, "code=16&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl);
    };
    return DdtWxPlatform;
}());
__reflect(DdtWxPlatform.prototype, "DdtWxPlatform", ["Platform"]);
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.initPlatform = function () {
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                LoginManager.runGame();
                return [2 /*return*/];
            });
        });
    };
    DebugPlatform.prototype.loginCallback = function (isp, param) {
    };
    DebugPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    DebugPlatform.prototype.share = function (data) {
    };
    DebugPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DebugPlatform.prototype.reportRegister = function () {
    };
    DebugPlatform.prototype.reportLogin = function () {
    };
    DebugPlatform.prototype.reportData = function (dateType) {
    };
    DebugPlatform.prototype.WXattention = function () {
    };
    DebugPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    DebugPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
//乾游Apk
var HyApkPlatform = (function () {
    function HyApkPlatform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    HyApkPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    HyApkPlatform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.platformId = data.platformId;
                PlatConst.channelId = 515;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        });
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    HyApkPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType, actionType, data;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    actionType = {
                        "channel_id": "515",
                        "timestamp": PlatConst.timestamp,
                        "platformId": PlatConst.platformId,
                        "sign": PlatConst.token,
                        "userId": PlatConst.platformUid.toString(),
                        "type": "login_sign",
                    };
                    data = '1';
                    if (PlatConst.platformUid.length > 2 && PlatConst.token.length > 2) {
                        data = '0';
                    }
                    if (data == '0') {
                        // PlatConst.platformUid = 0;
                        // PlatConst.platformUsername = "";
                        PlatConst.token = JSON.stringify({
                            username: "",
                            uid: PlatConst.token,
                            qyChannelId: "515",
                            type: "login",
                            token: PlatConst.platformUid
                        });
                        PlatConst.channelId = 515;
                        LoginManager.runGame();
                    }
                    else {
                        console.log("登录失败：" + data);
                    }
                    //        },this,"code=19&jstr="+JSON.stringify(actionType),this.m_httpServerUrl);
                }
                return [2 /*return*/];
            });
        });
    };
    HyApkPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    HyApkPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    HyApkPlatform.prototype.share = function (data) {
    };
    HyApkPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, callbackjson, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                callbackjson = {
                    "rolename": PlatConst.nickName,
                    "productId": shopId.toString(),
                    "cp_orderid": orderNo.toString(),
                };
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "roleId": PlatConst.playerId.toString(),
                    "roleName": PlatConst.nickName,
                    "gameGold": "元宝",
                    "cpOrderId": orderNo.toString(),
                    "rate": 100,
                    "callBackStr": JSON.stringify(callbackjson),
                    "productName": name,
                    "money": amount,
                    "exStr": "exStr",
                    "noticeUrl": "http://h5.373yx.com:2688/HyApkSdkCallback",
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    HyApkPlatform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    HyApkPlatform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    HyApkPlatform.prototype.reportData = function (dateType) {
        var infoType = 0;
        if (dateType == "createRole") {
            infoType = 0;
        }
        else if (dateType == "enterServer") {
            infoType = 1;
        }
        else if (dateType == "levelUp") {
            infoType = 2;
        }
        var actionType = {
            "id": dateType,
            "infoType": infoType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "serverId": PlatConst.zoneId,
            "serverName": PlatConst.zoneName,
            "vip": PlatConst.vipLevel.toString(),
            "balance": "0",
            "partyName": "无帮派",
            "createRoleTime": new Date().toString(),
            "roleUpLevelTime": new Date().toString(),
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    HyApkPlatform.prototype.WXattention = function () {
    };
    HyApkPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    HyApkPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return HyApkPlatform;
}());
__reflect(HyApkPlatform.prototype, "HyApkPlatform", ["Platform"]);
//九紫Apk(重写三国志)
var JzApk2Platform = (function () {
    function JzApk2Platform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    JzApk2Platform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    JzApk2Platform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.channelId = 511;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        });
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    JzApk2Platform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: PlatConst.token,
                        qyChannelId: "511",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 511;
                    LoginManager.runGame();
                }
                return [2 /*return*/];
            });
        });
    };
    JzApk2Platform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    JzApk2Platform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    JzApk2Platform.prototype.share = function (data) {
    };
    JzApk2Platform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, callbackinfo, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString() + "~uid=" + PlatConst.platformUid.toString() + "~" + "sid=" + PlatConst.zoneId.toString() + "~" + "cp_orderid=" + orderNo.toString();
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "role_id": PlatConst.playerId.toString(),
                    "palyerName": PlatConst.nickName,
                    "serverName": PlatConst.zoneName,
                    "roleLevel": PlatConst.level,
                    "serverId": PlatConst.zoneId.toString(),
                    "cpOderId": orderNo.toString(),
                    "ratio": 10,
                    "callbackinfo": callbackinfo,
                    "goods": name,
                    "money": amount,
                    "shopId": shopId.toString(),
                    "vipLevel": PlatConst.vipLevel.toString(),
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    JzApk2Platform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    JzApk2Platform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    JzApk2Platform.prototype.reportData = function (dateType) {
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "ServerId": PlatConst.zoneId.toString(),
            "ServerName": PlatConst.zoneName,
            "RoleVipLv": PlatConst.vipLevel.toString(),
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    JzApk2Platform.prototype.WXattention = function () {
    };
    JzApk2Platform.prototype.isHidePayFunc = function () {
        return false;
    };
    JzApk2Platform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return JzApk2Platform;
}());
__reflect(JzApk2Platform.prototype, "JzApk2Platform", ["Platform"]);
//拇指游玩IOS
var MzywIosPlatform = (function () {
    function MzywIosPlatform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    MzywIosPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    MzywIosPlatform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.channelId = 509;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        }.bind(this));
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    MzywIosPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: "",
                        qyChannelId: "509",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 509;
                    LoginManager.runGame();
                }
                return [2 /*return*/];
            });
        });
    };
    MzywIosPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    MzywIosPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    MzywIosPlatform.prototype.share = function (data) {
    };
    MzywIosPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "role_id": PlatConst.playerId.toString(),
                    "palyerName": PlatConst.nickName,
                    "serverName": PlatConst.zoneName,
                    "roleLevel": PlatConst.level,
                    "serverId": PlatConst.zoneId.toString(),
                    "cpOderId": orderNo.toString(),
                    "ratio": 10,
                    "cp_verify_host": "",
                    "goods": name,
                    "money": amount,
                    "shopId": shopId,
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    MzywIosPlatform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    MzywIosPlatform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    MzywIosPlatform.prototype.reportData = function (dateType) {
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "ServerId": PlatConst.zoneId.toString(),
            "ServerName": PlatConst.zoneName,
            "RoleVipLv": PlatConst.vipLevel.toString(),
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    MzywIosPlatform.prototype.WXattention = function () {
    };
    MzywIosPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    MzywIosPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return MzywIosPlatform;
}());
__reflect(MzywIosPlatform.prototype, "MzywIosPlatform", ["Platform"]);
//九紫Apk(挂机三国志BT版)
var JzApk4Platform = (function () {
    function JzApk4Platform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    JzApk4Platform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    JzApk4Platform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.channelId = 513;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        });
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    JzApk4Platform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: PlatConst.token,
                        qyChannelId: "513",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 513;
                    LoginManager.runGame();
                }
                return [2 /*return*/];
            });
        });
    };
    JzApk4Platform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    JzApk4Platform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    JzApk4Platform.prototype.share = function (data) {
    };
    JzApk4Platform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, callbackinfo, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString() + "~uid=" + PlatConst.platformUid.toString() + "~" + "sid=" + PlatConst.zoneId.toString() + "~" + "cp_orderid=" + orderNo.toString();
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "role_id": PlatConst.playerId.toString(),
                    "palyerName": PlatConst.nickName,
                    "serverName": PlatConst.zoneName,
                    "roleLevel": PlatConst.level,
                    "serverId": PlatConst.zoneId.toString(),
                    "cpOderId": orderNo.toString(),
                    "ratio": 10,
                    "callbackinfo": callbackinfo,
                    "goods": name,
                    "money": amount,
                    "shopId": shopId.toString(),
                    "vipLevel": PlatConst.vipLevel.toString(),
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    JzApk4Platform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    JzApk4Platform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    JzApk4Platform.prototype.reportData = function (dateType) {
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "ServerId": PlatConst.zoneId.toString(),
            "ServerName": PlatConst.zoneName,
            "RoleVipLv": PlatConst.vipLevel.toString(),
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    JzApk4Platform.prototype.WXattention = function () {
    };
    JzApk4Platform.prototype.isHidePayFunc = function () {
        return false;
    };
    JzApk4Platform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return JzApk4Platform;
}());
__reflect(JzApk4Platform.prototype, "JzApk4Platform", ["Platform"]);
//九紫Apk
var JzApkPlatform = (function () {
    function JzApkPlatform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    JzApkPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    JzApkPlatform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.channelId = 510;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        });
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    JzApkPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: PlatConst.token,
                        qyChannelId: "510",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 510;
                    LoginManager.runGame();
                }
                return [2 /*return*/];
            });
        });
    };
    JzApkPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    JzApkPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    JzApkPlatform.prototype.share = function (data) {
    };
    JzApkPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, callbackinfo, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString() + "~uid=" + PlatConst.platformUid.toString() + "~" + "sid=" + PlatConst.zoneId.toString() + "~" + "cp_orderid=" + orderNo.toString();
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "role_id": PlatConst.playerId.toString(),
                    "palyerName": PlatConst.nickName,
                    "serverName": PlatConst.zoneName,
                    "roleLevel": PlatConst.level,
                    "serverId": PlatConst.zoneId.toString(),
                    "cpOderId": orderNo.toString(),
                    "ratio": 10,
                    "callbackinfo": callbackinfo,
                    "goods": name,
                    "money": amount,
                    "shopId": shopId.toString(),
                    "vipLevel": PlatConst.vipLevel.toString(),
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    JzApkPlatform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    JzApkPlatform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    JzApkPlatform.prototype.reportData = function (dateType) {
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "ServerId": PlatConst.zoneId.toString(),
            "ServerName": PlatConst.zoneName,
            "RoleVipLv": PlatConst.vipLevel.toString(),
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    JzApkPlatform.prototype.WXattention = function () {
    };
    JzApkPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    JzApkPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return JzApkPlatform;
}());
__reflect(JzApkPlatform.prototype, "JzApkPlatform", ["Platform"]);
//九紫H5
var JzH5Platform = (function () {
    function JzH5Platform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
        this.m_ggid = "";
        this.m_ggkey = "";
        this.m_jzdata = "";
        this.m_ver = "";
        this.isClickLogin = false;
    }
    JzH5Platform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    JzH5Platform.prototype.initPlatform = function () {
        //ggid=游戏id&ggkey=游戏key&ctype=渠道&devidfa=设备idfa&guid=玩家id&username=玩家昵称&token=玩家登录标识
        var info = PlatConst.getUrlGet();
        PlatConst.platformUid = info["uid"];
        PlatConst.platformUsername = info["username"];
        this.m_ggid = info["ggid"];
        this.m_token = info["token"];
        this.m_ggkey = info["ggkey"];
        this.m_jzdata = info["jzdata"];
        this.m_ver = info["ver"];
        var options = {
            'gid': this.m_ggid,
            'Key': this.m_ggkey,
            'ver': this.m_ver,
        };
        window['h5sdk'] = new window['H5SDK'](options);
    };
    JzH5Platform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                actionType = {
                    "channel_id": "514",
                    "access_token": this.m_token,
                    "uid": PlatConst.platformUid.toString(),
                    "type": "login_sign",
                };
                Mini.HttpClient.get(function (data) {
                    if (data == '0') {
                        // PlatConst.platformUid = 0;
                        // PlatConst.platformUsername = "";
                        PlatConst.token = JSON.stringify({
                            username: "",
                            uid: "",
                            qyChannelId: "514",
                            type: "login",
                            token: PlatConst.platformUid.toString()
                        });
                        PlatConst.channelId = 514;
                        LoginManager.runGame();
                    }
                    else {
                        console.log("登录失败：" + data.msg);
                    }
                }, this, "code=18&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl);
                return [2 /*return*/];
            });
        });
    };
    JzH5Platform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    JzH5Platform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    JzH5Platform.prototype.share = function (data) {
    };
    JzH5Platform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, callbackjson, count, describe, name;
            return __generator(this, function (_a) {
                amount = price;
                callbackjson = {
                    "rolename": PlatConst.nickName,
                    "roleid": PlatConst.playerId.toString(),
                    "productId": shopId.toString(),
                    "cp_orderid": orderNo.toString(),
                };
                count = 0;
                describe = shopName;
                name = shopName;
                window['h5sdk'].pay(this.m_ggid, this.m_ggkey, this.m_token, amount.toString(), PlatConst.platformUid.toString(), PlatConst.platformUsername, PlatConst.level.toString(), PlatConst.playerId.toString(), PlatConst.nickName, PlatConst.zoneId, JSON.stringify(callbackjson), this.m_jzdata, function () {
                    console.log("充值完成");
                });
                return [2 /*return*/];
            });
        });
    };
    JzH5Platform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    JzH5Platform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    JzH5Platform.prototype.reportData = function (dateType) {
        window['h5sdk'].reportRoleInfo(this.m_ggid, this.m_ggkey, this.m_token, PlatConst.platformUsername, PlatConst.platformUid.toString(), PlatConst.zoneId.toString(), PlatConst.level.toString(), PlatConst.playerId.toString(), PlatConst.nickName, this.m_jzdata, 
        //上传成功后的回调
        function (successData) {
            console.log(successData);
        }, 
        //上传失败后的回调
        function (errorData) {
            alert(JSON.stringify(errorData));
        });
    };
    JzH5Platform.prototype.WXattention = function () {
    };
    JzH5Platform.prototype.isHidePayFunc = function () {
        return false;
    };
    JzH5Platform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return JzH5Platform;
}());
__reflect(JzH5Platform.prototype, "JzH5Platform", ["Platform"]);
//魔乐
var MoLePlatform = (function () {
    function MoLePlatform() {
        this.m_httpServerUrl2 = "https://h5.373yx.com/sdk/SdkSendData";
        this.m_token = "";
    }
    MoLePlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    MoLePlatform.prototype.initPlatform = function () {
    };
    MoLePlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window['Hyh5sdk'].login(function (data) {
                    if (data.data && data.data.token) {
                        this.m_token = data.data.token;
                        var token = data.data.token;
                        // PlatConst.platformUid = 0;
                        PlatConst.platformUsername = "";
                        PlatConst.token = JSON.stringify({
                            username: "",
                            uid: "",
                            qyChannelId: "501",
                            type: "login",
                            token: data.data.token
                        });
                        PlatConst.channelId = 501;
                        LoginManager.runGame();
                    }
                    else {
                        // 未知错误
                        console.log("错误码：" + data.code);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    MoLePlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    MoLePlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    MoLePlatform.prototype.share = function (data) {
        window['Hyh5sdk'].share(function (data) {
            if (data.code === 0) {
                console.log("分享成功");
            }
            else {
                console.log("分享失败：" + data.data.msg);
            }
        });
    };
    MoLePlatform.prototype.loginGame = function (uid, token, channelId, username) {
    };
    MoLePlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var callbackinfo, amount, md5Obj, actionType;
            return __generator(this, function (_a) {
                callbackinfo = "rolename=" + PlatConst.nickName + "~" + "sid=" + PlatConst.zoneId.toString() + "~" + "productid=" + shopId.toString();
                amount = price;
                md5Obj = new md5();
                actionType = {
                    "channel_id": "501",
                    "amount": amount,
                    "callbackinfo": callbackinfo,
                    "cp_order_id": orderNo.toString(),
                    "role_id": PlatConst.playerId.toString(),
                    "role_name": PlatConst.nickName,
                    "user_id": PlatConst.platformUid.toString(),
                    "type": "getpay",
                };
                Mini.HttpClient.get(function (data) {
                    // Utils.open_view(TASK_UI.COM_HELP_DOC, {content:data,title:GCode(CLEnum.WOR_HELP_TITLE)});
                    window['Hyh5sdk'].pay(JSON.parse(data), function (data) {
                        if (data.code !== 0) {
                            console.log("充值失败 :" + data.code);
                        }
                        else {
                            console.log("充值成功");
                        }
                    });
                }, this, "code=2&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl2);
                return [2 /*return*/];
            });
        });
    };
    MoLePlatform.prototype.reportRegister = function () {
        var actionType = {
            "channel_id": "501",
            "server_id": PlatConst.zoneId.toString(),
            "role_id": PlatConst.playerId.toString(),
            "role_level": PlatConst.level.toString(),
            "role_name": PlatConst.nickName,
            "token": PlatConst.token,
            "user_id": PlatConst.platformUid.toString(),
            "type": "sendrole",
        };
        Mini.HttpClient.get(function () {
        }, this, "code=1&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl2);
    };
    MoLePlatform.prototype.reportLogin = function () {
        // this.reportRegister();
    };
    MoLePlatform.prototype.reportData = function (dateType) {
    };
    MoLePlatform.prototype.WXattention = function () {
        window["Hyh5sdk"].subscribe(function (data) {
            if (data.code === 0) {
                // 关注成功，处理逻辑...
                // TODO
                console.log("关注成功");
            }
            else {
                // 未知错误
                // 错误消息: data.data.msg
                console.log("关注失败：" + data.data.msg);
            }
        });
    };
    MoLePlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    MoLePlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return MoLePlatform;
}());
__reflect(MoLePlatform.prototype, "MoLePlatform", ["Platform"]);
//拇指游玩全资源Apk
var MzywAllApkPlatform = (function () {
    function MzywAllApkPlatform() {
        this.m_httpServerUrl = "https://h5.373yx.com/sdk/SdkSendData";
        this.isClickLogin = false;
    }
    MzywAllApkPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    MzywAllApkPlatform.prototype.initPlatform = function () {
        egret.ExternalInterface.addCallback("sendToJS", function (message) {
            console.log("message form native : " + message); //message form native : message from native
            var data = JSON.parse(message);
            if (data.type == "login") {
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.channelId = 506;
                if (this.isClickLogin) {
                    this.login();
                }
            }
        });
        var actionType = {
            "type": "init"
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    };
    MzywAllApkPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionType;
            return __generator(this, function (_a) {
                if (PlatConst.platformUid == "") {
                    actionType = {
                        "type": "init"
                    };
                    egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                    this.isClickLogin = true;
                    return [2 /*return*/];
                }
                else {
                    this.isClickLogin = false;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username: "",
                        uid: "",
                        qyChannelId: "506",
                        type: "login",
                        token: PlatConst.platformUid.toString()
                    });
                    PlatConst.channelId = 506;
                    LoginManager.runGame();
                }
                return [2 /*return*/];
            });
        });
    };
    MzywAllApkPlatform.prototype.loginCallback = function (isp, param) {
        var obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    };
    MzywAllApkPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**分享 */
    MzywAllApkPlatform.prototype.share = function (data) {
    };
    MzywAllApkPlatform.prototype.pay = function (orderNo, shopId, shopName, price) {
        return __awaiter(this, void 0, void 0, function () {
            var amount, count, describe, name, actionType;
            return __generator(this, function (_a) {
                amount = price;
                count = 0;
                describe = shopName;
                name = shopName;
                actionType = {
                    "role_id": PlatConst.playerId.toString(),
                    "palyerName": PlatConst.nickName,
                    "serverName": PlatConst.zoneName,
                    "roleLevel": PlatConst.level,
                    "serverId": PlatConst.zoneId.toString(),
                    "cpOderId": orderNo.toString(),
                    "ratio": 10,
                    "cp_verify_host": "",
                    "goods": name,
                    "money": amount,
                    "type": "pay"
                };
                egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
                console.log('---测试onClickbuy:' + JSON.stringify(actionType));
                return [2 /*return*/];
            });
        });
    };
    MzywAllApkPlatform.prototype.reportRegister = function () {
        platform.reportData(ReportType.createRole);
    };
    MzywAllApkPlatform.prototype.reportLogin = function () {
        platform.reportData(ReportType.enterServer);
    };
    MzywAllApkPlatform.prototype.reportData = function (dateType) {
        var actionType = {
            "id": dateType,
            "roleId": PlatConst.playerId.toString(),
            "roleName": PlatConst.nickName,
            "roleLevel": PlatConst.level.toString(),
            "ServerId": PlatConst.zoneId.toString(),
            "ServerName": PlatConst.zoneName,
            "RoleVipLv": PlatConst.vipLevel.toString(),
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",
            "type": dateType
        };
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType, '  ---测试onClickbuy:' + JSON.stringify(actionType));
    };
    MzywAllApkPlatform.prototype.WXattention = function () {
    };
    MzywAllApkPlatform.prototype.isHidePayFunc = function () {
        return false;
    };
    MzywAllApkPlatform.prototype.isMsgCheckFunc = function (msg, callback, target) {
        callback.call(target, true);
    };
    return MzywAllApkPlatform;
}());
__reflect(MzywAllApkPlatform.prototype, "MzywAllApkPlatform", ["Platform"]);
/**点击缩放 */
var TOUCH_SCALE_XY = 0.95;
/**点击缩放间隔 */
var TOUCH_SCALE_DEALY = 90;
var CONTENT_HEIGHT = 750;
var CONTENT_WIDTH = 1334;
var DEFAULT_VIEW_W = 750;
var DEFAULT_VIEW_H = 674;
// 750*734 
var ServerList = (function () {
    function ServerList() {
    }
    /**服务器列表初始化 */
    ServerList.initServerList = function (call, thisObj) {
        this.m_pCall = call;
        this.m_pCallObj = thisObj;
        this.load();
    };
    ServerList.load = function () {
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
        var request = new egret.URLRequest(GameConfig.getServerListUrl());
        request.requestHeaders = [new egret.URLRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")];
        loader.load(request);
    };
    ServerList.onLoadError = function (event) {
        LoginManager.showConfirmPop("服务器列表下载失败，请检查网络情况！", this.load, this);
    };
    ServerList.onLoadComplete = function (event) {
        this.SERVER_INIT_SUCCESS = true;
        var loader = event.target;
        var serverRequest = loader.data;
        var list = JSON.parse(serverRequest);
        this.m_pDatas = [];
        for (var i = 0; i < list.length; i++) {
            this.m_pDatas.push(list[i]);
        }
        console.log('获取服务器列表:', this.m_pDatas);
        if (this.m_pCall) {
            this.m_pCall.call(this.m_pCallObj);
        }
        this.m_pCall = null;
        this.m_pCallObj = null;
    };
    ServerList.getDataByIndex = function (id) {
        // if(index >= this.m_pDatas.length) index = 0;
        for (var _i = 0, _a = this.m_pDatas; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.id == id) {
                return data;
            }
        }
        return this.m_pDatas[this.m_pDatas.length - 1];
    };
    ServerList.getDatas = function () {
        return this.m_pDatas;
    };
    ServerList.getRecommendServerIndex = function () {
        for (var _i = 0, _a = this.m_pDatas; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.rec == 1) {
                return data.id;
            }
        }
        return 0;
    };
    /**服务器下载列表成功标记 */
    ServerList.SERVER_INIT_SUCCESS = false;
    return ServerList;
}());
__reflect(ServerList.prototype, "ServerList");
/**
 *
 * @author
 *
 */
var Mini;
(function (Mini) {
    var HttpClient = (function () {
        // public static serverUrl: string;
        function HttpClient() {
        }
        HttpClient.prototype.paramsBuilder = function (data) {
            var params = [];
            if (typeof (data) == 'object') {
                var key;
                for (key in data) {
                    params.push(key + '=' + data[key]);
                }
                return params.join('&');
            }
            else if (typeof (data) == 'string') {
                return data;
            }
            return '';
        };
        HttpClient.prototype.send = function (method, callback, target, data, url) {
            //zb
            this.returnFunc = callback;
            this.target = target;
            this.request = new egret.HttpRequest();
            var req = this.request;
            var params = this.paramsBuilder(data);
            var server_url = url;
            if (method == egret.HttpMethod.POST) {
                req.setRequestHeader("Content-Type", "application/json");
            }
            else {
                // req.setRequestHeader("Content-Type", "application/json");
                server_url += '?' + params; //'?' + 
                params = '';
            }
            console.log(server_url);
            req.responseType = egret.HttpResponseType.TEXT;
            req.open(server_url, method);
            req.send(data);
            req.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            req.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
            req.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
        };
        HttpClient.prototype.onGetComplete = function (event) {
            var request = event.currentTarget;
            var data = this.responseType == 'JSON' ? JSON.parse(request.response) : request.response;
            if (this.returnFunc != null) {
                this.returnFunc.call(this.target, data);
            }
            this.destory();
        };
        HttpClient.prototype.onGetIOError = function (event) {
            console.log("get error : " + event);
            this.destory();
        };
        HttpClient.prototype.onGetProgress = function (event) {
            console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        };
        HttpClient.prototype.destory = function () {
            var req = this.request;
            req.removeEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            req.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
            req.removeEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
            this.returnFunc = null;
            this.request = null;
        };
        HttpClient.get = function (callback, target, data, url) {
            var client = new HttpClient();
            // client.responseType = responseType;
            client.send(egret.HttpMethod.GET, callback, target, data, url);
            // console.log(data);
        };
        HttpClient.post = function (callback, target, data, url) {
            var client = new HttpClient();
            // client.responseType = responseType;
            client.send(egret.HttpMethod.POST, callback, target, data, url);
        };
        return HttpClient;
    }());
    Mini.HttpClient = HttpClient;
    __reflect(HttpClient.prototype, "Mini.HttpClient");
})(Mini || (Mini = {}));
PlatConst.platform = Number($Platform);
if (!window.platform) {
    if (PlatConst.platform == PlatEnum.TS_WEIDUAN) {
        window.platform = new TSWeiduanPlatform();
    }
    else if (PlatConst.platform == PlatEnum.MOLE_WEB) {
        window.platform = new MoLePlatform();
    }
    else if (PlatConst.platform == PlatEnum.QUNHEI_WEB) {
        window.platform = new QunHeiPlatform();
    }
    else if (PlatConst.platform == PlatEnum.MZYW_WEB) {
        window.platform = new MzywPlatform();
    }
    else if (PlatConst.platform == PlatEnum.DDT_WEB) {
        window.platform = new DdtPlatform();
    }
    else if (PlatConst.platform == PlatEnum.DDT_WE_CHAT) {
        window.platform = new DdtWxPlatform();
    }
    else if (PlatConst.platform == PlatEnum.MZYW_ALL_APK) {
        window.platform = new MzywAllApkPlatform();
    }
    else if (PlatConst.platform == PlatEnum.ZSY_WEB) {
        window.platform = new ZsyPlatform();
    }
    else if (PlatConst.platform == PlatEnum.ZSY_WE_CHAT) {
        window.platform = new ZsyWxPlatform();
    }
    else if (PlatConst.platform == PlatEnum.MZYW_IOS) {
        window.platform = new MzywIosPlatform();
    }
    else if (PlatConst.platform == PlatEnum.JZ_APK) {
        window.platform = new JzApkPlatform();
    }
    else if (PlatConst.platform == PlatEnum.JZ_APK2) {
        window.platform = new JzApk2Platform();
    }
    else if (PlatConst.platform == PlatEnum.JZ_APK3) {
        window.platform = new JzApk3Platform();
    }
    else if (PlatConst.platform == PlatEnum.JZ_APK4) {
        window.platform = new JzApk4Platform();
    }
    else if (PlatConst.platform == PlatEnum.JZ_H5) {
        window.platform = new JzH5Platform();
    }
    else if (PlatConst.platform == PlatEnum.HY_APK) {
        window.platform = new HyApkPlatform();
    }
    else {
        window.platform = new DebugPlatform();
    }
    window.platform.initPlatform();
}
var Mini;
(function (Mini) {
    var BitmapMovie = (function (_super) {
        __extends(BitmapMovie, _super);
        function BitmapMovie() {
            var _this = _super.call(this) || this;
            /**纹理列表 */
            _this.textureList = [];
            /**当前播放帧数 第一帧从1开始 */
            _this.curFrame = 0;
            /**播放延迟 */
            _this._delay = 1000 / 8;
            /**循环次数 */
            _this.loop = 0;
            return _this;
        }
        BitmapMovie.prototype.onDestroy = function () {
            this.stopTimer();
            this.textureList = null;
        };
        /**
         * 使用整张序列图初始化
         * @srcBm 源图
         * @maxRow 有几行
         * @maxCol 有几列
         * @startPos 从第几张位置开始切(包含该位置)
         * @pieceNum 切多少张
         * @width tile宽度
         * @height tile高度
         */
        BitmapMovie.prototype.initByBitmap = function (srcBm, maxRow, maxCol, startPos, pieceNum, width, height) {
            this.textureList = CutImgTool.cutTile(srcBm, maxRow, maxCol, startPos, pieceNum, width, height);
            if (this.textureList && this.textureList.length > 0) {
                this.texture = this.textureList[0];
                this.curFrame = 0;
                this.totalFrame = this.textureList.length;
            }
        };
        /**
         * 播放
         * @loop 循环次数
         */
        BitmapMovie.prototype.play = function (loop) {
            if (loop === void 0) { loop = 0; }
            this.loop = loop;
            this.startTimer();
        };
        /**
         * 停止播放
         */
        BitmapMovie.prototype.stop = function () {
            this.stopTimer();
        };
        /**
         * 跳转播放
         * @frame 播放的起始帧
         * @loop 循环次数
         */
        BitmapMovie.prototype.gotoAndPlay = function (frame, loop) {
            if (loop === void 0) { loop = 0; }
            if (frame <= this.totalFrame) {
                this.loop = loop;
                this.curFrame = frame;
                this.texture = this.textureList[frame - 1];
                this.startTimer();
            }
            else {
                console.error("BitmapMovie >> frame超出范围");
            }
        };
        /**
         * 跳转停止
         * @frame 停止的帧
         */
        BitmapMovie.prototype.gotoAndStop = function (frame) {
            if (frame <= this.totalFrame) {
                this.stopTimer();
                this.curFrame = frame;
                this.texture = this.textureList[frame - 1];
            }
            else {
                console.error("BitmapMovie >> frame超出范围");
            }
        };
        //启动计时器
        BitmapMovie.prototype.startTimer = function () {
            this.timer || (this.timer = new egret.Timer(this.delay));
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
            this.timer.reset();
            this.timer.start();
        };
        //计时处理
        BitmapMovie.prototype.onTimerHandler = function () {
            this.curFrame++;
            if (this.curFrame <= this.totalFrame) {
                this.texture = this.textureList[this.curFrame - 1];
            }
            else {
                this.loop--;
                this.dispatchEvent(new egret.Event(egret.Event.LOOP_COMPLETE));
                if (this.loop > 0) {
                    this.curFrame = 1;
                    this.texture = this.textureList[this.curFrame - 1];
                }
                else {
                    this.stopTimer();
                    this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                }
            }
        };
        //停止计时
        BitmapMovie.prototype.stopTimer = function () {
            if (this.timer) {
                this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
                this.timer.stop();
            }
        };
        Object.defineProperty(BitmapMovie.prototype, "delay", {
            //延迟
            get: function () {
                return this._delay;
            },
            //延迟
            set: function (value) {
                this._delay = value;
                if (this.timer) {
                    this.timer.delay = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return BitmapMovie;
    }(eui.Image));
    Mini.BitmapMovie = BitmapMovie;
    __reflect(BitmapMovie.prototype, "Mini.BitmapMovie");
    var CutImgTool = (function () {
        function CutImgTool() {
        }
        /**
         * 切图
         * @srcBm 源图
         * @maxRow 有几行
         * @maxCol 有几列
         * @startPos 从第几张位置开始切(包含该位置)
         * @pieceNum 切多少张
         * @width tile宽度
         * @height tile高度
         * @returns 返回切割的纹理列表
         */
        CutImgTool.cutTile = function (srcBm, maxRow, maxCol, startPos, pieceNum, width, height) {
            var rect = new egret.Rectangle(); //切割矩形区域
            var cutCount = 0; //当前已切割多少块
            var textureList = []; //保存切割的纹理
            for (var i = 0; i < maxRow; i++) {
                for (var j = 0; j < maxCol; j++) {
                    //>=起始位置，并且<=切割数量
                    if ((i * maxCol + j >= startPos) && cutCount <= pieceNum) {
                        var renderTexture = new egret.RenderTexture();
                        rect.x = j * width;
                        rect.y = i * height;
                        rect.width = width;
                        rect.height = height;
                        if (renderTexture.drawToTexture(srcBm, rect) == false) {
                            console.error("CutImgTool >> cut error");
                            return null;
                        }
                        else {
                            textureList.push(renderTexture);
                            cutCount++;
                        }
                    }
                    else {
                        return textureList;
                    }
                }
            }
            return textureList;
        };
        return CutImgTool;
    }());
    __reflect(CutImgTool.prototype, "CutImgTool");
})(Mini || (Mini = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var ThemeAdapter = (function () {
    function ThemeAdapter() {
    }
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param onError 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    ThemeAdapter.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
        function onResGet(e) {
            onSuccess.call(thisObject, e);
        }
        function onResError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                onError.call(thisObject);
            }
        }
        if (typeof generateEUI !== 'undefined') {
            egret.callLater(function () {
                onSuccess.call(thisObject, generateEUI);
            }, this);
        }
        else {
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
            RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
        }
    };
    return ThemeAdapter;
}());
__reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);
var ClientConfig = (function () {
    function ClientConfig() {
    }
    /**配置初始化 */
    ClientConfig.setup = function (call, thisObj) {
        this.m_pCall = call;
        this.m_pCallObj = thisObj;
        this.m_loader = new egret.URLLoader();
        this.m_loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        this.m_loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        //加载地址配置
        this.load(GameConfig.getClientConfigUrl());
    };
    ClientConfig.load = function (resUrl) {
        var request = new egret.URLRequest(resUrl);
        this.m_loader.load(request);
    };
    ClientConfig.onLoadComplete = function (event) {
        var loader = event.target;
        var jsonStr = loader.data;
        // jsonStr = jsonStr.replace(/(\/\/).*/g, '');
        var config = JSON.parse(jsonStr);
        GameConfig.version = config['version'];
        this.m_loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        //配置加载完毕
        if (this.m_pCall) {
            this.m_pCall.call(this.m_pCallObj);
            this.m_pCall = null;
            this.m_pCallObj = null;
        }
    };
    return ClientConfig;
}());
__reflect(ClientConfig.prototype, "ClientConfig");
window["Mini"] = Mini;
window["LoginConst"] = LoginConst;
window["md5"] = md5;
window["ClientConfig"] = ClientConfig;
window["GameConfig"] = GameConfig;
window["BattleQualityEnum"] = BattleQualityEnum;
window["LocalData"] = LocalData;
window["PlatConst"] = PlatConst;
window["IPSeEnum"] = IPSeEnum;
window["LoginManager"] = LoginManager;
window["ReportType"] = ReportType;
var Mini;
(function (Mini) {
    /**确认弹窗 */
    var ConfirmPop = (function (_super) {
        __extends(ConfirmPop, _super);
        function ConfirmPop(tips, confirm, thisArg) {
            var _this = _super.call(this) || this;
            _this.m_callbackConfirm = confirm;
            _this.m_thisArg = thisArg;
            _this.m_sTips = tips;
            _this.width = GameConfig.curWidth();
            _this.height = GameConfig.curHeight();
            return _this;
        }
        ConfirmPop.prototype.onDestroy = function () {
            this.m_callbackConfirm = null;
            this.m_thisArg = null;
            this.m_sTips = null;
            _super.prototype.onDestroy.call(this);
        };
        ConfirmPop.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.setSize(560, 360);
            this.setTitle('提 示');
            var desc = new eui.Label(this.m_sTips);
            desc.size = 24;
            desc.width = 450;
            desc.textAlign = 'center';
            desc.textColor = 0x8a8a9e;
            desc.verticalCenter = -52;
            this.m_pRoot.addChild(desc);
        };
        ConfirmPop.prototype.onConfirmClick = function () {
            var func = this.m_callbackConfirm;
            var obj = this.m_thisArg;
            this.onDestroy();
            if (func && obj) {
                func.call(obj);
            }
        };
        ConfirmPop.instance = null;
        return ConfirmPop;
    }(Mini.CMaskWnd));
    Mini.ConfirmPop = ConfirmPop;
    __reflect(ConfirmPop.prototype, "Mini.ConfirmPop");
})(Mini || (Mini = {}));
var Mini;
(function (Mini) {
    var LoginNoticeWnd = (function (_super) {
        __extends(LoginNoticeWnd, _super);
        function LoginNoticeWnd(notice) {
            var _this = _super.call(this) || this;
            _this.m_sNotice = notice;
            return _this;
        }
        LoginNoticeWnd.prototype.onDestroy = function () {
            if (this.m_loader) {
                this.m_loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
                this.m_loader = null;
            }
            _super.prototype.onDestroy.call(this);
        };
        LoginNoticeWnd.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.setTitle('公 告');
            this.setSize(1044, 600);
            var scroll = new eui.Scroller();
            scroll.width = 986;
            scroll.height = 468;
            scroll.y = 91;
            scroll.horizontalCenter = 0;
            this.m_pRoot.addChild(scroll);
            var group = new eui.Group();
            scroll.addChild(group);
            scroll.viewport = group;
            this.m_labDes = new eui.Label();
            this.m_labDes.size = 26;
            this.m_labDes.width = 986;
            this.m_labDes.textColor = 0xaac7ff;
            this.m_labDes.lineSpacing = 10;
            this.m_labDes.touchEnabled = false;
            group.addChild(this.m_labDes);
            if (this.m_sNotice) {
                this.m_labDes.textFlow = new egret.HtmlTextParser().parser(this.m_sNotice);
            }
            else {
                this.m_loader = new egret.URLLoader();
                this.m_loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                this.m_loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
                var request = new egret.URLRequest(GameConfig.getNoticeUrl());
                this.m_loader.load(request);
            }
        };
        LoginNoticeWnd.prototype.onLoadComplete = function (event) {
            var loader = event.target;
            var noticeStr = loader.data;
            this.m_labDes.textFlow = new egret.HtmlTextParser().parser(noticeStr);
        };
        return LoginNoticeWnd;
    }(Mini.CMaskWnd));
    Mini.LoginNoticeWnd = LoginNoticeWnd;
    __reflect(LoginNoticeWnd.prototype, "Mini.LoginNoticeWnd");
})(Mini || (Mini = {}));
var Mini;
(function (Mini) {
    var LoginServerList = (function (_super) {
        __extends(LoginServerList, _super);
        function LoginServerList() {
            var _this = _super.call(this) || this;
            _this.width = GameConfig.curWidth();
            _this.height = GameConfig.curHeight();
            return _this;
        }
        LoginServerList.prototype.onDestroy = function () {
            this.removeEvent();
            _super.prototype.onDestroy.call(this);
        };
        LoginServerList.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.setTitle('选择服务器');
            this.setSize(847, 684);
            this.createStatusIcon(458, 1);
            this.createStatusIcon(581, 2);
            this.createStatusIcon(694, 3);
            this.m_tList = [];
            var list = ServerList.getDatas();
            list.sort(function (a, b) {
                if (a.rec)
                    return -1;
                if (b.rec)
                    return 1;
                return a.id - b.id;
            });
            this.createList('推荐服务器', list);
            this.initEvent();
        };
        /**创建标识 */
        LoginServerList.prototype.createStatusIcon = function (dx, status) {
            var label = LoginConst.createLabel('', dx + 54, 75, 24, 0xffffff);
            label.textFlow = new egret.HtmlTextParser().parser(LoginConst.getSerStateLab(status));
            this.m_pRoot.addChild(label);
            var img = LoginConst.createImage("login_status_" + status + ".png", dx + 10, 70);
            this.m_pRoot.addChild(img);
        };
        /**创建服务器列表 */
        LoginServerList.prototype.createList = function (title, list) {
            var line = LoginConst.createImage('line_1006.png', 0, 150, 847);
            this.m_pRoot.addChild(line);
            var l_line = LoginConst.createImage('line_011.png', 159, 125);
            this.m_pRoot.addChild(l_line);
            var r_line = LoginConst.createImage('line_011.png', 690, 125);
            r_line.scaleX = -1;
            this.m_pRoot.addChild(r_line);
            var labTitle = LoginConst.createLabel(title, 0, 115, 26, 0xABB7D1);
            labTitle.horizontalCenter = 0;
            this.m_pRoot.addChild(labTitle);
            var scroll = new eui.Scroller;
            scroll.x = 16;
            scroll.y = 155;
            scroll.width = 817;
            scroll.height = 520;
            this.m_pRoot.addChild(scroll);
            var euiList = new eui.List;
            euiList.dataProvider = new eui.ArrayCollection(list);
            euiList.itemRenderer = ServerItemRender;
            var layout = new eui.TileLayout();
            layout.horizontalGap = 22;
            layout.paddingLeft = 42.5;
            euiList.layout = layout;
            scroll.addChild(euiList);
            scroll.viewport = euiList;
            this.m_tList.push(euiList);
        };
        LoginServerList.prototype.initEvent = function () {
            for (var i = 0; i < this.m_tList.length; i++) {
                this.m_tList[i].addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            }
        };
        LoginServerList.prototype.removeEvent = function () {
            for (var i = 0; i < this.m_tList.length; i++) {
                this.m_tList[i].removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            }
        };
        LoginServerList.prototype.onItemSelected = function (e) {
            var data = e.item;
            if (data) {
                LoginManager.changeServerSel(data.id);
                this.onDestroy();
            }
        };
        LoginServerList.NAME = 'LoginServerList';
        return LoginServerList;
    }(Mini.CMaskWnd));
    Mini.LoginServerList = LoginServerList;
    __reflect(LoginServerList.prototype, "Mini.LoginServerList");
    var ServerItemRender = (function (_super) {
        __extends(ServerItemRender, _super);
        function ServerItemRender() {
            return _super.call(this) || this;
        }
        ServerItemRender.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            var imgBg = LoginConst.createImage('zyt_23.png');
            this.addChild(imgBg);
            this.m_imgState = LoginConst.createImage('', 295, 29);
            this.addChild(this.m_imgState);
            this.m_labName = LoginConst.createLabel('', 60, 33, 24, 0xffffff);
            this.addChild(this.m_labName);
            this.m_newImg = LoginConst.createImage('zyt_40.png', -10, -8);
            this.addChild(this.m_newImg);
            this.touchChildren = false;
        };
        ServerItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_labName.textFlow = new egret.HtmlTextParser().parser(this.m_tData.name + " " + LoginConst.getSerStateLab(this.m_tData.status));
                var status_1 = this.m_tData.status;
                if (status_1 == 4)
                    status_1 = 2; //新服 流畅服 用绿色的
                this.m_imgState.source = LoginConst.getResUrl("login_status_" + status_1 + ".png");
                if (this.m_tData.status == 4) {
                    this.m_newImg.visible = true;
                }
                else {
                    this.m_newImg.visible = false;
                }
            }
        };
        return ServerItemRender;
    }(eui.ItemRenderer));
    __reflect(ServerItemRender.prototype, "ServerItemRender");
})(Mini || (Mini = {}));
var Mini;
(function (Mini) {
    var LoginScene = (function (_super) {
        __extends(LoginScene, _super);
        function LoginScene() {
            var _this = _super.call(this) || this;
            _this.width = GameConfig.curWidth();
            _this.height = GameConfig.curHeight();
            return _this;
        }
        LoginScene.prototype.onDestroy = function () {
            this.removeEvent();
            egret.Tween.removeTweens(this.m_imgPro);
            if (this.m_nTimeOut)
                egret.clearTimeout(this.m_nTimeOut);
            if (this.m_btnMc) {
                this.m_btnMc.onDestroy();
                this.m_btnMc = null;
            }
            if (this.m_tipsLabs) {
                for (var i = 0; i < this.m_tipsLabs.length; i++) {
                    egret.Tween.removeTweens(this.m_tipsLabs[i]);
                }
                this.m_tipsLabs = null;
            }
            LoginManager.loginScene = null;
        };
        LoginScene.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.m_tipsLabs = [];
            //启动打点
            var isFirstLaunch = LocalData.getData('isFirstLaunch', "0");
            LocalData.setData('isFirstLaunch', "1");
            var $LoginTimestamp = (new Date()).getTime();
            if (isFirstLaunch == "0") {
                window["ta"].track('first_launch_game', { first_launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });
                console.log("###################################################################");
                console.log("游戏首次启动耗时 ： ", $LoginTimestamp - window['$Htmltimestamp'], "毫秒");
            }
            else {
                window["ta"].track('launch_game', { launch_time: ($LoginTimestamp - window['$Htmltimestamp']).toString() });
                console.log("###################################################################");
                console.log("游戏非首次启动耗时 ： ", $LoginTimestamp - window['$Htmltimestamp'], "毫秒");
            }
            this.createView();
            this.m_labVersion.text = "当前版本：" + GameConfig.version;
            this.startLogin();
            this.initEvent();
            platform.showShareMenu();
        };
        /**启动登录界面 */
        LoginScene.prototype.startLogin = function () {
            var _this = this;
            ServerList.initServerList(function () {
                _this.m_pServer.visible = true;
                //默认选最后一个服务器
                // let defId = (ServerList.getDatas().length).toString();
                var recommend = ServerList.getRecommendServerIndex();
                var saveIndex = LocalData.getData('IP_PORT', recommend + '');
                var numIndex = Number(saveIndex);
                _this.changeServerSel(numIndex);
            }, this);
            //播放背景音乐
            if (GameConfig.MusicIsPlay) {
                this.playLoginSound();
            }
            //客户端配置加载完毕
            LoginManager.startGame();
        };
        LoginScene.prototype.createView = function () {
            this.m_imgBg = LoginConst.createImage('login_bg.jpg');
            this.m_imgBg.horizontalCenter = 0;
            this.m_imgBg.verticalCenter = 0;
            var scale = Math.max(egret.MainContext.instance.stage.stageWidth / 1334, egret.MainContext.instance.stage.stageHeight / 750);
            this.m_imgBg.scaleX = scale;
            this.m_imgBg.scaleY = scale;
            this.addChild(this.m_imgBg);
            var flag = LoginConst.createImage('login_lb_qysg.png');
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
            this.m_labVersion = LoginConst.createLabel('', 0, 0, 20, 0xE9E9E6);
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
            var img = LoginConst.createImage('login_btn.png');
            this.m_btnEnter.addChild(img);
            this.createBtnEff();
            //隐藏调试入口
            if (PlatConst.isHideAccount()) {
                this.m_pAcount.visible = false;
            }
            else {
                this.m_labDebug = LoginConst.createLabel('调试', 0, 0, 30, 0xffffff, true);
                this.m_labDebug.right = 25;
                this.m_labDebug.bottom = 61;
                this.addChild(this.m_labDebug);
                LoginConst.addTouchEvent(this.m_labDebug, this.onDebug, this);
            }
        };
        /**调试回调 */
        LoginScene.prototype.onDebug = function () {
            if (!LoginManager.isCodeInit)
                return;
            var editorView = new com_main.TestSettingView();
            com_main.UpManager.popView(editorView);
        };
        /**账号 */
        LoginScene.prototype.createAcount = function () {
            this.m_pAcount = new eui.Group;
            this.m_pAcount.horizontalCenter = 0;
            this.m_pAcount.bottom = 245;
            this.addChild(this.m_pAcount);
            var imgBg = LoginConst.createImage('login_border_1005.png', 0, 0, 414, 46);
            imgBg.horizontalCenter = 0;
            this.m_pAcount.addChild(imgBg);
            var label = LoginConst.createLabel('账号', 146, 7, 30, 0xffffff);
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
        };
        /**服务器 */
        LoginScene.prototype.createServer = function () {
            this.m_pServer = new eui.Group;
            this.m_pServer.horizontalCenter = 0;
            this.m_pServer.bottom = 198;
            this.addChild(this.m_pServer);
            this.m_pServer.visible = false;
            var imgBg = LoginConst.createImage('login_border_1005.png', 0, 0, 512, 38);
            imgBg.horizontalCenter = 0;
            this.m_pServer.addChild(imgBg);
            this.m_labServer = LoginConst.createLabel('', 123, 7, 22, 0xffffff);
            this.m_pServer.addChild(this.m_labServer);
            var label = LoginConst.createLabel('点击选服', 320, 7, 22, 0xE7C772);
            this.m_pServer.addChild(label);
        };
        /**进度条 */
        LoginScene.prototype.createProcess = function () {
            var border = LoginConst.createImage('border_1019.png', null, null, this.width, 122);
            border.bottom = 0;
            this.addChild(border);
            this.m_pPro = new eui.Group;
            this.m_pPro.width = this.width;
            this.m_pPro.bottom = 0;
            this.addChild(this.m_pPro);
            this.m_pPro.visible = false;
            var imgBg = LoginConst.createImage('login_proBg_003.png', null, null, this.width);
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
        };
        /**登陆背景音效 */
        LoginScene.prototype.playLoginSound = function () {
            this.m_soundBg = new egret.Sound;
            this.m_soundBg.addEventListener(egret.Event.COMPLETE, this.onSoundComp, this);
            this.m_soundBg.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundError, this);
            this.m_soundBg.load(LoginConst.getResUrl('denglujiemian.mp3'));
        };
        /**创建按钮特效 */
        LoginScene.prototype.createBtnEff = function () {
            var _this = this;
            var imageLoader = new egret.ImageLoader();
            imageLoader.crossOrigin = "anonymous";
            imageLoader.once(egret.Event.COMPLETE, function () {
                if (_this.m_btnEnter && imageLoader.data) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(imageLoader.data);
                    var bitmap = new egret.Bitmap(texture);
                    _this.m_btnMc = new Mini.BitmapMovie();
                    _this.m_btnMc.initByBitmap(bitmap, 7, 1, 0, 7, 318, 140);
                    _this.m_btnMc.play(9999);
                    _this.m_btnMc.x = -5;
                    _this.m_btnMc.y = -15;
                    _this.m_btnMc.touchEnabled = false;
                    _this.m_btnEnter.addChild(_this.m_btnMc);
                }
            }, this);
            imageLoader.load(LoginConst.getResUrl('btnEffect.png'));
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        LoginScene.prototype.initEvent = function () {
            this.m_pServer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServerHandler, this);
            LoginConst.addTouchEvent(this.m_btnEnter, this.onBtnEnter, this);
            this.m_editLabel.addEventListener(egret.Event.CHANGE, this.onAccountChange, this);
        };
        LoginScene.prototype.removeEvent = function () {
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
        };
        /**登录输入 */
        LoginScene.prototype.onAccountChange = function (evt) {
            var input = evt.target;
            var text = this.trim(input.text); //过滤空格
            text = this.filterStr(text); //过滤特殊字符
            if (input.text == '')
                return;
            input.text = input.text;
            GameConfig.account = input.text;
            LocalData.setData('account', GameConfig.account);
        };
        /**开始游戏 */
        LoginScene.prototype.onBtnEnter = function () {
            window["ta"].track('novice_guide', { step: 10000 + "" });
            var serverId = Number(LocalData.getData('IP_PORT'));
            var serDate = ServerList.getDataByIndex(serverId);
            var serStatus = Number(serDate.status);
            if (serStatus == 3) {
                //登录公告
                this.showNoticeWnd(serDate.notice || "停服维护");
            }
            else {
                if (this.m_pAcount.visible && this.m_editLabel.text == '') {
                    this.m_editLabel.prompt = "请输入账号";
                }
                else {
                    this.login();
                }
            }
        };
        /**登录 */
        LoginScene.prototype.login = function () {
            var _this = this;
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
            this.m_nTimeOut = egret.setTimeout(function () {
                _this.m_bInEnter = false;
            }, this, 2000);
            platform.login();
        };
        /**选服点击 */
        LoginScene.prototype.onServerHandler = function () {
            this.showLoginServerList();
        };
        /**声音加载完毕 */
        LoginScene.prototype.onSoundComp = function () {
            this.m_channelBg = this.m_soundBg.play(0, 0);
        };
        /**声音加载错误 */
        LoginScene.prototype.onSoundError = function () {
            console.error("loaded error!", event);
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**显示进度条 */
        LoginScene.prototype.setProcess = function (tips, process) {
            this.m_pPro.visible = true;
            this.m_labPro.text = tips + " " + Math.floor(process) + "%";
            egret.Tween.removeTweens(this.m_imgPro);
            var tw = egret.Tween.get(this.m_imgPro);
            tw.to({ width: this.width * (process / 100) }, 100);
        };
        /**隐藏进度条 */
        LoginScene.prototype.hideProcess = function () {
            egret.Tween.removeTweens(this.m_imgPro);
            this.m_imgPro.width = 0;
            this.m_pPro.visible = false;
        };
        /**弹出提示 */
        LoginScene.prototype.showTips = function (tips) {
            var _this = this;
            var label = LoginConst.createLabel(tips, this.width * 0.5, this.height * 0.5, 30, 0xffffff);
            label.horizontalCenter = 0;
            label.alpha = 0.5;
            var tw = egret.Tween.get(label);
            tw.to({ y: label.y - 100, alpha: 1 }, 500, egret.Ease.cubicOut);
            tw.to({ alpha: 0 }, 300);
            tw.call(function () {
                if (label && label.parent) {
                    for (var i = 0; i < _this.m_tipsLabs.length; i++) {
                        if (_this.m_tipsLabs[i].hashCode == label.hashCode) {
                            _this.m_tipsLabs.splice(i, 1);
                            break;
                        }
                    }
                    label.parent.removeChild(label);
                    label = null;
                }
            }, this);
            this.m_tipsLabs.push(label);
            this.addChildAt(label, 999);
        };
        /**修改服务器选择 */
        LoginScene.prototype.changeServerSel = function (id) {
            LocalData.setData('IP_PORT', id);
            var serverData = ServerList.getDataByIndex(id);
            if (serverData.status == 4) {
                this.m_labServer.textFlow = new egret.HtmlTextParser().parser('<font color=#90FC5B>新服 </font>' + serverData.name);
            }
            else {
                this.m_labServer.text = serverData.name;
            }
            PlatConst.zoneId = serverData.id;
            PlatConst.zoneName = serverData.name;
            GameConfig.server_ip = serverData.ip;
            GameConfig.server_port = serverData.port;
        };
        /**询问框 */
        LoginScene.prototype.showConfirmPop = function (tips, callback, thisObj) {
            var view = new Mini.ConfirmPop(tips, callback, thisObj);
            this.addChildAt(view, 99);
        };
        /**显示选服菜单 */
        LoginScene.prototype.showLoginServerList = function () {
            if (!ServerList.SERVER_INIT_SUCCESS) {
                this.showTips('服务器列表未下载');
                return;
            }
            var view = new Mini.LoginServerList();
            this.addChild(view);
        };
        /**显示公告 */
        LoginScene.prototype.showNoticeWnd = function (notice) {
            var view = new Mini.LoginNoticeWnd(notice);
            this.addChild(view);
        };
        /**去除所有空格 */
        LoginScene.prototype.trim = function (str) {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            result = result.replace(/\s/g, "");
            return result;
        };
        /**
          * 过滤特殊字符
          **/
        LoginScene.prototype.filterStr = function (str) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；�：”“'。，、？%+]");
            var specialStr = "";
            for (var i = 0; i < str.length; i++) {
                specialStr += str.substr(i, 1).replace(pattern, '');
            }
            return specialStr;
        };
        /* UpManager调用接口 容错处理*/
        LoginScene.prototype.onRefresh = function () {
        };
        return LoginScene;
    }(eui.Component));
    Mini.LoginScene = LoginScene;
    __reflect(LoginScene.prototype, "Mini.LoginScene");
})(Mini || (Mini = {}));

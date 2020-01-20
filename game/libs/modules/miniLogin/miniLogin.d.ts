declare class JzApk3Platform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class LoginManager {
    static isCodeInit: boolean;
    private static stage;
    private static root;
    static loginScene: Mini.LoginScene;
    static stageWidth: number;
    static stageHeight: number;
    static setup(stage: egret.Stage, root: eui.UILayer): void;
    /**创建图片 */
    private static createWarnImg();
    /**游戏启动(配置加载完毕) */
    static startGame(): void;
    /**显示登陆确认框 */
    static showConfirmPop(tips: string, callback: Function, thisObj: any): void;
    /**初始化环境 */
    static initCode(): void;
    /**初始化游戏 */
    static initGame(): Promise<void>;
    /**加载资源配置 */
    private static loadResource();
    /**加载主题配置 */
    private static loadTheme();
    /**进入游戏 */
    static runGame(): void;
    /**唤醒 */
    static wakeupLoginScene(): void;
    /**重新进入 */
    static showLoginScene(): void;
    /**修改登录服务器 */
    static changeServerSel(id: number): void;
    /**设置加载进度 */
    static setLoadinProcess(name: string, process: number): void;
    /**设置加载进度 */
    static hideLoadinProcess(): void;
    /**简单提示*/
    static showTips(tips: string): void;
    /**=====================================================================================
     * 代码加载 begin
     * =====================================================================================
     */
    private static loaded;
    private static loadCode();
    /**zip包加载 */
    private static loadZip(url);
    /**解压zip包 */
    private static createScript(zip);
    /**加载代码 */
    private static loadScript();
    private static loadNext();
}
declare module Mini {
    class MiniMain extends eui.UILayer {
        protected createChildren(): void;
        private initConfig();
    }
}
declare var WebAudioDecode: () => void;
declare class ZsyWxPlatform implements Platform {
    private m_httpServerUrl;
    m_token: string;
    m_sign: string;
    d_platform: string;
    d_openid: string;
    d_sid: Number;
    d_appid: Number;
    d_time: string;
    d_extinfo: string;
    d_invited_role_id: string;
    d_callback_url: string;
    s_gameUID: string;
    s_channelUID: string;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    share(data: any): void;
    loginGame(uid?: string, token?: string, channelId?: string, username?: string): void;
    count: number;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    zsyReportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare enum BattleQualityEnum {
    /**高品质 */
    HIGHT = 0,
    /**低品质 */
    LOW = 1,
}
/**
  * 游戏配置文件
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved.
  * 存放游戏的配置数据
  * 比如：游戏界面尺寸、分享随机百分比、获取系统数据
  */
declare class GameConfig {
    /**账号 */
    static account: string;
    static server_ip: string;
    static server_port: number;
    static version: string;
    static isBackRun: boolean;
    static m_notchScreen: boolean;
    static notchPixel: number;
    static WH_Ratio: number;
    static CLEAR_TIME: number;
    static BTEELE_QUALITY: number;
    static MusicIsPlay: boolean;
    static EffectIsPlay: boolean;
    static bGuideIsOpen: boolean;
    static testGuideIds: string;
    static getLanUrls(): string[];
    static getConfigUrls(): string[];
    static getLanUrl(): string;
    static getConfigUrl(): string;
    /**配置文件 每次重新下载 */
    static getClientConfigUrl(): string;
    /**资源配置配置名字 */
    static getResourName(): string;
    /**皮肤配置地址 */
    static getThemeUrl(): string;
    /**服务器列表地址 */
    static getServerListUrl(): string;
    /**登录公告地址 */
    static getNoticeUrl(): string;
    /**新手录像地址 */
    static getBattleVideoUrl(): string;
    /**是否刘海屏 */
    static getIsNotchScreen(): boolean;
    /**设置是否刘海屏 */
    static setIsNotchScreen(bool: boolean): void;
    /**设置宽高比 */
    static setWHRatio(ratio: number): void;
    /**获取宽高比 */
    static getWHRatio(): number;
    /**游戏默认字体 */
    static fontDefault: string;
    static TextColors: {
        white: number;
        milkWhite: number;
        grayWhite: number;
        gray: number;
        fontWhite: number;
        yellow: number;
        lightYellow: number;
        orangeYellow: number;
        red: number;
        green: number;
        blue: number;
        grayBlue: number;
        purple: number;
        pink: number;
        black: number;
        golden: number;
        stroke: number;
        stroke2: number;
        stroke3: number;
        goldYellow: number;
        goldYellow2: number;
        quality0: number;
        quality1: number;
        quality2: number;
        quality3: number;
        quality4: number;
        quality5: number;
    };
    static LabelFontSize: {
        littleSize: number;
        middleSize: number;
        normalSize: number;
        bigSize: number;
    };
    static curStage(): egret.Stage;
    static curPanel: egret.DisplayObjectContainer;
    static curWidth(): number;
    static curHeight(): number;
    static bestScale: number;
    static initBestScale(): void;
    static getBestScale(): number;
    /**
     * 游戏资源路径 通用	/resource/
     * 游戏资源资源服务器	(微信小游戏)https://files.373yx.com/resource/resource1/
     */
    static getResRemoteUrl(isConfig?: boolean): string;
    static getSub(): number;
}
declare class ZsyPlatform implements Platform {
    private m_httpServerUrl;
    m_token: string;
    m_sign: string;
    d_platform: string;
    d_openid: string;
    d_sid: Number;
    d_appid: Number;
    d_time: string;
    d_extinfo: string;
    d_invited_role_id: string;
    d_callback_url: string;
    s_gameUID: string;
    s_channelUID: string;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    share(data: any): void;
    loginGame(uid?: string, token?: string, channelId?: string, username?: string): void;
    count: number;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    zsyReportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class LoginConst {
    static getResUrl(name: string, root?: string): string;
    /**获得浏览器类型 */
    static systemType(): string;
    static isWeiXin(): boolean;
    static platformType(): string;
    /**低画质平台 */
    static isLowMcMachine(): boolean;
    /**服务器列表 文字颜色(中文不要塞语言包 没读取) */
    static getSerStateLab(status: number): string;
    /**=====================================================================================
    * 简单ui类库 begin
    * =====================================================================================
    */
    static addTouchEvent(target: egret.DisplayObject, callBack: Function, thisObj: any): void;
    static removeTouchEvent(target: egret.DisplayObject, callBack: Function, thisObj: any): void;
    static onScaleTouch(event: egret.Event): void;
    /**创建图片 */
    static createImage(name: string, x?: number, y?: number, width?: number, height?: number, touch?: boolean): eui.Image;
    /**创建文本 */
    static createLabel(text: string, x?: number, y?: number, size?: number, color?: number, touch?: boolean): eui.Label;
}
declare class TSWeiduanPlatform implements Platform {
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
/**群黑 */
declare class QunHeiPlatform implements Platform {
    private m_httpServerUrl2;
    private time;
    private isadult;
    private qhzoneId;
    private uimg;
    private nname;
    private unid;
    private qhchannel;
    private qhchannelid;
    private showbtn;
    private flag;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare module Mini {
    class CMaskWnd extends eui.Component {
        private m_rectMask;
        protected m_pRoot: eui.Group;
        private m_imgBg;
        private m_labTitle;
        private m_imgClose;
        constructor();
        onDestroy(): void;
        protected childrenCreated(): void;
        protected setSize(width: number, heigth: number): void;
        protected setTitle(title: string): void;
        private onMaskClickListener();
    }
}
declare enum IPSeEnum {
    QI_YUAN = 0,
    TUO_SHI = 1,
    MO_LE = 2,
    QUN_HEI = 3,
    MZ_YW = 4,
    DD_T = 5,
    DDT_WX = 6,
    MZYW_APK = 7,
    ZS_Y = 8,
    J_Z = 9,
    H_Y = 10,
}
/**资源平台枚举(每个平台100个段位) */
declare enum PlatEnum {
    /**常规 */
    NORMAL = 0,
    /**微信 */
    WE_CHAT = 1,
    /**QQ */
    QQ_CHAT = 2,
    /**外网 */
    WEB = 3,
    /**拓世微端 */
    TS_WEIDUAN = 101,
    /**魔乐微信网页 */
    MOLE_WEB = 201,
    /**群黑 */
    QUNHEI_WEB = 301,
    /**拇指游玩 */
    MZYW_WEB = 401,
    /**拇指游玩IOS */
    MZYW_IOS = 402,
    /**达达兔 */
    DDT_WEB = 501,
    /**达达兔微信小游戏(每个平台100个段位 错误编号 以后不能再加) */
    DDT_WE_CHAT = 601,
    /**拇指游玩全资源端 (每个平台100个段位 错误编号 以后不能再加)*/
    MZYW_ALL_APK = 701,
    /**中手游链端 */
    ZSY_WEB = 801,
    /**中手游微信小游戏 */
    ZSY_WE_CHAT = 802,
    /**九指微端(权战三国) */
    JZ_APK = 901,
    /**九指微端(重写三国志) */
    JZ_APK2 = 902,
    /**九指微端(三国志国战版) */
    JZ_APK3 = 903,
    /**九指微端(挂机三国志BT版) */
    JZ_APK4 = 904,
    /**九指H5 */
    JZ_H5 = 905,
    /**乾游微端(权游三国) */
    HY_APK = 1001,
}
declare class ReportType {
    static levelup: string;
    static enterServer: string;
    static createRole: string;
}
declare class PlatConst {
    static zoneId: number;
    static zoneName: string;
    static channelId: number;
    static token: string;
    static timestamp: string;
    static platformId: string;
    static platformUid: string;
    static platformUsername: string;
    static platform: PlatEnum;
    static playerId: number;
    static createTimestamp: number;
    static level: number;
    static power: number;
    static vipLevel: number;
    static guildId: number;
    static guildName: string;
    static nickName: string;
    static gold: number;
    static gender: number;
    static countryId: number;
    static countryName: string;
    static norCopyId: number;
    static getIpsId(): IPSeEnum;
    /**资源sdn地址 */
    static getResRemoteUrl(isConfig?: boolean): string;
    /**低画质平台 */
    static isLowMcMachine(): boolean;
    /**是否走正常充值 */
    static isNormalPay(): boolean;
    /**是否隐藏输入账号 */
    static isHideAccount(): boolean;
    /**是否显示公告 */
    static isShowNotice(): boolean;
    /**九紫平台 */
    static isPlatJZ(): boolean;
    /**是否小程序 */
    static isWxApp(): boolean;
    /**获取网址信息 */
    static getUrlGet(): Object;
    /**是否调试平台 */
    static isDebugPlat(): boolean;
    /**支付类型(rmb 勾玉) */
    static isRmbPay(): boolean;
}
declare class LocalData {
    private static OPEN_ID;
    /**本地文件保存数据 */
    static setData(key: string, data: any): void;
    /**通过本地文件获取数据 */
    static getData(key: string, def?: string): any;
    /**移除本地文件数据 */
    static removeData(key: string): void;
    static setOpenId(openId: any): void;
    static getOpenId(): any;
}
declare class md5 {
    constructor();
    private hexcase;
    private b64pad;
    hex_md5(s: any): string;
    private b64_md5(s);
    private any_md5(s, e);
    private hex_hmac_md5(k, d);
    private b64_hmac_md5(k, d);
    private any_hmac_md5(k, d, e);
    private md5_vm_test();
    private rstr_md5(s);
    private rstr_hmac_md5(key, data);
    private rstr2hex(input);
    private rstr2b64(input);
    private rstr2any(input, encoding);
    private str2rstr_utf8(input);
    private str2rstr_utf16le(input);
    private str2rstr_utf16be(input);
    private rstr2binl(input);
    private binl2rstr(input);
    private binl_md5(x, len);
    private md5_cmn(q, a, b, x, s, t);
    private md5_ff(a, b, c, d, x, s, t);
    private md5_gg(a, b, c, d, x, s, t);
    private md5_hh(a, b, c, d, x, s, t);
    private md5_ii(a, b, c, d, x, s, t);
    private safe_add(x, y);
    private bit_rol(num, cnt);
}
declare class MzywPlatform implements Platform {
    private m_httpServerUrl;
    m_token: string;
    m_sign: string;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    share(data: any): void;
    loginGame(uid?: string, token?: string, channelId?: string, username?: string): void;
    count: number;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class DdtPlatform implements Platform {
    private m_httpServerUrl;
    m_token: string;
    m_sign: string;
    d_platform: string;
    d_openid: string;
    d_sid: Number;
    d_appid: Number;
    d_time: string;
    d_extinfo: string;
    d_invited_role_id: string;
    d_callback_url: string;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    share(data: any): void;
    loginGame(uid?: string, token?: string, channelId?: string, username?: string): void;
    count: number;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    ddtReportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class DdtWxPlatform implements Platform {
    private m_httpServerUrl;
    m_token: string;
    d_openid: string;
    d_pf_UqGatv: boolean;
    d_pf_appid: Number;
    d_pf_ver: string;
    d_time: Number;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<{}>;
    share(data: any): void;
    loginGame(uid?: string, token?: string, channelId?: string, username?: string): void;
    count: number;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    ddtReportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class DebugPlatform implements Platform {
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class HyApkPlatform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class JzApk2Platform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class MzywIosPlatform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class JzApk4Platform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class JzApkPlatform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class JzH5Platform implements Platform {
    private m_httpServerUrl;
    m_token: string;
    m_ggid: string;
    m_ggkey: string;
    m_jzdata: string;
    m_ver: string;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class MoLePlatform implements Platform {
    private m_httpServerUrl2;
    m_token: string;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    loginGame(uid?: string, token?: string, channelId?: string, username?: string): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
declare class MzywAllApkPlatform implements Platform {
    private m_httpServerUrl;
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    initPlatform(): void;
    isClickLogin: boolean;
    login(): Promise<void>;
    loginCallback(isp: number, param: string): void;
    showShareMenu(): Promise<void>;
    /**分享 */
    share(data: any): void;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<void>;
    reportRegister(): void;
    reportLogin(): void;
    reportData(dateType: string): void;
    WXattention(): void;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): void;
}
/**点击缩放 */
declare var TOUCH_SCALE_XY: number;
/**点击缩放间隔 */
declare var TOUCH_SCALE_DEALY: number;
declare var CONTENT_HEIGHT: number;
declare var CONTENT_WIDTH: number;
declare var DEFAULT_VIEW_W: number;
declare var DEFAULT_VIEW_H: number;
interface IServerData {
    /**服务器id */
    id?: number;
    /**服务器名称 */
    name?: string;
    /**服务器id */
    ip?: string;
    /**服务器端口 */
    port?: number;
    /**状态 1爆 2通畅 3维护*/
    status?: number;
    /**ssl */
    ssl?: number;
    /**维护公告 */
    notice?: string;
    /**是否推荐服 1 推荐 */
    rec?: number;
}
declare class ServerList {
    /**服务器下载列表成功标记 */
    static SERVER_INIT_SUCCESS: boolean;
    /**服务器队列 */
    static m_pDatas: Array<IServerData>;
    /**获取服务器列表成功回调 */
    private static m_pCall;
    private static m_pCallObj;
    /**服务器列表初始化 */
    static initServerList(call: any, thisObj: any): void;
    private static load();
    private static onLoadError(event);
    private static onLoadComplete(event);
    static getDataByIndex(id: number): IServerData;
    static getDatas(): Array<IServerData>;
    static getRecommendServerIndex(): number;
}
/**
 *
 * @author
 *
 */
declare module Mini {
    class HttpClient {
        responseType: string;
        returnFunc: Function;
        target: any;
        request: egret.HttpRequest;
        constructor();
        private paramsBuilder(data);
        send(method: string, callback: Function, target: any, data: any, url: string): void;
        private onGetComplete(event);
        private onGetIOError(event);
        private onGetProgress(event);
        private destory();
        static get(callback: Function, target: any, data: any, url: string): void;
        static post(callback: Function, target: any, data: any, url: string): void;
    }
}
/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
interface Platform {
    getUserInfo(): Promise<any>;
    /**初始化平台 */
    initPlatform(): any;
    login(): Promise<any>;
    loginCallback(isp: number, param: string): any;
    /**监听分享 */
    showShareMenu(): Promise<any>;
    /**分享 */
    share(data: any): any;
    /**微信关注公众号 */
    WXattention(): any;
    pay(orderNo: number, shopId: number, shopName: string, price: number): Promise<any>;
    reportRegister(): any;
    reportLogin(): any;
    reportData(dateType: string): any;
    isHidePayFunc(): boolean;
    isMsgCheckFunc(msg: string, callback: Function, target: any): any;
}
declare let platform: Platform;
interface Window {
    platform: Platform;
}
declare module Mini {
    class BitmapMovie extends eui.Image {
        /**纹理列表 */
        private textureList;
        /**总帧数 */
        totalFrame: number;
        /**当前播放帧数 第一帧从1开始 */
        curFrame: number;
        /**计时器 */
        private timer;
        /**播放延迟 */
        private _delay;
        /**循环次数 */
        private loop;
        constructor();
        onDestroy(): void;
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
        initByBitmap(srcBm: egret.Bitmap, maxRow: number, maxCol: number, startPos: number, pieceNum: number, width: number, height: number): void;
        /**
         * 播放
         * @loop 循环次数
         */
        play(loop?: number): void;
        /**
         * 停止播放
         */
        stop(): void;
        /**
         * 跳转播放
         * @frame 播放的起始帧
         * @loop 循环次数
         */
        gotoAndPlay(frame: number, loop?: number): void;
        /**
         * 跳转停止
         * @frame 停止的帧
         */
        gotoAndStop(frame: number): void;
        private startTimer();
        private onTimerHandler();
        private stopTimer();
        delay: number;
    }
}
declare class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    getAsset(source: string, compFunc: Function, thisObject: any): void;
}
declare class ThemeAdapter implements eui.IThemeAdapter {
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param onError 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void;
}
declare var generateEUI: {
    paths: string[];
    skins: any;
};
declare class ClientConfig {
    /**配置列表成功回调 */
    private static m_pCall;
    private static m_pCallObj;
    private static m_loader;
    /**配置初始化 */
    static setup(call: any, thisObj: any): void;
    private static load(resUrl);
    private static onLoadComplete(event);
}
declare module Mini {
    /**确认弹窗 */
    class ConfirmPop extends CMaskWnd {
        static instance: ConfirmPop;
        private m_sTips;
        private m_callbackConfirm;
        private m_thisArg;
        onDestroy(): void;
        constructor(tips: string, confirm?: Function, thisArg?: any);
        protected childrenCreated(): void;
        private onConfirmClick();
    }
}
declare module Mini {
    class LoginNoticeWnd extends CMaskWnd {
        private m_loader;
        private m_labDes;
        private m_sNotice;
        constructor(notice?: string);
        onDestroy(): void;
        protected childrenCreated(): void;
        private onLoadComplete(event);
    }
}
declare module Mini {
    class LoginServerList extends CMaskWnd {
        static NAME: string;
        private m_tList;
        constructor();
        onDestroy(): void;
        protected childrenCreated(): void;
        /**创建标识 */
        private createStatusIcon(dx, status);
        /**创建服务器列表 */
        private createList(title, list);
        private initEvent();
        private removeEvent();
        onItemSelected(e: eui.ItemTapEvent): void;
    }
}
declare module Mini {
    class LoginScene extends eui.Component {
        private m_imgBg;
        private m_pAcount;
        private m_editLabel;
        private m_pServer;
        private m_labServer;
        private m_labVersion;
        private m_btnEnter;
        private m_pPro;
        private m_imgPro;
        private m_labPro;
        private m_soundBg;
        private m_channelBg;
        private m_nTimeOut;
        private m_bInEnter;
        private m_btnMc;
        private m_tipsLabs;
        private m_labDebug;
        constructor();
        onDestroy(): void;
        protected childrenCreated(): void;
        /**启动登录界面 */
        private startLogin();
        private createView();
        /**调试回调 */
        private onDebug();
        /**账号 */
        private createAcount();
        /**服务器 */
        private createServer();
        /**进度条 */
        private createProcess();
        /**登陆背景音效 */
        private playLoginSound();
        /**创建按钮特效 */
        private createBtnEff();
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        private initEvent();
        private removeEvent();
        /**登录输入 */
        onAccountChange(evt: egret.Event): void;
        /**开始游戏 */
        private onBtnEnter();
        /**登录 */
        private login();
        /**选服点击 */
        private onServerHandler();
        /**声音加载完毕 */
        private onSoundComp();
        /**声音加载错误 */
        private onSoundError();
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**显示进度条 */
        setProcess(tips: string, process: number): void;
        /**隐藏进度条 */
        hideProcess(): void;
        /**弹出提示 */
        showTips(tips: string): void;
        /**修改服务器选择 */
        changeServerSel(id: number): void;
        /**询问框 */
        showConfirmPop(tips: string, callback: Function, thisObj: any): void;
        /**显示选服菜单 */
        showLoginServerList(): void;
        /**显示公告 */
        showNoticeWnd(notice?: string): void;
        /**去除所有空格 */
        trim(str: string): string;
        /**
          * 过滤特殊字符
          **/
        filterStr(str: string): string;
        onRefresh(): void;
    }
}

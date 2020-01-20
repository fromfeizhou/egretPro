
enum BattleQualityEnum {
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
class GameConfig {
	/**账号 */
	public static account: string = "b";

	//配置服务器列表 通过配置文件加载
	public static server_ip: string;
	public static server_port: number;
	// public static server_host: string = "http://local.2kyx.cn";

	//连外网的配置(gameConfig 配置修改)
	public static version: string;

	//主循环逻辑预定义变量
	public static isBackRun: boolean;	//后台运行状态

	public static m_notchScreen: boolean; //是否刘海屏
	public static notchPixel: number = 60;
	public static WH_Ratio: number;       //屏幕宽高比

	public static CLEAR_TIME: number;		//对象池清理时间

	public static BTEELE_QUALITY: number = BattleQualityEnum.HIGHT; //战斗品质

	//其他业务逻辑预定义
	public static MusicIsPlay = true;
	public static EffectIsPlay = true;

	public static bGuideIsOpen = true;
	public static testGuideIds = '';


	public static getLanUrls(): string[] {
		let lan_url = [];
		lan_url =
			[
				this.getResRemoteUrl(true) + "language.zip" + "?v=" + GameConfig.version
			];
		return lan_url;
	}

	public static getConfigUrls(): string[] {
		let config_url = [];
		config_url =
			[
				this.getResRemoteUrl(true) + "config.zip" + "?v=" + GameConfig.version
			];
		return config_url;
	}

	public static getLanUrl(): string {
		let index = parseInt(LocalData.getData('lan_config_index', "0"));
		let urls = this.getLanUrls();
		if (!DEBUG) index = 0;
		return urls[index];
	}
	public static getConfigUrl(): string {
		let index = parseInt(LocalData.getData('cfg_config_index', "0"));
		let urls = this.getConfigUrls();
		if (!DEBUG) index = 0;
		return urls[index];
	}

	/**配置文件 每次重新下载 */
	public static getClientConfigUrl(): string {
		return this.getResRemoteUrl(true) + "gameConfig.json" + "?v=" + Math.random();
	}

	/**资源配置配置名字 */
	public static getResourName(): string {
		return this.getResRemoteUrl() + "default.res.json" + "?v=" + GameConfig.version;
	}

	/**皮肤配置地址 */
	public static getThemeUrl(): string {
		return this.getResRemoteUrl(true) + "default.thm.json" + "?v=" + GameConfig.version;
	}

	/**服务器列表地址 */
	public static getServerListUrl(): string {
		return LoginConst.getResUrl('serverList.json?v=' + Math.random(),'');
	}

	/**登录公告地址 */
	public static getNoticeUrl(): string {
		return LoginConst.getResUrl('notice.txt?v=' + Math.random(),'');
	}


	/**新手录像地址 */
	public static getBattleVideoUrl(): string {
		return this.getResRemoteUrl() + "battleVideo.zip" + "?v=" + GameConfig.version
	}


	/**是否刘海屏 */
	public static getIsNotchScreen() {
		return this.m_notchScreen;
	}

	/**设置是否刘海屏 */
	public static setIsNotchScreen(bool: boolean) {
		this.m_notchScreen = bool;
	}

	/**设置宽高比 */
	public static setWHRatio(ratio: number) {
		this.WH_Ratio = ratio;
	}

	/**获取宽高比 */
	public static getWHRatio() {
		return this.WH_Ratio;
	}

	// -----------------------------------------------------------------------------------
	/**游戏默认字体 */
	public static fontDefault: string = "Microsoft YaHei";

	//全局字体颜色表--可以扩展
	public static TextColors = {
		white: 0xFFFFFF,//白色
		milkWhite: 0xfbf1af,//乳白色 
		grayWhite: 0x8a8a9e,//灰白色
		gray: 0x878785,	//灰色
		fontWhite: 0xe9e9e6,//字体白
		yellow: 0xffff00,//金黄色 
		lightYellow: 0xffd375,//淡黄色
		orangeYellow: 0xff9900,//橘黄色//道具名称 //玩家姓名
		red: 0xff0000,//红色
		green: 0x00ff00,//绿色 
		blue: 0x1a94d7,//蓝色 
		grayBlue: 0x2f5177,//墨蓝色 
		purple: 0xe938f2,//紫色 
		pink: 0xFF3030,//粉色 
		black: 0x2e2d2d,//黑色
		golden: 0xFFD700, //金色
		stroke: 0x5e3c16, //描边
		stroke2: 0x825757, //描边
		stroke3: 0x4f3823, //描边
		goldYellow: 0xffc517, //金黄
		goldYellow2: 0xffc000, //金黄

		quality0: 0xa6835f,	//品质0
		quality1: 0x70f145,	//品质1
		quality2: 0x44d0f3,	//品质2
		quality3: 0xf159f3,	//品质3
		quality4: 0xf3a549,	//品质4
		quality5: 0xff2727,	//品质5
	}

	//全局字体大小表--可以扩展
	public static LabelFontSize = {
		littleSize: 12,//小型字体大小
		middleSize: 18,//中型字体大小
		normalSize: 24,//正常字体大小
		bigSize: 36//大型字体大小
	}



	// //是不是大屏
	// public static isBigScreen(): boolean {
	// 	return (document.body.clientHeight / document.body.clientWidth > 1.32);
	// }


	//当前舞台
	public static curStage(): egret.Stage {
		return egret.MainContext.instance.stage;
	}

	//当前面板
	public static curPanel: egret.DisplayObjectContainer;

	//当前游戏宽度
	public static curWidth(): number {
		return egret.MainContext.instance.stage.stageWidth;
	}

	//当前游戏宽度
	public static curHeight(): number {
		return egret.MainContext.instance.stage.stageHeight;
	}

	//最佳分辨率
	public static bestScale = 1;
	public static initBestScale() {
		this.bestScale = Math.min(egret.MainContext.instance.stage.stageWidth / 1334, egret.MainContext.instance.stage.stageHeight / 750);
		if (this.bestScale > 1) {
			this.bestScale = 1;
		}
	}
	public static getBestScale(): number {
		this.initBestScale();
		return this.bestScale;
	}

	/**
	 * 游戏资源路径 通用	/resource/
	 * 游戏资源资源服务器	(微信小游戏)https://files.373yx.com/resource/resource1/
	 */
	public static getResRemoteUrl(isConfig: boolean = false) {
		return PlatConst.getResRemoteUrl(isConfig);
	}
	public static getSub() {
		return 750 - egret.MainContext.instance.stage.stageHeight > 0 ? 750 - egret.MainContext.instance.stage.stageHeight : 0;
	}

}




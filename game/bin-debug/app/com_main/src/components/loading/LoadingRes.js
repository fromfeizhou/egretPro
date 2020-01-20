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
/**场景加载器 */
var LoadingRes = /** @class */ (function (_super_1) {
    __extends(LoadingRes, _super_1);
    function LoadingRes() {
        var _this = _super_1.call(this) || this;
        _this.m_tipsLen = 0;
        _this.init();
        return _this;
    }
    LoadingRes.getIns = function () {
        return LoadingRes.getInstance();
    };
    LoadingRes.loadGroups = function (type, callback, target, param) {
        this.getIns().loadGroups(type, callback, target, param);
    };
    LoadingRes.prototype.onDestroy = function () {
        this.clear();
    };
    LoadingRes.prototype.clear = function () {
        this.m_pLoadInfos = null;
        this.m_pWaitInfos = null;
    };
    LoadingRes.prototype.init = function () {
        this.m_pLoadInfos = [];
        this.m_pWaitInfos = [];
        this.m_nLoadResNum = 0;
        this.m_nLoadWndNum = 0;
    };
    /**获取未加在过的资源组 */
    LoadingRes.prototype.getResGroups = function (type) {
        var datas = [];
        var res = SceneResGroupCfg.getResGroup(type);
        for (var key in res) {
            var element = res[key];
            var resname = element;
            var isload = RES.isGroupLoaded(resname);
            if (!isload) {
                datas.push(element);
            }
        }
        return datas;
    };
    LoadingRes.prototype.loadGroups = function (type, callback, target, param) {
        // /**获取未加载资源 */
        var groups = this.getResGroups(type);
        var loadInfo = { type: type, groups: groups, loadCount: 0, callback: callback, thisObj: target, param: param };
        debug("LoadingScene:loadGroups--->>groupType, res", type, groups);
        if (groups.length > 0) {
            this.show(type);
            if (groups.length > 1) {
                this.setProgress(1, groups.length, groups[0]);
            }
            this.m_pLoadInfos.push(loadInfo);
            AGame.ResUtils.loadGroups(groups, this.onResCompeleOne, this.onResProgressOne, this);
        }
        else {
            this.m_pWaitInfos.push(loadInfo);
            this.onResCompeleAll();
        }
    };
    LoadingRes.prototype.onResProgressOne = function (groupName, progress, total) {
        // debug("LoadingScene:onResProgressOne--->>加载进度", progress, total);
        //过滤多组加载 进度(在onResCompeleOne 中更新进度)
        for (var i = this.m_pLoadInfos.length - 1; i >= 0; i--) {
            var info = this.m_pLoadInfos[i];
            if (info.groups.indexOf(groupName) >= 0 && info.groups.length > 1) {
                return;
            }
        }
        this.setProgress(progress, total, groupName);
    };
    LoadingRes.prototype.onResCompeleOne = function (groupName) {
        for (var i = this.m_pLoadInfos.length - 1; i >= 0; i--) {
            var info = this.m_pLoadInfos[i];
            if (info.groups.indexOf(groupName) >= 0) {
                info.loadCount++;
                //多组加载 刷新加载精度
                if (info.loadCount < info.groups.length) {
                    this.setProgress(info.loadCount, info.groups.length, info.groups[info.loadCount]);
                }
                // debug("LoadingScene:onResCompeleOne--->>加载完成单组", groupName, info.loadCount);
                if (groupName == "effect") {
                    com_main.CEffectMgr.getIns().effectTexture = com_main.CResMgr.getIns().getTextureFromGroup("effect");
                    var aa = com_main.CEffectMgr.getIns();
                    var bb = aa.effectTexture;
                }
                if (groupName == "soldiers") {
                    com_main.CSquareMgr.getIns().animTexture = com_main.CResMgr.getIns().getTextureFromGroup("soldiers");
                }
                if (info.loadCount >= info.groups.length) {
                    //加载队列中移除 塞入等待回调执行队列
                    this.m_pLoadInfos.splice(i, 1);
                    this.m_pWaitInfos.push(info);
                    //场景界面计数
                    if (info.type < SceneModuleSplit) {
                        this.m_nLoadWndNum--;
                    }
                    else {
                        this.m_nLoadResNum--;
                    }
                    egret.setTimeout(this.onResCompeleAll, this, 500);
                }
            }
        }
    };
    /**所有资源加载完毕 */
    LoadingRes.prototype.onResCompeleAll = function () {
        //登录场景 不需要判断 协议内容
        if (this.isLoginMsgFinish()) {
            this.doCallBackAction();
        }
        else {
            this.m_tipsLen = 0;
            this.setProgress(0, 0, "正在获取服务器数据");
            LoadingRes.WAIT_MSG_TIME = 0;
            Utils.TimerManager.doTimer(300, 0, this.onWaitLoginDataHandler, this);
        }
    };
    /**等待服务器关键消息 定时器 */
    LoadingRes.prototype.onWaitLoginDataHandler = function () {
        //消息接收完毕
        if (this.isLoginMsgFinish()) {
            Utils.TimerManager.remove(this.onWaitLoginDataHandler, this);
            this.doCallBackAction();
            return;
        }
        LoadingRes.WAIT_MSG_TIME += 300;
        this.m_tipsLen++;
        if (this.m_tipsLen > 4) {
            this.m_tipsLen = 0;
        }
        var endStr = Array(this.m_tipsLen).join('。');
        var beginStr = Array(this.m_tipsLen).join('  ');
        this.setProgress(0, 0, beginStr + "正在获取服务器数据" + endStr);
        //登录数据接收异常 超时
        if (LoadingRes.WAIT_MSG_TIME > 10000) {
            Utils.TimerManager.remove(this.onWaitLoginDataHandler, this);
            AGame.CSocket.getInstance().close();
            SceneManager.enterScene(SceneEnums.NONE_MAP);
            EffectUtils.showTips("获取服务器数据失败", 1, true);
        }
    };
    /**登录消息判断(登录场景 不需要判断) */
    LoadingRes.prototype.isLoginMsgFinish = function () {
        if (!SceneManager.isAutoScene())
            return true;
        return LoginProxy.isLoginMsgRecFinish();
    };
    /** 执行回调函数 */
    LoadingRes.prototype.doCallBackAction = function () {
        for (var i = 0; i < this.m_pWaitInfos.length; i++) {
            var info = this.m_pWaitInfos[i];
            info.callback.call(info.thisObj, info.param);
        }
        this.m_pWaitInfos = [];
        this.hide();
    };
    LoadingRes.prototype.show = function (type) {
        //如果是场景加载
        if (type < SceneModuleSplit) {
            this.m_nLoadWndNum++;
            LoadingResUI.show();
        }
        else {
            this.m_nLoadResNum++;
            Loading.show();
        }
    };
    LoadingRes.prototype.hide = function () {
        //如果是场景加载
        if (this.m_nLoadWndNum <= 0) {
            this.m_nLoadWndNum = 0;
            LoadingResUI.hide();
        }
        if (this.m_nLoadResNum <= 0) {
            this.m_nLoadResNum = 0;
            Loading.hide();
        }
    };
    LoadingRes.prototype.setProgress = function (current, total, resName) {
        var view = LoadingResUI.getClass();
        if (view)
            view.setProgress(current, total, resName);
    };
    LoadingRes.WAIT_MSG_TIME = 0; //等待数据时间
    return LoadingRes;
}(BaseClass));
// /**场景加载器 */
// class LoadingRes extends BaseClass implements IFObject {
// 	public static getIns(): LoadingRes {
// 		return LoadingRes.getInstance();
// 	}
// 	/**设置要加载的资源组 */
// 	public static setResGroups(config: any[]) {
// 		this.getIns().setResGroups(config);
// 	}
// 	public static loadGroups(type: SceneEnums | ModuleEnums, callback: Function, target: Object, param?: any) {
// 		this.getIns().loadGroups(type, callback, target, param);
// 	}
// 	/**隐藏场景加载过度 */
// 	public static hide() {
// 		this.getIns().clear();
// 		this.getIns().hide();
// 	}
// 	private m_pGroup: any[];
// 	private m_pResGroups: any[][];
// 	private m_pGroupType: SceneEnums | ModuleEnums;
// 	private m_pParam: any;
// 	private m_pCallFunc: Function;
// 	private m_pCallTarget: any;
// 	private m_pCount: number;
// 	public constructor() {
// 		super();
// 		this.init();
// 	}
// 	public onDestroy() {
// 		this.clear();
// 	}
// 	public clear() {
// 		this.m_pResGroups = [];
// 		this.m_pGroup = [];
// 		this.m_pCount = 0;
// 		this.m_pGroupType = 0;
// 		this.m_pCallFunc = null;
// 		this.m_pCallTarget = null;
// 		this.m_pParam = null;
// 	}
// 	public init() {
// 		this.m_pResGroups = [];
// 		this.m_pGroup = [];
// 		this.m_pCount = 0;
// 		this.m_pGroupType = 0;
// 	}
// 	/**设置要加载的资源组 */
// 	public setResGroups(config: any[]) {
// 		this.m_pResGroups = config;
// 	}
// 	/**获取未加在过的资源组 */
// 	private getResGroups(type: SceneEnums | ModuleEnums) {
// 		let datas = [];
// 		let res = this.m_pResGroups[type];
// 		for (let key in res) {
// 			let element = res[key];
// 			let resname = element[0];
// 			let isload = RES.isGroupLoaded(resname);
// 			if (!isload) {
// 				//zb
// 				// isload = RES.isGroupLoaded("pilferer_" + resname);
// 				isload = RES.isGroupLoaded(resname);
// 				if (!isload) datas.push(element);
// 			}
// 		}
// 		return datas;
// 	}
// 	public loadGroups(type: SceneEnums | ModuleEnums, callback: Function, target: Object, param?: any) {
// 		if (this.m_pResGroups.length <= 0) {
// 			error("loadGroups-->>", "请设置要加载的资源组");
// 			return;
// 		}
// 		this.m_pGroupType = type;
// 		this.m_pCallFunc = callback;
// 		this.m_pCallTarget = target;
// 		this.m_pParam = param;
// 		this.m_pGroup = this.getResGroups(this.m_pGroupType);
// 		debug("LoadingScene:loadGroups--->>groupType, res", this.m_pGroupType, this.m_pGroup);
// 		if (this.m_pGroup.length > 0) {
// 			this.show();
// 			let resname = this.m_pGroup[0][0];
// 			if (this.m_pGroup.length > 1) {
// 				this.setProgress(1, this.m_pGroup.length, resname);
// 			}
// 			AGame.ResUtils.loadGroups(this.m_pGroup, this.onResCompeleOne, this.onResProgressOne, this);
// 		} else {
// 			this.onResCompeleAll();
// 		}
// 	}
// 	private onResProgressOne(progress: number, total: number) {
// 		if (this.m_pGroup.length == 1) {
// 			debug("LoadingScene:onResProgressOne--->>加载进度", progress, total);
// 			let resname = this.m_pGroup[0][0];
// 			this.setProgress(progress, total, resname);
// 		}
// 	}
// 	private onResCompeleOne(groupName: string) {
// 		if (!Utils.isContainsName(this.m_pGroup, groupName)) return;
// 		this.m_pCount++;
// 		debug("LoadingScene:onResCompeleOne--->>加载完成单组", groupName, this.m_pCount);
// 		if (groupName == "effect") {
// 			com_main.CEffectMgr.getIns().effectTexture = com_main.CResMgr.getIns().getTextureFromGroup("effect");
// 			let aa :com_main.CEffectMgr = com_main.CEffectMgr.getIns();
//             let bb = aa.effectTexture;
// 		}
// 		if (groupName == "soldiers") {
// 			com_main.CSquareMgr.getIns().animTexture = com_main.CResMgr.getIns().getTextureFromGroup("soldiers");
// 		}
// 		if (this.m_pGroup.length > 1) {
// 			this.setProgress(this.m_pCount, this.m_pGroup.length, groupName);
// 		}
// 		if (this.m_pCount >= this.m_pGroup.length) {
// 			this.onResCompeleAll();
// 		}
// 	}
// 	private onResCompeleAll() {
// 		//登录场景 不需要判断 协议内容
// 		if(this.isWaitLoginMsg()){
// 			this.show();
// 			LoginProxy.INIT_LOGIN_DATA_WAIT = 0;
// 			this.m_tipsLen = 0;
// 			this.setProgress(0,0,"正在获取登录数据");
// 			Utils.TimerManager.doTimer(300, 0, this.onWaitLoginDataHandler, this);
// 		}else{
// 			this.doCallBackAction();
// 		}
// 	}
// 	private m_tipsLen = 0;
// 	private onWaitLoginDataHandler(){
// 		//消息接收完毕
// 		if(LoginProxy.isLoginMsgRecFinish()){
// 			Utils.TimerManager.remove(this.onWaitLoginDataHandler, this);
// 			this.doCallBackAction();
// 			return;
// 		}
// 		LoginProxy.INIT_LOGIN_DATA_WAIT += 300
// 		this.m_tipsLen++;
// 		if(this.m_tipsLen > 4){
// 			this.m_tipsLen = 0;
// 		}
// 		let endStr = Array(this.m_tipsLen).join('。')
// 		let beginStr = Array(this.m_tipsLen).join('  ')
// 		this.setProgress(0,0,beginStr + "正在获取登录数据" + endStr);
// 		//登录数据接收异常 超时
// 		if(LoginProxy.INIT_LOGIN_DATA_WAIT > 10000){
// 			Utils.TimerManager.remove(this.onWaitLoginDataHandler, this);
// 			AGame.CSocket.getInstance().close();
// 			SceneManager.enterScene(SceneEnums.NONE_MAP);
// 			EffectUtils.showTips("获取登录数据超时！",1,true);
// 		}
// 	}
// 	/**登录消息判断(登录场景 不需要判断) */
// 	private isWaitLoginMsg(){
// 		if(this.m_pGroupType != SceneEnums.NONE_MAP && this.m_pGroupType != SceneEnums.BATTLE_MAP && this.m_pGroupType != SceneEnums.TEST_MAP){
// 			return !LoginProxy.isLoginMsgRecFinish();
// 		}else{
// 			return false;
// 		}
// 	}
// 	private doCallBackAction(){
// 		debug("LoadingScene:onResCompeleAll--->>加载完全部资源", this.m_pGroupType, this.m_pCount);
// 		if (this.m_pCallFunc && this.m_pCallTarget) {
// 			this.m_pCallFunc.call(this.m_pCallTarget, this.m_pParam);
// 		}
// 		//多个同时加载问题，不能清理
// 		if (this.m_pCount >= this.m_pGroup.length) {
// 			LoadingRes.hide();
// 		}
// 	}
// 	public show(delay: number = 60000) {
// 		//如果是场景加载
// 		if (this.m_pGroupType < 1000) {
// 			LoadingResUI.show();
// 		} else {
// 			Loading.show();
// 		}
// 	}
// 	public hide() {
// 		//如果是场景加载
// 		if (this.m_pGroupType < 1000) {
// 			LoadingResUI.hide();
// 		} else {
// 			Loading.hide();
// 		}
// 	}
// 	public setProgress(current: number, total: number, resName?: string): void {
// 		let view = LoadingResUI.getClass();
// 		if (view) view.setProgress(current, total, resName);
// 	}
// }

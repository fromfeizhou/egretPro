/**场景管理类 */
class SceneManager {
	private static m_pCScene: SceneEnums = SceneEnums.NONE_MAP;
	private static m_pLastScene: SceneEnums; //上一个场景
	private static m_pIsComplete: boolean;
	private static m_pSceneLayers;
	public static m_pIsLoadRes: boolean = false;
	private static m_tTipsParam: any;	//指引参数
	private static m_sceneStack: number[] = []; //场景堆栈（用来保存场景资源 释放场景资源）
	private static m_sceneStack1: number[] = []; //场景堆栈(用于退回原来场景)

	/**根据枚举获取对应层 */
	public static getLayer(enums: LayerEnums): egret.DisplayObjectContainer {
		let layer = null;
		switch (enums) {
			case LayerEnums.MAP:
				layer = AGame.R.app.mapLevel;
				break;
			case LayerEnums.MENU:
				layer = AGame.R.app.menuLevel;
				break;
			case LayerEnums.POPUP:
				layer = AGame.R.app.popUpLevel;
				break;
			case LayerEnums.TOP:
				layer = AGame.R.app.topLevel;
				break;
			case LayerEnums.GUIDE:
				layer = AGame.R.app.guideLevel;
				break;
			case LayerEnums.NET:
				layer = AGame.R.app.netLevel;
				break;
		}
		return layer;
	}


	/**
	 * 获取当前场景对应的层枚举
	 */
	private static getCurrSceneLayers(): any {
		if (!this.m_pSceneLayers) {
			this.m_pSceneLayers = {};
			this.m_pSceneLayers[SceneEnums.NONE_MAP] = [LayerEnums.MAP, LayerEnums.MENU, LayerEnums.TOP, LayerEnums.GUIDE];//通用

		}
		return this.m_pSceneLayers[this.m_pCScene] ? this.m_pSceneLayers[this.m_pCScene] : this.m_pSceneLayers[SceneEnums.NONE_MAP];
	}



	public static addChild(enums: LayerEnums, child: any, index?: number) {
		let layer = this.getLayer(enums);
		if (!layer) {
			error("LayerEnums：" + enums + " 不存在");
			return;
		}
		if (index != null)
			layer.addChildAt(child, index);
		else
			layer.addChild(child);
	}

	/**
	 * 获取当前Scene
	 * @returns SceneEnums
	 */
	public static getCurrScene(): SceneEnums {
		return this.m_pCScene;
	}
	/**获取上一个场景 */
	public static getLastScene(): SceneEnums {
		return this.m_pLastScene;
	}
	/**获取某个层的某个类 根据name获取 */
	public static getClass(enums: LayerEnums, name: string): any {
		let layer = this.getLayer(enums);
		if (layer) {
			let child = layer.getChildByName(name);
			if (child) return child;
		}
		return null;
	}

	public static checkIsExistsForName(enums: LayerEnums, name: string): boolean {
		let layer = this.getLayer(enums);
		if (layer) {
			let child = layer.getChildByName(name);
			if (child) return true;
		}
		return false;
	}

	/**
	 * 清空处理
	 */
	public static clear(scene?: SceneEnums): void {
		let self = this;
		debug("清理场景信息：", self.m_pCScene);
		self.m_pIsComplete = false;
		com_main.UpManager.close();
		let layers_menu = self.getCurrSceneLayers();
		for (let key in layers_menu) {
			if (layers_menu.hasOwnProperty(key)) {
				let emnus = layers_menu[key];
				let layer = self.getLayer(emnus);
				let layers = [].concat(layer.$children);
				while (layers.length > 0) {
					let element: any = layers.pop();
					let flag = this.checkIsCanRemove(element, scene);
					if (flag) {
						if (element.onDestroy && typeof (element.onDestroy) == 'function') {
							element.onDestroy();
						}
						if (element.parent) {
							element.parent.removeChild(element);
						}
					} else {
						debug('scene keep elment:', element.name)
					}
				}
				layers = null;
			}
		}

		/**10分钟清理一次 */
		let time = TimerUtils.getServerTime();
		if (time - GameConfig.CLEAR_TIME >= 600) {
			GameConfig.CLEAR_TIME = time;
			AnchorUtil.reset();
			ObjectPool.clear();
			NormalMcMgr.clearMc();
			SceneResGroupCfg.clearModelRes([ModuleEnums.FLAGMENT_RES,   //碎片资源
			ModuleEnums.KING_BATTLE,    //封王战
			ModuleEnums.ACTIVITY_UI,    //活动
			ModuleEnums.BUILDING_TIPS,  //建筑头顶
			ModuleEnums.WELFARE_VIEW,   //福利
			ModuleEnums.CAMP_VIEW,      //队伍
			ModuleEnums.EQUIP_VIEW      //装备

			]);

		} else {
			NormalMcMgr.clearMc([IETypes.EUI_EqLevelEff, IETypes.EUI_ActivityEffect, IETypes.EUI_GuideTouch]);
		}

		/**切换场景 清理新手条件缓存 */
		GuideModel.clearCondtion();
	}

	/**
	 * 释放场景资源
	 * @param scene 场景唯一标识
	 */
	private static releaseSceneRes(scene: SceneEnums) {
		switch (scene) {
			case SceneEnums.NONE_MAP: {
				break;
			}
			case SceneEnums.MAIN_CITY: {
				//清理模块资源
				SceneResGroupCfg.clearModelRes([ModuleEnums.MAIN_CITY]);
				break;
			}
			case SceneEnums.WORLD_CITY: {
				/**清理资源 */
				SceneResGroupCfg.clearModelRes([ModuleEnums.WORLD_CITY]);
				break;
			}
			case SceneEnums.WORLD_XIANGYANG_CITY: {
				/**清理资源 */
				SceneResGroupCfg.clearModelRes([ModuleEnums.WORLD_XIANGYANG_CITY]);
				break;
			}
			case SceneEnums.BATTLE_MAP: {
				com_main.BattleView.getInstance().clearRes();
				SceneResGroupCfg.clearModelRes([ModuleEnums.BATTLE, ModuleEnums.BATTLE_MAP_DYNAMICS, ModuleEnums.RESULT_VIEW, ModuleEnums.COUNTRY_UI]);
				break;
			}
			case SceneEnums.TEST_MAP: {//测试地图
				break;
			}
			case SceneEnums.WAIT_BATTLE_MAP: {
				com_main.BattleView.getInstance().clearRes();
				SceneResGroupCfg.setResGroup(ModuleEnums.BATTLE_MAP_DYNAMICS, ['map_battle_' + 1]);
				SceneResGroupCfg.clearModelRes([ModuleEnums.BATTLE, ModuleEnums.BATTLE_MAP_DYNAMICS]);
				break;
			}
			case SceneEnums.AUTO_BATTLE_MAP: {
				let map1 = com_main.AwayKeyboardView.getInstance();
				map1.cleanObj();
				SceneResGroupCfg.clearModelRes([ModuleEnums.AKB]);
				break;
			}
			case SceneEnums.CROSS_WAR_MAP: {
				// let map1 = new
				// map1.cleanObj();
				// SceneResGroupCfg.clearModelRes([ModuleEnums.AKB]);
				break;
			}
		}
	}

	//过去上一个场景
	private static getSceneBefore() {
		for (let i = this.m_sceneStack1.length - 2; i >= 0; i--) {
			if (this.m_sceneStack1[i] != SceneEnums.BATTLE_MAP && this.m_sceneStack1[i] != SceneEnums.WAIT_BATTLE_MAP && this.m_sceneStack1[i] != this.m_pCScene) {
				return this.m_sceneStack1[i];
			}
		}
		return SceneEnums.AUTO_BATTLE_MAP;
	}

	/**返回上一个场景 */
	public static runSceneBefore(operateType?:SceneOperateEnums) {
		if(operateType == SceneOperateEnums.WATCH_WORLD_BATTLE){
			if(this.m_pCScene != SceneEnums.BATTLE_MAP && this.m_pCScene != SceneEnums.WAIT_BATTLE_MAP){
				return ;
			}
		}

		//不能返回到 城门场景
		let scene = this.getSceneBefore();
		this.enterScene(scene);
	}
	

	/**
	 * 场景入栈
	 * @param scene 场景唯一标识
	 */
	private static pushSceneStack(scene: SceneEnums) {
		//只保留两个场景的资源。
		let maxLen = 2; //堆栈最大长度
		if (this.m_sceneStack.length < maxLen) {
			this.m_sceneStack.push(scene);
		} else {
			let index = this.m_sceneStack.indexOf(scene);
			if (index > -1) {
				this.m_sceneStack.splice(index, 1);
			} else {
				let lastScene = this.m_sceneStack.splice(0, 1);
				this.releaseSceneRes(lastScene[0]);
			}
			this.m_sceneStack.push(scene);
		}

		//记录场景操作
		let len = 100;
		if (this.m_sceneStack1.length >= len) {
			let lastScene = this.m_sceneStack1.splice(0, 1);
		}
		this.m_sceneStack1.push(scene);
	}

	/**进入场景 */
	public static enterScene(scene: SceneEnums, param?: any, isCheck = true, tipsParam: any = null){
		//返回襄阳战限制
		if(scene == SceneEnums.WORLD_XIANGYANG_CITY){
			let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
			if(!vo || !vo.isInBattleTime()) scene = SceneEnums.AUTO_BATTLE_MAP;
		}
		// //返回跨服城门战限制
		if (scene == SceneEnums.CROSS_WALL_WAR_MAP && (CrossModel.crossStatus != CrossServerState.MATCH_SUC && CrossModel.crossStatus != CrossServerState.WALL_WAR)) scene = SceneEnums.AUTO_BATTLE_MAP;
		//返回跨服城池战限制
		if (scene == SceneEnums.CROSS_WAR_MAP && CrossModel.crossStatus != CrossServerState.CITY_WAR) scene = SceneEnums.AUTO_BATTLE_MAP;
		switch (scene) {
			case SceneEnums.WORLD_CITY:
			case SceneEnums.WORLD_XIANGYANG_CITY: {
				WorldModel.gotoWorldScene(scene)
				break;
			}
			case SceneEnums.CROSS_WALL_WAR_MAP:{
				CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(3);
				break;
			}
			default:{
				this.runScene(scene,param,isCheck,tipsParam);
				break;
			}
		}
	}

	/**跨服战结算界面跳转 */
	public static crossResultRunScene(){
		if(this.m_pCScene == SceneEnums.CROSS_WALL_WAR_MAP || this.m_pCScene == SceneEnums.CROSS_WAR_MAP
		|| (this.m_pCScene == SceneEnums.BATTLE_MAP && BattleModel.getCheckPointType() == CheckPointType.CROSS_SERVER)
		|| this.m_pCScene == SceneEnums.WAIT_BATTLE_MAP){
			this.enterScene(SceneEnums.AUTO_BATTLE_MAP);
		}
	}
	
	/**
	 * 切换场景
	 * @param scene 场景唯一标识
	 * @param isCheck 是否判断场景是否重复(强制切换场景 不检查)
	 */
	public static runScene(scene: SceneEnums, param?: any, isCheck = true, tipsParam: any = null) {
		this.m_pIsComplete = false;
		this.m_tTipsParam = tipsParam;
		// if (GuideModel.isGuide && scene == SceneEnums.WORLD_CITY)
		// 	scene = RoleData.countryId > 0 ? SceneEnums.NOVICE_MAP : SceneEnums.MAIN_CITY;
		//登录场景 不过滤
		if (scene == this.m_pCScene && isCheck) {
			error("场景" + scene + "重复调用了！！！！！！！");
			return;
		}
		if (!(scene >= SceneEnums.NONE_MAP && scene < SceneEnums.ALL)) {
			error("场景" + scene + "不存在");
			return;
		}
		this.pushSceneStack(scene);
		this.m_pLastScene = this.m_pCScene;
		// Loading.hide();
		// LoadingResUI.hide();
		this.clear(scene);
		this.m_pCScene = scene;
		this.loadScene(param);
		WorldModel.checkWorldScene();
	}

	private static async loadScene(param: any) {
		debug("加载场景资源：", this.m_pCScene);
		this.m_pIsLoadRes = true;
		await SceneResGroupCfg.LaterClearModelRes();
		await DragonBonesManager.clearZeroIns();
		if (this.isBattleScene()) {
			/**释放记录龙骨 */
			GeneralMCMgr.clearMc();
		}
		//加载场景资源
		LoadingRes.loadGroups(this.m_pCScene, this.onResLoadComplete, this, param);
	}

	/**加载场景资源完成 */
	private static onResLoadComplete(param: any) {
		debug("初始化场景信息：", this.m_pCScene);

		this.m_pIsLoadRes = false;
		// com_main.CEffectMgr.getIns().effectTexture = com_main.CResMgr.getIns().getTextureFromGroup("effect");

		//场景资源加载完成打开场景请求
		switch (this.m_pCScene) {
			case SceneEnums.NONE_MAP: {
				//清理场景，返回选服界面
				com_main.Bootstrap.logoutGame();
				break;
			}
			case SceneEnums.MAIN_CITY: {
				Loading.show();
				Utils.open_view(TASK_UI.MAP_MAIN, param);
				break;
			}
			case SceneEnums.WORLD_CITY:
			case SceneEnums.WORLD_XIANGYANG_CITY: {
				Utils.open_view(TASK_UI.MAP_WORLD);
				break;
			}
			case SceneEnums.BATTLE_MAP: {
				Utils.open_view(TASK_UI.MAP_BATTLE);
				break;
			}
			case SceneEnums.NOVICE_MAP: {//新手主城战斗
				break;
			}
			case SceneEnums.TEST_MAP: {//测试地图
				Loading.show();
				Utils.open_view(TestNav.TEST_ANIM);
				break;
			}
			case SceneEnums.ALL: {
				Loading.show();
				break;
			}
			case SceneEnums.WAIT_BATTLE_MAP: {
				Loading.show();
				Utils.open_view(TASK_UI.WAIT_BATTLE_MAP, param);
				break;
			}
			case SceneEnums.AUTO_BATTLE_MAP: {
				Utils.open_view(TASK_UI.AWAY_FROM_KEYBOARD);
				break;
			}

			case SceneEnums.CROSS_WAR_MAP: {
				Utils.open_view(TASK_UI.MAP_CROSS_WAR);
				break;
			}

			case SceneEnums.CROSS_WALL_WAR_MAP: {
				Utils.open_view(TASK_UI.MAP_CROSS_WALL_WAR);
				break;
			}
		}
		com_main.EventMgr.dispatchEvent(SceneEvent.CHANGE_COMPLETE, this.m_pCScene);

		//场景加载完毕
		this.onSceneWndEnter(true);
	}



	public static isSceneComplete() {
		return this.m_pIsComplete;
	}

	/**场景创建完成 */
	public static sceneCreateComplete() {
		this.m_pIsComplete = true;
		debug("SceneManager:sceneCreateComplete--->>场景创建完成");

		Sound.playSceneBG(this.m_pCScene);

		LoadingResUI.hide();
		Loading.hide();

		// /**初始化指引对象 */
		// if (isNull(com_main.GuideUI.getClass())) {
		// 	let view = new com_main.GuideUI();
		// 	this.addChild(LayerEnums.GUIDE, view);
		// }

		//进入场景打开什么UI在这里打开
		switch (this.m_pCScene) {
			case SceneEnums.NONE_MAP: {
				break;
			}
			case SceneEnums.MAIN_CITY: {
				Utils.open_view(TASK_UI.MENU_MAIN_SCENE);
				Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
				Utils.open_view(TASK_UI.MENU_MAIN_TOPBAR);
				break;
			}
			case SceneEnums.WORLD_CITY: {
				Utils.open_view(TASK_UI.MENU_MAIN_WORLD);
				Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
				Utils.open_view(TASK_UI.MENU_MAIN_TOPBAR);
				break;
			}
			case SceneEnums.WORLD_XIANGYANG_CITY: {
				Utils.open_view(TASK_UI.MENU_MAIN_WORLD);
				Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
				break;
			}
			case SceneEnums.BATTLE_MAP: {
				Utils.open_view(TASK_UI.MENU_BATTLE_VIEW);
				break;
			}
			case SceneEnums.NOVICE_MAP: {//新手地图

				break;
			}
			case SceneEnums.TEST_MAP: {//测试地图
				break;
			}
			case SceneEnums.WAIT_BATTLE_MAP: {//攻城战排队等候界面
				Utils.open_view(TASK_UI.MENU_BATTLE_VIEW, true);
				break;
			}
			case SceneEnums.AUTO_BATTLE_MAP: {
				Utils.open_view(TASK_UI.MENU_MAIN_HANG);
				Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
				Utils.open_view(TASK_UI.MENU_MAIN_TOPBAR);
				break;
			}
			case SceneEnums.CROSS_WALL_WAR_MAP: {
				Utils.open_view(TASK_UI.MENU_MAIN_CROSS);
				Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
				break;
			}
			case SceneEnums.CROSS_WAR_MAP: {
				Utils.open_view(TASK_UI.MENU_MAIN_CROSS);
				Utils.open_view(TASK_UI.MENU_MAIN_TOP_OTHER);
				break;
			}
			case SceneEnums.ALL: {
				break;
			}
		}

		if (this.m_tTipsParam) {
			Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, this.m_tTipsParam);
			this.m_tTipsParam = null;
		}

		/**新手引导ui匹配 */
		com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.SCENE);
	}

	public static getView(viewName: string, param?: any) {
		let clazz = egret.getDefinitionByName(viewName);
		let ca = new clazz(param);
		return ca;
	}


	/**
	 * 加载资源打开界面
	 * viewName: string  显示页面的类名
	 * param?: any   显示页面类 构造函数的参数
	 * type: SceneEnums | ModuleEnums   需要加载的资源组
	 * style: number   显示模式 UpManager.STYLE_UP 普通弹窗,UpManager.STYLE_FULL 全屏显示，不关地图层.UpManager.STYLE_MAIN_FULL 全屏显示，关地图层
	 * preVisible：bool  是否显示先前弹窗
	 * [废弃字段]isEnterHistory :boolean 是否加入弹窗堆栈,返回显示 (废弃 必加入弹窗队列)
	 * showType [未实现]   显示类型等~
	 * layer      属于哪个层
	 */
	public static openView(viewName: string, param?: any, type?: SceneEnums | ModuleEnums, style: number = com_main.UpManager.STYLE_UP,
		preVisible = true, isEnterHistory = true, showType = 0, isShowMask = true, layer: LayerEnums = LayerEnums.POPUP) {
		debug("SceneManager:openView--->>", viewName);

		let func: Function = () => {
			debug("SceneManager:openView--->> load complete", viewName);
			if (layer == LayerEnums.POPUP) {
				let name = viewName.replace('com_main.', '');
				let view = SceneManager.getClass(LayerEnums.POPUP, name);
				if (view) {
					com_main.UpManager.updateView(view, preVisible, isShowMask);
				} else {
					view = SceneManager.getView(viewName, param);
					com_main.UpManager.popView(view, style, preVisible, isEnterHistory, showType, isShowMask);
				}
			}
			else if (layer == LayerEnums.GUIDE) {
				let view = SceneManager.getView(viewName, param);
				this.addChildGuideView(view)
			}
			Loading.hide();
		}

		if (type && SceneResGroupCfg.getResGroup(type).length > 0) {
			//加载场景资源
			LoadingRes.loadGroups(type, func, this, null);
		} else {
			func();
		}
	}

	public static getCurrMap(): any {
		let scene = this.getCurrScene();
		switch (scene) {
			case SceneEnums.MAIN_CITY: {
				return com_main.MainMap.getClass();
			}
			// case SceneEnums.WORLD_CITY: {
			// 	return com_main.WorldMap.getClass();
			// }
			case SceneEnums.BATTLE_MAP: {
				return com_main.BattleMap.getClass();
			}
		}

		return null;
	}

	/**是否登录场景 */
	public static isLoginScene() {
		return this.m_pCScene == SceneEnums.NONE_MAP;
	}

	/**是否是建筑场景 */
	public static isCityScene() {
		return this.m_pCScene == SceneEnums.MAIN_CITY;
	}

	/**是否是世界场景 */
	public static isWorldScene() {
		return this.m_pCScene == SceneEnums.WORLD_CITY;
	}
	/**是否是襄阳场景 */
	public static isXiangYangScene() {
		return this.m_pCScene == SceneEnums.WORLD_XIANGYANG_CITY;
	}
	/**是否是战斗场景 */
	public static isBattleScene() {
		if (this.m_pCScene == SceneEnums.BATTLE_MAP) return true;
		return false;
	}
	/**是否挂机场景 */
	public static isAutoScene() {
		if (this.m_pCScene == SceneEnums.AUTO_BATTLE_MAP) return true;
		return false;
	}

	/**检查空场景 */
	public static onSceneWndEnter(isRunScene: boolean = false) {
		if (this.m_pIsLoadRes == true) return;

		if (ScenePopQueWnd.hasQueWnd()) {
			//检查场景弹窗
			ScenePopQueWnd.checkQueQue();
		} else {
			//检测新手引导条件
			SceneManager.sendGuideScene(isRunScene);
		}
	}

	/**===================================================================================================================
	 * 引导 begin
	 * ===================================================================================================================
	 */
	private static addChildGuideView(view: com_main.CView) {
		if (view) {
			com_main.UpManager.setScale(view, true);
			SceneManager.addChild(LayerEnums.GUIDE, view);
		}
	}
	//当前是否有引导界面
	public static hasChildGuideView() {
		let layer = this.getLayer(LayerEnums.GUIDE);
		return layer.numChildren != 0;
	}

	//关闭指引面板相关
	public static closeGuidePanelByName(panelName: string) {
		let panel = SceneManager.getClass(LayerEnums.GUIDE, panelName);
		if (panel) {
			panel.onDestroy();
			if (panel.parent) {
				panel.parent.removeChild(panel);
				panel = null;
			}

			//新手提示ui关闭 检测当前ui条件（场景 或面板）
			this.sendGuideScene();
		}
	}

	/** 发送当前ui条件（场景 或面板） */
	public static sendGuideScene(isRunScene: boolean = false) {
		//有引导界面存在 跳过
		if (this.hasChildGuideView()) return;
		if (this.sendPanelGuide()) return;
		com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.SCENE);

		//非切换场景调用 （面板关闭等）
		if (!isRunScene) {
			if (this.isCityScene()) com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MAIN_BUILD);
			if (this.isWorldScene()) com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_RESOURCE);
			this.sendGuideMenu();
		}
	}

	/**发送面板条件 */
	public static sendPanelGuide() {
		let panel = com_main.UpManager.CurrentPanel;
		if (panel && panel.onGuideCondition) {
			panel.onGuideCondition();
			return true;
		}
		return false;
	}

	/**发送菜单条件 */
	private static sendGuideMenu() {
		let layer = this.getLayer(LayerEnums.MENU);
		let layers = [].concat(layer.$children);
		while (layers.length > 0) {
			let element: any = layers.pop();
			if (element.onGuideCondition && typeof (element.onGuideCondition) == 'function') {
				element.onGuideCondition();
			}
		}
		layers = null;
	}

	/**===================================================================================================================
	 * 引导 end
	 * ===================================================================================================================
	 */

	/**===================================================================================================================
	 * 工具栏 begin
	 * ===================================================================================================================
	 */
	private static toolBarList = {
		[SceneEnums.MAIN_CITY]: ['MainTopOther', 'MainTopBar', 'MainSceneBar', 'SystemNotice'],

		[SceneEnums.WORLD_XIANGYANG_CITY]: ['MainTopOther', 'MainTopBar', 'MainWorldBar', 'SystemNotice'],
		[SceneEnums.WORLD_CITY]: ['MainTopOther', 'MainTopBar', 'MainWorldBar', 'SystemNotice'],

		[SceneEnums.BATTLE_MAP]: ['SystemNotice'],
		[SceneEnums.NOVICE_MAP]: ['MainTopOther', 'SystemNotice'],

		[SceneEnums.CROSS_WALL_WAR_MAP]: ['MainTopOther', 'MainCrossBar', 'SystemNotice'],
		[SceneEnums.CROSS_WAR_MAP]: ['MainTopOther', 'MainCrossBar', 'SystemNotice'],

		[SceneEnums.AUTO_BATTLE_MAP]: ['MainTopOther', 'MainTopBar', 'MainHangBar', 'SystemNotice'],
	}
	/**检测新场景是否有相同的项，是否需要移除 */
	private static checkIsCanRemove(obj, scene: SceneEnums): boolean {
		let barList = this.toolBarList[scene];
		if (obj.name == "AwayKeyboardView") {
			// 挂机界面不清
			obj.onDestroy();
			return false;
		}
		if (barList) {
			return barList.indexOf(obj.name) >= 0 ? false : true;
		}
		return true;
	}
	/**===================================================================================================================
	 * 工具栏 end
	 * ===================================================================================================================
	 */

}
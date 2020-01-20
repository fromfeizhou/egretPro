enum MainTopOtherType {
	LEFT = 1,
	RIGHT = 2,
}
module com_main {
	export class MainTopOther extends CView {

		public static NAME = 'MainTopOther';
		public m_mainToolsBar: com_main.MainToolsBar;
		public m_sceneGroup: eui.Group;
		public m_pSceneBtn: eui.Group;
		public m_mrp: eui.Group;
		public m_pHangBtn: eui.Group;
		public m_pWorldBtn: eui.Group;
		public m_pWorldRed: eui.Group;
		public m_conTop: eui.Group;
		public m_conBottom: eui.Group;
		public m_conRight: eui.Group;
		public m_conMoreRoot: eui.Group;
		public m_conRightSec: eui.Group;
		public m_pMoreBtn: eui.Group;
		public m_pMissionTipsViewRoot: com_main.MissionTipsView;



		/**上边图标列表 */
		private m_pTIcons = [];
		/**右边图标列表 */
		private m_pRIcons = [];
		/**右边图标列表 */
		private m_pRIconSecs = [];
		/**下边图标列表 */
		private m_pBIcons = [];

		/**隐藏按钮 */
		private m_pHideIcons: FunctionWidgetBase[] = [];
		private maxCout: number = 0;//活动一排最大数
		public constructor() {
			super();
			this.name = MainTopOther.NAME;
			this.initApp("top_new/top_other.exml");
		}

		protected childrenCreated(): void {
			Utils.toStageBestScaleHeigt(this);
			// this.width = egret.MainContext.instance.stage.stageWidth;
			// this.height = egret.MainContext.instance.stage.stageHeight;
			this.touchEnabled = false;

			this.m_conTop.width = this.width - 530;
			this.maxCout = Math.floor((this.m_conTop.width + 25) / (FunctionActiWidget.WIDTH + 25));
			this.initFunctionIcon();
			this.initActivityIcon();
			this.refreshSceneView();
			this.initEvent();

			this.validateNow();

			if (GameConfig.getIsNotchScreen()) {
				this.m_pMissionTipsViewRoot.left += GameConfig.notchPixel;

				this.m_pMoreBtn.right += GameConfig.notchPixel;
				this.m_conMoreRoot.right += GameConfig.notchPixel;
				this.m_conRight.right += GameConfig.notchPixel;
				this.m_sceneGroup.right += GameConfig.notchPixel;
				this.m_conBottom.right += GameConfig.notchPixel;

			}

			/**检查新手引导面板条件 */
			this.onGuideCondition();
		}

		/**
         * 销毁方法
         */
		public onDestroy() {
			this.removeEvent();
			egret.Tween.removeTweens(this.m_conMoreRoot);
			if (this.m_pBIcons) {
				this.clearIconByList(this.m_pBIcons);
				this.m_pBIcons = null;
			}
			if (this.m_pTIcons) {
				this.clearIconByList(this.m_pTIcons);
				this.m_pTIcons = null;
			}
			if (this.m_pRIcons) {
				this.clearIconByList(this.m_pRIcons);
				this.m_pRIcons = null;
			}
			if (this.m_pRIconSecs) {
				this.clearIconByList(this.m_pRIconSecs);
				this.m_pRIconSecs = null;
			}
			if (this.m_pHideIcons) {
				this.clearIconByList(this.m_pHideIcons);
				this.m_pHideIcons = null;
			}
			Utils.removeFromParent(this);
		}

		/**清理按钮 */
		private clearIconByList(list: any[]) {
			if (list) {
				while (list.length > 0) {
					let icon: any = list.pop();
					if (icon.onDestroy && typeof icon.onDestroy == "function") {
						icon.onDestroy();
					}
					if (icon.parent) {
						Utils.removeFromParent(icon);
					} else {
						//没有父节点 不会触发移除场景方法回调 红点未移除
						RedPointModel.RemoveInfoListenerByCode(icon.m_pConIcon.hashCode);
					}
				}
			}
		}

		/**初始化 功能按钮 */
		private initFunctionIcon() {
			let funcList = FunctionModel.getOpenFunctionList();
			let icons: { [id: number]: number[] } = {};
			for (let i = 0; i < funcList.length; i++) {
				let ft = funcList[i];
				let cfg = FunctionModel.getFunctionCfgById(ft);
				if (cfg == null) continue;

				let btnCfg = C.FunctionBtnConfig[cfg.btnType];
				if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE) continue;
				if (!icons[btnCfg.id]) icons[btnCfg.id] = [];
				icons[btnCfg.id].push(ft);
			}
			for (let key in icons) {
				let iconId = Number(key);
				this.createFuncIcon(iconId, icons[key]);
			}
		}
		/**创建功能按钮 */
		private createFuncIcon(iconId: number, ft: number[]) {
			let widget = this.getWidgetByBtnId(iconId);
			if (!widget) {
				widget = FunctionModel.createFuncIconWidget(iconId);
				let btnCfg = C.FunctionBtnConfig[iconId];
				this.addChildIcon(widget);
			}
			widget.addItemId(ft);
		}


		/**初始化活动按钮 */
		private initActivityIcon() {
			let activityList = ActivityModel.getCurActivityList();
			//id:number - 活动类型[]
			let icons: { [id: number]: number[] } = {};
			for (let i = 0; i < activityList.length; i++) {
				let info = activityList[i];
				if (!info.isOpenIcon()) continue;
				let btnCfg = C.FunctionBtnConfig[info.btnId];;
				if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE) continue;
				if (!icons[btnCfg.id]) icons[btnCfg.id] = [];
				icons[btnCfg.id].push(info.viewType);
			}

			for (let key in icons) {
				let iconId = Number(key);
				let widget = this.getWidgetByBtnId(iconId);
				if (!widget) {
					widget = FunctionModel.createActivityIconWidget(iconId);
					this.addChildIcon(widget);
				}
				widget.addItemId(icons[key]);

			}
		}


		/**添加按钮 */
		private addChildIcon(widget: FunctionWidgetBase) {
			if (widget == null) return;
			if (widget.pos == FunctionPosType.FPT_TOP && widget.scene != 0 && widget.scene != SceneManager.getCurrScene()) {
				this.hideIcon(widget);
				return;
			}
			let layer: eui.Group;
			let list: FunctionWidgetBase[];

			switch (widget.pos) {
				case FunctionPosType.FPT_RIGHT: {
					list = this.m_pRIcons;
					layer = this.m_conRight;
					break;
				}
				case FunctionPosType.FPT_RIGHT_II: {
					list = this.m_pRIconSecs;
					layer = this.m_conRightSec;
					break;
				}
				case FunctionPosType.FPT_BOTTOM: {
					list = this.m_pBIcons;
					layer = this.m_conBottom;
					break;
				}
				default: {
					list = this.m_pTIcons;
					layer = this.m_conTop;
					break;
				}
			}
			if (!list) return;
			if (this.getWidgetInListByBtnId(list, widget.btnId)) return;

			//移除隐藏按钮
			this.removeIconInList(this.m_pHideIcons, widget);

			list.push(widget);
			// Utils.addChild(layer, widget);
			let isInsert = true;

			for (let i = 0; i < layer.numElements; i++) {
				let ele = layer.getElementAt(i) as FunctionWidgetBase;

				if (widget.posPriority < ele.posPriority) {
					isInsert = false;
					layer.addChildAt(widget, i);
					break;
				}
			}
			if (isInsert) {
				layer.addChild(widget);
			}
			if(layer == this.m_conTop) this.sortTopIcon();
			layer.validateNow();
		}
		/**顶栏元素再次排序 */
		private sortTopIcon() {
			let layer = this.m_conTop;
			let topRight = [];	//顶栏固定节点
			for (let i = 0; i < layer.numElements; i++) {
				let ele = layer.getElementAt(i) as FunctionWidgetBase;
				if (ele.isInId(AcViewType.FIRST_RECHARGE) || ele.isInId(AcViewType.NEW_GEN_VIS)) {
					topRight.push(ele);
				}
			}
			topRight.sort((a, b) => {
				return  b.posPriority - a.posPriority;
			});

			for (let i = 0; i < topRight.length; i++) {
				layer.setChildIndex(topRight[i], this.maxCout - topRight.length)
			}
		}
		/**保证首充按钮在第一行末尾 */
		// public updateFirstPos(layer: eui.Group, list: FunctionWidgetBase[]) {
		// 	let calcuLen = list.length * FunctionActiWidget.WIDTH + (list.length - 1) * 25;
		// 	if (this.maxActWidth > calcuLen) return;//一排摆的下不需要处理
		// 	let numE: number = layer.numElements;
		// 	if (this.maxCout >= numE) return;
		// 	for (let i = 0; i < numE; i++) {
		// 		let ele = layer.getElementAt(i) as FunctionWidgetBase;
		// 		if (ele.isInId(AcViewType.FIRST_RECHARGE)) {
		// 			if (i != this.maxCout - 1) layer.setChildIndex(ele, this.maxCout - 1)
		// 			break;
		// 		}
		// 	}

		// }
		/**移除按钮 */
		private removeIcon(widget: FunctionWidgetBase) {
			if (widget == null) return;
			Utils.removeFromParent(widget);
			/**顶部  一般活动按钮*/
			let index = this.m_pTIcons.indexOf(widget);
			if (index >= 0) {
				this.m_pTIcons.splice(index, 1);
				this.sortTopIcon();
				return;
			}
			/**右侧 */
			index = this.m_pRIcons.indexOf(widget);
			if (index >= 0) {
				this.m_pRIcons.splice(index, 1);
				return;
			}
			/**右侧2 */
			index = this.m_pRIconSecs.indexOf(widget);
			if (index >= 0) {
				this.m_pRIconSecs.splice(index, 1);
				return;
			}
			/**底部 */
			index = this.m_pBIcons.indexOf(widget);
			if (index >= 0) {
				this.m_pBIcons.splice(index, 1);
				return;
			}

			/**隐藏按钮 */
			index = this.m_pHideIcons.indexOf(widget);
			if (index >= 0) {
				this.m_pHideIcons.splice(index, 1);
				return;
			}
		}

		/**根据功能按钮类型获取相应的部件 */
		public getWidgetByBtnId(id: number): FunctionWidgetBase {
			let cfg = C.FunctionBtnConfig[id];
			if (!cfg) return null;
			switch (cfg.pos) {
				case FunctionPosType.FPT_RIGHT: {
					return this.getWidgetInListByBtnId(this.m_pRIcons, id);
				}
				case FunctionPosType.FPT_RIGHT_II: {
					return this.getWidgetInListByBtnId(this.m_pRIconSecs, id);
				}
				case FunctionPosType.FPT_BOTTOM: {
					return this.getWidgetInListByBtnId(this.m_pBIcons, id);
				}
				case FunctionPosType.FPT_TOP: {
					return this.getWidgetInListByBtnId(this.m_pTIcons, id);
				}
			}

			return this.getWidgetInListByBtnId(this.m_pHideIcons, id);
		}

		/**判断按钮是否存在于队里中 */
		private getWidgetInListByBtnId(list: any[], btnId: number) {
			if (list && list.length) {
				for (let i = 0; i < list.length; i++) {
					let widget = <FunctionWidgetBase>list[i];
					if (widget.btnId == btnId) {
						return widget;
					}
				}
			}
		}

		/**获取背包按钮 */
		public static getBagViewIcon() {
			let obj = this.getClass();
			if (obj) {
				return obj.m_conBottom.getElementAt(4) as FunctionWidgetBase;
			}
		}
		private onFirstStateChange(type: number) {
			let vo = ActivityModel.getActivityVo<ActivityVo>(type);
			if (vo == null) return;
			let widget = this.getWidgetByBtnId(vo.btnId) as FunctionActiWidget;
			if (widget) widget.updateIncon();
		}
		/**活动改变 */
		private onActivityStateChange(type: number) {
			let vo = ActivityModel.getActivityVo<ActivityVo>(type);
			if (vo == null) return;
			let isOpen = vo.isOpenIcon();
			let widget = this.getWidgetByBtnId(vo.btnId) as FunctionActiWidget;
			/**活动关闭 */
			if (isOpen == false) {
				/**移除关联活动id */
				if (widget) {
					widget.removeItemId(type);
					if (widget.isActiviyEnd()) {
						this.removeIcon(widget);
					}
				}
			} else {
				if (!widget) {
					let btnCfg = C.FunctionBtnConfig[vo.btnId];
					if (!btnCfg) return;
					widget = FunctionModel.createActivityIconWidget(btnCfg.id);
					this.addChildIcon(widget);
				}
				widget.addItemId([type]);
			}

		}

		/**场景状态改变 */
		private refreshSceneView() {
			this.visible = true;
			switch (SceneManager.getCurrScene()) {
				case SceneEnums.WORLD_XIANGYANG_CITY: {
					this.currentState = "xiangyang"
					break;
				}
				case SceneEnums.MAIN_CITY: {
					this.currentState = 'scene';
					break;
				}
				case SceneEnums.WORLD_CITY: {
					this.currentState = 'world';
					break;
				}
				case SceneEnums.AUTO_BATTLE_MAP: {
					this.currentState = 'hang';
					break;
				}
				default: {
					this.currentState = 'base';
					break;
				}

			}
			this.refreshIconInScene();
		}

		/**按钮显示 */
		private refreshIconInScene() {
			this.refreshIconInList(this.m_pTIcons);
			this.refreshIconInList(this.m_pHideIcons);
		}

		/**判断按钮是否存在于队里中 */
		private refreshIconInList(list: any[]) {
			if (list && list.length) {
				for (let i = list.length - 1; i >= 0; i--) {
					let widget = <FunctionWidgetBase>list[i];
					this.addChildIcon(widget);
				}
			}
		}


		/**隐藏按钮 */
		private hideIcon(widget: FunctionWidgetBase) {
			if (this.getWidgetInListByBtnId(this.m_pHideIcons, widget.btnId)) return;
			Utils.removeFromParent(widget);
			this.removeIconInList(this.m_pTIcons, widget);
			this.m_pHideIcons.push(widget);
		}

		/**移除按钮 */
		private removeIconInList(list: FunctionWidgetBase[], widget: FunctionWidgetBase) {
			//移除隐藏按钮
			for (let i = 0; i < list.length; i++) {
				if (list[i].btnId == widget.btnId) {
					list.splice(i, 1);
					widget.initRedPointEvt();
					return;
				}
			}
		}
		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private initEvent() {


			//挂机
			EventManager.addTouchScaleListener(this.m_pHangBtn, this, () => {
				SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
			});
			//世界
			EventManager.addTouchScaleListener(this.m_pWorldBtn, this, () => {
				WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY)
			});
			//主城市
			EventManager.addTouchScaleListener(this.m_pSceneBtn, this, () => {
				if (FunctionModel.isFunctionOpenWithWarn(FunctionType.MAIN_MAP)) {
					SceneManager.enterScene(SceneEnums.MAIN_CITY);
				};
			});

			//更多按钮
			EventManager.addTouchScaleListener(this.m_pMoreBtn, this, () => {
				egret.Tween.removeTweens(this.m_conMoreRoot);
				let tw = egret.Tween.get(this.m_conMoreRoot);

				if (this.m_conMoreRoot.visible) {
					tw.to({ scaleX: 0, scaleY: 0, alpha: 0.3 }, 300, Ease.quadOut);
					tw.call(() => {
						this.m_conMoreRoot.visible = false;
					}, this)
				} else {
					this.m_conMoreRoot.visible = true;
					this.m_conMoreRoot.alpha = 0.3;
					NodeUtils.setScale(this.m_conMoreRoot, 0);
					tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, Ease.quadOut);
				}
			});


			EventMgr.addEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.onActivityStateChange, this);
			EventMgr.addEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.onFirstStateChange, this);
			EventMgr.addEvent(SceneEvent.CHANGE_COMPLETE, this.onChangeScene, this);
			EventMgr.addEvent(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this.removeFunc, this);
			EventMgr.addEvent(FunctionEvent.NEW_FUNC_OPEN, this.onNewFunc, this);
			// EventMgr.addEvent(FunctionEvent.NEW_PRE_FUNC_OPEN, this.onNewPreFunc, this);

			//挂机按钮红点监听
			RedPointModel.AddInfoListener(this.m_pHangBtn, { x: 63, y: 4, scale: 0.78 },
				[RedEvtType.PATROL, RedEvtType.BOSS_RANK, RedEvtType.BOSS_SINGLE, RedEvtType.BOSS_WORLD],
				2);
			//更多按钮红点监听
			RedPointModel.AddInfoListener(this.m_pMoreBtn, { x: 50, y: 4, scale: 0.78 }, [RedEvtType.CORN, RedEvtType.CORN_AWARD, RedEvtType.MAIL, RedEvtType.FIGHT_RANK_WORSHIP], 2);
			//主城红点监听
			RedPointModel.AddInfoListener(this.m_pSceneBtn, { x: 63, y: 4, scale: 0.78 },
				[RedEvtType.PASS_WAR, RedEvtType.PVP_ARENA, RedEvtType.MATER_WAR, RedEvtType.HEAD_QUATER, RedEvtType.HISTORY_WAR], 2);
			//主城建筑队列红点监听
			RedPointModel.AddInfoListener(this.m_mrp, { x: 0, y: 0, scale: 1 },
				[RedEvtType.QUE_BUILD], 5);
			//世界警报红点
			RedPointModel.AddInfoListener(this.m_pWorldRed, { x: 0, y: 0, scale: 1 }, [RedEvtType.WARN], 6);
			//世界红点
			RedPointModel.AddInfoListener(this.m_pWorldBtn, { x: 63, y: 4, scale: 0.78 }, [RedEvtType.EXPLOIT, RedEvtType.TASK_COUNTRY], 2, { countryState: 1, countryWorld: true });
		}

		private removeEvent() {
			EventMgr.removeEventByObject(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this);
			EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_CLOSE, this);
			EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
			EventMgr.removeEventByObject(FunctionEvent.NEW_FUNC_OPEN, this);
			EventMgr.removeEventByObject(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this);
		}
		public removeFunc(ft: FunctionType) {
			let funcCfg: FunctionConfig = FunctionModel.getFunctionCfgById(ft);
			if (!funcCfg) return 0;
			let btnCfg: FunctionBtnConfig = C.FunctionBtnConfig[funcCfg.btnType];
			if (!btnCfg) return;
			let widget = MainTopOther.getWidgetByBtnId(btnCfg.id);
			this.removeIcon(widget);
		}
		/**新功能开启 */
		public onNewFunc(data: { funcId: number, show: boolean }) {
			let funcCfg: FunctionConfig = C.FunctionConfig[data.funcId];
			if (!funcCfg) return;
			let btnCfg: FunctionBtnConfig = C.FunctionBtnConfig[funcCfg.btnType];
			if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE) return;
			let widget = this.getWidgetByBtnId(btnCfg.id);
			if (widget) return;

			this.createFuncIcon(btnCfg.id, [data.funcId]);
			widget = this.getWidgetByBtnId(btnCfg.id);
			if (widget) widget.visible = data.show;
		}
		/**场景状态改变 */
		public onChangeScene() {
			this.refreshSceneView();
		}

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_OTHER);
		}

		/**=====================================================================================
		 * 静态对象 begin
		 * =====================================================================================
		 */


		/**根据功能号获得按钮 */
		public static getWidgetByBtnId(btnId: number) {
			let obj = this.getClass();
			if (obj) return obj.getWidgetByBtnId(btnId);
		}

		/**全局获取静态对象 */
		public static getClass(): MainTopOther {
			let obj = SceneManager.getClass(LayerEnums.MENU, MainTopOther.NAME);
			return obj;
		}


		/**=====================================================================================
		 * 静态对象 end
		 * =====================================================================================
		 */

	}
}
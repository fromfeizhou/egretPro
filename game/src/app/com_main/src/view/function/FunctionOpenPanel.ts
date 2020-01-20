// module com_main {
// 	export class FunctionOpenPanel extends CView {
// 		public static NAME = 'FunctionOpenPanel';

// 		/** 功能号 */
// 		private m_pFt: number = -1;
// 		/** 中间的图标 */
// 		private m_pCenterIcon: egret.DisplayObject;
// 		/**说明文字 */
// 		private m_pLBDesc: eui.Label;
// 		/**是否需要移除定时器 */
// 		private m_pNeedRemoveTimer = false;

// 		public static m_pIsShow = false;

// 		private m_pIsDestroy = false;

// 		public constructor(ft: number) {
// 			super();
// 			// this.name = FunctionOpenPanel.NAME;
// 			// this.initApp("function/function_panel.exml");
// 			// this.m_pFt = ft;
// 			this.visible = false;
// 		}

// 		public onDestroy() {
// 			this.m_pIsDestroy = true;
// 			if (this.m_pNeedRemoveTimer) {
// 				Utils.TimerManager.remove(this.autoClick, this);
// 			}

// 			// FunctionManager.onFunctionPanelClosed(this.m_pFt, this.getCenterIconGlobalPos());

// 			let ft = this.m_pFt;
// 			if (this.m_pCenterIcon != null) {
// 				this.removeChild(this.m_pCenterIcon);
// 				this.m_pCenterIcon == null;
// 			}

// 			EventManager.removeEventListeners(this);
// 			super.onDestroy();
// 			Utils.removeFromParent(this);
// 			FunctionOpenPanel.m_pIsShow = false;
// 			console.log("FunctionOpenPanel: Guide.startGuide()");
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();

// 			FunctionOpenPanel.m_pIsShow = true;
// 			console.log("FunctionOpenPanel: GuideUI.hide()");

// 			// this.m_pCenterIcon = FunctionManager.createNoticImg(this.m_pFt);
// 			// if (this.m_pCenterIcon != null) {
// 			// 	this.addChild(this.m_pCenterIcon);
// 			// 	this.m_pCenterIcon.anchorOffsetX = this.m_pCenterIcon.width / 2;
// 			// 	this.m_pCenterIcon.anchorOffsetY = this.m_pCenterIcon.height / 2;
// 			// 	this.m_pCenterIcon.x = this.width / 2;
// 			// 	this.m_pCenterIcon.y = this.height / 2;
// 			// }

// 			let cfg = FunctionModel.getFunctionCfgById(this.m_pFt);
// 			if (cfg && this.m_pLBDesc && this.m_pLBDesc.text) {
// 				Utils.setTextByLanguageKey(cfg.content, this.m_pLBDesc, GCode(CLEnum.NO_DES));
// 			}

// 			let data: any = {};
// 			data.ft = this.m_pFt;
// 			let pos: egret.Point = new egret.Point();
// 			this.localToGlobal(this.m_pCenterIcon.x, this.m_pCenterIcon.y, pos);
// 			debug("FunctionOpenPanel", "before x:" + this.m_pCenterIcon.x, "before y: ", this.m_pCenterIcon.y, "after: ", pos);
// 			data.pos = pos;
// 			EventMgr.dispatchEvent(TASK_EVT.POP_FUNCTION_PANEL_OPENED, data);
// 			if (this.m_pIsDestroy == false) {
// 				// 2秒后自动关闭当前界面
// 				Utils.TimerManager.doTimer(2000, 1, this.autoClick, this);
// 				this.m_pNeedRemoveTimer = true;
// 			}

// 			EventManager.addTouchTapListener(this, this, this.onClick);
// 		}

// 		private onClick() {
// 			this.onDestroy();
// 		}

// 		private autoClick() {
// 			this.m_pNeedRemoveTimer = false;
// 			this.onClick();
// 		}

// 		private getCenterIconGlobalPos() {
// 			let pos: egret.Point = new egret.Point();
// 			this.localToGlobal(this.m_pCenterIcon.x, this.m_pCenterIcon.y, pos);
// 			return pos;
// 		}

// 		public static getClass(): FunctionOpenPanel {
// 			let obj = SceneManager.getClass(LayerEnums.POPUP, FunctionOpenPanel.NAME);
// 			return obj;
// 		}

// 		public static getCenterIconGlobalPos() {
// 			let obj = SceneManager.getClass(LayerEnums.POPUP, FunctionOpenPanel.NAME);
// 			if (obj) {
// 				return obj.getCenterIconGlobalPos();
// 			}
// 		}
// 	}
// }
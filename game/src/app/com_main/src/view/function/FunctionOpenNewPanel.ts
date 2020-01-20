module com_main {
	export class FunctionOpenNewPanel extends CView {
		public static NAME = 'FunctionOpenNewPanel';

		public m_pRoot: eui.Group;
		public m_pName: com_main.CLabel;
		public m_pDesc: com_main.CLabel;
		public m_pIconRoot: eui.Group;
		public m_pIco: com_main.CImage;

		private m_nFuncId: number;
		private m_pNewFlyWidget: FunctonSimpleWidget;	//飞行动画
		private m_bInClick: boolean;

		public constructor(id: number) {
			super();
			this.m_nFuncId = id;
			this.initApp("function/FunctionOpenNewPanelcSkin.exml");
		}

		public onDestroy() {
			if (this.m_pNewFlyWidget) {
				egret.Tween.removeTweens(this.m_pNewFlyWidget);
				let btnId = this.getBtnCfgId();
				if (btnId > 0) {
					let widget = MainTopOther.getWidgetByBtnId(btnId);
					if (widget) widget.visible = true;
				}
				this.m_pNewFlyWidget = null;
			}

			egret.Tween.removeTweens(this.m_pRoot);

			this.removeEvent();
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.initEvent();
			this.updateUI();
		}
		public updateUI() {
			let funcCfg: FunctionConfig = FunctionModel.getFunctionCfgById(this.m_nFuncId);
			if (!funcCfg)
				return;
			this.m_pName.text = funcCfg.name;
			this.m_pDesc.textFlow = Utils.htmlParser(GLan(funcCfg.text));
			this.m_pIco.source = FunctionModel.getBtnSource(this.m_nFuncId);
		}

		/**获得有ui固定位置 的功能 按钮id */
		private getBtnCfgId() {
			let funcCfg: FunctionConfig = C.FunctionConfig[this.m_nFuncId];
			if (!funcCfg) return 0;

			let btnCfg: FunctionBtnConfig = C.FunctionBtnConfig[funcCfg.btnType];
			if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE) return 0;
			return btnCfg.id;
		}

		/**=====================================================================================
	   	* 事件监听 begin
	   	* =====================================================================================
	   	*/

		private initEvent() {
			EventManager.addTouchTapListener(this, this, this.onMaskHandler);
		}

		private removeEvent() {

		}

		/**点击回调 */
		private onMaskHandler() {
			//只执行一次
			if (this.m_bInClick) return;
			this.m_bInClick = true;

			//没有对应布局 不需要动画
			let btnId = this.getBtnCfgId();
			if (btnId == 0) {
				UpManager.history();
				return;
			}

			//已经存在的按钮 不需要动画
			let widget = MainTopOther.getWidgetByBtnId(btnId);
			if (widget) {
				UpManager.history();
				return;
			}

			let tw = egret.Tween.get(this.m_pRoot);
			tw.to({ alpha: 0 }, 300, Ease.sineOut);

			//创建对象(不可见)
			EventMgr.dispatchEvent(FunctionEvent.NEW_FUNC_OPEN, { funcId: this.m_nFuncId, show: false });
			// FunctionModel.addNewFunc(this.m_nFuncId);
			widget = MainTopOther.getWidgetByBtnId(btnId);

			this.m_pIconRoot.visible = false;

			this.m_pNewFlyWidget = FunctionModel.createFuncIconWidget(btnId, false);
			let pos: egret.Point = this.m_pIconRoot.localToGlobal(this.m_pIco.x + this.m_pIco.width * 0.5, this.m_pIco.y + this.m_pIco.height * 0.5);
			this.globalToLocal(pos.x, pos.y, pos);
			NodeUtils.setPosition(this.m_pNewFlyWidget, pos.x, pos.y);
			this.addChild(this.m_pNewFlyWidget);

			let target: egret.Point = new egret.Point(widget.x, widget.y);
			widget.parent.localToGlobal(target.x, target.y, target);
			this.globalToLocal(target.x, target.y, target);

			let flyTw = egret.Tween.get(this.m_pNewFlyWidget);
			flyTw.wait(300)
			flyTw.to({ x: target.x, y: target.y }, 800, Ease.sineOut)
			flyTw.call(() => {
				Utils.removeFromParent(this.m_pNewFlyWidget);
				widget.visible = true;
				this.m_pNewFlyWidget = null;
				UpManager.history();
			});

		}
		/**=====================================================================================
		* 事件监听 end
	   	* =====================================================================================
	   	*/

	}
}
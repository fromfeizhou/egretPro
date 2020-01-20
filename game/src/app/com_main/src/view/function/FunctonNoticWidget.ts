// /**
//  * 功能开启预告
//  */
// module com_main {
// 	export class FunctonNoticWidget extends FunctionWidgetBase {

// 		public static NAME = "FunctonNoticWidget";

// 		/**功能号 */
// 		private m_pft: number = -1;

// 		private m_pGroup: eui.Group;
// 		// 预告功能名称
// 		private m_pLbFnDesc: eui.Label;
// 		// 预告说明
// 		private m_pLbDesc: eui.Label;
// 		// 背景
// 		private m_pBg: eui.Image;

// 		public constructor() {
// 			super();
// 			this.skinName = Utils.getSkinName("app/function/function_notice_widget.exml");
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			EventManager.addTouchScaleListener(this, this, this.onClickSelf);
// 		}

// 		public onDestroy() {
// 			super.onDestroy();
// 		}

// 		/**初始化 */
// 		public initWidget(functionType: FunctionType) {
// 			this.m_pft = functionType;
// 			let cfg = FunctionModel.getFunctionCfgById(functionType);
// 			let cfgBtn = FunctionModel.getBtnCfgByFuntionType(functionType);

// 			if (cfg == null || cfgBtn == null) {
// 				return;
// 			}

// 			super.initWidget(cfg.btnType);

// 			this.m_pBg.source = cfgBtn.iconName != '' ? `${cfgBtn.iconName}_png` : '';
// 			// 功能名称
// 			this.m_pLbFnDesc.text = "";// + cfg.desc;
// 			// 开启等级
// 			this.m_pLbDesc.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT,cfg.openLevel);
// 		}

// 		/**点击 */
// 		private onClickSelf() {
// 			Utils.open_view(TASK_UI.POP_FUNCITON_NOTIC_VIEW, this.m_pft);
// 		}
// 	}
// }
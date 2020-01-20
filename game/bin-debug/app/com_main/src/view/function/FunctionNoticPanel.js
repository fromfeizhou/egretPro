// /**
//  * 功能预告面板
//  */
// module com_main {
// 	export class FunctionNoticPanel extends CView {
// 		public static NAME = 'FunctionNoticPanel';
// 		/** 功能号 */
// 		private m_pFt: number = -1;
// 		/** 中间的图标 */
// 		private m_pCenterIcon: egret.DisplayObject;
// 		/**预告标题 */
// 		private m_pLbNoticTitle: eui.Label;
// 		/**说明文字 */
// 		private m_pLbContent: eui.Label;
// 		public constructor(ft: number) {
// 			super();
// 			this.name = FunctionOpenPanel.NAME;
// 			this.initApp("function/function_notic_panel.exml");
// 			this.m_pFt = ft;
// 		}
// 		public onDestroy() {
// 			let ft = this.m_pFt;
// 			if (this.m_pCenterIcon != null) {
// 				this.removeChild(this.m_pCenterIcon);
// 				this.m_pCenterIcon == null;
// 			}
// 			super.onDestroy();
// 			//Guide.startGuide();
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			//GuideUI.hide();
// 			this.m_pCenterIcon = FunctionManager.createNoticWidget(this.m_pFt);
// 			if (this.m_pCenterIcon != null) {
// 				this.addChild(this.m_pCenterIcon);
// 				this.m_pCenterIcon.anchorOffsetX = this.m_pCenterIcon.width / 2;
// 				this.m_pCenterIcon.anchorOffsetY = this.m_pCenterIcon.height / 2;
// 				this.m_pCenterIcon.x = this.width / 2;
// 				this.m_pCenterIcon.y = this.height / 2;
// 			}
// 			let cfg = FunctionModel.getFunctionCfgById(this.m_pFt);
// 			if (cfg) {
// 				Utils.setTextByLanguageKey(cfg.content, this.m_pLbContent,GCode(CLEnum.NO_DES));
// 				// let noticContent = GLan(cfg.noticContent);
// 				// noticContent = format(noticContent, cfg.openLevel);
// 				// this.m_pLbNoticTitle.text = noticContent;
// 			}
// 		}
// 	}
// }

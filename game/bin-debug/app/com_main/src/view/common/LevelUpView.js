// module com_main {
// 	/**
// 	 * 升级界面
// 	 */
// 	export class LevelUpView extends CView {
// 		public static NAME = "LevelUpView";
// 		private m_imgEffect: com_main.CImage;
// 		private m_lbLevel: eui.Label;
// 		private m_gContent: eui.Group;
// 		private m_imgFont1: com_main.CImage;
// 		private m_imgFont2: com_main.CImage;
// 		private m_imgFont3: com_main.CImage;
// 		private m_imgFont4: com_main.CImage;
// 		private m_imgFontList = [];
// 		private m_effectUp: com_main.SpriteAnimation;
// 		private m_txtList = [];
// 		private m_callback: Function;
// 		private m_thisArg: any;
// 		private m_level: number;
// 		private m_pIsClose: boolean = false;
// 		/**动画是否播放完 */
// 		private m_isActionFinish: boolean = false;
// 		public static m_pIsShow = false;
// 		public constructor(level) {
// 			super();
// 			this.name = LevelUpView.NAME;
// 			this.initApp("common/com_level_up.exml");
// 			this.m_level = level;
// 			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
// 			GuideUI.hide();
// 			LevelUpView.m_pIsShow = true;
// 		}
// 		public onDestroy(): void {
// 			if (this.m_pIsClose) return;
// 			this.m_pIsClose = true;
// 			super.onDestroy();
// 			UpManager.IsClickBackClose = true;
// 			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
// 			Utils.TimerManager.removeAll(this);
// 			if (this.m_effectUp) {
// 				this.m_effectUp.removeAction();
// 				this.m_effectUp = null;
// 			}
// 			if (this.m_txtList) {
// 				let len = this.m_txtList.length;
// 				for (let i: number = 0; i < len; i++) {
// 					let txt = this.m_txtList[i];
// 					if (txt)
// 						Utils.removeFromParent(txt);
// 				}
// 				this.m_txtList = null;
// 			}
// 			this.m_imgFontList = null;
// 			LevelUpView.m_pIsShow = false;
// 			Guide.startGuide();
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.width = GameConfig.curWidth();
// 			this.height = GameConfig.curHeight();
// 			UpManager.IsClickBackClose = false;
// 			this.m_imgFontList.push(this.m_imgFont1);
// 			this.m_imgFontList.push(this.m_imgFont2);
// 			this.m_imgFontList.push(this.m_imgFont3);
// 			this.m_imgFontList.push(this.m_imgFont4);
// 			this.m_effectUp = ImageEffect.load_2(IETypes.EUI_LevelUp, () => {
// 				Utils.TimerManager.doTimer(300, 1, () => {
// 					this.showLevel(this.m_level);
// 				}, this);
// 				Utils.TimerManager.doTimer(200, 1, () => {
// 					this.showWish();
// 				}, this);
// 				Utils.TimerManager.doTimer(2000, 1, () => {
// 					this.m_isActionFinish = true;
// 					UpManager.IsClickBackClose = true;
// 				}, this);
// 				Utils.TimerManager.doTimer(2000, 1, () => {
// 					UpManager.history();
// 					if (this.m_callback && this.m_thisArg)
// 						this.m_callback.call(this.m_thisArg);
// 				}, this);
// 			}, this);
// 			this.m_effectUp.successIsReset = false;
// 			this.m_effectUp.addBitmap(this.m_imgEffect);
// 			// ImageEffect.runAction(this.m_imgEffect);
// 			// CEffectFunc.stampSingleAction(this.m_lbLevel);
// 		}
// 		private showWish() {
// 			CEffectFunc.stampAction(this.m_imgFontList);
// 		}
// 		private showLevel(level) {
// 			let strLevel: String = level + "";
// 			let len = strLevel.length;
// 			for (let i: number = 0; i < len; i++) {
// 				let str = strLevel[i];
// 				let txt = new eui.Label(); //let txt: egret.BitmapText = new egret.BitmapText();
// 				// txt.font = RES.getRes("font_num_20_fnt");
// 				txt.size = 120;
// 				txt.textColor = GameConfig.TextColors.goldYellow;
// 				txt.text = str;
// 				txt.fontFamily = GameConfig.fontDefault;
// 				txt.anchorOffsetX = txt.width * 0.5;
// 				txt.anchorOffsetY = txt.height * 0.5;
// 				txt.stroke = 2;
// 				txt.bold = true;
// 				txt.x = 360 - ((len - 1) * txt.width * 0.8) + (txt.width * 1.5) * i + (txt.width * 0.5);
// 				txt.y = this.m_lbLevel.y; //710;
// 				Utils.addChild(this, txt);
// 				this.m_txtList.push(txt);
// 			}
// 			CEffectFunc.levelUpAction(this.m_txtList);
// 		}
// 		private onTap() {
// 			if (this.m_isActionFinish) {
// 				UpManager.history();
// 				if (this.m_callback && this.m_thisArg)
// 					this.m_callback.call(this.m_thisArg);
// 			}
// 		}
// 	}
// }

module com_main {
	export class APopUp extends eui.Component {

		public static NAME: string = "APopCom";

		private m_pCloseBtn: com_main.CImage;
		private m_pTitle: com_main.CImage;
		private m_pTitleLabel: eui.Label;
		private m_pBackBtn: com_main.CImage;
		private m_phelp: com_main.CImage;
		private m_pIcon: com_main.CImage;
		private m_pDesc: eui.Label;
		private m_pPvpBg: CImage;   //Pvp排行耪

		private m_BottomBorder: CImage;
		// private m_pBackBtn: com_main.CImage;
		// private m_pTitleLbl: eui.Label;

		public isSuper: boolean = false;
		private m_pOnlyClose: boolean = false;
		private funcObj: any;
		private funcSelect: Function;

		private backBtnfunObj: any;
		private backBtnfun: Function;

		private closeCallback: Function;
		private closeObj: any;

		private bInitEvent:boolean;

		public constructor() {
			super();
			this.name = APopUp.NAME;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.validateNow();
			// debug("childrenCreated");

			this.initEvent();
		}

		public initEvent(){
			if(this.bInitEvent) return;
			this.bInitEvent = true;

			if (this.m_pCloseBtn)
				this.m_pCloseBtn["sound_cancel"] = SoundData.getCancelSound();
			EventManager.addTouchScaleListener(this.m_pCloseBtn, this, this.onCloseClick);

			if (this.m_pBackBtn) {
				this.m_pBackBtn["sound_cancel"] = SoundData.getCancelSound();
				EventManager.addTouchScaleListener(this.m_pBackBtn, this, this.onBackClick);
				this.historyShow = false;
			}
		}

		$onRemoveFromStage(): void {
			this.bInitEvent = false;
			EventManager.removeEventListeners(this);
			super.$onRemoveFromStage();
		}

		/**设置是否在队里中 （不在upmanger 队列中的面板 this.m_pOnlyClose = true）*/
		public set historyShow(show: boolean) {
			if (this.m_pBackBtn)
				this.m_pBackBtn.visible = show;
			this.m_pOnlyClose = !show;
		}

		public set titleShow(show: boolean) {
			if (this.m_pTitle) {
				this.m_pTitle.visible = show;
			}
		}

		public set Desc(desc: string) {
			if (this.m_pDesc) {
				this.m_pDesc.text = desc;
			}
		}

		public set iconShow(show: boolean) {
			if (this.m_pIcon) {
				this.m_pIcon.visible = show;
			}
			if (show == false) {
				this.m_pTitle.right = 28;
			}
		}

		private onCloseClick(e: egret.TouchEvent) {
			// debug("onCloseClick");
			if (this.m_pOnlyClose) {
				if (this.closeCallback && this.closeObj)
					this.closeCallback.call(this.closeObj);
				else
					UpManager.close(false, this.isSuper);
			} else {
				this.onBackClick(e);
			}
			e.stopImmediatePropagation();
		}

		private onBackClick(e: egret.TouchEvent) {

			if (this.funcSelect) {
				this.funcSelect.call(this.funcObj);
			} else {
				UpManager.history();
			}
			e.stopImmediatePropagation();
		}


		public addBackListener(obj: any, func: Function) {
			this.funcObj = obj;
			this.funcSelect = func;
		}

		public removeBackListener() {
			this.funcObj = null;
			this.funcSelect = null;
		}

		public addCloseListener(obj: any, func: Function) {
			this.closeObj = obj;
			this.closeCallback = func;
		}

		public removeCloseListener() {
			this.closeObj = null;
			this.closeCallback = null;
		}


		public static getPopUp(panel: any) {
			if (panel) {
				return <APopUp>(panel.getChildByName(APopUp.NAME));
			}
			return null;
		}

		public static setTitle(panel: any, title: string, historyShow: boolean = true) {
			var popUpComponent: APopUp = APopUp.getPopUp(panel);
			if (popUpComponent) {
				popUpComponent.setTitleImg(title);
				popUpComponent.historyShow = historyShow;
			}
		}

		public static setTitleLabel(panel: any, title: string, historyShow: boolean = true) {
			var popUpComponent: APopUp = APopUp.getPopUp(panel);
			if (popUpComponent) {
				popUpComponent.setTitleLabel(title);
				popUpComponent.historyShow = historyShow;
			}
		}

		public static setIcon(panel: any, iconSource: string, historyShow: boolean = true) {
			var popUpComponent: APopUp = APopUp.getPopUp(panel);
			if (popUpComponent) {
				popUpComponent.setIcon(iconSource);
				popUpComponent.historyShow = historyShow;
			}
		}

		public setTitleLabel(title: string) {
			if (!this.m_pTitleLabel) return;
			if (title != "") {
				this.m_pTitleLabel.text = title;
				this.m_pTitleLabel.width = this.m_pTitleLabel.width;
			}
		}

		public setTitleLabelVisible(iVisible: boolean): void {
			if (!this.m_pTitleLabel) return;
			this.m_pTitleLabel.visible = iVisible;
		}

		// public setTitle(title: string) {
		// 	if (title != "") {
		// 		// this.m_pTitleLbl.text = title;
		// 	}
		// }

		public setBottomBorder(val: boolean = false) {
			if (this.m_BottomBorder) {
				this.m_BottomBorder.touchEnabled = val;
				this.m_BottomBorder.visible = val;
			}
		}

		public setTitleImg(source: string) {
			if (!this.m_pTitle) return;
			if (source != "") {
				let res: egret.Texture = RES.getRes(source);
				if (res) {
					this.m_pTitle.texture = res;
					this.m_pTitle.width = res.textureWidth;
					this.m_pTitle.height = res.textureHeight;
				}
			}
		}

		public setIcon(source: string) {
			if (!this.m_pIcon) return;
			if (source != "") {
				let res: egret.Texture = RES.getRes(source);
				if (res) {
					this.m_pIcon.texture = res;
					this.m_pIcon.width = res.textureWidth;
					this.m_pIcon.height = res.textureHeight;
				}
			}
		}

		public getCloseBtn() {
			return this.m_pCloseBtn;
		}

		public getBackBtn() {
			return this.m_pBackBtn;
		}

		public setPvpBgEnabel(isShow: boolean) {
			this.m_pPvpBg.visible = isShow;
		}
	}
}
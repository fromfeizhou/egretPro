/**
 * 功能图标基类
 */
module com_main {
	export enum FuncIconType {
		FUNCTION = 1,
		ACTIVITY = 2,
	}

	export class FunctionWidgetBase extends CComponent {
		/**图标 */
		protected m_pConIcon: egret.DisplayObjectContainer;
		protected m_pImgIcon: CImage;

		/**图标类型 */
		protected m_pIconType: FuncIconType = FuncIconType.FUNCTION;
		/**按钮图标id */
		protected m_nBtnId: number = -1;

		/**限制等级背景 */
		protected m_pLevelBg: CImage;

		/**等级文本 */
		protected m_pLevelLab: CLabel;
		/*相对位置排序 */
		private m_pPosPriority: number = 99;
		/**添加位置 */
		private m_nPos: number = 0;
		/**添加场景 */
		private m_nScene: number = 0;

		/**功能 活动id */
		protected m_nIds: number[];
		/**功能特效 */
		protected m_nEffIds: number[];

		/**监听事件 */
		protected m_bIsOpenEvt: boolean;
		private m_tCfg: FunctionBtnConfig;

		public constructor() {
			super();
			this.m_nIds = [];
			this.m_nEffIds = [];
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.initEvent();
		}

		public onDestroy() {
			EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_OPEN, this);
			EventManager.removeEventListeners(this);
			egret.Tween.removeTweens(this.m_pConIcon);
			this.clearLevelUI();
			super.onDestroy();
		}

		// }
		/**
	 	 * 初始化
		 * @param btnId
		 *  */
		public initWidget(btnId: number, isOpenEvt: boolean = false) {
			this.m_nBtnId = btnId;
			let cfg = C.FunctionBtnConfig[btnId];
			if (cfg == null) return;
			this.m_tCfg = cfg;
			this.m_pPosPriority = cfg.priority;
			this.m_nPos = cfg.pos;
			this.m_nScene = cfg.scene;

			if (this.m_nPos == FunctionPosType.FPT_BOTTOM) {
				this.width = 109;
				this.height = 99;
			} else {
				this.width = 76;
				this.height = 75;
			}
			this.anchorOffsetX = this.width / 2;
			this.anchorOffsetY = this.height / 2;

			this.m_pConIcon = new egret.DisplayObjectContainer();
			this.addChild(this.m_pConIcon);

			this.m_pImgIcon = new com_main.CImage();
			this.m_pImgIcon.width = this.width;
			this.m_pImgIcon.height = this.height;
			this.m_pConIcon.addChild(this.m_pImgIcon);

			this.m_pImgIcon.source = this.getIconSrc();
			this.m_bIsOpenEvt = isOpenEvt;

			if (cfg.id == 10002 || cfg.id == 4004) {
				this.doScaleAction();
				if (isOpenEvt) EventManager.addTouchTapListener(this.m_pConIcon, this, this.onClickHandle);
			} else {
				if (isOpenEvt) EventManager.addTouchScaleListener(this.m_pConIcon, this, this.onClickHandle);
			}
		}

		/**获得icon */
		private getIconSrc() {
			let name = this.m_tCfg.iconName;
			if (this.m_tCfg.id == 10002) {
				let vo = ActivityModel.getActivityVo<AcPayFirstVo>(AcViewType.FIRST_RECHARGE);
				if (vo.awardRecordSet.length > 0) {
					name = "city_icon_cz4"
				}
			}

			if (this.m_tCfg.id == 4004) {
				let vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
				name = vo.getNewGenRewordCfg().icon;
				return LoginConst.getResUrl(name, 'icon');
			}
			return `${name}_png`;
		}

		public updateIncon() {
			this.m_pImgIcon.source = this.getIconSrc();
		}

		/**缩放动画 */
		private doScaleAction() {
			this.m_pImgIcon.width = this.m_pImgIcon.width * 1.1;
			this.m_pImgIcon.height = this.m_pImgIcon.height * 1.1;
			let tw = egret.Tween.get(this.m_pConIcon, { loop: true });
			tw.to({ scaleX: 1.1, scaleY: 1.1 }, 800);
			tw.to({ scaleX: 1, scaleY: 1 }, 800);
		}


		/**添加活动 或功能id*/
		public addItemId(ids: number[]) {
			while(ids.length > 0){
				let id = ids.pop();
				if (this.m_nIds.indexOf(id) == -1) {
					this.m_nIds.push(id);
				}
			}
			
			if (this.m_nIds.length > 0) {
				this.initRedPointEvt();
				this.initIdAction(this.m_nIds);
			}
		}
	

		/**移除活动 */
		public removeItemId(id: number) {
			let index = this.m_nIds.indexOf(id);
			if (index >= 0) {
				this.m_nIds.splice(index, 1);
				this.initRedPointEvt();
				this.clearTimeOut();
			}
		}

		/**功能为空 */
		public isEmpty() {
			if (!this.m_nIds || this.m_nIds.length == 0) return true;
			return false;
		}
		/**是否存在活动 与功能 */
		public isInId(id) {
			return this.m_nIds.indexOf(id) >= 0;
		}

		/**添加功能限制显示文本 */
		private initLevelUI(color: number = 0xe9e9e6) {
			if (this.m_pLevelLab) {
				this.m_pLevelLab.textColor = color;
				return;
			}
			this.m_pLevelBg = new com_main.CImage();
			this.m_pLevelBg.source = "border_1030_png"
			this.m_pLevelBg.height = 18;
			this.m_pLevelBg.width = this.width +20;
			this.m_pConIcon.addChild(this.m_pLevelBg);
			this.m_pLevelBg.alpha = 0.8;
			this.m_pLevelBg.y = this.height - 1;
			this.m_pLevelBg.x = this.width / 2 - this.m_pLevelBg.width / 2;

			this.m_pLevelLab = new com_main.CLabel();
			this.m_pLevelLab.size = 17;
			this.m_pLevelLab.textColor = color;
			this.m_pLevelLab.stroke = 1;
			this.m_pLevelLab.strokeColor = 0x000000;
			this.m_pLevelLab.width = this.width + 24;
			this.m_pConIcon.addChild(this.m_pLevelLab);
			this.m_pLevelLab.y = this.height + 2;
			this.m_pLevelLab.textAlign = egret.HorizontalAlign.CENTER;
			this.m_pLevelLab.x = this.width / 2 - this.m_pLevelLab.width / 2;

		}

		private clearLevelUI() {
			Utils.removeFromParent(this.m_pLevelBg);
			Utils.removeFromParent(this.m_pLevelLab);
		}

		/**控制限制功能文本显示 */
		public updateLevelShow() {
			this.m_pLevelBg.visible = !FunctionModel.isFunctionOpen(this.m_nBtnId);
			this.m_pLevelLab.visible = !FunctionModel.isFunctionOpen(this.m_nBtnId);
			this.m_pLevelLab.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, FunctionModel.getFunctionOpenLevel(this.m_nBtnId));
		}

		public get posPriority(): number {
			return this.m_pPosPriority;
		}
		public set posPriority(posPriority: number) {
			this.m_pPosPriority = posPriority;
		}
		/**位置 */
		public get pos(): number {
			return this.m_nPos;
		}
		/**场景 */
		public get scene(): number {
			return this.m_nScene;
		}

		/**图标类型 1 功能图标 2 活动图标*/
		public get iconType(): FuncIconType {
			return this.m_pIconType;
		}

		public get icon(): CImage {
			return this.m_pImgIcon;
		}

		/**按钮配置id */
		public get btnId(): number {
			return this.m_nBtnId;
		}

		/**==================================================================================================================
		 * 通用功能
		 * ==================================================================================================================
		 */

		/**红点监听(子类重写) */
		public initRedPointEvt() {
		}


		/**点击回调 则此实现 丢给子类（FunctonSimpleWidget	FunctionActiWidget）重写回调) */
		protected onClickHandle() {
		}

		/**按钮id初始化 */
		protected initIdAction(ids:number[]){

		}


		/**创建倒计时 */
		protected m_nTimeOut: number;
		protected m_bOnTick: boolean;
		protected m_nType: number;
		/**
		 * @param time 毫秒
		 */
		protected createTimeOutLab(time: number, type: number = 1) {
			this.initLevelUI();
			this.m_nTimeOut = time;
			this.m_nType = type;
			this.m_pLevelLab.text = Utils.DateUtils.getFormatTime(this.m_nTimeOut, this.m_nType);
			if (!this.m_bOnTick) {
				this.m_bOnTick = true;
				Utils.TimerManager.doTimer(1000, 0, this.onTickHandler, this);
			}
		}

		public onTickHandler() {
			this.m_nTimeOut -= 1000;
			if (this.m_nTimeOut < 0) {
				this.clearTimeOut();
				return;
			}
			this.m_pLevelLab.text = Utils.DateUtils.getFormatTime(this.m_nTimeOut, this.m_nType);
		}

		public clearTimeOut() {
			this.m_bOnTick = false;
			this.clearLevelUI();
			Utils.TimerManager.remove(this.onTickHandler, this);
		}
	}
}
module com_main {
	/**
	 * 荣誉累计奖励
	 */
	export class CrossRankPageH extends CView {
		public static NAME = 'CrossRankPageH';

		public m_pViewRoot: eui.Group;
		public m_imgVipPro: com_main.CImage;
		public m_lbExp: eui.Label;
		public m_lbFSum: eui.Label;
		public m_iconLeftRoot: eui.Group;
		public m_iconRoot: eui.Group;
		public m_pBox: com_main.CImage;
		public m_imgBox: eui.Image;
		public m_pTitle: eui.Label;
		public m_pEffRoot: eui.Group;
		public m_btnLeft: eui.Image;
		public m_starRoot: eui.Group;
		public m_btnRight: eui.Image;
		public m_pOpenBox: com_main.ComButton;
		public m_pBoxState: eui.Group;
		public m_LboxState: eui.Label;
		public m_itemList: eui.List;


		public static PRO_MAX: number = 480;
		private m_bIsAction: boolean;    //图标动画
		private m_bIsRotateAction: boolean = true;
		private m_effBg: MCDragonBones;
		private m_nLocalY: number;   //动画起始位置
		private m_boxLoclX: number;

		private m_tCollections: eui.ArrayCollection;
		/**当前的奖励阶段 */
		private m_nCurAwardPro: number = 0;
		private m_nBoxId: number = 0;
		private isLeft: boolean = false;
		private timeKey: number;
		private m_maxNum: number = 0;


		public constructor() {
			super();
			this.name = CrossRankPageH.NAME;
			this.initApp("cross/sandTable/CrossRankPageHSkin.exml");
			this.validateNow();
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX,
			];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX: {
					let data = body as gameProto.IS2C_CROSS_SERVER_GET_HONOR_BOX;
					this.updateBoxState();
					this.updateBoxBtnState();
					this.showUpGradeEffect();
					// /**领完奖之后跳到下一个 */
					this.onRightHandler();
					this.timeKey = egret.setTimeout(() => {
						CrossModel.receiveHonorBox(data.boxId);
						egret.clearTimeout(this.timeKey);
					}, this, 200);
					break;
				}
			}
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			this.removeEvent();
			super.onDestroy();
			this.stopAction();
			this.clearEffect();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			Utils.toStageBestScaleHeigt(this);

			this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_KQBX));

			this.m_tCollections = new eui.ArrayCollection([]);
			this.m_itemList.dataProvider = this.m_tCollections;
			this.m_itemList.itemRenderer = ExploitAwardRender;
			let militoryList: number[] = CrossModel.getDoneHonorBoxList();
			/**已经到了哪个阶段 */
			this.m_bIsAction = false;
			this.m_nLocalY = this.m_iconRoot.bottom;

			this.m_maxNum = CrossModel.getCrossServerRewardConfigByType(CrossRewardType.HONOR).length;
			this.m_nCurAwardPro = militoryList && militoryList.length > 0 ? militoryList.length + 1 : 1;
			this.m_nCurAwardPro = this.m_nCurAwardPro > this.m_maxNum ? this.m_maxNum : this.m_nCurAwardPro;
			let cfgs = CrossModel.getCrossServerRewardConfigByType(CrossRewardType.HONOR);
			this.m_nBoxId = cfgs[this.m_nCurAwardPro - 1].id;
			this.refreshView();
			this.changeIndex(this.m_nCurAwardPro);
			this.addEvent();
			this.createEffect();
			this.updateBtn();
			// this.createBoxRotate();
		}

		public createBoxRotate(isLeft: number = 1) {
			this.m_iconRoot.horizontalCenter = 400 * isLeft;
			this.m_iconRoot.alpha = 0;
			let tw = egret.Tween.get(this.m_iconRoot, { loop: true });
			tw.to({ alpha: 1, horizontalCenter: 0 }, 250).call(() => {
				Tween.removeTweens(this.m_iconRoot);
				this.m_bIsRotateAction = true;
				this.refreshView();
			});
			this.m_iconLeftRoot.visible = true;
			this.m_iconLeftRoot.alpha = 1;
			this.m_iconLeftRoot.horizontalCenter = 0;
			let tw1 = egret.Tween.get(this.m_iconLeftRoot, { loop: true });
			tw1.to({ alpha: 0, horizontalCenter: -400 * isLeft }, 250).call(() => {
				Tween.removeTweens(this.m_iconLeftRoot);
				this.m_iconLeftRoot.visible = false;
				this.m_iconLeftRoot.horizontalCenter = 0;
			});
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private addEvent() {
			EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
			EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);
			EventManager.addTouchScaleListener(this.m_pOpenBox, this, this.onAward);
		}

		private removeEvent() {
			EventManager.removeEventListeners(this);
		}
		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

		/**建造升级完成 */
		public showUpGradeEffect() {
			let EBuild_UpGrade = new MCDragonBones();
			EBuild_UpGrade.initAsync(IETypes.EBuild_UpGrade);
			EBuild_UpGrade.play(IETypes.EBuild_UpGrade, 1, true);
			// EBuild_UpGrade.play(IETypes.EBuild_UpGrade)
			EBuild_UpGrade.scaleX = 1.1;
			EBuild_UpGrade.scaleY = 1.1;
			EBuild_UpGrade.x = 0;
			EBuild_UpGrade.y = 0;
			this.m_starRoot.addChild(EBuild_UpGrade);
		}

		/**向左点击 */
		private onLeftHandler() {
			let index = this.m_nCurAwardPro - 1;
			this.isLeft = true;
			if (index >= 1) this.changeIndex(index);
		}

		private onRightHandler() {
			let index = this.m_nCurAwardPro + 1;
			this.isLeft = false;
			if (index <= this.m_maxNum) this.changeIndex(index);
		}

		/**选中改变 */
		private changeIndex(index: number) {
			if (this.m_nCurAwardPro == index) return;
			this.m_nCurAwardPro = index;
			let cfgs = CrossModel.getCrossServerRewardConfigByType(CrossRewardType.HONOR);
			this.m_nBoxId = cfgs[this.m_nCurAwardPro - 1].id;
			this.createBoxRotate(this.isLeft ? -1 : 1);
			this.updateBtn();
			// this.refreshView();
		}

		/**切换的时候刷新页面 */
		private refreshView() {
			this.m_pTitle.text = GCodeFromat(CLEnum.EXPLOIT_AWARD_LV, this.m_nCurAwardPro);
			this.refreshBoxAward();
			this.refreshProgress();
			this.updateBoxBtnState();
			this.updateBoxState();
		}

		/**刷新进度条 */
		private refreshProgress() {
			let cfg = C.CrossServerRewardConfig[this.m_nBoxId];
			if (cfg) {
				let progressValue: number = CrossModel.rankHonor;
				progressValue = Math.min(progressValue, cfg.value);
				this.m_lbExp.text = `${progressValue}/${cfg.value}`;
				let pro = Math.min(progressValue / cfg.value, 1);
				this.m_imgVipPro.width = CrossRankPageH.PRO_MAX * pro;
			} else {
				this.m_imgVipPro.width = 0;
			}
		}

		/**刷新阶段奖励 */
		private refreshBoxAward() {
			let cfg = C.CrossServerRewardConfig[this.m_nBoxId];
			if (cfg) {
				let items = cfg.reward;
				this.m_tCollections.replaceAll(items);
			}
		}

		/**更新按钮状态 */
		public updateBoxBtnState() {
			this.stopAction();
			if (CrossModel.checkHonorBox(this.m_nBoxId)) {
				this.m_pOpenBox.enabled = true;
				Utils.isGray(false, this.m_pOpenBox)
				this.m_pEffRoot.visible = true;
				this.doAction();
			} else {
				this.m_pOpenBox.enabled = false;
				Utils.isGray(true, this.m_pOpenBox);
				this.m_pEffRoot.visible = false;
			}
			if (CrossModel.checkHonorBoxState(this.m_nBoxId)) {
				this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_YJLQ))
				this.m_pBoxState.visible = true;
				this.m_pOpenBox.visible = false;
			} else {
				this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_KQBX))
				this.m_pBoxState.visible = false;
				this.m_pOpenBox.visible = true;
			}
		}

		/**宝物动画 */
		public doAction() {
			if (!this.m_bIsAction && this.m_bIsRotateAction) {
				this.m_bIsAction = true;
				this.m_bIsRotateAction = false;
				let ty = this.m_nLocalY;
				let gap = 20;
				let tw = egret.Tween.get(this.m_iconRoot, { loop: true });
				tw.to({ bottom: ty + gap }, 1500, Ease.sineInOut);
				tw.to({ bottom: ty }, 1500, Ease.sineInOut);
			}
		}

		/**宝物动画 */
		public stopAction() {
			if (this.m_bIsAction) {
				egret.Tween.removeTweens(this.m_iconRoot);
				this.m_iconRoot.bottom = this.m_nLocalY;
				this.m_bIsAction = false;
			}
		}

		/**添加背景特效 */
		public createEffect() {
			if (!this.m_effBg) {
				this.m_effBg = new MCDragonBones();
				this.m_effBg.initAsync(IETypes.EUI_TreaBg);
				this.m_effBg.play(IETypes.EUI_TreaBg);
				this.m_pEffRoot.addChild(this.m_effBg);
			}
		}

		/**移除背景特效 */
		public clearEffect() {
			if (this.m_effBg) {
				this.m_effBg.destroy();
				this.m_effBg = null;
				this.m_pBox.visible = true;
			}
		}

        /**
         * 更新宝箱显示
         */
		public updateBoxState() {
			this.m_pBox.source = CrossModel.checkHonorBoxState(this.m_nBoxId) ? "world_icon_bx02_png" : "world_icon_bx01_png";
		}

		public updateBtn() {
			this.m_btnLeft.visible = this.m_nCurAwardPro > 1;
			this.m_btnRight.visible = this.m_nCurAwardPro < this.m_maxNum;
		}

        /**
         * 点击领奖
         */
		private onAward(pvt: egret.TouchEvent) {
			if (this.m_nCurAwardPro > this.m_maxNum) return;
			CrossProxy.C2S_CROSS_SERVER_GET_HONOR_BOX(this.m_nBoxId);
		}
	}
}
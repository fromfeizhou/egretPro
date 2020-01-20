module com_main {
	export class BattleResultFaliView extends CView {

		public shakeImage: eui.Image;
		public rect: eui.Rect;
		public group_all: eui.Group;
		public shake_group: eui.Group;
		public border_1037: eui.Image;
		public border_1001: eui.Image;
		public line_005_1: eui.Image;
		public line_005_2: eui.Image;
		public image_result_1: eui.Image;
		public image_result_2: eui.Image;
		public reward_group: eui.Group;
		public lb_title: eui.Label;
		public line_003_1: eui.Image;
		public line_003_0: eui.Image;
		public tech_group: eui.Group;
		public g_btn_1: eui.Group;
		public img_btn_1: eui.Image;
		public g_btn_2: eui.Group;
		public img_btn_2: eui.Image;
		public g_btn_3: eui.Group;
		public img_btn_3: eui.Image;
		public button_group: eui.Group;
		public button_exit: com_main.ComButton;


		private m_callback: Function;
		private m_thisArg: any;
		private m_checkPointType;

		private actionGroup: egret.tween.TweenGroup;
		// private renderTexture: egret.RenderTexture;

		public static NAME = "BattleResultFaliView";
		public constructor(checkPointType) {
			super();
			this.name = BattleResultFaliView.NAME;
			this.m_checkPointType = checkPointType;
			// this.renderTexture = new egret.RenderTexture();
			// this.renderTexture.drawToTexture(GameConfig.curStage(), new egret.Rectangle(0, 0, GameConfig.curWidth(), GameConfig.curHeight()));

			this.initApp("battle_new/result/result_fail_view.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.button_exit.setTitleLabel(GCode(CLEnum.RESULT_EXIT));
			Utils.TimerManager.doTimer(1000, 0, this.countdown, this);

			EventManager.addTouchScaleListener(this.button_exit, this, this.onclickButtonExit);
			EventManager.addTouchScaleListener(this.g_btn_1, this, this.onclickFun1);
			EventManager.addTouchScaleListener(this.g_btn_2, this, this.onclickFun2);
			EventManager.addTouchScaleListener(this.g_btn_3, this, this.onclickFun3);

			EventManager.addTouchTapListener(this.group_all, this, this.onclickButtonExit);

			this.actionGroup.play();
			this.actionGroup.addEventListener("itemComplete", this.onTweenItemComplete, this);
			this.actionGroup.addEventListener("complete", this.onAllComplete, this);
			// this.shakeImage.texture = this.renderTexture;
		}
		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
			Utils.TimerManager.remove(this.countdown, this);
		}

		private onclickButtonExit() {
			Utils.TimerManager.remove(this.countdown, this);
			com_main.UpManager.close();
			BattleModel.exitBattle(this.m_checkPointType);
		}

		private onclickFun1() {
			SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
			Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
		}

		private onclickFun2() {
			SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
			Utils.open_view(TASK_UI.POP_EQUIP_MAIN_WND);
		}

		private onclickFun3() {
			SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
			Utils.open_view(TASK_UI.TAVERN_MAIN_PANEL);
		}

		/**
		 * 动画组中的一项播放完成
		 */
		private onTweenItemComplete(event: egret.Event): void {
			const item = event.data as egret.tween.TweenItem;
			if (this.image_result_1 == item.target) {
				EffectUtils.shakeScreen(this.shakeImage, 3);
			} else if (this.image_result_2 == item.target) {
				EffectUtils.shakeScreen(this.shakeImage, 3, () => { Utils.removeFromParent(this.shakeImage); });
			}
		}

		private onAllComplete() {
			// EventMgr.dispatchEvent(GuideEvent.GUIDE_BATTLE_WIN_COMPOUND_ANI, null);
		}

		private countdownSceond = 9;
		private countdown() {
			this.countdownSceond = this.countdownSceond - 1;
			if (this.countdownSceond < 0) {
				this.onclickButtonExit();
				return;
			}
			this.button_exit.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, this.countdownSceond));
		}
	}
}

//结算界面基类
module com_main {
	export class ResultView extends CView {

		public button_group: eui.Group;
		public group_all: eui.Group;
		public sueecssEffect_group: eui.Group;
		public rect: eui.Rect;
		public button_continue: ComButton; //退出
		public button_next: ComButton; //继续闯关按钮
		public sueecssEffect: MCDragonBones;
		public actionGroup: egret.tween.TweenGroup; //动画

		public shakeNum: number;
		// public shakeImage: eui.Image;
		// public renderTexture: egret.RenderTexture;

		public m_battleType: CheckPointType;

		public constructor() {
			super();
			this.shakeNum = 0;

			// this.renderTexture = new egret.RenderTexture();
			// this.renderTexture.drawToTexture(GameConfig.curStage(), new egret.Rectangle(0, 0, GameConfig.curWidth(), GameConfig.curHeight()));
		}

		protected addEvent() {
			this.button_continue.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, 9));
			Utils.TimerManager.doTimer(1000, 0, this.countdown, this);

			this.button_continue["sound_queren"] = SoundData.getSureSound();
			EventManager.addTouchScaleListener(this.button_continue, this, this.onclickButtonContinue);
			this.actionGroup.addEventListener("itemComplete", this.onTweenItemComplete, this);
			// this.shakeImage.texture = this.renderTexture;

			if(this.button_next){
				this.button_next.setTitleLabel('下一关');
				this.button_next["sound_queren"] = SoundData.getSureSound();
				EventManager.addTouchScaleListener(this.button_next, this, this.onclickNext);
			}
		}



		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
			this.actionGroup.removeEventListener("itemComplete", this.onTweenItemComplete, this);
			if (this.sueecssEffect) {
				this.sueecssEffect.destroy();
			}
			Utils.TimerManager.remove(this.countdown, this);
		}

		public onclickButtonContinue() {
			Utils.TimerManager.remove(this.countdown, this);
			UpManager.history();
			BattleModel.exitBattle(this.m_battleType);
		}

		public onclickNext(){

		}

		public showSingleBtn(){
			this.button_continue.currentState = 'style2';
			this.button_continue.horizontalCenter = 0;

			if(this.button_next){
				this.button_next.visible = false;
			}
		}

		private frame_event(evt: dragonBones.FrameEvent) {
			// console.log( " 播放到了一个关键帧！ 帧标签为：",evt.frameLabel);
			if (evt.frameLabel == "startEnd") {
				this.sueecssEffect.play("xunhuan", 0);
			} 
			// else if (evt.frameLabel == "shake") {
			// 	this.shakeNum += 1;
			// 	EffectUtils.shakeScreen(this.shakeImage, 3, () => { 
			// 		console.log("this.shakeNum",this.shakeNum); 
			// 		if (this.shakeNum == 2) Utils.removeFromParent(this.shakeImage); },this);
			// }
		}

        /**
		 * 动画组中的一项播放完成
		 */
		public onTweenItemComplete(event: egret.Event): void {
			const item = event.data as egret.tween.TweenItem;
			if (this.rect == item.target) {
				this.createEffect();
				EventManager.addTouchTapListener(this.group_all, this, this.onclickButtonContinue);
			}
		}

		public createEffect() {

			let effectMC = new MCDragonBones();
			effectMC.initAsync("EResult_Success");
			effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
			effectMC.play("start", 0);
			this.sueecssEffect_group.addChild(effectMC);
			this.sueecssEffect = effectMC;
		}

		public countdownSceond = 9;
		public countdown() {
			this.countdownSceond = this.countdownSceond - 1;
			if (this.countdownSceond < 0) {
				this.onclickButtonContinue();
				return;
			}
			this.button_continue.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, this.countdownSceond));
		}

	}
}
module com_main {
	export class ArenaSuccessResultView extends ResultView {

		private m_isWin: boolean;
		private m_rewards: any;

		private m_arenaId: number;

		///////////////////////////////////////////////////////////////
		// public button_continue: ComButton; //继续闯关按钮
		public group_itemList: eui.Group;  //获得奖励列表
		public group_itemList1: eui.Group;  //获得奖励列表1

		// private actionGroup: egret.tween.TweenGroup; //动画
		private actionItem1: egret.tween.TweenGroup; //动画1
		private actionItem2: egret.tween.TweenGroup; //动画2

		public static NAME = "ArenaSuccessResultView";
		public constructor(args) {
			super();
			this.name = ArenaSuccessResultView.NAME;

			this.initApp("battle_new/result/arena_result_view.exml");
			this.m_rewards = args.rewards;
			this.m_battleType = args.battleType;
			this.shakeNum = 0;
			this.m_arenaId = args.arenaId;
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.group_all.scaleX = GameConfig.getBestScale();
			this.group_all.scaleY = GameConfig.getBestScale();

			this.refreshReward(this.m_rewards);
			this.actionGroup.play();
			this.actionGroup.addEventListener("complete", this.onTweenComplete, this);

			super.addEvent();

			if(this.m_battleType != CheckPointType.ARENA || this.m_arenaId == 500){
				this.showSingleBtn();
			}
		}

		public onclickNext(){
			BattleModel.challengeNext(this.m_battleType);
		}

		public onDestroy(): void {
			super.onDestroy();
			this.actionGroup.removeEventListener("complete", this.onTweenComplete, this)
		}

		private refreshReward(rewards: any[]) {
			// let reward = rewards;
			let reward = PropModel.filterItemList(rewards);
			for (let i = 0; i < 4 && i < reward.length; i++) {
				var element = reward[i];
				let itemId = element.itemId;
				let count = element.count;
				let item = ComItemNew.create("name_num");
				item.setItemInfo(itemId, count);
				this.group_itemList.addChild(item);
			}
			for (let i = 4; i < 8 && i < reward.length; i++) {
				var element = reward[i];
				let itemId = element.itemId;
				let count = element.count;
				let item = ComItemNew.create("name_num");
				item.setItemInfo(itemId, count);
				this.group_itemList1.addChild(item);
			}
		}

		/**
		 * 动画组播放完成
		 */
		private onTweenComplete(): void {
			if (this.m_rewards.length <= 4) {
				this.actionItem1.play();
			} else {
				this.actionItem2.play();
			}
		}

	}
}
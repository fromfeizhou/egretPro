module com_main {
	export class BossSuccessResultView extends ResultView {
		public rect: eui.Rect;
		public group_all: eui.Group;
		public shake_group: eui.Group;
		public border_1037: eui.Image;
		public border_043: eui.Image;
		public image_result_1: eui.Image;
		public image_result_2: eui.Image;
		public reward_group: eui.Group;
		public group_itemList: eui.Group;
		public m_labDamage: eui.BitmapLabel;
		public m_labRank: eui.BitmapLabel;
		public m_notRank: eui.Label;
		public group_itemList1: eui.Group;
		public button_group: eui.Group;
		public sueecssEffect_group: eui.Group;

		public sueecssEffect: MCDragonBones;

		private m_rewards: any;
		// private m_battleType: CheckPointType;
		private m_lastHit: boolean;      //最后一击
		private m_rank: number;         //排名
		private m_damage: number;          //造成伤害
		private m_isPlayEff: boolean = true;      //是否播放动画

		///////////////////////////////////////////////////////////////
		// private button_continue: ComButton; //继续闯关按钮
		// private actionGroup: egret.tween.TweenGroup; //动画
		private actionItem1: egret.tween.TweenGroup;
		private actionItem2: egret.tween.TweenGroup;
		// private shakeImage: eui.Image;
		// private renderTexture: egret.RenderTexture;

		public static NAME = "BossSuccessResultView";
		public constructor(args) {
			super();
			this.name = BossSuccessResultView.NAME;

			this.initApp("battle_new/result/boss_result_win_view.exml");

			this.m_rewards = args.rewards;
			this.m_battleType = args.battleType;
			this.m_lastHit = args.lastHit;
			this.m_rank = args.rank;
			this.m_damage = args.damage;
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.group_all.scaleX = GameConfig.getBestScale();
			this.group_all.scaleY = GameConfig.getBestScale();

			this.refreshSettlement(this.m_lastHit, this.m_rank, this.m_damage);
			this.refreshReward(this.m_rewards);

			this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
			this.actionGroup.play();
			this.addEvent();
		}

		public onDestroy(): void {
			super.onDestroy();
			this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
		}

		public onclickButtonContinue() {
			if (this.m_isPlayEff) {
				this.actionItem2.play();
				this.m_isPlayEff = false;
				return;
			}
			super.onclickButtonContinue();
		}

		/**显示结算信息 */
		private refreshSettlement(lastHit: boolean, rank: number, damage: number) {
			this.reward_group.visible = lastHit;
			this.m_notRank.visible = rank <= 0 ? true : false;
			this.m_labRank.visible = rank <= 0 ? false : true;
			this.m_labRank.text = GCodeFromat(CLEnum.RANK_NUM, rank);
			this.m_labDamage.text = damage + '';
		}
		private refreshReward(rewards: any[]) {
			// let reward = rewards;
			let reward = PropModel.filterItemList(rewards);
			for (let i = 0; i < 4 && i < reward.length; i++) {
				var element = reward[i];
				let itemId = element.itemId;
				let count = element.count;
				
				let item = ComItemNew.create("count");
				item.setItemInfo(itemId, count);
				this.group_itemList.addChild(item);
			}
			for (let i = 4; i < 8 && i < reward.length; i++) {
				var element = reward[i];
				let itemId = element.itemId;
				let count = element.count;
				let item = ComItemNew.create("count");
				item.setItemInfo(itemId, count);
				this.group_itemList1.addChild(item);
			}

		}

		/**
		 * 动画组播放完成
		 */
		private onTweenComplete(): void {
			this.actionItem1.play();
		}

	}
}
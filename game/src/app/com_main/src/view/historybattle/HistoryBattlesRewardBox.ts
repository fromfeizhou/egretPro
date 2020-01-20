module com_main {
	export class HistoryBattlesRewardBox extends CComponent {

		public static NAME = 'HistoryBattlesRewardBox';

		/** 宝箱图片 */
		private m_Box: CImage;
		/** 打开宝箱所需星星数 */
		private m_StarNum: CLabel;
		/**特效 */
		private m_pEffect: BoxEffect;
		public m_labRaward: eui.Group;

		/** 宝箱组件顺序编号 */
		private _boxIdx: number;

		/** 宝箱配置信息 */
		private _config: HistoryWarStarRewardConfig;

		private m_nState: number;	//宝箱状态

		public onDestroy(): void {
			if (this.m_pEffect) {
				this.m_pEffect.onDestroy();
				this.m_pEffect = null;
			}
			super.onDestroy();
		}

		public constructor(param: any) {
			super();
			this.name = HeadQuartersRewardBox.NAME;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}


		/** 访问器 - 宝箱ID */
		public get BoxId(): number {
			if (this._config)
				return this._config.id;
			return 0;
		}

		/** 访问器 - 打开宝箱所需星星数量 */
		public get NeedStarOpen(): number {
			if (this._config)
				return this._config.star;
			return 0;
		}

		/**获取奖励串 */
		public GetAwards() {
			if (this._config) {
				return this._config.starReward;
			}
			return "";
		}

		/** 初始化宝箱 */
		public InitBox(boxIdx: number) {
			this._boxIdx = boxIdx;
			this.SetBoxState(2);
		}

		/** 设置宝箱配置 */
		public SetBoxConfig(config: HistoryWarStarRewardConfig) {
			this._config = config;
			this.m_StarNum.text = this._config.star.toString();
		}

		/** 设置奖励宝箱状态。0-已领取，1-可领取，2-不可领取 */
		public SetBoxState(state: number): void {

			if (state == 0) {
				this.m_Box.visible = true;
				if (this.m_pEffect) {
					this.m_pEffect.visible = false;
				}
			} else {
				if (!this.m_pEffect) {
					this.m_pEffect = new BoxEffect(this._boxIdx + 1, state == 1);
					this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
					this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
					this.m_pEffect.x = this.width * 0.5;
					this.m_pEffect.y = this.height * 0.5;
					this.addChildAt(this.m_pEffect, 1);
				}
				this.m_pEffect.setEffectEnable(state == 1);
				this.m_pEffect.visible = true;
				this.m_Box.visible = false;
			}
			this.m_labRaward.visible = state == 0 ? true : false;
			this.m_nState = state;
		}

		/**获取宝箱状态 */
		public GetBoxState() {
			return this.m_nState;
		}

		// private RANGE:number = 15;
		// private ActiveEffect():void{
		// 	egret.Tween.removeTweens(this.m_Box);
		//     Tween.get(this.m_Box,{loop:true})
		// 	.to({rotation:-this.RANGE},400)
		//     .to({rotation:0},400)
		//     .to({rotation:this.RANGE},400)
		//     .to({rotation:0},400);
		// }

		private UnActiveEffect(): void {
			egret.Tween.removeTweens(this.m_Box);
		}

	}
}
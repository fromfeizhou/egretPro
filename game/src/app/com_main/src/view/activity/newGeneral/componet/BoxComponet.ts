// TypeScript file


module com_main {
	export class BoxComponet extends CComponent {

		public m_Box:com_main.CImage;
		public m_lbDes:com_main.CLabel;

		public m_nState: number;
		private m_pEffect: BoxEffect;
		private m_id: number;
		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("activity/newGeneral/componet/BoxComponetSkin.exml");
		}

		protected childrenCreated(): void {
            super.childrenCreated();
			// this.init();
		}

		public onDestroy(): void {
			if (this.m_pEffect) {
				this.m_pEffect.onDestroy();
				this.m_pEffect = null;
			}
			super.onDestroy();
		}

		//设置label显示
        public initLb(num: number, id: number){
			this.m_lbDes.text = '第' + num + '个';
			this.m_id = id;
		}

		//获取宝箱id
		public getId(): number{
			return this.m_id;
		}

		/**获取宝箱状态 */
		public GetBoxState() {
			return this.m_nState;
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
					this.m_pEffect = new BoxEffect(3, state == 1);
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
			this.m_nState = state;
		}
	}
}
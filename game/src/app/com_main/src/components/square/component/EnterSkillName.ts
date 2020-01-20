// TypeScript file

module com_main {
	/**
	 * 入场技能
	 */
	export class EnterSkillName extends CComponent {

        private m_content: string = "";

        private animation: egret.tween.TweenGroup; //动画
        private name_lb: eui.Label; //技能名

        public constructor(content: string) {
			super();
			this.skinName = Utils.getAppSkin("battle_new/components/BattleEnterSkillName.exml");
			this.m_content = content;
		}

        public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			
			this.name_lb.text = this.m_content;

            this.animation.play();
            this.animation.addEventListener("complete", this.onTweenComplete, this);
		}

        /**
		 * 动画组播放完成
		 */
		private onTweenComplete(): void {
			Utils.removeFromParent(this);
		}
    }

}

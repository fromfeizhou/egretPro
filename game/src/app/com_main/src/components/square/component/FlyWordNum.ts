// TypeScript file

module com_main {
	/**
	 * 入场技能
	 */
	export class FlyWordNum extends CComponent {

        private m_content: string = "";

        private animation: egret.tween.TweenGroup; //动画
        private label: eui.BitmapLabel; //技能效果
        private labelColor: string;

        public constructor(content: string,color :string = "green") {
			super();
			this.skinName = Utils.getAppSkin("battle_new/components/BattleNumEffect.exml");
			this.m_content = content;
            this.labelColor = color;
		}

        public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			
            this.animation.play(0);
            this.animation.addEventListener("complete", this.onTweenComplete, this);

            if(this.labelColor == "green"){
                this.label.font = "effectGreenNum_fnt";
            }else if (this.labelColor == "red"){
                this.label.font = "effectRedNum_fnt";
            }else if (this.labelColor == "orange"){
                this.label.font = "effectOrangeNum_fnt";
            }else if (this.labelColor == "purple"){
                this.label.font = "effectPurpleNum_fnt";
            }

            this.label.text = this.m_content;
            
		}

        public setData(content: string,color :string = "green"){
            this.m_content = content;
            this.labelColor = color;
        }

        /**
		 * 动画组播放完成
		 */
		private onTweenComplete(): void {
			Utils.removeFromParent(this);
		}
    }

}

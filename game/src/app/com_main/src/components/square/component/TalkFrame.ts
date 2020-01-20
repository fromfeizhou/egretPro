module com_main {
	/**
	 * 方阵对话框
	 */
	export class TalkFrame extends CComponent {

		private m_lbContent: eui.Label;
		private m_pRichLabel: CCRichText;
		private m_content: string = "";
		private m_timeout: number = 2000;

		public constructor(content: string, timeout?: number,state:string = 'normal') {
			super();
			this.skinName = Utils.getAppSkin("battle_new/components/BattleTalkSkin.exml");
			this.currentState = state;
			this.m_content = content;
			this.m_timeout = timeout || this.m_timeout;
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		$onRemoveFromStage(): void {
			egret.Tween.removeTweens(this);
			super.$onRemoveFromStage()
        }

		protected childrenCreated() {
			super.childrenCreated();
			this.initFrame();
		}

		private initFrame() {
			this.m_lbContent.text = this.m_content;

			// this.m_pRichLabel = new CCRichText(this.m_lbContent);
			// Utils.addChild(this, this.m_pRichLabel);

			// this.m_pRichLabel.imageScale = 0.6;
			// let chatContent: string = ChatUtils.ConvertFaceStr(this.m_content); //解析表情字符
			// this.m_pRichLabel.text = chatContent;


			if (this.m_timeout > 0) {
				let tw = egret.Tween.get(this);
				tw.wait(this.m_timeout);
				tw.to({alpha:0},1000,Ease.cubicOut).call(()=>{
					if(this){
						Utils.removeFromParent(this);
					}
				},this);
			}
		}

	}
}
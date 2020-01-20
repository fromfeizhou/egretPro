
module com_main {
	/**
	 *
	 * @author
	 *
	 */
	export class ComCostTextButton extends CComponent {

		private m_pBtnBg: CImage;

		private m_pLbCost: CLabel;
		private m_pCostIcon: CImage;

		private m_bIsGary: boolean = false;

		private m_pLbText: com_main.CLabel;

		public constructor() {
			super();
		}

		protected createChildren(): void {
			super.createChildren();
			// this.commitProperties();
		}
		//设置
		public setLabelFontSize(fontSize: number) {
			this.m_pLbCost.size = fontSize;
		}

		//设置购买金币或者银币
		public setCostImg(source: string) {
			if (!this.m_pCostIcon) return;
			let CostIcon = this.m_pCostIcon;
			CostIcon.width = source == '' ? 0 : 50;
			CostIcon.height = source == '' ? 0 : 50;
			CostIcon.source = source;
		}
		//设置购买金币或者银币 scale
		public setCostImgScale(scale: number) {
			if (!this.m_pCostIcon) return;
			let CostIcon = this.m_pCostIcon;
			CostIcon.scaleX = scale;
			CostIcon.scaleY = scale;
		}
		
		public setImage(val: string) {
			let imgBG = this.m_pBtnBg;
			let res: egret.Texture = RES.getRes(val);
			if (res) {
				imgBG.source = res;
				imgBG.width = res.textureWidth;
				imgBG.height = res.textureHeight;
			} else {
				imgBG.source = val;
			}
		}

		public setCostLabel(str: string) {
			if (this.m_pLbCost)
				this.m_pLbCost.text = str;

		}
		public getCostLabel() {
			if (this.m_pLbCost)
				return this.m_pLbCost.text;
		}
	
		public setCostLabelByStyle(str: any) {
			if (this.m_pLbCost)
				this.m_pLbCost.textFlow = <Array<egret.ITextElement>>str;
		}
		//刷新
		public setTitleLabel(str: string) {
			if (this.m_pLbText)
				this.m_pLbText.text = str;
		}

		/**是否禁用 */
		public set disabled(disabled: boolean) {
			this.enabled = !disabled;
			this.gray = disabled;
		}

		/**是否灰化 */
		public set gray(isGray: boolean) {
			if (this.m_bIsGary == isGray) return;
			this.m_bIsGary = isGray;
			Utils.isGray(isGray, this);
			// if (this.m_pBtnTitle)
			// 	Utils.isGray(isGray, this.m_pBtnTitle);
			// if (this.m_pBtnBg)
			// 	Utils.isGray(isGray, this.m_pBtnBg);

			// this.commitProperties();
			// this.validateNow();
		}

		public get gray() {
			return this.m_bIsGary;
		}

		public get disabled() {
			return !this.enabled;
		}


		$onRemoveFromStage(isclear = true): void {
			super.$onRemoveFromStage(false);
		}
	}
}


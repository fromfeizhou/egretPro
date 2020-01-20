
module com_main {
	/**
	 *
	 * @author
	 *
	 */
	export class ComCostButton extends CComponent {

		public m_pBtnBg: com_main.CImage;
		public m_pCostIcon: com_main.CImage;
		public m_pLbCost: com_main.CLabel;


		private m_bIsGary: boolean = false;

		public constructor() {
			super();
		}

		protected createChildren(): void {
			super.createChildren();
			// this.commitProperties();
		}

		public setLabelFontSize(fontSize: number) {
			this.m_pLbCost.size = fontSize;
		}


		//设置购买金币或者银币
		public setCostImg(source: string) {
			if (!this.m_pCostIcon) return;
			let CostIcon = this.m_pCostIcon;
			CostIcon.width = source == '' ? 0 : 50;
			CostIcon.source = source;
		}
		//设置购买金币pos位置
		public setCostImgPos(point: egret.Point) {
			if (!this.m_pCostIcon) return;
			this.m_pCostIcon.width = point.x;
			this.m_pCostIcon.height = point.y;
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

		public setImagePropId(id:PropEnum){
			this.commitProperties();
			this.setCostImg(PropModel.getPropIcon(id));
		}


		public setCostLabel(str: string) {
			if (this.m_pLbCost)
				this.m_pLbCost.text = str;
		}

		public setCostLabelByStyle(str: any) {
			if (this.m_pLbCost)
				this.m_pLbCost.textFlow = <Array<egret.ITextElement>>str;
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


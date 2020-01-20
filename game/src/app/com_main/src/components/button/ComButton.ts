
module com_main {
	/**
	 *
	 * @author
	 *
	 */
	export class ComButton extends CComponent {

		private m_pBtnTitle: CImage;
		private m_pBtnBg: CImage;

		private m_pTitleLabel: eui.Label;


		private m_imgMark: com_main.CImage;

		private m_bIsGary: boolean = false;
		public m_sgray_tip: string;


		private m_selectTitleImg: string;
		private m_selectImg: string;

		private m_unselectTitleImg: string;
		private m_unselectImg: string;

		public constructor() {
			super();
		}

		protected createChildren(): void {
			super.createChildren();
			// this.commitProperties();
		}

		public setLabelFontSize(fontSize:number){
			this.m_pTitleLabel.size = fontSize;
		}
		public setwidth(width:number){
			if (this.m_pTitleLabel)
				this.m_pTitleLabel.parent.width = width;
		}
		public setTitleImg(source: string) {
			if (!this.m_pBtnTitle) return;
			let imgTitle = this.m_pBtnTitle;
			let res: egret.Texture = RES.getRes(source);
			if (res) {
				imgTitle.texture = res;
				imgTitle.width = res.textureWidth;
				imgTitle.height = res.textureHeight;
			} else {
				imgTitle.source = null;
			}
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


		public setIsSelect(select: boolean) {
			if (this.m_selectTitleImg && this.m_unselectTitleImg) {
				if (select) this.setTitleImg(this.m_selectTitleImg);
				else this.setTitleImg(this.m_unselectTitleImg);
			}

			if (this.m_selectImg && this.m_unselectImg) {
				if (select) this.setImage(this.m_selectImg);
				else this.setImage(this.m_unselectImg);
			}
		}


		//FIX ME
		public setSelectTitleImg(source: string, source2: string) {
			this.m_selectTitleImg = source;
			this.m_unselectTitleImg = source2;
		}

		//FIX ME
		public setSelectImage(val: string, val2: string) {
			this.m_selectImg = val;
			this.m_unselectImg = val2;
		}

		public setTitleLabel(str: string) {
			if (this.m_pTitleLabel){
				this.m_pTitleLabel.text = str;
				this.validateNow();
			}
				
		}
		public setStroke(num:number) {
			if (this.m_pTitleLabel)
				this.m_pTitleLabel.stroke = num ;
		}

		public setTitleLabelByStyle(str: any) {
			if (this.m_pTitleLabel)
				this.m_pTitleLabel.textFlow = <Array<egret.ITextElement>>str ;
		}

		/**是否禁用 */
		public set disabled(disabled: boolean) {
			this.enabled = !disabled;
			this.gray = disabled;
		}

		public get disabled() {
			return !this.enabled;
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

		

		public get imgMark() {
			return this.m_imgMark;
		}

		public set imgMark(v: com_main.CImage) {
			this.m_imgMark = v;
		}

		$onRemoveFromStage(isclear = true): void {
			super.$onRemoveFromStage(false);
		}
	}
}


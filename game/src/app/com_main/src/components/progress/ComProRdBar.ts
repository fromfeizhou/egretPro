
module com_main {
	/**
	 *
	 * @author
	 *
	 */
	export class ComProRdBar extends CComponent {

		public m_imgMask: eui.Image;
		public m_imgPro: eui.Image;


		private m_nProgress: number;

		public constructor() {
			super();
		}

		$onRemoveFromStage(isclear = true): void {
			super.$onRemoveFromStage(false);
		}

		protected createChildren(): void {
			super.createChildren();
			this.m_imgPro.mask = this.m_imgMask;
			this.commitProperties();
		}

		private refresh(): void {
			this.m_imgMask.width = this.m_nProgress * this.m_imgPro.width;
		}

		public get progress(): number {
			return this.m_nProgress;
		}
		public set progress(val: number) {
			if (this.m_nProgress == val) return;
			val = Utils.MathUtils.val2Range(val,0,1);
			this.m_nProgress = val;

			this.refresh();
		}


	}
}


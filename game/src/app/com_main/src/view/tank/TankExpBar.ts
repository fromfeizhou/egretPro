module com_main {
	export class TankExpBar extends CComponent {

		public static NAME = "TankExpBar";

		private m_pPro: com_main.CImage;
		private m_lbLevel: eui.Label;

		private m_pValue: number;//0~100/百分比
		private m_pMax: number;

		public constructor() {
			super();
			// this.name = TankPreviewItem.NAME;
			// this.skinName = Utils.getComSkin("progress/tank_preview_item.exml");
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public set max(max: number) {
			this.m_pMax = max;
		}

		/**设置百分比 0~100 % */
		public set value(value: number) {
			value = value > 100 ? 100 : value;
			value = value < 0 ? 0 : value;

			this.m_pValue = value;

			//FIX ME
			let w = 350 * (value / 100);

			this.m_pPro.width = w;

		}

		public get value(): number {
			return this.m_pValue;
		}


		public set level(level: number) {
			this.m_lbLevel.text = level + "";
		}

	}
}
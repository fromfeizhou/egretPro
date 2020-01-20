module com_main {
	/**战车属性项 */
	export class TankAttributeItem extends CComponent {

		private m_lbValue: eui.Label;

		public constructor() {
			super();
		}

		public set value(v) {
			this.m_lbValue.text = v + "";
		}
	}
}
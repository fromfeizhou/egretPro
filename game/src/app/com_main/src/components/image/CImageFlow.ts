module com_main {
	export class CImageFlow extends CComponent {

		public m_pGroup: eui.Group;

		public constructor(type: string) {
			super();

			this.skinName = Utils.getAppSkin("tavern/test.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();

		}
	}
}
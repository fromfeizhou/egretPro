module com_main {
	/**职业小图标 */
	export class ComProIcon extends CComponent {

		public m_imgBg: com_main.CImage;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("common/com_icon_pro.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		public set iconBg(source: string) {
			this.m_imgBg.source = source;
		}

	}
}
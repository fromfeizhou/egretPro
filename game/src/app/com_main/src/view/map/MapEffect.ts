module com_main {
	/**地图的一些固定显示的特效 */
	export class MapEffect extends egret.Sprite implements IFObject {

		private m_pMapObj: MapObject;
		private m_pEffect: string;
		private m_pImgEffect: egret.Bitmap;

		public static create(mapobj: MapObject) {
			return new MapEffect(mapobj);
		}

		public constructor(mapobj: MapObject) {
			super();
			this.init(mapobj)
		}

		public init(mapobj: MapObject) {
			this.setMapObject(mapobj)
		}

		public onDestroy() {
			// EffectData.removeEffect(EffectData.BATTLE_MAP, this.m_pEffect, this.m_pImgEffect);
			Utils.removeFromParent(this.m_pImgEffect);

			this.m_pImgEffect = null;
		}

		public setMapObject(vale: MapObject) {
			this.m_pMapObj = vale;
			this.initView();
		}

		public initView() {
			this.width = this.m_pMapObj.getWidth();
			this.height = this.m_pMapObj.getHeight();
			AnchorUtil.setAnchor(this, 0.5);

			let cell = this.m_pMapObj.tilePixelToTile();
			let attr = this.m_pMapObj.getProperties();
			this.m_pEffect = attr.getSource();
			debug("MapEffect:initView--->>", this.m_pMapObj.getName(), "w h", "_", this.m_pMapObj.getWidth(), this.m_pMapObj.getHeight());
			debug("MapEffect:initView--->>", this.m_pMapObj.getName(), "cell", "_", cell.x, cell.y);
			debug("MapEffect:initView--->>", this.m_pMapObj.getName(), "effect", "_", this.m_pEffect);

			this.m_pImgEffect = Utils.DisplayUtils.createBitmap();
			AnchorUtil.setAnchor(this.m_pImgEffect, 0.5);
			this.m_pImgEffect.height = this.height;
			this.m_pImgEffect.width = this.width;
			this.m_pImgEffect.y = this.height / 2;
			this.m_pImgEffect.x = this.width / 2;
			// EffectData.addEffect(EffectData.BATTLE_MAP, this.m_pEffect, this.m_pImgEffect);
			Utils.addChild(this, this.m_pImgEffect);
		}

		public doLayout() {
			let pos = this.m_pMapObj.tilePixelToPixel();
			this.x = pos.x;
			this.y = pos.y;

			debug("MapEffect:initView--->>", this.m_pMapObj.getName(), this.m_pMapObj.getX(), this.m_pMapObj.getY(), "_", pos.x, pos.y);
		}
	}
}
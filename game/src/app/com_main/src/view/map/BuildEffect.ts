module com_main {
	/**建筑燃烧的特效 */
	export class BuildEffect extends egret.DisplayObjectContainer implements IFObject {

		private m_pMapObj: MapObject;
		private m_pBuildEffect: MapEffect;
		private m_pBuildUnit: UnitInfoVo;

		public static create(mapobj: MapObject) {
			return new BuildEffect(mapobj);
		}

		public constructor(mapobj: MapObject) {
			super();
			this.init(mapobj)
		}


		public init(mapobj: MapObject) {
			this.setMapObject(mapobj)
		}

		public onDestroy() {

		}

		public setMapObject(vale: MapObject) {
			this.m_pMapObj = vale;
			this.initView();
		}

		public setBuildUnit(vo: UnitInfoVo) {
			this.m_pBuildUnit = vo;
		}

		public initView() {
			this.width = this.m_pMapObj.getWidth();
			this.height = this.m_pMapObj.getHeight();
			AnchorUtil.setAnchor(this, 0.5);

			let cell = this.m_pMapObj.tilePixelToTile();
			let attr = this.m_pMapObj.getProperties();
			let effect = attr.getSource();
			debug("BuildEffect:initView--->>", this.m_pMapObj.getName(), "w h", "_", this.m_pMapObj.getWidth(), this.m_pMapObj.getHeight());
			debug("BuildEffect:initView--->>", this.m_pMapObj.getName(), "cell", "_", cell.x, cell.y);
			debug("BuildEffect:initView--->>", this.m_pMapObj.getName(), "effect", "_", effect);

			this.m_pBuildEffect = MapEffect.create(this.m_pMapObj);
			this.m_pBuildEffect.x = this.width / 2;
			this.m_pBuildEffect.y = this.height / 2;
			Utils.addChild(this, this.m_pBuildEffect);
		}


		public doLayout() {
			let pos = this.m_pMapObj.tilePixelToPixel();
			this.x = pos.x;
			this.y = pos.y;

			debug("MapEffect:initView--->>", this.m_pMapObj.getName(), this.m_pMapObj.getX(), this.m_pMapObj.getY(), "_", pos.x, pos.y);
		}
	}
}
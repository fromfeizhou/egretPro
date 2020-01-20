module com_main {
	export class MapTile extends egret.Bitmap {
		private m_pIndex = 0;

		public constructor(value?: egret.Texture) {
			super(value);
		}

		public set index(index: number) {
			this.m_pIndex = index;
		}

		public get index(): number {
			return this.m_pIndex;
		}
	}
}
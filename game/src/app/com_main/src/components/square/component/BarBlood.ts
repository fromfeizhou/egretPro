module com_main {
	/**
	 * 血条
	 * @author 
	 */
	export class BarBlood extends egret.DisplayObjectContainer implements IFObject {

		private bg: egret.Bitmap;
		private bar: egret.Bitmap;//18
		private num: egret.TextField;

		private originWidth: number;

		public constructor(width?: number, height?: number) {
			super();
			this.init(width, height);
		}

		public init(width?: number, height?: number) {
			this.bg = Utils.DisplayUtils.createBitmap("battle_hp_bg");
			this.bg.fillMode = egret.BitmapFillMode.SCALE;
			this.bg.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
			this.addChild(this.bg);

			width = width || this.bg.width;
			height = height || this.bg.height;

			this.bg.width = width;
			this.bg.height = height;

			this.width = this.bg.width;
			this.height = this.bg.height;

			// AnchorUtil.setAnchorX(this.bg, 0.5);
			AnchorUtil.setAnchorY(this.bg, 0.5);
			// this.bg.x = this.width * 0.5
			this.bg.y = this.height * 0.5

			this.bar = Utils.DisplayUtils.createBitmap("battle_hp_2");
			this.bar.fillMode = egret.BitmapFillMode.SCALE;
			this.bar.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
			this.addChild(this.bar);

			this.bar.width = width;
			this.bar.height = height;
			// AnchorUtil.setAnchorX(this.bar, 0.5);
			AnchorUtil.setAnchorY(this.bar, 0.5);
			// this.bar.x = this.width * 0.5
			this.bar.y = this.height * 0.5
			this.originWidth = width; //this.bar.texture.textureWidth;

			this.num = new egret.TextField();
			// this.num.width = this.width;
			// this.num.anchorOffsetX = this.width * 0.5;
			// this.num.x = this.width * 0.5;
			this.num.textAlign = egret.HorizontalAlign.CENTER;
			this.num.stroke = 1;
			this.num.textColor = GameConfig.TextColors.fontWhite;
			this.num.size = 18;
			this.num.text = "0/0";
			// this.num.visible = CityBlood.m_pIsShowBlood;
			this.num.visible = false;
			Utils.addChild(this, this.num);
			// this.addChild(this.num);

			// this.cacheAsBitmap = true;
		}

		public onDestroy() {
			Utils.removeAllChild(this);
			Utils.removeFromParent(this);
			this.bg = null;
			this.bar = null;
			this.num = null;
		}

		public setHpBarTexture(textureName: string) {
			if (this.bar) {
				this.bar.texture = RES.getRes(textureName);
			}
		}

		public setProgress(hp: number, life: number) {
			var num: number = hp / life;
			var per: number = num < 0 ? 0 : num;
			this.bar.width = per * this.originWidth;
			this.num.text = hp + "/" + life;
		}

		public reSet() {
			this.bar.width = this.originWidth; //18;
			this.num.text = "0/0";
		}
	}
}
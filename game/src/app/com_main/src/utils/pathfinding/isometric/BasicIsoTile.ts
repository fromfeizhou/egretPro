module com {
	export module isometric {
		export class BasicIsoTile extends com.isometric.DrawnIsoTile {
			public constructor(size: number, color: number = 0xffffff, height: number = 0) {
				super(size, color, height);
			}
			protected draw() {
				this.graphics.clear();
				this.graphics.beginFill(this._color, .3);
				this.graphics.lineStyle(0, 0, .5);
				this.graphics.moveTo(-this.size, 0);
				this.graphics.lineTo(0, -this.size * .5);
				this.graphics.lineTo(this.size, 0);
				this.graphics.lineTo(0, this.size * .5);
				this.graphics.lineTo(-this.size, 0);
			}
		}
	}
}

// flash.extendsClass("com.isometric.BasicIsoTile","com.isometric.DrawnIsoTile")

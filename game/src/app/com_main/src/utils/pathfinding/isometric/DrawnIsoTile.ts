module com {
	export module isometric {
		export class DrawnIsoTile extends com.isometric.IsoObject {
			protected _height: number = NaN;
			protected _color: number = 0;

			public constructor(size: number, color: number, height: number = 0) {
				super(size);
				this._color = flash.checkUint(color);
				this._height = height;
				this.draw();
			}

			protected draw() {
				this.graphics.clear();
				this.graphics.beginFill(this._color);
				this.graphics.lineStyle(0, 0, .5);
				this.graphics.moveTo(-this.size, 0);
				this.graphics.lineTo(0, -this.size * .5);
				this.graphics.lineTo(this.size, 0);
				this.graphics.lineTo(0, this.size * .5);
				this.graphics.lineTo(-this.size, 0);
			}

			public set height(value: number) {
				this._height = value;
				this.draw();
			}

			public get height(): number {
				return this._height;
			}

			public set color(value: number) {
				value = flash.checkUint(value);
				this._color = flash.checkUint(value);
				this.draw();
			}

			public get color(): number {
				return this._color;
			}

		}
	}
}

// flash.extendsClass("com.isometric.DrawnIsoTile","com.isometric.IsoObject")

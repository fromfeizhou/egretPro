module com {
    export module isometric {
        export class DrawnIsoBox extends com.isometric.DrawnIsoTile {

            public constructor(size: number, color: number, height: number) {
                super(size, color, height);
                color = flash.checkUint(color);
            }

            protected draw() {
                this.graphics.clear();
                var red: number = flash.checkInt(this._color >> 16);
                var green: number = flash.checkInt(this._color >> 8 & 0xff);
                var blue: number = flash.checkInt(this._color & 0xff);
                var leftShadow: number = flash.checkUint((red * .5) << 16 | (green * .5) << 8 | (blue * .5));
                var rightShadow: number = flash.checkUint((red * .75) << 16 | (green * .75) << 8 | (blue * .75));
                var h: number = this._height * com.isometric.IsoObject.Y_CORRECT;
                this.graphics.beginFill(this._color);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(-this._size, -h);
                this.graphics.lineTo(0, -this._size * .5 - h);
                this.graphics.lineTo(this._size, -h);
                this.graphics.lineTo(0, this._size * .5 - h);
                this.graphics.lineTo(-this._size, -h);
                this.graphics.endFill();
                this.graphics.beginFill(leftShadow);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(-this._size, -h);
                this.graphics.lineTo(0, this._size * .5 - h);
                this.graphics.lineTo(0, this._size * .5);
                this.graphics.lineTo(-this._size, 0);
                this.graphics.lineTo(-this._size, -h);
                this.graphics.endFill();
                this.graphics.beginFill(rightShadow);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(this._size, -h);
                this.graphics.lineTo(0, this._size * .5 - h);
                this.graphics.lineTo(0, this._size * .5);
                this.graphics.lineTo(this._size, 0);
                this.graphics.lineTo(this._size, -h);
                this.graphics.endFill();
            }

        }
    }
}

// flash.extendsClass("com.isometric.DrawnIsoBox","com.isometric.DrawnIsoTile")

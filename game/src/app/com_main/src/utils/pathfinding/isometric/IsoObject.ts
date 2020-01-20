module com {
	export module isometric {
		export class IsoObject extends egret.Sprite {
			protected _position: com.isometric.Point3D;
			protected _position2D: com.steer.Vector2D;
			protected _size: number = NaN;
			protected _walkable: boolean = false;
			protected _vx: number = 0;
			protected _vy: number = 0;
			protected _vz: number = 0;
			public static Y_CORRECT: number = Math.cos(-Math.PI / 6) * Math.SQRT2;

			public constructor(size: number) {
				super();
				this._size = size;
				this._position = new com.isometric.Point3D();
				this.updateScreenPosition();
			}

			protected updateScreenPosition() {
				var screenPos: egret.Point = com.isometric.IsoUtils.isoToScreen(this._position);
				egret.superSetter(com.isometric.IsoObject, this, "x", screenPos.x);
				egret.superSetter(com.isometric.IsoObject, this, "y", screenPos.y);
			}

			public toString(): string {
				return "[IsoObject (x:" + this._position.x + ", y:" + this._position.y + ", z:" + this._position.z + ")]";
			}

			public set x(value: number) {
				this._position.x = value;
				this.updateScreenPosition();
			}

			public get x(): number {
				return this._position.x;
			}

			public get stageX(): number {
				return egret.superGetter(com.isometric.IsoObject, this, "x");
			}

			public set y(value: number) {
				this._position.y = value;
				this.updateScreenPosition();
			}

			public get y(): number {
				return this._position.y;
			}

			public get stageY(): number {
				return egret.superGetter(com.isometric.IsoObject, this, "y");
			}

			public set z(value: number) {
				this._position.z = value;
				this.updateScreenPosition();
			}

			public get z(): number {
				return this._position.z;
			}

			public set position(value: com.isometric.Point3D) {
				this._position = value;
				this.updateScreenPosition();
			}

			public get position(): com.isometric.Point3D {
				return this._position;
			}

			public get depth(): number {
				return (this._position.x + this._position.z) * .866 - this._position.y * .707;
			}

			public set walkable(value: boolean) {
				this._walkable = value;
			}

			public get walkable(): boolean {
				return this._walkable;
			}

			public get size(): number {
				return this._size;
			}

			public get rect(): egret.Rectangle {
				return new egret.Rectangle(this.x - this.size / 2, this["z"] - this.size / 2, this.size, this.size);
			}

			public set vx(value: number) {
				this._vx = value;
			}

			public get vx(): number {
				return this._vx;
			}

			public set vy(value: number) {
				this._vy = value;
			}

			public get vy(): number {
				return this._vy;
			}

			public set vz(value: number) {
				this._vz = value;
			}

			public get vz(): number {
				return this._vz;
			}

			public set position2D(value: com.steer.Vector2D) {
				this._position2D = value;
				this._position.x = value.x;
				this._position.z = value.y;
			}

			public get position2D(): com.steer.Vector2D {
				return new com.steer.Vector2D(this._position.x, this._position.z);
			}

		}
	}
}

// com.isometric.IsoObject.Y_CORRECT = Math.cos(-Math.PI / 6) * Math.SQRT2;
// flash.extendsClass("com.isometric.IsoObject","egret.Sprite")

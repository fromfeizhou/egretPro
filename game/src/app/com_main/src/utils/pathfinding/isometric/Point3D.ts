module com {
	export module isometric {
		export class Point3D extends egret.HashObject {
			public x: number = NaN;
			public y: number = NaN;
			public z: number = NaN;

			public constructor(x: number = 0, y: number = 0, z: number = 0) {
				super();
				this.x = x;
				this.y = y;
				this.z = z;
			}

		}
	}
}


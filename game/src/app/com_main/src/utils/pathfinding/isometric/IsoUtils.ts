module com {
	export module isometric {
		export class IsoUtils extends egret.HashObject {
			public static Y_CORRECT: number;
			public static isoToScreen(pos: com.isometric.Point3D): egret.Point {
				var screenX: number = pos.x - pos.z;
				var screenY: number = pos.y * com.isometric.IsoUtils.Y_CORRECT + (pos.x + pos.z) * .5;
				return new egret.Point(screenX, screenY);
			}

			public static screenToIso(point: egret.Point): com.isometric.Point3D {
				var xpos: number = point.y + point.x * .5;
				var ypos: number = <any>0;
				var zpos: number = point.y - point.x * .5;
				return new com.isometric.Point3D(xpos, ypos, zpos);
			}

		}
	}
}

com.isometric.IsoUtils.Y_CORRECT = Math.cos(-Math.PI / 6) * Math.SQRT2;

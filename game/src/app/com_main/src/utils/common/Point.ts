module com_main {
	export class Point extends egret.Point {

		public constructor(x?: number, y?: number) {
			super();
			this.x = x;
			this.y = y;
		}

		public static create(pos?: any) {
			return new Point(pos.x, pos.y);
		}
		
		public getX(): number {
			return this.x;
		}

		public setX(x: number) {
			this.x = x;
		}

		public getY(): number {
			return this.y;
		}

		public setY(y: number) {
			this.y = y;
		}
	}
}
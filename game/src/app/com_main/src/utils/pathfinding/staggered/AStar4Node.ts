
class AStar4Node {

	public key: number;
	public x: number;// X坐标
	public y: number;// Y坐标\
	private parentNode: AStar4Node;// 父类节点
	private g: number;// 当前点到起点的移动耗费
	private h: number;// 当前点到终点的移动耗费，即曼哈顿距离|x1-x2|+|y1-y2|(忽略障碍物)
	private f: number;// f=g+h

	public constructor(key: number, x: number, y: number, parentNode: AStar4Node) {
		this.key = key;
		this.x = x;
		this.y = y;
		this.parentNode = parentNode;
	}

	public equals(obj: any): boolean {
		if (obj == null) {
			return false;
		}
		if (this == obj) {
			return true;
		}
		if (obj instanceof AStar4Node) {
			if (obj == this) {
				return true;
			}
			let cell: AStar4Node = obj;
			return this.x == cell.x && this.y == cell.y;
		} else {
			return false;
		}
	}

	// @Override
	public hashCode(): number {
		return this.key;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}

	public getParentNode(): AStar4Node {
		return this.parentNode;
	}

	public setParentNode(parentNode: AStar4Node) {
		this.parentNode = parentNode;
	}

	public getG(): number {
		return this.g;
	}

	public setG(g: number) {
		this.g = g;
	}

	public getH(): number {
		return this.h;
	}

	public setH(h: number) {
		this.h = h;
	}

	public getF(): number {
		return this.f;
	}

	public setF(f: number) {
		this.f = f;
	}

	public toString(): string {
		return "(" + this.x + "," + this.y + "," + this.f + ")";
	}

	public getCellPoint(): egret.Point {
		return new egret.Point(this.x, this.y);
	}
}

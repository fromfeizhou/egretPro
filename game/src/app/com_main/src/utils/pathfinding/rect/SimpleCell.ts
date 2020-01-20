class SimpleCell extends egret.HashObject {

    public x: number;// X坐标
    public y: number;// Y坐标
    public parentNode: SimpleCell;// 父类节点
    public g: number;// 当前点到起点的移动耗费
    public h: number;// 当前点到终点的移动耗费，即曼哈顿距离|x1-x2|+|y1-y2|(忽略障碍物)
    public f: number;// f=g+h

    public constructor(x: number, y: number, parentNode: SimpleCell) {
        super();

        this.x = x;
        this.y = y;
        this.parentNode = parentNode;
    }

    public compareTo(candidate: SimpleCell): number {
        return this.getF() - candidate.getF();
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

    public getParentNode(): SimpleCell {
        return this.parentNode;
    }

    public setParentNode(parentNode: SimpleCell) {
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

    /**
     * 将战场格子转换成寻路格子
     * @param cell
     * @return
     */
    public static changeTo(cell: Cell): SimpleCell {
        return new SimpleCell(cell.getCellX(), cell.getCellY(), null);
    }

}

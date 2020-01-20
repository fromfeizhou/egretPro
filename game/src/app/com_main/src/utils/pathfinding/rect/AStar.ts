
class AStar extends egret.HashObject {
    private static closeList: Array<SimpleCell>;// 关闭列表
    private static openList: Array<SimpleCell>;// 开启列表
    public static cells: Cell[][];

    /**
     * 搜寻最短路径
     * 
     * @param arr
     * @param startPoint
     * @param endPoint
     */
    public static seachWay(cells: Cell[][], startCell: Cell, endCell: Cell): Array<number[]> {
        this.cells = cells;
        this.openList = [];
        this.closeList = [];

        let listPath: Array<number[]> = new Array<number[]>();

        let row: number = cells[0].length;
        let col: number = cells.length;

        let startPoint: SimpleCell = SimpleCell.changeTo(startCell);
        let endPoint: SimpleCell = SimpleCell.changeTo(endCell);

        let CONST_HENG: number = 10;// 垂直方向或水平方向移动的路径评分
        let CONST_XIE: number = 14;// 斜方向移动的路径评分
        let curNode: SimpleCell = startPoint;
        if (startPoint.x < 0 || startPoint.y > col || endPoint.x < 0
            || endPoint.y > col || !cells[startPoint.y][startPoint.x].checkMove()
            || !cells[endPoint.y][endPoint.x].checkMove()) {
            debug("AStar:seachWay------>>坐标参数错误！！");
            return listPath;
        }

        this.openList.push(startPoint);
        let isEmpty = this.openList.length == 0
        let contains = this.openList.indexOf(endPoint) != -1;
        while (!isEmpty && !contains) {
            curNode = this.minList(this.openList);
            let _contains = this.openList.indexOf(endPoint) != -1;
            if (curNode.x == endPoint.x && curNode.y == endPoint.y || _contains) {
                // debug("AStar:seachWay------>>找到最短路径");
                while (!(curNode.x == startPoint.x && curNode.y == startPoint.y)) {
                    this.addPath(listPath, curNode);
                    // debug("(" + curNode.x + "," + curNode.y + ") ");
                    if (curNode.parentNode != null) {
                        curNode = curNode.parentNode;
                    }
                }
                // debug("(" + startPoint.x + "," + startPoint.y + ")\n ");
                return listPath;
            }
            // 上
            if (curNode.y - 1 >= 0) {
                this.checkPath(curNode.x, curNode.y - 1, curNode, endPoint,
                    CONST_HENG);
            }
            // 下
            if (curNode.y + 1 < col) {
                this.checkPath(curNode.x, curNode.y + 1, curNode, endPoint,
                    CONST_HENG);
            }
            // 左
            if (curNode.x - 1 >= 0) {
                this.checkPath(curNode.x - 1, curNode.y, curNode, endPoint,
                    CONST_HENG);
            }
            // 右
            if (curNode.x + 1 < row) {
                this.checkPath(curNode.x + 1, curNode.y, curNode, endPoint,
                    CONST_HENG);
            }
            // 左上
            if (curNode.x - 1 >= 0 && curNode.y - 1 >= 0) {
                this.checkPath(curNode.x - 1, curNode.y - 1, curNode, endPoint,
                    CONST_XIE);
            }
            // 左下
            if (curNode.x - 1 >= 0 && curNode.y + 1 < col) {
                this.checkPath(curNode.x - 1, curNode.y + 1, curNode, endPoint,
                    CONST_XIE);
            }
            // 右上
            if (curNode.x + 1 < row && curNode.y - 1 >= 0) {
                this.checkPath(curNode.x + 1, curNode.y - 1, curNode, endPoint,
                    CONST_XIE);
            }
            // 右下
            if (curNode.x + 1 < row && curNode.y + 1 < col) {
                this.checkPath(curNode.x + 1, curNode.y + 1, curNode, endPoint,
                    CONST_XIE);
            }
            let a = this.openList
            let b = a.splice(a.indexOf(curNode), 1);
            this.closeList.push(curNode);
        }

        if (this.openList.indexOf(endPoint) <= 0) {
            debug("一条路径都未找到！！！");
            return listPath;
        }
        return listPath;
    }

    // 核心算法---检测节点是否通路
    private static checkPath(x: number, y: number, preNode: SimpleCell, endPoint: SimpleCell, c: number): boolean {
        let node: SimpleCell = new SimpleCell(x, y, preNode);
        // 查找地图中是否能通过
        if (!this.cells[y][x].checkMove()) {
            this.closeList.push(node);
            return false;
        }
        // 查找关闭列表中是否存在
        if (this.isListContains(this.closeList, x, y) != -1) {// 存在
            return false;
        }
        // 查找开启列表中是否存在
        let index: number = -1;
        if ((index = this.isListContains(this.openList, x, y)) != -1) {// 存在
            // G值是否更小，即是否更新G，F值
            if ((preNode.g + c) < this.openList[index].g) {
                this.countG(node, endPoint, c);
                this.countF(node);
                this.openList[index] = node;
            }
        } else {
            // 不存在，添加到开启列表中
            node.setParentNode(preNode);
            this.count(node, endPoint, c);
            this.openList.push(node);
        }
        return true;
    }

    // 计算G,H,F值
    private static count(node: SimpleCell, eNode: SimpleCell, cost: number) {
        this.countG(node, eNode, cost);
        this.countH(node, eNode);
        this.countF(node);
    }

    // 计算G值
    private static countG(node: SimpleCell, eNode: SimpleCell, cost: number) {
        if (node.getParentNode() == null) {
            node.setG(cost);
        } else {
            node.setG(node.getParentNode().getG() + cost);
        }
    }

    // 计算H值
    private static countH(node: SimpleCell, eNode: SimpleCell) {
        node.setH((Math.abs(node.getX() - eNode.getX()) + Math.abs(node.getY()
            - eNode.getY())) * 10);
    }

    // 计算F值
    private static countF(node: SimpleCell) {
        node.setF(node.getG() + node.getH());
    }

    // 集合中是否包含某个元素(-1：没有找到，否则返回所在的索引)
    private static isListContains(list: Array<SimpleCell>, x: number, y: number): number {
        for (let i: number = 0; i < list.length; i++) {
            let node: SimpleCell = list[i];
            if (node.getX() == x && node.getY() == y) {
                return i;
            }
        }
        return -1;
    }

    // 找最小值
    private static minList(list: Array<SimpleCell>): SimpleCell {
        let candidate: SimpleCell = null;
        for (let i: number = 0; i < list.length; i++) {
            if (candidate == null) {
                candidate = list[i];
            } else {
                if (list[i].compareTo(candidate) < 0) {
                    candidate = list[i];
                }
            }
        }
        return candidate;
    }



    // // 节点比较类
    // class NodeFComparator implements Comparator<SimpleCell> {
    //     @Override
    //     public int compare(SimpleCell o1, SimpleCell o2) {
    //         return o1.getF() - o2.getF();
    //     }

    // }

    /**
     * 添加记录时只记录折点数据
     * @param listPath
     * @param cell
     */
    private static addPath(listPath: Array<Array<number>>, cell: SimpleCell) {
        let addCell: Array<number> = [cell.getX(), cell.getY()];
        let size: number = listPath.length;
        if (size >= 2) {
            let frist: Array<number> = listPath[size - 2];
            let second: Array<number> = listPath[size - 1];
            if (frist[0] - second[0] == 0 && frist[0] - addCell[0] == 0) {
                listPath.splice(size - 1, 1);
            } else {
                if (frist[0] - second[0] != 0 && frist[0] - addCell[0] != 0) {
                    if (this.slop(frist, second) == this.slop(frist, addCell)) {
                        listPath.splice(size - 1, 1);
                    }
                }
            }
        }
        listPath.push(addCell);
    }

    /**
     * 计算斜率
     * @param simpleCell1
     * @param simpleCell2
     * @return
     */
    public static slop(simpleCell1: Array<number>, simpleCell2: Array<number>): number {
        let a = (simpleCell2[1] - simpleCell1[1]);
        let b = (simpleCell2[0] - simpleCell1[0]);
        let c = a / b;
        return c;
    }
}

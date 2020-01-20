var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AStar = /** @class */ (function (_super_1) {
    __extends(AStar, _super_1);
    function AStar() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    /**
     * 搜寻最短路径
     *
     * @param arr
     * @param startPoint
     * @param endPoint
     */
    AStar.seachWay = function (cells, startCell, endCell) {
        this.cells = cells;
        this.openList = [];
        this.closeList = [];
        var listPath = new Array();
        var row = cells[0].length;
        var col = cells.length;
        var startPoint = SimpleCell.changeTo(startCell);
        var endPoint = SimpleCell.changeTo(endCell);
        var CONST_HENG = 10; // 垂直方向或水平方向移动的路径评分
        var CONST_XIE = 14; // 斜方向移动的路径评分
        var curNode = startPoint;
        if (startPoint.x < 0 || startPoint.y > col || endPoint.x < 0
            || endPoint.y > col || !cells[startPoint.y][startPoint.x].checkMove()
            || !cells[endPoint.y][endPoint.x].checkMove()) {
            debug("AStar:seachWay------>>坐标参数错误！！");
            return listPath;
        }
        this.openList.push(startPoint);
        var isEmpty = this.openList.length == 0;
        var contains = this.openList.indexOf(endPoint) != -1;
        while (!isEmpty && !contains) {
            curNode = this.minList(this.openList);
            var _contains = this.openList.indexOf(endPoint) != -1;
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
                this.checkPath(curNode.x, curNode.y - 1, curNode, endPoint, CONST_HENG);
            }
            // 下
            if (curNode.y + 1 < col) {
                this.checkPath(curNode.x, curNode.y + 1, curNode, endPoint, CONST_HENG);
            }
            // 左
            if (curNode.x - 1 >= 0) {
                this.checkPath(curNode.x - 1, curNode.y, curNode, endPoint, CONST_HENG);
            }
            // 右
            if (curNode.x + 1 < row) {
                this.checkPath(curNode.x + 1, curNode.y, curNode, endPoint, CONST_HENG);
            }
            // 左上
            if (curNode.x - 1 >= 0 && curNode.y - 1 >= 0) {
                this.checkPath(curNode.x - 1, curNode.y - 1, curNode, endPoint, CONST_XIE);
            }
            // 左下
            if (curNode.x - 1 >= 0 && curNode.y + 1 < col) {
                this.checkPath(curNode.x - 1, curNode.y + 1, curNode, endPoint, CONST_XIE);
            }
            // 右上
            if (curNode.x + 1 < row && curNode.y - 1 >= 0) {
                this.checkPath(curNode.x + 1, curNode.y - 1, curNode, endPoint, CONST_XIE);
            }
            // 右下
            if (curNode.x + 1 < row && curNode.y + 1 < col) {
                this.checkPath(curNode.x + 1, curNode.y + 1, curNode, endPoint, CONST_XIE);
            }
            var a = this.openList;
            var b = a.splice(a.indexOf(curNode), 1);
            this.closeList.push(curNode);
        }
        if (this.openList.indexOf(endPoint) <= 0) {
            debug("一条路径都未找到！！！");
            return listPath;
        }
        return listPath;
    };
    // 核心算法---检测节点是否通路
    AStar.checkPath = function (x, y, preNode, endPoint, c) {
        var node = new SimpleCell(x, y, preNode);
        // 查找地图中是否能通过
        if (!this.cells[y][x].checkMove()) {
            this.closeList.push(node);
            return false;
        }
        // 查找关闭列表中是否存在
        if (this.isListContains(this.closeList, x, y) != -1) { // 存在
            return false;
        }
        // 查找开启列表中是否存在
        var index = -1;
        if ((index = this.isListContains(this.openList, x, y)) != -1) { // 存在
            // G值是否更小，即是否更新G，F值
            if ((preNode.g + c) < this.openList[index].g) {
                this.countG(node, endPoint, c);
                this.countF(node);
                this.openList[index] = node;
            }
        }
        else {
            // 不存在，添加到开启列表中
            node.setParentNode(preNode);
            this.count(node, endPoint, c);
            this.openList.push(node);
        }
        return true;
    };
    // 计算G,H,F值
    AStar.count = function (node, eNode, cost) {
        this.countG(node, eNode, cost);
        this.countH(node, eNode);
        this.countF(node);
    };
    // 计算G值
    AStar.countG = function (node, eNode, cost) {
        if (node.getParentNode() == null) {
            node.setG(cost);
        }
        else {
            node.setG(node.getParentNode().getG() + cost);
        }
    };
    // 计算H值
    AStar.countH = function (node, eNode) {
        node.setH((Math.abs(node.getX() - eNode.getX()) + Math.abs(node.getY()
            - eNode.getY())) * 10);
    };
    // 计算F值
    AStar.countF = function (node) {
        node.setF(node.getG() + node.getH());
    };
    // 集合中是否包含某个元素(-1：没有找到，否则返回所在的索引)
    AStar.isListContains = function (list, x, y) {
        for (var i = 0; i < list.length; i++) {
            var node = list[i];
            if (node.getX() == x && node.getY() == y) {
                return i;
            }
        }
        return -1;
    };
    // 找最小值
    AStar.minList = function (list) {
        var candidate = null;
        for (var i = 0; i < list.length; i++) {
            if (candidate == null) {
                candidate = list[i];
            }
            else {
                if (list[i].compareTo(candidate) < 0) {
                    candidate = list[i];
                }
            }
        }
        return candidate;
    };
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
    AStar.addPath = function (listPath, cell) {
        var addCell = [cell.getX(), cell.getY()];
        var size = listPath.length;
        if (size >= 2) {
            var frist = listPath[size - 2];
            var second = listPath[size - 1];
            if (frist[0] - second[0] == 0 && frist[0] - addCell[0] == 0) {
                listPath.splice(size - 1, 1);
            }
            else {
                if (frist[0] - second[0] != 0 && frist[0] - addCell[0] != 0) {
                    if (this.slop(frist, second) == this.slop(frist, addCell)) {
                        listPath.splice(size - 1, 1);
                    }
                }
            }
        }
        listPath.push(addCell);
    };
    /**
     * 计算斜率
     * @param simpleCell1
     * @param simpleCell2
     * @return
     */
    AStar.slop = function (simpleCell1, simpleCell2) {
        var a = (simpleCell2[1] - simpleCell1[1]);
        var b = (simpleCell2[0] - simpleCell1[0]);
        var c = a / b;
        return c;
    };
    return AStar;
}(egret.HashObject));

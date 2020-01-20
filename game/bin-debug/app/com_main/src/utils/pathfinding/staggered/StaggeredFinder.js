/**
 * 菱形交错寻路
 *
 * @author dyhool
 *
 */
var StaggeredFinder = /** @class */ (function () {
    function StaggeredFinder(mapid, cells) {
        /**
         * 路径点上限
         */
        this.PATHMAX = 100;
        this.path = [];
        this.openList = [];
        this.closeList = [];
        this.cells = cells;
        this.width = this.cells[0].length;
        this.height = this.cells.length;
        this.openNodes = Dictionary.create();
        this.TILE_HEIGHT = MapConfig.tileHeight;
        this.TILE_WIDTH = MapConfig.tileWidth;
        this.comparator = new AStar4NodeComparator(this);
        this.mapId = BattleModel.getMapId();
        this.CONST_OBL = this.distance(this.TILE_WIDTH, this.TILE_HEIGHT);
    }
    StaggeredFinder.prototype.sortOpenList = function () {
        this.openList.sort(this.comparator.compare);
    };
    /**
     * 重置寻路状态,在每次寻路前确保调用
     */
    StaggeredFinder.prototype.reset = function (startNode, endNode) {
        this.nodeCount = 0;
        this.startNode = startNode;
        this.endNode = endNode;
        this.openNodes.clear();
        this.openList = [];
        this.closeList = [];
        this.path = [];
    };
    /**
     * 获取节点key
     *
     * @param x
     * @param y
     * @return
     */
    StaggeredFinder.prototype.getNodeKey = function (x, y) {
        return x * this.height + y;
    };
    /**
     * 转化节点
     *
     * @param cell
     * @return
     */
    StaggeredFinder.prototype.toNode = function (cell) {
        return this.buildNode(cell.getCellX(), cell.getCellY(), null);
    };
    /**
     * 构建节点
     *
     * @param x
     * @param y
     * @param parentNode
     * @param endNode
     * @return
     */
    StaggeredFinder.prototype.buildNode = function (x, y, parentNode) {
        return new AStar4Node(this.getNodeKey(x, y), x, y, parentNode);
    };
    /**
     * 搜寻最短路径
     *
     * @param unit
     *            寻路单位
     * @param startCell
     *            起始格子
     * @param endCell
     *            终点格子
     * @return 返回的列表将在寻路中复用,禁止持有该列表引用或修改该列表
     */
    StaggeredFinder.prototype.seachWay = function (startCell, endCell, unit) {
        // 重置寻路信息
        this.reset(this.toNode(startCell), this.toNode(endCell));
        var curNode = this.startNode;
        if (!this.isValidPoint(this.startNode.x, this.startNode.y) || !this.isValidPoint(this.endNode.x, this.endNode.y)
            || !this.cells[this.startNode.y][this.startNode.x].checkMove(unit)
        // 不检查终点,可以找到向着目标尽可能移动的一条路径
        /* || !cells[endPoint.y][endPoint.x].checkMove(unit) */ ) {
            var uid = unit ? unit.getId() : -1;
            error(format("战斗单位({1})寻路坐标参数错误-start:{2}, end:{3}!", uid, this.startNode, this.endNode));
            return null;
        }
        this.openList.push(this.startNode);
        this.sortOpenList();
        this.openNodes.add(this.startNode.key, this.startNode);
        while (!(this.openList.length == 0)) {
            var findResult = false;
            if (this.openNodes.get(this.endNode.key)) {
                if (this.cells[this.endNode.y][this.endNode.x].checkMove(unit)) {
                    // 如果终点可行则加入终点
                    curNode = this.endNode;
                }
                findResult = true;
            }
            else {
                curNode = this.openList[0];
            }
            if (findResult || curNode.equals(this.endNode) || this.nodeCount > this.PATHMAX) {
                while (curNode != null) {
                    this.addPath(curNode);
                    curNode = curNode.getParentNode();
                }
                return this.path;
            }
            var flag = curNode.y & 1;
            // 上
            if (curNode.y - 2 >= 0) {
                this.checkPath(unit, curNode.x, curNode.y - 2, curNode, this.TILE_HEIGHT);
            }
            // 下
            if (curNode.y + 2 < this.height) {
                this.checkPath(unit, curNode.x, curNode.y + 2, curNode, this.TILE_HEIGHT);
            }
            // 左
            if (curNode.x - 1 >= 0) {
                this.checkPath(unit, curNode.x - 1, curNode.y, curNode, this.TILE_WIDTH);
            }
            // 右
            if (curNode.x + 1 < this.width) {
                this.checkPath(unit, curNode.x + 1, curNode.y, curNode, this.TILE_WIDTH);
            }
            //如果当前格子y坐标为偶数
            if (flag == 0) {
                // 左上
                if (curNode.x - 1 >= 0 && curNode.y - 1 >= 0) {
                    this.checkPath(unit, curNode.x - 1, curNode.y - 1, curNode, this.CONST_OBL);
                }
                // 左下
                if (curNode.x - 1 >= 0 && curNode.y + 1 < this.height) {
                    this.checkPath(unit, curNode.x - 1, curNode.y + 1, curNode, this.CONST_OBL);
                }
                // 右上
                if (curNode.y - 1 >= 0) {
                    this.checkPath(unit, curNode.x, curNode.y - 1, curNode, this.CONST_OBL);
                }
                // 右下
                if (curNode.y + 1 < this.height) {
                    this.checkPath(unit, curNode.x, curNode.y + 1, curNode, this.CONST_OBL);
                }
            }
            else {
                // 左上
                if (curNode.y - 1 >= 0) {
                    this.checkPath(unit, curNode.x, curNode.y - 1, curNode, this.CONST_OBL);
                }
                // 左下
                if (curNode.y + 1 < this.height) {
                    this.checkPath(unit, curNode.x, curNode.y + 1, curNode, this.CONST_OBL);
                }
                // 右上
                if (curNode.x + 1 < this.width && curNode.y - 1 >= 0) {
                    this.checkPath(unit, curNode.x + 1, curNode.y - 1, curNode, this.CONST_OBL);
                }
                // 右下
                if (curNode.x + 1 < this.width && curNode.y + 1 < this.height) {
                    this.checkPath(unit, curNode.x + 1, curNode.y + 1, curNode, this.CONST_OBL);
                }
            }
            this.openList.splice(this.openList.indexOf(curNode), 1);
            this.openNodes.del(curNode.key);
            this.closeList.push(curNode.key);
        }
        return null;
    };
    /**
     * 判定坐标是否越界
     *
     * @param x
     * @param y
     * @return
     */
    StaggeredFinder.prototype.isValidPoint = function (x, y) {
        if (x < 0 || x >= this.width) {
            return false;
        }
        if (y < 0 || y >= this.height) {
            return false;
        }
        return true;
    };
    /**
     * 添加可通路节点
     *
     * @param unit
     * @param x
     * @param y
     * @param preNode
     * @param c
     * @return
     */
    StaggeredFinder.prototype.checkPath = function (unit, x, y, preNode, c) {
        if (!this.isValidPoint(x, y)) {
            return false;
        }
        var nodeKey = this.getNodeKey(x, y);
        if (x == this.endNode.getX() && y == this.endNode.getY()) {
            // 如果与终点格子相邻，则添加终点格子
            this.endNode.setParentNode(preNode);
            this.openNodes.add(this.endNode.key, this.endNode);
            this.openList.push(this.endNode);
            this.sortOpenList();
            return true;
        }
        // 查找地图中是否能通过
        if (!this.cells[y][x].checkMove(unit)) {
            this.closeList.push(nodeKey);
            return false;
        }
        // 查找关闭列表中是否存在
        if (this.closeList.indexOf(nodeKey) > 0) { // 存在
            return false;
        }
        // 查找开启列表中是否存在
        var node = this.openNodes.get(nodeKey);
        if (node != null) { // 存在
            // G值是否更小，即是否更新G，F值
            if ((preNode.getG() + c) < node.getG()) {
                this.openList.splice(this.openList.indexOf(node), 1);
                // 更新父节点
                node.setParentNode(preNode);
                this.count(node, this.endNode, c);
                this.openList.push(node);
                this.sortOpenList();
            }
        }
        else {
            // 不存在，添加到开启列表中
            node = this.buildNode(x, y, preNode);
            this.count(node, this.endNode, c);
            this.openNodes.add(node.key, node);
            this.openList.push(node);
            this.sortOpenList();
            this.nodeCount++;
        }
        return true;
    };
    /**
     * 添加记录时只记录折点数据
     *
     * @param listPath
     * @param cell
     */
    StaggeredFinder.prototype.addPath = function (cell) {
        var addCell = new egret.Point(cell.getX(), cell.getY());
        var size = this.path.length;
        if (size >= 2) {
            var frist = this.path[size - 2];
            var second = this.path[size - 1];
            //判断是否垂直
            if (frist.x == second.x && frist.x == addCell.x) {
                if ((frist.y & 1) == (second.y & 1) && ((frist.y & 1) == (addCell.y & 1))) {
                    this.path.splice(size - 1, 1);
                }
            }
            else {
                //判断斜线
                if (frist.x - second.x != 0 && frist.x - addCell.x != 0) {
                    if (this.slop(frist, second) == this.slop(frist, addCell)) {
                        this.path.splice(size - 1, 1);
                    }
                }
            }
        }
        this.path.push(addCell);
    };
    // 计算G,H,F值
    StaggeredFinder.prototype.count = function (node, eNode, cost) {
        this.countG(node, eNode, cost);
        this.countH(node, eNode);
        this.countF(node);
    };
    // 计算G值
    StaggeredFinder.prototype.countG = function (node, eNode, cost) {
        if (node.getParentNode() == null) {
            node.setG(cost);
        }
        else {
            node.setG(node.getParentNode().getG() + cost);
        }
    };
    // 计算H值
    StaggeredFinder.prototype.countH = function (node, eNode) {
        node.setH((Math.abs(node.getX() - eNode.getX()) + Math.abs(node.getY() - eNode.getY())) * 10);
    };
    // 计算F值
    StaggeredFinder.prototype.countF = function (node) {
        node.setF(node.getG() + node.getH());
    };
    /**
     * 计算斜率
     *
     * @param simpleCell1
     * @param simpleCell2
     * @return
     */
    /*	public static double slop(Point simpleCell1, Point simpleCell2) throws ArithmeticException {
            return (double) (simpleCell2.getY() / 2 - simpleCell1.getY() / 2) / (2 *(simpleCell2.getX() - simpleCell1.getX()));
        }*/
    StaggeredFinder.prototype.slop = function (simpleCell1, simpleCell2) {
        var temp1 = MapLoader.cellToPixel(simpleCell1.x, simpleCell1.y, this.mapId);
        var temp2 = MapLoader.cellToPixel(simpleCell2.x, simpleCell2.y, this.mapId);
        if (!temp2[1] || !temp1[1]) {
            return 0;
        }
        return (temp2[1] - temp1[1]) / (temp2[0] - temp1[0]);
    };
    /**
     * 计算格子的对角线长度
     * @param x
     * @param y
     * @return
     */
    StaggeredFinder.prototype.distance = function (x, y) {
        return parseInt(Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))).toFixed());
    };
    return StaggeredFinder;
}());
/**比较类 */
var AStar4NodeComparator = /** @class */ (function () {
    function AStar4NodeComparator(router) {
        this.router = router;
    }
    // @Override
    AStar4NodeComparator.prototype.compare = function (o1, o2) {
        if (o1.key == o2.key) {
            return 0;
        }
        var result = o1.getF() - o2.getF();
        if (result == 0) {
            result = (Math.abs(o1.x - this.router.endNode.x) + Math.abs(o1.y - this.router.endNode.y))
                - (Math.abs(o2.x - this.router.endNode.x) + Math.abs(o2.y - this.router.endNode.y));
            if (result == 0) {
                return o1.key - o2.key;
            }
        }
        return result;
    };
    return AStar4NodeComparator;
}());

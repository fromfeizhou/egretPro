/**
 * 菱形交错寻路
 * 
 * @author dyhool
 *
 */

class StaggeredFinder {
	/**
	 * 路径点上限
	 */
	private PATHMAX: number = 100;

	// 地图大小
	private width: number;
	private height: number;
	// 格子宽（像素）
	private TILE_WIDTH: number;
	// 格子高（像素）
	private TILE_HEIGHT: number;
	// 斜向相邻格子距离（像素）
	private CONST_OBL: number;
	// 地图名
	private mapId: number;
	// 地图信息
	private cells: Cell[][];
	// 查找节点计数器
	private nodeCount: number;
	// 比较器
	private comparator: AStar4NodeComparator;
	// 开启节点集合 Map<Integer, AStar4Node>
	private openNodes: Dictionary;
	// 开启列表 TreeSet<AStar4Node>
	private openList: AStar4Node[];
	// 关闭列表 HashSet<Integer>
	private closeList: number[];
	// 结果路径 List<Point>
	private path: egret.Point[];
	// 起始节点
	public startNode: AStar4Node;
	public endNode: AStar4Node;

	public constructor(mapid: number, cells: Cell[][]) {
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

	public sortOpenList() {
		this.openList.sort(this.comparator.compare)
	}
	/**
	 * 重置寻路状态,在每次寻路前确保调用
	 */
	private reset(startNode: AStar4Node, endNode: AStar4Node) {
		this.nodeCount = 0;
		this.startNode = startNode;
		this.endNode = endNode;
		this.openNodes.clear();
		this.openList = [];
		this.closeList = [];
		this.path = [];
	}

	/**
	 * 获取节点key
	 * 
	 * @param x
	 * @param y
	 * @return
	 */
	private getNodeKey(x: number, y: number): number {
		return x * this.height + y;
	}

	/**
	 * 转化节点
	 * 
	 * @param cell
	 * @return
	 */
	private toNode(cell: Cell): AStar4Node {
		return this.buildNode(cell.getCellX(), cell.getCellY(), null);
	}

	/**
	 * 构建节点
	 * 
	 * @param x
	 * @param y
	 * @param parentNode
	 * @param endNode
	 * @return
	 */
	private buildNode(x: number, y: number, parentNode: AStar4Node): AStar4Node {
		return new AStar4Node(this.getNodeKey(x, y), x, y, parentNode);
	}

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
	public seachWay(startCell: Cell, endCell: Cell, unit: Unit): egret.Point[] {
		// 重置寻路信息
		this.reset(this.toNode(startCell), this.toNode(endCell));

		let curNode: AStar4Node = this.startNode;
		if (!this.isValidPoint(this.startNode.x, this.startNode.y) || !this.isValidPoint(this.endNode.x, this.endNode.y)
			|| !this.cells[this.startNode.y][this.startNode.x].checkMove(unit)
			// 不检查终点,可以找到向着目标尽可能移动的一条路径
			/* || !cells[endPoint.y][endPoint.x].checkMove(unit) */) {
			let uid = unit ? unit.getId() : -1;
			error(format("战斗单位({1})寻路坐标参数错误-start:{2}, end:{3}!", uid, this.startNode, this.endNode));
			return null;
		}

		this.openList.push(this.startNode);
		this.sortOpenList();
		this.openNodes.add(this.startNode.key, this.startNode);
		while (!(this.openList.length == 0)) {
			let findResult: boolean = false;
			if (this.openNodes.get(this.endNode.key)) {
				if (this.cells[this.endNode.y][this.endNode.x].checkMove(unit)) {
					// 如果终点可行则加入终点
					curNode = this.endNode;
				}
				findResult = true;
			} else {
				curNode = this.openList[0];
			}
			if (findResult || curNode.equals(this.endNode) || this.nodeCount > this.PATHMAX) {
				while (curNode != null) {
					this.addPath(curNode);
					curNode = curNode.getParentNode();
				}
				return this.path;
			}

			let flag: number = curNode.y & 1;

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
			} else {
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
	}

	/**
	 * 判定坐标是否越界
	 * 
	 * @param x
	 * @param y
	 * @return
	 */
	private isValidPoint(x: number, y: number): boolean {
		if (x < 0 || x >= this.width) {
			return false;
		}
		if (y < 0 || y >= this.height) {
			return false;
		}
		return true;
	}

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
	private checkPath(unit, x: number, y: number, preNode: AStar4Node, c: number): boolean {
		if (!this.isValidPoint(x, y)) {
			return false;
		}
		let nodeKey: number = this.getNodeKey(x, y);
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
		if (this.closeList.indexOf(nodeKey) > 0) {// 存在
			return false;
		}
		// 查找开启列表中是否存在
		let node: AStar4Node = this.openNodes.get(nodeKey);
		if (node != null) {// 存在
			// G值是否更小，即是否更新G，F值
			if ((preNode.getG() + c) < node.getG()) {
				this.openList.splice(this.openList.indexOf(node), 1);
				// 更新父节点
				node.setParentNode(preNode);
				this.count(node, this.endNode, c);
				this.openList.push(node);
				this.sortOpenList();
			}
		} else {
			// 不存在，添加到开启列表中
			node = this.buildNode(x, y, preNode);
			this.count(node, this.endNode, c);
			this.openNodes.add(node.key, node);
			this.openList.push(node);
			this.sortOpenList();
			this.nodeCount++;
		}
		return true;
	}

	/**
	 * 添加记录时只记录折点数据
	 * 
	 * @param listPath
	 * @param cell
	 */
	private addPath(cell: AStar4Node) {
		let addCell: egret.Point = new egret.Point(cell.getX(), cell.getY());
		let size: number = this.path.length;
		if (size >= 2) {
			let frist: egret.Point = this.path[size - 2];
			let second: egret.Point = this.path[size - 1];

			//判断是否垂直
			if (frist.x == second.x && frist.x == addCell.x) {
				if ((frist.y & 1) == (second.y & 1) && ((frist.y & 1) == (addCell.y & 1))) {
					this.path.splice(size - 1, 1);
				}
			} else {
				//判断斜线
				if (frist.x - second.x != 0 && frist.x - addCell.x != 0) {
					if (this.slop(frist, second) == this.slop(frist, addCell)) {
						this.path.splice(size - 1, 1);
					}
				}
			}
		}
		this.path.push(addCell);
	}

	// 计算G,H,F值
	public count(node: AStar4Node, eNode: AStar4Node, cost: number) {
		this.countG(node, eNode, cost);
		this.countH(node, eNode);
		this.countF(node);
	}

	// 计算G值
	public countG(node: AStar4Node, eNode: AStar4Node, cost: number) {
		if (node.getParentNode() == null) {
			node.setG(cost);
		} else {
			node.setG(node.getParentNode().getG() + cost);
		}
	}

	// 计算H值
	public countH(node: AStar4Node, eNode: AStar4Node) {
		node.setH((Math.abs(node.getX() - eNode.getX()) + Math.abs(node.getY() - eNode.getY())) * 10);
	}

	// 计算F值
	public countF(node: AStar4Node) {
		node.setF(node.getG() + node.getH());
	}

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
	public slop(simpleCell1: egret.Point, simpleCell2: egret.Point): number {
		let temp1: number[] = MapLoader.cellToPixel(simpleCell1.x, simpleCell1.y, this.mapId);
		let temp2: number[] = MapLoader.cellToPixel(simpleCell2.x, simpleCell2.y, this.mapId);
		if (!temp2[1] || !temp1[1]) {
			return 0
		}
		return (temp2[1] - temp1[1]) / (temp2[0] - temp1[0]);
	}


	/**
	 * 计算格子的对角线长度
	 * @param x
	 * @param y
	 * @return
	 */
	private distance(x: number, y: number): number {
		return parseInt(Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))).toFixed());
	}
}

/**比较类 */
class AStar4NodeComparator {
	private router: StaggeredFinder;
	public constructor(router: StaggeredFinder) {
		this.router = router;
	}
	// @Override
	public compare(o1: AStar4Node, o2: AStar4Node) {
		if (o1.key == o2.key) {
			return 0;
		}
		let result: number = o1.getF() - o2.getF();
		if (result == 0) {
			result = (Math.abs(o1.x - this.router.endNode.x) + Math.abs(o1.y - this.router.endNode.y))
				- (Math.abs(o2.x - this.router.endNode.x) + Math.abs(o2.y - this.router.endNode.y));
			if (result == 0) {
				return o1.key - o2.key;
			}
		}
		return result;
	}
}
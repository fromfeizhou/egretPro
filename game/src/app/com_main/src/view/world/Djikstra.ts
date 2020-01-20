module com_main {

	/**Djikstra顶点 */
	export class DjikstraVertex {

		private m_iid: number = 0;	//城市id
		private m_EdgesOut: { [k: number]: DjikstraEdge } = {};	//去目标点 k 的路径
		private m_EdgesIn: { [k: number]: DjikstraEdge } = {};	//目标点k 来的路径
		private m_cost: number = 0;
		private m_flag: number = 0;
		private m_parent: DjikstraVertex;
		private m_pos: number[] = [];	//城市坐标 [x,y]


		public constructor(iid: number, pos: number[]) {
			this.m_iid = iid;
			this.m_pos = pos;
		}

		public get iid(): number {
			return this.m_iid;
		}

		public get cost(): number {
			return this.m_cost;
		}

		public set cost(v: number) {
			this.m_cost = v;
		}

		public get flag(): number {
			return this.m_flag;
		}

		public set flag(v: number) {
			this.m_flag = v;
		}

		public get parent(): DjikstraVertex {
			return this.m_parent;
		}

		public set parent(v: DjikstraVertex) {
			this.m_parent = v;
		}

		public get pos(): number[] {
			return this.m_pos;
		}

		public get cityPos(): number[] {
			for (let key in this.m_EdgesOut) {
				if (this.m_EdgesOut[key].way) {
					return this.m_EdgesOut[key].way[0];
				}
			}
			return [100, 100]
		}
		/**可通行 */
		public get status(): boolean {
			// return true;
			let conf = WorldModel.getCityBuildInfo(this.iid);
			return conf.country == RoleData.countryId;
		}

		public setEdgeOut(iid: number, edge: DjikstraEdge): void {
			this.m_EdgesOut[iid] = edge;
		}

		public setEdgeIn(iid: number, edge: DjikstraEdge): void {
			this.m_EdgesIn[iid] = edge;
		}

		public removeEdgeOut(iid: number): void {
			delete this.m_EdgesOut[iid];
		}

		public removeEdgeIn(iid: number): void {
			delete this.m_EdgesIn[iid];
		}

		public clear(cb: (iid: number, ver: DjikstraVertex) => void, target: any): void {
			for (let iid in this.m_EdgesOut) {
				let id = Number(iid)
					, edge = this.m_EdgesOut[id];
				edge.eVertex.removeEdgeIn(id);
				cb.call(target, id, edge.eVertex);
			}
		}
		/**
		 * 起点 到达当前节点的周边节点的消耗（嵌套执行结果 为起点 到达任意点的最短消耗）
		 */
		public relax(): void {
			for (let iid in this.m_EdgesOut) {
				if (this.status) {
					let edge = this.m_EdgesOut[iid]
						, eVer = edge.eVertex
						, n = this.cost + edge.length;//到当前节点的累计消耗(未计算的周边节点 消耗max 所以路径不会往回)
					if (n < eVer.cost) {
						eVer.cost = n;
						eVer.parent = this;
					}
				}
			}
		}

		public reset(): void {
			this.m_EdgesOut = {};
			this.m_EdgesIn = {};
			this.m_parent = null;
		}


	}

	/**Djikstra边 */
	export class DjikstraEdge {

		private m_oVertex: DjikstraVertex;	//起点
		private m_eVertex: DjikstraVertex;	//终点
		private m_length: number = 0;		//直线距离
		private m_way: number[][] = [];		//路径点
		private m_dt: number = 0;		//移动总时间
		private m_speed: number = 0;	//移动速度 计算所得


		public constructor(originVertex: DjikstraVertex, endVertex: DjikstraVertex, length: number, way: number[][], dt: number) {
			this.m_oVertex = originVertex;
			this.m_eVertex = endVertex;
			this.m_length = length;
			// let w = way.filter((x, indx) => {
			// 	return indx % 2 == 0 || indx == 0 || indx == way.length - 1;
			// })
			this.m_way = way;
			this.m_dt = dt;
			this.m_speed = this.m_way.length > 0 ? Math.floor(dt / (this.m_way.length - 2) * 1000) : 0;
		}

		public get eVertex(): DjikstraVertex {
			return this.m_eVertex;
		}

		public get length(): number {
			return this.m_length;
		}

		public get dt(): number {
			return this.m_dt;
		}

		public get speed(): number {
			return this.m_speed;
		}

		public get way(): number[][] {
			return [...this.m_way];
		}

		public reset(): void {
			this.m_eVertex = null;
			this.m_oVertex = null;
		}

	}

	/**Djikstra世界 */
	export class DjikstraGraph {

		public static readonly Instance: DjikstraGraph = new DjikstraGraph();
		private m_Vertexes: { [k: number]: DjikstraVertex } = {};	//顶点集合
		private m_Edges: { [k: string]: DjikstraEdge } = {};		//边集合

		public constructor() {

		}

		protected reset(): void {
			for (let i in this.m_Vertexes) {
				let o = this.m_Vertexes[i];
				o.reset();
			}
			this.m_Vertexes = {};
			for (let i in this.m_Edges) {
				let o = this.m_Edges[i];
				o.reset();
			}
			this.m_Edges = {};
		}

		public async initGraph() {
			let config = C.WorldMapConfig;
			// let keys = Object.keys(this.m_Vertexes);
			// if (keys.length == config.length - 1) return;
			this.reset();
			let citys: { [k: number]: egret.Point } = {};
			for (let id in config) {
				let conf: WorldMapConfig = config[id];
				if (conf.mapId !== SceneManager.getCurrScene()) continue;
				this.CreateVertex(Number(id), [conf.posX, conf.posY]);
				citys[id] = egret.Point.create(conf.posX, conf.posY);
			}

			let ways = {};
			for (let id in C.WorldWayConfig) {
				let conf = C.WorldWayConfig[id]
					, way: number[][] = JSON.parse(conf.way);
				ways[`${conf.start}->${conf.end}`] = [...way];
				ways[`${conf.end}->${conf.start}`] = way.reverse();
			}

			for (let id in config) {
				let conf: WorldMapConfig = config[id]
					, pos: egret.Point = citys[id]
					// , aids = conf.aroundCityId.split(',');
					, aids = JSON.parse(conf.aroundCityId)
				if (conf.mapId !== SceneManager.getCurrScene()) continue;
				let _dt = {}
				for (let v of conf.time.split(',')) {
					let [id, dt] = v.split('_');
					_dt[id] = Number(dt);
				}
				for (let aid of aids) {
					let conf: WorldMapConfig = config[aid]
					if (conf.mapId !== SceneManager.getCurrScene()) continue;
					let dis = egret.Point.distance(pos, citys[aid]);
					let way = ways[`${id}->${aid}`];
					if (!way) {
						error(`边[${id}->${aid}]为空`);
					}
					if (!dis) {
						debug('城市间距为空');
					}
					this.AddEdge(Number(id), Number(aid), Math.floor(dis), way, _dt[`${aid}`]);
				}
			}
		}

		public get Vertexes(): { [k: number]: DjikstraVertex } {
			return this.m_Vertexes;
		}

		public GetVertex(iid: number): DjikstraVertex {
			return this.m_Vertexes[iid];
		}

		public CreateVertex(iid: number, pos: number[]): DjikstraVertex {
			let vetx = new DjikstraVertex(iid, pos);
			this.AddVertex(vetx);
			return vetx;
		}

		/**添加顶点 */
		public AddVertex(vetx: DjikstraVertex): void {
			this.m_Vertexes[vetx.iid] = vetx;
		}

		/**删除顶点 */
		public DeleleVertex(iid: number): void {
			let pv = this.m_Vertexes[iid];
			if (!pv) return;

			pv.clear((iid: number, ver: DjikstraVertex) => {
				delete this.m_Edges[`${iid}->${ver.iid}`];
			}, this);

			delete this.m_Vertexes[iid];
		}

		/**添加边 */
		public AddEdge(start: number, end: number, len: number, way: number[][], dt: number): void {
			let pv1 = this.m_Vertexes[start]
				, pv2 = this.m_Vertexes[end];
			if (!pv1 || !pv2)
				return;

			let edge = new DjikstraEdge(pv1, pv2, len, way, dt);
			this.m_Edges[`${start}->${end}`] = edge;
			pv1.setEdgeOut(end, edge);
			pv2.setEdgeIn(start, edge);
		}

		/**删除边 */
		public DeleteEdge(start: number, end: number): void {
			let pv1 = this.m_Vertexes[start]
				, pv2 = this.m_Vertexes[end];
			if (!pv1 || !pv2)
				return;

			delete this.m_Edges[`${start}->${end}`];
			pv1.removeEdgeOut(end);
			pv2.removeEdgeIn(start);
		}

		public GetEdge(start: number, end: number): [boolean, DjikstraEdge] {
			let o = start > end
				, n = o ? `${start}->${end}` : `${end}->${start}`
				, edge = this.m_Edges[n];
			return [o, edge]
		}

		public GetEdgePoint(start: number, end: number, cb?: (e: DjikstraEdge) => void, target?: any): number[][] {
			let o = start > end
				, n = o ? `${start}->${end}` : `${end}->${start}`
				, edge = this.m_Edges[n];

			if (!edge) return [];

			if (cb) cb.call(target, edge);

			return o ? edge.way : edge.way.reverse();
		}

		public GetEdgeTime(iids: number[]): [number, number, number[][]] {
			let dt = 0, i = 0, l = 0, way: number[][] = [];
			iids.reduce((start, end, index, arr) => {
				let o = start > end
					, [_, edge] = this.GetEdge(start, end);
				if (edge) {
					let reduceTimePercent = CityBuildModel.getCityPrivilegeValues(start, CityRewardType.MOVE); 
					dt += edge.dt * (1 - reduceTimePercent / 10000);
					l += edge.way.length;
					way = way.concat(o ? edge.way : edge.way.reverse());
				}
				return end;
			});
			let speed = l > 0 ? Math.floor(dt / (l - 3) * 1000) : 0;
			return [dt, speed, way];
		}

		public GetWayTime(start: number, end: number): [number, number, number[][]] {
			start = this.getMappCity(start);
			this.execute(start);
			let vert = this.walkVertexs(end);

			if (isNull(vert) || vert.length == 0) {
				return [0, 0, null];
			}
			let l = [];
			for (let v of vert) {
				l.push(v.iid)
			}
			l.reverse();
			l.push(end);
			return this.GetEdgeTime(l);
		}
		public getMappCity(cityId: number): number {
			let conf: WorldMapConfig = C.WorldMapConfig[cityId];
			if (conf && conf.mapId != SceneManager.getCurrScene() && conf.mapCity != 0) cityId = conf.mapCity;
			return cityId;
		}
		/**
		 * 路径树
		 * 初始化顶点 相邻节点消耗
		 * 当前顶点消耗为0
		 *  */
		public execute(vetexid: number): void {
			vetexid = this.getMappCity(vetexid);
			let vtex = this.GetVertex(vetexid)
				, lis: DjikstraVertex[] = [];
			if (isNull(vtex)) return;
			for (let iid in this.Vertexes) {
				let v = this.GetVertex(Number(iid));
				v.cost = 0x0FFFFFFF;
				v.parent = null;
				lis.push(v);
			}

			vtex.cost = 0;
			let v: DjikstraVertex;
			while (lis.length > 0) {
				[v, lis] = this.extractMin(lis);
				if (!v) break;
				v.relax();
			}
		}

		public walkVertexs(iid: number): DjikstraVertex[] {
			let l: DjikstraVertex[] = []
				, vtex = this.GetVertex(iid);
			if (!vtex)
				return l;
			let parent = vtex.parent;
			while (parent) {
				l.push(parent);
				parent = parent.parent;
			}
			return l;
		}

		public walkIds(iid: number): number[] {
			let l: number[] = []
				, vtex = this.GetVertex(iid);
			if (!vtex)
				return l;
			l.push(iid);
			let parent = vtex.parent;
			while (parent) {
				l.push(parent.iid);
				parent = parent.parent;
			}
			//路径逆转 返回结果
			l.reverse();
			return l;
		}



		private extractMin(l: DjikstraVertex[]): any[] {
			if (l.length == 0)
				return [null, []];
			let vtex = l[0]
				, i = 0
				, indx = 0;
			for (let o of l) {
				if (vtex.cost > o.cost) {
					vtex = o;
					indx = i;
				}
				i++;
			}
			l.splice(indx, 1);
			return [vtex, l];
		}

	}

}
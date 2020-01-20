var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var com_main;
(function (com_main) {
    /**Djikstra顶点 */
    var DjikstraVertex = /** @class */ (function () {
        function DjikstraVertex(iid, pos) {
            this.m_iid = 0; //城市id
            this.m_EdgesOut = {}; //去目标点 k 的路径
            this.m_EdgesIn = {}; //目标点k 来的路径
            this.m_cost = 0;
            this.m_flag = 0;
            this.m_pos = []; //城市坐标 [x,y]
            this.m_iid = iid;
            this.m_pos = pos;
        }
        Object.defineProperty(DjikstraVertex.prototype, "iid", {
            get: function () {
                return this.m_iid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraVertex.prototype, "cost", {
            get: function () {
                return this.m_cost;
            },
            set: function (v) {
                this.m_cost = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraVertex.prototype, "flag", {
            get: function () {
                return this.m_flag;
            },
            set: function (v) {
                this.m_flag = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraVertex.prototype, "parent", {
            get: function () {
                return this.m_parent;
            },
            set: function (v) {
                this.m_parent = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraVertex.prototype, "pos", {
            get: function () {
                return this.m_pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraVertex.prototype, "cityPos", {
            get: function () {
                for (var key in this.m_EdgesOut) {
                    if (this.m_EdgesOut[key].way) {
                        return this.m_EdgesOut[key].way[0];
                    }
                }
                return [100, 100];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraVertex.prototype, "status", {
            /**可通行 */
            get: function () {
                // return true;
                var conf = WorldModel.getCityBuildInfo(this.iid);
                return conf.country == RoleData.countryId;
            },
            enumerable: true,
            configurable: true
        });
        DjikstraVertex.prototype.setEdgeOut = function (iid, edge) {
            this.m_EdgesOut[iid] = edge;
        };
        DjikstraVertex.prototype.setEdgeIn = function (iid, edge) {
            this.m_EdgesIn[iid] = edge;
        };
        DjikstraVertex.prototype.removeEdgeOut = function (iid) {
            delete this.m_EdgesOut[iid];
        };
        DjikstraVertex.prototype.removeEdgeIn = function (iid) {
            delete this.m_EdgesIn[iid];
        };
        DjikstraVertex.prototype.clear = function (cb, target) {
            for (var iid in this.m_EdgesOut) {
                var id = Number(iid), edge = this.m_EdgesOut[id];
                edge.eVertex.removeEdgeIn(id);
                cb.call(target, id, edge.eVertex);
            }
        };
        /**
         * 起点 到达当前节点的周边节点的消耗（嵌套执行结果 为起点 到达任意点的最短消耗）
         */
        DjikstraVertex.prototype.relax = function () {
            for (var iid in this.m_EdgesOut) {
                if (this.status) {
                    var edge = this.m_EdgesOut[iid], eVer = edge.eVertex, n = this.cost + edge.length; //到当前节点的累计消耗(未计算的周边节点 消耗max 所以路径不会往回)
                    if (n < eVer.cost) {
                        eVer.cost = n;
                        eVer.parent = this;
                    }
                }
            }
        };
        DjikstraVertex.prototype.reset = function () {
            this.m_EdgesOut = {};
            this.m_EdgesIn = {};
            this.m_parent = null;
        };
        return DjikstraVertex;
    }());
    com_main.DjikstraVertex = DjikstraVertex;
    /**Djikstra边 */
    var DjikstraEdge = /** @class */ (function () {
        function DjikstraEdge(originVertex, endVertex, length, way, dt) {
            this.m_length = 0; //直线距离
            this.m_way = []; //路径点
            this.m_dt = 0; //移动总时间
            this.m_speed = 0; //移动速度 计算所得
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
        Object.defineProperty(DjikstraEdge.prototype, "eVertex", {
            get: function () {
                return this.m_eVertex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraEdge.prototype, "length", {
            get: function () {
                return this.m_length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraEdge.prototype, "dt", {
            get: function () {
                return this.m_dt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraEdge.prototype, "speed", {
            get: function () {
                return this.m_speed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DjikstraEdge.prototype, "way", {
            get: function () {
                return this.m_way.slice();
            },
            enumerable: true,
            configurable: true
        });
        DjikstraEdge.prototype.reset = function () {
            this.m_eVertex = null;
            this.m_oVertex = null;
        };
        return DjikstraEdge;
    }());
    com_main.DjikstraEdge = DjikstraEdge;
    /**Djikstra世界 */
    var DjikstraGraph = /** @class */ (function () {
        function DjikstraGraph() {
            this.m_Vertexes = {}; //顶点集合
            this.m_Edges = {}; //边集合
        }
        DjikstraGraph.prototype.reset = function () {
            for (var i in this.m_Vertexes) {
                var o = this.m_Vertexes[i];
                o.reset();
            }
            this.m_Vertexes = {};
            for (var i in this.m_Edges) {
                var o = this.m_Edges[i];
                o.reset();
            }
            this.m_Edges = {};
        };
        DjikstraGraph.prototype.initGraph = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, citys, id, conf, ways, id, conf, way, id, conf, pos, aids, _dt, _i, _a, v, _b, id_1, dt, _c, aids_1, aid, conf_1, dis, way;
                return __generator(this, function (_d) {
                    config = C.WorldMapConfig;
                    // let keys = Object.keys(this.m_Vertexes);
                    // if (keys.length == config.length - 1) return;
                    this.reset();
                    citys = {};
                    for (id in config) {
                        conf = config[id];
                        if (conf.mapId !== SceneManager.getCurrScene())
                            continue;
                        this.CreateVertex(Number(id), [conf.posX, conf.posY]);
                        citys[id] = egret.Point.create(conf.posX, conf.posY);
                    }
                    ways = {};
                    for (id in C.WorldWayConfig) {
                        conf = C.WorldWayConfig[id], way = JSON.parse(conf.way);
                        ways[conf.start + "->" + conf.end] = way.slice();
                        ways[conf.end + "->" + conf.start] = way.reverse();
                    }
                    for (id in config) {
                        conf = config[id], pos = citys[id], aids = JSON.parse(conf.aroundCityId);
                        if (conf.mapId !== SceneManager.getCurrScene())
                            continue;
                        _dt = {};
                        for (_i = 0, _a = conf.time.split(','); _i < _a.length; _i++) {
                            v = _a[_i];
                            _b = v.split('_'), id_1 = _b[0], dt = _b[1];
                            _dt[id_1] = Number(dt);
                        }
                        for (_c = 0, aids_1 = aids; _c < aids_1.length; _c++) {
                            aid = aids_1[_c];
                            conf_1 = config[aid];
                            if (conf_1.mapId !== SceneManager.getCurrScene())
                                continue;
                            dis = egret.Point.distance(pos, citys[aid]);
                            way = ways[id + "->" + aid];
                            if (!way) {
                                error("\u8FB9[" + id + "->" + aid + "]\u4E3A\u7A7A");
                            }
                            if (!dis) {
                                debug('城市间距为空');
                            }
                            this.AddEdge(Number(id), Number(aid), Math.floor(dis), way, _dt["" + aid]);
                        }
                    }
                    return [2 /*return*/];
                });
            });
        };
        Object.defineProperty(DjikstraGraph.prototype, "Vertexes", {
            get: function () {
                return this.m_Vertexes;
            },
            enumerable: true,
            configurable: true
        });
        DjikstraGraph.prototype.GetVertex = function (iid) {
            return this.m_Vertexes[iid];
        };
        DjikstraGraph.prototype.CreateVertex = function (iid, pos) {
            var vetx = new DjikstraVertex(iid, pos);
            this.AddVertex(vetx);
            return vetx;
        };
        /**添加顶点 */
        DjikstraGraph.prototype.AddVertex = function (vetx) {
            this.m_Vertexes[vetx.iid] = vetx;
        };
        /**删除顶点 */
        DjikstraGraph.prototype.DeleleVertex = function (iid) {
            var _this = this;
            var pv = this.m_Vertexes[iid];
            if (!pv)
                return;
            pv.clear(function (iid, ver) {
                delete _this.m_Edges[iid + "->" + ver.iid];
            }, this);
            delete this.m_Vertexes[iid];
        };
        /**添加边 */
        DjikstraGraph.prototype.AddEdge = function (start, end, len, way, dt) {
            var pv1 = this.m_Vertexes[start], pv2 = this.m_Vertexes[end];
            if (!pv1 || !pv2)
                return;
            var edge = new DjikstraEdge(pv1, pv2, len, way, dt);
            this.m_Edges[start + "->" + end] = edge;
            pv1.setEdgeOut(end, edge);
            pv2.setEdgeIn(start, edge);
        };
        /**删除边 */
        DjikstraGraph.prototype.DeleteEdge = function (start, end) {
            var pv1 = this.m_Vertexes[start], pv2 = this.m_Vertexes[end];
            if (!pv1 || !pv2)
                return;
            delete this.m_Edges[start + "->" + end];
            pv1.removeEdgeOut(end);
            pv2.removeEdgeIn(start);
        };
        DjikstraGraph.prototype.GetEdge = function (start, end) {
            var o = start > end, n = o ? start + "->" + end : end + "->" + start, edge = this.m_Edges[n];
            return [o, edge];
        };
        DjikstraGraph.prototype.GetEdgePoint = function (start, end, cb, target) {
            var o = start > end, n = o ? start + "->" + end : end + "->" + start, edge = this.m_Edges[n];
            if (!edge)
                return [];
            if (cb)
                cb.call(target, edge);
            return o ? edge.way : edge.way.reverse();
        };
        DjikstraGraph.prototype.GetEdgeTime = function (iids) {
            var _this = this;
            var dt = 0, i = 0, l = 0, way = [];
            iids.reduce(function (start, end, index, arr) {
                var o = start > end, _a = _this.GetEdge(start, end), _ = _a[0], edge = _a[1];
                if (edge) {
                    var reduceTimePercent = CityBuildModel.getCityPrivilegeValues(start, CityRewardType.MOVE);
                    dt += edge.dt * (1 - reduceTimePercent / 10000);
                    l += edge.way.length;
                    way = way.concat(o ? edge.way : edge.way.reverse());
                }
                return end;
            });
            var speed = l > 0 ? Math.floor(dt / (l - 3) * 1000) : 0;
            return [dt, speed, way];
        };
        DjikstraGraph.prototype.GetWayTime = function (start, end) {
            start = this.getMappCity(start);
            this.execute(start);
            var vert = this.walkVertexs(end);
            if (isNull(vert) || vert.length == 0) {
                return [0, 0, null];
            }
            var l = [];
            for (var _i = 0, vert_1 = vert; _i < vert_1.length; _i++) {
                var v = vert_1[_i];
                l.push(v.iid);
            }
            l.reverse();
            l.push(end);
            return this.GetEdgeTime(l);
        };
        DjikstraGraph.prototype.getMappCity = function (cityId) {
            var conf = C.WorldMapConfig[cityId];
            if (conf && conf.mapId != SceneManager.getCurrScene() && conf.mapCity != 0)
                cityId = conf.mapCity;
            return cityId;
        };
        /**
         * 路径树
         * 初始化顶点 相邻节点消耗
         * 当前顶点消耗为0
         *  */
        DjikstraGraph.prototype.execute = function (vetexid) {
            var _a;
            vetexid = this.getMappCity(vetexid);
            var vtex = this.GetVertex(vetexid), lis = [];
            if (isNull(vtex))
                return;
            for (var iid in this.Vertexes) {
                var v_1 = this.GetVertex(Number(iid));
                v_1.cost = 0x0FFFFFFF;
                v_1.parent = null;
                lis.push(v_1);
            }
            vtex.cost = 0;
            var v;
            while (lis.length > 0) {
                _a = this.extractMin(lis), v = _a[0], lis = _a[1];
                if (!v)
                    break;
                v.relax();
            }
        };
        DjikstraGraph.prototype.walkVertexs = function (iid) {
            var l = [], vtex = this.GetVertex(iid);
            if (!vtex)
                return l;
            var parent = vtex.parent;
            while (parent) {
                l.push(parent);
                parent = parent.parent;
            }
            return l;
        };
        DjikstraGraph.prototype.walkIds = function (iid) {
            var l = [], vtex = this.GetVertex(iid);
            if (!vtex)
                return l;
            l.push(iid);
            var parent = vtex.parent;
            while (parent) {
                l.push(parent.iid);
                parent = parent.parent;
            }
            //路径逆转 返回结果
            l.reverse();
            return l;
        };
        DjikstraGraph.prototype.extractMin = function (l) {
            if (l.length == 0)
                return [null, []];
            var vtex = l[0], i = 0, indx = 0;
            for (var _i = 0, l_1 = l; _i < l_1.length; _i++) {
                var o = l_1[_i];
                if (vtex.cost > o.cost) {
                    vtex = o;
                    indx = i;
                }
                i++;
            }
            l.splice(indx, 1);
            return [vtex, l];
        };
        DjikstraGraph.Instance = new DjikstraGraph();
        return DjikstraGraph;
    }());
    com_main.DjikstraGraph = DjikstraGraph;
})(com_main || (com_main = {}));

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
    var WayLayer = /** @class */ (function (_super_1) {
        __extends(WayLayer, _super_1);
        function WayLayer(w, h) {
            var _this = _super_1.call(this) || this;
            _this.m_aWay = [];
            _this.name = WayLayer.NAME;
            _this.width = w;
            _this.height = h;
            _this.addEventListener(egret.Event.ENTER_FRAME, _this.tickEvent, _this);
            return _this;
        }
        WayLayer.prototype.onDestroy = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.tickEvent, this);
            Utils.removeAllChild(this);
        };
        /**
         * 创建行走路线
         * @param  {ArmySprite} hero
         * @returns void
         */
        WayLayer.prototype.createWay = function (hero) {
            var spr = new WaySpite(hero.conf, hero.realTotalDt);
            Utils.addChild(this, spr);
        };
        /**
         * 更新行走路线
         */
        WayLayer.prototype.updateWay = function (movepoint, teamKey) {
            var way = this.getChildByName("way_" + teamKey);
            if (!way)
                return;
            way._update_way(movepoint);
        };
        WayLayer.prototype.getWay = function (id) {
            var way = this.getChildByName("way_" + id);
            if (!way)
                return;
            return way;
        };
        WayLayer.prototype.tickEvent = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                var obj = o, status_1 = obj.tickEvent();
            }
            return false;
        };
        WayLayer.prototype.createCityWay = function (point, ty) {
            var _this = this;
            if (ty === void 0) { ty = 0; }
            var i = 0;
            this.m_aWay = [];
            if (!point || point.length == 0)
                return this.m_aWay;
            point.reduce(function (prev, cur, index, arr) {
                i++;
                if (i % 2 == 0)
                    return cur; //隔两个点 执行一次 划线
                if (!prev)
                    return cur;
                var way = new CityWay(prev, cur, ty);
                _this.addChild(way);
                var x = prev[0], y = prev[1];
                way.x = x;
                way.y = y;
                _this.m_aWay.push(way.iid);
                return cur;
            });
            return this.m_aWay;
        };
        WayLayer.prototype.removeCityWay = function (iid) {
            var way = this.getChildByName("city_way_" + iid);
            if (!way)
                return;
            Utils.removeFromParent(way);
        };
        WayLayer.NAME = "WayLayer";
        return WayLayer;
    }(egret.DisplayObjectContainer));
    com_main.WayLayer = WayLayer;
    /**
     * 直线线路
     * @export
     * @class WaySpite
     * @extends CComponent
     */
    var WaySpite = /** @class */ (function (_super_1) {
        __extends(WaySpite, _super_1);
        function WaySpite(conf, dt, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            var _this = _super_1.call(this) || this;
            /**人物位置偏移x */
            _this.m_nOffsetX = 90;
            /**人物位置偏移y */
            _this.m_nOffsetY = 0;
            /**移动开始坐标 */
            _this.m_pStartPoint = null;
            /**移动结束坐标 */
            _this.m_pEndPoint = null;
            /**透明路径线 */
            _this.m_pWayBg = null;
            /**主路径线 */
            _this.m_pWayMain = null;
            /**路径偏移 */
            _this.m_nBoffset = 0;
            /**移动时间 */
            _this.m_nMoveDt = 0;
            /**移动速度 */
            _this.m_nMoveSpeed = 3;
            /**移动倍数 */
            _this.m_nOdd = 1;
            _this.m_nDt = 0;
            _this.teamKey = conf.teamKey;
            var data = WorldModel.getTeamMoveData(_this.m_nTeamKey);
            var startPoint = com_main.DjikstraGraph.Instance.GetVertex(data.cityPath[0]).cityPos;
            var endPoint = com_main.DjikstraGraph.Instance.GetVertex(data.cityPath[data.cityPath.length - 1]).cityPos;
            var endPCopy = endPoint.slice(0, endPoint.length);
            _this.m_pStartPoint = new egret.Point(endPCopy[0], endPCopy[1]);
            _this.m_pEndPoint = new egret.Point(endPCopy[0], endPCopy[1]);
            _this.m_nBoffset = conf.boffset;
            _this.m_nMoveSpeed = conf.speed;
            _this.m_nOdd = conf.odd;
            _this.x = _this.m_pStartPoint.x;
            _this.y = _this.m_pStartPoint.y;
            _this.m_nDt = dt;
            return _this;
        }
        Object.defineProperty(WaySpite.prototype, "teamKey", {
            get: function () {
                return this.m_nTeamKey;
            },
            set: function (id) {
                this.m_nTeamKey = id;
                this.name = "way_" + id;
            },
            enumerable: true,
            configurable: true
        });
        WaySpite.prototype.onDestroy = function () {
        };
        WaySpite.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pWayMain = this._create_way();
        };
        /**
         * 帧事件
         * @returns Promise
         */
        WaySpite.prototype.tickEvent = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // if (TimerUtils.getServerTimeMill() - this.m_nMoveDt < this.m_nMoveSpeed) return false;
                    // this.m_nMoveDt = this.m_nMoveDt + this.m_nMoveSpeed;
                    // this.m_pWayMain.height -= this.m_nOdd;
                    // if (this.m_pWayMain.height <= this.m_nOdd) {
                    //     WorldView.callFunc(WORLD_FUNC.END_HERO_MOVE, this.m_nTeamKey);
                    //     Utils.removeFromParent(this);
                    //     return true;
                    // }
                    return [2 /*return*/, false];
                });
            });
        };
        /**
         * 创建路线
         * @returns egret.Bitmap
         */
        WaySpite.prototype._create_way = function () {
            var spr = new egret.Bitmap(RES.getRes("ImgArrow_1_png"));
            spr.name = "line";
            this.addChild(spr);
            spr.height = egret.Point.distance(this.m_pStartPoint, this.m_pEndPoint);
            spr.anchorOffsetX = 0;
            spr.anchorOffsetY = spr.height;
            spr.fillMode = egret.BitmapFillMode.REPEAT;
            spr.visible = false;
            // let angle = Math.atan2(this.m_pEndPoint.y - this.m_pStartPoint.y, this.m_pEndPoint.x - this.m_pStartPoint.x) * 180 / Math.PI;
            // spr.rotation = angle + 90;
            return spr;
        };
        /**更新线路 */
        WaySpite.prototype._update_way = function (movepoint) {
            var spr = this.getChildByName("line");
            if (!spr) {
                return;
            }
            spr.visible = true;
            this.x = movepoint.x;
            this.y = movepoint.y;
            spr.height = egret.Point.distance(movepoint, this.m_pEndPoint);
            spr.anchorOffsetX = 0;
            spr.anchorOffsetY = spr.height;
            spr.fillMode = egret.BitmapFillMode.REPEAT;
            var angle = Math.atan2(this.m_pEndPoint.y - movepoint.y, this.m_pEndPoint.x - movepoint.x) * 180 / Math.PI;
            spr.rotation = angle + 90;
            return spr;
        };
        return WaySpite;
    }(com_main.CComponent));
    com_main.WaySpite = WaySpite;
    /**
     * 城池间线路
     * @export
     * @class CityWay
     * @extends egret.Sprite
     */
    var CityWay = /** @class */ (function (_super_1) {
        __extends(CityWay, _super_1);
        function CityWay(start, end, type) {
            if (type === void 0) { type = 0; }
            var _this = _super_1.call(this) || this;
            _this.name = "city_way_" + _this.hashCode;
            // const color = type == 0 ? 0xe7d7a7 : 0xff2727;
            _this.m_pStartPoint = egret.Point.create(start[0], start[1]);
            _this.m_pEndPoint = egret.Point.create(end[0], end[1]);
            _this.m_imgLine = new eui.Image('pro_020_png');
            _this.m_imgLine.width = com_main.Point.distance(_this.m_pStartPoint, _this.m_pEndPoint);
            AnchorUtil.setAnchorCenter(_this.m_imgLine);
            _this.addChild(_this.m_imgLine);
            // this.graphics.beginFill(color, 1);
            // this.graphics.drawRect(0, 0, 7, egret.Point.distance(this.m_pStartPoint, this.m_pEndPoint));
            // this.graphics.endFill();
            var angle = Math.atan2(_this.m_pEndPoint.y - _this.m_pStartPoint.y, _this.m_pEndPoint.x - _this.m_pStartPoint.x) * 180 / Math.PI;
            _this.rotation = angle;
            _this.anchorOffsetX = _this.width / 2;
            _this.anchorOffsetY = _this.height / 2;
            return _this;
        }
        Object.defineProperty(CityWay.prototype, "iid", {
            get: function () {
                return this.hashCode;
            },
            enumerable: true,
            configurable: true
        });
        CityWay.prototype.tickEvent = function () {
        };
        return CityWay;
    }(egret.Sprite));
    com_main.CityWay = CityWay;
})(com_main || (com_main = {}));

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
var WorldData = /** @class */ (function () {
    function WorldData() {
    }
    WorldData.getCityHeroPos = function (ty) {
        return this.m_mCityHeroPos[ty];
    };
    WorldData.m_mCityHeroPos = {
        2: [[75, 12, 50], [219, 12, 200]],
        3: [[99, 12, 50], [195, 12, 200], [147, -96, 200]],
        4: [[147, 12, 200], [50, 12, 50], [99, -96, 200], [195, -96, 250]],
        5: [[147, 12, 200], [50, 12, 50], [244, 12, 250], [99, -96, 200], [195, -96, 250]]
    };
    return WorldData;
}());
var WorldCoverData = /** @class */ (function () {
    function WorldCoverData() {
    }
    WorldCoverData.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, conf, points;
            return __generator(this, function (_a) {
                if (this.m_mRangePoint)
                    return [2 /*return*/];
                this.m_mRangePoint = {};
                this.m_mSRangePoint = {};
                for (i in C.WorldMapConfig) {
                    conf = C.WorldMapConfig[i];
                    try {
                        points = JSON.parse(conf.VisibleXY);
                        this.m_mRangePoint[conf.id] = points;
                        this.m_mSRangePoint[conf.id] = points.map(function (e) { return e.toString(); });
                    }
                    catch (e) {
                        error("=====WorldCoverData:init===", e, i, conf.VisibleXY);
                    }
                }
                return [2 /*return*/, true];
            });
        });
    };
    WorldCoverData.ArrayRemove = function (arr, n) {
        var indx = arr.indexOf(n);
        if (indx === -1)
            return arr;
        arr.splice(indx, 1);
    };
    WorldCoverData.getRange = function (city) {
        var _a, _b;
        var _this = this;
        if (!this.m_mSRangePoint)
            this.init();
        var ncity = city.slice();
        var fn = function (points, spoints) {
            var rm_c = [], c, sc;
            if (!points) {
                c = ncity[0];
                sc = _this.m_mSRangePoint[c];
                _this.ArrayRemove(ncity, c);
            }
            for (var i = 0; i < ncity.length; i++) {
                var c1 = ncity[i], sc1 = _this.m_mSRangePoint[c1];
                if (spoints && _this.checkRepeatArray([].concat(spoints, sc1), 2)) {
                    points = _this.concatRange(points, c1)[0];
                    spoints = points.map(function (e) { return e.toString(); });
                    rm_c.push(c1);
                }
                else if (c && _this.checkRepeatArray([].concat(sc, sc1), 2)) {
                    points = _this.concatRange(c, c1)[0];
                    spoints = points.map(function (e) { return e.toString(); });
                    rm_c.push(c1);
                }
            }
            if (rm_c.length > 0) {
                for (var _i = 0, rm_c_1 = rm_c; _i < rm_c_1.length; _i++) {
                    var i = rm_c_1[_i];
                    _this.ArrayRemove(ncity, i);
                }
                return [points, spoints, ncity.length > 0];
            }
            else if (points) {
                return [points, spoints, false];
            }
            return [_this.m_mRangePoint[c], sc, false];
        };
        var points, spoints, ret, allpoints = [];
        do {
            _a = fn(points, spoints), points = _a[0], spoints = _a[1], ret = _a[2];
            if (!ret) {
                allpoints.push(points);
                points = null;
                spoints = null;
            }
            while (ret) {
                _b = fn(points, spoints), points = _b[0], spoints = _b[1], ret = _b[2];
                if (!ret) {
                    allpoints.push(points);
                    points = null;
                    spoints = null;
                }
            }
        } while (ncity.length > 0);
        return allpoints;
    };
    WorldCoverData.checkRepeatArray = function (arr, n) {
        if (n === void 0) { n = 1; }
        var tmp = [], ret = false;
        arr.forEach(function (item) {
            if (arr.indexOf(item) !== arr.lastIndexOf(item) && tmp.indexOf(item) === -1) {
                tmp.push(item);
                if (tmp.length == n) {
                    ret = true;
                    return true;
                }
            }
        });
        return ret;
    };
    WorldCoverData.getRepeatArray = function (arr) {
        var tmp = [];
        arr.forEach(function (item) {
            (arr.indexOf(item) !== arr.lastIndexOf(item) && tmp.indexOf(item) === -1) && tmp.push(item);
        });
        return tmp;
    };
    WorldCoverData.compare = function (x, y) {
        if (x < y) {
            return -1;
        }
        else if (x > y) {
            return 1;
        }
        else {
            return 0;
        }
    };
    WorldCoverData.checkSamePoint = function (arr) {
        var i = 0, indx = -1;
        while (i++ < arr.length) {
            if (arr[i - 1] + 1 != arr[i]) {
                indx = i;
                break;
            }
        }
        var na = arr;
        if (indx >= 0) {
            na = arr.splice(indx, arr.length - indx);
            na = na.concat.apply(na, arr);
        }
        var n = na.splice(1, na.length - 2);
        return [n, na.sort(this.compare)];
    };
    WorldCoverData.concatRange = function (na, nb) {
        var sa, a;
        var sb, b;
        if (typeof na == "number") {
            var a1 = na;
            a = [].concat(this.m_mRangePoint[a1]);
            sa = [].concat(this.m_mSRangePoint[a1]);
        }
        else {
            a = na;
            sa = a.map(function (e) { return e.toString(); });
        }
        if (typeof nb == "number") {
            var b1 = nb;
            b = [].concat(this.m_mRangePoint[b1]);
            sb = [].concat(this.m_mSRangePoint[b1]);
        }
        else {
            b = nb;
            sb = b.map(function (e) { return e.toString(); });
        }
        var t2 = this.getRepeatArray([].concat(sa, sb));
        if (t2.length >= 2) {
            var arr_indx = [], temp = {};
            for (var _i = 0, t2_1 = t2; _i < t2_1.length; _i++) {
                var t = t2_1[_i];
                var indx = sa.indexOf(t);
                arr_indx.push(indx);
                temp[indx] = t;
            }
            arr_indx.sort(this.compare);
            var _a = this.checkSamePoint(arr_indx), del_arr = _a[0], n_arr = _a[1];
            for (var _b = 0, del_arr_1 = del_arr; _b < del_arr_1.length; _b++) {
                var de = del_arr_1[_b];
                var o = temp[de];
                var indx1 = sa.indexOf(o), indx2 = sb.indexOf(o);
                sa.splice(indx1, 1);
                a.splice(indx1, 1);
                sb.splice(indx2, 1);
                b.splice(indx2, 1);
            }
            var o1 = temp[n_arr[0]], o2 = temp[n_arr[1]], i1 = sa.indexOf(o1), i2 = sa.indexOf(o2), i3 = sb.indexOf(o1), i4 = sb.indexOf(o2), l1 = [], l2 = [], l3 = [], l4 = [], l5 = [], l6 = [];
            if ((i1 == 0 && i2 == sa.length - 1) || (i1 == sa.length - 1 && i2 == 0))
                l1 = [].concat(a);
            else {
                if (i2 > i1)
                    l1 = [].concat(a.slice(i2, a.length), a.slice(0, i1 + 1));
                else
                    l1 = [].concat(a.slice(i1, a.length), a.slice(0, i2 + 1));
            }
            if ((i3 == 0 && i4 == sb.length - 1) || (i3 == sb.length - 1 && i4 == 0))
                l2 = [].concat(b);
            else {
                if (i4 > i3)
                    l2 = [].concat(b.slice(i4, b.length), b.slice(0, i3 + 1));
                else
                    l2 = [].concat(b.slice(i3, b.length), b.slice(0, i4 + 1));
            }
            l1.pop();
            l2.pop();
            var all = [].concat(l1, l2);
            return [all];
        }
        return [a, b];
    };
    WorldCoverData.ArrayToString = function (arr) {
        return arr.map(function (e) { return e.toString(); });
    };
    WorldCoverData.m_mSRangePoint = null;
    WorldCoverData.m_mRangePoint = null;
    return WorldCoverData;
}());
var WorldTmxData = /** @class */ (function () {
    function WorldTmxData() {
    }
    WorldTmxData.getPointByGid = function (gid) {
        var x = Math.floor(gid / 188);
        var y = gid % 188;
        return [x * 32, y * 32];
    };
    // public static getPosByPoint(point) {
    //     const [x, y] = point;
    //     return [x*32, y*32];
    // }
    WorldTmxData.getGidByPoint = function (px, py) {
        var x = Math.floor(px / 32), y = Math.floor(py / 32);
        return x * 188 + y;
    };
    WorldTmxData.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, data_1, o;
            return __generator(this, function (_a) {
                if (this.m_mRange)
                    return [2 /*return*/];
                data = RES.getRes("world_json");
                if (!data)
                    return [2 /*return*/];
                this.m_mRange = {};
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    o = data_1[_i];
                    this.m_mRange[o['name']] = o['gid'];
                }
                return [2 /*return*/];
            });
        });
    };
    WorldTmxData.getRange = function (id) {
        var l = this.m_mRange[id];
        return l || [];
    };
    WorldTmxData.m_mRange = null;
    return WorldTmxData;
}());

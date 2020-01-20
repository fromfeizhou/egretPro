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
    var SoldierAmin = /** @class */ (function (_super_1) {
        __extends(SoldierAmin, _super_1);
        function SoldierAmin(ty) {
            var _this = _super_1.call(this) || this;
            /**人物形象id */
            _this.m_nType = 1000;
            /**人物形象方向 */
            _this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
            _this.m_nBaseDirection = CSquare_Direction.RIGHT_DOWN;
            /**人物形象动作 */
            _this.m_nAction = 'w';
            /**人物动作id */
            _this.m_nIndx = 0;
            /**人物动作时间 */
            _this.m_nDt = 0;
            /**人物动作播放速度 */
            _this.m_nSpeed = 150;
            /**人物texture列表 */
            _this.m_pTextureSheet = {};
            /**人物主体 */
            _this.m_pSoldier = null;
            /**人物位置偏移x */
            _this.m_nOffsetX = 0;
            /**人物位置偏移y */
            _this.m_nOffsetY = 0;
            _this.m_bInit = false;
            _this.name = "SoldierAmin";
            // this.width = 50;
            // this.height = 80;
            _this.m_nType = ty || _this.m_nType;
            _this.m_bInit = true;
            _this.initTexture();
            return _this;
        }
        Object.defineProperty(SoldierAmin.prototype, "offsetX", {
            get: function () {
                return this.m_nOffsetX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoldierAmin.prototype, "offsetY", {
            get: function () {
                return this.m_nOffsetY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoldierAmin.prototype, "direction", {
            get: function () {
                return this.m_nBaseDirection;
            },
            enumerable: true,
            configurable: true
        });
        SoldierAmin.prototype.onDestroy = function () {
            this.m_pTextureSheet = null;
            this.m_bInit = false;
            egret.Tween.removeTweens(this);
        };
        SoldierAmin.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initSoldier();
        };
        SoldierAmin.prototype.initTexture = function () {
            var _this = this;
            var path = "soldier_" + this.m_nType + "_json";
            RES.getResAsync(path, function (sheets) {
                if (!_this.m_bInit)
                    return;
                var texture = sheets._textureMap;
                _this.m_pTextureSheet = {};
                for (var name_1 in texture) {
                    _this.m_pTextureSheet[name_1] = texture[name_1];
                }
                _this.initSoldier();
            }, this);
        };
        SoldierAmin.prototype.__reset_size = function () {
            var w = this.m_pSoldier.width, h = this.m_pSoldier.height;
            this.m_pSoldier.anchorOffsetX = w / 2;
            this.m_pSoldier.anchorOffsetY = h / 2;
            this.m_pSoldier.x = w / 2;
            this.m_pSoldier.y = h / 2;
            this.width = w;
            this.height = h;
            this.anchorOffsetX = w / 2;
            this.anchorOffsetY = h / 2;
        };
        SoldierAmin.prototype.initSoldier = function () {
            var animRes = this.getTexture();
            if (this.m_pSoldier) {
                this.m_pSoldier.texture = animRes[this.getActionName() + "_0"];
                this.startAction();
                this.__reset_size();
                return;
            }
            var w = 0, h = 0;
            if (!animRes) {
                this.m_pSoldier = Utils.DisplayUtils.createBitmap();
                this.addChild(this.m_pSoldier);
            }
            else {
                var animTexture = animRes[this.getActionName() + "_0"];
                this.m_pSoldier = Utils.DisplayUtils.createBitmap(animTexture);
                this.addChild(this.m_pSoldier);
                this.startAction();
                this.__reset_size();
            }
        };
        SoldierAmin.prototype.getTexture = function () {
            if (!this.m_pTextureSheet)
                this.m_pTextureSheet = {};
            return this.m_pTextureSheet;
        };
        SoldierAmin.prototype.getActionName = function (d, a) {
            return this.m_nType + "_" + (d || this.m_nDirection) + "_" + (a || this.m_nAction);
        };
        SoldierAmin.prototype.startAction = function () {
            this.m_nDt = TimerUtils.getServerTimeMill();
        };
        SoldierAmin.prototype.onAnimEvent = function () {
            if (!this.m_pSoldier || !this.m_pTextureSheet || TimerUtils.getServerTimeMill() - this.m_nDt < this.m_nSpeed)
                return;
            this.m_nDt = TimerUtils.getServerTimeMill();
            this.m_nIndx++;
            if (this.m_nIndx > 4)
                this.m_nIndx = 0;
            var animRes = this.getTexture(), animTexture = animRes[this.getActionName() + "_" + this.m_nIndx];
            this.m_pSoldier.texture = animTexture;
        };
        SoldierAmin.prototype.flipByDirection = function (direction) {
        };
        SoldierAmin.prototype.setDirection = function (direct) {
            return __awaiter(this, void 0, void 0, function () {
                var odd;
                return __generator(this, function (_a) {
                    if (this.m_nBaseDirection == direct)
                        return [2 /*return*/];
                    this.m_nBaseDirection = direct;
                    odd = 1;
                    this.rotation = 0;
                    if (direct == CSquare_Direction.LEFT_DOWN) {
                        this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
                        odd = -1;
                    }
                    else if (direct == CSquare_Direction.LEFT) {
                        if (this.m_nType == 1009) {
                            this.m_nDirection = CSquare_Direction.LEFT;
                            odd = -1;
                        }
                        else {
                            this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
                            odd = -1;
                        }
                    }
                    else if (direct == CSquare_Direction.LEFT_UP) {
                        this.m_nDirection = CSquare_Direction.RIGHT_UP;
                        odd = -1;
                    }
                    else if (direct == CSquare_Direction.RIGHT) {
                        if (this.m_nType == 1009) {
                            this.m_nDirection = CSquare_Direction.LEFT;
                        }
                        else
                            this.m_nDirection = CSquare_Direction.RIGHT_DOWN;
                    }
                    else {
                        this.m_nDirection = direct;
                    }
                    if (this.m_pSoldier.scaleX != odd) {
                        // this.x = 140-this.x;
                        this.m_pSoldier.scaleX = odd;
                    }
                    return [2 /*return*/];
                });
            });
        };
        SoldierAmin.prototype.updateOffset = function (x, y) {
            this.m_nOffsetX = x;
            this.m_nOffsetY = y;
        };
        SoldierAmin.prototype.onMoveEvent = function (x, y, dt) {
            var px = x - this.m_nOffsetX, py = y - this.m_nOffsetY;
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ x: x, y: y }, dt);
        };
        SoldierAmin.prototype.setActionStatus = function (stat) {
            this.m_nAction = stat;
        };
        return SoldierAmin;
    }(com_main.CComponent));
    com_main.SoldierAmin = SoldierAmin;
    var SoldierSprite = /** @class */ (function (_super_1) {
        __extends(SoldierSprite, _super_1);
        function SoldierSprite(x, y, offsetX, offsetY) {
            var _this = _super_1.call(this) || this;
            /**人物位置偏移x */
            _this.m_nOffsetX = 0;
            /**人物位置偏移y */
            _this.m_nOffsetY = 0;
            SoldierSprite.m_nId++;
            _this.m_nIid = SoldierSprite.m_nId;
            _this.name = "soldier_" + _this.m_nIid;
            var spr = new SoldierAmin();
            spr.x = spr.width / 2;
            spr.y = spr.height / 2;
            spr.scaleX = .7;
            spr.scaleY = .7;
            Utils.addChild(_this, spr);
            _this.width = spr.width;
            _this.height = spr.height;
            _this.anchorOffsetX = spr.width / 2;
            _this.anchorOffsetY = spr.height / 2;
            _this.m_nOffsetX = offsetX;
            _this.m_nOffsetY = offsetY;
            _this.x = x + offsetX;
            _this.y = y + offsetY;
            return _this;
        }
        Object.defineProperty(SoldierSprite.prototype, "iid", {
            get: function () {
                return this.m_nIid;
            },
            enumerable: true,
            configurable: true
        });
        SoldierSprite.prototype.tickEvent = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._on_anim_event();
                    return [2 /*return*/, false];
                });
            });
        };
        /**
         * 动画事件
         * @returns void
         */
        SoldierSprite.prototype._on_anim_event = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                if (o.name != 'SoldierAmin')
                    continue;
                var army = o;
                army.onAnimEvent();
            }
        };
        SoldierSprite.prototype.setSoilderAngle = function (angle) {
            var _a = ArmySprite.getDirectionAngle(angle), direct = _a[0], rotation = _a[1];
            for (var _i = 0, _b = this.$children; _i < _b.length; _i++) {
                var o = _b[_i];
                if (o.name != 'SoldierAmin')
                    continue;
                var army = o;
                army.setDirection(direct);
            }
        };
        SoldierSprite.prototype.onMoveEvent = function (ax, ay, dt, angle) {
            this.setSoilderAngle(angle);
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ x: ax + this.m_nOffsetX, y: ay + this.m_nOffsetY }, dt);
        };
        SoldierSprite.prototype.resetPoint = function (x, y, offsetX, offsetY) {
            egret.Tween.removeTweens(this);
            this.m_nOffsetX = offsetX;
            this.m_nOffsetY = offsetY;
            this.x = x + offsetX;
            this.y = y + offsetY;
        };
        SoldierSprite.m_nId = 0;
        return SoldierSprite;
    }(egret.DisplayObjectContainer));
    com_main.SoldierSprite = SoldierSprite;
    /**
     * 士兵动画
     */
    var ArmySprite = /** @class */ (function (_super_1) {
        __extends(ArmySprite, _super_1);
        function ArmySprite(offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            var _this = _super_1.call(this) || this;
            _this.m_nArmyId = 0;
            /**人物位置偏移x */
            _this.m_nOffsetX = 0;
            /**人物位置偏移y */
            _this.m_nOffsetY = 0;
            /**移动时间 */
            _this.m_nMoveDt = 0;
            /**移动速度(ms) */
            _this.m_nMoveSpeed = 0;
            /**是否正在移动 */
            _this.m_bMove = false;
            /**移动城池路线 */
            _this.m_aCityVert = [];
            /**移动坐标列表 */
            _this.m_aMovePoint = [];
            /**移动开始坐标 */
            _this.m_pStartPoint = null;
            /**移动结束坐标 */
            _this.m_pEndPoint = null;
            /**移动路线类型 */
            _this.m_nPathType = 1;
            /**移动偏移 */
            _this.m_nAoffset = 1;
            /**路径偏移 */
            _this.m_nBoffset = 0;
            /**x方向 */
            _this.m_nDirX = 1;
            /**y方向 */
            _this.m_nDirY = 1;
            /**移动倍数 */
            _this.m_nOdd = 1;
            /**上一个位置点 */
            _this.m_nLastPoint = [];
            /**总时间(正常速度) */
            _this.m_nTotalDt = 10;
            /**实际总时间 */
            _this.m_nAllDt = 0;
            /**X移动偏量 */
            _this.m_nMoveX = 0;
            /**Y移动偏量 */
            _this.m_nMoveY = 0;
            /**开始时间 */
            _this.m_nStartDt = 0;
            /**结束时间 */
            _this.m_nEndDt = 0;
            /**返回状态 */
            _this.m_bBack = false;
            _this.m_aChildren = [];
            _this.m_aCityWay = [];
            _this.name = "hero_";
            _this.width = 140;
            _this.height = 90;
            _this.anchorOffsetX = 70;
            _this.anchorOffsetY = 45;
            _this.m_nOffsetX = offsetX;
            _this.m_nOffsetY = offsetY;
            return _this;
        }
        Object.defineProperty(ArmySprite.prototype, "teamKey", {
            get: function () {
                return this.m_teamKey;
            },
            set: function (id) {
                this.m_teamKey = id;
                this.name = "hero_" + this.m_teamKey;
                this.__create_time();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "totalDt", {
            get: function () {
                return this.m_nTotalDt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "allDt", {
            get: function () {
                return this.m_nAllDt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "realTotalDt", {
            get: function () {
                return this.m_nEndDt == 0 ? this.m_nTotalDt : (this.m_nEndDt - TimerUtils.getServerTime() > 0 ? this.m_nEndDt - TimerUtils.getServerTime() : 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "canRemoveDt", {
            /**可移除时间 添加1秒 */
            get: function () {
                /**客户端移动 不等待 */
                if (this.m_nPathType == 2) {
                    return (this.m_nEndDt - TimerUtils.getServerTime()) <= 0;
                }
                return ((this.m_nEndDt + 0.2) - TimerUtils.getServerTime() <= 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "realDtStr", {
            get: function () {
                return Utils.DateUtils.getFormatBySecond(this.realTotalDt, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "soldierChildren", {
            get: function () {
                return this.m_aChildren;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmySprite.prototype, "direction", {
            get: function () {
                return this.m_pMain.direction;
            },
            enumerable: true,
            configurable: true
        });
        ArmySprite.getAngle = function (x1, x2, y1, y2) {
            var _a, _b;
            if (x1 instanceof egret.Point && x2 instanceof egret.Point) {
                y1 = x1.y;
                x1 = x1.x;
                y2 = x2.y;
                x2 = x2.x;
            }
            else if (x1 instanceof Array && x2 instanceof Array) {
                _a = x1.slice(), x1 = _a[0], y1 = _a[1];
                _b = x2.slice(), x2 = _b[0], y2 = _b[1];
            }
            var angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
            return angle + 90;
        };
        ArmySprite.getDirectionAngle = function (angle) {
            var direction = CSquare_Direction.UP, rotation = 0;
            if ((337.5 < angle && angle < 360) || (angle < 22.5 && angle >= -22.5)) {
                direction = CSquare_Direction.UP;
                rotation = -90;
            }
            else if (22.5 <= angle && angle < 67.5) {
                direction = CSquare_Direction.RIGHT_UP;
                rotation = -45;
            }
            else if (67.5 <= angle && angle < 112.5) {
                direction = CSquare_Direction.RIGHT;
            }
            else if (112.5 <= angle && angle < 157.5) {
                direction = CSquare_Direction.RIGHT_DOWN;
                rotation = 45;
            }
            else if (157.5 <= angle && angle < 202.5) {
                direction = CSquare_Direction.DOWN;
                rotation = 90;
            }
            else if ((202.5 <= angle && angle < 247.5) || (angle < -112.5 && angle >= -157.5)) {
                direction = CSquare_Direction.LEFT_DOWN;
                rotation = 135;
            }
            else if ((247.5 <= angle && angle < 292.5) || (angle < -67.5 && angle >= -112.5)) {
                direction = CSquare_Direction.LEFT;
                rotation = 180;
            }
            else if ((292.5 <= angle && angle < 337.5) || (angle < -22.5 && angle >= -67.5)) {
                direction = CSquare_Direction.LEFT_UP;
                rotation = -135;
            }
            return [direction, rotation];
        };
        Object.defineProperty(ArmySprite.prototype, "conf", {
            get: function () {
                return {
                    teamKey: this.m_teamKey,
                    startPoint: this.m_pStartPoint,
                    endPoint: this.m_pEndPoint,
                    aoffset: this.m_nAoffset,
                    boffset: this.m_nBoffset,
                    dirX: this.m_nDirX,
                    dirY: this.m_nDirY,
                    odd: this.m_nOdd,
                    speed: this.m_nMoveSpeed,
                };
            },
            enumerable: true,
            configurable: true
        });
        ArmySprite.prototype.onDestroy = function () {
            this.m_aMovePoint = [];
            this.m_aCityVert = [];
            this.m_aChildren = [];
            this.m_pStartPoint = null;
            this.m_pEndPoint = null;
            this.m_clientMoveEt = null;
            var menu = this.getChildByName('WorldMenuArmy');
            if (menu)
                menu.removeFromParent();
            egret.Tween.removeTweens(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ArmySprite.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        ArmySprite.prototype._local_to_main = function (x, y) {
            var p = this.parent.localToGlobal(x, y), pos = this.m_pMain.globalToLocal(p.x, p.y);
            return [pos.x, pos.y];
        };
        ArmySprite.prototype.__get_children_point = function (direction) {
            direction = direction != undefined ? direction : this.direction;
            if (direction == CSquare_Direction.RIGHT) {
                return [[-85, -50], [-115, -30], [-85, -20], [-55, -30], [-115, 0], [-85, 10], [-55, -0]];
            }
            else if (direction == CSquare_Direction.RIGHT_DOWN) {
                return [[-75, -60], [-105, -40], [-75, -30], [-45, -40], [-105, -10], [-75, 0], [-45, -10]];
            }
            else if (direction == CSquare_Direction.RIGHT_UP) {
                return [[-80, 10], [-40, 10], [-100, 40], [-60, 40], [-20, 40], [-80, 70], [-40, 70]];
            }
            else if (direction == CSquare_Direction.UP) {
                return [[-50, 30], [-10, 30], [-70, 60], [-30, 60], [10, 60], [-50, 90], [-10, 90]];
            }
            else if (direction == CSquare_Direction.DOWN) {
                return [[-10, -110], [20, -110], [-30, -80], [10, -80], [50, -80], [-10, -50], [20, -50]];
            }
            else if (direction == CSquare_Direction.LEFT_DOWN) {
                return [[35, -90], [75, -90], [15, -60], [55, -60], [95, -60], [35, -30], [75, -30]];
            }
            else if (direction == CSquare_Direction.LEFT) {
                return [[60, -20], [100, -20], [40, 10], [80, 10], [120, 10], [60, 40], [100, 40]];
            }
            return [[40, -10], [80, -10], [20, 20], [60, 20], [100, 20], [40, 50], [80, 50]];
        };
        // private __create_smoke_effect(x: number, y: number) {
        //     this.m_pEffectSmoke = new egret.Bitmap();
        //     this.m_pEffectSmoke.width = 171;
        //     this.m_pEffectSmoke.height = 174;
        //     EffectData.addEffect(EffectData.WORLD, IETypes.EWorld_Smoke, this.m_pEffectSmoke);
        //     this.addChildAt(this.m_pEffectSmoke, 0)
        //     this.m_pEffectSmoke.anchorOffsetX = this.m_pEffectSmoke.width / 2;
        //     this.m_pEffectSmoke.anchorOffsetY = this.m_pEffectSmoke.height / 2;
        //     this.m_pEffectSmoke.x = this.width / 2 + x + 10;
        //     this.m_pEffectSmoke.y = this.height / 2 + y - 10;
        // }
        ArmySprite.prototype.__create_time = function () {
            this.m_pLbTime = new WorldSoilderTime(this.m_teamKey);
            this.addChild(this.m_pLbTime);
            this.m_pLbTime.x = 0;
            this.m_pLbTime.y = -75;
        };
        ArmySprite.prototype.initSoldier = function (direct) {
            // if (this.m_nPathType != 1) {
            //     let pos = this.__get_children_point(direct);
            //     for (let [x, y] of pos) {
            //         let spr = new SoldierAmin();
            //         spr.x = x + this.width / 2;
            //         spr.y = y + this.height / 2;
            //         spr.scaleX = .7;
            //         spr.scaleY = .7;
            //         Utils.addChild(this, spr);
            //         spr.setDirection(direct);
            //     }
            // }
            this.m_pMain = new SoldierAmin(1009);
            this.m_pMain.x = this.width / 2;
            this.m_pMain.y = this.height / 2;
            this.m_pMain.scaleX = .9;
            this.m_pMain.scaleY = .9;
            Utils.addChild(this, this.m_pMain);
            if (direct != undefined)
                this.m_pMain.setDirection(direct);
        };
        ArmySprite.prototype.tickEvent = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    Promise.all([
                        this.m_pLbTime.tickEvent(this.realDtStr),
                        this._on_anim_event(),
                        this._on_move_event()
                    ]);
                    return [2 /*return*/, false];
                });
            });
        };
        /**
         * 动画事件
         * @returns void
         */
        ArmySprite.prototype._on_anim_event = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                if (o.name != 'SoldierAmin')
                    continue;
                var army = o;
                army.onAnimEvent();
            }
        };
        ArmySprite.prototype._set_anim_action = function (stat) {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                if (o.name != 'SoldierAmin')
                    continue;
                var army = o;
                army.setActionStatus(stat);
            }
        };
        ArmySprite.prototype.setSoilderAngle = function (angle) {
            var _a = ArmySprite.getDirectionAngle(angle), direct = _a[0], rotation = _a[1];
            this.__set_soilder_direct(direct);
        };
        ArmySprite.prototype.__set_soilder_direct = function (direct) {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                if (o.name != 'SoldierAmin')
                    continue;
                var army = o;
                army.setDirection(direct);
            }
        };
        ArmySprite.prototype.__reset_amry_point = function () {
            var _this = this;
            var i = 0, direct = this.getChildrenPoint();
            this.parent.getAmryChildren(this.m_aChildren, function (o) {
                var _a = direct[i], x = _a[0], y = _a[1];
                o.resetPoint(_this.x, _this.y, x, y);
                i++;
            }, this);
        };
        /**
         * 检查是否可以移除
         * @returns boolean
         */
        ArmySprite.prototype.__check_remove = function () {
            if (this.canRemoveDt) {
                com_main.WorldView.callFunc(0 /* END_HERO_MOVE */, this.m_teamKey);
                return true;
            }
            return false;
        };
        /**
         * 移动事件
         * @returns void
         */
        ArmySprite.prototype._on_move_event = function () {
            var _this = this;
            if (this.__check_remove())
                return;
            if (!this.m_bMove) {
                return;
            }
            if (TimerUtils.getServerTimeMill() - this.m_nMoveDt <= this.m_nMoveSpeed)
                return;
            this.m_nMoveDt = this.m_nMoveDt + this.m_nMoveSpeed;
            if (this.m_nPathType == 2) { //直线移动
                var x_1 = this.x + this.m_nMoveX * this.m_nDirX, y_1 = this.y + this.m_nMoveY * this.m_nDirY;
                this.x = x_1;
                this.y = y_1;
                return;
            }
            //点移动
            if (!this.m_aMovePoint || this.m_aMovePoint.length == 0)
                return;
            //清除线路
            var indx = this.m_aMovePoint.length;
            if (indx >= 0 && this.m_aCityWay.length > 0) {
                com_main.WorldView.callFunc(11 /* REMOVE_CITY_WAY */, this.m_aCityWay[Math.floor(indx / 2)]);
            }
            var point = this.m_aMovePoint.pop(), x = point[0], y = point[1], angle = ArmySprite.getAngle(point, this.m_nLastPoint);
            this.setSoilderAngle(angle);
            this.__reset_amry_point();
            this.m_nLastPoint = point;
            egret.Tween.removeTweens(this);
            var ax = this.m_nOffsetX * this.m_nDirX + x, ay = this.m_nOffsetY * this.m_nDirY + y;
            egret.Tween.get(this).to({ x: ax, y: ay }, this.m_nMoveSpeed);
            com_main.WorldView.callFunc(18 /* UPDATE_HERO_LINE_WAY */, new egret.Point(ax, ay), this.m_teamKey);
            var i = 0, direct = this.getChildrenPoint();
            this.parent.getAmryChildren(this.m_aChildren, function (o) {
                var _a = direct[i], x = _a[0], y = _a[1];
                o.resetPoint(_this.x, _this.y, x, y);
                i++;
                o.onMoveEvent(ax, ay, _this.m_nMoveSpeed, angle);
            }, this);
        };
        /**
         * 由结束时间更新位置
         * @returns void
         */
        ArmySprite.prototype.__update_dt_move = function () {
            if (this.m_nEndDt <= 0) {
                this.m_nEndDt = TimerUtils.getServerTime() + this.totalDt;
                return;
            }
            /**经过多次加速以后 换算标准速度 */
            this.m_nMoveSpeed = Number(this.m_nAllDt / (this.m_aMovePoint.length) * 1000);
            var n = Math.floor(this.realTotalDt * 1000 / this.m_nMoveSpeed) //剩余点数
            , num = this.m_aMovePoint.length;
            if (this.realTotalDt >= 0) {
                /**最少保留两个点 */
                var leftNum = n;
                leftNum = Math.max(2, leftNum);
                leftNum = Math.min(num, leftNum);
                this.m_aMovePoint = this.m_aMovePoint.slice(0, leftNum);
            }
            //按剩余时间 剩余点数 重新换算速度 [由于时间段 和点数相等 最后一个时间段的点没有执行移动 故人为添加一个点长度]
            this.m_nMoveSpeed = Number(this.realTotalDt / (this.m_aMovePoint.length + 1) * 1000);
        };
        /**
         * 点移动
         * @private
         * @param  {number[]} cityVert 顶点集合
         * @param  {number} dt 时间(结束时间)
         * @return void
         * @memberof ArmySprite
         */
        ArmySprite.prototype.__init_point_move = function (cityVert, sdt, edt, trpsType) {
            var _a;
            if (cityVert && cityVert.length > 1) {
                this.m_aCityVert = cityVert;
                // this.__update_move_point();
                var way = void 0;
                _a = com_main.DjikstraGraph.Instance.GetEdgeTime(cityVert), this.m_nTotalDt = _a[0], this.m_nMoveSpeed = _a[1], way = _a[2];
                this.m_nStartDt = sdt;
                this.m_nEndDt = edt;
                this.m_nAllDt = this.m_nEndDt - this.m_nStartDt;
                this.m_aMovePoint = way;
                this.m_aMovePoint.reverse();
                this.__update_dt_move();
                this.initSoldier();
                var _b = this.m_aMovePoint.pop(), x = _b[0], y = _b[1];
                this.setPosition(x, y);
                if (this.m_aMovePoint.length > 0) {
                    var angle = ArmySprite.getAngle(this.m_aMovePoint[0], [x, y]);
                    this.setSoilderAngle(angle);
                    //线路
                    this.__create_city_way(x, y, this.m_aMovePoint, trpsType);
                }
                this.startMove();
                // this.__create_hero_line_way(this);
            }
        };
        /**
         * 线移动
         * @private
         * @param  {egret.Point} startPoint
         * @param  {egret.Point} endPoint
         * @param  {number} [dt]
         * @return void
         * @memberof ArmySprite
         */
        ArmySprite.prototype.__init_line_move = function (startPoint, endPoint) {
            if (startPoint && endPoint) { //直线移动
                this.m_nMoveSpeed = 50;
                this.m_pStartPoint = startPoint;
                this.m_pEndPoint = endPoint;
                var len = egret.Point.distance(this.m_pStartPoint, this.m_pEndPoint);
                this.m_nOdd = len / (this.m_nAllDt * 1000) * this.m_nMoveSpeed; //每帧移动速度
                //偏移
                var x = this.m_pEndPoint.x - this.m_pStartPoint.x, y = this.m_pEndPoint.y - this.m_pStartPoint.y;
                this.m_nAoffset = y / x;
                this.m_nDirX = x >= 0 ? 1 : -1;
                this.m_nDirY = y >= 0 ? 1 : -1;
                this.m_nMoveX = Math.sqrt(Math.pow(this.m_nOdd, 2) / (1 + Math.pow(Math.abs(this.m_nAoffset), 2)));
                this.m_nMoveY = Math.abs(this.m_nAoffset) * this.m_nMoveX;
                //角度
                var angle = ArmySprite.getAngle(endPoint, startPoint);
                var _a = ArmySprite.getDirectionAngle(angle), direct = _a[0], _ = _a[1];
                this.initSoldier(direct);
                //矫正起始位置(计算已走帧数)
                var d = Math.floor((TimerUtils.getServerTime() - this.m_nStartDt) * 1000 / this.m_nMoveSpeed);
                d = d < 0 ? 0 : d;
                this.setPosition(startPoint.x + d * this.m_nMoveX * this.m_nDirX, startPoint.y + d * this.m_nMoveY * this.m_nDirY);
                this.startMove();
            }
        };
        /**
         * 初始化移动信息
         * @param  {number} ty 类型(1:点移动，2:资源，3:拜访)
         * @param  {number[]} [cityVert] 顶点列表
         * @param  {number} [sdt=0] 时间
         * @param  {number} [edt=0] 时间
         * @param  {number} [mt=1] 前往类型(1:前往，2:返回)
         * @param {number} trpsType 路线类型 （0：黄色 1：红色）
         * @return void
         * @memberof ArmySprite
         */
        ArmySprite.prototype.initMoveInfo = function (cityVert, sdt, edt, mt, trpsType) {
            if (sdt === void 0) { sdt = 0; }
            if (edt === void 0) { edt = 0; }
            if (mt === void 0) { mt = 1; }
            if (trpsType === void 0) { trpsType = 0; }
            this.m_nPathType = 1;
            this.m_bBack = mt == 2 /* BACK */;
            this.__init_point_move(cityVert, sdt, edt, trpsType);
        };
        /**
         * 直线移动
         * @param edt 结束事件
         *  */
        ArmySprite.prototype.initLineMoveInfo = function (data) {
            this.m_nPathType = 2;
            this.m_clientMoveEt = data;
            this.m_bBack = false;
            this.m_nStartDt = data.startTime;
            this.m_nEndDt = data.endTime;
            var teamVo = TeamModel.getTeamVoByTypeId(1 /* WORLD */, data.teamId);
            var cityId = teamVo.cityId;
            if (teamVo.cityId == -1) {
                var moveData = WorldModel.getTeamMoveData(RoleData.playerId + "_" + data.teamId);
                cityId = moveData.cityPath[0];
            }
            var evtVo = WorldModel.getEventVoByPosId(data.evtPosId);
            //改成从部队所在的城池出发
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY)
                return;
            var _a = com_main.DjikstraGraph.Instance.GetVertex(cityId).cityPos, x1 = _a[0], y1 = _a[1];
            var sPos = data.isBack ? new egret.Point(evtVo.pos.x, evtVo.pos.y) : new egret.Point(x1, y1);
            var ePos = data.isBack ? new egret.Point(x1, y1) : new egret.Point(evtVo.pos.x, evtVo.pos.y);
            this.m_nAllDt = this.m_nEndDt - this.m_nStartDt;
            this.m_nTotalDt = this.m_nEndDt - TimerUtils.getServerTime();
            this.__init_line_move(sPos, ePos);
        };
        ArmySprite.prototype.startMove = function () {
            if (this.m_bMove)
                return;
            this.m_nMoveDt = TimerUtils.getServerTimeMill();
            this.m_bMove = true;
        };
        ArmySprite.prototype.endMove = function () {
            if (!this.m_bMove)
                return;
            this.m_bMove = false;
            egret.Tween.removeTweens(this);
        };
        ArmySprite.prototype.setPosition = function (x, y) {
            this.x = this.m_nOffsetX + x;
            this.y = this.m_nOffsetY + y;
            this.m_nLastPoint = [x, y];
        };
        /**
         * 点击事件
         * @param  {number} x
         * @param  {number} y
         * @returns boolean
         */
        ArmySprite.prototype.checkTouchEvent = function (x, y) {
            /**部队镜像移动 过滤 */
            //部队del信息没有收到
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (!data)
                return;
            if (this.m_nPathType != 1)
                return;
            if (data.playerId != RoleData.playerId)
                return;
            var menu = this.getChildByName('WorldMenuArmy');
            if (menu && menu.hitPoint(x, y)) {
                return true;
            }
            if (this.hitTestPoint(x, y)) {
                if (!menu) {
                    var data_1 = WorldModel.getTeamMoveData(this.m_teamKey);
                    com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.HERO, this.m_teamKey);
                    this.isShowTime(false);
                    this._create_menu();
                }
                return true;
            }
            if (menu)
                menu.removeFromParent();
            return false;
        };
        /**
         * 创建行军菜单
         * @returns WorldMenuArmyWidget
         */
        ArmySprite.prototype._create_menu = function () {
            com_main.WorldView.callFunc(6 /* HIDE_MENU */);
            var menu = new com_main.WorldMenuArmyWidget(this.m_teamKey);
            Utils.addChild(this, menu);
            menu.x = -135;
            menu.y = -100;
            return menu;
        };
        /**
         * 半路返回
         * @returns void
         */
        ArmySprite.prototype.onHalfWayBack = function (data) {
            this.m_bBack = true;
            this.endMove();
            this.initMoveInfo(data.cityPath, data.startTime, data.endTime, data.moveType);
        };
        /**
         * 创建城池间线路
         * @private
         * @param  {number} x
         * @param  {number} y
         * @param  {number[][]} allway
         * @return void
         * @memberof ArmySprite
         */
        ArmySprite.prototype.__create_city_way = function (x, y, allway, trpsType) {
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            //友方阵营不创建线路
            if (data && data.countryId == RoleData.countryId && data.playerId != data.playerId) {
                return;
            }
            if (allway.length == 0)
                return;
            //消除
            if (this.m_aCityWay.length > 0)
                com_main.WorldView.callFunc(11 /* REMOVE_CITY_WAY */, this.m_aCityWay);
            //到达位置
            var indx = -1, w = allway[0], po = [x, y].toString();
            if (w.toString() != po) {
                var index = 0;
                while (w) {
                    if (w.toString() == po) {
                        indx = index;
                        break;
                    }
                    ++index;
                    w = allway[index];
                }
            }
            else {
                indx = 0;
            }
            allway.splice(0, indx + 1);
            this.m_aCityWay = com_main.WorldView.callFunc(10 /* CREATE_CITY_WAY */, allway, trpsType);
        };
        /**
         * 模型到目标城市的直线
         */
        ArmySprite.prototype.__create_hero_line_way = function (army) {
            com_main.WorldView.callFunc(17 /* CREATE_HERO_LINE_WAY */, army);
        };
        /**
        * 更新模型直线
        */
        ArmySprite.prototype.__update_hero_line_way = function (movePoint) {
            com_main.WorldView.callFunc(18 /* UPDATE_HERO_LINE_WAY */, movePoint);
        };
        /**
         * 加速
         * @param  {number} dt 结束时间
         * @return void
         * @memberof ArmySprite
         */
        ArmySprite.prototype.onAccelerate = function () {
            this.endMove();
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data) {
                this.m_nStartDt = data.startTime;
                this.m_nEndDt = data.endTime;
                this.m_nAllDt = this.m_nEndDt - this.m_nStartDt;
                //[由于时间段 和点数相等 最后一个时间段的点没有执行移动 故人为添加一个点长度]
                this.m_nMoveSpeed = Number(this.realTotalDt / (this.m_aMovePoint.length + 1) * 1000);
                this.m_nMoveDt = TimerUtils.getServerTimeMill();
            }
            else {
                com_main.WorldView.callFunc(0 /* END_HERO_MOVE */, this.m_teamKey);
            }
            this.startMove();
        };
        ArmySprite.prototype.setChildrenId = function (iid) {
            this.m_aChildren = iid;
        };
        /**
         *
         * @param direction
         */
        ArmySprite.prototype.getChildrenPoint = function (direction) {
            direction = direction != undefined ? direction : this.direction;
            if (direction == CSquare_Direction.RIGHT || direction == CSquare_Direction.RIGHT_DOWN) {
                return [[-75, -60], [-105, -40], [-75, -30], [-45, -40], [-105, -10], [-75, 0], [-45, -10]];
            }
            else if (direction == CSquare_Direction.RIGHT_UP || direction == CSquare_Direction.UP) {
                return [[-50, 30], [-10, 30], [-70, 60], [-30, 60], [10, 60], [-50, 90], [-10, 90]];
            }
            else if (direction == CSquare_Direction.DOWN) {
                return [[10, -90], [40, -90], [-10, -60], [30, -60], [70, -60], [10, -30], [40, -30]];
            }
            else if (direction == CSquare_Direction.LEFT_DOWN) {
                return [[35, -90], [75, -90], [15, -60], [55, -60], [95, -60], [35, -30], [75, -30]];
            }
            else if (direction == CSquare_Direction.LEFT) {
                return [[45, -70], [85, -70], [25, -40], [65, -40], [105, -40], [45, -10], [85, -10]];
            }
            return [[-10, 30], [30, 30], [-30, 60], [10, 60], [50, 60], [-10, 90], [30, 90]];
        };
        ArmySprite.prototype.removeFromParent = function () {
            if (this.m_aCityWay.length > 0)
                com_main.WorldView.callFunc(11 /* REMOVE_CITY_WAY */, this.m_aCityWay);
            _super_1.prototype.removeFromParent.call(this);
        };
        ArmySprite.prototype.isShowTime = function (val) {
            this.m_pLbTime.visible = val;
        };
        return ArmySprite;
    }(com_main.CComponent));
    com_main.ArmySprite = ArmySprite;
    /**
     * 行军时间
     * @class WorldSoilderTime
     * @extends egret.DisplayObjectContainer
     */
    var WorldSoilderTime = /** @class */ (function (_super_1) {
        __extends(WorldSoilderTime, _super_1);
        function WorldSoilderTime(eid) {
            var _this = _super_1.call(this) || this;
            _this.m_nEid = eid;
            _this.touchEnabled = false;
            _this.touchChildren = false;
            _this.skinName = Utils.getSkinName("app/world/world_army_time.exml");
            return _this;
        }
        WorldSoilderTime.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WorldSoilderTime.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var data = WorldModel.getTeamMoveData(this.m_nEid);
            this.m_pLbNum.text = "" + RoleData.nickName;
            var countryId = RoleData.countryId;
            if (isNull(data)) {
                this.m_comState.stateId = countryId;
                return;
            }
            countryId = data.countryId;
            this.m_pLbNum.text = "" + (isNull(data.playerName) ? RoleData.nickName : data.playerName);
            this.m_comState.stateId = countryId;
            // this.m_pLbNum.visible = unNull(data.playerName);
            // if ( data.moveType != 0)
            //     this.currentState = "none";
            // else
            // this.m_pLbNum.text = `${event.gid.length}`
        };
        WorldSoilderTime.prototype.tickEvent = function (dt) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (dt == '00:00:00' && this.visible)
                        this.visible = false;
                    this.m_pLbTime.text = dt;
                    return [2 /*return*/];
                });
            });
        };
        return WorldSoilderTime;
    }(com_main.CComponent));
})(com_main || (com_main = {}));

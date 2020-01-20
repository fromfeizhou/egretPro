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
    var CoverLayer = /** @class */ (function (_super_1) {
        __extends(CoverLayer, _super_1);
        // private m_nColor:number[] = [0x005BD8, 0x00D848, 0xFF1111]
        function CoverLayer(w, h) {
            var _this = _super_1.call(this) || this;
            _this.name = CoverLayer.NAME;
            _this.touchEnabled = false;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddedToStage, _this);
            return _this;
        }
        CoverLayer.prototype.onAddedToStage = function () {
            // for (let j = 0; j < 2; j++) {
            //     for (let i = 0; i < 3; i++) {
            //         let sky: egret.Bitmap = new egret.Bitmap(RES.getRes('border_005_jpg'));
            //         this.addChild(sky);
            //         sky.alpha = .5;
            //         sky.width = 2000;
            //         sky.height = 2000;
            //         sky.x = i * 2000
            //         sky.y = j * 2000
            //         egret.Tween.get(sky).to({alpha: 0}, 1200).call((child)=>{
            //             Utils.removeFromParent(child);
            //         }, this, [sky])
            //     }
            // }
        };
        CoverLayer.prototype.initRange = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allpoint;
                var _this = this;
                return __generator(this, function (_a) {
                    if (SceneManager.getCurrScene() != SceneEnums.WORLD_CITY)
                        return [2 /*return*/];
                    allpoint = WorldModel.getCountryRange();
                    if (allpoint.toString() == this.m_sRangeRecord)
                        return [2 /*return*/];
                    this.m_tPoints = allpoint;
                    this.m_sRangeRecord = allpoint.toString();
                    RES.getResAsync('border_005_jpg', function (texture, v) {
                        if (!_this.m_pContainer) {
                            _this.m_pContainer = new egret.Sprite();
                            _this.m_pContainer.touchChildren = false;
                            _this.m_pContainer.touchEnabled = false;
                            for (var j = 0; j < 4; j++) {
                                for (var i = 0; i < 6; i++) {
                                    var sky = new egret.Bitmap(texture);
                                    _this.m_pContainer.addChild(sky);
                                    sky.alpha = .5;
                                    sky.width = 100;
                                    sky.height = 100;
                                    sky.x = i * 100;
                                    sky.y = j * 100;
                                }
                            }
                        }
                        Utils.TimerManager.doTimer(100, 1, _this._init_range, _this);
                    }, this);
                    return [2 /*return*/];
                });
            });
        };
        CoverLayer.prototype._init_range = function () {
            var _this = this;
            RES.getResAsync('m_cloud_png', function (texture, v) {
                if (!_this.m_pContainer)
                    return;
                var allpoint = _this.m_tPoints;
                for (var _i = 0, allpoint_1 = allpoint; _i < allpoint_1.length; _i++) {
                    var gid = allpoint_1[_i];
                    var _a = WorldTmxData.getPointByGid(gid), x = _a[0], y = _a[1];
                    var spr = new egret.Bitmap(texture);
                    spr.width = 8.5;
                    spr.height = 8.5;
                    spr.x = x * 0.1 - 4.25;
                    spr.y = y * 0.1 - 4.25;
                    spr.alpha = .9;
                    spr.blendMode = egret.BlendMode.ERASE;
                    _this.m_pContainer.addChild(spr);
                }
                // this.cacheAsBitmap = true;
                // for (let i = 1; i < 4; i++) {
                // let color = this.m_nColor[i - 1]
                // for (let edge of allpoint) {
                //     if (i == RoleData.countryId) {
                //         let mask = this.createMask(edge)
                //         this.m_pContainer.addChild(mask)
                //         mask.blendMode = egret.BlendMode.ERASE;
                //         let fit = new egret.GlowFilter(0xFFFFFF, 0.2, 30, 30, 50, egret.BitmapFilterQuality.LOW, false, false)
                //         mask.filters = [fit];
                //     }
                //     // if (i == RoleData.countryId) {
                //     // this.setEdge(edge, color)
                //     // }
                // }
                // }.
                // this.m_pContainer.cacheAsBitmap = true;
                var chidrens = _this.$children.slice();
                var l = chidrens.length;
                if (l > 0) {
                    _this.removeChildren();
                }
                // let o = 1000;
                // for (let j = 0; j < 4; j++) {
                //     for (let i = 0; i < 6; i++) {
                //         let renderTexture: egret.RenderTexture = new egret.RenderTexture();
                //         renderTexture.drawToTexture(this.m_pContainer, new egret.Rectangle(i * o, j * o, o, o));
                //         let bitmap: egret.Bitmap = new egret.Bitmap();
                //         bitmap.texture = renderTexture;
                //         bitmap.x = i * o
                //         bitmap.y = j * o
                //         this.addChild(bitmap);
                //         if (l == 0) {
                //             bitmap.alpha = 0;
                //             egret.Tween.get(bitmap).to({ alpha: 1 }, 700)
                //         }
                //     }
                // }
                var renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(_this.m_pContainer);
                var bitmap = new egret.Bitmap();
                bitmap.texture = renderTexture;
                NodeUtils.setScale(bitmap, 10);
                _this.addChild(bitmap);
                _this.m_pContainer = null;
            }, this);
            // this.cacheAsBitmap = true;
            return true;
        };
        CoverLayer.prototype.createMask = function (edge) {
            var mask = new egret.Shape();
            mask.graphics.clear();
            mask.graphics.beginFill(0x000000);
            for (var _i = 0, edge_1 = edge; _i < edge_1.length; _i++) {
                var _a = edge_1[_i], x = _a[0], y = _a[1];
                mask.graphics.lineTo(x, y);
            }
            mask.graphics.endFill();
            mask.cacheAsBitmap = true;
            return mask;
        };
        CoverLayer.prototype.setEdge = function (edge, color) {
            var cirleLight = this.createMask(edge);
            this.m_pContainer.addChild(cirleLight);
            var fit = new egret.GlowFilter(color, 0.2, 50, 50, 7, 1 /* LOW */, true, true);
            cirleLight.filters = [fit];
            cirleLight = this.createMask(edge);
            this.m_pContainer.addChild(cirleLight);
            fit = new egret.GlowFilter(color, .8, 25, 25, 5, 1 /* LOW */, false, true);
            cirleLight.filters = [fit];
        };
        CoverLayer.prototype.onDestroy = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                egret.Tween.removeTweens(o);
            }
            Utils.TimerManager.removeAll(this);
        };
        /**
         * 点击事件
         * @param  {egret.TouchEvent} e
         * @returns boolean
         */
        CoverLayer.prototype.onTouch = function (e, b) {
            return true;
        };
        CoverLayer.NAME = "CoverLayer";
        return CoverLayer;
    }(egret.DisplayObjectContainer));
    com_main.CoverLayer = CoverLayer;
})(com_main || (com_main = {}));

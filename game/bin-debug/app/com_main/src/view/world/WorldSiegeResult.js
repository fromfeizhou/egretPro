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
    /**
     * 攻城结果
     * @export
     * @class WorldSiegeResult
     * @extends CView
     */
    var WorldSiegeResult = /** @class */ (function (_super_1) {
        __extends(WorldSiegeResult, _super_1);
        function WorldSiegeResult(body) {
            var _this = _super_1.call(this) || this;
            _this.name = WorldSiegeResult.NAME;
            _this.m_pResult = body;
            _this.initApp("world/world_siege_result.exml");
            return _this;
        }
        WorldSiegeResult.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldSiegeResult.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            if (!this.m_pResult)
                return;
            this.__init_result();
            this.m_pLbAttkLess.text = "" + this.m_pResult.atkRemainQueue;
            this.m_pLbAttkDead.text = "" + this.m_pResult.atkDead;
            this.m_pLbDefeLess.text = "" + this.m_pResult.defRemainQueue;
            this.m_pLbDefeDead.text = "" + this.m_pResult.defDead;
            var roleKillNum = CommonUtils.numOutLenght(this.m_pResult.roleKillNum);
            var roleLostNum = CommonUtils.numOutLenght(this.m_pResult.roleLostNum);
            this.m_pLbAtk.text = GCodeFromat(CLEnum.WOR_GZ_NUM, roleKillNum);
            this.m_pLbHurt.text = GCodeFromat(CLEnum.WOR_GZ_NUM, roleLostNum);
            this.m_pLbSort.text = "+" + this.m_pResult.roleFight;
            this.__init_country();
            com_main.EventManager.addTouchScaleListener(this.m_pExit, this, function (e) {
                BattleModel.exitWatchBattle(_this.m_pResult.cityId);
                com_main.UpManager.history();
            });
        };
        WorldSiegeResult.prototype.__init_result = function () {
            return __awaiter(this, void 0, void 0, function () {
                var ret, country, atkCountry, defCountry, win, ret, isAttack;
                return __generator(this, function (_a) {
                    if (!this.m_pResult.isCross) {
                        ret = this.m_pResult.result, country = RoleData.countryId, atkCountry = this.m_pResult.atkCountry, defCountry = this.m_pResult.defCountry, win = ret == 0 ? atkCountry : defCountry;
                        if (ret == 0 && atkCountry == country) {
                            this.currentState = "a_succeed";
                        }
                        else if (ret == 0 && defCountry == country) {
                            this.currentState = "d_fail";
                            this.m_pAttkCountry.alpha = 0.5;
                            this.m_pDefeCountry.alpha = 0.5;
                            // Utils.setLight(0.65, this.m_pAttkCountry);
                            // Utils.setLight(0.65, this.m_pDefeCountry);
                        }
                        else if (ret == 1 && defCountry == country) {
                            this.currentState = "d_succeed";
                        }
                        else if (ret == 1 && atkCountry == country) {
                            this.currentState = "a_fail";
                            this.m_pAttkCountry.alpha = 0.5;
                            this.m_pDefeCountry.alpha = 0.5;
                        }
                        else {
                            this.currentState = "a_succeed";
                        }
                        this.m_pWinCountry.source = Utils.getCountyBigiFlagById(win);
                    }
                    else {
                        ret = this.m_pResult.result, isAttack = this.m_pResult.isAttack;
                        if (ret == 0 && isAttack) {
                            this.currentState = "a_succeed";
                        }
                        else if (ret == 0 && !isAttack) {
                            this.currentState = "d_fail";
                        }
                        else if (ret == 1 && !isAttack) {
                            this.currentState = "d_succeed";
                        }
                        else if (ret == 1 && isAttack) {
                            this.currentState = "a_fail";
                        }
                        this.commitProperties();
                        this.m_pWinCountry.visible = false;
                        this.m_pAttkCountry.source = 'common_country4_1_png';
                        this.m_pDefeCountry.source = 'common_country4_3_png';
                        this.m_lbWf.visible = true;
                        this.m_lbDf.visible = true;
                        this.m_pLbSort.visible = false;
                    }
                    return [2 /*return*/];
                });
            });
        };
        WorldSiegeResult.prototype.__init_country = function () {
            return __awaiter(this, void 0, void 0, function () {
                var v, atkCountry, defCountry, conf;
                return __generator(this, function (_a) {
                    //跨服战不用跑
                    if (this.m_pResult.isCross) {
                        return [2 /*return*/];
                    }
                    v = false;
                    atkCountry = this.m_pResult.atkCountry, defCountry = this.m_pResult.defCountry;
                    if (defCountry > 0 && defCountry <= 4) {
                        this.m_pDefeCountry.source = Utils.getCountyBigiFlagById(defCountry);
                        if (defCountry == 4) {
                            conf = WorldModel.getCityConfig(this.m_pResult.cityId);
                            // this.m_pLbDefeCountryName.text = GLan(conf.banner);
                            // this.m_pLbWinCountryName.text = GLan(conf.banner);
                            v = true;
                        }
                    }
                    if (atkCountry > 0) {
                        this.m_pAttkCountry.source = Utils.getCountyBigiFlagById(atkCountry);
                    }
                    return [2 /*return*/];
                });
            });
        };
        WorldSiegeResult.NAME = "WorldSiegeResult";
        return WorldSiegeResult;
    }(com_main.CView));
    com_main.WorldSiegeResult = WorldSiegeResult;
})(com_main || (com_main = {}));

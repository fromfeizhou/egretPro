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
     * 攻城战列表信息
     * @export
     * @class WorldSiegeView
     * @extends CView
     */
    var WorldSiegeView = /** @class */ (function (_super_1) {
        __extends(WorldSiegeView, _super_1);
        function WorldSiegeView(body) {
            var _this = _super_1.call(this) || this;
            _this.m_nCityId = 0;
            _this.name = WorldSiegeView.NAME;
            _this.m_nCityId = body.cid;
            // WorldModel.initSiegeData(null);
            _this.initApp("world/world_siege_view.exml");
            WorldProxy.send_C2S_CITY_WAR_CONFRONTATION_LIST(WorldModel.getCityWarInfo().cityId);
            return _this;
        }
        WorldSiegeView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldSiegeView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CITY_WAR_CONFRONTATION_LIST,
            ];
        };
        WorldSiegeView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_WAR_CONFRONTATION_LIST: {
                    this.__init_battle();
                }
                // case ProtoDef.CITY_BATTLE_UPDATE_CITY: {
                //     const config = WorldModel.getCityBuildInfo(this.m_nCityId);
                //     if (config.atkCountry == 0)
                //         UpManager.close();
                //     break;
                // }
                // case ProtoDef.WORLD_SIEGE_UPDATE: {
                //     this.__init_battle();
                //     break;
                // }
                // case ProtoDef.WORLD_SIEGE_RESULT: {
                //     this.__init_battle();
                //     break;
                // }
                // case ProtoDef.WORLD_SIEGE_UPDATE_BATTLE: {
                //     error("==========WORLD_SIEGE_RESULT=======", body);
                //     this.__init_battle();
                //     break;
                // }
            }
        };
        WorldSiegeView.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            var config = C.WorldMapConfig[this.m_nCityId];
            if (config) {
                this.m_pLbCity.text = GLan(config.name);
            }
            else {
                var cId = CrossModel.getCIdByWarAreaId(this.m_nCityId);
                if (cId) {
                    this.m_pLbCity.text = GLan(C.CrossServerAreaConfig[cId].name);
                }
            }
            this.m_pAttkCollection = new eui.ArrayCollection();
            this.m_pAttkList.dataProvider = this.m_pAttkCollection;
            this.m_pAttkList.itemRenderer = WorldSiegeItem;
            this.m_pAttkList.useVirtualLayout = true;
            this.m_pDefeCollection = new eui.ArrayCollection();
            this.m_pDefeList.dataProvider = this.m_pDefeCollection;
            this.m_pDefeList.itemRenderer = WorldSiegeItem;
            this.m_pDefeList.useVirtualLayout = true;
            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
                _this.onDestroy();
            });
            Promise.all([
                this.__init_country(),
                this.__init_battle()
            ]);
        };
        WorldSiegeView.prototype.__init_country = function () {
            return __awaiter(this, void 0, void 0, function () {
                var v, city;
                return __generator(this, function (_a) {
                    v = false;
                    city = WorldModel.getCityBuildInfo(this.m_nCityId);
                    if (city) {
                        if (city.country > 0 && city.country <= 4) {
                            this.m_pDefeCountry.source = Utils.getCountyBigiFlagById(city.country);
                            // if (city.country == 4) {
                            //     let conf = WorldModel.getCityConfig(city.id);
                            //     this.m_pLbDefeCountryName.text = GLan(conf.banner);
                            //     v = true;
                            // }
                        }
                        if (city.atkCountry > 0) {
                            this.m_pAttkCountry.source = Utils.getCountyBigiFlagById(city.atkCountry);
                        }
                        this.m_pLbDefeCountryName.visible = v;
                    }
                    else {
                        this.m_pDefeCountry.visible = false;
                        this.m_pAttkCountry.visible = false;
                    }
                    return [2 /*return*/];
                });
            });
        };
        WorldSiegeView.prototype.__init_battle = function () {
            return __awaiter(this, void 0, void 0, function () {
                var siegeList, atkList, defList, index, type, _i, _a, id, _b, _c, id, order;
                return __generator(this, function (_d) {
                    siegeList = WorldModel.getSiegeList();
                    if (!siegeList)
                        return [2 /*return*/];
                    this.m_pLbAttkLess.text = "" + siegeList.attData.surplusSoldiersCount; //攻方剩余部队
                    this.m_pLbAttkDead.text = "" + siegeList.attData.lossSoldiersCount; //攻方死亡数量
                    this.m_pLbDefeLess.text = "" + siegeList.defData.surplusSoldiersCount; //防守方剩余部队
                    this.m_pLbDefeDead.text = "" + siegeList.defData.lossSoldiersCount; //防守方死亡数量
                    atkList = [], defList = [], index = 1, type = 0;
                    for (_i = 0, _a = siegeList.attPlayerWarData; _i < _a.length; _i++) {
                        id = _a[_i];
                        atkList.push({ index: index, id: id });
                        index++;
                    }
                    index = 1, type = 1;
                    for (_b = 0, _c = siegeList.defPlayerWarData; _b < _c.length; _b++) {
                        id = _c[_b];
                        defList.push({ index: index, id: id });
                        index++;
                    }
                    this.m_pAttkCollection.replaceAll(atkList);
                    this.m_pDefeCollection.replaceAll(defList);
                    order = siegeList.order;
                    if (!order) {
                        this.m_pGQueue.visible = false;
                    }
                    else {
                        this.m_pGQueue.visible = true;
                        this.m_pLbQueue.text = "" + order;
                    }
                    return [2 /*return*/];
                });
            });
        };
        WorldSiegeView.NAME = "WorldSiegeView";
        return WorldSiegeView;
    }(com_main.CView));
    com_main.WorldSiegeView = WorldSiegeView;
    /**
     * 攻城信息列表Item
     * @export
     * @class WorldSiegeItem
     * @extends eui.ItemRenderer
     */
    var WorldSiegeItem = /** @class */ (function (_super_1) {
        __extends(WorldSiegeItem, _super_1);
        function WorldSiegeItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/world_siege_item.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            _this.cacheAsBitmap = true;
            return _this;
        }
        WorldSiegeItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        WorldSiegeItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBthSee.visible = true;
            this.m_comState.setDefautName(GCode(CLEnum.STATE_QUN));
        };
        WorldSiegeItem.prototype.dataChanged = function () {
            com_main.EventManager.removeEventListener(this.m_pBthSee);
            var data = this.data;
            this.m_pLbOrder.text = "" + data.index;
            // const event = WorldModel.getSiegeEvent(data.id, data.type);
            // if (!event) return;
            var playerWarData = data.id;
            this.m_pLbNum.text = "" + playerWarData.teamGeneral;
            this.m_comState.stateId = playerWarData.countryId;
            this.m_pHeroHead.setGenId(playerWarData.generalId);
            var bBattle = playerWarData.battleId > 0;
            Utils.isGray(!bBattle, this.m_pBthSee);
            if (bBattle) {
                this.m_pLbStatus.text = GCode(CLEnum.WOR_GZ_JZZ);
                this.m_pLbStatus.textColor = 0xFF0000;
                com_main.EventManager.addTouchScaleListener(this.m_pBthSee, this, function () {
                    // SceneManager.enterScene(SceneEnums.BATTLE_MAP, event.battleId,true);
                    BattleProxy.send_C2S_WAR_REENTRY_BATTLE(playerWarData.battleId);
                    WorldModel.setCurWatchTeamId(playerWarData.playerId, playerWarData.teamId);
                    com_main.UpManager.history();
                });
            }
            else {
                this.m_pLbStatus.text = GCode(CLEnum.WOR_GZ_LDZ);
                this.m_pLbStatus.textColor = 0x8a8a9e;
            }
            this.m_labelFight.text = "" + playerWarData.teamForce;
            // if (event.cpId > 0) {
            //     const pConfig = C.CheckPointConfig[event.cpId]
            //     this.m_pLbName.text = `${GLan(pConfig.name)}`;
            //     // this.m_pLbName.text = `${event.id}`;
            // } else {
            this.m_pLbName.text = "" + playerWarData.userName;
            // }
        };
        return WorldSiegeItem;
    }(eui.ItemRenderer));
    com_main.WorldSiegeItem = WorldSiegeItem;
    var WorldSiegeTime = /** @class */ (function (_super_1) {
        __extends(WorldSiegeTime, _super_1);
        function WorldSiegeTime(cid) {
            var _this = _super_1.call(this) || this;
            _this.m_nCityId = 0;
            _this.m_nDt = 0;
            _this.skinName = Utils.getSkinName("app/world/world_siege_time.exml");
            _this.init(cid);
            return _this;
        }
        WorldSiegeTime.create = function (cid) {
            var obj = ObjectPool.pop(WorldSiegeTime, "WorldSiegeTime", cid);
            return obj;
        };
        /**对象池回收 */
        WorldSiegeTime.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        WorldSiegeTime.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldSiegeTime.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.$update, this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        WorldSiegeTime.prototype.init = function (cid) {
            var _this = this;
            NodeUtils.reset(this);
            this.m_nCityId = cid;
            var dt = WorldModel.checkSiegeTimeByCityid(this.m_nCityId);
            if (dt <= 0) {
                this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? "base" : "xBase";
            }
            else {
                this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? "time" : "xTime";
                this.m_nDt = dt;
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(dt, 1);
                Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.$update, this, function () {
                    _this.currentState = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? "base" : "xBase";
                });
            }
        };
        WorldSiegeTime.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        WorldSiegeTime.prototype.checkTouchEvent = function (x, y) {
            if (this.m_pBtnAttack.hitTestPoint(x, y)) {
                // const data = WorldModel.getSiegeAll(this.m_nCityId);
                // if (data) {
                //     const [hero, dt] = data;
                //     if (hero)  {
                //         if (hero.battleId == 0)
                //             SceneManager.enterScene(SceneEnums.WAIT_BATTLE_MAP,{generalList: (<ItfSiegeBase>hero).gids, cityId: this.m_nCityId});
                //         else
                //             SceneManager.enterScene(SceneEnums.BATTLE_MAP, hero);
                //     }
                //     return true;
                // }
                // Utils.open_view(TASK_UI.POP_WORLD_SIEGE_VIEW, {cid: this.m_nCityId})
                WorldProxy.send_C2S_CITY_WAR_GO(this.m_nCityId);
                return true;
            }
            return false;
        };
        WorldSiegeTime.prototype.$update = function () {
            --this.m_nDt;
            if (this.m_nDt <= 0) {
                return;
            }
            if (!this.m_pLbTime)
                return;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            ;
        };
        return WorldSiegeTime;
    }(com_main.CComponent));
    com_main.WorldSiegeTime = WorldSiegeTime;
})(com_main || (com_main = {}));

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
     * 世界地图城池
     * @export
     * @class CitySprite
     * @extends ResSprite
     */
    var CitySprite = /** @class */ (function (_super_1) {
        __extends(CitySprite, _super_1);
        function CitySprite(config) {
            var _this = _super_1.call(this, com_main.ResType.CITY) || this;
            /**名字 */
            _this.m_pBuild_name = null;
            /**建筑配置 */
            _this.m_pBuildConfig = null;
            /**城池配置 */
            _this.m_pInfo = null;
            _this.m_pFlagType = '';
            // if (config.type == CityType.XIANG_BIRTH) {
            //     config=C.WorldMapConfig[config.mapCity]
            // }
            _this.m_nIid = config.id;
            _this.name = com_main.ResType.CITY + "_" + config.id;
            _this.touchEnabled = false;
            _this.m_pBuildConfig = config;
            _this.x = config.posX;
            _this.y = config.posY;
            return _this;
        }
        Object.defineProperty(CitySprite.prototype, "config", {
            get: function () {
                return this.m_pBuildConfig;
            },
            enumerable: true,
            configurable: true
        });
        CitySprite.create = function (config) {
            var obj = new CitySprite(config);
            AnchorUtil.setAnchorCenter(obj);
            return obj;
        };
        CitySprite.prototype.onDestroy = function () {
            this.m_pBuildConfig = null;
            this.m_pInfo = null;
            this.removeEvent();
            this.onClearView();
            _super_1.prototype.onDestroy.call(this);
        };
        CitySprite.prototype.onClearView = function () {
            if (this.m_pBuild) {
                Utils.isGlow(false, this.m_pBuild);
                this.m_pBuild.onDestroy();
                this.m_pBuild = null;
            }
            if (this.m_pBuild_name) {
                this.m_pBuild_name.onDestroy();
                this.m_pBuild_name = null;
            }
            this.__remove_visit();
            this.__remove_first_award();
            this.__remove_city_locked();
            this.__remove_attack_event();
            this.__remove_battle_eff();
            this.removeSjfhzEffect();
            this.removeBarAtkItem();
            com_main.EventManager.removeEventListeners(this);
        };
        CitySprite.prototype.onCreateView = function () {
            Promise.all([
                this.__add_build(),
                this.__add_build_name(),
                this.updateVisitEvent(),
                this.setBattleEffect(),
                this.updateFirstWard(),
                this.updateXyComp(),
                this.updateCityLock(),
                this.addSjfhzEffect(),
                this.updateBarAtkState()
            ]);
            this.initEvent();
        };
        /**添加事件 */
        CitySprite.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, this.onUpdateCityTeam, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.onWorldBuildUpdate, this);
        };
        /**移除事件 */
        CitySprite.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_BUILD_UPDATE, this);
        };
        /**更新城池队伍图标 */
        CitySprite.prototype.onUpdateCityTeam = function (cityId) {
            var config = this.m_pBuildConfig;
            var pConf = C.WorldMapConfig[cityId];
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY && pConf && pConf.mapId == SceneEnums.WORLD_CITY)
                cityId = pConf.mapCity;
            if (config.id != cityId)
                return;
            if (isNull(this.m_pBuild_name))
                return;
            this.m_pBuild_name.updateCityTeam(cityId);
        };
        /**更新城池建设状态 */
        CitySprite.prototype.onWorldBuildUpdate = function (cityId) {
            var config = this.m_pBuildConfig;
            var pConf = C.WorldMapConfig[cityId];
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY && pConf && pConf.mapId == SceneEnums.WORLD_CITY)
                cityId = pConf.mapCity;
            if (config.id != cityId)
                return;
            if (isNull(this.m_pBuild_name))
                return;
            this.m_pBuild_name.updateCityBuild(cityId);
        };
        /**添加建筑图片 */
        CitySprite.prototype.__add_build = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, texture;
                var _this = this;
                return __generator(this, function (_a) {
                    config = this.m_pBuildConfig;
                    texture = RES.getRes(this.m_pBuildConfig.icon + "_png");
                    this.m_pBuild = PImage.create(texture);
                    this.width = texture.textureWidth;
                    this.height = texture.textureHeight;
                    this.m_pBuild.width = texture.textureWidth;
                    this.m_pBuild.height = texture.textureHeight;
                    egret.callLater(function () {
                        if (_this.m_pBuild)
                            NodeUtils.addOtherParent(_this.m_pBuild, _this, com_main.WorldView.getCityLayer());
                    }, this);
                    return [2 /*return*/];
                });
            });
        };
        /**添加建筑名字 */
        CitySprite.prototype.__add_build_name = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pInfo, country;
                return __generator(this, function (_a) {
                    if (this.m_pBuildConfig.type !== CityType.EMPEROR_BATTLE) {
                        pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
                    }
                    else {
                        pInfo = WorldModel.getCityBuildInfo(this.m_pBuildConfig.mapCity);
                    }
                    if (!pInfo) {
                        error("CitySprite:_refresh_flag=========\u57CE\u6C60[" + this.m_nIid + "]\u4FE1\u606F\u4E3A\u7A7A");
                        return [2 /*return*/];
                    }
                    country = pInfo.country;
                    this.m_pBuild_name = com_main.WorldCityNameWidget.create();
                    Utils.addChild(this, this.m_pBuild_name);
                    this.m_pBuild_name.x = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY || this.m_pBuildConfig.type == CityType.XIANG_BIRTH ? (this.width - this.m_pBuild_name.width * 1) / 2 : -40;
                    this.m_pBuild_name.y = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY || this.m_pBuildConfig.type == CityType.XIANG_BIRTH ? this.height - this.m_pBuild_name.height * 1 / 2 : 40;
                    this.m_pBuild_name.initData(this.m_pBuildConfig, country, GLan(this.m_pBuildConfig.name));
                    return [2 /*return*/];
                });
            });
        };
        CitySprite.prototype.updateVisitEvent = function () {
            return __awaiter(this, void 0, void 0, function () {
                var event;
                return __generator(this, function (_a) {
                    /**组件未初始化 */
                    if (!this.m_bInit)
                        return [2 /*return*/];
                    event = WorldModel.getVisitEventById(this.m_nIid);
                    if (!event) {
                        this.__remove_visit();
                        return [2 /*return*/];
                    }
                    if (WorldModel.checkIsHasFirstAward(this.m_nIid) || WorldModel.checkIsHasLock(this.m_nIid))
                        return [2 /*return*/];
                    this.__add_visit_event(event);
                    return [2 /*return*/];
                });
            });
        };
        CitySprite.prototype.__add_visit_event = function (event) {
            this.__remove_visit();
            var pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            var cfg = C.VisitConfig[event.visitId];
            if (isNull(cfg))
                return;
            this.visitItem = com_main.GeneralHeadRender.create('none');
            Utils.addChild(this, this.visitItem);
            this.visitItem.setGenId(cfg.icon);
            // item.name = "VisitItem";
            this.visitItem.x = (this.width - this.visitItem.width * .55) / 2;
            this.visitItem.y = -50;
            this.visitItem.scaleX = .55;
            this.visitItem.scaleY = .55;
            this.visitItem.visible = !WorldModel.checkIsHasFirstAward(this.m_nIid) && !WorldModel.checkIsHasLock(this.m_nIid) && pInfo.status !== 1;
        };
        CitySprite.prototype.__remove_visit = function () {
            if (this.visitItem) {
                this.visitItem.onDestroy();
                this.visitItem = null;
            }
        };
        /**添加首战奖励图标 */
        CitySprite.prototype.updateFirstWard = function () {
            return __awaiter(this, void 0, void 0, function () {
                var conf, pInfo, genId;
                return __generator(this, function (_a) {
                    /**组件未初始化 */
                    if (!this.m_bInit)
                        return [2 /*return*/];
                    this.__remove_first_award();
                    conf = WorldModel.getCityConfig(this.m_nIid);
                    pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
                    if (!conf) {
                        error("CityConfig\u57CE\u6C60[" + this.m_nIid + "]\u4FE1\u606F\u4E3A\u7A7A");
                        return [2 /*return*/];
                    }
                    if (pInfo.status == 1)
                        return [2 /*return*/];
                    if (WorldModel.checkIsHasLock(this.m_nIid))
                        return [2 /*return*/];
                    if (WorldModel.checkIsHasFirstAward(this.m_nIid)) {
                        this.m_pFirstAward = com_main.WorldCityFirstAwardComp.create();
                        Utils.addChild(this, this.m_pFirstAward);
                        this.m_pFirstAward.visible = true;
                        this.m_pFirstAward.x = (this.width - this.m_pFirstAward.width * .55) / 2 - 5;
                        this.m_pFirstAward.y = -60;
                        genId = WorldModel.getGenIdByWorldCfg(this.m_pBuildConfig);
                        this.m_pFirstAward.setHero(genId);
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**襄阳城图标 */
        CitySprite.prototype.updateXyComp = function () {
            return __awaiter(this, void 0, void 0, function () {
                var conf, pInfo;
                return __generator(this, function (_a) {
                    /**组件未初始化 */
                    if (!this.m_bInit)
                        return [2 /*return*/];
                    this.__remove_xy_comp();
                    conf = WorldModel.getCityConfig(this.m_nIid);
                    pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
                    if (!conf) {
                        error("CityConfig\u57CE\u6C60[" + this.m_nIid + "]\u4FE1\u606F\u4E3A\u7A7A");
                        return [2 /*return*/];
                    }
                    if (conf.type == CityType.EMPEROR_BATTLE) {
                        this.m_xiangYangComp = com_main.WorldXiangYangComp.create();
                        Utils.addChild(this, this.m_xiangYangComp);
                        this.m_xiangYangComp.x = (this.width - this.m_xiangYangComp.width * .55) / 2 - 10;
                        this.m_xiangYangComp.y = -40;
                    }
                    return [2 /*return*/];
                });
            });
        };
        CitySprite.prototype.__remove_first_award = function () {
            if (this.m_pFirstAward) {
                this.m_pFirstAward.onDestroy();
                this.m_pFirstAward = null;
            }
        };
        CitySprite.prototype.__remove_xy_comp = function () {
            if (this.m_xiangYangComp) {
                this.m_xiangYangComp.onDestroy();
                this.m_xiangYangComp = null;
            }
        };
        /**更新城池解锁图标 */
        CitySprite.prototype.updateCityLock = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pInfo, conf;
                return __generator(this, function (_a) {
                    /**组件未初始化 */
                    if (!this.m_bInit)
                        return [2 /*return*/];
                    this.__remove_city_locked();
                    if (!WorldModel.checkIsHasLock(this.m_nIid))
                        return [2 /*return*/];
                    pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
                    conf = WorldModel.getCityConfig(this.m_nIid);
                    if (!conf) {
                        error("CityConfig\u57CE\u6C60[" + this.m_nIid + "]\u4FE1\u606F\u4E3A\u7A7A");
                        return [2 /*return*/];
                    }
                    if (pInfo.status == 1)
                        return [2 /*return*/];
                    this.m_pCityLock = com_main.WorldCityLockComp.create();
                    Utils.addChild(this, this.m_pCityLock);
                    this.m_pCityLock.visible = true;
                    this.m_pCityLock.x = (this.width - this.m_pCityLock.width * .55) / 2 - 5;
                    this.m_pCityLock.y = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? -60 : -120;
                    return [2 /*return*/];
                });
            });
        };
        CitySprite.prototype.__remove_city_locked = function () {
            if (this.m_pCityLock) {
                this.m_pCityLock.onDestroy();
                this.m_pCityLock = null;
            }
        };
        CitySprite.prototype.__add_battle_event = function () {
            this.m_pBattle = com_main.WorldSiegeTime.create(this.m_nIid);
            this.addChildAt(this.m_pBattle, 4);
            var x = -30;
            if (this.config.icon == "map_build_4") {
                x = -10;
            }
            else if (this.config.icon == "map_build_1") {
                x = 20;
            }
            else if (this.config.icon == "map_build_2") {
                x = 0;
            }
            else if (this.config.icon == "map_build_icon21") {
                x = -80;
            }
            else if (this.config.type == CityType.XIANG_GATE) {
                x = -80;
            }
            else if (this.config.type == CityType.XIANG_HALL) {
                x = -80;
            }
            this.m_pBattle.x = x;
            this.m_pBattle.y = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? -140 : -20;
        };
        CitySprite.prototype.__add_battle_effect = function () {
            if (this.m_pBattleEffect)
                return;
            this.m_pBattleEffect = NormalMcMgr.createMc(IETypes.EWORLD_City_Fire, false);
            if (this.config.icon == "map_build_2" || this.config.icon == "map_build_1") {
                this.m_pBattleEffect.play("zhanhuo" + 1);
            }
            else if (this.config.icon == "map_build_4") {
                this.m_pBattleEffect.play("zhanhuo" + 3);
            }
            else if (this.config.icon == "map_build_icon21") {
                this.m_pBattleEffect.play("zhanhuo" + 2);
            }
            else if (this.config.type == CityType.XIANG_GATE) {
                this.m_pBattleEffect.play("zhanhuo" + 2);
            }
            else if (this.config.type == CityType.XIANG_HALL) {
                this.m_pBattleEffect.play("zhanhuo" + 2);
            }
            var index = SceneManager.getCurrScene() == SceneEnums.WORLD_CITY ? 3 : 0;
            this.addChildAt(this.m_pBattleEffect, index);
            NodeUtils.setPosition(this.m_pBattleEffect, this.width / 2, this.height / 2);
        };
        CitySprite.prototype.setBattleEffect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pInfo;
                return __generator(this, function (_a) {
                    /**组件未初始化 */
                    if (!this.m_bInit)
                        return [2 /*return*/];
                    pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
                    if (!pInfo) {
                        error("CitySprite:__add_battle_effect=========\u57CE\u6C60[" + this.m_nIid + "]\u4FE1\u606F\u4E3A\u7A7A");
                        return [2 /*return*/];
                    }
                    // if (pInfo.atkCountry > 0) {
                    if (pInfo.status == 1) {
                        if (!this.m_pBattleEffect)
                            this.__add_battle_effect();
                    }
                    else {
                        this.__remove_battle_eff();
                    }
                    this.setAttackEvent();
                    return [2 /*return*/];
                });
            });
        };
        CitySprite.prototype.checkTouchEvent = function (x, y) {
            if (this.m_pBattle && this.m_pBattle.checkTouchEvent(x, y))
                return true;
            //选中襄阳城
            if (this.hitTestPoint(x, y)) {
                var id = this.m_pBuildConfig.id;
                //皇城攻击判断
                if (id == 5 || id == 42 || id == 16) {
                    if (TimerUtils.ServerTime - TimerUtils.OpenServerTime < ConstUtil.getValue(IConstEnum.KING_CITY_PROTECT_TIME)) {
                        var m_tAcVo = ActivityModel.getActivityVo(AcViewType.THRONE);
                        if (unNull(m_tAcVo)) {
                            var time = Math.floor((m_tAcVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
                            if (time >= 0) {
                                EffectUtils.showTips(GCodeFromat(CLEnum.WOR_KING_TIPS, Utils.DateUtils.getFormatBySecond(time, 1)), 1, true);
                                return false;
                            }
                        }
                    }
                }
            }
            //黄巾入侵ui
            if (this.m_barAtkAni && this.m_barAtkAni.hitTestPoint(x, y)) {
                var vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
                //活动期间内处理
                var pos = this.localToGlobal(this.m_barAtkAni.x, this.m_barAtkAni.y);
                com_main.WorldView.callFunc(5 /* CREAT_NOR_MENU */, 0, this.m_nIid, pos);
                return true;
            }
            if (this.m_pFirstAward && this.m_pFirstAward.visible && this.m_pFirstAward.hitTestPoint(x, y)) {
                Utils.open_view(TASK_UI.POP_WORLD_FIRST_OCCUPY_PANEL, this.m_nIid);
                return true;
            }
            if (this.m_xiangYangComp && this.m_xiangYangComp.visible && this.m_xiangYangComp.hitTestPoint(x, y)) {
                //判断是否是襄阳
                if (this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE) {
                    this.onTouchXiangyang();
                }
                return true;
            }
            var iconHit = this.visible && this.m_pBuild && this.m_pBuild.hitTestPoint(x, y);
            var pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (pInfo.status != 1 && WorldModel.checkIsHasLock(this.m_nIid) && this.m_pCityLock && this.m_pCityLock.visible) {
                if (iconHit || this.m_pCityLock.hitTestPoint(x, y)) {
                    Utils.open_view(TASK_UI.POP_WORLD_DIALOG_VIEW, { id: pInfo.unlockTaskId, cityId: this.m_nIid, step: WorldLockTaskStep.STATR });
                    /**新手引导点击 */
                    com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                    return true;
                }
            }
            // let item = this.getChildByName("VisitItem")
            if (this.visitItem && this.visitItem.visible && this.visitItem.hitTestPoint(x, y)) {
                Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.m_nIid });
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                return true;
            }
            if (iconHit) {
                //判断是否是襄阳
                if (this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE) {
                    return this.onTouchXiangyang();
                }
                this.onTouchXiangyang();
                this.isGlow(true);
                com_main.WorldView.callFunc(3 /* CREAT_MENU */, this.m_pBuildConfig);
                this.isShowName(false);
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                return true;
            }
            return false;
        };
        /**检查是否是襄阳 */
        CitySprite.prototype.onTouchXiangyang = function () {
            if (this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE) {
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                if (vo) {
                    var curTime = TimerUtils.getServerTimeMill();
                    if (curTime < vo.preViewDate) {
                        AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW();
                    }
                    else if (curTime < vo.closeDate) {
                        WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
                    }
                    else {
                        Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE);
                    }
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.XIANGYANG_TITLE) + GCode(CLEnum.FUNC_UNOPEN));
                }
                return false;
            }
            return false;
        };
        /**
         * 打开菜单界面
         */
        CitySprite.prototype.openMenuPanel = function () {
            this.isGlow(true);
            com_main.WorldView.callFunc(3 /* CREAT_MENU */, this.m_pBuildConfig);
            this.isShowName(false);
        };
        /**是否显示选中效果 */
        CitySprite.prototype.isGlow = function (flag) {
            Utils.isGlow(flag, this.m_pBuild);
        };
        CitySprite.prototype.isShowName = function (val) {
            if (!this.m_pBuild_name)
                return;
            this.m_pBuild_name.visible = val;
        };
        CitySprite.prototype.setAttackEvent = function () {
            var pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (pInfo && pInfo.status == 1) {
                if (!this.m_pBattle)
                    this.__add_battle_event();
            }
            else {
                this.__remove_attack_event();
            }
        };
        CitySprite.prototype.__remove_attack_event = function () {
            if (this.m_pBattle) {
                this.m_pBattle.onDestroy();
                this.m_pBattle = null;
            }
        };
        CitySprite.prototype.__remove_battle_eff = function () {
            // if (this.m_pBattleEffect) {
            //     Utils.removeFromParent(this.m_pBattleEffect);
            //     this.m_pBattleEffect = null;
            // }
            if (this.m_pBattleEffect) {
                NormalMcMgr.removeMc(this.m_pBattleEffect);
                this.m_pBattleEffect = null;
            }
        };
        CitySprite.prototype.updateCity = function () {
            var pInfo = WorldModel.getCityBuildInfo(this.m_nIid);
            if (!pInfo) {
                error("CitySprite:_refresh_flag=========\u57CE\u6C60[" + this.m_nIid + "]\u4FE1\u606F\u4E3A\u7A7A");
                return;
            }
            var country = pInfo.country;
            if (this.m_pBuild_name)
                this.m_pBuild_name.initData(this.m_pBuildConfig, country, GLan(this.m_pBuildConfig.name));
        };
        /** 添加光圈 */
        CitySprite.prototype.addSjfhzEffect = function () {
            /**组件未初始化 */
            if (!this.m_bInit)
                return;
            if (this.m_pSjfhzEffect) {
                return;
            }
            if (this.m_pBuildConfig.id == 32 || this.m_pBuildConfig.type == CityType.EMPEROR_BATTLE || this.m_pBuildConfig.type == CityType.KIING_BATTLE) {
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                if (vo && vo.isOpenIcon() && vo.activited)
                    return;
                this.m_pSjfhzEffect = NormalMcMgr.createMc(IETypes.EUI_Sjfhz);
                // this.m_pSjfhzEffect.initAsync(IETypes.EUI_Sjfhz);
                this.m_pSjfhzEffect.x = this.width / 2;
                this.m_pSjfhzEffect.y = this.height / 2 - 50;
                this.addChild(this.m_pSjfhzEffect);
            }
        };
        /** 移除光圈特效 */
        CitySprite.prototype.removeSjfhzEffect = function () {
            if (!this.m_pSjfhzEffect)
                return;
            NormalMcMgr.removeMc(this.m_pSjfhzEffect);
            this.m_pSjfhzEffect = null;
        };
        CitySprite.prototype.updateBarAtkState = function () {
            return __awaiter(this, void 0, void 0, function () {
                var vo;
                return __generator(this, function (_a) {
                    /**组件未初始化 */
                    if (!this.m_bInit)
                        return [2 /*return*/];
                    vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
                    //活动期间内处理
                    if (vo && vo.isInAttReady()) {
                        if (vo.cityDatas[this.m_nIid]) {
                            this.createBarAtkItem(vo.openDate);
                            return [2 /*return*/];
                        }
                    }
                    this.removeBarAtkItem();
                    return [2 /*return*/];
                });
            });
        };
        /**创建黄巾部队 */
        CitySprite.prototype.createBarAtkItem = function (time) {
            var _this = this;
            if (this.m_barAtkAni)
                return;
            var name = "EWORLD_Monster_3001";
            this.m_barAtkAni = NormalMcMgr.createMc(name);
            this.m_barAtkAni.x = 0; //this.width *0.15;
            this.m_barAtkAni.y = this.height * 0.5;
            this.addChildAt(this.m_barAtkAni, 0);
            this.m_barTips = new eui.Label();
            this.m_barTips.touchEnabled = false;
            this.m_barTips.text = TimerUtils.dateFormat("hh:mm", time / 1000) + '开始攻城';
            this.m_barTips.textColor = GameConfig.TextColors.fontWhite;
            this.m_barTips.size = 22;
            this.m_barTips.stroke = 2;
            this.m_barTips.x = -this.m_barTips.width * 0.5;
            this.m_barTips.y = this.height * 0.5 - 80;
            this.addChild(this.m_barTips);
            egret.callLater(function () {
                if (_this.m_barTips)
                    NodeUtils.addOtherParent(_this.m_barTips, _this, com_main.WorldView.getLaberLayer());
            }, this);
        };
        /**移除黄巾部队*/
        CitySprite.prototype.removeBarAtkItem = function () {
            if (!this.m_barAtkAni)
                return;
            NormalMcMgr.removeMc(this.m_barAtkAni);
            this.m_barAtkAni = null;
            Utils.removeFromParent(this.m_barTips);
            this.m_barTips = null;
        };
        return CitySprite;
    }(com_main.ResSprite));
    com_main.CitySprite = CitySprite;
})(com_main || (com_main = {}));

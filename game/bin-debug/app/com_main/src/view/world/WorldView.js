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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var com_main;
(function (com_main) {
    /**
     * 世界地图
     * @export
     * @class WorldView
     * @extends BaseMap
     */
    var WorldView = /** @class */ (function (_super_1) {
        __extends(WorldView, _super_1);
        function WorldView() {
            var _this = _super_1.call(this) || this;
            _this.m_nBaseId = 43;
            _this.timeoutKey = 0;
            _this.name = WorldView.NAME;
            _this.m_pMapOffset[0] = 0;
            _this.m_pMapOffset[1] = 0;
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_CITY) {
                _this.m_pTileConfig = MapData.getMapWorldConfig();
            }
            else if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                _this.m_pTileConfig = MapData.getMapXiangyangConfig();
            }
            _this.SCALE_MAX = 1;
            _this.SCALE_MIN = 0.6;
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                _this.setIsCanScale(false);
            }
            else {
                _this.setIsCanScale(true);
            }
            return _this;
        }
        WorldView.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.MAP, WorldView.NAME);
            return obj;
        };
        /**文本节点 */
        WorldView.getLaberLayer = function () {
            var obj = this.getClass();
            if (obj)
                return obj.m_pLabLayer;
        };
        /**建筑节点 */
        WorldView.getCityLayer = function () {
            var obj = this.getClass();
            if (obj)
                return obj.m_pCityLayer;
        };
        /**是否移动中 */
        WorldView.isMove = function () {
            var obj = this.getClass();
            if (obj) {
                return obj.isMove();
            }
            return false;
        };
        /**格子对象管理添加 */
        WorldView.addTileObject = function (target) {
            var obj = this.getClass();
            if (obj) {
                obj.addTileObject(target);
            }
        };
        /**格子对象管理移除 */
        WorldView.delTileObject = function (target) {
            var obj = this.getClass();
            if (obj) {
                obj.removeTileObject(target);
            }
        };
        WorldView.process = function (tag) {
            return function (target, propertyKey, descriptor) {
                WorldView.FUNC[tag] = target[propertyKey];
            };
        };
        WorldView.callFunc = function (tag) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var view = WorldView.getClass();
            if (!view)
                return;
            var func = WorldView.FUNC[tag];
            if (!func)
                return;
            return func.apply(view, args);
        };
        /**
         * 删除英雄
         * @private
         * @param  {string} iid
         * @param {boolean} isClient 客户端动画移除
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._remove_hero = function (iid, isClient) {
            if (isClient === void 0) { isClient = true; }
            this.m_pHeroLayer.removeHero(iid);
            if (isClient) {
                WorldModel.sendUpdateTeamData();
            }
        };
        /**创建客户端移动队伍 */
        WorldView.prototype._create_clientMove = function (data) {
            this.__on_move_evt(data);
        };
        WorldView.prototype._on_move_visit = function (start, end) {
            // let hero = this.m_pHeroLayer.createHeroMove(start, end);
            // this.m_pWayLayer.createWay(hero);
        };
        WorldView.prototype._set_cityname_status = function (cid, status) {
            if (status === void 0) { status = true; }
            var city = this.m_pResLayer.getRes(com_main.ResType.CITY, cid);
            if (!city)
                return;
            city.isShowName(status);
        };
        WorldView.prototype._set_army_time_status = function (gid, status) {
            if (status === void 0) { status = true; }
            var hero = this.m_pHeroLayer.getHero(gid);
            if (!hero)
                return;
            hero.isShowTime(status);
        };
        /**
         * 前往资源点
         * @private
         * @param  {number} start 起始
         * @param  {number} end 结束
         * @return ArmySprite
         * @memberof WorldView
         */
        WorldView.prototype._on_move_res = function (start, end, pack, mt, id, dt) {
            ++WorldView.m_nEventId;
            var heroid = 0, fight = 0, batt = 0;
            // for (let gid of pack.gid) {
            //     let hero = FormunitModel.getHero(gid);
            //     if (!hero) continue
            //     if (heroid == 0) {
            //         heroid = hero.gid;
            //         fight = hero.fight;
            //     } else if (hero.fight > fight) {
            //         heroid = hero.gid;
            //     }
            //     batt += hero.armyNum;
            // }
            error("=============batt", batt);
            WorldModel.createEvent({
                id: WorldView.m_nEventId,
                gid: pack.gid,
                from: pack.path.from,
                to: pack.path.to,
                through: [],
                type: pack.path.type,
                status: pack.status,
                dt: 0,
                mt: 1,
                mainGid: heroid,
                batt: batt,
            });
        };
        /**
         * 创建普通菜单
         * @param {number} type 菜单类型 0 黄巾入侵菜单
         */
        WorldView.prototype._create_nor_menu = function (type, id, pos) {
            this._hide_menu();
            pos = this.m_pBg.globalToLocal(pos.x, pos.y, pos);
            switch (type) {
                case 0: {
                    var menu = new com_main.WorldMenuBarAtk(id);
                    menu.x = pos.x;
                    menu.y = pos.y - 300;
                    Utils.addChildAt(this.m_pBg, menu, 99);
                    this.moveTo(pos.x, pos.y - 230, true);
                    this._set_map_bar(false);
                    break;
                }
            }
        };
        /**
         * 创建城市菜单
         * @private
         * @param  {WorldMapConfig} conf 城市配置
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._create_menu = function (conf) {
            this._hide_menu();
            var menu = new com_main.WorldMenuWidget(conf);
            Utils.addChildAt(this.m_pBg, menu, 99);
            var build = this.m_pResLayer.getRes(com_main.ResType.CITY, conf.id);
            var x = conf.posX, y = conf.posY;
            menu.x = x;
            menu.y = y;
            this._move_to(com_main.ResType.CITY, conf.id, true);
            this._set_map_bar(false);
        };
        /**
         * 创建资源菜单
         * @private
         * @param  {number} id 事件id
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._create_res_menu = function (id) {
            this._hide_menu();
            var menu;
            var vo = WorldModel.getEventVoByPosId(id);
            if (!vo)
                return;
            switch (vo.type) {
                case WorldEventType.RES_GATHER: {
                    menu = new com_main.WorldMenuGatherWidget(id);
                    menu.x = vo.pos.x;
                    menu.y = vo.pos.y - 50;
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    menu = new com_main.WorldMenuCollectWidget(id);
                    menu.x = vo.pos.x;
                    menu.y = vo.pos.y - 50;
                    break;
                }
                case WorldEventType.FIGHT: {
                    menu = new com_main.WorldMenuAttackWidget(id);
                    menu.x = vo.pos.x;
                    menu.y = vo.pos.y - 120;
                    break;
                }
            }
            if (!menu)
                return;
            Utils.addChildAt(this.m_pBg, menu, 99);
            /**菜单显示引导条件 */
            menu.onGuideCondition();
            this._move_to(com_main.ResType.RES, id, true);
            this._set_map_bar(false);
        };
        /**
         * 删除菜单
         * @private
         * @param  {number} [x]
         * @param  {number} [y]
         * @return boolean
         * @memberof WorldView
         */
        WorldView.prototype._hide_menu = function (x, y) {
            var menu = this.m_pBg.getChildByName("WorldMenu");
            if (menu) {
                if (x != undefined) {
                    if (menu.hitPoint(x, y))
                        return true;
                }
                menu.removeFromParent();
                this._set_map_bar(true);
            }
            return false;
        };
        /**
         * 移动到位置
         * @private
         * @param  {ResType} ty 类型
         * @param  {number} id
         * @param  {boolean} [isAnim=true]
         * @param  {boolean} [isUI=false]
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._move_to = function (ty, id, isAnim, isUI) {
            var _this = this;
            if (isAnim === void 0) { isAnim = true; }
            if (isUI === void 0) { isUI = false; }
            switch (ty) {
                case com_main.ResType.CITY:
                    this._move_to_build(id, isAnim, isUI);
                    //是否是从搜索界面过来
                    if (WorldModel.isVisvitFromSerarch) {
                        this.timeoutKey = egret.setTimeout(function () {
                            // let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, <number>id);
                            // city.openMenuPanel();
                            Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: id });
                            WorldModel.isVisvitFromSerarch = false;
                            egret.clearTimeout(_this.timeoutKey);
                        }, this, 1500);
                    }
                    break;
                case com_main.ResType.HERO:
                    this._move_to_hero(id, isAnim, isUI);
                    break;
                case com_main.ResType.RES:
                    this._move_to_res(id, isAnim, isUI);
                    break;
                default:
                    this._move_to_point(id, isAnim, isUI);
                    break;
            }
        };
        WorldView.prototype._on_res_event = function (pos) {
            var res = this.m_pResLayer.getRes(com_main.ResType.RES, pos);
            if (!res)
                return;
            res.onEvent();
        };
        WorldView.prototype._create_city_way = function (point, ty) {
            if (ty === void 0) { ty = 0; }
            return this.m_pWayLayer.createCityWay(point, ty);
        };
        WorldView.prototype._create_hero_line_way = function (hero) {
            return this.m_pWayLayer.createWay(hero);
        };
        WorldView.prototype._update_hero_line_way = function (movePoint, temakey) {
            // return this.m_pWayLayer.updateWay(movePoint, temakey);
        };
        WorldView.prototype._remove_city_way = function (iid) {
            if (iid instanceof Array) {
                for (var _i = 0, iid_1 = iid; _i < iid_1.length; _i++) {
                    var id = iid_1[_i];
                    this.m_pWayLayer.removeCityWay(id);
                }
            }
            else
                this.m_pWayLayer.removeCityWay(iid);
        };
        WorldView.prototype._set_range = function () {
            this.m_pCoverLayer.initRange();
        };
        WorldView.prototype._get_hero = function (eid) {
            return this.m_pHeroLayer.getHero(eid);
        };
        WorldView.prototype._get_gather = function (pos) {
            var res = this.m_pResLayer.getRes(com_main.ResType.RES, pos);
            if (!res)
                return;
        };
        WorldView.prototype.init = function () {
            _super_1.prototype.init.call(this);
        };
        WorldView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_TEAMMOVE_LIST,
                ProtoDef.S2C_TEAMMOVE_QUICKEN,
                ProtoDef.S2C_TEAMMOVE_TO,
                ProtoDef.S2C_TEAMMOVE_RETURN,
                ProtoDef.S2C_WORLDMAP_EVENT_ACT,
                ProtoDef.S2C_WORLDMAP_EVENT_OVER,
                ProtoDef.S2C_CITY_UPDATE,
                ProtoDef.S2C_VISIT_EVENT_UPDATE,
                ProtoDef.S2C_CITY_WAR_SETTLEMENT,
                ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN,
                ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER,
                ProtoDef.S2C_GET_MAP_EVENT_DATA,
                ProtoDef.S2C_VISIT_DATA_REFRESH,
                ProtoDef.S2C_VISIT_CD_SPEED,
                ProtoDef.S2C_UNLOCK_CITY,
                ProtoDef.S2C_TEAMMOVE_DEL,
            ];
        };
        WorldView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VISIT_DATA_REFRESH: {
                    var data = body;
                    var city = this.m_pResLayer.getRes(com_main.ResType.CITY, data.visitEventData.cityId);
                    if (!city)
                        return;
                    city.updateVisitEvent();
                    break;
                }
                case ProtoDef.S2C_UNLOCK_CITY: {
                    var data = body;
                    if (data.errorCode != 0) {
                        break;
                    }
                    var city = this.m_pResLayer.getRes(com_main.ResType.CITY, data.cityId);
                    if (!city)
                        return;
                    city.updateVisitEvent();
                    city.updateFirstWard();
                    city.updateCityLock();
                    var cityInfo = WorldModel.getCityBuildInfo(data.cityId);
                    var taskUnlockCfg = C.WorldMapUnlockTaskConfig[cityInfo.unlockTaskId];
                    if (taskUnlockCfg.type == WorldLockTaskType.SOURCE) {
                        Utils.open_view(TASK_UI.POP_WORLD_DIALOG_VIEW, { id: taskUnlockCfg.id, cityId: data.cityId, step: WorldLockTaskStep.FINISH });
                    }
                    else {
                        // WorldModel.unLockCid = data.cityId;
                    }
                    break;
                }
                case ProtoDef.S2C_VISIT_CD_SPEED: {
                    var data = body;
                    var city = this.m_pResLayer.getRes(com_main.ResType.CITY, data.visitEventData.cityId);
                    if (!city)
                        return;
                    city.updateVisitEvent();
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_QUICKEN: {
                    var data = body;
                    this.__on_move(data.teamMoveDataResp);
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_TO: {
                    var data = body;
                    for (var i = 0; i < data.teamMoveDataResp.length; i++) {
                        this.__on_move(data.teamMoveDataResp[i]);
                    }
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_RETURN: {
                    var data = body;
                    this.__on_move(data.teamMoveDataResp, true);
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_DEL: { //队伍移除
                    var data = body;
                    var key = data.playerId + "_" + data.teamId;
                    this._remove_hero(key, false);
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN: { //采集加速
                    var data = body;
                    if (data.state == 0) {
                        this.__update_evt_res(data.mapEventData.eventCoordinatesId);
                    }
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_ACT: { //队伍操作
                    var data = body;
                    if (data.state == 0) {
                        this.__update_evt_res(data.mapEventData.eventCoordinatesId);
                    }
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_OVER: { //事件移除
                    var data = body;
                    var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, data.teamId);
                    var eventVo = WorldModel.getWorldEvent(data.eventCoordinatesId);
                    if (!eventVo) {
                        return;
                    }
                    WorldModel.createClientMove(data.teamId, data.eventCoordinatesId, true);
                    if (eventVo.type == WorldEventType.RES_GATHER && WorldModel.isInSearchPanel) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_EVT_FINS));
                    }
                    if (eventVo.type == WorldEventType.FIGHT)
                        return;
                    this.__remove_evt_res(data.eventCoordinatesId);
                    WorldModel.endWorldEvent(data);
                    WorldModel.addFinishWorldEvent(data.eventCoordinatesId);
                    break;
                }
                case ProtoDef.S2C_CITY_UPDATE: {
                    var data = body;
                    var atk = [];
                    for (var _i = 0, _a = data.cityInfo; _i < _a.length; _i++) {
                        var cityInfo = _a[_i];
                        var cityInfoData = cityInfo;
                        var city = this.m_pResLayer.getRes(com_main.ResType.CITY, cityInfoData.id);
                        if (isNull(city))
                            continue;
                        if (cityInfoData.status == 1) { //战斗中
                            atk.push(cityInfoData.id);
                        }
                        else {
                            city.setBattleEffect();
                        }
                        city.updateFirstWard();
                        city.updateCityLock();
                        city.updateVisitEvent();
                        city.updateCity();
                    }
                    if (data.cityInfo)
                        this.m_pCoverLayer.initRange();
                    this.m_pResLayer.initAttack(atk);
                    break;
                }
                case ProtoDef.S2C_CITY_WAR_SETTLEMENT: {
                    var data = body;
                    var city = this.m_pResLayer.getRes(com_main.ResType.CITY, data.cityId);
                    if (!city)
                        return;
                    city.updateVisitEvent();
                    city.updateFirstWard();
                    city.setBattleEffect();
                    city.updateCityLock();
                    city.updateCity();
                    break;
                }
                case ProtoDef.S2C_VISIT_EVENT_UPDATE: {
                    var data = body;
                    if (data.state == 1) {
                        var city = this.m_pResLayer.getRes(com_main.ResType.CITY, data.visitEventData.cityId);
                        if (!city)
                            return;
                        city.updateVisitEvent();
                        city.updateFirstWard();
                        city.updateCityLock();
                    }
                    break;
                }
                case ProtoDef.S2C_CITY_WAR_SINGLE_OVER: {
                    var data = body;
                    var city = this.m_pResLayer.getRes(com_main.ResType.CITY, data.cityId);
                    if (!city)
                        return;
                    city.updateVisitEvent();
                    city.updateFirstWard();
                    city.updateCityLock();
                    city.setBattleEffect();
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
                    var data = body;
                    WorldModel.createClientMove(data.teamId, data.eventCoordinatesId, true);
                    this.__remove_evt_res(data.eventCoordinatesId, data.isVictory);
                    if (!data.isVictory) {
                        WorldModel.resetWorldEvent(data.mapEventData);
                    }
                    else {
                        WorldModel.clearWorldEvent(data.eventCoordinatesId);
                    }
                    WorldModel.addFinishWorldEvent(data.eventCoordinatesId);
                    break;
                }
                case ProtoDef.S2C_GET_MAP_EVENT_DATA: {
                    var data = body;
                    this.m_pResLayer.updateRefreshRes(data);
                    break;
                }
            }
        };
        WorldView.prototype.onEnter = function () {
            _super_1.prototype.onEnter.call(this);
            //迷雾
            WorldTmxData.init();
            // this.m_pIsForcedMove = false;
            //创建层级
            this.m_pWayLayer = new com_main.WayLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pWayLayer, 1);
            this.m_pCityLayer = this.createEmptyLayer('CityLayer');
            Utils.addChildAt(this.m_pBg, this.m_pCityLayer, 2);
            this.m_pResLayer = new com_main.ResLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pResLayer, 3);
            this.m_pLabLayer = this.createEmptyLayer('LabLayer');
            Utils.addChildAt(this.m_pBg, this.m_pLabLayer, 4);
            this.m_pCoverLayer = new com_main.CoverLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pCoverLayer, 5);
            this.m_pHeroLayer = new com_main.HeroLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pHeroLayer, 6);
            this.m_imgMenuMask = new eui.Image('world_mask_png');
            this.m_imgMenuMask.width = GameConfig.curWidth();
            this.m_imgMenuMask.height = GameConfig.curHeight();
            this.m_imgMenuMask.touchEnabled = false;
            this.m_imgMenuMask.visible = false;
            SceneManager.addChild(LayerEnums.MENU, this.m_imgMenuMask);
            Promise.all([
                this.__add_cloud(),
                this.__add_builds(),
                this.m_pResLayer.initRes(null),
                this.m_pCoverLayer.initRange(),
                this.__init_hero_event(),
            ]);
            //场景初始化参数
            var param = WorldModel.getWordlParam();
            if (param) {
                this.handlerMapData(param);
                WorldModel.resetWorldParam();
            }
            SceneManager.sceneCreateComplete();
            var cityId = WorldModel.m_pInitMoveId == 0 ? WorldModel.capitalId : WorldModel.m_pInitMoveId;
            WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, cityId, false);
            if (WorldModel.isUnlockFightFinish) {
                Utils.open_view(TASK_UI.POP_WORLD_DIALOG_VIEW, { id: WorldModel.unLockTaskId, cityId: WorldModel.unLockCid, step: WorldLockTaskStep.FINISH });
                WorldModel.isUnlockFightFinish = false;
            }
            /**
             * 添加扫描公告的定时器
             *
             */
            Utils.TimerManager.doTimer(2000, 0, this.scanWarnNotice, this);
            /**
             * 定时扫描完成的时间点。10s一个周期
             */
            Utils.TimerManager.doTimer(10000, 0, this.updateFinishRes, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_RES_UPDATE, this.updateResShow, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_TROOP, this.onCityTroop, this);
            this.onGuideCondition();
        };
        /**
         * 扫描警报通知
         */
        WorldView.prototype.scanWarnNotice = function () {
            if (!WorldModel.isNoticeComplete)
                return;
            if (WorldModel.getWarnNotices().length == 0)
                return;
            this.playWarnNotice(WorldModel.getWarnNotices().pop());
        };
        /**
         * 扫描完成的事件点
         */
        WorldView.prototype.updateFinishRes = function () {
            for (var coorid in WorldModel.m_pResRefEventMap) {
                WorldModel.m_pResRefEventMap[coorid].totalTime += 10;
                if (WorldModel.m_pResRefEventMap[coorid].totalTime >= WorldModel.m_pResRefEventMap[coorid].confTime) {
                    //发送刷新协议
                    WorldProxy.C2S_GET_MAP_EVENT_DATA(Number(coorid));
                }
            }
        };
        /**
         * 播放警报
         */
        WorldView.prototype.playWarnNotice = function (warn) {
            var noticeStr = null;
            // const event = WorldModel.getWarn(warn.cityId)
            var config = C.WarningConfig[warn.pid];
            switch (warn.pid) {
                case 3 /* ATTACKING */:
                    noticeStr = WorldModel.__check_args.apply(WorldModel, [3 /* ATTACKING */, GLan(config.content)].concat(warn.content));
                    break;
                case 4 /* ATTACKING_ENEMY */:
                    noticeStr = WorldModel.__check_args.apply(WorldModel, [4 /* ATTACKING_ENEMY */, GLan(config.content)].concat(warn.content));
                    break;
                case 1 /* ATTACK */:
                    noticeStr = WorldModel.__check_args.apply(WorldModel, [1 /* ATTACK */, GLan(config.content)].concat(warn.content));
                    break;
                case 2 /* ATTACK_ENEMY */:
                    noticeStr = WorldModel.__check_args.apply(WorldModel, [2 /* ATTACK_ENEMY */, GLan(config.content)].concat(warn.content));
                    break;
            }
            EffectUtils.showTips(noticeStr, 6);
        };
        WorldView.prototype.onDestroy = function () {
            //恢复ui显示
            this._reset_map_bar(SceneManager.getClass(LayerEnums.MENU, com_main.MainTopOther.NAME));
            this._reset_map_bar(SceneManager.getClass(LayerEnums.MENU, com_main.MainTopBar.NAME));
            egret.Tween.removeTweens(this.m_pCloud1);
            this.m_pCloud1 = null;
            egret.Tween.removeTweens(this.m_pCloud2);
            this.m_pCloud2 = null;
            if (this.m_imgMenuMask) {
                Utils.removeFromParent(this.m_imgMenuMask);
                this.m_imgMenuMask = null;
            }
            this.m_pWayLayer.onDestroy();
            this.m_pHeroLayer.onDestroy();
            this.m_pResLayer.onDestroy();
            this.m_pCoverLayer.onDestroy();
            Utils.TimerManager.remove(this.scanWarnNotice, this);
            Utils.TimerManager.remove(this.updateFinishRes, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_RES_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_TROOP, this);
            /**清理资源 */
            // SceneResGroupCfg.clearModelRes([ModuleEnums.WORLD_CITY]);
            ObjectPool.clearClass("WorldCityLockComp");
            ObjectPool.clearClass("WorldCityFirstAwardComp");
            ObjectPool.clearClass("WorldCityNameWidget");
            ObjectPool.clearClass("WorldSiegeTime");
            _super_1.prototype.onDestroy.call(this);
        };
        WorldView.prototype.onEnterFrame = function (delta) {
            _super_1.prototype.onEnterFrame.call(this, delta);
        };
        WorldView.prototype.resize = function () {
        };
        /**
         * 添加测试路径
         * @returns void
         */
        WorldView.prototype.__add_test_ways = function () {
            for (var key in C.WorldWayConfig) {
                var data = C.WorldWayConfig[key];
                if (data != null && data != undefined) {
                    var points = JSON.parse(data.way);
                    this._create_city_way(points);
                }
            }
        };
        /**
         * 添加建筑
         * @returns void
         */
        WorldView.prototype.__add_builds = function () {
            this.m_pResLayer.initBuilds();
            com_main.DjikstraGraph.Instance.initGraph();
            // this.sortBuilds();
        };
        /**
         * 添加云
         * @returns void
         */
        WorldView.prototype.__add_cloud = function () {
            this.m_pCloud1 = new egret.Bitmap(RES.getRes('map_cloud_2_png'));
            this.m_pCloud2 = new egret.Bitmap(RES.getRes('map_cloud_2_png'));
            this.m_pCloud1.scaleX = this.m_pCloud1.scaleY = 2.5;
            this.m_pCloud2.scaleX = this.m_pCloud2.scaleY = 2.5;
            var bg = this.m_pBg;
            var cloud1 = this.m_pCloud1;
            var cloud2 = this.m_pCloud2;
            bg.addChild(cloud1);
            bg.addChild(cloud2);
            cloud1.x = -cloud1.width;
            cloud1.y = Utils.random(100, bg.height / 2);
            cloud2.x = -cloud2.width;
            cloud2.y = Utils.random(bg.height / 2 + 100, bg.height - cloud2.height);
            egret.Tween.get(cloud1, { loop: true }).to({ x: bg.width }, 240000).wait(100).call(function () {
                cloud1.x = -cloud1.width;
                cloud1.y = Utils.random(100, bg.height / 2);
            }, this).wait(Utils.random(500, 3000));
            egret.Tween.get(cloud2, { loop: true }).wait(Utils.random(5000, 10000)).to({ x: bg.width }, 240000).wait(100).call(function () {
                cloud2.x = -cloud2.width;
                cloud2.y = Utils.random(bg.height / 2 + 100, bg.height - cloud2.height);
            }, this).wait(Utils.random(500, 3000));
        };
        /**
         * 初始化行军事件
         * @private
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype.__init_hero_event = function () {
            for (var key in WorldModel.moveList) {
                var data = WorldModel.moveList[key];
                this.__on_move(data);
            }
            /**客户端模拟移动 */
            for (var key in WorldModel.clientMoveList) {
                var data = WorldModel.clientMoveList[key];
                this.__on_move_evt(data);
            }
        };
        // /**
        //  * 更新城池头像
        //  */
        // private updateCityHero() {
        //     let selfCityList: gameProto.ICityInfo[] = WorldModel.getSelfCity();
        //     for (let index = 0; index < selfCityList.length; index++) {
        //         let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, selfCityList[index].id);
        //         if (!city) return;
        //         city.updateHeroNum(TeamModel.getTeamVoListByCityId(selfCityList[index].id).length)
        //     }
        // }
        WorldView.prototype.__on_move = function (data, isReturn) {
            if (isReturn === void 0) { isReturn = false; }
            var key = WorldModel.getTeamMoveKey(data);
            var hero = this.m_pHeroLayer.getHero(key);
            if (!hero) {
                if (data.endTime > TimerUtils.getServerTime()) {
                    hero = this.m_pHeroLayer.createHero(data);
                }
            }
            else {
                if (isReturn) {
                    hero.onHalfWayBack(data);
                }
                else {
                    hero.onAccelerate();
                }
            }
        };
        /**创建客户端移动队伍 */
        WorldView.prototype.__on_move_evt = function (data) {
            if (!data)
                return;
            if (data.endTime <= TimerUtils.getServerTime()) {
                return;
            }
            var key = 'client_' + data.teamId;
            var hero = this.m_pHeroLayer.getHero(key);
            if (!hero) {
                hero = this.m_pHeroLayer.createHeroMoveEvt(data);
            }
        };
        /**移除资源 */
        WorldView.prototype.__remove_evt_res = function (evtPosId, isVistory) {
            if (isVistory === void 0) { isVistory = true; }
            this.m_pResLayer.removeEvtRes(evtPosId, isVistory);
            if (isVistory)
                this._hide_menu();
        };
        /**更新资源 */
        WorldView.prototype.__update_evt_res = function (evtPosId) {
            this.m_pResLayer.updateEvtRes(evtPosId);
        };
        WorldView.prototype.onTouchBegan = function (e) {
            // EventMgr.dispatchEvent(TaskWorldEvent.QUEUE_HIDE_OPERATE, null);
            _super_1.prototype.onTouchBegan.call(this, e);
        };
        WorldView.prototype.onTouchMoved = function (e) {
            _super_1.prototype.onTouchMoved.call(this, e);
        };
        WorldView.prototype.onTouchEnd = function (e) {
            if (this.m_pIsMove) {
                _super_1.prototype.onTouchEnd.call(this, e);
                return;
            }
            var res = WorldView.callFunc(6 /* HIDE_MENU */, e.stageX, e.stageY);
            if (!res)
                res = this.m_pHeroLayer.onTouch(e);
            if (!res)
                res = this.m_pResLayer.onTouch(e);
            _super_1.prototype.onTouchEnd.call(this, e);
        };
        /**
         * 用户点击界面
         * @param  {egret.TouchEvent} e
         * @return boolean
         * @memberof WorldView
         */
        WorldView.prototype.onTouch = function (e) {
            // MapEventConfirm.remove();
            if (com_main.UpManager.CurrentPanel != null) {
                error('有面板打开，事件穿透到地图了。已拦截。');
                return true;
            }
            return false;
        };
        /**
        * 移动地图
        */
        WorldView.prototype.mapMovePosition = function (pos) {
            var point = this.getMapMovePosition(pos);
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_MOVE, point);
            _super_1.prototype.mapMovePosition.call(this, pos);
            egret.Point.release(point);
        };
        /**
         * 移动
         * @private
         * @param  {egret.DisplayObject} obj
         * @param  {boolean} [isAnim=true]
         * @param  {boolean} [isUI=false]
         * @param  {number} [offsetX=0]
         * @param  {number} [offsetY=0]
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype.__move_to_all = function (obj, isAnim, isUI, offsetX, offsetY) {
            if (isAnim === void 0) { isAnim = true; }
            if (isUI === void 0) { isUI = false; }
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (!obj)
                return;
            var _y = obj.y + obj.height / 2;
            if (isUI)
                _y = _y + obj.height * 2;
            this.moveTo(obj.x + obj.width / 2 + offsetX, _y + offsetY, isAnim);
        };
        /**
         * 视角移动到城池那里
         * @protected
         * @param  {number} id
         * @param  {boolean} [isAnim=true]
         * @param  {boolean} [isUI=false]
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._move_to_build = function (id, isAnim, isUI) {
            if (isAnim === void 0) { isAnim = true; }
            if (isUI === void 0) { isUI = false; }
            var build = this.m_pResLayer.getRes(com_main.ResType.CITY, id);
            if (isNull(build))
                return;
            // console.log("id====" + build.config.id)
            this.__move_to_all(build, isAnim, isUI, -build.width * 0.5, -build.height * 0.5);
        };
        /**
         * 视角移动到英雄那里
         * @protected
         * @param  {number} id
         * @param  {boolean} [isAnim=true]
         * @param  {boolean} [isUI=false]
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._move_to_hero = function (id, isAnim, isUI) {
            if (isAnim === void 0) { isAnim = true; }
            if (isUI === void 0) { isUI = false; }
            var hero = this.m_pHeroLayer.getHero(id);
            this.__move_to_all(hero, isAnim, isUI);
        };
        /**
         * 视角移动到资源点那里
         * @protected
         * @param  {number} id
         * @param  {boolean} [isAnim=true]
         * @param  {boolean} [isUI=false]
         * @return void
         * @memberof WorldView
         */
        WorldView.prototype._move_to_res = function (id, isAnim, isUI) {
            if (isAnim === void 0) { isAnim = true; }
            if (isUI === void 0) { isUI = false; }
            var res = this.m_pResLayer.getRes(com_main.ResType.RES, id);
            var y = res.type == WorldEventType.FIGHT ? -100 : -90;
            //
            this.moveTo(res.x, res.y + y, isAnim);
            // this.__move_to_all(res, isAnim, isUI, 0, y);
        };
        WorldView.prototype._move_to_point = function (pos, isAnim, isUI) {
            if (isAnim === void 0) { isAnim = true; }
            if (isUI === void 0) { isUI = false; }
            var x = pos[0], y = pos[1];
            var point = this.m_pBg.globalToLocal(x, y);
            this.moveTo(point.x, point.y, isAnim);
        };
        /**
         * 显示/隐藏界面菜单
         */
        WorldView.prototype._set_map_bar = function (val) {
            if (val)
                this.m_pResLayer.clearSelected();
            var otherBar = SceneManager.getClass(LayerEnums.MENU, com_main.MainTopOther.NAME);
            var worldBar = SceneManager.getClass(LayerEnums.MENU, com_main.MainWorldBar.NAME);
            var topBar = SceneManager.getClass(LayerEnums.MENU, com_main.MainTopBar.NAME);
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_CITY) {
                this._do_bar_action(topBar, val);
            }
            this._do_bar_action(otherBar, val);
            this._do_bar_action(worldBar, val);
            this.m_imgMenuMask.visible = !val;
        };
        /**重置操作栏 */
        WorldView.prototype._reset_map_bar = function (obj) {
            if (!obj)
                return;
            egret.Tween.removeTweens(obj);
            obj.visible = true;
            obj.alpha = 1;
        };
        WorldView.prototype._do_bar_action = function (obj, isShow) {
            if (!obj)
                return;
            egret.Tween.removeTweens(obj);
            var tw = egret.Tween.get(obj);
            if (isShow) {
                obj.visible = true;
                tw.to({ alpha: 1 }, 400);
            }
            else {
                tw.to({ alpha: 0 }, 400);
                tw.call(function () {
                    obj.visible = false;
                }, this);
            }
        };
        WorldView.prototype.getPosData = function (x, y) {
            if (!this.m_pTileConfig)
                return;
            var _x = Math.ceil(x / this.m_pTileConfig.w);
            var _y = Math.ceil(y / this.m_pTileConfig.h);
            var index = ((_y - 1) * this.m_pTileConfig.col + _x);
            return [index, _x, _y];
        };
        WorldView.prototype.removeTileObject = function (obj) {
            var pos_data = this.getPosData(obj.x, obj.y);
            if (!pos_data)
                return;
            var index = pos_data[0];
            var arr = this.m_pTileObjects[index];
            if (!arr)
                return;
            var indx = -1, i = 0;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var o = arr_1[_i];
                if (o == obj)
                    indx = i;
                i++;
            }
            if (indx != -1) {
                arr.splice(indx, 1);
            }
        };
        /**获得弹出菜单 */
        WorldView.prototype.getWorldMenu = function () {
            return this.m_pBg.getChildByName("WorldMenu");
        };
        /**=====================================================================================
 * 事件监听 begin
 * =====================================================================================
 */
        /////////////////////////////////////////////////////////////////自定义事件
        WorldView.prototype.listNotificationInterests = function () {
            return [TASK_UI.MAP_WORLD_MOVE];
        };
        WorldView.prototype.handleNotification = function (notification) {
            var body = notification.getBody();
            var name = notification.getName();
            debug("BaseMap:handleNotification--->>", name, body);
            switch (name) {
                case TASK_UI.MAP_WORLD_MOVE: {
                    this.handlerMapData(body);
                    break;
                }
            }
        };
        /**解析大地图移动 */
        WorldView.prototype.handlerMapData = function (data) {
            if (!data)
                return;
            var target = null;
            switch (data.type) {
                case TurnType.WORLD_EVT: { //任意事件
                    var visits = WorldModel.getCanVisitEventList();
                    target = this.m_pResLayer.getRes(com_main.ResType.CITY, visits[0].cityId);
                    if (target) {
                        target = target['visitItem'];
                        this._move_to_build(visits[0].cityId);
                    }
                    break;
                }
                case TurnType.WORLD_LOCKED: { //未解锁城池
                    var cityId = WorldModel.getLockedCityId();
                    // 排除0  襄阳战城池
                    var ids = [0, 101, 102, 103, 104, 105, 106, 107, 108];
                    var isOut = ids.indexOf(cityId) > -1;
                    if (isOut) {
                        cityId = WorldModel.getNearestCanAttackCity();
                        isOut = ids.indexOf(cityId) > -1;
                        if (isOut) {
                            EffectUtils.showTips(GCode(CLEnum.WOR_LOCK_FIND_FAL));
                        }
                        else {
                            target = this.m_pResLayer.getRes(com_main.ResType.CITY, cityId);
                            if (target)
                                this._move_to_build(cityId);
                        }
                    }
                    else {
                        target = this.m_pResLayer.getRes(com_main.ResType.CITY, cityId);
                        if (target)
                            this._move_to_build(cityId);
                    }
                    break;
                }
                case TurnType.WORLD_RES: { //资源收集
                    target = this.moveToTaskRes(WorldEventType.RES_COLLECT);
                    break;
                }
                case TurnType.WORLD_COL_RES: { //资源采集
                    target = this.moveToTaskRes(WorldEventType.RES_GATHER, data.param);
                    break;
                }
                case TurnType.WORLD_MONSTER: { //怪物
                    target = this.moveToTaskRes(WorldEventType.FIGHT, data.param);
                    break;
                }
                case TurnType.WORLD_CITY: { //城池
                    target = this.m_pResLayer.getRes(com_main.ResType.CITY, data.param);
                    if (target)
                        this._move_to_build(data.param);
                }
            }
            // if (!target) EffectUtils.showTips('当前地图块不存在目标资源!');
            if (target && data.tips != '') {
                Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, { target: target });
            }
        };
        /**世界任务跳转资源 */
        WorldView.prototype.moveToTaskRes = function (type, param) {
            var evt = WorldModel.getEventVosByType(type, param);
            //剿匪等级排序
            if (type == WorldEventType.FIGHT)
                evt.sort(this.sortByLv);
            if (evt.length > 0) {
                var target = null;
                var res = this.m_pResLayer.getRes(com_main.ResType.RES, evt[0].eventCoordinatesId);
                if (res) {
                    target = res['m_pRes'];
                    this._move_to_res(evt[0].eventCoordinatesId);
                }
                return target;
            }
        };
        WorldView.prototype.sortByLv = function (p1, p2) {
            return (p1.dataCfg ? p1.dataCfg.lv : 1) - (p2.dataCfg ? p2.dataCfg.lv : 1);
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /*移动到新手资源 */
        WorldView.prototype.moveGuideRes = function () {
            var ids = WorldModel.eventList;
            for (var k in WorldModel.eventList) {
                var vo = WorldModel.eventList[k];
                if (vo.cityId == WorldModel.capitalId && vo.type == WorldEventType.RES_COLLECT) {
                    this._move_to_res(vo.eventCoordinatesId);
                }
            }
        };
        /*移动到新手资源 */
        WorldView.prototype.moveGuideCity = function () {
            this._move_to_build(WorldModel.capitalId);
        };
        /**获得主城资源(0 为出生城池) */
        WorldView.prototype.getGuideCity = function (cityId) {
            return this.m_pResLayer.getRes(com_main.ResType.CITY, cityId || WorldModel.capitalId);
        };
        /**获得一个未解锁城池 */
        WorldView.prototype.moveGuideLockedCity = function () {
            var id = WorldModel.getLockedCityId();
            if (id == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_LOCK_FIND_FAL));
                return;
            }
            this._move_to_build(WorldModel.getLockedCityId());
        };
        /**获得第一个未解锁城池 */
        WorldView.prototype.getGuideLockCity = function () {
            return this.m_pResLayer.getRes(com_main.ResType.CITY, WorldModel.getLockedCityId());
        };
        /**驻军数据 */
        WorldView.prototype.onCityTroop = function (res) {
            Utils.open_view(TASK_UI.POP_WORLD_CITY_TROOP_PANEL, res);
        };
        /**更新资源显示，播放特效 */
        WorldView.prototype.updateResShow = function (cityId) {
            var eventIds = WorldModel.m_pCityEventList[cityId];
            if (isNull(eventIds))
                return;
            for (var index = 0; index < eventIds.length; index++) {
                var res = this.m_pResLayer.getRes(com_main.ResType.RES, eventIds[index]);
                res.playeffect(true);
            }
        };
        /**获得主城第一个采集资源 */
        WorldView.prototype.getGuideRes = function () {
            var ids = WorldModel.eventList;
            for (var k in WorldModel.eventList) {
                var vo = WorldModel.eventList[k];
                if (vo.cityId == WorldModel.capitalId && vo.type == WorldEventType.RES_COLLECT) {
                    var res = this.m_pResLayer.getRes(com_main.ResType.RES, vo.eventCoordinatesId);
                    return res['m_pRes'];
                }
            }
        };
        /**检查新手引导面板条件 */
        WorldView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_RESOURCE);
        };
        WorldView.NAME = "WorldView";
        WorldView.FUNC = {};
        WorldView.m_nEventId = 0;
        __decorate([
            WorldView.process(0 /* END_HERO_MOVE */)
        ], WorldView.prototype, "_remove_hero", null);
        __decorate([
            WorldView.process(19 /* CREATE_CLIENT_MOVE */)
        ], WorldView.prototype, "_create_clientMove", null);
        __decorate([
            WorldView.process(1 /* ON_MOVE_VISIT */)
        ], WorldView.prototype, "_on_move_visit", null);
        __decorate([
            WorldView.process(9 /* SET_CITYNAME_STATUS */)
        ], WorldView.prototype, "_set_cityname_status", null);
        __decorate([
            WorldView.process(13 /* SET_ARMY_TIME_STATUS */)
        ], WorldView.prototype, "_set_army_time_status", null);
        __decorate([
            WorldView.process(2 /* ON_MOVE_RES */)
        ], WorldView.prototype, "_on_move_res", null);
        __decorate([
            WorldView.process(5 /* CREAT_NOR_MENU */)
        ], WorldView.prototype, "_create_nor_menu", null);
        __decorate([
            WorldView.process(3 /* CREAT_MENU */)
        ], WorldView.prototype, "_create_menu", null);
        __decorate([
            WorldView.process(4 /* CREAT_RES_MENU */)
        ], WorldView.prototype, "_create_res_menu", null);
        __decorate([
            WorldView.process(6 /* HIDE_MENU */)
        ], WorldView.prototype, "_hide_menu", null);
        __decorate([
            WorldView.process(7 /* MOVE_TO */)
        ], WorldView.prototype, "_move_to", null);
        __decorate([
            WorldView.process(8 /* ON_RES_EVENT */)
        ], WorldView.prototype, "_on_res_event", null);
        __decorate([
            WorldView.process(10 /* CREATE_CITY_WAY */)
        ], WorldView.prototype, "_create_city_way", null);
        __decorate([
            WorldView.process(17 /* CREATE_HERO_LINE_WAY */)
        ], WorldView.prototype, "_create_hero_line_way", null);
        __decorate([
            WorldView.process(18 /* UPDATE_HERO_LINE_WAY */)
        ], WorldView.prototype, "_update_hero_line_way", null);
        __decorate([
            WorldView.process(11 /* REMOVE_CITY_WAY */)
        ], WorldView.prototype, "_remove_city_way", null);
        __decorate([
            WorldView.process(14 /* SET_RANGE */)
        ], WorldView.prototype, "_set_range", null);
        __decorate([
            WorldView.process(15 /* GET_HERO */)
        ], WorldView.prototype, "_get_hero", null);
        __decorate([
            WorldView.process(16 /* GET_GATHER */)
        ], WorldView.prototype, "_get_gather", null);
        return WorldView;
    }(com_main.BaseMap));
    com_main.WorldView = WorldView;
})(com_main || (com_main = {}));

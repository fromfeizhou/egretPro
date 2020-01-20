module com_main {
    /**主城地图 传入参数结构 */
    export interface IWorldMapData {
        type?: TurnType; //跳转类型
        param?: number;   //跳转参数
        tips?: string;      //跳转提示(配置表字段)
    }

    export const enum WORLD_FUNC {
        END_HERO_MOVE,
        /**移动拜访 */
        ON_MOVE_VISIT,
        /**移动资源 */
        ON_MOVE_RES,
        /**创建菜单 */
        CREAT_MENU,
        /**创建资源菜单 */
        CREAT_RES_MENU,
        /**创建普通菜单 */
        CREAT_NOR_MENU,
        /**隐藏菜单 */
        HIDE_MENU,
        /**移动到城池 */
        MOVE_TO,
        /**半路返回 */
        // ON_HALF_WAY,
        /**资源事件 */
        ON_RES_EVENT,
        /**显示城池名字 */
        SET_CITYNAME_STATUS,
        /**城池间线路 */
        CREATE_CITY_WAY,
        /**删除城池间线路 */
        REMOVE_CITY_WAY,
        /**资源战斗效果 */
        CREATE_RES_BATTLE,
        /**显示部队时间 */
        SET_ARMY_TIME_STATUS,
        /**迷雾 */
        SET_RANGE,
        /**获得行军英雄　 */
        GET_HERO,
        /**领取采集 */
        GET_GATHER,

        /**英雄和目的地的直线行走路线 */
        CREATE_HERO_LINE_WAY,
        /**更新线路 */
        UPDATE_HERO_LINE_WAY,
        /**创建客户端移动队伍 */
        CREATE_CLIENT_MOVE,
    }

    /**
     * 世界地图
     * @export
     * @class WorldView
     * @extends BaseMap
     */
    export class WorldView extends BaseMap {

        public static NAME = "WorldView";
        private static FUNC: { [k: number]: Function } = {};
        private static m_nEventId: number = 0;

        /**建筑 */
        private m_pCityLayer: egret.DisplayObjectContainer;
        private m_pLabLayer: egret.DisplayObjectContainer;
        /**资源层 */
        private m_pResLayer: ResLayer;
        /**行走层 */
        private m_pWayLayer: WayLayer;
        /**英雄层 */
        private m_pHeroLayer: HeroLayer;
        /**遮盖层 */
        private m_pCoverLayer: CoverLayer;

        private m_pCloud1: egret.Bitmap;
        private m_pCloud2: egret.Bitmap;
        private m_imgMenuMask: eui.Image;
        private m_nBaseId = 43;
        private timeoutKey: number = 0;

        public static getClass(): WorldView {
            let obj = SceneManager.getClass(LayerEnums.MAP, WorldView.NAME);
            return obj;
        }

        /**文本节点 */
        public static getLaberLayer() {
            let obj = this.getClass();
            if (obj) return obj.m_pLabLayer;
        }

        /**建筑节点 */
        public static getCityLayer() {
            let obj = this.getClass();
            if (obj) return obj.m_pCityLayer;
        }

        /**是否移动中 */
        public static isMove() {
            let obj = this.getClass();
            if (obj) {
                return obj.isMove();
            }
            return false;
        }
        /**格子对象管理添加 */
        public static addTileObject(target: any) {
            let obj = this.getClass();
            if (obj) {
                obj.addTileObject(target)
            }
        }
        /**格子对象管理移除 */
        public static delTileObject(target: any) {
            let obj = this.getClass();
            if (obj) {
                obj.removeTileObject(target)
            }
        }

        public static process(tag: WORLD_FUNC): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
            return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
                WorldView.FUNC[tag] = target[propertyKey];
            }
        }

        public static callFunc(tag: WORLD_FUNC, ...args): any {
            let view = WorldView.getClass();
            if (!view) return;
            let func = WorldView.FUNC[tag];
            if (!func) return;
            return func.apply(view, args);
        }

        /**
         * 删除英雄
         * @private
         * @param  {string} iid 
         * @param {boolean} isClient 客户端动画移除
         * @return void
         * @memberof WorldView
         */
        @WorldView.process(WORLD_FUNC.END_HERO_MOVE)
        private _remove_hero(iid: string, isClient: boolean = true) {
            this.m_pHeroLayer.removeHero(iid);
            if (isClient) {
                WorldModel.sendUpdateTeamData();
            }
        }

        /**创建客户端移动队伍 */
        @WorldView.process(WORLD_FUNC.CREATE_CLIENT_MOVE)
        private _create_clientMove(data: IClientMoveEt): void {
            this.__on_move_evt(data);
        }

        @WorldView.process(WORLD_FUNC.ON_MOVE_VISIT)
        private _on_move_visit(start: number, end: number): void {
            // let hero = this.m_pHeroLayer.createHeroMove(start, end);
            // this.m_pWayLayer.createWay(hero);
        }

        @WorldView.process(WORLD_FUNC.SET_CITYNAME_STATUS)
        private _set_cityname_status(cid: number, status: boolean = true): void {
            let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, cid);
            if (!city) return;
            city.isShowName(status);
        }

        @WorldView.process(WORLD_FUNC.SET_ARMY_TIME_STATUS)
        private _set_army_time_status(gid: string, status: boolean = true): void {
            let hero = this.m_pHeroLayer.getHero(gid);
            if (!hero) return;
            hero.isShowTime(status);
        }

        /**
         * 前往资源点
         * @private
         * @param  {number} start 起始
         * @param  {number} end 结束
         * @return ArmySprite
         * @memberof WorldView
         */
        @WorldView.process(WORLD_FUNC.ON_MOVE_RES)
        private _on_move_res(start: number, end: number, pack?: any, mt?: number, id?: number, dt?: number): void {
            ++WorldView.m_nEventId;

            let heroid = 0, fight = 0, batt = 0;
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
            })
        }

        /**
         * 创建普通菜单
         * @param {number} type 菜单类型 0 黄巾入侵菜单
         */
        @WorldView.process(WORLD_FUNC.CREAT_NOR_MENU)
        private _create_nor_menu(type: number, id: number, pos: egret.Point) {
            this._hide_menu();
            pos = this.m_pBg.globalToLocal(pos.x, pos.y, pos);
            switch (type) {
                case 0: {
                    let menu = new WorldMenuBarAtk(id);
                    menu.x = pos.x;
                    menu.y = pos.y - 300;
                    Utils.addChildAt(this.m_pBg, menu, 99);
                    this.moveTo(pos.x, pos.y - 230, true);
                    this._set_map_bar(false);
                    break;
                }
            }
        }
        /**
         * 创建城市菜单
         * @private
         * @param  {WorldMapConfig} conf 城市配置
         * @return void
         * @memberof WorldView
         */
        @WorldView.process(WORLD_FUNC.CREAT_MENU)
        private _create_menu(conf: WorldMapConfig) {
            this._hide_menu();
            let menu = new WorldMenuWidget(conf);
            Utils.addChildAt(this.m_pBg, menu, 99);
            let build = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, conf.id);
            let x = conf.posX, y = conf.posY;
            menu.x = x;
            menu.y = y;
            this._move_to(ResType.CITY, conf.id, true)
            this._set_map_bar(false);
        }

        /**
         * 创建资源菜单
         * @private
         * @param  {number} id 事件id
         * @return void
         * @memberof WorldView
         */
        @WorldView.process(WORLD_FUNC.CREAT_RES_MENU)
        private _create_res_menu(id: number) {
            this._hide_menu();
            let menu: WorldMenuComponent;
            let vo = WorldModel.getEventVoByPosId(id);
            if (!vo) return;
            switch (vo.type) {
                case WorldEventType.RES_GATHER: {
                    menu = new WorldMenuGatherWidget(id);
                    menu.x = vo.pos.x;
                    menu.y = vo.pos.y - 50;
                    break;
                }
                case WorldEventType.RES_COLLECT: {
                    menu = new WorldMenuCollectWidget(id);
                    menu.x = vo.pos.x;
                    menu.y = vo.pos.y - 50;
                    break;
                }
                case WorldEventType.FIGHT: {
                    menu = new WorldMenuAttackWidget(id);
                    menu.x = vo.pos.x;
                    menu.y = vo.pos.y - 120;
                    break;
                }
            }

            if (!menu) return;
            Utils.addChildAt(this.m_pBg, menu, 99);

            /**菜单显示引导条件 */
            menu.onGuideCondition();

            this._move_to(ResType.RES, id, true)
            this._set_map_bar(false);
        }

        /**
         * 删除菜单
         * @private
         * @param  {number} [x] 
         * @param  {number} [y] 
         * @return boolean 
         * @memberof WorldView
         */
        @WorldView.process(WORLD_FUNC.HIDE_MENU)
        private _hide_menu(x?: number, y?: number): boolean {
            let menu = this.m_pBg.getChildByName("WorldMenu");
            if (menu) {
                if (x != undefined) {
                    if ((<WorldMenuComponent>menu).hitPoint(x, y)) return true;
                }
                (<WorldMenuComponent>menu).removeFromParent();
                this._set_map_bar(true);
            }

            return false;
        }

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
        @WorldView.process(WORLD_FUNC.MOVE_TO)
        private _move_to(ty: ResType, id: string | number | number[], isAnim: boolean = true, isUI: boolean = false) {
            switch (ty) {
                case ResType.CITY:
                    this._move_to_build(<number>id, isAnim, isUI);
                    //是否是从搜索界面过来
                    if (WorldModel.isVisvitFromSerarch) {
                        this.timeoutKey = egret.setTimeout(() => {
                            // let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, <number>id);
                            // city.openMenuPanel();
                            Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: id });
                            WorldModel.isVisvitFromSerarch = false
                            egret.clearTimeout(this.timeoutKey)
                        }, this, 1500);
                    }

                    break;
                case ResType.HERO:
                    this._move_to_hero(<string>id, isAnim, isUI);
                    break;
                case ResType.RES:
                    this._move_to_res(<number>id, isAnim, isUI);
                    break;
                default:
                    this._move_to_point(<number[]>id, isAnim, isUI);
                    break;
            }

        }

        @WorldView.process(WORLD_FUNC.ON_RES_EVENT)
        private _on_res_event(pos: number) {
            let res = this.m_pResLayer.getRes<WorldResSprite>(ResType.RES, pos);
            if (!res) return;
            res.onEvent();
        }

        @WorldView.process(WORLD_FUNC.CREATE_CITY_WAY)
        private _create_city_way(point: number[][], ty: number = 0): number[] {
            return this.m_pWayLayer.createCityWay(point, ty);
        }
        @WorldView.process(WORLD_FUNC.CREATE_HERO_LINE_WAY)
        private _create_hero_line_way(hero: ArmySprite): void {
            return this.m_pWayLayer.createWay(hero);
        }
        @WorldView.process(WORLD_FUNC.UPDATE_HERO_LINE_WAY)
        private _update_hero_line_way(movePoint: egret.Point, temakey: string): void {
            // return this.m_pWayLayer.updateWay(movePoint, temakey);
        }

        @WorldView.process(WORLD_FUNC.REMOVE_CITY_WAY)
        private _remove_city_way(iid: number | number[]): void {
            if (iid instanceof Array) {
                for (let id of iid) {
                    this.m_pWayLayer.removeCityWay(id);
                }
            } else
                this.m_pWayLayer.removeCityWay(iid);
        }

        @WorldView.process(WORLD_FUNC.SET_RANGE)
        private _set_range(): void {
            this.m_pCoverLayer.initRange();
        }

        @WorldView.process(WORLD_FUNC.GET_HERO)
        private _get_hero(eid: string): ArmySprite {
            return this.m_pHeroLayer.getHero(eid);
        }

        @WorldView.process(WORLD_FUNC.GET_GATHER)
        private _get_gather(pos: number): ArmySprite {
            let res = this.m_pResLayer.getRes<WorldResSprite>(ResType.RES, pos);
            if (!res) return;
        }

        public constructor() {
            super();
            this.name = WorldView.NAME;

            this.m_pMapOffset[0] = 0;
            this.m_pMapOffset[1] = 0;
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_CITY) {
                this.m_pTileConfig = MapData.getMapWorldConfig();
            } else if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                this.m_pTileConfig = MapData.getMapXiangyangConfig();
            }


            this.SCALE_MAX = 1;
            this.SCALE_MIN = 0.6;
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                this.setIsCanScale(false);
            } else {
                this.setIsCanScale(true);
            }

        }

        public init() {
            super.init();
        }

        protected listenerProtoNotifications(): any[] {
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
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VISIT_DATA_REFRESH: {
                    let data = body as gameProto.S2C_VISIT_DATA_REFRESH;
                    let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.visitEventData.cityId);
                    if (!city) return;
                    city.updateVisitEvent();
                    break;
                }
                case ProtoDef.S2C_UNLOCK_CITY: {
                    let data = body as gameProto.S2C_UNLOCK_CITY;
                    if (data.errorCode != 0) {
                        break;
                    }
                    let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.cityId);
                    if (!city) return;
                    city.updateVisitEvent();
                    city.updateFirstWard();
                    city.updateCityLock();
                    let cityInfo: gameProto.ICityInfo = WorldModel.getCityBuildInfo(data.cityId);
                    let taskUnlockCfg: WorldMapUnlockTaskConfig = C.WorldMapUnlockTaskConfig[cityInfo.unlockTaskId];
                    if (taskUnlockCfg.type == WorldLockTaskType.SOURCE) {
                        Utils.open_view(TASK_UI.POP_WORLD_DIALOG_VIEW, { id: taskUnlockCfg.id, cityId: data.cityId, step: WorldLockTaskStep.FINISH });
                    } else {
                        // WorldModel.unLockCid = data.cityId;
                    }
                    break;
                }
                case ProtoDef.S2C_VISIT_CD_SPEED: {
                    let data = body as gameProto.S2C_VISIT_CD_SPEED;
                    let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.visitEventData.cityId);
                    if (!city) return;
                    city.updateVisitEvent();
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_QUICKEN: {
                    let data = body as gameProto.S2C_TEAMMOVE_QUICKEN;
                    this.__on_move(data.teamMoveDataResp);
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_TO: {
                    let data = body as gameProto.S2C_TEAMMOVE_TO;
                    for (let i = 0; i < data.teamMoveDataResp.length; i++) {
                        this.__on_move(data.teamMoveDataResp[i]);
                    }
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_RETURN: {
                    let data = body as gameProto.S2C_TEAMMOVE_RETURN;
                    this.__on_move(data.teamMoveDataResp, true);
                    break;
                }
                case ProtoDef.S2C_TEAMMOVE_DEL: {    //队伍移除
                    let data = body as gameProto.S2C_TEAMMOVE_DEL;
                    let key = `${data.playerId}_${data.teamId}`;
                    this._remove_hero(key, false);
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN: {   //采集加速
                    let data = body as gameProto.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN;
                    if (data.state == 0) {
                        this.__update_evt_res(data.mapEventData.eventCoordinatesId)
                    }
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_ACT: {  //队伍操作
                    let data = body as gameProto.S2C_WORLDMAP_EVENT_ACT;
                    if (data.state == 0) {
                        this.__update_evt_res(data.mapEventData.eventCoordinatesId)
                    }
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_OVER: { //事件移除
                    let data = body as gameProto.S2C_WORLDMAP_EVENT_OVER;
                    let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, data.teamId)
                    let eventVo = WorldModel.getWorldEvent(data.eventCoordinatesId);
                    if (!eventVo) {
                        return;
                    }
                    WorldModel.createClientMove(data.teamId, data.eventCoordinatesId, true);
                    if (eventVo.type == WorldEventType.RES_GATHER && WorldModel.isInSearchPanel) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_EVT_FINS))
                    }
                    if (eventVo.type == WorldEventType.FIGHT)
                        return;
                    this.__remove_evt_res(data.eventCoordinatesId);
                    WorldModel.endWorldEvent(data);
                    WorldModel.addFinishWorldEvent(data.eventCoordinatesId)
                    break;
                }

                case ProtoDef.S2C_CITY_UPDATE: {
                    let data = body as gameProto.S2C_CITY_UPDATE;
                    let atk = []
                    for (let cityInfo of data.cityInfo) {
                        let cityInfoData = cityInfo as gameProto.CityInfo;

                        let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, cityInfoData.id);
                        if (isNull(city)) continue;
                        if (cityInfoData.status == 1) { //战斗中
                            atk.push(cityInfoData.id);
                        } else {
                            city.setBattleEffect();
                        }
                        city.updateFirstWard();
                        city.updateCityLock();
                        city.updateVisitEvent();
                        city.updateCity();
                    }
                    if (data.cityInfo) this.m_pCoverLayer.initRange();
                    this.m_pResLayer.initAttack(atk);

                    break;
                }

                case ProtoDef.S2C_CITY_WAR_SETTLEMENT: {
                    let data = body as gameProto.S2C_CITY_WAR_SETTLEMENT;
                    let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.cityId);
                    if (!city) return;
                    city.updateVisitEvent();
                    city.updateFirstWard();
                    city.setBattleEffect();
                    city.updateCityLock();
                    city.updateCity();
                    break;
                }
                case ProtoDef.S2C_VISIT_EVENT_UPDATE: {
                    let data = body as gameProto.S2C_VISIT_EVENT_UPDATE;
                    if (data.state == 1) {
                        let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.visitEventData.cityId);
                        if (!city) return;
                        city.updateVisitEvent();
                        city.updateFirstWard();
                        city.updateCityLock();
                    }
                    break;
                }
                case ProtoDef.S2C_CITY_WAR_SINGLE_OVER: {
                    let data = body as gameProto.S2C_CITY_WAR_SINGLE_OVER;
                    let city = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.cityId);
                    if (!city) return;
                    city.updateVisitEvent();
                    city.updateFirstWard();
                    city.updateCityLock();
                    city.setBattleEffect();
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
                    let data = body as gameProto.S2C_WORLDMAP_EVENT_WAR_OVER;
                    WorldModel.createClientMove(data.teamId, data.eventCoordinatesId, true);
                    this.__remove_evt_res(data.eventCoordinatesId, data.isVictory);
                    if (!data.isVictory) {
                        WorldModel.resetWorldEvent(data.mapEventData);
                    } else {
                        WorldModel.clearWorldEvent(data.eventCoordinatesId);
                    }
                    WorldModel.addFinishWorldEvent(data.eventCoordinatesId)
                    break;
                }
                case ProtoDef.S2C_GET_MAP_EVENT_DATA: {
                    let data = body as gameProto.IS2C_GET_MAP_EVENT_DATA;
                    this.m_pResLayer.updateRefreshRes(data);
                    break;
                }
            }
        }

        public onEnter() {
            super.onEnter();
            //迷雾
            WorldTmxData.init();
            // this.m_pIsForcedMove = false;

            //创建层级
            this.m_pWayLayer = new WayLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pWayLayer, 1);

            this.m_pCityLayer = this.createEmptyLayer('CityLayer');
            Utils.addChildAt(this.m_pBg, this.m_pCityLayer, 2);

            this.m_pResLayer = new ResLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pResLayer, 3);

            this.m_pLabLayer = this.createEmptyLayer('LabLayer');
            Utils.addChildAt(this.m_pBg, this.m_pLabLayer, 4);

            this.m_pCoverLayer = new CoverLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pCoverLayer, 5);
            this.m_pHeroLayer = new HeroLayer(this.m_pBg.width, this.m_pBg.height);
            Utils.addChildAt(this.m_pBg, this.m_pHeroLayer, 6);
          

            this.m_imgMenuMask = new eui.Image('world_mask_png')
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
                // this.__add_test_ways(),
            ])

            //场景初始化参数
            let param = WorldModel.getWordlParam();
            if (param) {
                this.handlerMapData(param);
                WorldModel.resetWorldParam();
            }

            SceneManager.sceneCreateComplete();
            let cityId = WorldModel.m_pInitMoveId == 0 ? WorldModel.capitalId : WorldModel.m_pInitMoveId;
            WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, cityId, false)

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
        }
        /**
         * 扫描警报通知
         */
        public scanWarnNotice() {
            if (!WorldModel.isNoticeComplete)
                return;
            if (WorldModel.getWarnNotices().length == 0)
                return;
            this.playWarnNotice(WorldModel.getWarnNotices().pop())
        }
        /**
         * 扫描完成的事件点
         */
        public updateFinishRes() {
            for (let coorid in WorldModel.m_pResRefEventMap) {
                WorldModel.m_pResRefEventMap[coorid].totalTime += 10;
                if (WorldModel.m_pResRefEventMap[coorid].totalTime >= WorldModel.m_pResRefEventMap[coorid].confTime) {
                    //发送刷新协议
                    WorldProxy.C2S_GET_MAP_EVENT_DATA(Number(coorid))
                }
            }
        }
        /**
         * 播放警报
         */
        public playWarnNotice(warn: ItfWarnItem) {
            let noticeStr: string = null;
            // const event = WorldModel.getWarn(warn.cityId)
            let config = C.WarningConfig[warn.pid];
            switch (warn.pid) {
                case EumWarnType.ATTACKING:
                    noticeStr = WorldModel.__check_args(EumWarnType.ATTACKING, GLan(config.content), ...warn.content)
                    break;
                case EumWarnType.ATTACKING_ENEMY:
                    noticeStr = WorldModel.__check_args(EumWarnType.ATTACKING_ENEMY, GLan(config.content), ...warn.content)
                    break;
                case EumWarnType.ATTACK:
                    noticeStr = WorldModel.__check_args(EumWarnType.ATTACK, GLan(config.content), ...warn.content)
                    break;
                case EumWarnType.ATTACK_ENEMY:
                    noticeStr = WorldModel.__check_args(EumWarnType.ATTACK_ENEMY, GLan(config.content), ...warn.content)
                    break;
            }
            EffectUtils.showTips(noticeStr, 6);
        }
        public onDestroy() {
            //恢复ui显示
            this._reset_map_bar(SceneManager.getClass(LayerEnums.MENU, MainTopOther.NAME));
            this._reset_map_bar(SceneManager.getClass(LayerEnums.MENU, MainTopBar.NAME));

            egret.Tween.removeTweens(this.m_pCloud1)
            this.m_pCloud1 = null;
            egret.Tween.removeTweens(this.m_pCloud2)
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

            super.onDestroy();
        }

        public onEnterFrame(delta: number) {
            super.onEnterFrame(delta);

        }

        public resize(): void {

        }

        /**
         * 添加测试路径
         * @returns void
         */
        private __add_test_ways(): void {
            for (let key in C.WorldWayConfig) {
                let data = C.WorldWayConfig[key];
                if (data != null && data != undefined) {
                    let points = JSON.parse(data.way);

                    this._create_city_way(points)
                }
            }
        }

        /**
         * 添加建筑
         * @returns void
         */
        private __add_builds(): void {
            this.m_pResLayer.initBuilds();

            DjikstraGraph.Instance.initGraph();
            // this.sortBuilds();
        }
        /**
         * 添加云
         * @returns void
         */
        private __add_cloud(): void {
            this.m_pCloud1 = new egret.Bitmap(RES.getRes('map_cloud_2_png'));
            this.m_pCloud2 = new egret.Bitmap(RES.getRes('map_cloud_2_png'));
            this.m_pCloud1.scaleX = this.m_pCloud1.scaleY = 2.5;
            this.m_pCloud2.scaleX = this.m_pCloud2.scaleY = 2.5;

            let bg = this.m_pBg;

            let cloud1 = this.m_pCloud1;
            let cloud2 = this.m_pCloud2;

            bg.addChild(cloud1);
            bg.addChild(cloud2);

            cloud1.x = -cloud1.width;
            cloud1.y = Utils.random(100, bg.height / 2);
            cloud2.x = -cloud2.width;
            cloud2.y = Utils.random(bg.height / 2 + 100, bg.height - cloud2.height);

            egret.Tween.get(cloud1, { loop: true }).to({ x: bg.width }, 240000).wait(100).call(() => {
                cloud1.x = -cloud1.width;
                cloud1.y = Utils.random(100, bg.height / 2);
            }, this).wait(Utils.random(500, 3000));

            egret.Tween.get(cloud2, { loop: true }).wait(Utils.random(5000, 10000)).to({ x: bg.width }, 240000).wait(100).call(() => {
                cloud2.x = -cloud2.width;
                cloud2.y = Utils.random(bg.height / 2 + 100, bg.height - cloud2.height);
            }, this).wait(Utils.random(500, 3000));
        }

        /**
         * 初始化行军事件
         * @private
         * @return void
         * @memberof WorldView
         */
        private __init_hero_event(): void {
            for (let key in WorldModel.moveList) {
                let data = WorldModel.moveList[key];
                this.__on_move(data);
            }
            /**客户端模拟移动 */
            for (let key in WorldModel.clientMoveList) {
                let data = WorldModel.clientMoveList[key];
                this.__on_move_evt(data);
            }
        }
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
        private __on_move(data: gameProto.ITeamMoveDataResp, isReturn: boolean = false): void {
            let key = WorldModel.getTeamMoveKey(data);
            let hero = this.m_pHeroLayer.getHero(key);
            if (!hero) {
                if (data.endTime > TimerUtils.getServerTime()) {
                    hero = this.m_pHeroLayer.createHero(data);
                }
            } else {
                if (isReturn) {
                    hero.onHalfWayBack(data);
                } else {
                    hero.onAccelerate();
                }
            }

        }
        /**创建客户端移动队伍 */
        private __on_move_evt(data: IClientMoveEt): void {
            if (!data) return;
            if (data.endTime <= TimerUtils.getServerTime()) {
                return;
            }
            let key = 'client_' + data.teamId
            let hero = this.m_pHeroLayer.getHero(key);
            if (!hero) {
                hero = this.m_pHeroLayer.createHeroMoveEvt(data);
            }
        }

        /**移除资源 */
        private __remove_evt_res(evtPosId: number, isVistory: boolean = true) {
            this.m_pResLayer.removeEvtRes(evtPosId, isVistory);
            if (isVistory)
                this._hide_menu();
        }

        /**更新资源 */
        private __update_evt_res(evtPosId: number) {
            this.m_pResLayer.updateEvtRes(evtPosId);
        }

        public onTouchBegan(e: egret.TouchEvent): void {
            // EventMgr.dispatchEvent(TaskWorldEvent.QUEUE_HIDE_OPERATE, null);
            super.onTouchBegan(e);
        }

        public onTouchMoved(e: egret.TouchEvent): void {
            super.onTouchMoved(e);
        }

        public onTouchEnd(e: egret.TouchEvent): void {
            if (this.m_pIsMove) {
                super.onTouchEnd(e);
                return;
            }
            let res = WorldView.callFunc(WORLD_FUNC.HIDE_MENU, e.stageX, e.stageY);
            if (!res) res = this.m_pHeroLayer.onTouch(e);
            if (!res) res = this.m_pResLayer.onTouch(e);
            super.onTouchEnd(e);
        }



        /**
         * 用户点击界面
         * @param  {egret.TouchEvent} e 
         * @return boolean 
         * @memberof WorldView
         */
        public onTouch(e: egret.TouchEvent): boolean {
            // MapEventConfirm.remove();

            if (UpManager.CurrentPanel != null) {
                error('有面板打开，事件穿透到地图了。已拦截。');
                return true;
            }

            return false;

        }

        /**
        * 移动地图
        */
        public mapMovePosition(pos: egret.Point) {
            let point: egret.Point = this.getMapMovePosition(pos);
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_MOVE, point);
            super.mapMovePosition(pos);

            egret.Point.release(point);
        }

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
        private __move_to_all(obj: egret.DisplayObject, isAnim: boolean = true, isUI: boolean = false, offsetX: number = 0, offsetY: number = 0) {
            if (!obj) return;
            let _y = obj.y + obj.height / 2;

            if (isUI)
                _y = _y + obj.height * 2;
            this.moveTo(obj.x + obj.width / 2 + offsetX, _y + offsetY, isAnim);
        }

        /**
         * 视角移动到城池那里
         * @protected
         * @param  {number} id 
         * @param  {boolean} [isAnim=true] 
         * @param  {boolean} [isUI=false] 
         * @return void
         * @memberof WorldView
         */
        protected _move_to_build(id: number, isAnim: boolean = true, isUI: boolean = false) {
            let build = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, id);
            if (isNull(build)) return;
            // console.log("id====" + build.config.id)
            this.__move_to_all(build, isAnim, isUI, -build.width * 0.5, -build.height * 0.5);
        }

        /**
         * 视角移动到英雄那里
         * @protected
         * @param  {number} id 
         * @param  {boolean} [isAnim=true] 
         * @param  {boolean} [isUI=false] 
         * @return void
         * @memberof WorldView
         */
        protected _move_to_hero(id: string, isAnim: boolean = true, isUI: boolean = false) {
            let hero = this.m_pHeroLayer.getHero(id);
            this.__move_to_all(hero, isAnim, isUI);
        }

        /**
         * 视角移动到资源点那里
         * @protected
         * @param  {number} id 
         * @param  {boolean} [isAnim=true] 
         * @param  {boolean} [isUI=false] 
         * @return void
         * @memberof WorldView
         */
        protected _move_to_res(id: number, isAnim: boolean = true, isUI: boolean = false) {
            let res = this.m_pResLayer.getRes<WorldResSprite>(ResType.RES, id);
            let y = res.type == WorldEventType.FIGHT ? -100 : -90;
            //
            this.moveTo(res.x, res.y + y, isAnim);
            // this.__move_to_all(res, isAnim, isUI, 0, y);
        }

        protected _move_to_point(pos: number[], isAnim: boolean = true, isUI: boolean = false) {
            let [x, y] = pos;
            let point = this.m_pBg.globalToLocal(x, y);

            this.moveTo(point.x, point.y, isAnim);
        }

        /**
         * 显示/隐藏界面菜单
         */
        protected _set_map_bar(val: boolean) {

            if (val) this.m_pResLayer.clearSelected();

            let otherBar = SceneManager.getClass(LayerEnums.MENU, MainTopOther.NAME);
            let worldBar = SceneManager.getClass(LayerEnums.MENU, MainWorldBar.NAME);
            let topBar = SceneManager.getClass(LayerEnums.MENU, MainTopBar.NAME);
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_CITY) {
                this._do_bar_action(topBar, val);
            }
            this._do_bar_action(otherBar, val);
            this._do_bar_action(worldBar, val);
            this.m_imgMenuMask.visible = !val;
        }

        /**重置操作栏 */
        protected _reset_map_bar(obj: any) {
            if (!obj) return;
            egret.Tween.removeTweens(obj);
            obj.visible = true;
            obj.alpha = 1;
        }

        private _do_bar_action(obj: any, isShow: boolean) {
            if (!obj) return;
            egret.Tween.removeTweens(obj);
            let tw = egret.Tween.get(obj);
            if (isShow) {
                obj.visible = true;
                tw.to({ alpha: 1 }, 400);
            } else {
                tw.to({ alpha: 0 }, 400);
                tw.call(() => {
                    obj.visible = false;
                }, this);
            }
        }

        public getPosData(x: number, y: number) {
            if (!this.m_pTileConfig) return;
            let _x = Math.ceil(x / this.m_pTileConfig.w);
            let _y = Math.ceil(y / this.m_pTileConfig.h);

            let index = ((_y - 1) * this.m_pTileConfig.col + _x);

            return [index, _x, _y];
        }

        public removeTileObject(obj: any) {
            let pos_data = this.getPosData(obj.x, obj.y);
            if (!pos_data) return;
            let index = pos_data[0];

            let arr: any[] = this.m_pTileObjects[index];
            if (!arr) return;

            let indx = -1, i = 0;
            for (let o of arr) {
                if (o == obj)
                    indx = i;
                i++;
            }
            if (indx != -1) {
                arr.splice(indx, 1);
            }
        }

        /**获得弹出菜单 */
        public getWorldMenu() {
            return this.m_pBg.getChildByName("WorldMenu");
        }

        /**=====================================================================================
 * 事件监听 begin
 * =====================================================================================
 */
        /////////////////////////////////////////////////////////////////自定义事件
        protected listNotificationInterests(): any[] {
            return [TASK_UI.MAP_WORLD_MOVE];
        }

        protected handleNotification(notification: AGame.INotification) {
            let body = notification.getBody();
            let name = notification.getName();
            debug("BaseMap:handleNotification--->>", name, body);
            switch (name) {
                case TASK_UI.MAP_WORLD_MOVE: {
                    this.handlerMapData(body);
                    break;
                }
            }
        }

        /**解析大地图移动 */
        private handlerMapData(data: IWorldMapData) {
            if (!data) return;
            let target = null;
            switch (data.type) {
                case TurnType.WORLD_EVT: {   //任意事件
                    let visits = WorldModel.getCanVisitEventList();
                    target = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, visits[0].cityId);
                    if (target) {
                        target = target['visitItem'];
                        this._move_to_build(visits[0].cityId);
                    }
                    break;
                }
                case TurnType.WORLD_LOCKED: {    //未解锁城池
                    let cityId = WorldModel.getLockedCityId();
                    // 排除0  襄阳战城池
                    let ids = [0, 101, 102, 103, 104, 105, 106, 107, 108];
                    let isOut = ids.indexOf(cityId) > -1;
                    if (isOut) {
                        cityId = WorldModel.getNearestCanAttackCity();
                        isOut = ids.indexOf(cityId) > -1;
                        if (isOut) {
                            EffectUtils.showTips(GCode(CLEnum.WOR_LOCK_FIND_FAL));
                        } else {
                            target = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, cityId);
                            if (target) this._move_to_build(cityId);
                        }
                    } else {
                        target = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, cityId);
                        if (target) this._move_to_build(cityId);
                    }
                    break;
                }
                case TurnType.WORLD_RES: {   //资源收集
                    target = this.moveToTaskRes(WorldEventType.RES_COLLECT);
                    break;
                }
                case TurnType.WORLD_COL_RES: {   //资源采集
                    target = this.moveToTaskRes(WorldEventType.RES_GATHER, data.param);
                    break;
                }
                case TurnType.WORLD_MONSTER: {   //怪物
                    target = this.moveToTaskRes(WorldEventType.FIGHT, data.param);
                    break;
                }
                case TurnType.WORLD_CITY: {  //城池
                    target = this.m_pResLayer.getRes<CitySprite>(ResType.CITY, data.param);
                    if (target) this._move_to_build(data.param);
                }

            }
            // if (!target) EffectUtils.showTips('当前地图块不存在目标资源!');

            if (target && data.tips != '') {
                Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, { target: target });
            }
        }

        /**世界任务跳转资源 */
        public moveToTaskRes(type: WorldEventType, param?: number) {
            let evt = WorldModel.getEventVosByType(type, param);
            //剿匪等级排序
            if (type == WorldEventType.FIGHT) evt.sort(this.sortByLv);
            if (evt.length > 0) {
                let target = null;
                let res = this.m_pResLayer.getRes<WorldResSprite>(ResType.RES, evt[0].eventCoordinatesId);
                if (res) {
                    target = res['m_pRes'];
                    this._move_to_res(evt[0].eventCoordinatesId);
                }
                return target;
            }
        }
        public sortByLv(p1: WorldEventVo, p2: WorldEventVo) {
            return (p1.dataCfg ? p1.dataCfg.lv : 1) - (p2.dataCfg ? p2.dataCfg.lv : 1);
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

        /*移动到新手资源 */
        public moveGuideRes() {
            let ids = WorldModel.eventList;
            for (let k in WorldModel.eventList) {
                let vo = WorldModel.eventList[k];
                if (vo.cityId == WorldModel.capitalId && vo.type == WorldEventType.RES_COLLECT) {
                    this._move_to_res(vo.eventCoordinatesId)
                }
            }
        }

        /*移动到新手资源 */
        public moveGuideCity() {
            this._move_to_build(WorldModel.capitalId);
        }

        /**获得主城资源(0 为出生城池) */
        public getGuideCity(cityId: number) {
            return this.m_pResLayer.getRes<CitySprite>(ResType.CITY, cityId || WorldModel.capitalId);
        }

        /**获得一个未解锁城池 */
        public moveGuideLockedCity() {
            let id = WorldModel.getLockedCityId();
            if (id == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_LOCK_FIND_FAL));
                return;
            }
            this._move_to_build(WorldModel.getLockedCityId());
        }

        /**获得第一个未解锁城池 */
        public getGuideLockCity() {
            return this.m_pResLayer.getRes<CitySprite>(ResType.CITY, WorldModel.getLockedCityId());
        }
        /**驻军数据 */
        public onCityTroop(res: com_main.ITroopData[]) {
            Utils.open_view(TASK_UI.POP_WORLD_CITY_TROOP_PANEL, res);
        }
        /**更新资源显示，播放特效 */
        public updateResShow(cityId: number) {
            let eventIds: number[] = WorldModel.m_pCityEventList[cityId];
            if (isNull(eventIds))
                return;
            for (let index = 0; index < eventIds.length; index++) {
                let res = this.m_pResLayer.getRes<WorldResSprite>(ResType.RES, eventIds[index]);
                res.playeffect(true);
            }
        }

        /**获得主城第一个采集资源 */
        public getGuideRes() {
            let ids = WorldModel.eventList;
            for (let k in WorldModel.eventList) {
                let vo = WorldModel.eventList[k];
                if (vo.cityId == WorldModel.capitalId && vo.type == WorldEventType.RES_COLLECT) {
                    let res = this.m_pResLayer.getRes<WorldResSprite>(ResType.RES, vo.eventCoordinatesId);
                    return res['m_pRes'];
                }
            }
        }

        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_RESOURCE);
        }

    }
}
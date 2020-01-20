module com_main {
    /**主城地图 传入参数结构 */
    export interface IMainMapData {
        buildId?: number, //镜头移动到场景
        buildAc?: number,  //建筑升级界面操作 1 打开升级界面
        funcId?: number,      //镜头移动到功能建筑
        tipsParam?: { uiRoot: { layer: number, name: string }, uiPath: Array<any> };
    }
    /**泡泡事件 */
    export interface IBuildPP {
        id: number;
        state: number;// 0创建 更新 1移除
        type?: MBuildIconStatus;
        value?: number;
        isMax?: boolean;
    }

    export class MainMap extends BaseMap {

        private m_pBuilds: { [buildId: number]: MBuild } = {};
        private m_pFuncBuilds: { [funcId: number]: MapFuncIcon } = {};
        private m_pStatueList: { [sId: number]: StatueView } = {};
        private m_pPaopaos: { [buildId: number]: MBuildPP } = {};

        private m_pGenerals: Array<CSquare> = [];

        public static NAME = 'MainMap';

        public m_pEffects: any[] = [];

        private m_pIsLoadGenerals: boolean = false;

        private m_pTan: egret.Bitmap;

        public m_soliderList: any[] = []; //巡逻士兵列表

        public static m_pLastSelectBuild: number = 0;

        public static m_pIsShowTip: boolean = false;

        public battlePlayer: com_main.BattlePlayer;
        private battleKey = 0;
        private m_box;

        // public SCALE_DEF: number = 0.77;//默认大小
        public SCALE_DEF: number = 0.9;//默认大小

        public static m_preBuild: number;

        private m_tParam: IMainMapData;

        public constructor(data?: IMainMapData) {
            super();
            this.name = MainMap.NAME;

            /**设置偏移量 */
            // this.m_pMapOffset[0] = 80;
            // this.m_pMapOffset[0] = 55;
            // this.m_pMapOffset[1] = 0;

            this.m_pTileConfig = MapData.getMapMainConfig();

            // this.setIsCanScale(false);
            this.setIsCanScale(true);
            this.m_tParam = data;

            EffectData.addEffectModule(EffectData.MAIN_MAP, EffectMainMap);
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_BUILDING_INFO, //获取建筑信息

                ProtoDef.S2C_BUILDING_ACTIVATED,//建筑激活
                ProtoDef.S2C_BUILDING_UPLEVEL,//建筑升级
                ProtoDef.S2C_BUILDING_SPEED,//建筑加速
                ProtoDef.BUILDING_CLEAN_COOLING,//建筑清cd
                ProtoDef.PUSH_BUILDING_OPEN,//推送建筑开放信息
                ProtoDef.PUSH_BUILDING_ITEM,//升级获得的道具列表
                ProtoDef.GET_BUILDING_ITEM,
                ProtoDef.ARENA_ID,  // 擂台ID
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());

            // debug("WorldMap executes:", protocol, body)
            switch (protocol) {
                case ProtoDef.S2C_BUILDING_INFO: {
                    this.addBuilds();
                    break;
                }

                case ProtoDef.S2C_BUILDING_ACTIVATED: {// 请求建筑激活
                    let info = body.building;
                    // let id = info.type * 10 + info.pos;
                    let build: MBuild = this.m_pBuilds[info.id];
                    if (build) {
                        build.checkActivation();
                        build.checkOutput();
                        if (MainMapModel.isNormalSourceBuilding(build.getBuildId())) {
                            this.refreshSameTypeBuildView();
                        }
                    }
                    break;
                }
                case ProtoDef.S2C_BUILDING_UPLEVEL: {// 请求建筑升级
                    let id = body.bId;
                    let build: MBuild = this.getBuild(id);
                    if (build) {
                        build.checkCD(true);
                    }

                    break;
                }
                case ProtoDef.PUSH_BUILDING_OPEN: {// 推送建筑开放信息

                    let building = body.building;

                    for (var key in building) {
                        if (building.hasOwnProperty(key)) {
                            var element = building[key];
                            this.addBuild(element);
                        }
                    }

                    this.sortBuilds();
                    break;
                }

                case ProtoDef.BUILDING_CLEAN_COOLING: {// 请求金币清除冷却


                    break;
                }
                case ProtoDef.PUSH_BUILDING_ITEM: {//升级获得的道具列表
                    let list = body.items;
                    if (list) {
                        for (var key in list) {
                            if (list.hasOwnProperty(key)) {
                                var element = list[key];
                                let bId = element.bId;

                                let build: MBuild = this.getBuild(bId);
                                if (build) {
                                    build.checkBuildItem();
                                }

                            }
                        }
                    }

                    break;
                }
                case ProtoDef.GET_BUILDING_ITEM: {
                    let bid = body.bid;
                    let build: MBuild = this.getBuild(bid);
                    if (build) {
                        build.checkBuildItem();
                    }
                    break;
                }
            }
        }

        public onEnter() {
            super.onEnter();

            let bg = this.m_pBg;

            //没开放的图片补上去
            // let shopBuild = new eui.Image();
            // shopBuild.source = "map_main_build158_png";
            // shopBuild.x = 1654;
            // shopBuild.y = 394;
            // shopBuild.name = "shopBuild";
            // Utils.addChild(this.m_pBg, shopBuild);

            // this.addArena();
            this.addSubsidiaryBuild();
            this.addBuilds();
            this.refreshSameTypeBuildView();
            // this.addGenerals();
            // this.initBuildFunctionMenu();
            // this.initCheckPointEffect();

            /**随机小鸟飞行 */
            // MapBery.MapBeryFlyTimeController(this.m_pBg, bg.width, bg.height);
            this.initEffects();
            SceneManager.sceneCreateComplete();

            // //没开放的图片补上去
            // let boot = new eui.Image();
            // boot.source = "map_main_build157_png";
            // boot.x = 960;
            // boot.y = 337;
            // Utils.addChild(this.m_pBg, boot);

            this.initWorship();

            if (!MainMap.m_pIsShowTip) {
                MainMap.m_pIsShowTip = true;
                // let dialog = new CDialog3(null, null, 120-WorldMapModel.getCountryCount(RoleData.countryId - 1));
                // SceneManager.addChild(LayerEnums.GUIDE, dialog);
            }


            //镜头移动到大殿
            if (this.m_tParam && (this.m_tParam.buildId || this.m_tParam.funcId)) {
                this.handlerMapData(this.m_tParam);
            } else {
                this.moveToBuild(BuildingType.AUDIENCE_HALL, false);
            }

            this.addEvent();
            //检查泡泡事件
            for (let i in this.m_pBuilds) {
                let build = this.m_pBuilds[i];
                build.checkOutput();
            }
            this.onGuideCondition();

        }

        public onExit() {
            super.onExit();
            // Utils.TimerManager.remove(this.randomGeneralAction, this);
            this.removeEvent();
        }

        private creaetEffect(bitmapName: string, effectName: string, pos: egret.Point, rect?, anchor?) {
            let bitmap = new egret.Bitmap();
            bitmap.name = bitmapName;
            Utils.addChild(this.m_pBg, bitmap);
            EffectData.addEffect(EffectData.MAIN_MAP, effectName, bitmap);
            bitmap.x = pos.x;
            bitmap.y = pos.y;
            this.m_pEffects.push([EffectData.MAIN_MAP, effectName, bitmap]);
            this.addTileObject(bitmap);
            bitmap.visible = true;


            if (anchor) {
                bitmap.$setAnchorOffsetX(anchor.x);
                bitmap.$setAnchorOffsetY(anchor.y);
            }

            if (rect) {
                bitmap.width = rect.width;
                bitmap.height = rect.height;
            }
            return bitmap;
        }

        private initEffects() {
            // /**瀑布 */
            // this.creaetEffect("wf", IETypes.EMap_Waterfall, new egret.Point(7, 178));
            // /**水面波纹 */
            // this.creaetEffect('water', IETypes.EMap_Water, new egret.Point(4, 415));
            // /**瀑布左1 */
            // this.creaetEffect('pubu1', IETypes.EMap_Waterfall_xiao1, new egret.Point(877, 0), { height: 206, width: 80 });
            // /**瀑布左2 */
            // this.creaetEffect('pubu2', IETypes.EMap_Waterfall_xiao1, new egret.Point(1037, -5));
            // /**瀑布左3 */
            // this.creaetEffect('pubu2', IETypes.EMap_Waterfall_xiao, new egret.Point(1451, -40), { height: 122, width: 60 });
            // /**瀑布左4 */
            // this.creaetEffect('pubu2', IETypes.EMap_Waterfall_xiao, new egret.Point(1588, 0));
            // /**水车瀑布左1 */
            // this.creaetEffect('shuiche1', IETypes.EMap_Waterfall_shuiche, new egret.Point(2324, 43));
            // /**水车瀑布左2 */
            // this.creaetEffect('shuiche2', IETypes.EMap_Waterfall_shuiche, new egret.Point(2168, 381), { height: 120, width: 33 });

            let offX = 700;

            this.initSolider({
                soliderStartPostList: [[752 + offX, 1164], [729 + offX, 1176], [704 + offX, 1189]], //城墙士兵起点
                move1: [909 + offX, 1080],  //阶梯下
                move2: [981 + offX, 991],   //阶梯上
                soliderEndPostList: [[1061 + offX, 939], [1041 + offX, 954], [1018 + offX, 969]],   //城墙士兵终点
                speed: 0.03,
                effectType1: IETypes.EMap_Solider_Right,
                effectType2: IETypes.EMap_Solider_Left
            });

            this.initSolider({
                soliderStartPostList: [[1561 + offX, 597], [1541 + offX, 611]], //城墙士兵起点
                move1: [1453 + offX, 658],  //阶梯下
                move2: [1375 + offX, 767],   //阶梯上
                soliderEndPostList: [[1233 + offX, 850], [1206 + offX, 866]],   //城墙士兵终点
                speed: 0.03,
                effectType1: IETypes.EMap_Solider_Left,
                effectType2: IETypes.EMap_Solider_Right
            });

            this.initSolider({
                soliderStartPostList: [[1933 + offX, 1319], [1957 + offX, 1331]], //城墙农民起点
                move1: [2058 + offX, 1382],
                move2: [2182 + offX, 1448],
                soliderEndPostList: [[2359 + offX, 1567], [2383 + offX, 1584]],   //城墙农民终点
                speed: 0.03,
                effectType1: IETypes.EMap_Farmer_Right_down,
                effectType2: IETypes.EMap_Farmer_Left_Up,
                anchor: [17, 23]
            });

            this.initFarmer1();
            // this.createBattlePlayer();
            // this.createBoss();

        }

        private initSolider(args) {
            let soliderStartPostList = args.soliderStartPostList; //城墙士兵起点
            let move1 = args.move1; //阶梯下
            let move2 = args.move2;  //阶梯上
            let soliderEndPostList = args.soliderEndPostList; //城墙士兵终点
            let speed = args.speed; //行走速度
            let soliderCount = args.soliderStartPostList.length;
            let effectType1 = args.effectType1;
            let effectType2 = args.effectType2;
            let anchor = args.anchor;
            let soliderList = [];
            let soliderReverse = function () {
                for (let i = 0; i <= soliderCount - 1; i++) {
                    let sPoint = new egret.Point(soliderStartPostList[i][0], soliderStartPostList[i][1]);
                    let movePoint1 = new egret.Point(move1[0], move1[1]);
                    let movePoint2 = new egret.Point(move2[0], move2[1]);
                    let endPoint = new egret.Point(soliderEndPostList[i][0], soliderEndPostList[i][1]);

                    let solider = soliderList[i];
                    egret.Tween.removeTweens(solider);
                    solider.x = endPoint.x;
                    solider.y = endPoint.y;

                    EffectData.removeEffect(EffectData.MAIN_MAP, effectType1, solider);
                    EffectData.addEffect(EffectData.MAIN_MAP, effectType2, solider);

                    let tw = egret.Tween.get(solider)
                    let time1 = egret.Point.distance(sPoint, movePoint1) / speed;
                    let time2 = egret.Point.distance(movePoint1, movePoint2) / speed;
                    let time3 = egret.Point.distance(endPoint, movePoint2) / speed;
                    tw.wait(10)
                        .to({ x: movePoint2.x, y: movePoint2.y }, time3)
                        .to({ x: movePoint1.x, y: movePoint1.y }, time2)
                        .to({ x: sPoint.x, y: sPoint.y }, time1);
                    if (i == 0) {
                        tw.call(soliderMove);
                    }
                }
            };
            let soliderMove = function () {
                for (let i = 0; i <= soliderCount - 1; i++) {
                    let sPoint = new egret.Point(soliderStartPostList[i][0], soliderStartPostList[i][1]);
                    let movePoint1 = new egret.Point(move1[0], move1[1]);
                    let movePoint2 = new egret.Point(move2[0], move2[1]);
                    let endPoint = new egret.Point(soliderEndPostList[i][0], soliderEndPostList[i][1]);

                    let solider = soliderList[i];
                    egret.Tween.removeTweens(solider);
                    solider.x = sPoint.x;
                    solider.y = sPoint.y;
                    // let solider = this.creaetEffect('solider'+i,IETypes.EMap_Solider_Right,sPoint,null,{x:65,y:65});


                    EffectData.removeEffect(EffectData.MAIN_MAP, effectType2, solider);
                    EffectData.addEffect(EffectData.MAIN_MAP, effectType1, solider);

                    let tw = egret.Tween.get(solider);
                    let time1 = egret.Point.distance(sPoint, movePoint1) / speed;
                    let time2 = egret.Point.distance(movePoint1, movePoint2) / speed;
                    let time3 = egret.Point.distance(endPoint, movePoint2) / speed;
                    tw.to({ x: movePoint1.x, y: movePoint1.y }, time1)
                        .to({ x: movePoint2.x, y: movePoint2.y }, time2)
                        .to({ x: endPoint.x, y: endPoint.y }, time3);
                    if (i == 0) {
                        tw.call(soliderReverse);
                    }
                }
            }

            for (let i = 0; i <= soliderCount - 1; i++) {
                let sPoint = new egret.Point(soliderStartPostList[i][0], soliderStartPostList[i][1]);
                let movePoint1 = new egret.Point(move1[0], move1[1]);
                let movePoint2 = new egret.Point(move2[0], move2[1]);
                let endPoint = new egret.Point(soliderEndPostList[i][0], soliderEndPostList[i][1]);
                let anchorPoint;
                if (anchor) {
                    anchorPoint = { x: anchor[0], y: anchor[1] }
                } else {
                    anchorPoint = { x: 51, y: 51 };
                }

                let solider = this.creaetEffect('solider' + i, effectType1, sPoint, null, anchorPoint);
                soliderList.push(solider);
                this.m_soliderList.push(solider);
            }
            soliderMove();
        }

        private initFarmer1() {
            let speed = 0.03; //行走速度

            let offX = 700;
            let pointList = [[2021 + offX, 1837], [1818 + offX, 1747], [1879 + offX, 1689], [1952 + offX, 1640], [2082 + offX, 1599]];

            let point1 = new egret.Point(pointList[0][0], pointList[0][1]);
            let point2 = new egret.Point(pointList[1][0], pointList[1][1]);
            let point3 = new egret.Point(pointList[2][0], pointList[2][1]);
            let point4 = new egret.Point(pointList[3][0], pointList[3][1]);
            let point5 = new egret.Point(pointList[4][0], pointList[4][1]);

            let farmer1 = this.creaetEffect('farmer1', IETypes.EMap_Farmer_Left_Up, point1, null, { x: 17, y: 23 });
            this.m_soliderList.push(farmer1);

            let tw = egret.Tween.get(farmer1, { loop: true });
            let time1 = egret.Point.distance(point1, point2) / speed;
            let time2 = egret.Point.distance(point2, point3) / speed;
            let time3 = egret.Point.distance(point3, point4) / speed;
            let time4 = egret.Point.distance(point4, point5) / speed;

            tw.to({ x: point2.x, y: point2.y }, time1)
                .call(() => { farmer1.scaleX = -1; })
                .to({ x: point3.x, y: point3.y }, time2)
                .to({ x: point4.x, y: point4.y }, time3)
                .to({ x: point5.x, y: point5.y }, time4)
                .call(() => {
                    farmer1.scaleX = -1;
                    EffectData.removeEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Left_Up, farmer1);
                    EffectData.addEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Right_down, farmer1);
                })
                .to({ x: point4.x, y: point4.y }, time4)
                .to({ x: point3.x, y: point3.y }, time3)
                .to({ x: point2.x, y: point2.y }, time2)
                .call(() => { farmer1.scaleX = 1 })
                .to({ x: point1.x, y: point1.y }, time1)
                .call(() => {
                    EffectData.removeEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Right_down, farmer1);
                    EffectData.addEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Left_Up, farmer1);
                })


            // soliderList.push(solider);

        }
        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MAIN_BUILD);
        }

        /**刷新建筑显示 */
        public refreshSameTypeBuildView() {
            let builds = this.m_pBuilds;
            let list = {}
            for (let key in builds) {
                if (builds.hasOwnProperty(key)) {
                    let element = builds[key] as MBuild;
                    if (MainMapModel.isNormalSourceBuilding(element.getBuildId())) {
                        let buildType = element.getBuildType()
                        if (!list[buildType]) {
                            list[buildType] = [];
                        }
                        list[buildType].push(element);
                    }
                }
            }

            for (let key in list) {
                if (list.hasOwnProperty(key)) {
                    let arr: Array<MBuild> = list[key];
                    //升序
                    arr.sort((a, b) => {
                        return a.getBuildVo().getActivationLevel() - b.getBuildVo().getActivationLevel();
                    });
                    let isShowLocked = true;
                    for (let i = 0; i < arr.length; i++) {
                        let build = arr[i];
                        let vo = arr[i].getBuildVo();
                        if (vo.isActivation() || vo.canActivation()) {
                            build.setBaseLayerVisible(true);
                        } else {
                            if (isShowLocked) {
                                isShowLocked = false;
                                build.setBaseLayerVisible(true);
                            } else {
                                build.setBaseLayerVisible(false);
                            }
                        }
                    }
                }
            }

        }

        /**
         * 添加建筑
         */
        public addBuilds() {
            let builds = MainMapModel.getBuildInfos();
            if (builds == null)
                return;

            let x = 0;
            let y = 0;

            for (var key in builds) {
                if (builds.hasOwnProperty(key)) {
                    var data = builds[key];
                    // if (data.id == MBuildId.XY) continue; //行营不要建筑icon

                    let build = this.addBuild(data);

                    if (data.type == BuildingType.AUDIENCE_HALL) {
                        x = build.x;
                        y = build.y;
                    }
                }
            }

            this.sortBuilds();

            this.moveTo(x, y, false);
            com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);

        }

        public addBuild(data: any): MBuild {

            let type = data.type;
            let pos = data.pos;
            // let index = type * 10 + pos;
            let id = data.id;

            let build = this.m_pBuilds[id];

            if (!build) {
                build = MBuild.create(type, pos, id);
                build.addLabelToObj(this.m_labelLayer);
                this.m_pBuilds[id] = build;
                Utils.addChild(this.m_pBg, build);
                this.addTileObject(build);
            }

            return build;
        }


        public onTouchEnd(e: egret.TouchEvent): void {

            let rangeX = Math.abs(this.m_pTouchBeginPos.x - e.stageX);
            let rangeY = Math.abs(this.m_pTouchBeginPos.y - e.stageY);


            if (rangeX <= 10 && rangeY <= 10) {
                let res = this.onClickBuild(e);
                if (res) {
                    e.stopImmediatePropagation();
                }
            } else {
                // //
                // if (this.m_pIsCanMove)//主城地图如果不能拖动 说明在指引,功能面板不缩回
                //     this.showBuildFunctionMenuView(null);
            }
            super.onTouchEnd(e);
        }
        //点击
        private onClickBuild(e: egret.TouchEvent) {
            /**新手引导点击 */
            EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
            Sound.playTap();

            for (let id in this.m_pPaopaos) {
                let icon = this.m_pPaopaos[id];
                let res = icon.check_is_touch(e.stageX, e.stageY);
                if (res) return;
            }

            for (let id in this.m_pFuncBuilds) {
                let icon = this.m_pFuncBuilds[id];
                let res = icon.check_is_touch(e.stageX, e.stageY);
                if (res) return;
            }

            for (let id in this.m_pStatueList) {
                let icon = this.m_pStatueList[id];
                let res = icon.check_is_touch(e.stageX, e.stageY);
                if (res) return;
            }


            let builds = this.m_pBuilds;
            let _build: MBuild = null;
            let index = 0;
            for (var key in builds) {
                let build: MBuild = builds[key];
                var id = (<MBuild>builds[key]).check_is_touch(e.stageX, e.stageY);
                if (id) {
                    debug("点中建筑id:", id);

                    let _index = build.parent.getChildIndex(build);
                    if (!_build || _index > index) {
                        _build = build;
                        index = _index;
                    }
                }
            }
            if (_build) {
                if (_build.getTouchType() != MBuildTouchType.BUILD) {
                    _build.onTouch();
                    return true
                }
                let res = MainMapModel.openBuildFunc(_build.getBuildId());
                if (!res)
                    this.onSelectBuild(_build);

            } else {
                this.onSelectBuild(_build);
            }


        }

        public onSelectBuild(_build: MBuild) {
            //指引会锁地图 如果没有点击到入口 不错回收处理
            if (!this.m_pIsCanMove) {
                if (!_build)
                    return;
            }

            //直接显示升级界面
            if (_build && _build.getBaseLayerVisible()) {
                if (_build.isMaxLevel()) {
                    EffectUtils.showTips(GCode(CLEnum.CITY_BD_MAX), 1, false);
                } else {
                    let type1 = MainMapModel.isInBuilding(_build.getBuildId()) ? FunctionType.BUILDING_GRADE_SPEED : FunctionType.BUILDING_GRADE;
                    FunctionModel.openFunctionByType(type1, _build.getBuildId());
                }
            }
        }

        private m_curBuild: MBuild;
        private m_curBuildIndex: number;

        /**
         * 销毁方法
         */
        public onDestroy() {
            MainMap.m_pLastSelectBuild = 0;

            // egret.Tween.removeTweens(this.m_pCloud1);
            // egret.Tween.removeTweens(this.m_pCloud2);
            for (let i in this.m_soliderList) {
                let solider = this.m_soliderList[i];
                egret.Tween.removeTweens(solider);
            }
            if (this.battlePlayer) {
                this.battlePlayer.onDestroy();
                egret.clearTimeout(this.battleKey);
                this.battlePlayer.parent.removeChild(this.battlePlayer);
                this.battlePlayer = null;
            }

            if (this.m_box) {
                egret.Tween.removeTweens(this.m_box);
            }
            // MapBery.MapBeryStopFly();

            var builds = this.m_pBuilds;

            for (var key in builds) {
                if (builds.hasOwnProperty(key)) {
                    var element = builds[key];
                    element.onDestroy();
                }
            }
            delete this.m_pPaopaos;
            delete this.m_pBuilds;

            this.m_pBuilds = null;

            //清理模块资源
            // SceneResGroupCfg.clearModelRes([ModuleEnums.MAIN_CITY]);
            super.onDestroy();
        }

        /**根据id获取建筑 */
        public getBuild(bId: number): MBuild {
            let build: MBuild = this.m_pBuilds[bId];

            if (build)
                return build;

            return null;
        }

        /**移动到功能建筑 */
        public moveToFunc(id: FunctionType) {
            let icon = this.m_pFuncBuilds[id];
            if (icon) {
                this.moveTo(icon.x, icon.y);
            }
        }

        public moveToBuild(bId: number, isAni: boolean = true) {

            // if (bId == MBuildId.XY) {//行营特殊处理
            //     this.moveTo(this.buildCheckPoint.x, this.buildCheckPoint.y, true);
            // } else {
            let build = this.getBuild(bId);
            if (build) {
                this.moveTo(build.x, build.y, isAni);
            }
            // }
        }

        public moveToBuildByOffset(bId: number, offset: Point) {
            let build = this.getBuild(bId);
            if (build) {
                this.moveTo(build.x + offset.x, build.y + offset.y, true);
            }
        }

        /**=====================================================================================
		 * 建筑泡泡 begin
		 * =====================================================================================
		 */
        /**添加泡泡 */
        private createPPIcon(id: number, type: MBuildIconStatus) {
            if (this.m_pPaopaos[id]) return;
            let build = this.m_pBuilds[id];
            if (!build) return;
            let icon = MBuildPP.create(id, type);
            this.m_pPaopaos[id] = icon;
            Utils.addChild(this.m_pPaopaoLayer, icon);
            icon.x = build.x - icon.iconWidth * 0.5;
            icon.y = build.y - build.height * 0.5 - icon.iconHeight -25;
            let offset = build.getPosInfo();
            if(offset){
                icon.x += offset.nameOffset[0];
                icon.y += offset.nameOffset[1];
            }
        }
        /**移除泡泡 */
        private removePPIcon(id: number) {
            if (!this.m_pPaopaos[id]) return;
            Utils.removeFromParent(this.m_pPaopaos[id]);
            delete this.m_pPaopaos[id];
        }
        /**刷新泡泡数值 */
        private updatePPIcon(id: number, type: MBuildIconStatus, value: number, isMax: boolean) {
            if (!this.m_pPaopaos[id]) {
                this.createPPIcon(id, type);
            } else {
                this.m_pPaopaos[id].type = type;
            }
            this.m_pPaopaos[id].setNum(value, isMax)
        }

        /**=====================================================================================
		 * 建筑泡泡 end
		 * =====================================================================================
		 */

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.OnBuildUpLevel, this);
            EventMgr.addEvent(BuildEvent.BUILD_PAOPAO_UPDATE, this.onBuildPaopaoUpdate, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
            EventMgr.removeEventByObject(BuildEvent.BUILD_PAOPAO_UPDATE, this);
        }

        /**泡泡更新 */
        public onBuildPaopaoUpdate(data: IBuildPP) {
            if (data.state == 0) {
                this.updatePPIcon(data.id, data.type, data.value, data.isMax);
            } else {
                this.removePPIcon(data.id);
            }
        }

        /**建筑升级 */
        private OnBuildUpLevel(buildId: number) {
            if (buildId == MBuildId.HALL_BUILD_ID) {
                var builds = this.m_pBuilds;
                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build = builds[key];
                        if (build)
                            build.checkActivation();
                    }
                }

                this.refreshSameTypeBuildView();
            }
        }
        /////////////////////////////////////////////////////////////////自定义事件
        protected listNotificationInterests(): any[] {
            return [TASK_UI.MAP_MAIN_MOVE];
        }

        protected handleNotification(notification: AGame.INotification) {
            let body = notification.getBody();
            let name = notification.getName();
            debug("BaseMap:handleNotification--->>", name, body);
            switch (name) {
                case TASK_UI.MAP_MAIN_MOVE: {
                    this.handlerMapData(body);
                    break;
                }
            }
        }

        /**解析建筑移动 */
        private handlerMapData(data: IMainMapData) {
            if (!data) return;
            //移动到建筑
            if (data.buildId) {
                if (data.buildAc && data.buildAc == 1 && MainMapModel.isActivation(data.buildId)) {
                    this.moveToBuildAndOpen(data.buildId, false);
                } else {
                    this.moveToBuild(data.buildId);
                }
            }
            if (data.funcId) {
                this.moveToFunc(data.funcId);
            }
            if (data.tipsParam) {
                Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, data.tipsParam);
            }
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


        public moveToBuildAndOpen(bId: number, isAutoLvelUp: boolean) {
            let build = this.getBuild(bId);
            if (build) {
                // 自动升级的话直接协议
                if (isAutoLvelUp) {
                    this.setForceCall(this.autoLevelUp, this, bId);
                } else {
                    this.setForceCall(this.onSelectBuild, this, build);
                }
                this.moveTo(build.x, build.y, true);
                build.setClickType(MBuildTouchType.BUILD);
            }
        }

        public static moveToBuildByOffest(bId: number, offest: Point = new Point(400, 0)) {
            let obj = this.getClass();
            if (obj) {
                obj.moveToBuildByOffset(bId, offest);
            }
        }

        public moveToBuildUI(bId: number) {
            let build = this.getBuild(bId);
            if (build) {
                let _y = (this.stage.stageHeight - 734) / 2;
                this.moveTo(build.x, build.y + _y, false);
            }

        }

        public static moveToBuildUI(bId: number) {
            let obj = this.getClass();
            if (obj) {
                obj.moveToBuildUI(bId);
            }
        }

        /**征收回调 */
        public static zsCall(type: number) {
            let obj = this.getClass();
            if (obj) {
                var builds = obj.m_pBuilds;
                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build: MBuild = builds[key];
                        if (build && build.getBuildType() == type)
                            build.zsCall();
                    }
                }
            }
        }
        /**征收回调 */
        public static ReSetSendZS(type: number) {
            let obj = this.getClass();
            if (obj) {
                var builds = obj.m_pBuilds;
                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build: MBuild = builds[key];
                        if (build && build.getBuildType() == type)
                            build.ReSetSendZS();
                    }
                }
            }
        }

        /**
         * 一键征收,移动到民居3,然后征收
         */
        public static autoLevy() {
            let obj = this.getClass();
            if (obj) {
                obj.autoLevy();
            }
        }

        public autoLevy() {
            let build = this.getBuild(8);
            if (build) {
                this.setForceCall(this.levyAll, this);
                this.moveTo(build.x, build.y, true);
                build.setClickType(MBuildTouchType.BUILD);
            }
        }

        public levyAll() {
            let typeList = [BuildingType.FARMLAND, BuildingType.LOGGING_CAMP, BuildingType.IRON_WORKS];
            for (let levyType of typeList) {
                MainMapProxy.send_BUILDING_LEVY(levyType);
            }
        }
        /**
         * 一键升级
         */
        public autoLevelUp(bId: number) {
            MainMapProxy.send_BUILDING_LEVY(MainMapModel.getBuildInfo(bId).type);
            MainMapProxy.send_BUILDING_UP_LEVEL(bId);
        }

        //添加额外的建筑
        private addSubsidiaryBuild() {

            let icon = new MapFuncIcon(FunctionType.ARENA);
            NodeUtils.setPosition(icon, 1216, 974);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.ARENA] = icon;

            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.HISTORY_WAR);
            NodeUtils.setPosition(icon, 1616, 395);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.HISTORY_WAR] = icon;
            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.APK);
            NodeUtils.setPosition(icon, 889, 934);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.APK] = icon;
            icon.addLabelToObj(this.m_labelLayer);


            icon = new MapFuncIcon(FunctionType.MATERIAL);
            NodeUtils.setPosition(icon, 1134, 750);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.MATERIAL] = icon;
            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.WATER_MONSTER);
            NodeUtils.setPosition(icon, 538, 390);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.WATER_MONSTER] = icon;
            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.HITWALLSOLDIER);
            NodeUtils.setPosition(icon, 826, 1486);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.HITWALLSOLDIER] = icon;
            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.BALLISTA);
            NodeUtils.setPosition(icon, 1016, 1618);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.BALLISTA] = icon;
            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.TENT);
            NodeUtils.setPosition(icon, 2385, 1785);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.TENT] = icon;
            icon.addLabelToObj(this.m_labelLayer);

            icon = new MapFuncIcon(FunctionType.BOOT);
            NodeUtils.setPosition(icon, 960, 337);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.BOOT] = icon;
            icon.addLabelToObj(this.m_labelLayer);



        }

        public static checkIsShowShopCloudBuild() {
            let obj = this.getClass();
            if (obj) {
                obj.checkIsShowShopCloudBuild();
            }
        }
        private checkIsShowShopCloudBuild() {
            let startTime = ConstUtil.getString(IConstEnum.CLOUD_SHOP_STIME);
            let endTime = ConstUtil.getString(IConstEnum.CLOUD_SHOP_ETIME);
            var sTime = startTime.split(':');
            var eTime = endTime.split(':');
            let now = TimerUtils.dateFormat("hh", TimerUtils.getServerTime());
            let nTime = parseInt(now);
        }

        /**检查训练cd */
        public static checkTrainCD(bId) {

        }

        public sortBuilds(): void {
            function sortY(d1: egret.DisplayObject, d2: egret.DisplayObject): number {

                if (d1.name == "shopBuild") {
                    return -1;
                }
                else if (d2.name == "shopBuild") {
                    return 1;
                }

                if (d1.y > d2.y) {
                    return 1;
                } else if (d1.y < d2.y) {
                    return -1;
                } else {
                    return 0;
                }
            }
            this.m_pBg.$children.sort(sortY);
        }


        public m_pStatuePos = {
            battle: { x: 312, y: 1415 }, //战争之王
            morality: { x: 168, y: 1415 }, //贤者之王
            fortune: { x: 520, y: 1415 }, //财富之王
            builder: { x: 168, y: 1583 }, //建造之王
            practice: { x: 520, y: 1580 }, //修炼之王
        }
        /**初始化膜拜雕像 */
        public initWorship() {
            let info: gameProto.S2C_COUNTRY_EMPEROR_INFO = CountryModel.getCountryEmperorInfo();
            if (info && info.nickName != '' && info.fight) {
                let battleKing = new StatueView({ name: info.nickName, countryId: info.country, statueType: StatueType.BattleKing });
                battleKing.x = this.m_pStatuePos.battle.x;
                battleKing.y = this.m_pStatuePos.battle.y;
                Utils.addChild(this.m_pBg, battleKing);
                this.m_pStatueList[StatueType.BattleKing] = battleKing;
            }




            // let morality = new StatueView({name: "贤者之王",countryId: 1, statueType: StatueType.MoralityKing});
            // morality.x = this.m_pStatuePos.morality.x;
            // morality.y = this.m_pStatuePos.morality.y;
            // Utils.addChild(this.m_pBg, morality);
            // this.m_pStatueList[StatueType.MoralityKing] = morality;

            // let fortune = new StatueView({name: "财富之王",countryId: 1, statueType: StatueType.FortuneKing});
            // fortune.x = this.m_pStatuePos.fortune.x;
            // fortune.y = this.m_pStatuePos.fortune.y;
            // Utils.addChild(this.m_pBg, fortune);
            // this.m_pStatueList[StatueType.FortuneKing] = fortune;

            // let builder = new StatueView({name: "建造之王",countryId: 1, statueType: StatueType.BuilderKing});
            // builder.x = this.m_pStatuePos.builder.x;
            // builder.y = this.m_pStatuePos.builder.y;
            // Utils.addChild(this.m_pBg, builder);
            // this.m_pStatueList[StatueType.BuilderKing] = builder;

            // let practice = new StatueView({name: "修炼之王",countryId: 1, statueType: StatueType.PracticeKing});
            // practice.x = this.m_pStatuePos.practice.x;
            // practice.y = this.m_pStatuePos.practice.y;
            // Utils.addChild(this.m_pBg, practice);
            // this.m_pStatueList[StatueType.PracticeKing] = practice;
        }


        /**
         * 获取实例
         */
        public static getClass(): MainMap {
            let obj = SceneManager.getClass(LayerEnums.MAP, MainMap.NAME);
            return obj;
        }

        /**获得文本层 */
        public static getLabelLayer() {
            let obj = this.getClass();
            if (obj) {
                return obj.getLabelLayer();
            }
            return null;
        }

        /**是否移动中 */
        public static isMove() {
            let obj = this.getClass();
            if (obj) {
                return obj.isMove();
            }
            return false;
        }

        public static hideGlow() {
            if (MainMap.m_pLastSelectBuild > 0) {
                let obj = this.getClass();
                if (obj) {
                    let build: MBuild = obj.m_pBuilds[MainMap.m_pLastSelectBuild];
                    if (build) {
                        build.isGlow(false);
                        MainMap.m_pLastSelectBuild = 0;
                    }
                }
            }
        }

        /**建筑立刻升级 */
        public static onBulidFastLevelUp(bId: number) {
            let obj = this.getClass();
            if (obj) {
                let build: MBuild = obj.m_pBuilds[bId];
                if (build) {
                    build.m_Efftype = MBuildEffType.UpLevel;
                    build.showLevelUpEffect(true);

                }
            }
        }
        //获取建筑结构
        public static getMBuildById(bId: number): MBuild {
            let obj = this.getClass();
            if (obj) {
                let build: MBuild = obj.m_pBuilds[bId];
                return build;
            }
            return null;
        }

        /**获得功能建筑 */
        public static getFuncBuildById(funcId: number): MapFuncIcon {
            let obj = this.getClass();
            if (obj) {
                let build = obj.m_pFuncBuilds[funcId];
                return build;
            }
            return null;
        }

        //获取建筑结构
        public static getMBuildByType(type: number): MBuild[] {
            let obj = this.getClass();
            let tempList: MBuild[] = [];
            if (obj) {
                for (let key in obj.m_pBuilds) {
                    let build: MBuild = obj.m_pBuilds[key];
                    if (build.getBuildType() == type) {
                        tempList.push(build);
                    }
                }
            }
            return tempList;
        }

        public static checkOutput(bId: number) {
            let obj = this.getClass();
            if (obj) {
                let build = obj.getBuild(bId);
                if (build) {
                    build.checkOutput();
                }
            }
        }

        /**显示产出动画 */
        public static showOutEffect(bId: number, count: number) {
            let obj = this.getClass();
            if (obj) {
                let paopao = obj.m_pPaopaos[bId];
                if (paopao) {
                    paopao.showOutEffect(count);
                }
            }
        }
        /**
         * 选中动画
         */
        public static showMoveSelectEffect(bId: number) {
            let obj = this.getClass();
            if (obj) {
                let build = obj.getBuild(bId);
                if (this.m_preBuild) {
                    let preBuild = obj.getBuild(this.m_preBuild);
                    preBuild.filters = [];
                    egret.Tween.removeTweens(preBuild)
                    this.m_preBuild = undefined;
                }
                if (build) {
                    this.m_preBuild = bId;
                    egret.Tween.get(build, { loop: true }).to({ factor: 1 }, 1000).to({ factor: 0 }, 1000)
                }
            }
        }
        public static moveToBuild(bId: number, isAni: boolean = true) {
            let obj = this.getClass();
            if (obj) {
                obj.moveToBuild(bId, isAni);
            }
        }

        public static moveToBuildAndOpen(bId: number, isAutoLvelUp: boolean = false) {
            let obj = this.getClass();
            if (obj) {
                obj.moveToBuildAndOpen(bId, isAutoLvelUp);
            }
        }

    }
}

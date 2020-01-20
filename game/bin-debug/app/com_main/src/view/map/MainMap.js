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
var com_main;
(function (com_main) {
    var MainMap = /** @class */ (function (_super_1) {
        __extends(MainMap, _super_1);
        function MainMap(data) {
            var _this = _super_1.call(this) || this;
            _this.m_pBuilds = {};
            _this.m_pFuncBuilds = {};
            _this.m_pStatueList = {};
            _this.m_pPaopaos = {};
            _this.m_pGenerals = [];
            _this.m_pEffects = [];
            _this.m_pIsLoadGenerals = false;
            _this.m_soliderList = []; //巡逻士兵列表
            _this.battleKey = 0;
            // public SCALE_DEF: number = 0.77;//默认大小
            _this.SCALE_DEF = 0.9; //默认大小
            _this.m_pStatuePos = {
                battle: { x: 312, y: 1415 },
                morality: { x: 168, y: 1415 },
                fortune: { x: 520, y: 1415 },
                builder: { x: 168, y: 1583 },
                practice: { x: 520, y: 1580 },
            };
            _this.name = MainMap.NAME;
            /**设置偏移量 */
            // this.m_pMapOffset[0] = 80;
            // this.m_pMapOffset[0] = 55;
            // this.m_pMapOffset[1] = 0;
            _this.m_pTileConfig = MapData.getMapMainConfig();
            // this.setIsCanScale(false);
            _this.setIsCanScale(true);
            _this.m_tParam = data;
            EffectData.addEffectModule(EffectData.MAIN_MAP, EffectMainMap);
            return _this;
        }
        MainMap.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_BUILDING_INFO,
                ProtoDef.S2C_BUILDING_ACTIVATED,
                ProtoDef.S2C_BUILDING_UPLEVEL,
                ProtoDef.S2C_BUILDING_SPEED,
                ProtoDef.BUILDING_CLEAN_COOLING,
                ProtoDef.PUSH_BUILDING_OPEN,
                ProtoDef.PUSH_BUILDING_ITEM,
                ProtoDef.GET_BUILDING_ITEM,
                ProtoDef.ARENA_ID,
            ];
        };
        /**处理协议号事件 */
        MainMap.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            // debug("WorldMap executes:", protocol, body)
            switch (protocol) {
                case ProtoDef.S2C_BUILDING_INFO: {
                    this.addBuilds();
                    break;
                }
                case ProtoDef.S2C_BUILDING_ACTIVATED: { // 请求建筑激活
                    var info = body.building;
                    // let id = info.type * 10 + info.pos;
                    var build = this.m_pBuilds[info.id];
                    if (build) {
                        build.checkActivation();
                        build.checkOutput();
                        if (MainMapModel.isNormalSourceBuilding(build.getBuildId())) {
                            this.refreshSameTypeBuildView();
                        }
                    }
                    break;
                }
                case ProtoDef.S2C_BUILDING_UPLEVEL: { // 请求建筑升级
                    var id = body.bId;
                    var build = this.getBuild(id);
                    if (build) {
                        build.checkCD(true);
                    }
                    break;
                }
                case ProtoDef.PUSH_BUILDING_OPEN: { // 推送建筑开放信息
                    var building = body.building;
                    for (var key in building) {
                        if (building.hasOwnProperty(key)) {
                            var element = building[key];
                            this.addBuild(element);
                        }
                    }
                    this.sortBuilds();
                    break;
                }
                case ProtoDef.BUILDING_CLEAN_COOLING: { // 请求金币清除冷却
                    break;
                }
                case ProtoDef.PUSH_BUILDING_ITEM: { //升级获得的道具列表
                    var list = body.items;
                    if (list) {
                        for (var key in list) {
                            if (list.hasOwnProperty(key)) {
                                var element = list[key];
                                var bId = element.bId;
                                var build = this.getBuild(bId);
                                if (build) {
                                    build.checkBuildItem();
                                }
                            }
                        }
                    }
                    break;
                }
                case ProtoDef.GET_BUILDING_ITEM: {
                    var bid = body.bid;
                    var build = this.getBuild(bid);
                    if (build) {
                        build.checkBuildItem();
                    }
                    break;
                }
            }
        };
        MainMap.prototype.onEnter = function () {
            _super_1.prototype.onEnter.call(this);
            var bg = this.m_pBg;
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
            }
            else {
                this.moveToBuild(BuildingType.AUDIENCE_HALL, false);
            }
            this.addEvent();
            //检查泡泡事件
            for (var i in this.m_pBuilds) {
                var build = this.m_pBuilds[i];
                build.checkOutput();
            }
            this.onGuideCondition();
        };
        MainMap.prototype.onExit = function () {
            _super_1.prototype.onExit.call(this);
            // Utils.TimerManager.remove(this.randomGeneralAction, this);
            this.removeEvent();
        };
        MainMap.prototype.creaetEffect = function (bitmapName, effectName, pos, rect, anchor) {
            var bitmap = new egret.Bitmap();
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
        };
        MainMap.prototype.initEffects = function () {
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
            var offX = 700;
            this.initSolider({
                soliderStartPostList: [[752 + offX, 1164], [729 + offX, 1176], [704 + offX, 1189]],
                move1: [909 + offX, 1080],
                move2: [981 + offX, 991],
                soliderEndPostList: [[1061 + offX, 939], [1041 + offX, 954], [1018 + offX, 969]],
                speed: 0.03,
                effectType1: IETypes.EMap_Solider_Right,
                effectType2: IETypes.EMap_Solider_Left
            });
            this.initSolider({
                soliderStartPostList: [[1561 + offX, 597], [1541 + offX, 611]],
                move1: [1453 + offX, 658],
                move2: [1375 + offX, 767],
                soliderEndPostList: [[1233 + offX, 850], [1206 + offX, 866]],
                speed: 0.03,
                effectType1: IETypes.EMap_Solider_Left,
                effectType2: IETypes.EMap_Solider_Right
            });
            this.initSolider({
                soliderStartPostList: [[1933 + offX, 1319], [1957 + offX, 1331]],
                move1: [2058 + offX, 1382],
                move2: [2182 + offX, 1448],
                soliderEndPostList: [[2359 + offX, 1567], [2383 + offX, 1584]],
                speed: 0.03,
                effectType1: IETypes.EMap_Farmer_Right_down,
                effectType2: IETypes.EMap_Farmer_Left_Up,
                anchor: [17, 23]
            });
            this.initFarmer1();
            // this.createBattlePlayer();
            // this.createBoss();
        };
        MainMap.prototype.initSolider = function (args) {
            var soliderStartPostList = args.soliderStartPostList; //城墙士兵起点
            var move1 = args.move1; //阶梯下
            var move2 = args.move2; //阶梯上
            var soliderEndPostList = args.soliderEndPostList; //城墙士兵终点
            var speed = args.speed; //行走速度
            var soliderCount = args.soliderStartPostList.length;
            var effectType1 = args.effectType1;
            var effectType2 = args.effectType2;
            var anchor = args.anchor;
            var soliderList = [];
            var soliderReverse = function () {
                for (var i = 0; i <= soliderCount - 1; i++) {
                    var sPoint = new egret.Point(soliderStartPostList[i][0], soliderStartPostList[i][1]);
                    var movePoint1 = new egret.Point(move1[0], move1[1]);
                    var movePoint2 = new egret.Point(move2[0], move2[1]);
                    var endPoint = new egret.Point(soliderEndPostList[i][0], soliderEndPostList[i][1]);
                    var solider = soliderList[i];
                    egret.Tween.removeTweens(solider);
                    solider.x = endPoint.x;
                    solider.y = endPoint.y;
                    EffectData.removeEffect(EffectData.MAIN_MAP, effectType1, solider);
                    EffectData.addEffect(EffectData.MAIN_MAP, effectType2, solider);
                    var tw = egret.Tween.get(solider);
                    var time1 = egret.Point.distance(sPoint, movePoint1) / speed;
                    var time2 = egret.Point.distance(movePoint1, movePoint2) / speed;
                    var time3 = egret.Point.distance(endPoint, movePoint2) / speed;
                    tw.wait(10)
                        .to({ x: movePoint2.x, y: movePoint2.y }, time3)
                        .to({ x: movePoint1.x, y: movePoint1.y }, time2)
                        .to({ x: sPoint.x, y: sPoint.y }, time1);
                    if (i == 0) {
                        tw.call(soliderMove);
                    }
                }
            };
            var soliderMove = function () {
                for (var i = 0; i <= soliderCount - 1; i++) {
                    var sPoint = new egret.Point(soliderStartPostList[i][0], soliderStartPostList[i][1]);
                    var movePoint1 = new egret.Point(move1[0], move1[1]);
                    var movePoint2 = new egret.Point(move2[0], move2[1]);
                    var endPoint = new egret.Point(soliderEndPostList[i][0], soliderEndPostList[i][1]);
                    var solider = soliderList[i];
                    egret.Tween.removeTweens(solider);
                    solider.x = sPoint.x;
                    solider.y = sPoint.y;
                    // let solider = this.creaetEffect('solider'+i,IETypes.EMap_Solider_Right,sPoint,null,{x:65,y:65});
                    EffectData.removeEffect(EffectData.MAIN_MAP, effectType2, solider);
                    EffectData.addEffect(EffectData.MAIN_MAP, effectType1, solider);
                    var tw = egret.Tween.get(solider);
                    var time1 = egret.Point.distance(sPoint, movePoint1) / speed;
                    var time2 = egret.Point.distance(movePoint1, movePoint2) / speed;
                    var time3 = egret.Point.distance(endPoint, movePoint2) / speed;
                    tw.to({ x: movePoint1.x, y: movePoint1.y }, time1)
                        .to({ x: movePoint2.x, y: movePoint2.y }, time2)
                        .to({ x: endPoint.x, y: endPoint.y }, time3);
                    if (i == 0) {
                        tw.call(soliderReverse);
                    }
                }
            };
            for (var i = 0; i <= soliderCount - 1; i++) {
                var sPoint = new egret.Point(soliderStartPostList[i][0], soliderStartPostList[i][1]);
                var movePoint1 = new egret.Point(move1[0], move1[1]);
                var movePoint2 = new egret.Point(move2[0], move2[1]);
                var endPoint = new egret.Point(soliderEndPostList[i][0], soliderEndPostList[i][1]);
                var anchorPoint = void 0;
                if (anchor) {
                    anchorPoint = { x: anchor[0], y: anchor[1] };
                }
                else {
                    anchorPoint = { x: 51, y: 51 };
                }
                var solider = this.creaetEffect('solider' + i, effectType1, sPoint, null, anchorPoint);
                soliderList.push(solider);
                this.m_soliderList.push(solider);
            }
            soliderMove();
        };
        MainMap.prototype.initFarmer1 = function () {
            var speed = 0.03; //行走速度
            var offX = 700;
            var pointList = [[2021 + offX, 1837], [1818 + offX, 1747], [1879 + offX, 1689], [1952 + offX, 1640], [2082 + offX, 1599]];
            var point1 = new egret.Point(pointList[0][0], pointList[0][1]);
            var point2 = new egret.Point(pointList[1][0], pointList[1][1]);
            var point3 = new egret.Point(pointList[2][0], pointList[2][1]);
            var point4 = new egret.Point(pointList[3][0], pointList[3][1]);
            var point5 = new egret.Point(pointList[4][0], pointList[4][1]);
            var farmer1 = this.creaetEffect('farmer1', IETypes.EMap_Farmer_Left_Up, point1, null, { x: 17, y: 23 });
            this.m_soliderList.push(farmer1);
            var tw = egret.Tween.get(farmer1, { loop: true });
            var time1 = egret.Point.distance(point1, point2) / speed;
            var time2 = egret.Point.distance(point2, point3) / speed;
            var time3 = egret.Point.distance(point3, point4) / speed;
            var time4 = egret.Point.distance(point4, point5) / speed;
            tw.to({ x: point2.x, y: point2.y }, time1)
                .call(function () { farmer1.scaleX = -1; })
                .to({ x: point3.x, y: point3.y }, time2)
                .to({ x: point4.x, y: point4.y }, time3)
                .to({ x: point5.x, y: point5.y }, time4)
                .call(function () {
                farmer1.scaleX = -1;
                EffectData.removeEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Left_Up, farmer1);
                EffectData.addEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Right_down, farmer1);
            })
                .to({ x: point4.x, y: point4.y }, time4)
                .to({ x: point3.x, y: point3.y }, time3)
                .to({ x: point2.x, y: point2.y }, time2)
                .call(function () { farmer1.scaleX = 1; })
                .to({ x: point1.x, y: point1.y }, time1)
                .call(function () {
                EffectData.removeEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Right_down, farmer1);
                EffectData.addEffect(EffectData.MAIN_MAP, IETypes.EMap_Farmer_Left_Up, farmer1);
            });
            // soliderList.push(solider);
        };
        /**检查新手引导面板条件 */
        MainMap.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MAIN_BUILD);
        };
        /**刷新建筑显示 */
        MainMap.prototype.refreshSameTypeBuildView = function () {
            var builds = this.m_pBuilds;
            var list = {};
            for (var key in builds) {
                if (builds.hasOwnProperty(key)) {
                    var element = builds[key];
                    if (MainMapModel.isNormalSourceBuilding(element.getBuildId())) {
                        var buildType = element.getBuildType();
                        if (!list[buildType]) {
                            list[buildType] = [];
                        }
                        list[buildType].push(element);
                    }
                }
            }
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var arr = list[key];
                    //升序
                    arr.sort(function (a, b) {
                        return a.getBuildVo().getActivationLevel() - b.getBuildVo().getActivationLevel();
                    });
                    var isShowLocked = true;
                    for (var i = 0; i < arr.length; i++) {
                        var build = arr[i];
                        var vo = arr[i].getBuildVo();
                        if (vo.isActivation() || vo.canActivation()) {
                            build.setBaseLayerVisible(true);
                        }
                        else {
                            if (isShowLocked) {
                                isShowLocked = false;
                                build.setBaseLayerVisible(true);
                            }
                            else {
                                build.setBaseLayerVisible(false);
                            }
                        }
                    }
                }
            }
        };
        /**
         * 添加建筑
         */
        MainMap.prototype.addBuilds = function () {
            var builds = MainMapModel.getBuildInfos();
            if (builds == null)
                return;
            var x = 0;
            var y = 0;
            for (var key in builds) {
                if (builds.hasOwnProperty(key)) {
                    var data = builds[key];
                    // if (data.id == MBuildId.XY) continue; //行营不要建筑icon
                    var build = this.addBuild(data);
                    if (data.type == BuildingType.AUDIENCE_HALL) {
                        x = build.x;
                        y = build.y;
                    }
                }
            }
            this.sortBuilds();
            this.moveTo(x, y, false);
            com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);
        };
        MainMap.prototype.addBuild = function (data) {
            var type = data.type;
            var pos = data.pos;
            // let index = type * 10 + pos;
            var id = data.id;
            var build = this.m_pBuilds[id];
            if (!build) {
                build = com_main.MBuild.create(type, pos, id);
                build.addLabelToObj(this.m_labelLayer);
                this.m_pBuilds[id] = build;
                Utils.addChild(this.m_pBg, build);
                this.addTileObject(build);
            }
            return build;
        };
        MainMap.prototype.onTouchEnd = function (e) {
            var rangeX = Math.abs(this.m_pTouchBeginPos.x - e.stageX);
            var rangeY = Math.abs(this.m_pTouchBeginPos.y - e.stageY);
            if (rangeX <= 10 && rangeY <= 10) {
                var res = this.onClickBuild(e);
                if (res) {
                    e.stopImmediatePropagation();
                }
            }
            else {
                // //
                // if (this.m_pIsCanMove)//主城地图如果不能拖动 说明在指引,功能面板不缩回
                //     this.showBuildFunctionMenuView(null);
            }
            _super_1.prototype.onTouchEnd.call(this, e);
        };
        //点击
        MainMap.prototype.onClickBuild = function (e) {
            /**新手引导点击 */
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
            Sound.playTap();
            for (var id_1 in this.m_pPaopaos) {
                var icon = this.m_pPaopaos[id_1];
                var res = icon.check_is_touch(e.stageX, e.stageY);
                if (res)
                    return;
            }
            for (var id_2 in this.m_pFuncBuilds) {
                var icon = this.m_pFuncBuilds[id_2];
                var res = icon.check_is_touch(e.stageX, e.stageY);
                if (res)
                    return;
            }
            for (var id_3 in this.m_pStatueList) {
                var icon = this.m_pStatueList[id_3];
                var res = icon.check_is_touch(e.stageX, e.stageY);
                if (res)
                    return;
            }
            var builds = this.m_pBuilds;
            var _build = null;
            var index = 0;
            for (var key in builds) {
                var build = builds[key];
                var id = builds[key].check_is_touch(e.stageX, e.stageY);
                if (id) {
                    debug("点中建筑id:", id);
                    var _index = build.parent.getChildIndex(build);
                    if (!_build || _index > index) {
                        _build = build;
                        index = _index;
                    }
                }
            }
            if (_build) {
                if (_build.getTouchType() != MBuildTouchType.BUILD) {
                    _build.onTouch();
                    return true;
                }
                var res = MainMapModel.openBuildFunc(_build.getBuildId());
                if (!res)
                    this.onSelectBuild(_build);
            }
            else {
                this.onSelectBuild(_build);
            }
        };
        MainMap.prototype.onSelectBuild = function (_build) {
            //指引会锁地图 如果没有点击到入口 不错回收处理
            if (!this.m_pIsCanMove) {
                if (!_build)
                    return;
            }
            //直接显示升级界面
            if (_build && _build.getBaseLayerVisible()) {
                if (_build.isMaxLevel()) {
                    EffectUtils.showTips(GCode(CLEnum.CITY_BD_MAX), 1, false);
                }
                else {
                    var type1 = MainMapModel.isInBuilding(_build.getBuildId()) ? FunctionType.BUILDING_GRADE_SPEED : FunctionType.BUILDING_GRADE;
                    FunctionModel.openFunctionByType(type1, _build.getBuildId());
                }
            }
        };
        /**
         * 销毁方法
         */
        MainMap.prototype.onDestroy = function () {
            MainMap.m_pLastSelectBuild = 0;
            // egret.Tween.removeTweens(this.m_pCloud1);
            // egret.Tween.removeTweens(this.m_pCloud2);
            for (var i in this.m_soliderList) {
                var solider = this.m_soliderList[i];
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
            _super_1.prototype.onDestroy.call(this);
        };
        /**根据id获取建筑 */
        MainMap.prototype.getBuild = function (bId) {
            var build = this.m_pBuilds[bId];
            if (build)
                return build;
            return null;
        };
        /**移动到功能建筑 */
        MainMap.prototype.moveToFunc = function (id) {
            var icon = this.m_pFuncBuilds[id];
            if (icon) {
                this.moveTo(icon.x, icon.y);
            }
        };
        MainMap.prototype.moveToBuild = function (bId, isAni) {
            if (isAni === void 0) { isAni = true; }
            // if (bId == MBuildId.XY) {//行营特殊处理
            //     this.moveTo(this.buildCheckPoint.x, this.buildCheckPoint.y, true);
            // } else {
            var build = this.getBuild(bId);
            if (build) {
                this.moveTo(build.x, build.y, isAni);
            }
            // }
        };
        MainMap.prototype.moveToBuildByOffset = function (bId, offset) {
            var build = this.getBuild(bId);
            if (build) {
                this.moveTo(build.x + offset.x, build.y + offset.y, true);
            }
        };
        /**=====================================================================================
         * 建筑泡泡 begin
         * =====================================================================================
         */
        /**添加泡泡 */
        MainMap.prototype.createPPIcon = function (id, type) {
            if (this.m_pPaopaos[id])
                return;
            var build = this.m_pBuilds[id];
            if (!build)
                return;
            var icon = com_main.MBuildPP.create(id, type);
            this.m_pPaopaos[id] = icon;
            Utils.addChild(this.m_pPaopaoLayer, icon);
            icon.x = build.x - icon.iconWidth * 0.5;
            icon.y = build.y - build.height * 0.5 - icon.iconHeight - 25;
            var offset = build.getPosInfo();
            if (offset) {
                icon.x += offset.nameOffset[0];
                icon.y += offset.nameOffset[1];
            }
        };
        /**移除泡泡 */
        MainMap.prototype.removePPIcon = function (id) {
            if (!this.m_pPaopaos[id])
                return;
            Utils.removeFromParent(this.m_pPaopaos[id]);
            delete this.m_pPaopaos[id];
        };
        /**刷新泡泡数值 */
        MainMap.prototype.updatePPIcon = function (id, type, value, isMax) {
            if (!this.m_pPaopaos[id]) {
                this.createPPIcon(id, type);
            }
            else {
                this.m_pPaopaos[id].type = type;
            }
            this.m_pPaopaos[id].setNum(value, isMax);
        };
        /**=====================================================================================
         * 建筑泡泡 end
         * =====================================================================================
         */
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MainMap.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.OnBuildUpLevel, this);
            com_main.EventMgr.addEvent(BuildEvent.BUILD_PAOPAO_UPDATE, this.onBuildPaopaoUpdate, this);
        };
        MainMap.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_PAOPAO_UPDATE, this);
        };
        /**泡泡更新 */
        MainMap.prototype.onBuildPaopaoUpdate = function (data) {
            if (data.state == 0) {
                this.updatePPIcon(data.id, data.type, data.value, data.isMax);
            }
            else {
                this.removePPIcon(data.id);
            }
        };
        /**建筑升级 */
        MainMap.prototype.OnBuildUpLevel = function (buildId) {
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
        };
        /////////////////////////////////////////////////////////////////自定义事件
        MainMap.prototype.listNotificationInterests = function () {
            return [TASK_UI.MAP_MAIN_MOVE];
        };
        MainMap.prototype.handleNotification = function (notification) {
            var body = notification.getBody();
            var name = notification.getName();
            debug("BaseMap:handleNotification--->>", name, body);
            switch (name) {
                case TASK_UI.MAP_MAIN_MOVE: {
                    this.handlerMapData(body);
                    break;
                }
            }
        };
        /**解析建筑移动 */
        MainMap.prototype.handlerMapData = function (data) {
            if (!data)
                return;
            //移动到建筑
            if (data.buildId) {
                if (data.buildAc && data.buildAc == 1 && MainMapModel.isActivation(data.buildId)) {
                    this.moveToBuildAndOpen(data.buildId, false);
                }
                else {
                    this.moveToBuild(data.buildId);
                }
            }
            if (data.funcId) {
                this.moveToFunc(data.funcId);
            }
            if (data.tipsParam) {
                Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, data.tipsParam);
            }
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        MainMap.prototype.moveToBuildAndOpen = function (bId, isAutoLvelUp) {
            var build = this.getBuild(bId);
            if (build) {
                // 自动升级的话直接协议
                if (isAutoLvelUp) {
                    this.setForceCall(this.autoLevelUp, this, bId);
                }
                else {
                    this.setForceCall(this.onSelectBuild, this, build);
                }
                this.moveTo(build.x, build.y, true);
                build.setClickType(MBuildTouchType.BUILD);
            }
        };
        MainMap.moveToBuildByOffest = function (bId, offest) {
            if (offest === void 0) { offest = new com_main.Point(400, 0); }
            var obj = this.getClass();
            if (obj) {
                obj.moveToBuildByOffset(bId, offest);
            }
        };
        MainMap.prototype.moveToBuildUI = function (bId) {
            var build = this.getBuild(bId);
            if (build) {
                var _y = (this.stage.stageHeight - 734) / 2;
                this.moveTo(build.x, build.y + _y, false);
            }
        };
        MainMap.moveToBuildUI = function (bId) {
            var obj = this.getClass();
            if (obj) {
                obj.moveToBuildUI(bId);
            }
        };
        /**征收回调 */
        MainMap.zsCall = function (type) {
            var obj = this.getClass();
            if (obj) {
                var builds = obj.m_pBuilds;
                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build = builds[key];
                        if (build && build.getBuildType() == type)
                            build.zsCall();
                    }
                }
            }
        };
        /**征收回调 */
        MainMap.ReSetSendZS = function (type) {
            var obj = this.getClass();
            if (obj) {
                var builds = obj.m_pBuilds;
                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build = builds[key];
                        if (build && build.getBuildType() == type)
                            build.ReSetSendZS();
                    }
                }
            }
        };
        /**
         * 一键征收,移动到民居3,然后征收
         */
        MainMap.autoLevy = function () {
            var obj = this.getClass();
            if (obj) {
                obj.autoLevy();
            }
        };
        MainMap.prototype.autoLevy = function () {
            var build = this.getBuild(8);
            if (build) {
                this.setForceCall(this.levyAll, this);
                this.moveTo(build.x, build.y, true);
                build.setClickType(MBuildTouchType.BUILD);
            }
        };
        MainMap.prototype.levyAll = function () {
            var typeList = [BuildingType.FARMLAND, BuildingType.LOGGING_CAMP, BuildingType.IRON_WORKS];
            for (var _i = 0, typeList_1 = typeList; _i < typeList_1.length; _i++) {
                var levyType = typeList_1[_i];
                MainMapProxy.send_BUILDING_LEVY(levyType);
            }
        };
        /**
         * 一键升级
         */
        MainMap.prototype.autoLevelUp = function (bId) {
            MainMapProxy.send_BUILDING_LEVY(MainMapModel.getBuildInfo(bId).type);
            MainMapProxy.send_BUILDING_UP_LEVEL(bId);
        };
        //添加额外的建筑
        MainMap.prototype.addSubsidiaryBuild = function () {
            var icon = new com_main.MapFuncIcon(FunctionType.ARENA);
            NodeUtils.setPosition(icon, 1216, 974);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.ARENA] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.HISTORY_WAR);
            NodeUtils.setPosition(icon, 1616, 395);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.HISTORY_WAR] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.APK);
            NodeUtils.setPosition(icon, 889, 934);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.APK] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.MATERIAL);
            NodeUtils.setPosition(icon, 1134, 750);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.MATERIAL] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.WATER_MONSTER);
            NodeUtils.setPosition(icon, 538, 390);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.WATER_MONSTER] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.HITWALLSOLDIER);
            NodeUtils.setPosition(icon, 826, 1486);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.HITWALLSOLDIER] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.BALLISTA);
            NodeUtils.setPosition(icon, 1016, 1618);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.BALLISTA] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.TENT);
            NodeUtils.setPosition(icon, 2385, 1785);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.TENT] = icon;
            icon.addLabelToObj(this.m_labelLayer);
            icon = new com_main.MapFuncIcon(FunctionType.BOOT);
            NodeUtils.setPosition(icon, 960, 337);
            this.m_pBg.addChild(icon);
            this.m_pFuncBuilds[FunctionType.BOOT] = icon;
            icon.addLabelToObj(this.m_labelLayer);
        };
        MainMap.checkIsShowShopCloudBuild = function () {
            var obj = this.getClass();
            if (obj) {
                obj.checkIsShowShopCloudBuild();
            }
        };
        MainMap.prototype.checkIsShowShopCloudBuild = function () {
            var startTime = ConstUtil.getString(IConstEnum.CLOUD_SHOP_STIME);
            var endTime = ConstUtil.getString(IConstEnum.CLOUD_SHOP_ETIME);
            var sTime = startTime.split(':');
            var eTime = endTime.split(':');
            var now = TimerUtils.dateFormat("hh", TimerUtils.getServerTime());
            var nTime = parseInt(now);
        };
        /**检查训练cd */
        MainMap.checkTrainCD = function (bId) {
        };
        MainMap.prototype.sortBuilds = function () {
            function sortY(d1, d2) {
                if (d1.name == "shopBuild") {
                    return -1;
                }
                else if (d2.name == "shopBuild") {
                    return 1;
                }
                if (d1.y > d2.y) {
                    return 1;
                }
                else if (d1.y < d2.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            this.m_pBg.$children.sort(sortY);
        };
        /**初始化膜拜雕像 */
        MainMap.prototype.initWorship = function () {
            var info = CountryModel.getCountryEmperorInfo();
            if (info && info.nickName != '' && info.fight) {
                var battleKing = new com_main.StatueView({ name: info.nickName, countryId: info.country, statueType: StatueType.BattleKing });
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
        };
        /**
         * 获取实例
         */
        MainMap.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.MAP, MainMap.NAME);
            return obj;
        };
        /**获得文本层 */
        MainMap.getLabelLayer = function () {
            var obj = this.getClass();
            if (obj) {
                return obj.getLabelLayer();
            }
            return null;
        };
        /**是否移动中 */
        MainMap.isMove = function () {
            var obj = this.getClass();
            if (obj) {
                return obj.isMove();
            }
            return false;
        };
        MainMap.hideGlow = function () {
            if (MainMap.m_pLastSelectBuild > 0) {
                var obj = this.getClass();
                if (obj) {
                    var build = obj.m_pBuilds[MainMap.m_pLastSelectBuild];
                    if (build) {
                        build.isGlow(false);
                        MainMap.m_pLastSelectBuild = 0;
                    }
                }
            }
        };
        /**建筑立刻升级 */
        MainMap.onBulidFastLevelUp = function (bId) {
            var obj = this.getClass();
            if (obj) {
                var build = obj.m_pBuilds[bId];
                if (build) {
                    build.m_Efftype = MBuildEffType.UpLevel;
                    build.showLevelUpEffect(true);
                }
            }
        };
        //获取建筑结构
        MainMap.getMBuildById = function (bId) {
            var obj = this.getClass();
            if (obj) {
                var build = obj.m_pBuilds[bId];
                return build;
            }
            return null;
        };
        /**获得功能建筑 */
        MainMap.getFuncBuildById = function (funcId) {
            var obj = this.getClass();
            if (obj) {
                var build = obj.m_pFuncBuilds[funcId];
                return build;
            }
            return null;
        };
        //获取建筑结构
        MainMap.getMBuildByType = function (type) {
            var obj = this.getClass();
            var tempList = [];
            if (obj) {
                for (var key in obj.m_pBuilds) {
                    var build = obj.m_pBuilds[key];
                    if (build.getBuildType() == type) {
                        tempList.push(build);
                    }
                }
            }
            return tempList;
        };
        MainMap.checkOutput = function (bId) {
            var obj = this.getClass();
            if (obj) {
                var build = obj.getBuild(bId);
                if (build) {
                    build.checkOutput();
                }
            }
        };
        /**显示产出动画 */
        MainMap.showOutEffect = function (bId, count) {
            var obj = this.getClass();
            if (obj) {
                var paopao = obj.m_pPaopaos[bId];
                if (paopao) {
                    paopao.showOutEffect(count);
                }
            }
        };
        /**
         * 选中动画
         */
        MainMap.showMoveSelectEffect = function (bId) {
            var obj = this.getClass();
            if (obj) {
                var build = obj.getBuild(bId);
                if (this.m_preBuild) {
                    var preBuild = obj.getBuild(this.m_preBuild);
                    preBuild.filters = [];
                    egret.Tween.removeTweens(preBuild);
                    this.m_preBuild = undefined;
                }
                if (build) {
                    this.m_preBuild = bId;
                    egret.Tween.get(build, { loop: true }).to({ factor: 1 }, 1000).to({ factor: 0 }, 1000);
                }
            }
        };
        MainMap.moveToBuild = function (bId, isAni) {
            if (isAni === void 0) { isAni = true; }
            var obj = this.getClass();
            if (obj) {
                obj.moveToBuild(bId, isAni);
            }
        };
        MainMap.moveToBuildAndOpen = function (bId, isAutoLvelUp) {
            if (isAutoLvelUp === void 0) { isAutoLvelUp = false; }
            var obj = this.getClass();
            if (obj) {
                obj.moveToBuildAndOpen(bId, isAutoLvelUp);
            }
        };
        MainMap.NAME = 'MainMap';
        MainMap.m_pLastSelectBuild = 0;
        MainMap.m_pIsShowTip = false;
        return MainMap;
    }(com_main.BaseMap));
    com_main.MainMap = MainMap;
})(com_main || (com_main = {}));

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
    var NoviceMap = /** @class */ (function (_super_1) {
        __extends(NoviceMap, _super_1);
        function NoviceMap() {
            var _this = _super_1.call(this) || this;
            _this.m_pBuilds = {};
            _this.name = NoviceMap.NAME;
            _this.m_pMapBgUrlMapping = [
                75, 76, 77, 78,
                95, 96, 97, 98,
                115, 116, 117, 118,
                135, 136, 137, 138,
            ];
            /**设置偏移量 */
            _this.m_pMapOffset[0] = 80;
            _this.m_pMapOffset[1] = 0;
            _this.m_pTileConfig = MapData.getMapNoviceConfig();
            _this.setIsCanScale(false);
            return _this;
            // this.setIsCanMove(false);
        }
        NoviceMap.prototype.listenerProtoNotifications = function () {
            return [
            // ProtoDef.CITY_BATTLE_NOVICE_AFFAIR,
            // ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR,
            // ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD,
            ];
        };
        /**处理协议号事件 */
        NoviceMap.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            // debug("WorldMap executes:", protocol, body)
            // switch (protocol) {
            //     case ProtoDef.CITY_BATTLE_NOVICE_AFFAIR: {
            //         let _type = body.type;
            //         let list = body.list;
            //         if (_type == WorldEventType.FIGHT) {
            //             let ids = body.remove_ids;
            //             /**清理之前的政务事件 */
            //             for (var key in ids) {
            //                 if (ids.hasOwnProperty(key)) {
            //                     var element = ids[key];
            //                     let build: NBuild = this.m_pBuilds[+key];
            //                     if (build) {
            //                         for (var _key in element) {
            //                             if (element.hasOwnProperty(_key)) {
            //                                 var _element = element[_key];
            //                                 build.removeWorldEvent(_element);
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         /**刷新最新的世界事件 */
            //         for (var key in list) {
            //             if (list.hasOwnProperty(key)) {
            //                 let build_id = list[key];
            //                 let build: NBuild = this.m_pBuilds[build_id];
            //                 if (build) {
            //                     build.refreshWorldEvents();
            //                 }
            //             }
            //         }
            //         break;
            //     }
            //     case ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR: {
            //         let id = body.id;
            //         let index = body.index;
            //         let build: NBuild = this.m_pBuilds[id];
            //         if (build) {
            //             if (body.startTime) {
            //                 build.addWorldEventCountDown(body);
            //             } else {
            //                 let bid = body.battleId;
            //                 build.removeWorldEvent(index);
            //                 if (bid) {
            //                     SceneManager.enterScene(SceneEnums.BATTLE_MAP, bid);
            //                 }
            //             }
            //         }
            //         break;
            //     }
            //     case ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD: {
            //         let id = body.id;
            //         let index = body.index;
            //         let build: NBuild = this.m_pBuilds[id];
            //         if (build) {
            //             build.removeWorldEvent(index);
            //         }
            //         break;
            //     }
            // }
        };
        NoviceMap.prototype.onEnter = function () {
            _super_1.prototype.onEnter.call(this);
            EffectData.addEffectModule(EffectData.WORLD_MAP, EffectWorldMap);
            this.addBuilds();
            this.initClouds();
            SceneManager.sceneCreateComplete();
        };
        NoviceMap.prototype.onResourceLoadComplete = function (groupName) {
            debug('成功加载资源组：', groupName);
            // if (groupName == 'map_world') {
            //     super.onEnter();
            //     this.addBuilds();
            // }
        };
        NoviceMap.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
            // debug("onResourceLoadProgress:",itemsLoaded, itemsTotal);
        };
        /**
         * 添加建筑
         */
        NoviceMap.prototype.addBuilds = function () {
            var builds = C.NoviceMapConfig;
            if (builds == null)
                return;
            var x = 0;
            var y = 0;
            // for (var key in builds) {
            //     if (builds.hasOwnProperty(key)) {
            //         var data = builds[key];
            //         let build = this.addBuild(data);
            //         if (data.id == 1) {
            //             x = build.x;
            //             y = build.y;
            //         }
            //     }
            // }
            // this.sortBuilds();
            // this.moveTo(x, y, false);
        };
        NoviceMap.prototype.addBuild = function (data) {
            // let id = data.id;
            // let build = NBuild.create(data);
            // this.m_pBuilds[id] = build;
            // Utils.addChild(this.m_pBg, build);
            // this.addTileObject(build);
            // return build;
        };
        /**
         * 用户点击界面
         */
        NoviceMap.prototype.onTouch = function (e) {
            // MapEventConfirm.remove();
            for (var key in this.m_pBuilds) {
                var build = this.m_pBuilds[key];
                var id = this.m_pBuilds[key].check_is_touch(e.stageX, e.stageY);
                if (id) {
                    debug("点中建筑id:", id);
                    build = null;
                    return true;
                }
                build = null;
            }
            return false;
        };
        /**
         * 销毁方法
         */
        NoviceMap.prototype.onDestroy = function () {
            // MapEventConfirm.remove();
            com_main.MapBery.MapBeryStopFly();
            var builds = this.m_pBuilds;
            for (var key in builds) {
                if (builds.hasOwnProperty(key)) {
                    var element = builds[key];
                    element.onDestroy();
                }
            }
            delete this.m_pBuilds;
            this.m_pBuilds = null;
            NoviceMapModel.clear();
            _super_1.prototype.onDestroy.call(this);
        };
        /**根据id获取建筑 */
        NoviceMap.prototype.getBuild = function (bId) {
            var info = MainMapModel.getBuildInfo(bId);
            if (info) {
                var build = this.m_pBuilds[bId];
                if (build)
                    return build;
            }
            return null;
        };
        NoviceMap.prototype.moveToBuild = function (bId) {
            var build = this.getBuild(bId);
            if (build) {
                this.moveTo(build.x + build.width / 2, build.y + build.height / 2, false);
            }
        };
        NoviceMap.moveToBuild = function (bId) {
            var obj = this.getClass();
            if (obj) {
                obj.moveToBuild(bId);
            }
        };
        /**
         * 获取实例
         */
        NoviceMap.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.MAP, NoviceMap.NAME);
            return obj;
        };
        NoviceMap.moveCloud = function () {
            var obj = this.getClass();
            if (obj) {
                obj.moveCloud();
            }
        };
        NoviceMap.prototype.moveCloud = function () {
            var cloud1 = null;
            var cloud2 = null;
            switch (NoviceMap.m_pCloudStatus) {
                case 0: {
                    cloud1 = this.m_pBg.getChildByName('cloud' + 2);
                    cloud2 = this.m_pBg.getChildByName('cloud' + 3);
                    NoviceMap.m_pCloudStatus = 1;
                    break;
                }
                case 1: {
                    cloud1 = this.m_pBg.getChildByName('cloud' + 0);
                    cloud2 = this.m_pBg.getChildByName('cloud' + 1);
                    NoviceMap.m_pCloudStatus = 2;
                    break;
                }
            }
            if (cloud1) {
                egret.Tween.get(cloud1).to({ x: cloud1.x - 500, alpha: 0 }, 1000).call(function () {
                    Utils.removeFromParent(cloud1);
                }, this);
            }
            if (cloud2) {
                egret.Tween.get(cloud2).to({ x: cloud2.x + 500, alpha: 0 }, 1000).call(function () {
                    Utils.removeFromParent(cloud2);
                }, this);
            }
        };
        NoviceMap.refreshIcon = function () {
            var self = this.getClass();
            if (self) {
                var builds = self.m_pBuilds;
                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build = builds[key];
                        build.refreshEventIcon();
                    }
                }
            }
        };
        /**初始化云雾 */
        NoviceMap.prototype.initClouds = function () {
            if (RoleData.countryId > 0)
                return;
            var texture = RES.getRes('guide_cloud_png');
            if (texture) {
                var pos = [
                    [-300, 300, 2],
                    [300, 300, 2],
                    [-300, 500, 2],
                    [300, 500, 2],
                    [-300, 1100, 2],
                    [300, 1200, 2],
                ];
                for (var key in pos) {
                    if (pos.hasOwnProperty(key)) {
                        var element = pos[key];
                        var x = element[0];
                        var y = element[1];
                        var s = element[2];
                        var bm = new egret.Bitmap(texture);
                        bm.x = x;
                        bm.y = y;
                        bm.scaleX = s;
                        bm.scaleY = s;
                        bm.name = 'cloud' + key;
                        Utils.addChild(this.m_pBg, bm);
                    }
                }
            }
        };
        NoviceMap.m_pCloudStatus = 0; //新手场景云雾状态0未散开  1散开了第一个，  2散开了第二个
        NoviceMap.NAME = 'NoviceMap';
        return NoviceMap;
    }(com_main.BaseMap));
    com_main.NoviceMap = NoviceMap;
})(com_main || (com_main = {}));

module com_main {
    export class NoviceMap extends BaseMap {
        public static m_pCloudStatus: number = 0;//新手场景云雾状态0未散开  1散开了第一个，  2散开了第二个

        private m_pBuilds: any = {};

        public static NAME = 'NoviceMap';

        public constructor() {
            super();
            this.name = NoviceMap.NAME;

            this.m_pMapBgUrlMapping = [
                75, 76, 77, 78,
                95, 96, 97, 98,
                115, 116, 117, 118,
                135, 136, 137, 138,
            ];

            /**设置偏移量 */
            this.m_pMapOffset[0] = 80;
            this.m_pMapOffset[1] = 0;

            this.m_pTileConfig = MapData.getMapNoviceConfig();

            this.setIsCanScale(false);
            // this.setIsCanMove(false);
        }

        protected listenerProtoNotifications(): any[] {
            return [
                // ProtoDef.CITY_BATTLE_NOVICE_AFFAIR,
                // ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR,
                // ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());

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
        }

        public onEnter() {
            super.onEnter();
            EffectData.addEffectModule(EffectData.WORLD_MAP, EffectWorldMap);

            this.addBuilds();

            this.initClouds();

            SceneManager.sceneCreateComplete();
        }

        private onResourceLoadComplete(groupName: any): void {
            debug('成功加载资源组：', groupName);
            // if (groupName == 'map_world') {
            //     super.onEnter();
            //     this.addBuilds();
            // }
        }

        private onResourceLoadProgress(itemsLoaded, itemsTotal): void {
            // debug("onResourceLoadProgress:",itemsLoaded, itemsTotal);
        }

        /**
         * 添加建筑
         */
        public addBuilds() {
            let builds = C.NoviceMapConfig;
            if (builds == null)
                return;

            let x = 0;
            let y = 0;

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
        }

        public addBuild(data: any) {
            // let id = data.id;

            // let build = NBuild.create(data);
            // this.m_pBuilds[id] = build;
            // Utils.addChild(this.m_pBg, build);
            // this.addTileObject(build);

            // return build;
        }

        /**
         * 用户点击界面
         */
        public onTouch(e: egret.TouchEvent): boolean {
            // MapEventConfirm.remove();

            for (var key in this.m_pBuilds) {
                var build: MBuild = this.m_pBuilds[key];
                var id = (<MBuild>this.m_pBuilds[key]).check_is_touch(e.stageX, e.stageY);

                if (id) {
                    debug("点中建筑id:", id);

                    build = null;
                    return true;
                }

                build = null;
            }
            return false;
        }

        /**
         * 销毁方法
         */
        public onDestroy() {
            // MapEventConfirm.remove();

            MapBery.MapBeryStopFly();

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

            super.onDestroy();

        }

        /**根据id获取建筑 */
        public getBuild(bId: number): MBuild {
            let info = MainMapModel.getBuildInfo(bId);
            if (info) {
                let build: MBuild = this.m_pBuilds[bId];

                if (build)
                    return build;
            }

            return null;
        }

        public moveToBuild(bId: number) {
            let build = this.getBuild(bId);
            if (build) {
                this.moveTo(build.x + build.width / 2, build.y + build.height / 2, false);
            }
        }

        public static moveToBuild(bId: number) {
            let obj = this.getClass();
            if (obj) {
                obj.moveToBuild(bId);
            }
        }

        /**
         * 获取实例
         */
        public static getClass(): NoviceMap {
            let obj = SceneManager.getClass(LayerEnums.MAP, NoviceMap.NAME);
            return obj;
        }


        public static moveCloud() {
            let obj = this.getClass();
            if (obj) {
                obj.moveCloud();
            }
        }

        public moveCloud() {
            let cloud1 = null;
            let cloud2 = null;

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
                egret.Tween.get(cloud1).to({ x: cloud1.x - 500, alpha: 0 }, 1000).call(() => {
                    Utils.removeFromParent(cloud1);
                }, this);
            }

            if (cloud2) {
                egret.Tween.get(cloud2).to({ x: cloud2.x + 500, alpha: 0 }, 1000).call(() => {
                    Utils.removeFromParent(cloud2);
                }, this);
            }
        }

        public static refreshIcon() {
            let self = this.getClass();
            if (self) {
                var builds = self.m_pBuilds;

                for (var key in builds) {
                    if (builds.hasOwnProperty(key)) {
                        var build = builds[key];
                        build.refreshEventIcon();
                    }
                }
            }
        }

        /**初始化云雾 */
        public initClouds() {
            if (RoleData.countryId > 0) return;
            let texture = RES.getRes('guide_cloud_png');
            if (texture) {
                let pos = [
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
                        let x = element[0];
                        let y = element[1];
                        let s = element[2];

                        let bm = new egret.Bitmap(texture);
                        bm.x = x;
                        bm.y = y;
                        bm.scaleX = s;
                        bm.scaleY = s;
                        bm.name = 'cloud' + key;
                        Utils.addChild(this.m_pBg, bm);
                    }
                }
            }
        }
    }
}
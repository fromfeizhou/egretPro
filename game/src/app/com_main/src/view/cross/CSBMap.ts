/**
 * 跨服战内城战地图
 */
module com_main {
    export class CSBMap extends CView {
        public static NAME = 'CSBMap';

        public m_allGroup: eui.Group;
        public m_map: eui.Image;
        public m_build_3: com_main.CSBBuildingComp;
        public m_build_1: com_main.CSBBuildingComp;
        public m_build_2: com_main.CSBBuildingComp;
        public m_build_4: com_main.CSBBuildingComp;
        public m_build_5: com_main.CSBBuildingComp;
        public m_build_7: com_main.CSBBuildingComp;
        public m_build_6: com_main.CSBBuildingComp;
        public m_wayGroup: eui.Group;
        public m_heroGroup: eui.Group;
        public m_labAttTime: eui.Label;

        private m_buildMenu: CSBBuildMenuComp;
        private m_myCamp: com_main.CSBBuildingComp;
        private m_buildInfo: CSBBuildInfoTips;

        private m_bTick: boolean;
        private m_nCountDown: number;//倒计时

        public constructor() {
            super();
            this.name = CSBMap.NAME;
            this.initApp("cross/CSBMapSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE,
                ProtoDef.S2C_CROSS_SERVER_WAR_ENTER,
                ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE,
                ProtoDef.S2C_CROSS_SERVER_CITY_STATUS,
                ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE: {
                    this.create_way(body);
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_ENTER:
                    let data = body as gameProto.IS2C_CROSS_SERVER_WAR_ENTER;

                    this.refreshCity(data.areaList);
                    this.setMyCamp();
                    break;
                case ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE: {
                    let data = body as gameProto.IS2C_CROSS_SERVER_CITY_CHANGE;
                    this.refreshCity([data.areaData]);
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_CITY_STATUS: {
                    let data = body as gameProto.IS2C_CROSS_SERVER_CITY_STATUS;
                    this.refreshCityByCId(CrossModel.getCIdByWarAreaId(data.cityId));
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO: {
                    this.updateTroopHp();
                    break;
                }
            }
        }

        public onDestroy() {
            super.onDestroy();
            this.clearTimeHandler()
            CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(2);
            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(CrossWarEvent.CROSS_BUILD_INFO, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();

            this.addEvent();
            SceneManager.sceneCreateComplete();

            this.setCityId();

            CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(1);

            this.initTimeTick();
        }

        /**结算倒计时 */
        private initTimeTick() {
            this.m_nCountDown = CrossModel.closeTime - TimerUtils.getServerTime();
            if (this.m_nCountDown > 0) {
                this.m_bTick = true;
                this.m_nCountDown++;
                this.onTimeHandler();
                Utils.TimerManager.doTimer(1000, 0, this.onTimeHandler, this);
            }
        }

        private onTimeHandler() {
            this.m_nCountDown--;
            if (this.m_nCountDown > 0) {
                this.m_labAttTime.text = `倒计时：${TimerUtils.diffTimeFormat('hh:mm:ss', this.m_nCountDown)}`;
            } else {
                this.clearTimeHandler();
            }
        }
        /**清理时间回调 */
        private clearTimeHandler() {
            if (!this.m_bTick) return;
            this.m_bTick = false;
            Utils.TimerManager.remove(this.onTimeHandler, this);
        }

        protected addEvent() {
            for (let i = 1; i <= 7; i++) {
                EventManager.addTouchTapListener(this['m_build_' + i], this, this.onclickBuild);
            }
            EventManager.addTouchTapListener(this.m_map, this, this.onclickMap);

            EventMgr.addEvent(CrossWarEvent.CROSS_BUILD_INFO, this.showBuildInfo, this);
        }

        private setCityId() {
            for (let i = 1; i <= 7; i++) {
                this['m_build_' + i].bId = i;
            }
        }

        private refreshCity(data: gameProto.IWarAreaVo[]) {
            for (let i of data) {
                this['m_build_' + i.areaId].refreshCityState();
            }
        }

        private refreshCityByCId(cId: number) {
            this.refreshCity([CrossModel.getCityInfoById(cId)]);
        }

        private updateTroopHp() {
            if (this.m_myCamp)
                this.m_myCamp.refreshCampHp();
        }

        private setMyCamp() {
            if (CrossModel.getCityInfoById(6).isMyGroup) {
                this.m_myCamp = this.m_build_6;
            } else {
                this.m_myCamp = this.m_build_7;
            }
        }

        private showBuildInfo(arg) {
            if (!this.m_buildInfo) {
                this.m_buildInfo = new CSBBuildInfoTips();
                this.m_allGroup.addChild(this.m_buildInfo);
            }
            let build = this['m_build_' + arg];
            this.m_buildInfo.visible = true;
            this.m_buildInfo.x = build.x + 30;
            this.m_buildInfo.y = build.y - 70;

            this.m_buildInfo.setBuildId(build.bId);
        }

        private hideBuildInfo() {
            if (this.m_buildInfo) {
                this.m_buildInfo.visible = false;
            }
        }

        private onclickBuild(e: egret.TouchEvent) {
            this.hideBuildInfo();

            this.m_build_1.select = true;
            let target = e.target;
            let i = 0;
            while (isNull(target.bId) && i < 10) {
                target = target.parent;
                i++;
            }
            console.log('点钟建筑id =', target.bId)

            for (let i = 1; i <= 7; i++) {
                if (target.bId == i) {
                    this['m_build_' + i].select = true;
                    this.addMuneToBuild(target);
                } else {
                    this['m_build_' + i].select = false;
                }
            }
        }

        public addMuneToBuild(build: com_main.CSBBuildingComp) {
            if (!this.m_buildMenu) {
                this.m_buildMenu = new CSBBuildMenuComp();
                this.m_allGroup.addChild(this.m_buildMenu);
            }
            this.m_buildMenu.visible = true;
            this.m_buildMenu.x = build.x - 42;
            this.m_buildMenu.y = build.y + 130;

            this.m_buildMenu.setBuildId(build.bId);
        }

        public onclickMap() {
            if (this.m_buildMenu) {
                this.m_buildMenu.visible = false;
            }
            this.hideBuildInfo();
        }

        /**
         * 创建路线
         * @returns egret.Bitmap
         */
        private line: eui.Image;
        private lineNun: number = 1;
        private create_way(data: gameProto.S2C_CROSS_SERVER_TEAM_MOVE) {
            if (this.line) {
                Utils.removeFromParent(this.line);

            }

            let r1 = 0;
            let r2 = 0;
            if (data.fromCityId) {
                r1 = CrossModel.getCIdByWarAreaId(data.fromCityId);
            } else {
                if (data.occupant == 1) {
                    r1 = 6;
                } else {
                    r1 = 7;
                }
            }
            if (data.toCityId) {
                r2 = CrossModel.getCIdByWarAreaId(data.toCityId);
            } else {
                if (data.occupant == 1) {
                    r2 = 6;
                } else {
                    r2 = 7;
                }
            }

            let startPoint = this["m_build_" + r1].getPoint();
            let endPoint = this["m_build_" + r2].getPoint();


            let way = new AttackWay(startPoint, endPoint);
            this.m_wayGroup.addChild(way);

            let hero = new CrossHero({ startPoint: startPoint, endPoint: endPoint, faction: data.occupant, playerName: data.playerName });
            this.m_heroGroup.addChild(hero);
        }
    }
}
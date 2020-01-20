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
/**
 * 跨服战内城战地图
 */
var com_main;
(function (com_main) {
    var CSBMap = /** @class */ (function (_super_1) {
        __extends(CSBMap, _super_1);
        function CSBMap() {
            var _this = _super_1.call(this) || this;
            _this.lineNun = 1;
            _this.name = CSBMap.NAME;
            _this.initApp("cross/CSBMapSkin.exml");
            return _this;
        }
        CSBMap.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE,
                ProtoDef.S2C_CROSS_SERVER_WAR_ENTER,
                ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE,
                ProtoDef.S2C_CROSS_SERVER_CITY_STATUS,
                ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO
            ];
        };
        CSBMap.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE: {
                    this.create_way(body);
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_ENTER:
                    var data = body;
                    this.refreshCity(data.areaList);
                    this.setMyCamp();
                    break;
                case ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE: {
                    var data_1 = body;
                    this.refreshCity([data_1.areaData]);
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_CITY_STATUS: {
                    var data_2 = body;
                    this.refreshCityByCId(CrossModel.getCIdByWarAreaId(data_2.cityId));
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO: {
                    this.updateTroopHp();
                    break;
                }
            }
        };
        CSBMap.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.clearTimeHandler();
            CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(2);
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(CrossWarEvent.CROSS_BUILD_INFO, this);
        };
        CSBMap.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
            this.addEvent();
            SceneManager.sceneCreateComplete();
            this.setCityId();
            CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(1);
            this.initTimeTick();
        };
        /**结算倒计时 */
        CSBMap.prototype.initTimeTick = function () {
            this.m_nCountDown = CrossModel.closeTime - TimerUtils.getServerTime();
            if (this.m_nCountDown > 0) {
                this.m_bTick = true;
                this.m_nCountDown++;
                this.onTimeHandler();
                Utils.TimerManager.doTimer(1000, 0, this.onTimeHandler, this);
            }
        };
        CSBMap.prototype.onTimeHandler = function () {
            this.m_nCountDown--;
            if (this.m_nCountDown > 0) {
                this.m_labAttTime.text = "\u5012\u8BA1\u65F6\uFF1A" + TimerUtils.diffTimeFormat('hh:mm:ss', this.m_nCountDown);
            }
            else {
                this.clearTimeHandler();
            }
        };
        /**清理时间回调 */
        CSBMap.prototype.clearTimeHandler = function () {
            if (!this.m_bTick)
                return;
            this.m_bTick = false;
            Utils.TimerManager.remove(this.onTimeHandler, this);
        };
        CSBMap.prototype.addEvent = function () {
            for (var i = 1; i <= 7; i++) {
                com_main.EventManager.addTouchTapListener(this['m_build_' + i], this, this.onclickBuild);
            }
            com_main.EventManager.addTouchTapListener(this.m_map, this, this.onclickMap);
            com_main.EventMgr.addEvent(CrossWarEvent.CROSS_BUILD_INFO, this.showBuildInfo, this);
        };
        CSBMap.prototype.setCityId = function () {
            for (var i = 1; i <= 7; i++) {
                this['m_build_' + i].bId = i;
            }
        };
        CSBMap.prototype.refreshCity = function (data) {
            for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
                var i = data_3[_i];
                this['m_build_' + i.areaId].refreshCityState();
            }
        };
        CSBMap.prototype.refreshCityByCId = function (cId) {
            this.refreshCity([CrossModel.getCityInfoById(cId)]);
        };
        CSBMap.prototype.updateTroopHp = function () {
            if (this.m_myCamp)
                this.m_myCamp.refreshCampHp();
        };
        CSBMap.prototype.setMyCamp = function () {
            if (CrossModel.getCityInfoById(6).isMyGroup) {
                this.m_myCamp = this.m_build_6;
            }
            else {
                this.m_myCamp = this.m_build_7;
            }
        };
        CSBMap.prototype.showBuildInfo = function (arg) {
            if (!this.m_buildInfo) {
                this.m_buildInfo = new com_main.CSBBuildInfoTips();
                this.m_allGroup.addChild(this.m_buildInfo);
            }
            var build = this['m_build_' + arg];
            this.m_buildInfo.visible = true;
            this.m_buildInfo.x = build.x + 30;
            this.m_buildInfo.y = build.y - 70;
            this.m_buildInfo.setBuildId(build.bId);
        };
        CSBMap.prototype.hideBuildInfo = function () {
            if (this.m_buildInfo) {
                this.m_buildInfo.visible = false;
            }
        };
        CSBMap.prototype.onclickBuild = function (e) {
            this.hideBuildInfo();
            this.m_build_1.select = true;
            var target = e.target;
            var i = 0;
            while (isNull(target.bId) && i < 10) {
                target = target.parent;
                i++;
            }
            console.log('点钟建筑id =', target.bId);
            for (var i_1 = 1; i_1 <= 7; i_1++) {
                if (target.bId == i_1) {
                    this['m_build_' + i_1].select = true;
                    this.addMuneToBuild(target);
                }
                else {
                    this['m_build_' + i_1].select = false;
                }
            }
        };
        CSBMap.prototype.addMuneToBuild = function (build) {
            if (!this.m_buildMenu) {
                this.m_buildMenu = new com_main.CSBBuildMenuComp();
                this.m_allGroup.addChild(this.m_buildMenu);
            }
            this.m_buildMenu.visible = true;
            this.m_buildMenu.x = build.x - 42;
            this.m_buildMenu.y = build.y + 130;
            this.m_buildMenu.setBuildId(build.bId);
        };
        CSBMap.prototype.onclickMap = function () {
            if (this.m_buildMenu) {
                this.m_buildMenu.visible = false;
            }
            this.hideBuildInfo();
        };
        CSBMap.prototype.create_way = function (data) {
            if (this.line) {
                Utils.removeFromParent(this.line);
            }
            var r1 = 0;
            var r2 = 0;
            if (data.fromCityId) {
                r1 = CrossModel.getCIdByWarAreaId(data.fromCityId);
            }
            else {
                if (data.occupant == 1) {
                    r1 = 6;
                }
                else {
                    r1 = 7;
                }
            }
            if (data.toCityId) {
                r2 = CrossModel.getCIdByWarAreaId(data.toCityId);
            }
            else {
                if (data.occupant == 1) {
                    r2 = 6;
                }
                else {
                    r2 = 7;
                }
            }
            var startPoint = this["m_build_" + r1].getPoint();
            var endPoint = this["m_build_" + r2].getPoint();
            var way = new com_main.AttackWay(startPoint, endPoint);
            this.m_wayGroup.addChild(way);
            var hero = new com_main.CrossHero({ startPoint: startPoint, endPoint: endPoint, faction: data.occupant, playerName: data.playerName });
            this.m_heroGroup.addChild(hero);
        };
        CSBMap.NAME = 'CSBMap';
        return CSBMap;
    }(com_main.CView));
    com_main.CSBMap = CSBMap;
})(com_main || (com_main = {}));

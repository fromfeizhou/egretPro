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
var MainMapProxy = /** @class */ (function (_super_1) {
    __extends(MainMapProxy, _super_1);
    function MainMapProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    MainMapProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.BUILDING_CLEAN_COOLING, this, 'BuildingCleanCoolingReq', 'BuildingCleanCoolingResp'],
            [ProtoDef.PUSH_BUILDING_OPEN, this, '', 'BuildingOpenInfo'],
        ];
    };
    // 监听协议
    MainMapProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TOUCH_BUILDING, this, 'C2S_TOUCH_BUILDING', ProxyEnum.SEND],
            [ProtoDef.C2S_BUILDING_INFO, this, 'C2S_BUILDING_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_BUILDING_INFO, this, 'S2C_BUILDING_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_BUILDING_ACTIVATED, this, 'C2S_BUILDING_ACTIVATED', ProxyEnum.SEND],
            [ProtoDef.S2C_BUILDING_ACTIVATED, this, 'S2C_BUILDING_ACTIVATED', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_BUILDING_UPLEVEL, this, 'C2S_BUILDING_UPLEVEL', ProxyEnum.SEND],
            [ProtoDef.S2C_BUILDING_UPLEVEL, this, 'S2C_BUILDING_UPLEVEL', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_BUILDING_SPEED, this, 'C2S_BUILDING_SPEED', ProxyEnum.SEND],
            [ProtoDef.S2C_BUILDING_SPEED, this, 'S2C_BUILDING_SPEED', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_BUILDING_LEVY, this, 'C2S_BUILDING_LEVY', ProxyEnum.SEND],
            [ProtoDef.S2C_BUILDING_LEVY, this, 'S2C_BUILDING_LEVY', ProxyEnum.RECEIVE],
        ];
    };
    MainMapProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_BUILDING_INFO: { // 请求建筑信息
                //let buildings = body.buildings;
                MainMapModel.init(body);
                break;
            }
            case ProtoDef.S2C_BUILDING_ACTIVATED: { // 请求建筑激活
                var data = body;
                MainMapModel.updateBuild(data.building);
                if (data.buildingLevy) {
                    MainMapModel.initBuildLevy([data.buildingLevy]);
                }
                if (data.trainArmys) {
                    MainMapModel.initBuildArmy([data.trainArmys]);
                }
                com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);
                com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_ACTIVATED, data.building.id);
                break;
            }
            case ProtoDef.S2C_BUILDING_UPLEVEL: { // 请求建筑升级
                Loading.hide();
                var data = body;
                var bId = body.bId;
                if (data.resultCode == 0) {
                    //zb
                    // let startTime = (<Long>body.buildStartTime).toNumber();
                    // let endTime = (<Long>body.buildEndTime).toNumber();
                    // let harvestTime = (<Long>body.harvestTime).toNumber();
                    var startTime = body.buildStartTime;
                    var endTime = body.buildEndTime;
                    var harvestTime = body.harvestTime;
                    MainMapModel.resetHarvestTimeById(bId, harvestTime);
                    MainMapModel.startBuildUpLevel(bId, startTime, endTime);
                    com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);
                }
                else {
                    MainMapModel.setLevel(bId, data.newLevel);
                }
                break;
            }
            case ProtoDef.PUSH_BUILDING_OPEN: { // 推送建筑开放信息
                var building = body.building;
                for (var key in building) {
                    if (building.hasOwnProperty(key)) {
                        var element = building[key];
                        MainMapModel.updateBuild(element);
                    }
                }
                break;
            }
            case ProtoDef.S2C_BUILDING_SPEED: { // 请求建筑加速
                Loading.hide();
                var data = body;
                if (data.retCode == 0) {
                    if (data.speedTime == 0) { //0 代表立刻完成
                        MainMapModel.finishBuildUpLevel(data.bId);
                        com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_FAST_UP_LEVEL, data.bId);
                    }
                    else {
                        // let speedTime = Long.fromValue(body.speedTime).toNumber();
                        MainMapModel.addBuildUpLvSpeed(data.bId, data.speedTime);
                    }
                }
                break;
            }
            case ProtoDef.BUILDING_CLEAN_COOLING: { // 请求金币清除冷却
                Loading.hide();
                MainMapModel.finishBuildUpLevel(body.bId);
                break;
            }
            case ProtoDef.S2C_BUILDING_LEVY: { //征收资源回调
                var data = body;
                Loading.hide();
                var errorCode = data.errorCode;
                var buildingLevy = data.buildingLevy;
                if (errorCode > 0) {
                    Utils.showErrorCode(errorCode);
                }
                if (data.levyData) {
                    var element_1 = data.levyData;
                    var type = element_1.type;
                    // //zb
                    // // let harvestTime = (<Long>element.harvestTime).toNumber();
                    // let harvestTime = element.harvestTime;
                    if (errorCode == 0) {
                        var harvestTime = data.buildingLevy[0].harvestTime;
                        MainMapModel.resetHarvestTime(type, harvestTime);
                    }
                    com_main.MainMap.zsCall(type);
                }
                // if (data.buildingLevy) {
                // 	MainMapModel.initBuildLevy(data.buildingLevy);
                // }
                break;
            }
            // case ProtoDef.MANUFACTURE_PROPS: {
            // 	MainMapModel.addprops(body.prop);
            // 	break;
            // }
            // case ProtoDef.GET_PROPS: {
            // 	MainMapModel.deleteprops(body.id);
            // 	break;
            // }
            // case ProtoDef.PUSH_BUILDING_ITEM: {
            // 	MainMapModel.addBuildItems(body.items, false);
            // 	break;
            // }
            // case ProtoDef.GET_BUILDING_ITEM: {
            // 	let bid = body.bid;
            // 	MainMapModel.removeBuildItem(bid);
            // 	break;
            // }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**通知服务器建筑升级 */
    MainMapProxy.C2S_TOUCH_BUILDING = function (bId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TOUCH_BUILDING);
        data.bId = bId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求建筑信息 */
    MainMapProxy.send_BUILDING_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求建筑激活 */
    MainMapProxy.send_BUILDING_ACTIVATED = function (bId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_ACTIVATED);
        data.bId = bId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求建筑升级 */
    MainMapProxy.send_BUILDING_UP_LEVEL = function (bId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_UPLEVEL);
        data.bId = bId;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**请求建筑加速 */
    MainMapProxy.send_BUILDING_SPEED = function (bId, propId, num, isConst) {
        if (isConst === void 0) { isConst = false; }
        if (!isConst) {
            var buildVo = MainMapModel.getBuildInfo(bId);
            if (!buildVo || buildVo.isBuildEnd())
                return;
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_SPEED);
        data.bId = bId;
        data.itemId = propId;
        data.itemNum = num;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**请求金币清除冷却 */
    MainMapProxy.send_BUILDING_CLEAN_COOLING = function (bId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.BUILDING_CLEAN_COOLING);
        data.bId = bId;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**征收资源
     * bId  建筑id（传-1为一键征收）
     */
    MainMapProxy.send_BUILDING_LEVY = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_LEVY);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    return MainMapProxy;
}(BaseProxy));

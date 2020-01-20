/**
 * 练兵营
 */
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
var SoldierProxy = /** @class */ (function (_super_1) {
    __extends(SoldierProxy, _super_1);
    function SoldierProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    SoldierProxy.prototype.listenerProtoNotifications = function () {
        return [
            // [ProtoDef.TRAINING_CLEAN_COOLING, this, 'TrainCleanCoolingReq', 'TrainCleanCoolingResp'],// 请求金币清除练兵冷却
            [ProtoDef.GET_ARMY, this, 'GetArmyReq', 'GetArmyResp'],
            [ProtoDef.ARMY_UPGRADE_LEVEL, this, 'ArmyUpgradeLevelReq', 'ArmyUpgradeLevelResp'],
        ];
    };
    // 监听协议
    SoldierProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TRAINING_ARMY, this, 'C2S_TRAINING_ARMY', ProxyEnum.SEND],
            [ProtoDef.S2C_TRAINING_ARMY, this, 'S2C_TRAINING_ARMY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TRAINING_SPEED, this, 'C2S_TRAINING_SPEED', ProxyEnum.SEND],
            [ProtoDef.S2C_TRAINING_SPEED, this, 'S2C_TRAINING_SPEED', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TRAINING_GET, this, 'C2S_TRAINING_GET', ProxyEnum.SEND],
            [ProtoDef.S2C_TRAINING_GET, this, 'S2C_TRAINING_GET', ProxyEnum.RECEIVE],
        ];
    };
    SoldierProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        debug("PropProxy body:", body);
        switch (protocol) {
            ////练兵清CD
            case ProtoDef.S2C_TRAINING_SPEED: {
                var data = body;
                if (data.itemId == 0) {
                    MainMapModel.resetArmysByBuildid(data.bId);
                    SoldierProxy.send_C2S_TRAINING_GET(data.bId);
                    // SoldierProxy.send_GET_ARMY();
                }
                else {
                    MainMapModel.SpeedUpTrain(data.bId, data.speedTime);
                    var armType = MainMapModel.getSoliderTypeByBuildId(data.bId);
                    // SoldierProxy.send_GET_ARMY();
                    if (!MainMapModel.isInTrain(data.bId)) {
                        // 主动获得获得练兵信息
                        SoldierProxy.send_GET_ARMY();
                    }
                }
                var soldierType = MainMapModel.getSoliderTypeByBuildId(data.bId);
                com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, soldierType);
                break;
            }
            case ProtoDef.GET_ARMY: { //请求兵种数量
                var arr = TeamModel.parseTroopsInfo(body);
                break;
            }
            case ProtoDef.ARMY_UPGRADE_LEVEL: { //兵种升级
                var data = body;
                var info = TeamModel.getTroopsInfo(data.armyType);
                info.level = data.level;
                var param = {
                    armyType: body.armyType,
                    level: body.level
                };
                com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_UPGRADE, param);
                break;
            }
            case ProtoDef.S2C_TRAINING_ARMY: {
                if (body.trainArmy) {
                    MainMapModel.updateArmyInfo(body.trainArmy);
                    //更新状态
                    MainMapModel.updateBuildArmysById(body.trainArmy.bId);
                    var soldierType = MainMapModel.getSoliderTypeByBuildId(body.trainArmy.bId);
                    com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, soldierType);
                    break;
                }
            }
            case ProtoDef.S2C_TRAINING_GET: { //征收士兵回调
                var buildVo = MainMapModel.getBuildInfo(body.bId);
                //清掉建筑存量士兵
                buildVo.clearTrainOutNum();
                SoldierProxy.send_GET_ARMY();
                com_main.EventMgr.dispatchEvent(ArmyEvent.ARMY_FINISH, null);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求练兵 */
    SoldierProxy.send_TRAINING_ARMY = function (bId, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TRAINING_ARMY);
        data.bId = bId;
        if (num <= 0)
            return;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**练兵加速 */
    SoldierProxy.send_C2S_TRAINING_SPEED = function (bId, propId, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TRAINING_SPEED);
        data.bId = bId;
        data.itemId = propId;
        data.itemNum = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求兵数据 */
    SoldierProxy.send_GET_ARMY = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_ARMY);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**兵种升级 */
    SoldierProxy.send_ARMY_UPGRADE_LEVEL = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ARMY_UPGRADE_LEVEL);
        data.armyType = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    SoldierProxy.send_C2S_TRAINING_GET = function (bId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TRAINING_GET);
        data.bId = bId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    SoldierProxy.isOpenView = false;
    return SoldierProxy;
}(BaseProxy));

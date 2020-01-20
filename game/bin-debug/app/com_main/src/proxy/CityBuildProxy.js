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
var CityBuildProxy = /** @class */ (function (_super_1) {
    __extends(CityBuildProxy, _super_1);
    function CityBuildProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    CityBuildProxy.prototype.listenerProtoNotifications = function () {
        return [];
    };
    CityBuildProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_CITY_MADE_INFO, this, 'C2S_CITY_MADE_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_MADE_INFO, this, 'S2C_CITY_MADE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_MADE, this, 'C2S_CITY_MADE', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_MADE, this, 'S2C_CITY_MADE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_MADE_SPEED, this, 'C2S_CITY_MADE_SPEED', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_MADE_SPEED, this, 'S2C_CITY_MADE_SPEED', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_MADE_REWARD, this, 'C2S_CITY_MADE_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_MADE_REWARD, this, 'S2C_CITY_MADE_REWARD', ProxyEnum.RECEIVE],
        ];
    };
    CityBuildProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        debug("WorldProxy===protocol: " + protocol, body);
        switch (protocol) {
            case ProtoDef.S2C_CITY_MADE_INFO: { //玩家城市建造信息
                var data = body;
                if (isNull(data))
                    break;
                var mi = data.playerMadeInfo;
                var sumExp = data.sumExp;
                var cityProgress = data.cityProgress;
                CityBuildModel.initPlayerMadeInfo(mi);
                CityBuildModel.initSumExp(sumExp);
                CityBuildModel.initPlayerMadeInfoExp(cityProgress);
                CityBuildModel.initNpcLevel = data.npcLevel;
                break;
            }
            case ProtoDef.S2C_CITY_MADE: { //建造
                var data = body;
                if (isNull(data))
                    break;
                CityBuildProxy.C2S_CITY_MADE_INFO(CityBuildModel.curCityId);
                // let mi: gameProto.IPlayerMadeInfo[] = data.playerMadeInfo;
                // CityBuildModel.initPlayerMadeInfo(mi);
                break;
            }
            case ProtoDef.S2C_CITY_MADE_SPEED: { //建造加速
                var data = body;
                if (isNull(data))
                    break;
                // CityBuildProxy.C2S_CITY_MADE_INFO(CityBuildModel.curCityId);
                var mi = data.playerMadeInfo;
                CityBuildModel.initPlayerMadeInfo(mi);
                break;
            }
            case ProtoDef.S2C_CITY_MADE_REWARD: { //领取奖励
                var data = body;
                if (isNull(data))
                    break;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.rewards);
                // CityBuildModel.rewardCity(CityBuildModel.curCityId);
                // CityBuildProxy.C2S_CITY_MADE_INFO(CityBuildModel.curCityId);
                break;
            }
            // default:
            //     break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**玩家城市建造信息*/
    CityBuildProxy.C2S_CITY_MADE_INFO = function (cityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE_INFO);
        data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**建造*/
    CityBuildProxy.C2S_CITY_MADE = function (generalId, cityId, isNow) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE);
        data.generalId = generalId;
        data.cityId = cityId;
        data.isNow = isNow;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**建造加速*/
    CityBuildProxy.C2S_CITY_MADE_SPEED = function (cityId, itemId, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE_SPEED);
        data.cityId = cityId;
        data.itemId = itemId;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**领取奖励*/
    CityBuildProxy.C2S_CITY_MADE_REWARD = function (cityId, generalId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE_REWARD);
        data.cityId = cityId;
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    CityBuildProxy.m_pVersion = null; //城池缓存的数据版本
    return CityBuildProxy;
}(BaseProxy));

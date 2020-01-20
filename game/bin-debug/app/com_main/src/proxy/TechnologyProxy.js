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
var TechnologyProxy = /** @class */ (function (_super_1) {
    __extends(TechnologyProxy, _super_1);
    function TechnologyProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    TechnologyProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TECHNOLOGY_VIEW, this, 'C2S_TECHNOLOGY_VIEW', ProxyEnum.SEND],
            [ProtoDef.S2C_TECHNOLOGY_VIEW, this, 'S2C_TECHNOLOGY_VIEW', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TECHNOLOGY_UPGRADE, this, 'C2S_TECHNOLOGY_UPGRADE', ProxyEnum.SEND],
            [ProtoDef.S2C_TECHNOLOGY_UPGRADE, this, 'S2C_TECHNOLOGY_UPGRADE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TECHNOLOGY_INFO, this, 'C2S_TECHNOLOGY_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_TECHNOLOGY_INFO, this, 'S2C_TECHNOLOGY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TECHNOLOGY_SPEEDUP, this, 'C2S_TECHNOLOGY_SPEEDUP', ProxyEnum.SEND],
            [ProtoDef.S2C_TECHNOLOGY_SPEEDUP, this, 'S2C_TECHNOLOGY_SPEEDUP', ProxyEnum.RECEIVE],
        ];
    };
    TechnologyProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_TECHNOLOGY_VIEW: {
                var data = body;
                TechnoModel.parseTechnoList(data.technoloyList);
                TechnoModel.parseTimeData(data.upgradeState);
                break;
            }
            case ProtoDef.S2C_TECHNOLOGY_UPGRADE: {
                var data = body;
                if (data.errorCode == 0) {
                    if (!data.gold) {
                        TechnoModel.parseTimeData(data.upgradeState);
                    }
                    else {
                        TechnoModel.updateTechnoInfo(data.technology);
                        // 主动获得获得练兵信息
                        SoldierProxy.send_GET_ARMY(); //科技会有加成
                    }
                }
                break;
            }
            case ProtoDef.S2C_TECHNOLOGY_INFO: {
                var data = body;
                TechnoModel.updateTechnoInfo(data.technology);
                // 主动获得获得练兵信息
                SoldierProxy.send_GET_ARMY(); //科技会有加成
                break;
            }
            case ProtoDef.S2C_TECHNOLOGY_SPEEDUP: {
                var data = body;
                if (data.errorCode == 0) {
                    TechnoModel.parseTimeData(data.state);
                }
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**
     * 科技面板请求
     */
    TechnologyProxy.C2S_TECHNOLOGY_VIEW = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_VIEW);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 升级科技请求
     */
    TechnologyProxy.C2S_TECHNOLOGY_UPGRADE = function (id, isGold) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_UPGRADE);
        data.id = id;
        data.gold = isGold;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //请求某个科技数据（倒数后请求）
    TechnologyProxy.C2S_TECHNOLOGY_INFO = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_INFO);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //请求科技立刻升级
    TechnologyProxy.C2S_TECHNOLOGY_SPEEDUP = function (id, itemId, num) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_SPEEDUP);
        data.id = id;
        data.itemId = itemId;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    };
    TechnologyProxy.isOpenView = true;
    return TechnologyProxy;
}(BaseProxy));

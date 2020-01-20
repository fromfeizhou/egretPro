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
var TavernProxy = /** @class */ (function (_super_1) {
    __extends(TavernProxy, _super_1);
    function TavernProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    TavernProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.TAVERN_INFO, this, 'TavernInfoReq', 'TavernInfoResp'],
            [ProtoDef.TAVERN_ATTRACT, this, 'TavernAttractReq', 'TavernAttractResp'],
        ];
    };
    TavernProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_SCORE_EXCHANGE, this, 'C2S_SCORE_EXCHANGE', ProxyEnum.SEND],
            [ProtoDef.S2C_SCORE_EXCHANGE, this, 'S2C_SCORE_EXCHANGE', ProxyEnum.RECEIVE],
        ];
    };
    TavernProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.TAVERN_INFO: {
                var data = body;
                NormalModel.free = data.freeAttract;
                com_main.EventMgr.dispatchEvent(TavernEvent.TAVERN_UPDATE_FREE, null);
                break;
            }
            case ProtoDef.S2C_SCORE_EXCHANGE: { //保底积分兑换
                var data = body;
                Utils.open_view(TASK_UI.TAVERN_INFO_PANEL, data);
                TavernProxy.send_TAVERN_INFO();
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**
     * 获得招募信息
     */
    TavernProxy.send_TAVERN_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TAVERN_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 招募(0--1次  1---10次)
     */
    TavernProxy.send_TAVERN_ATTRACT = function (tavernType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TAVERN_ATTRACT);
        data.tavernType = tavernType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**积分兑换红将*/
    TavernProxy.C2S_SCORE_EXCHANGE = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SCORE_EXCHANGE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return TavernProxy;
}(BaseProxy));

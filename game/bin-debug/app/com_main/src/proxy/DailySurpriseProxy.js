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
 * 每日惊喜商城
 */
var DailySurpriseProxy = /** @class */ (function (_super_1) {
    __extends(DailySurpriseProxy, _super_1);
    function DailySurpriseProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    DailySurpriseProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_SURPRISE_MARKET, this, 'C2S_SURPRISE_MARKET', ProxyEnum.SEND],
            [ProtoDef.S2C_SURPRISE_MARKET, this, 'S2C_SURPRISE_MARKET', ProxyEnum.RECEIVE],
        ];
    };
    DailySurpriseProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_SURPRISE_MARKET: {
                var data = body;
                if (data)
                    DailySurpriseModel.parseDailySurprise(data);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**每日惊喜商城 */
    DailySurpriseProxy.C2S_SURPRISE_MARKET = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SURPRISE_MARKET);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return DailySurpriseProxy;
}(BaseProxy));

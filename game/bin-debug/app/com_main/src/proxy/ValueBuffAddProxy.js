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
var ValueBuffAddProxy = /** @class */ (function (_super_1) {
    __extends(ValueBuffAddProxy, _super_1);
    function ValueBuffAddProxy() {
        return _super_1.call(this) || this;
    }
    ValueBuffAddProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.VALUEBUFF_TYPE_ADD, this, 'ValueBuffAddReq', 'ValueBuffAddResp'],
        ];
    };
    ValueBuffAddProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.VALUEBUFF_TYPE_ADD: {
                if (body.sumAdd) {
                    RoleData.arenaExp = body.sumAdd;
                }
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**
     * 发送资源加成请求
     */
    ValueBuffAddProxy.send_VALUEBUFF_TYPE_ADD = function (type) {
        debug("VersusProxy:send_VALUEBUFF_TYPE_ADD--->>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.VALUEBUFF_TYPE_ADD);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return ValueBuffAddProxy;
}(BaseProxy));

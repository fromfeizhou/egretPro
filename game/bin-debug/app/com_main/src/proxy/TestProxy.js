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
var TestProxy = /** @class */ (function (_super_1) {
    __extends(TestProxy, _super_1);
    function TestProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    TestProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.S2C_WAR_BATTLE_INIT, this, 'BattleListReq', 'BattleListResp'],
        ];
    };
    TestProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
    };
    TestProxy.test = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.S2C_WAR_BATTLE_INIT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return TestProxy;
}(BaseProxy));

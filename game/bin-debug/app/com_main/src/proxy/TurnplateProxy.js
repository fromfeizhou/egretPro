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
//转盘
var TurnplateProxy = /** @class */ (function (_super_1) {
    __extends(TurnplateProxy, _super_1);
    function TurnplateProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    TurnplateProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.TURN_TABLE_VIEW, this, 'TurnTableReq', 'TurnTableResp'],
            [ProtoDef.SPIN_TURN_TABLE, this, 'SpinTurnTableReq', 'SpinTurnTableResp'],
        ];
    };
    TurnplateProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.TURN_TABLE_VIEW: {
                TurnplateModel.initTurnTableInfo(body);
                break;
            }
            case ProtoDef.SPIN_TURN_TABLE: {
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**转盘信息 */
    TurnplateProxy.send_TURN_TABLE_VIEW = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TURN_TABLE_VIEW);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**转盘奖励 */
    TurnplateProxy.send_SPIN_TURN_TABLE = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SPIN_TURN_TABLE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    TurnplateProxy.isOpenView = false;
    return TurnplateProxy;
}(BaseProxy));

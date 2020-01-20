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
var FateProxy = /** @class */ (function (_super_1) {
    __extends(FateProxy, _super_1);
    function FateProxy() {
        return _super_1.call(this) || this;
    }
    FateProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_RELATION_EFFECT, this, 'C2S_RELATION_EFFECT', ProxyEnum.SEND],
            [ProtoDef.S2C_RELATION_EFFECT, this, 'S2C_RELATION_EFFECT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_RELATION_LIST, this, 'C2S_RELATION_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_RELATION_LIST, this, 'S2C_RELATION_LIST', ProxyEnum.RECEIVE],
        ];
    };
    FateProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_RELATION_EFFECT: {
                var data = body;
                if (data.code == 0) {
                    FateModel.updateActiveList(data.id);
                    FateModel.updateCurFateTypeLevel(data.id);
                    com_main.EventMgr.dispatchEvent(FateEvent.FATE_DATA_CHANGE, data.id);
                }
                break;
            }
            case ProtoDef.S2C_RELATION_LIST: {
                var data = body;
                FateModel.updateGneralFateActiveList(data);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    FateProxy.C2S_RELATION_EFFECT = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RELATION_EFFECT);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    FateProxy.C2S_RELATION_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RELATION_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return FateProxy;
}(BaseProxy));

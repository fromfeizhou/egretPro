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
 * 功能协议处理
 */
var FunctionProxy = /** @class */ (function (_super_1) {
    __extends(FunctionProxy, _super_1);
    function FunctionProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    FunctionProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_FUNCTION_PREVIEW, this, 'C2S_FUNCTION_PREVIEW', ProxyEnum.SEND],
            [ProtoDef.S2C_FUNCTION_PREVIEW, this, 'S2C_FUNCTION_PREVIEW', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_FUNCTION_INFO, this, 'C2S_FUNCTION_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_FUNCTION_INFO, this, 'S2C_FUNCTION_INFO', ProxyEnum.RECEIVE],
        ];
    };
    FunctionProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_FUNCTION_INFO: {
                FunctionModel.updateFunctionList(body.funtionIds);
                break;
            }
            case ProtoDef.S2C_FUNCTION_PREVIEW: {
                var data = body;
                FunctionModel.updateFunction(data);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**发送功能预览状态 */
    FunctionProxy.send_C2S_FUNCTION_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_FUNCTION_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**发送功能预览状态 */
    FunctionProxy.C2S_FUNCTION_PREVIEW = function (funcId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_FUNCTION_PREVIEW);
        data.functionId = funcId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return FunctionProxy;
}(BaseProxy));

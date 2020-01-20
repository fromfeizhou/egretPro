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
 * boss挑战
 */
var MaterialProxy = /** @class */ (function (_super_1) {
    __extends(MaterialProxy, _super_1);
    function MaterialProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    MaterialProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_MATERIAL_INFO, this, 'C2S_MATERIAL_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_MATERIAL_INFO, this, 'S2C_MATERIAL_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MATERIAL_CHALLENGE, this, 'C2S_MATERIAL_CHALLENGE', ProxyEnum.SEND],
            [ProtoDef.C2S_MATERIAL_BUY, this, 'C2S_MATERIAL_BUY', ProxyEnum.SEND],
            [ProtoDef.S2C_MATERIAL_BUY, this, 'S2C_MATERIAL_BUY', ProxyEnum.RECEIVE],
        ];
    };
    MaterialProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_MATERIAL_INFO: { //获得信息
                MaterialModel.MaterialData(body);
                if (MaterialProxy.isOpenView) {
                    MaterialProxy.isOpenView = false;
                    Utils.open_view(TASK_UI.MATERIAL_INFO_PANEL, { tag: MaterialModel.copyType });
                }
                break;
            }
            case ProtoDef.S2C_MATERIAL_BUY: { //购买次数返回
                MaterialModel.reBuyCountData(body);
                EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC), 1, true);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**发送获得材料副本信息*/
    MaterialProxy.C2S_MATERIAL_INFO_OPEN = function () {
        this.isOpenView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**发送获得材料副本信息*/
    MaterialProxy.C2S_MATERIAL_INFO = function () {
        this.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 挑战 扫荡材料副本请求*/
    MaterialProxy.C2S_MATERIAL_CHALLENGE = function (id, bool) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_CHALLENGE);
        data.id = id;
        data.sweep = bool;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**请求购买次数*/
    MaterialProxy.C2S_MATERIAL_BUY = function (type, count) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_BUY);
        data.type = type;
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    };
    MaterialProxy.isOpenView = false;
    return MaterialProxy;
}(BaseProxy));

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
var GuideProxy = /** @class */ (function (_super_1) {
    __extends(GuideProxy, _super_1);
    function GuideProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    /**第二版协议监听 */
    GuideProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_GUIDE_RECORD, this, 'C2S_GUIDE_RECORD', ProxyEnum.SEND],
            [ProtoDef.S2C_GUIDE_RECORD, this, 'S2C_GUIDE_RECORD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GUIDE_COMMIT, this, 'C2S_GUIDE_COMMIT', ProxyEnum.SEND],
        ];
    };
    GuideProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_GUIDE_RECORD: {
                var data = body;
                GuideModel.parseGuideRecord(data.records);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**查询新手进程 */
    GuideProxy.C2S_GUIDE_RECORD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GUIDE_RECORD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**提交新手进程 */
    GuideProxy.C2S_GUIDE_COMMIT = function (id) {
        if (RoleData.playerId == 0)
            return;
        if (!GuideModel.records || GuideModel.records.indexOf(id) >= 0)
            return;
        GuideModel.records.push(id);
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GUIDE_COMMIT);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return GuideProxy;
}(BaseProxy));

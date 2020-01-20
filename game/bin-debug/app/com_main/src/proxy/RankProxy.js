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
var RankProxy = /** @class */ (function (_super_1) {
    __extends(RankProxy, _super_1);
    function RankProxy() {
        return _super_1.call(this) || this;
    }
    /**第二版协议监听 */
    RankProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_RANK_COMM, this, 'C2S_RANK_COMM', ProxyEnum.SEND],
            [ProtoDef.S2C_RANK_COMM, this, 'S2C_RANK_COMM', ProxyEnum.RECEIVE],
        ];
    };
    RankProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_RANK_COMM: {
                var data = body;
                RankModel.parseRankData(data.rankId, data.rankData, data.userRankData);
                Loading.hide();
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /////////////////////////////////////////////////////////////////////
    /**
     * 排行榜查询
     */
    RankProxy.C2S_RANK_COMM = function (rankType) {
        if (RankModel.hasCache(rankType))
            return;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RANK_COMM);
        data.rankId = rankType;
        data.page = 1;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    return RankProxy;
}(BaseProxy));

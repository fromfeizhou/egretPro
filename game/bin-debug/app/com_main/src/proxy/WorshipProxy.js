/**
 * 膜拜协议
 */
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
var WorshipProxy = /** @class */ (function (_super_1) {
    __extends(WorshipProxy, _super_1);
    function WorshipProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    WorshipProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_WORSHIP, this, 'C2S_WORSHIP', ProxyEnum.SEND],
            [ProtoDef.S2C_WORSHIP, this, 'S2C_WORSHIP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WORSHIP_INFO, this, 'C2S_WORSHIP_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_WORSHIP_INFO, this, 'S2C_WORSHIP_INFO', ProxyEnum.RECEIVE],
        ];
    };
    WorshipProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_WORSHIP: {
                var data = body;
                if (data.ret == 0) { //膜拜成功
                    if (data.worshipType == WorshipType.KING) {
                        WorshipModel.worshipState = [{ worshipType: WorshipType.KING, canWorship: false }];
                        RedPointModel.onRedPointEvtUpdate(RedEvtType.BATTLE_KING_WORSHIP);
                    }
                    else if (data.worshipType == WorshipType.FIGHT_RANK) {
                        WorshipModel.worshipState = [{ worshipType: WorshipType.FIGHT_RANK, canWorship: false }];
                        RedPointModel.onRedPointEvtUpdate(RedEvtType.FIGHT_RANK_WORSHIP);
                    }
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
                    // EffectUtils.showTips('膜拜成功', 1, true);
                    WorshipProxy.send_C2S_WORSHIP_INFO(data.worshipType);
                }
                break;
            }
            case ProtoDef.S2C_WORSHIP_INFO: {
                WorshipModel.worshipData = body.datas;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**膜拜*/
    WorshipProxy.send_C2S_WORSHIP = function (worshipType, rank) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORSHIP);
        data.worshipType = worshipType;
        data.rank = rank;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取膜拜信息*/
    WorshipProxy.send_C2S_WORSHIP_INFO = function (worshipType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORSHIP_INFO);
        data.worshipType = worshipType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return WorshipProxy;
}(BaseProxy));

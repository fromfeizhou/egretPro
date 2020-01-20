/**
 * 聚宝盆协议（附加藏宝阁协议）
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
var CornucopiaProxy = /** @class */ (function (_super_1) {
    __extends(CornucopiaProxy, _super_1);
    function CornucopiaProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    // protected listenerProtoNotifications(): any[] {
    // 	return [
    // 		[ProtoDef.Generate_Silver_Coin, this, 'GenerateSivlerCoinReq', 'GenerateSivlerCoinResp'],// 聚宝
    // 		[ProtoDef.Extra_Gold, this, 'ExtraGoldReq', 'ExtraGoldResp'],// 额外元宝
    // 		[ProtoDef.Jackpot_Info, this, 'JackpotInfoReq', 'JackpotInfoResp'],// 聚宝基本信息
    // 	]
    // }
    CornucopiaProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TREASURE_WASHBOWL_USE, this, 'C2S_TREASURE_WASHBOWL_USE', ProxyEnum.SEND],
            [ProtoDef.S2C_TREASURE_WASHBOWL_USE, this, 'S2C_TREASURE_WASHBOWL_USE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TREASURE_WASHBOWL_EXTRAGOLD, this, 'C2S_TREASURE_WASHBOWL_EXTRAGOLD', ProxyEnum.SEND],
            [ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD, this, 'S2C_TREASURE_WASHBOWL_EXTRAGOLD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TREASURE_WASHBOWL_INFO, this, 'C2S_TREASURE_WASHBOWL_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_TREASURE_WASHBOWL_INFO, this, 'S2C_TREASURE_WASHBOWL_INFO', ProxyEnum.RECEIVE],
        ];
    };
    CornucopiaProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) { // 聚宝基本信息
            case ProtoDef.S2C_TREASURE_WASHBOWL_INFO: {
                if (body) {
                    CornucopiaModel.setCornucopiaInfo(body);
                    if (CornucopiaProxy.isOpenView) {
                        CornucopiaProxy.isOpenView = false;
                        Utils.open_view(TASK_UI.Cornucopai_PANEL);
                    }
                }
                break;
            }
            case ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD: { // 额外元宝
                CornucopiaModel.setCornucopiaTime(body.refreshTime);
                break;
            }
            case ProtoDef.S2C_TREASURE_WASHBOWL_USE: { //  聚宝
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**聚宝基本信息-打开界面 isopen = true */
    CornucopiaProxy.C2S_TREASURE_WASHBOWL_INFO_OPEN_VIEW = function () {
        this.isOpenView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**聚宝基本信息-不打开界面  isopen = false  */
    CornucopiaProxy.C2S_TREASURE_WASHBOWL_INFO = function () {
        this.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**聚宝 */
    CornucopiaProxy.C2S_TREASURE_WASHBOWL_USE = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_USE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**额外元宝 */
    CornucopiaProxy.C2S_TREASURE_WASHBOWL_EXTRAGOLD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_EXTRAGOLD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    CornucopiaProxy.isOpenView = false;
    return CornucopiaProxy;
}(BaseProxy));

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
/**宝物协议 */
var TreasureProxy = /** @class */ (function (_super_1) {
    __extends(TreasureProxy, _super_1);
    function TreasureProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    TreasureProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.TREASURE_ALL_INFO, this, 'GetTreasureMessageInfoReq', 'GetTreasureMessageInfoResp'],
            [ProtoDef.TREASURE_UPGRADE, this, 'TreasureUpgradeReq', 'TreasureUpgradeResp'],
            [ProtoDef.TREASURE_UPGRADE_STAR, this, 'TreasureUpgradeStarReq', 'TreasureUpgradeStarResp'],
            [ProtoDef.TREASURE_ASSEMBLING_GEMSTONE, this, 'TreasureAssemblingGemstoneReq', 'TreasureAssemblingGemstoneResp'],
            [ProtoDef.GAIN_TREASURE, this, '', 'GainTreasureResp'],
            [ProtoDef.TREASURE_ASSEMBLING_GENERAL, this, '', 'TreasureAssemblingGeneralResp'],
            [ProtoDef.GEMSTONE_UP, this, 'GemstoneUpReq', 'GemstoneUpResp'],
        ];
    };
    TreasureProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            //请求宝物信息
            case ProtoDef.TREASURE_ALL_INFO: {
                TreasureModel.initDataList(body.infos);
                break;
            }
            //宝物升级
            case ProtoDef.TREASURE_UPGRADE: {
                var data = body;
                if (data.info) {
                    TreasureModel.updateData(data.info);
                    com_main.EventMgr.dispatchEvent(TreaEvent.TREA_LEVEL_UPDATE, { itemId: data.info.itemId, level: data.level });
                }
                break;
            }
            //宝物升星
            case ProtoDef.TREASURE_UPGRADE_STAR: {
                var data = body.info;
                if (data) {
                    TreasureModel.updateData(data);
                    com_main.EventMgr.dispatchEvent(TreaEvent.TREA_STAR_UPDATE, data.itemId);
                }
                break;
            }
            //宝物装配宝石
            case ProtoDef.TREASURE_ASSEMBLING_GEMSTONE: {
                var data = body;
                if (data) {
                    TreasureModel.updateData(data.info);
                    com_main.EventMgr.dispatchEvent(TreaEvent.TREA_STONE_UPDATE, data.info.itemId);
                }
                break;
            }
            //获得宝物
            case ProtoDef.GAIN_TREASURE: {
                if (body.infos) {
                    for (var i = 0; i < body.infos.length; i++) {
                        TreasureModel.addData(body.infos[i]);
                    }
                }
                break;
            }
            //宝物装配
            case ProtoDef.TREASURE_ASSEMBLING_GENERAL: {
                var data = body;
                if (data.info) {
                    TreasureModel.updateData(data.info);
                }
                break;
            }
            case ProtoDef.GEMSTONE_UP: {
                EffectUtils.showTips(GCode(CLEnum.TREA_BS_HCCG), 1);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**获得宝物信息 */
    TreasureProxy.send_TREASURE_ALL_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_ALL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**宝物升级 */
    TreasureProxy.send_TREASURE_UP_GRADE = function (itemId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_UPGRADE);
        data.itemId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**宝物升星 */
    TreasureProxy.send_TREASURE_UPGRADE_STAR = function (itemId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_UPGRADE_STAR);
        data.itemId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**宝物装配宝石
     *
     */
    TreasureProxy.send_TREASURE_ASSEMBLING_GEMSTONE = function (itemId, pos, gemstoneId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_ASSEMBLING_GEMSTONE);
        data.itemId = itemId;
        data.pos = pos;
        data.gemstoneId = gemstoneId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**宝石合成 */
    TreasureProxy.send_GEMSTONE_UP = function (gemstoneId, count) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GEMSTONE_UP);
        data.gemstoneId = gemstoneId;
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return TreasureProxy;
}(BaseProxy));

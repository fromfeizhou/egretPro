/**
 * 道具
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
/**物品变更操作类型 */
var PropOperateType;
(function (PropOperateType) {
    PropOperateType[PropOperateType["MODIFY"] = 0] = "MODIFY";
    PropOperateType[PropOperateType["DELETE"] = 1] = "DELETE";
    PropOperateType[PropOperateType["ADD"] = 2] = "ADD";
})(PropOperateType || (PropOperateType = {}));
var PropType;
(function (PropType) {
    PropType[PropType["RESOURCE"] = 1] = "RESOURCE";
    PropType[PropType["PROP"] = 2] = "PROP";
})(PropType || (PropType = {}));
/**配置表 奖励类型  第4个参数不传默认固定值。 */
var RewardType;
(function (RewardType) {
    RewardType[RewardType["GRANARY_PER"] = 1] = "GRANARY_PER";
})(RewardType || (RewardType = {}));
var PropProxy = /** @class */ (function (_super_1) {
    __extends(PropProxy, _super_1);
    function PropProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    PropProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.BACKPACK_QUERY, this, 'BackpackQueryReq', 'BackpackQueryResp'],
            [ProtoDef.BACKPACK_USE_ITEM, this, 'BackpackItemUseReq', 'BackpackItemUseResp'],
            [ProtoDef.BACKPACK_SAFE_USE, this, 'BackpackSafeUseReq', 'BackpackSafeUseResp'],
            [ProtoDef.PUSH_VALUES_MESSAGE, this, '', 'ValuesMessageSet'],
        ];
    };
    PropProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.S2C_BACKPACKGRID_CHANGE, this, 'S2C_BACKPACKGRID_CHANGE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_NUMBER_VALUES, this, 'S2C_NUMBER_VALUES', ProxyEnum.RECEIVE],
        ];
    };
    PropProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.BACKPACK_QUERY: {
                if (body) {
                    PropModel.initPorpItems(body.backpackGrids);
                    if (PropProxy.isOpenView) {
                        PropProxy.isOpenView = false;
                        Utils.open_view(TASK_UI.POP_BAG_LIST_VIEW);
                    }
                }
                else {
                    error('背包数据错误！！body：', body);
                }
                break;
            }
            case ProtoDef.S2C_BACKPACKGRID_CHANGE: {
                var data = body;
                for (var i = 0; i < data.grids.length; i++) {
                    PropModel.updateProp(data.grids[i]);
                }
                break;
            }
            case ProtoDef.BACKPACK_USE_ITEM: { // 使用道具
                if (body.result) {
                    if (body.message.length > 0) {
                        Utils.open_view(TASK_UI.GET_REWARD_VIEW, body.message);
                    }
                }
                break;
            }
            case ProtoDef.BACKPACK_SAFE_USE: { // 使用安全道具
                if (body.result) {
                    // PropModel.init(body.backpackGrids);
                    // com_main.MainToolsBar.updateEffect();
                    // Utils.open_view(TASK_UI.POP_BAG_LIST_VIEW);
                    PropProxy.send_BACKPACK_QUERY(true);
                }
                else {
                    error('背包数据错误！！body：', body);
                }
                break;
            }
            case ProtoDef.PUSH_VALUES_MESSAGE: {
                // let consumeMessage = body.consumeMessage;
                // let rewardMessage = body.rewardMessage;
                // let isReport = body.isReport;
                // let cmd = body.cmd;
                // for (var key in consumeMessage) {
                // 	if (consumeMessage.hasOwnProperty(key)) {
                // 		var element = consumeMessage[key];
                // 		PropProxy.analysisData(element, isReport, cmd);
                // 	}
                // }
                // for (var key in rewardMessage) {
                // 	if (rewardMessage.hasOwnProperty(key)) {
                // 		var element = rewardMessage[key];
                // 		PropProxy.analysisData(element, isReport, cmd);
                // 	}
                // }
                break;
            }
            case ProtoDef.S2C_NUMBER_VALUES: { //资源变动
                var data = body;
                for (var key in data.valuesMessage) {
                    var element = data.valuesMessage[key];
                    PropProxy.analysisSourceData(element.itemId, element.count);
                }
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**同步资源 */
    // public static analysisData(body: gameProto.IValuesMessage, isReport: boolean = true, cmd: number = 0) {
    // 	let itemId = body.itemId;
    // 	let itemConfig = C.ItemConfig[itemId];
    // 	if (itemConfig.type != PropType.RESOURCE) {
    // 		com_main.EventMgr.dispatchEvent(EventEnum.PROP_ITEM_CHANGE, itemId);
    // 		return;
    // 	}
    // }
    /**同步资源 */
    PropProxy.analysisSourceData = function (itemId, count) {
        // if (isReport && count > 0) {
        // 	let resourceName = Utils.getPropName(itemId);
        // 	EffectUtils.showTips(GCodeFromat(CLEnum.BAG_GET_TIPS, resourceName, count));
        // }
        switch (itemId) {
            case PropEnum.EXP: { //经验(引起等级变动 特殊处理)
                RoleData.exp += count;
                break;
            }
            case PropEnum.VIP_EXP: { //vip经验(引起等级变动 特殊处理)
                RoleData.vipIntegral += count;
                break;
            }
            case PropEnum.YU: { //勾玉
                RoleData.yu = count;
                break;
            }
            case PropEnum.GOLD: { //元宝(金币)
                RoleData.gold = count;
                break;
            }
            case PropEnum.FOOD: { //粮食
                RoleData.food = count;
                // this.updateSourceByEffect("food",count,itemId);
                break;
            }
            case PropEnum.SILVER: { //银币
                RoleData.silver = count;
                // this.updateSourceByEffect("silver",count,itemId);
                break;
            }
            case PropEnum.WOOD: {
                RoleData.wood = count;
                break;
            }
            case PropEnum.IRON: {
                RoleData.ironCount = count;
                break;
            }
            case PropEnum.MILITARY_EXPLOIT: { //累计军功
                RoleData.military = count;
                break;
            }
            case PropEnum.MILITARY_MERITS_CONSUMED: { //可消耗军功
                RoleData.militaryCoin = count;
                break;
            }
            case PropEnum.MILITARY_MERITS_WEEK: { //周军功
                RoleData.militaryWeekExp = count;
                break;
            }
            case PropEnum.MILITARY_MERITS_DAY: { //日军功
                RoleData.militaryDayExp = count;
                break;
            }
            case PropEnum.GUILD_POINT: { //军团个人积分
                RoleData.guildContribute = count;
                break;
            }
            case PropEnum.PVP_MEDAL: { //军团个人积分
                RoleData.pvpMedal = count;
                break;
            }
            case PropEnum.ZML: { //招募令
                RoleData.recruit = count;
                break;
            }
            case PropEnum.CONQUER: { //过关斩将积分
                RoleData.conquer = count;
                break;
            }
            case PropEnum.BOSSSCORE: { //百战精华
                RoleData.bossScore = count;
                break;
            }
            case PropEnum.HONOR: { //荣誉
                RoleData.honor = count;
                break;
            }
        }
    };
    /**请求背包内容 */
    PropProxy.send_BACKPACK_QUERY = function (isOpenView) {
        this.isOpenView = isOpenView;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.BACKPACK_QUERY);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求使用道具 */
    PropProxy.send_BACKPACK_USE_ITEM = function (itemId, count) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.BACKPACK_USE_ITEM);
        data.itemId = itemId;
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求使用安全道具 */
    PropProxy.send_BACKPACK_SAFE_USE = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.BACKPACK_SAFE_USE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    PropProxy.isOpenView = true;
    return PropProxy;
}(BaseProxy));

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
 * 历史战役
 */
var HistoryBattleProxy = /** @class */ (function (_super_1) {
    __extends(HistoryBattleProxy, _super_1);
    function HistoryBattleProxy() {
        return _super_1.call(this) || this;
    }
    HistoryBattleProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_GET_HISTORY_WAR_INFO, this, 'C2S_GET_HISTORY_WAR_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_HISTORY_WAR_INFO, this, 'S2C_GET_HISTORY_WAR_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_HISTORY_WAR_CLEAN_UP, this, 'C2S_HISTORY_WAR_CLEAN_UP', ProxyEnum.SEND],
            [ProtoDef.S2C_HISTORY_WAR_CLEAN_UP, this, 'S2C_HISTORY_WAR_CLEAN_UP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_HISTORY_WAR_FIGHT, this, 'C2S_HISTORY_WAR_FIGHT', ProxyEnum.SEND],
            [ProtoDef.C2S_HISTORY_WAR_CLEAN_UP_COUNT, this, 'C2S_HISTORY_WAR_CLEAN_UP_COUNT', ProxyEnum.SEND],
            [ProtoDef.C2S_HISTORY_WAR_GET_BOX, this, 'C2S_HISTORY_WAR_GET_BOX', ProxyEnum.SEND],
            [ProtoDef.S2C_HISTORY_WAR_GET_BOX, this, 'S2C_HISTORY_WAR_GET_BOX', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_HISTROY_WAR_BATTLE_INFO, this, 'S2C_HISTROY_WAR_BATTLE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_HISTORY_WAR_RESET, this, 'S2C_HISTORY_WAR_RESET', ProxyEnum.RECEIVE],
        ];
    };
    HistoryBattleProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var proto = notification.getName();
        switch (proto) {
            case ProtoDef.S2C_GET_HISTORY_WAR_INFO: {
                var data = body;
                HistoryBattleModel.parseInfo(data.chapterInfos);
                break;
            }
            case ProtoDef.S2C_HISTORY_WAR_CLEAN_UP: {
                var data = body;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.valuesMessage);
                HistoryBattleModel.updateHistoryLevel(data);
                com_main.EventMgr.dispatchEvent(HistoryWarEvent.HISTORY_UPDATE_NUM, data.fightNum);
                break;
            }
            case ProtoDef.S2C_HISTORY_WAR_GET_BOX: {
                var data = body;
                HistoryBattleModel.updateRaward(data);
                break;
            }
            case ProtoDef.S2C_HISTROY_WAR_BATTLE_INFO: {
                var data = body;
                HistoryBattleModel.updateBattleRes(data);
                FightResponseUtil.addResultCache(notification);
                break;
            }
            case ProtoDef.S2C_HISTORY_WAR_RESET: {
                var data = body;
                HistoryBattleModel.resetHistoryFightNum();
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /////////////////////////////////////////////////////////////////////
    /**章节信息*/
    HistoryBattleProxy.C2S_GET_HISTORY_WAR_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_HISTORY_WAR_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**扫荡 */
    HistoryBattleProxy.C2S_HISTORY_WAR_CLEAN_UP = function (lev) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_CLEAN_UP);
        data.levelId = lev;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求战斗 */
    HistoryBattleProxy.C2S_HISTORY_WAR_FIGHT = function (lev) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_FIGHT);
        data.levelId = lev;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求领取宝箱 */
    HistoryBattleProxy.C2S_HISTORY_WAR_GET_BOX = function (chapterId, starRewardId) {
        HistoryBattleModel.curBoxAwardChapterId = chapterId;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_GET_BOX);
        data.starRewardId = starRewardId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**购买次数 */
    HistoryBattleProxy.C2S_HISTORY_WAR_CLEAN_UP_COUNT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_CLEAN_UP_COUNT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return HistoryBattleProxy;
}(BaseProxy));

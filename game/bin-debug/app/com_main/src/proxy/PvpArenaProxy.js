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
//pvp竞技
var PvpArenaProxy = /** @class */ (function (_super_1) {
    __extends(PvpArenaProxy, _super_1);
    function PvpArenaProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    PvpArenaProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.APK_GET_MY_APK, this, 'GetMyApkReq', 'GetMyApkResp'],
            [ProtoDef.APK_GET_CHALLENGE_LIST, this, 'GetChallengeListReq', 'GetChallengeListResp'],
            [ProtoDef.APK_CHALLENGE, this, 'ChallengeReq', 'ChallengeResp'],
            [ProtoDef.APK_BUY_COUNT, this, 'GetBuyCountReq', 'GetBuyCountResp'],
            [ProtoDef.APK_GET_RANK_LIST, this, 'GetRankListReq', 'GetRankListResp'],
            [ProtoDef.APK_GET_CHALLENGE_HIS, this, 'GetChallengeHisReq', 'GetChallengeHisResp'],
            [ProtoDef.APK_CHALLENGE_FAST, this, 'ChallengeFastReq', 'ChallengeFastResp'],
            [ProtoDef.APK_CHALLENGE_CHECK, this, 'ChallengeCheckReq', 'ChallengeCheckResp'],
        ];
    };
    PvpArenaProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.APK_GET_MY_APK: {
                PvpArenaModel.initPvpArenaInfo(body);
                break;
            }
            case ProtoDef.APK_GET_CHALLENGE_LIST: {
                break;
            }
            case ProtoDef.APK_CHALLENGE: {
                var battleId = body.battleId;
                if (battleId > 0) {
                    com_main.UpManager.history();
                    // SceneManager.enterScene(SceneEnums.BATTLE_MAP, battleId, false);
                }
                break;
            }
            case ProtoDef.APK_BUY_COUNT: {
                PvpArenaModel.setBuyNum(body);
                break;
            }
            case ProtoDef.APK_GET_CHALLENGE_HIS: {
                break;
            }
            case ProtoDef.APK_CHALLENGE_FAST: {
                PvpArenaModel.OnFastChallenge(body);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求竞技场数据 */
    PvpArenaProxy.send_APK_GET_MY_APK = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_MY_APK);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取可挑战队列 */
    PvpArenaProxy.send_APK_GET_CHALLENGE_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_CHALLENGE_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**购买次数 */
    PvpArenaProxy.send_APK_BUY_COUNT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_BUY_COUNT);
        data.num = 1;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**挑战 */
    PvpArenaProxy.send_APK_CHALLENGE = function (rank) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_CHALLENGE);
        data.rank = rank;
        //data.armyId = armyId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**排行榜数据 */
    PvpArenaProxy.send_APK_RANK_LIST = function (count) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_RANK_LIST);
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**战报数据 */
    PvpArenaProxy.send_APK_CHALLENGE_HIS = function (count) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_CHALLENGE_HIS);
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**扫荡 */
    PvpArenaProxy.send_APK_FAST_CHALLENGE = function (rank) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_CHALLENGE_FAST);
        data.rank = rank;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**挑战检查 */
    PvpArenaProxy.send_APK_REFRESH_RANK = function (id, rank) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_CHALLENGE_CHECK);
        data.playerId = id;
        data.rank = rank;
        AGame.ServiceBuilder.sendMessage(data);
    };
    PvpArenaProxy.isOpenView = false;
    return PvpArenaProxy;
}(BaseProxy));

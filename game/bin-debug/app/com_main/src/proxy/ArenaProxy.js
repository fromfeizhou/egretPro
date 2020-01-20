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
var ArenaProxy = /** @class */ (function (_super_1) {
    __extends(ArenaProxy, _super_1);
    function ArenaProxy() {
        return _super_1.call(this) || this;
    }
    ArenaProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.ARENA_ID, this, 'ArenaIdIdReq', 'ArenaIdResp'],
            [ProtoDef.ENTER_ARENA_BATTLE, this, 'EnterArenaBattleReq', 'EnterArenaBattleResp'],
            [ProtoDef.CLEAN_UP_ARENA_BATTLE, this, 'CleanUpArenaBattleReq', 'CleanUpArenaBattleResp'],
            [ProtoDef.ARENA_RESET, this, 'ArenaResetReq', 'ArenaResetResp'],
            [ProtoDef.ARENA_REWARD_LIST, this, 'ArenaRewardListReq', 'ArenaRewardListResp'],
            [ProtoDef.ARENA_GET_REWARD, this, 'ArenaGetRewardReq', 'ArenaGetRewardResp'],
        ];
    };
    ArenaProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.ARENA_ID: {
                ArenaModel.arenaId = body.arenaId < 0 ? 0 : body.arenaId;
                ArenaModel.freeResetTimes = body.resetCount;
                ArenaModel.canMoppingUp = body.canCleanUp;
                break;
            }
            case ProtoDef.ENTER_ARENA_BATTLE: {
                var battleId = body.battleId;
                if (battleId > 0) {
                    com_main.UpManager.history();
                    // SceneManager.enterScene(SceneEnums.BATTLE_MAP, battleId, false);
                }
                break;
            }
            case ProtoDef.CLEAN_UP_ARENA_BATTLE: {
                ArenaModel.arenaId = body.arenaId < 0 ? 0 : body.arenaId;
                ArenaModel.canMoppingUp = false;
                Utils.open_view(TASK_UI.POP_ARENA_CLEAR_UP_PANEL, body);
                break;
            }
            case ProtoDef.ARENA_RESET: {
                ArenaModel.arenaId = body.arenaId < 0 ? 0 : body.arenaId;
                ArenaModel.canMoppingUp = true;
                ArenaModel.freeResetTimes--;
                if (ArenaModel.freeResetTimes < 0)
                    ArenaModel.freeResetTimes = 0;
                break;
            }
            case ProtoDef.ARENA_REWARD_LIST: {
                ArenaModel.updateAwardList(body.arenaId);
                break;
            }
            case ProtoDef.ARENA_GET_REWARD: {
                if (body.result == true) {
                    ArenaModel.setAwardById(body.arenaId);
                }
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**发送进入擂台请求 */
    ArenaProxy.send_ENTER_ARENA_BATTLE = function (armyId) {
        debug("BattleProxy:send_ENTER_ARENA_BATTLE--->>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ENTER_ARENA_BATTLE);
        data.armyId = armyId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**发送请求擂台ID */
    ArenaProxy.send_ArenaId = function () {
        debug("BattleProxy:send__ArenaId--->>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_ID);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**擂台扫荡 */
    ArenaProxy.send_CLEAN_UP_ARENA_BATTLE = function () {
        debug("BattleProxy:send_CLEAN_UP_ARENA_BATTLE--->>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CLEAN_UP_ARENA_BATTLE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**擂台重置 */
    ArenaProxy.send_ARENA_RESET = function () {
        debug("BattleProxy:send_CLEAN_UP_ARENA_BATTLE--->>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_RESET);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**擂台奖励列表 */
    ArenaProxy.send_ARENA_REWARD_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_REWARD_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**擂台领取奖励 */
    ArenaProxy.send_ARENA_GET_REWARD = function (arenaId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ARENA_GET_REWARD);
        data.arenaId = arenaId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return ArenaProxy;
}(BaseProxy));

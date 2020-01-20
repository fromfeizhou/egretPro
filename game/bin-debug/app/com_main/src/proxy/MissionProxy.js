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
//任务
var MissionProxy = /** @class */ (function (_super_1) {
    __extends(MissionProxy, _super_1);
    function MissionProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    MissionProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TASK_LIST, this, 'C2S_TASK_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_TASK_LIST, this, 'S2C_TASK_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TASK_RECEIVE, this, 'C2S_TASK_RECEIVE', ProxyEnum.SEND],
            [ProtoDef.S2C_TASK_RECEIVE, this, 'S2C_TASK_RECEIVE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_TASK_PROGRESS, this, 'S2C_TASK_PROGRESS', ProxyEnum.SEND],
            [ProtoDef.C2S_TASK_REWARD, this, 'C2S_TASK_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_TASK_REWARD, this, 'S2C_TASK_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_LIVENESS_INFO, this, 'C2S_LIVENESS_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_LIVENESS_INFO, this, 'S2C_LIVENESS_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_LIVENESS_RECEIVE, this, 'C2S_LIVENESS_RECEIVE', ProxyEnum.SEND],
            [ProtoDef.S2C_LIVENESS_RECEIVE, this, 'S2C_LIVENESS_RECEIVE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TASK_REWARD_MULTI, this, 'C2S_TASK_REWARD_MULTI', ProxyEnum.SEND],
            [ProtoDef.S2C_TASK_REWARD_MULTI, this, 'S2C_TASK_REWARD_MULTI', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_TASK_LIST, this, 'C2S_ACTIVITY_TASK_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_TASK_LIST, this, 'S2C_ACTIVITY_TASK_LIST', ProxyEnum.RECEIVE],
        ];
    };
    MissionProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_TASK_LIST: { // 获取
                MissionModel.initPlayerMissionInfoList(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_TASK_LIST: { // 获取活动任务列表
                MissionModel.initActivityList(body);
                break;
            }
            case ProtoDef.S2C_TASK_RECEIVE: { // 领取任务
                MissionModel.addPlayerMissionInfoList(body);
                break;
            }
            case ProtoDef.S2C_TASK_PROGRESS: { // 任务状态刷新
                MissionModel.updateMissionInfos(body);
                break;
            }
            case ProtoDef.S2C_TASK_REWARD: { // 领奖
                MissionModel.receiveReward(body);
                break;
            }
            case ProtoDef.S2C_LIVENESS_INFO: {
                MissionModel.initActivaInfo(body);
                break;
            }
            case ProtoDef.S2C_LIVENESS_RECEIVE: {
                var data = body;
                if (data.state == 0) {
                    var reward = C.LivesRewardConfig[data.id].Reward;
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, reward);
                }
                break;
            }
            case ProtoDef.S2C_TASK_REWARD_MULTI: { // 一键领奖
                MissionModel.receiveAllReward(body);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求任务信息 */
    MissionProxy.send_GET_PLAYER_MISSION = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**领取奖励 */
    MissionProxy.send_MISSION_REWARD = function (taskId, taskConditionId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_REWARD);
        data.taskId = taskId;
        data.taskConditionId = taskConditionId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求活跃度信息 */
    MissionProxy.send_MISSION_ACTIVE_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_LIVENESS_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    //活跃度领取
    MissionProxy.send_MISSION_ACTIVE_REWAED = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_LIVENESS_RECEIVE);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**一键领取奖励 */
    MissionProxy.send_MISSION_REWARD_Multi = function (taskConditionId) {
        while (taskConditionId.length > 500) {
            var res = taskConditionId.splice(0, 500);
            var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_REWARD_MULTI);
            data.taskConditionId = res;
            AGame.ServiceBuilder.sendMessage(data);
        }
        if (taskConditionId.length > 0) {
            var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_REWARD_MULTI);
            data.taskConditionId = taskConditionId;
            AGame.ServiceBuilder.sendMessage(data);
        }
    };
    /**获取活动任务列表 */
    MissionProxy.C2S_ACTIVITY_TASK_LIST = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_TASK_LIST);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    MissionProxy.isOpenView = false;
    return MissionProxy;
}(BaseProxy));

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
//转盘
var TurnTableProxy = /** @class */ (function (_super_1) {
    __extends(TurnTableProxy, _super_1);
    function TurnTableProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    TurnTableProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_ACTIVITY_GET_PRIZE_INFO, this, 'C2S_ACTIVITY_GET_PRIZE_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_PRIZE_INFO, this, 'S2C_ACTIVITY_GET_PRIZE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_PRIZE_PLAY, this, 'C2S_ACTIVITY_PRIZE_PLAY', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_PRIZE_PLAY, this, 'S2C_ACTIVITY_PRIZE_PLAY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_DRAW_PRIZE_REWARD, this, 'C2S_ACTIVITY_DRAW_PRIZE_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_DRAW_PRIZE_REWARD, this, 'S2C_ACTIVITY_DRAW_PRIZE_REWARD', ProxyEnum.RECEIVE],
        ];
    };
    TurnTableProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_ACTIVITY_GET_PRIZE_INFO: { //获取幸运转盘玩家个人信息
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.getInfoData(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_PRIZE_PLAY: { //玩幸运转盘
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.parsePalyData(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_DRAW_PRIZE_REWARD: { //领取幸运转盘累积奖励
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**获取幸运转盘玩家个人信息 */
    TurnTableProxy.C2S_ACTIVITY_GET_PRIZE_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_PRIZE_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**点击幸运转盘(1次,10次) */
    TurnTableProxy.C2S_ACTIVITY_PRIZE_PLAY = function (activityId, type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PRIZE_PLAY);
        data.activityId = activityId;
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**领取幸运转盘累积奖励*/
    TurnTableProxy.C2S_ACTIVITY_DRAW_PRIZE_REWARD = function (activityId, id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_DRAW_PRIZE_REWARD);
        data.id = id;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    TurnTableProxy.isOpenView = false;
    return TurnTableProxy;
}(BaseProxy));

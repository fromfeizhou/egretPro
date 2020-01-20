/**
 * 福利
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
var WelfareProxy = /** @class */ (function (_super_1) {
    __extends(WelfareProxy, _super_1);
    function WelfareProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    WelfareProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.GET_SIGN_UP, this, 'GetSignUpReq', 'GetSignUpResp'],
            [ProtoDef.SIGN_UP, this, 'SignUpReq', 'SignUpResp'],
            [ProtoDef.SUPPLEMENT_SIGN_UP, this, 'SupplementSignUpReq', 'SupplementSignUpResp'],
            [ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD, this, 'ReceiveSignUpExTraRewardReq', 'ReceiveSignUpExTraRewardResp'],
            [ProtoDef.DAILY_LOGIN_ACT, this, 'DailyLoginActReq', 'DailyLoginActResp'],
            [ProtoDef.DAILY_LOGIN_ACT_REWARD, this, 'DailyLoginActRewardReq', 'DailyLoginActRewardResp'],
            [ProtoDef.PATCH_COLLAR_REWARD, this, 'PatchCollarReq', 'PatchCollarResp'],
        ];
    };
    WelfareProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        debug("PropProxy body:", body);
        switch (protocol) {
            case ProtoDef.GET_SIGN_UP: {
                if (body) {
                    var vo = ActivityModel.getActivityVo(AcViewType.SIGN_MONTH_DAY);
                    if (vo) {
                        vo.initSignUpData(body);
                    }
                }
                break;
            }
            case ProtoDef.SIGN_UP: {
                var data = body;
                // PropModel.itemAwardTips(data.vaule);
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
                break;
            }
            case ProtoDef.SUPPLEMENT_SIGN_UP: { // 补签
                var data = body;
                // PropModel.itemAwardTips(data.vaule);
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
                break;
            }
            case ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD: {
                var data = body;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
                break;
            }
            case ProtoDef.PATCH_COLLAR_REWARD: { //  补领
                var data = body;
                // PropModel.itemAwardTips(data.vaule);
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求签到信息 */
    WelfareProxy.send_GET_SIGN_UP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_SIGN_UP);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求签到 */
    WelfareProxy.send_SIGN_UP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SIGN_UP);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**buqian */
    WelfareProxy.send_SUPPLEMENT_SIGN_UP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SUPPLEMENT_SIGN_UP);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**额外奖励 */
    WelfareProxy.send_RECEIVE_SIGN_UP_EXTRA_REWARD = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**每日登陆请求 */
    WelfareProxy.send_DAILY_LOGIN_ACT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.DAILY_LOGIN_ACT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**每日登陆领奖请求 */
    WelfareProxy.send_DAILY_LOGIN_ACT_REWARD = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.DAILY_LOGIN_ACT_REWARD);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**补领 */
    WelfareProxy.send_PATCH_COLLA = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.PATCH_COLLAR_REWARD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    WelfareProxy.isOpenView = false;
    return WelfareProxy;
}(BaseProxy));

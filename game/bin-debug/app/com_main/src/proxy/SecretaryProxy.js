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
var SecretaryProxy = /** @class */ (function (_super_1) {
    __extends(SecretaryProxy, _super_1);
    function SecretaryProxy() {
        return _super_1.call(this) || this;
    }
    SecretaryProxy.prototype.listenerProtoNotifications = function () {
        return [
        // [ProtoDef.GET_CELEBRATION, this, 'GetCelebrationReq', 'GetCelebrationResp'],        //获取庆典信息
        // [ProtoDef.CEREMONIES, this, 'CeremoniesReq', 'CeremoniesResp'],						//举办庆典
        // [ProtoDef.LIGHT_LANTERN, this, 'LightLanternReq', 'LightLanternResp'],				//点亮灯笼
        // [ProtoDef.RECEIVE_CELEBRATION_AWARD, this, 'ReceiveAwardReq', 'ReceiveAwardResp'],	//领取奖励
        ];
    };
    SecretaryProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var proto = notification.getName();
        switch (proto) {
            case ProtoDef.GET_CELEBRATION: {
                // debug("SecretaryProxy:execute-------->> GET_CELEBRATION", body)
                // CelebrationModel.endTime = body.endTime ? Long.fromValue(body.endTime) : Long.fromValue(0);
                // CelebrationModel.m_pGainScore = body.totalScore - CelebrationModel.totalScore;
                // CelebrationModel.totalScore = body.totalScore;
                // CelebrationModel.setAdditions(body.additions);
                // CelebrationModel.setLanterns(body.lanterns);
                // CelebrationModel.isReward = body.isReward;
                // if (SecretaryProxy.checkCelebration()) {
                // 	SecretaryProxy.send_CEREMONIES();
                // }
                break;
            }
            default: {
                debug("未处理事件:", proto);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /////////////////////////////////////////////////////////////////////
    /** 获取庆典信息 */
    SecretaryProxy.send_GET_CELEBRATION = function () {
        debug("SecretaryProxy:send_GET_CELEBRATION--->>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_CELEBRATION);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return SecretaryProxy;
}(BaseProxy));

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
 * 处理错误消息
 * 所有错误的返回都经过这里处理
 */
var ErrorProxy = /** @class */ (function (_super_1) {
    __extends(ErrorProxy, _super_1);
    function ErrorProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    ErrorProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.ERROR_CODE, this, '', 'ErrorCodeResp'],
        ];
    };
    ErrorProxy.prototype.execute = function (notification) {
        Loading.hide();
        var Service = AGame.ServiceBuilder;
        var body = notification.getBody();
        var protocol = notification.getName();
        var cmd = body.cmd; //对应的请求协议号
        var code = body.code; //错误码
        var param = body.param; //提示语参数
        var config = C.ErrorCodeConfig[code];
        if (!config) {
            error("ErrorProxy:execute--->> ProtoDef.PRO_TEST:", body);
            // error(format("ErrorProxy:execute--->> 缺少错误码配置数据！！cmd {1}, code {2}", cmd, code))
            return;
        }
        else {
            if (cmd != 2501) {
                /**替换占位符*/
                var error_msg = GLan(config.name); //读配置
                error_msg = format.apply(void 0, [error_msg].concat(param));
                // error('ErrorProxy:execute--->>'+error_msg);
                error('ErrorProxy:execute--->>', format("cmd {1}, code {2} :{3}", cmd, code, error_msg));
                //EffectUtils.showTips(format("cmd {1}, code {2} :{3}", cmd, code, error_msg), 5, true);
                EffectUtils.showTips(error_msg, 1, true);
            }
        }
        switch (cmd) {
            case ProtoDef.S2C_WAR_COMBAT_UNIT: {
                /**如果进入战斗场景报错，则退回世界地图 */
                WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
                break;
            }
            // case ProtoDef.BATTLE_JOIN: {
            // 	com_main.BattleSceneMgr.getInstance().focusToNPC();
            // 	break;
            // }
            case ProtoDef.RECEIVE_CELEBRATION_AWARD: {
                com_main.UpManager.close(true);
                break;
            }
            // case ProtoDef.BATTLE_WITHDRAW: {
            // 	if (code == 501) {
            // 		SceneManager.enterScene(SceneEnums.WORLD_CITY);
            // 	}
            // 	break;
            // }
        }
    };
    return ErrorProxy;
}(BaseProxy));

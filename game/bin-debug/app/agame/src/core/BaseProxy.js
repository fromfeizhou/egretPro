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
/**道具id枚举 */
var ProxyEnum;
(function (ProxyEnum) {
    ProxyEnum[ProxyEnum["SEND"] = 0] = "SEND";
    ProxyEnum[ProxyEnum["RECEIVE"] = 1] = "RECEIVE";
})(ProxyEnum || (ProxyEnum = {}));
var ProtoDef = gameProto.MessageID;
var LoseProxy = /** @class */ (function () {
    function LoseProxy() {
    }
    LoseProxy.clearBuff = function () {
        this.buff = null;
    };
    /**添加协议 */
    LoseProxy.addBuff = function (protocol, sendData) {
        if (protocol == ProtoDef.C2S_SYS_HEARTBEAT)
            return;
        if (!this.buff)
            this.buff = {};
        this.buff[protocol] = sendData;
    };
    /**s发送缓存协议 */
    LoseProxy.sendBuff = function () {
        if (this.buff) {
            for (var key in this.buff) {
                AGame.CSocket.getInstance().sendProtocol(Number(key), this.buff[key]);
            }
            this.buff = null;
        }
    };
    return LoseProxy;
}());
var BaseProxy = /** @class */ (function (_super_1) {
    __extends(BaseProxy, _super_1);
    function BaseProxy() {
        return _super_1.call(this) || this;
    }
    BaseProxy.prototype.listenerProtoNotifications = function () {
        return [];
    };
    /**第二版协议监听 */
    BaseProxy.prototype.listenerProtoNotificationsNew = function () {
        return [];
    };
    BaseProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = notification.getName();
        // console.log("BaseProxy:execute--->>", protocol, body);
        switch (protocol) {
            case 0:
                break;
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    BaseProxy.prototype.register = function () {
        var interests = this.listenerProtoNotifications();
        var len = interests.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                AGame.ServiceBuilder.addProtoHandler(interests[i][0], interests[i][1], interests[i][2], interests[i][3]);
            }
        }
        this.registerNew();
    };
    BaseProxy.prototype.registerNew = function () {
        var interests = this.listenerProtoNotificationsNew();
        var len = interests.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (interests[i][3] == ProxyEnum.SEND) {
                    AGame.ServiceBuilder.addProtoHandler(interests[i][0], interests[i][1], interests[i][2], '');
                }
                else {
                    AGame.ServiceBuilder.addProtoHandler(interests[i][0], interests[i][1], '', interests[i][2]);
                }
            }
        }
    };
    return BaseProxy;
}(egret.HashObject));

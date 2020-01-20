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
/**聊天头像结构 */
var ChatHeadVo = /** @class */ (function (_super_1) {
    __extends(ChatHeadVo, _super_1);
    function ChatHeadVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    ChatHeadVo.create = function (body) {
        var obj = ObjectPool.pop(ChatHeadVo, 'ChatHeadVo', body);
        return obj;
    };
    ChatHeadVo.prototype.init = function (body) {
        this.parseKeys(body);
    };
    ChatHeadVo.prototype.onDestroy = function () {
        ObjectPool.push(this);
    };
    /**更新数据 */
    ChatHeadVo.prototype.update = function (body) {
        this.parseKeys(body);
    };
    /**解析服务器协议 */
    ChatHeadVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, ChatHeadVo.AttriKey);
    };
    /**属性值 */
    ChatHeadVo.AttriKey = ["headPortrait", "lastTime"];
    return ChatHeadVo;
}(egret.HashObject));

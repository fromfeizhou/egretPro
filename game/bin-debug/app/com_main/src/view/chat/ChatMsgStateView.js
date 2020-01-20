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
var com_main;
(function (com_main) {
    var ChatMsgStateView = /** @class */ (function (_super_1) {
        __extends(ChatMsgStateView, _super_1);
        function ChatMsgStateView() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        return ChatMsgStateView;
    }(com_main.ChatMsgView));
    com_main.ChatMsgStateView = ChatMsgStateView;
})(com_main || (com_main = {}));

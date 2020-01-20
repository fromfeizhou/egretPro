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
    var NoticeCtrl = /** @class */ (function (_super_1) {
        __extends(NoticeCtrl, _super_1);
        function NoticeCtrl() {
            return _super_1.call(this) || this;
        }
        NoticeCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.MENU_NOTICE, NoticeCtrl],
            ];
        };
        NoticeCtrl.prototype.execute = function (notification) {
            var protocol = Number(notification.getName());
            var body = notification.getBody();
            switch (protocol) {
                case TASK_UI.MENU_NOTICE: { //跑马灯
                    var data = body;
                    var msgs = [];
                    for (var i = 0; i < data.length; i++) {
                        var tmpData = data[i];
                        var msg = NoticeModel.getMsg(tmpData.id, tmpData.params);
                        if (msg) {
                            //滚动次数
                            for (var k = 0; k < tmpData.times; k++) {
                                msgs.push(msg);
                            }
                            ChatModel.sendSystemMsg(msg, ChatType.SYSTEM);
                        }
                    }
                    com_main.SystemNotice.show(msgs);
                    break;
                }
                default:
                    break;
            }
        };
        return NoticeCtrl;
    }(AGame.Controller));
    com_main.NoticeCtrl = NoticeCtrl;
})(com_main || (com_main = {}));

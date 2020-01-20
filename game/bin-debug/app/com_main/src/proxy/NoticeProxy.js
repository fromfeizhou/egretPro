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
var NoticeProxy = /** @class */ (function (_super_1) {
    __extends(NoticeProxy, _super_1);
    function NoticeProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    NoticeProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.NOTICE_PUSH, this, '', 'NoticePushResp'],
            [ProtoDef.ANNOUNCE_INFO_LIST, this, 'AnnounceInfoListReq', 'AnnounceInfoListResp'],
            [ProtoDef.ANNOUNCE_HORSELAMP, this, '', 'AnnounceHorseLampResp'],
        ];
    };
    NoticeProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) { //请求世界数据结果
            case ProtoDef.NOTICE_PUSH: {
                if (body.notice) {
                    // com_main.EventMgr.dispatchEvent(EventEnum.BATTLE_NOTICE, body);
                    // Utils.open_view(TASK_UI.MENU_NOTICE, body);
                }
                break;
            }
            case ProtoDef.ANNOUNCE_INFO_LIST: {
                if (body.announceInfo) {
                    // com_main.EventMgr.dispatchEvent(EventEnum.BATTLE_NOTICE, body);
                    // Utils.open_view(TASK_UI.MENU_NOTICE, body);
                }
                break;
            }
            case ProtoDef.ANNOUNCE_HORSELAMP: {
                if (body.info) {
                    // com_main.EventMgr.dispatchEvent(EventEnum.BATTLE_NOTICE, body);
                    Utils.open_view(TASK_UI.MENU_NOTICE, body.info);
                }
                break;
            }
            // case ProtoDef.SYSTEM_NOTICE_INFO_LIST: {
            //     //公告类型 1跑马灯,2活动公告,3登录公告
            //     debug("test--->获取公告信息", body.noticeInfo);
            //     Utils.open_view(TASK_UI.MENU_NOTICE_MESS_DLG, body);
            //     break;
            // }
            // case ProtoDef.SYSTEM_NOTICE_DEL: {
            //     if (body.info) {
            //         debug("test--->移除公告信息", body.info);
            //         Utils.open_view(TASK_UI.MENU_NOTICE, body);
            //     }
            //     break;
            // }
            // case ProtoDef.SYSTEM_NOTICE_HORSELAMP: {//推送跑马灯公告
            //     Utils.open_view(TASK_UI.MENU_NOTICE, body);
            //     break;
            // }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /** 获取公告信息*/
    NoticeProxy.send_ANNOUNCE_INFO_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ANNOUNCE_INFO_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return NoticeProxy;
}(BaseProxy));

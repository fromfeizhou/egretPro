class NoticeProxy extends BaseProxy {

    protected listenerProtoNotifications(): any[] {
        return [
            [ProtoDef.NOTICE_PUSH, this, '', 'NoticePushResp'],//获得公告数据
            
            [ProtoDef.ANNOUNCE_INFO_LIST, this, 'AnnounceInfoListReq', 'AnnounceInfoListResp'],//全部
            [ProtoDef.ANNOUNCE_HORSELAMP, this, '', 'AnnounceHorseLampResp'],//推送跑马灯公告
            // [ProtoDef.SYSTEM_NOTICE_INFO_LIST, this, 'SystemNoticeInfoListReq', 'SystemNoticeInfoListResp'],//获取公告信息
            // [ProtoDef.SYSTEM_NOTICE_DEL, this, '', 'SystemNoticeDelResp'],//移除公告信息
            // [ProtoDef.SYSTEM_NOTICE_HORSELAMP, this, '', 'SystemNoticeHorseLampResp'],//推送跑马灯公告
          
        ];
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {//请求世界数据结果
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
    }

    /** 获取公告信息*/
    public static send_ANNOUNCE_INFO_LIST() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.ANNOUNCE_INFO_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    }
}
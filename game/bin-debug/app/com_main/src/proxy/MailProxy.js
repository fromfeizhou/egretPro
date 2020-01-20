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
var MailProxy = /** @class */ (function (_super_1) {
    __extends(MailProxy, _super_1);
    function MailProxy() {
        return _super_1.call(this) || this;
    }
    // 监听协议
    MailProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            //C2S_MAILBOX_TITLE_LSIT
            [ProtoDef.C2S_MAILBOX_TITLE_LSIT, this, 'C2S_MAILBOX_TITLE_LSIT', ProxyEnum.SEND],
            [ProtoDef.S2C_MAILBOX_TITLE_LSIT, this, 'S2C_MAILBOX_TITLE_LSIT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MAILBOX_INFO, this, 'C2S_MAILBOX_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_MAILBOX_INFO, this, 'S2C_MAILBOX_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MAILBOX_DEL, this, 'C2S_MAILBOX_DEL', ProxyEnum.SEND],
            [ProtoDef.S2C_MAILBOX_DEL, this, 'S2C_MAILBOX_DEL', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MAILBOX_ALLDEL, this, 'C2S_MAILBOX_ALLDEL', ProxyEnum.SEND],
            [ProtoDef.S2C_MAILBOX_ALLDEL, this, 'S2C_MAILBOX_ALLDEL', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MAILBOX_ALLREAD, this, 'C2S_MAILBOX_ALLREAD', ProxyEnum.SEND],
            [ProtoDef.S2C_MAILBOX_ALLREAD, this, 'S2C_MAILBOX_ALLREAD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MAILBOX_ATTACHMENT, this, 'C2S_MAILBOX_ATTACHMENT', ProxyEnum.SEND],
            [ProtoDef.S2C_MAILBOX_ATTACHMENT, this, 'S2C_MAILBOX_ATTACHMENT', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_MAILBOX_NOTICE, this, 'S2C_MAILBOX_NOTICE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_MAILBOX_TITLE_UP, this, 'S2C_MAILBOX_TITLE_UP', ProxyEnum.RECEIVE],
        ];
    };
    MailProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_MAILBOX_TITLE_LSIT: {
                var data = body;
                MailModel.parseMailTitles(data.mailTitle);
                break;
            }
            case ProtoDef.S2C_MAILBOX_INFO: {
                Loading.hide();
                var data = body;
                MailModel.readMail(data);
                break;
            }
            case ProtoDef.S2C_MAILBOX_DEL: {
                var data = body;
                if (data.status == 0) {
                    MailModel.deleteMail(data.id);
                    var valueMsgs = data.attachment;
                    if (valueMsgs && valueMsgs.length > 0)
                        Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.MAIL_DEL_FAL), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_MAILBOX_ALLDEL: {
                var data = body;
                if (data.status == 0) {
                    MailModel.deleteMails(data.delId);
                    var valueMsgs = data.attachment;
                    if (valueMsgs && valueMsgs.length > 0)
                        Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.MAIL_DEL_FAL), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_MAILBOX_ALLREAD: {
                var data = body;
                //数据通过S2C_MAILBOX_TITLE_UP 更新
                if (data.status == 0) {
                    var valueMsgs = data.attachment;
                    if (valueMsgs && valueMsgs.length > 0)
                        Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
                }
                break;
            }
            case ProtoDef.S2C_MAILBOX_ATTACHMENT: {
                var data = body;
                if (data.status == 0) {
                    var valueMsgs = data.attachment;
                    if (valueMsgs && valueMsgs.length > 0)
                        Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
                    MailModel.attachMail(data.mailId);
                    // } else {
                    // 	EffectUtils.showTips(GCode(CLEnum.MAIL_ATT_GET_FAL), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_MAILBOX_NOTICE: {
                var data = body;
                MailModel.addMailTitle(data.mailTitle);
                break;
            }
            case ProtoDef.S2C_MAILBOX_TITLE_UP: {
                var data = body;
                MailModel.parseMailTitles(data.mailTitle);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**
     * 请求邮件列表
     */
    MailProxy.C2S_MAILBOX_TITLE_LSIT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_TITLE_LSIT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求邮件读取
     */
    MailProxy.C2S_MAILBOX_INFO = function (mailId) {
        if (MailModel.curReadId && MailModel.curReadId == mailId)
            return;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_INFO);
        data.id = mailId;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**
     * 请求邮件删除
     */
    MailProxy.C2S_MAILBOX_DEL = function (mailId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_DEL);
        data.id = mailId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求邮件一键删除
     */
    MailProxy.C2S_MAILBOX_ALLDEL = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_ALLDEL);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求邮件一键已读
     */
    MailProxy.C2S_MAILBOX_ALLREAD = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_ALLREAD);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求邮件领取附件
     */
    MailProxy.C2S_MAILBOX_ATTACHMENT = function (mailId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_ATTACHMENT);
        data.id = mailId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return MailProxy;
}(BaseProxy));

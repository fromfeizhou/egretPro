/**战报邮件类型 */
//1系统 2战报 3野怪 4城市战 5采集
//邮件类型 1系统 2战报 3野怪 4城市战 5采集
var MailType;
(function (MailType) {
    /**全部 */
    MailType[MailType["ALL"] = 0] = "ALL";
    /**系统战报 */
    MailType[MailType["System"] = 1] = "System";
    /**个人战报 */
    MailType[MailType["Personal"] = 2] = "Personal";
    /**剿匪战报 */
    MailType[MailType["CatchBandits"] = 3] = "CatchBandits";
    /**国家战报 */
    MailType[MailType["Country"] = 4] = "Country";
    /**采集战报 */
    MailType[MailType["Collection"] = 5] = "Collection";
})(MailType || (MailType = {}));
var MailModel = /** @class */ (function () {
    function MailModel() {
    }
    MailModel.isInit = function () {
        return isNull(this.mailTitleDic);
    };
    /**重置邮件发送邮件id记录 */
    MailModel.resetMailRecord = function () {
        this.curReadId = null;
    };
    /**获得对应类型的邮件 */
    MailModel.getMailTitleById = function (uuid) {
        return this.mailTitleDic.get(uuid);
    };
    /**获得对应类型的邮件 */
    MailModel.getMailTitlesByType = function (type) {
        return this.mailTitleList[type];
    };
    /**解析邮件标题列表 */
    MailModel.parseMailTitles = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (this.mailTitleDic.has(list[i].id)) {
                this.updateMailTitle(list[i]);
            }
            else {
                this.addMailTitle(list[i]);
            }
        }
        com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, false);
    };
    /**添加邮件标题 */
    MailModel.addMailTitle = function (data) {
        this.mailTitleDic.add(data.id, data);
        if (isNull(this.mailTitleList[data.type]))
            this.mailTitleList[data.type] = [];
        this.mailTitleList[data.type].push(data);
        com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, false);
    };
    /**更新邮件标题 */
    MailModel.updateMailTitle = function (data) {
        if (this.mailTitleDic.has(data.id)) {
            var cache = this.mailTitleDic.get(data.id);
            Dictionary.assign(cache, data);
        }
    };
    /**删除单封邮件 */
    MailModel.deleteMail = function (id, isEvt) {
        if (isEvt === void 0) { isEvt = true; }
        var data = this.getMailTitleById(id);
        if (data) {
            this.mailTitleDic.del(id);
            var list = this.mailTitleList[data.type];
            if (list) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].id == id) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
            if (isEvt)
                com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, true);
        }
    };
    /**删除多封邮件 */
    MailModel.deleteMails = function (ids) {
        for (var i = 0; i < ids.length; i++) {
            this.deleteMail(ids[i], false);
        }
        com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, true);
    };
    /**删除某一类型邮件 */
    MailModel.deleteMailsByType = function (type) {
        if (isNull(this.mailTitleList[type]) || this.mailTitleList[type].length == 0)
            return;
        for (var i in this.mailTitleDic) {
            var data = this.mailTitleDic[i];
            if (data.type == type)
                this.mailTitleDic.del(data.id);
        }
        delete this.mailTitleList[type];
    };
    /**读取邮件 */
    MailModel.readMail = function (data) {
        if (!data)
            return;
        var mailInfo = this.mailTitleDic.get(data.id);
        if (mailInfo)
            mailInfo.isRead = true;
        this.curReadId = data.id;
        data.text = data.text.replace(/(\\)/g, '');
        com_main.EventMgr.dispatchEvent(MailEvent.READ_MAIL, data);
    };
    /**领取邮件附件 */
    MailModel.attachMail = function (id) {
        var data = this.mailTitleDic.get(id);
        if (data)
            data.isAttachmentState = true;
        com_main.EventMgr.dispatchEvent(MailEvent.GET_ATTACHMENT, data);
    };
    /**一键已读全部邮件 */
    MailModel.oneKeyReadAllMails = function (type) {
        var datas = this.mailTitleList[type];
        if (isNull(datas))
            return;
        for (var i = 0; i < datas.length; i++) {
            datas[i].isRead = true;
        }
    };
    /**获得邮件红点 */
    MailModel.getRedMailNum = function (type) {
        if (!FunctionModel.isFunctionOpen(FunctionType.MAIL))
            return 0;
        if (isNull(type) || type == MailType.ALL) {
            var res_1 = 0;
            this.mailTitleDic.forEach(function (key, data) {
                if (!data.isRead) {
                    res_1 = 1;
                    return 'break';
                }
            });
            return res_1;
        }
        var list = this.getMailTitlesByType(type);
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                if (!data.isRead)
                    return 1;
            }
        }
        return 0;
    };
    /**邮件标题列表 id 为number 用自定义字典存储 */
    MailModel.mailTitleDic = Dictionary.create();
    MailModel.mailTitleList = {};
    return MailModel;
}());

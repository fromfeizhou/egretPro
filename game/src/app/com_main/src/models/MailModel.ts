/**战报邮件类型 */
//1系统 2战报 3野怪 4城市战 5采集
//邮件类型 1系统 2战报 3野怪 4城市战 5采集
enum MailType {
    /**全部 */
    ALL = 0,
    /**系统战报 */
    System = 1,
    /**个人战报 */
    Personal = 2,
    /**剿匪战报 */
    CatchBandits = 3,
    /**国家战报 */
    Country = 4,
    /**采集战报 */
    Collection = 5
}

/**邮件标题参数 */
interface IMailTitleInfo {
    victory?: number,
    countryId?:number,
    eventDataId?: number,
}

/**个人战报邮件 */
interface IPerMailInfo {
    killSoldiersCount: number,
    killTeamCount: number,
    lossSoldiersCount: number,
    teamCount: number,
    victory: number,
    warReportDataList: IWARMailData[];
    militaryMerits: number,
}

/**对战信息 */
interface IWARMailData {
    isAtkVictory: number,
    warReportTeamDataAtk: ITeamMailData,
    warReportTeamDataDef: ITeamMailData,
}

/**队伍信息 */
interface ITeamMailData {
    countryId: number,       //国家id
    maxSoldiersCount: number,  //最大兵力
    generalList: IGeneral[],    //武将列表
    isNpc: number,
    playerName: string          //玩家名字
    surplusSoldiersCount: number,   //剩余兵力
    teamId: number,         //队伍下标
    teamForce: number,       //战斗力
}


/**国战战报邮件 */
interface ICountryMailInfo {
    atkTeamData: ICountryTeamData,
    defTeamData: ICountryTeamData,
    labourUnionList: ICountryUnion[],
    playerList: ICountryPlayer[],
    victory: number,    //攻方结果
}

/**国战队伍结果 */
interface ICountryTeamData {
    fallBattleTeamCount: number,
    surplusTeamCount: number,
    teamCount: number,
    countryId: number,
}

/**联盟杀敌数据 */
interface ICountryUnion {
    countryId: number,
    name: string,
    value: number,
}

/**个人战功榜 */
interface ICountryPlayer {
    id: number,
    name: string,
    value: number,
    countryId: number,
}

/**剿匪战报邮件 */
interface ICBReportMailInfo {
    atkWildMonsterReportTeamData: IWMReportTeamData,
    defWildMonsterReportTeamData: IWMReportTeamData,
    cityId: number,
    reward: string,
    victory: number,
}
/**剿匪队伍 */
interface IWMReportTeamData {
    maxSoldiersCount: number,
    teamForce: number,
    generalList: IGeneral[],
    isNpc: number,
    playerName: string,
    surplusSoldiersCount: number,
    teamId: number,
}

interface IGeneral {
    generalId: number,
    level: number,
    star: number,
    generalName: string,
    quality: number,
}

/**采集战报邮件 */
interface ICollectionMailInfo {
    eventDataId: number,
    generalList: IGeneral[],
    reward: string,
}


class MailModel {
    /**邮件标题列表 id 为number 用自定义字典存储 */
    private static mailTitleDic: Dictionary = Dictionary.create();
    private static mailTitleList: { [key: number]: gameProto.IMailTitle[] } = {};

    public static curReadId: number;   //当前读取邮件 避免删除邮件排序 重复获取
    public static isInit(): boolean {
        return isNull(this.mailTitleDic);
    }

    /**重置邮件发送邮件id记录 */
    public static resetMailRecord() {
        this.curReadId = null;
    }

    /**获得对应类型的邮件 */
    public static getMailTitleById(uuid: number): gameProto.IMailTitle {
        return this.mailTitleDic.get(uuid);
    }

    /**获得对应类型的邮件 */
    public static getMailTitlesByType(type: MailType) {
        return this.mailTitleList[type];
    }

    /**解析邮件标题列表 */
    public static parseMailTitles(list: gameProto.IMailTitle[]) {
        for (let i = 0; i < list.length; i++) {
            if (this.mailTitleDic.has(list[i].id)) {
                this.updateMailTitle(list[i]);
            } else {
                this.addMailTitle(list[i]);
            }
        }
        com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, false);
    }

    /**添加邮件标题 */
    public static addMailTitle(data: gameProto.IMailTitle) {
        this.mailTitleDic.add(data.id, data);
        if (isNull(this.mailTitleList[data.type])) this.mailTitleList[data.type] = [];
        this.mailTitleList[data.type].push(data);
        com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, false);
    }


    /**更新邮件标题 */
    public static updateMailTitle(data: gameProto.IMailTitle) {
        if (this.mailTitleDic.has(data.id)) {
            let cache = this.mailTitleDic.get(data.id) as gameProto.IMailTitle;
            Dictionary.assign(cache, data);
        }
    }

    /**删除单封邮件 */
    public static deleteMail(id: number, isEvt: boolean = true) {
        let data = this.getMailTitleById(id);
        if (data) {
            this.mailTitleDic.del(id);
            let list = this.mailTitleList[data.type];
            if (list) {
                for (let i = list.length - 1; i >= 0; i--) {
                    if (list[i].id == id) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
            if (isEvt) com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, true);
        }
    }

    /**删除多封邮件 */
    public static deleteMails(ids: number[]) {
        for (let i = 0; i < ids.length; i++) {
            this.deleteMail(ids[i], false);
        }
        com_main.EventMgr.dispatchEvent(MailEvent.REFRESH_MAIL, true);
    }

    /**删除某一类型邮件 */
    public static deleteMailsByType(type: MailType): void {
        if (isNull(this.mailTitleList[type]) || this.mailTitleList[type].length == 0) return;
        for (let i in this.mailTitleDic) {
            let data = this.mailTitleDic[i] as gameProto.IMailTitle;
            if (data.type == type) this.mailTitleDic.del(data.id);
        }
        delete this.mailTitleList[type];
    }

    /**读取邮件 */
    public static readMail(data: gameProto.IS2C_MAILBOX_INFO): void {
        if (!data) return;
        let mailInfo = this.mailTitleDic.get(data.id) as gameProto.IMailTitle;
        if (mailInfo) mailInfo.isRead = true;
        this.curReadId = data.id;
        data.text = data.text.replace(/(\\)/g, '');
        com_main.EventMgr.dispatchEvent(MailEvent.READ_MAIL, data);
    }

    /**领取邮件附件 */
    public static attachMail(id: number): void {
        let data = this.mailTitleDic.get(id) as gameProto.IMailTitle;
        if (data) data.isAttachmentState = true;
        com_main.EventMgr.dispatchEvent(MailEvent.GET_ATTACHMENT, data);
    }

    /**一键已读全部邮件 */
    public static oneKeyReadAllMails(type: MailType): void {
        let datas = this.mailTitleList[type];
        if (isNull(datas)) return;
        for (let i = 0; i < datas.length; i++) {
            datas[i].isRead = true;
        }
    }


    /**获得邮件红点 */
    public static getRedMailNum(type?: MailType) {
        if (!FunctionModel.isFunctionOpen(FunctionType.MAIL)) return 0;

        if (isNull(type) || type == MailType.ALL) {
            let res = 0;
            this.mailTitleDic.forEach((key: number, data: gameProto.IMailTitle) => {
                if (!data.isRead) {
                    res = 1;
                    return 'break';
                }
            })
            return res;
        }
        let list = this.getMailTitlesByType(type);
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                if (!data.isRead) return 1;
            }
        }
        return 0;
    }



}
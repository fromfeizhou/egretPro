// 运营商id
enum IPSeEnum {
    QI_YUAN = 0,   //起源
    TUO_SHI = 1,   //拓世
    MO_LE = 2,     //魔乐
    QUN_HEI = 3,   //群黑
    MZ_YW = 4,     //拇指游玩
    DD_T = 5,      //达达兔
    DDT_WX = 6,    //达达兔微信
    MZYW_APK = 7,    //拇指游玩全资源端
    ZS_Y = 8,    //中手游
    J_Z = 9,     //九紫
    H_Y = 10,     //乾游
}

/**资源平台枚举(每个平台100个段位) */
enum PlatEnum {
    /**常规 */
    NORMAL = 0,
    /**微信 */
    WE_CHAT = 1,
    /**QQ */
    QQ_CHAT = 2,
    /**外网 */
    WEB = 3,
    /**拓世微端 */
    TS_WEIDUAN = 101,
    /**魔乐微信网页 */
    MOLE_WEB = 201,
    /**群黑 */
    QUNHEI_WEB = 301,
    /**拇指游玩 */
    MZYW_WEB = 401,
    /**拇指游玩IOS */
    MZYW_IOS = 402,
    /**达达兔 */
    DDT_WEB = 501,
    /**达达兔微信小游戏(每个平台100个段位 错误编号 以后不能再加) */
    DDT_WE_CHAT = 601,
    /**拇指游玩全资源端 (每个平台100个段位 错误编号 以后不能再加)*/
    MZYW_ALL_APK = 701,
    /**中手游链端 */
    ZSY_WEB = 801,
    /**中手游微信小游戏 */
    ZSY_WE_CHAT = 802,
    /**九指微端(权战三国) */
    JZ_APK = 901,
    /**九指微端(重写三国志) */
    JZ_APK2 = 902,
    /**九指微端(三国志国战版) */
    JZ_APK3 = 903,
    /**九指微端(挂机三国志BT版) */
    JZ_APK4 = 904,
    /**九指H5 */
    JZ_H5 = 905,
    /**乾游微端(权游三国) */
    HY_APK = 1001,
}


// 上报类型
class ReportType {
    public static levelup = "levelUp";       //升级
    public static enterServer = "enterServer";   //进入游戏
    public static createRole = "createRole";     //创建游戏
}

class PlatConst {
    public static zoneId: number = 1;   // 服务器id
    public static zoneName: string = "";// 服务器名字
    public static channelId: number = 0; //渠道id
    public static token: string = "";   //平台token
    public static timestamp: string = ""; //公用时间戳

    public static platformId: string = "";     //平台id
    public static platformUid: string = "";     //平台uid
    public static platformUsername: string = ""; //平台用户名

    public static platform: PlatEnum = 0;	/**资源平台 */
    //本地信息sdk 所需
    public static playerId: number;  //玩家id
    public static createTimestamp: number;   //创号时间
    public static level: number; //玩家等级
    public static power: number = 0; //战斗力
    public static vipLevel: number = 0;  //vip等级
    public static guildId: number = 0; //工会名字
    public static guildName: string = ''; //工会名字
    public static nickName: string = ''; //玩家名字
    public static gold: number = 0;       //金币
    public static gender: number = 0;    //男女
    public static countryId: number = 0;   //国家
    public static countryName: string = '';  //国家名
    public static norCopyId: number = 0;  //通过章节

    //获取运营商id
    public static getIpsId() {
        switch (this.platform) {
            case PlatEnum.TS_WEIDUAN: {
                return IPSeEnum.TUO_SHI;
            }
            case PlatEnum.MOLE_WEB: {
                return IPSeEnum.MO_LE;
            }
            case PlatEnum.QUNHEI_WEB: {
                return IPSeEnum.QUN_HEI;
            }
            case PlatEnum.MZYW_WEB:
            case PlatEnum.MZYW_IOS: {
                return IPSeEnum.MZ_YW;
            }
            case PlatEnum.DDT_WEB: {
                return IPSeEnum.DD_T;
            }
            case PlatEnum.DDT_WE_CHAT: {
                return IPSeEnum.DDT_WX;
            }
            case PlatEnum.MZYW_ALL_APK: {
                return IPSeEnum.MZYW_APK;
            }
            case PlatEnum.ZSY_WEB:
            case PlatEnum.ZSY_WE_CHAT: {
                return IPSeEnum.ZS_Y;
            }
            case PlatEnum.JZ_APK:
            case PlatEnum.JZ_APK2:
            case PlatEnum.JZ_APK3:
            case PlatEnum.JZ_APK4:
            case PlatEnum.JZ_H5: {
                return IPSeEnum.J_Z;
            }
            case PlatEnum.HY_APK: {
                return IPSeEnum.H_Y;
            }
            default:
                return IPSeEnum.QI_YUAN;
        }
    }

    /**资源sdn地址 */
    public static getResRemoteUrl(isConfig: boolean = false) {
        if (!isConfig && $Platform == PlatEnum.MZYW_ALL_APK) {
            return '/resource/';
        }
        return $PlatformSrc + 'resource/';
    }


    /**低画质平台 */
    public static isLowMcMachine() {
        switch (this.platform) {
            case PlatEnum.WE_CHAT:
            case PlatEnum.QQ_CHAT:
            case PlatEnum.DDT_WE_CHAT:
            case PlatEnum.ZSY_WE_CHAT:
                return true;
            default:
                return false;
        }
    }

    /**是否走正常充值 */
    public static isNormalPay() {
        switch (this.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.WEB:
                return false;
            default:
                return true;
        }
    }

    /**是否隐藏输入账号 */
    public static isHideAccount() {
        switch (this.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.WEB:
                return false;
            default:
                return true;
        }
    }

    /**是否显示公告 */
    public static isShowNotice() {
        switch (PlatConst.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.MZYW_WEB:
            case PlatEnum.MZYW_ALL_APK:
            case PlatEnum.JZ_APK:
            case PlatEnum.JZ_APK2:
            case PlatEnum.JZ_APK3:
            case PlatEnum.JZ_APK4:
            case PlatEnum.JZ_H5:
            case PlatEnum.HY_APK:
                return true;
        }
        return false;
    }

    /**九紫平台 */
    public static isPlatJZ() {
        if (PlatConst.platform == PlatEnum.NORMAL || this.getIpsId() == IPSeEnum.J_Z) return true;
        return false;
    }

    /**是否小程序 */
    public static isWxApp() {
        switch (PlatConst.platform) {
            case PlatEnum.DDT_WE_CHAT:
            case PlatEnum.WE_CHAT:
            case PlatEnum.ZSY_WE_CHAT:
                return true;
        }
        return false;
    }

    /**获取网址信息 */
    public static getUrlGet() {
        let url: string = window.document.location.href.toString();
        let u = url.split("?");
        if (u[1]) {
            u = u[1].split("&");
            let gets: Object = {};
            for (let i in u) {
                let j = u[i].split("=");
                gets[j[0]] = j[1];
            }
            return gets;
        }
        return {};
    }

    /**是否调试平台 */
    public static isDebugPlat() {
        switch (PlatConst.platform) {
            case PlatEnum.NORMAL:
            case PlatEnum.WEB:
                return true;
        }
        return false;
    }

    /**支付类型(rmb 勾玉) */
    public static isRmbPay() {
        switch (PlatConst.platform) {
            case PlatEnum.MZYW_IOS:
                return false;
        }
        return true;
    }


}
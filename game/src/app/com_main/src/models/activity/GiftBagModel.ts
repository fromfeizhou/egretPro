enum GiftItemEnum {
    /**君主等级 */
    roleLv = 2,
    /**红将 */
    redGen = 1,
    /**武将升级 */
    genUpLv = 3,
    /**武将突破*/
    genTupo = 4,
    /**君主升级（GM推）*/
    roleLvGm = 5,
    /**vip等级（GM推）*/
    roleVipGm = 6,
    /**全体开放（GM推）*/
    allOpenGm = 7,
    /**具体玩家（GM推）*/
    concreteGm = 8,
    /**拥有武将（GM推）*/
    haveGenGm = 9,
}
enum GiftBagTypeEnum {
    /**限时礼包 */
    ITEM = 1,
    /**限时商城 */
    SHOP = 2,
}

class GiftBagVo extends BaseClass implements IFObject {
    public giftBagId: number;          //礼包唯一id
    public giftBagType: number;         //礼包类型
    public giftBagStatus: number;    //领奖状态 0进行中 1可领奖 2领奖
    public giftBagEffectTime: number   //礼包激活时间(秒)
    public type: number;     //类型
    public continueTime: number;    //持续时间s
    public condition: number;   //条件
    public rechargeConfig: gameProto.IRechargeConfig;    //充值配置表

    private isOver: boolean;

    public constructor(body: gameProto.IGiftBag) {
        super();
        this.init(body);
    }

    public init(body: gameProto.IGiftBag) {
        this.isOver = false;
        this.parseData(body);
    }

    public update(body: gameProto.IGiftBag) {
        this.parseData(body);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this.giftBagId);
    }

    private parseData(body: gameProto.IGiftBag) {
        this.giftBagId = body.giftBagId;
        this.giftBagType = body.giftBagType;
        this.giftBagStatus = body.giftBagStatus;
        this.giftBagEffectTime = body.giftBagEffectTime;
        this.continueTime = body.continueTime;
        this.condition = body.condition;
        this.rechargeConfig = body.rechargeConfig;
    }

    public onDestroy() {

    }

    public canAward() {
        return this.giftBagStatus == 1;
    }
    /**是否过期 */
    public isOverTime(serverTime: number) {
        // if (this.canAward()) return false;//未领奖的不过期
        if (this.isOver) return this.isOver;
        if (this.getCountDown() <= 0) this.isOver = true;
        return this.isOver;
    }

    /**获得礼包倒计时 */
    public getCountDown() {
        return this.continueTime - (TimerUtils.getServerTime() - this.giftBagEffectTime);
    }

}
class GiftBagModel {
    /**限时礼包 */
    public static giftItems: { [key: number]: GiftBagVo };
    /**限时商城 */
    public static giftShopItems: { [key: number]: GiftBagVo };

    public static isPopItem: boolean;//是否推送礼包
    public static isPopShop: boolean;//是否推送限时商城

    private static initTick: boolean;
    public static jumpId: number;      //当前弹框的礼包id(用于跳转到对应礼包)

    /**模块初始化 */
    public static init() {
        this.giftItems = {};
        this.giftShopItems = {};
    }

    public static clear() {
        this.clearTick();
        this.giftItems = null;
        this.giftShopItems = null;
    }

    /**刷新倒计时 */
    private static createTick() {
        if (!this.initTick) {
            this.initTick = true;
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
        }
    }

    public static clearTick() {
        if (this.initTick) {
            Utils.TimerManager.remove(this.timeCall, this);
            this.initTick = false;
        }
    }

    private static timeCall() {
        this.checkOutTime();
    }
    /**过期礼包删除 */
    private static checkOutTime() {
        let time = TimerUtils.getServerTime();
        let delKeys = [];
        for (let key in this.giftItems) {
            let data = this.giftItems[key];
            if (data.isOverTime(time)) {
                delKeys.push(data.giftBagId);
            };
        }

        for (let i = 0; i < delKeys.length; i++) {
            this.delGiftItem(delKeys[i]);
        }
    }

    /**移除礼包 */
    private static delGiftItem(id: number) {
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU, id);
        delete this.giftItems[id];
        this.checkActivityTick(GiftBagTypeEnum.ITEM);
    }

    /**检查数据长度 */
    private static checkActivityTick(type?: number) {
        if (type == GiftBagTypeEnum.ITEM) {
            this.checkItemIcon();
        } else if (type == GiftBagTypeEnum.SHOP) {
            this.checkShopIcon();
        } else {
            this.checkItemIcon();
            this.checkShopIcon();
        }
    }
    /**判断是否添加限时礼包 */
    private static checkItemIcon() {
        let length = Utils.objectLenght(this.giftItems);
        if (length > 0) {
            FunctionModel.addNewFuncClient(FunctionType.GIFTBAG);
            this.createTick();
        } else {
            FunctionModel.removeFunc(FunctionType.GIFTBAG);
            this.clearTick();
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, null);
    }
    /**判断是否添加限时商城 */
    private static checkShopIcon() {
        let length = Utils.objectLenght(this.giftShopItems);
        if (length > 0) {
            FunctionModel.addNewFuncClient(FunctionType.GIFTSHOP);
            this.createTick();
        } else {
            FunctionModel.removeFunc(FunctionType.GIFTSHOP);
            this.clearTick();
        }
    }
    /**礼包状态更新 */
    public static updateGift(data: gameProto.IGiftBag[]) {
        if (platform.isHidePayFunc()) return;
        for (let key in data) {
            let info = data[key];
            this.jumpId = info.giftBagId;
            this.createVo(info, true);
            this.checkActivityTick(info.type);
            // com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG, null);
        }
    }

    /**购买礼包成功改变礼包状态 */
    public static setGiftState(data: gameProto.IS2C_TIME_LIMI_GIFT_BAG_BUY) {
        this.giftItems[data.shopId].giftBagStatus = data.giftBagStatus;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_BUY, data.shopId);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, null);
    }

    /**礼包领取奖励 */
    public static setGiftAward(id: number) {
        this.delGiftItem(id);
    }

    /**解析服务器在线数据 */
    public static parseData(data: gameProto.IS2C_TIME_LIMI_GIFT_BAG_INFO) {
        if (!data) return;
        if (platform.isHidePayFunc()) return;
        if (data.giftList.length > 0) {
            for (let i = 0; i < data.giftList.length; i++) {
                let info = data.giftList[i];
                this.createVo(info);
                this.checkActivityTick(info.type);
            }
        } else {
            this.checkActivityTick();
        }
    }
    public static createVo(data: gameProto.IGiftBag, isNew: boolean = false) {
        if (data.type == GiftBagTypeEnum.ITEM) {//限时礼包
            if (!this.giftItems[data.giftBagId]) {
                this.giftItems[data.giftBagId] = new GiftBagVo(data);
                if (isNew) {
                    //突破礼包
                    if (data.giftBagType == GiftItemEnum.genTupo) {
                        Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: this.jumpId });
                    } else if(data.giftBagType == GiftItemEnum.redGen||data.giftBagType == GiftItemEnum.roleLv||data.giftBagType == GiftItemEnum.genUpLv){
                        GiftBagModel.isPopItem = true;
                    }else{
                         ScenePopQueWnd.addGiftbagWnd();
                    }
                }
            } else {
                this.giftItems[data.giftBagId].update(data);
            }
        } else {//限时商城
            if (!this.giftShopItems[data.giftBagId]) {
                this.giftShopItems[data.giftBagId] = new GiftBagVo(data);
                if (isNew) GiftBagModel.isPopShop = true;
            }
        }

    }

    /**获得礼包 */
    public static getGiftItem(id: number) {
        return this.giftItems[id];
    }
    /**计算是否有未领取奖励 */
    public static getAwardState() {
        for (let key in this.giftItems) {
            let data = this.giftItems[key];
            if (data.canAward()) return true;
        }
        return false;
    }

    /**获取按钮状态 */
    public static getButtonState(gid: number) {
        return this.giftItems[gid].giftBagStatus;
    }



    /**请求礼包数据 */
    public static requestData() {
        //玩家个人限时礼包信息
        GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_INFO(1);
        //玩家个人限时商城信息
        GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_INFO(2);
    }
}

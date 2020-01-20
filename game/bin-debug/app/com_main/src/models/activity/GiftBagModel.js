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
var GiftItemEnum;
(function (GiftItemEnum) {
    /**君主等级 */
    GiftItemEnum[GiftItemEnum["roleLv"] = 2] = "roleLv";
    /**红将 */
    GiftItemEnum[GiftItemEnum["redGen"] = 1] = "redGen";
    /**武将升级 */
    GiftItemEnum[GiftItemEnum["genUpLv"] = 3] = "genUpLv";
    /**武将突破*/
    GiftItemEnum[GiftItemEnum["genTupo"] = 4] = "genTupo";
    /**君主升级（GM推）*/
    GiftItemEnum[GiftItemEnum["roleLvGm"] = 5] = "roleLvGm";
    /**vip等级（GM推）*/
    GiftItemEnum[GiftItemEnum["roleVipGm"] = 6] = "roleVipGm";
    /**全体开放（GM推）*/
    GiftItemEnum[GiftItemEnum["allOpenGm"] = 7] = "allOpenGm";
    /**具体玩家（GM推）*/
    GiftItemEnum[GiftItemEnum["concreteGm"] = 8] = "concreteGm";
    /**拥有武将（GM推）*/
    GiftItemEnum[GiftItemEnum["haveGenGm"] = 9] = "haveGenGm";
})(GiftItemEnum || (GiftItemEnum = {}));
var GiftBagTypeEnum;
(function (GiftBagTypeEnum) {
    /**限时礼包 */
    GiftBagTypeEnum[GiftBagTypeEnum["ITEM"] = 1] = "ITEM";
    /**限时商城 */
    GiftBagTypeEnum[GiftBagTypeEnum["SHOP"] = 2] = "SHOP";
})(GiftBagTypeEnum || (GiftBagTypeEnum = {}));
var GiftBagVo = /** @class */ (function (_super_1) {
    __extends(GiftBagVo, _super_1);
    function GiftBagVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    GiftBagVo.prototype.init = function (body) {
        this.isOver = false;
        this.parseData(body);
    };
    GiftBagVo.prototype.update = function (body) {
        this.parseData(body);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this.giftBagId);
    };
    GiftBagVo.prototype.parseData = function (body) {
        this.giftBagId = body.giftBagId;
        this.giftBagType = body.giftBagType;
        this.giftBagStatus = body.giftBagStatus;
        this.giftBagEffectTime = body.giftBagEffectTime;
        this.continueTime = body.continueTime;
        this.condition = body.condition;
        this.rechargeConfig = body.rechargeConfig;
    };
    GiftBagVo.prototype.onDestroy = function () {
    };
    GiftBagVo.prototype.canAward = function () {
        return this.giftBagStatus == 1;
    };
    /**是否过期 */
    GiftBagVo.prototype.isOverTime = function (serverTime) {
        // if (this.canAward()) return false;//未领奖的不过期
        if (this.isOver)
            return this.isOver;
        if (this.getCountDown() <= 0)
            this.isOver = true;
        return this.isOver;
    };
    /**获得礼包倒计时 */
    GiftBagVo.prototype.getCountDown = function () {
        return this.continueTime - (TimerUtils.getServerTime() - this.giftBagEffectTime);
    };
    return GiftBagVo;
}(BaseClass));
var GiftBagModel = /** @class */ (function () {
    function GiftBagModel() {
    }
    /**模块初始化 */
    GiftBagModel.init = function () {
        this.giftItems = {};
        this.giftShopItems = {};
    };
    GiftBagModel.clear = function () {
        this.clearTick();
        this.giftItems = null;
        this.giftShopItems = null;
    };
    /**刷新倒计时 */
    GiftBagModel.createTick = function () {
        if (!this.initTick) {
            this.initTick = true;
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
        }
    };
    GiftBagModel.clearTick = function () {
        if (this.initTick) {
            Utils.TimerManager.remove(this.timeCall, this);
            this.initTick = false;
        }
    };
    GiftBagModel.timeCall = function () {
        this.checkOutTime();
    };
    /**过期礼包删除 */
    GiftBagModel.checkOutTime = function () {
        var time = TimerUtils.getServerTime();
        var delKeys = [];
        for (var key in this.giftItems) {
            var data = this.giftItems[key];
            if (data.isOverTime(time)) {
                delKeys.push(data.giftBagId);
            }
            ;
        }
        for (var i = 0; i < delKeys.length; i++) {
            this.delGiftItem(delKeys[i]);
        }
    };
    /**移除礼包 */
    GiftBagModel.delGiftItem = function (id) {
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU, id);
        delete this.giftItems[id];
        this.checkActivityTick(GiftBagTypeEnum.ITEM);
    };
    /**检查数据长度 */
    GiftBagModel.checkActivityTick = function (type) {
        if (type == GiftBagTypeEnum.ITEM) {
            this.checkItemIcon();
        }
        else if (type == GiftBagTypeEnum.SHOP) {
            this.checkShopIcon();
        }
        else {
            this.checkItemIcon();
            this.checkShopIcon();
        }
    };
    /**判断是否添加限时礼包 */
    GiftBagModel.checkItemIcon = function () {
        var length = Utils.objectLenght(this.giftItems);
        if (length > 0) {
            FunctionModel.addNewFuncClient(FunctionType.GIFTBAG);
            this.createTick();
        }
        else {
            FunctionModel.removeFunc(FunctionType.GIFTBAG);
            this.clearTick();
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, null);
    };
    /**判断是否添加限时商城 */
    GiftBagModel.checkShopIcon = function () {
        var length = Utils.objectLenght(this.giftShopItems);
        if (length > 0) {
            FunctionModel.addNewFuncClient(FunctionType.GIFTSHOP);
            this.createTick();
        }
        else {
            FunctionModel.removeFunc(FunctionType.GIFTSHOP);
            this.clearTick();
        }
    };
    /**礼包状态更新 */
    GiftBagModel.updateGift = function (data) {
        if (platform.isHidePayFunc())
            return;
        for (var key in data) {
            var info = data[key];
            this.jumpId = info.giftBagId;
            this.createVo(info, true);
            this.checkActivityTick(info.type);
            // com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG, null);
        }
    };
    /**购买礼包成功改变礼包状态 */
    GiftBagModel.setGiftState = function (data) {
        this.giftItems[data.shopId].giftBagStatus = data.giftBagStatus;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_BUY, data.shopId);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, null);
    };
    /**礼包领取奖励 */
    GiftBagModel.setGiftAward = function (id) {
        this.delGiftItem(id);
    };
    /**解析服务器在线数据 */
    GiftBagModel.parseData = function (data) {
        if (!data)
            return;
        if (platform.isHidePayFunc())
            return;
        if (data.giftList.length > 0) {
            for (var i = 0; i < data.giftList.length; i++) {
                var info = data.giftList[i];
                this.createVo(info);
                this.checkActivityTick(info.type);
            }
        }
        else {
            this.checkActivityTick();
        }
    };
    GiftBagModel.createVo = function (data, isNew) {
        if (isNew === void 0) { isNew = false; }
        if (data.type == GiftBagTypeEnum.ITEM) { //限时礼包
            if (!this.giftItems[data.giftBagId]) {
                this.giftItems[data.giftBagId] = new GiftBagVo(data);
                if (isNew) {
                    //突破礼包
                    if (data.giftBagType == GiftItemEnum.genTupo) {
                        Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: this.jumpId });
                    }
                    else if (data.giftBagType == GiftItemEnum.redGen || data.giftBagType == GiftItemEnum.roleLv || data.giftBagType == GiftItemEnum.genUpLv) {
                        GiftBagModel.isPopItem = true;
                    }
                    else {
                        ScenePopQueWnd.addGiftbagWnd();
                    }
                }
            }
            else {
                this.giftItems[data.giftBagId].update(data);
            }
        }
        else { //限时商城
            if (!this.giftShopItems[data.giftBagId]) {
                this.giftShopItems[data.giftBagId] = new GiftBagVo(data);
                if (isNew)
                    GiftBagModel.isPopShop = true;
            }
        }
    };
    /**获得礼包 */
    GiftBagModel.getGiftItem = function (id) {
        return this.giftItems[id];
    };
    /**计算是否有未领取奖励 */
    GiftBagModel.getAwardState = function () {
        for (var key in this.giftItems) {
            var data = this.giftItems[key];
            if (data.canAward())
                return true;
        }
        return false;
    };
    /**获取按钮状态 */
    GiftBagModel.getButtonState = function (gid) {
        return this.giftItems[gid].giftBagStatus;
    };
    /**请求礼包数据 */
    GiftBagModel.requestData = function () {
        //玩家个人限时礼包信息
        GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_INFO(1);
        //玩家个人限时商城信息
        GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_INFO(2);
    };
    return GiftBagModel;
}());

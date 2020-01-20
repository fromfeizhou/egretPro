/**商城id枚举 */
var ShopStoreIdEnum;
(function (ShopStoreIdEnum) {
    /**武将商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["GENERAL"] = 1] = "GENERAL";
    /**宝石商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["STONE"] = 2] = "STONE";
    /**珍宝商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["TREASURE"] = 3] = "TREASURE";
    /**军团商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["LEGION"] = 4] = "LEGION";
    /**技能商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["SKILL"] = 5] = "SKILL";
    /**竞技场商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["ARENA"] = 11] = "ARENA";
    /**免单商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["FREE_ITEM"] = 7] = "FREE_ITEM";
    /**贵族商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["NOBLE"] = 12] = "NOBLE";
    /**军功商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["EXPLOIT"] = 14] = "EXPLOIT";
    /**过关斩将商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["CONQUER"] = 13] = "CONQUER";
    /**限时商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["GIFTSHOP"] = 200] = "GIFTSHOP";
    /**荣誉商城 */
    ShopStoreIdEnum[ShopStoreIdEnum["HONORSHOP"] = 15] = "HONORSHOP";
})(ShopStoreIdEnum || (ShopStoreIdEnum = {}));
/** 商店 */
var ShopModel = /** @class */ (function () {
    function ShopModel() {
    }
    //获取商店配置
    ShopModel.setShopTravelList = function (info) {
        this.m_ShopTravelList = info;
        this.m_ShopTravelList.presentTime = info.presentTime;
    };
    //获取商店配置
    ShopModel.getShopTravelList = function () {
        return this.m_ShopTravelList;
    };
    //获取商店配置
    ShopModel.setShopFixedlList = function (info) {
        this.m_ShopFixedList = info;
        this.m_ShopFixedList.presentTime = info.presentTime;
    };
    //获取商店配置
    ShopModel.getShopFixedList = function () {
        return this.m_ShopFixedList;
    };
    ShopModel.updateShopTravelListByitemId = function (itemId, bBuy) {
        var info = ShopModel.getShopTravelList();
        var items = info.items;
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].itemId == itemId) {
                    items[i].buy = bBuy;
                    break;
                }
            }
        }
    };
    ShopModel.updateShopFixedListByitemId = function (itemId, bBuy) {
        var info = ShopModel.getShopFixedList();
        var items = info.items;
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].itemId == itemId) {
                    items[i].buy = bBuy;
                    break;
                }
            }
        }
    };
    /**
     * itemId -> 格子内容
     *
     * 格子内容：
     * itemId//道具id
     * count//数量
     * type//类型
     *
     * ===========以下属性不一定有
     *
     * level//等级
     * quality//品质
     * property//额外属性json格式
     */
    ShopModel.m_ShopTravelList = null; //商店
    ShopModel.m_ShopFixedList = null; //
    return ShopModel;
}());

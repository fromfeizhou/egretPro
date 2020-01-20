/**商城id枚举 */
enum ShopStoreIdEnum {
    /**武将商城 */
    GENERAL = 1,
    /**宝石商城 */
    STONE = 2,
    /**珍宝商城 */
    TREASURE = 3,
    /**军团商城 */
    LEGION = 4,
    /**技能商城 */
    SKILL = 5,
    /**竞技场商城 */
    ARENA = 11,
    /**免单商城 */
    FREE_ITEM = 7,
    /**贵族商城 */
    NOBLE = 12,
    /**军功商城 */
    EXPLOIT = 14,
    /**过关斩将商城 */
    CONQUER = 13,
    /**限时商城 */
    GIFTSHOP = 200,
    /**荣誉商城 */
    HONORSHOP = 15,
}

/** 商店 */
class ShopModel {
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
    private static m_ShopTravelList = null;//商店
    private static m_ShopFixedList = null;//

    //获取商店配置
    public static setShopTravelList(info) {
        this.m_ShopTravelList = info;
        this.m_ShopTravelList.presentTime = info.presentTime;
    }
    //获取商店配置
    public static getShopTravelList() {
        return this.m_ShopTravelList;
    }
    //获取商店配置
    public static setShopFixedlList(info) {
        this.m_ShopFixedList = info;
        this.m_ShopFixedList.presentTime = info.presentTime;
    }
    //获取商店配置
    public static getShopFixedList() {
        return this.m_ShopFixedList;
    }

    public static updateShopTravelListByitemId(itemId: number, bBuy: boolean) {
        let info = ShopModel.getShopTravelList();
        let items = info.items;
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].itemId == itemId) {
                    items[i].buy = bBuy;
                    break;
                }

            }
        }
    }
    public static updateShopFixedListByitemId(itemId: number, bBuy: boolean) {
        let info = ShopModel.getShopFixedList();
        let items = info.items;
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].itemId == itemId) {
                    items[i].buy = bBuy;
                    break;
                }

            }
        }
    }

}
/**道具id枚举 */
enum PropEnum {
    NONE = 0,
    /**资源类 */
    GOLD = 1,//元宝(金币)
    SILVER = 2,//银两
    FOOD = 3,//粮食
    WOOD = 22,//木材
    YU = 6,  //勾玉
    IRON = 7,//铁

    MILITARY_EXPLOIT = 4,//军功
    EXP = 5,//经验
    // MARBLE = 6,//大理石
    MILITARY_MERITS_DAY = 8,//日军功
    BFS = 9,//兵法书
    SilverSacrifice = 11,//银币祭祀
    FoodSacrifice = 12,//粮食祭祀
    warSacrifice = 13,//兵书祭祀
    gemSacrifice = 14,//宝石祭祀

    VIP_EXP = 15,//贵族经验


    CONQUER = 32,//过关斩将积分
    GUILD_POINT = 18,//军团个人积分
    PVP_MEDAL = 23,//竞技勋章
    WORLD_VISIT_ITEM = 24,  //拜访贴
    WORLE_MOVE_BACK = 25,   //部队返回令牌

    EQUIP_QH = 26,//强化石
    EQUIP_SJ = 27,//升阶石
    EQUIP_JL = 28,//精炼石

    TREA_JH = 34,   //宝物精华
    NAME_CARD = 50, //改名卡
    BOSSSCORE = 51,//百战精华
    TUPODAN = 52,//突破丹

    MILITARY_MERITS_CONSUMED = 53,//可消耗军功

    MILITARY_MERITS_WEEK = 54,//周军功

    TURNTABLE = 55,     //幸运转盘道具   

    HONOR = 200,     //荣誉值    
    /**道具类 */
    // Alcohol = 101,//酒
    // JY = 102,//箭雨
    // Hammer = 103,//锤子
    // ExpFlag = 104,//经验旗
    // MilitaryExploitFlag = 105,//军功旗
    // Gift = 108,//礼物
    // GoldCup = 109,//金酒杯
    // MBL = 110,//募兵令

    CHAT_ITEM = 126,//喇叭
    // BFS                     = 111,//兵法书
    BronzeHF = 1035,//青铜虎符
    IronHF = 1045,//精铁虎符
    GoldHF = 1055,//黄金虎符
    XWHF = 1061,//玄武虎符
    QLHF = 1062,//青龙虎符
    ZQHF = 1063,//朱雀虎符
    BHHF = 1064,//白虎虎符
    CBF = 1335,//粗布幡
    WXF = 1345,//五行幡
    DWF = 1355,//帝王幡
    XWF = 1361,//玄武幡
    QLF = 1362,//青龙幡
    ZQF = 1363,//朱雀幡
    BHF = 1364,//白虎幡
    HTBY = 1635,//和田白玉
    WCFS = 1645,//五彩飞石
    XLBY = 1655,//血狼宝玉
    XWSS = 1661,//玄武神石
    ZQSS = 1662,//朱雀神石
    QLSS = 1663,//青龙神石
    BHSS = 1664,//白虎神石
    Gem1 = 2001,//1级宝石
    Gem2 = 2002,//2级宝石
    Gem3 = 2003,//3级宝石
    Gem4 = 2004,//4级宝石
    Gem5 = 2005,//5级宝石
    Gem6 = 2006,//6级宝石
    Gem7 = 2007,//7级宝石
    Gem8 = 2008,//8级宝石
    Gem9 = 2009,//9级宝石
    Gem10 = 2010,//10级宝石
    CJHB = 112,//初级谎报
    ZJHB = 113,//中级谎报
    GJHB = 114,//高级谎报
    CJZD = 115,//初级炸弹
    ZJZD = 116,//中级炸弹
    GJZD = 117,//高级炸弹
    CJNH = 118,//初级内讧
    ZJNH = 119,//中级内讧
    GJNH = 120,//高级内讧
    ZCCL = 121,//战车材料
    HSSY = 122,//红色武将授印
    ZSSY = 123,//紫色武将授印

    expBook1 = 2101, //初级经验书
    expBook2 = 2102, //中级经验书
    expBook3 = 2103, //高级经验书
    expBook4 = 2104, //极品经验书
    expBook5 = 2105, //绝世经验书

    MarchSpeedItem1 = 2241, //行军加速道具1
    MarchSpeedItem2 = 2242, //行军加速道具2

    ZML = 3000, //招募令

    XW = 1001,  //拜访武将信物
}

enum PropMainType {
    All = 0,
    RES = 1,	//资源
    ACC = 2,	//消耗品
    SOUL = 3,   //武将碎片
    SKILL_SOUL = 4,     //技能碎片
    TREASURE = 5,   //宝物
    STONE = 6,     //宝石
    EXP_BOOK = 7,   //经验书
    SPEED = 8,   //加速道具
    BUFF_PROP = 9, //持续buff道具
    GIFT = 10,//宝箱礼包
    RUN_BACK = 11,//召回令
    EQUIP_STRENG = 12,//强化石
    EQUIP_GRADE = 13,//升阶石
    EQUIP_WROUGHT = 14,//精炼石
    EQUIP = 15,//武将装备
    EQUIP_SOUL = 16,//装备碎片
    ARMY_GRADE = 17,    //士兵升阶材料
    GENERAL = 18,       //武将
    TREA_SOUL = 20,     //宝物碎片
}

/**宝石类型(PropMainType = 6) */
enum PropStoneType {
    ALL = 0,
    /**尖晶石*/
    JJS = 1,
    /**日光石*/
    RGS = 2,
    /**虎睛石*/
    HQS = 3,
    /**绿松石*/
    LSS = 4,
    /**青金石*/
    QJS = 5,
    /**月长石*/
    YCS = 6,
    /**苏纪石*/
    SJS = 7,
}

/**加速道具类型(PropMainType = 8) */
enum PropSpeedType {
    /**通用 */
    All = 1,
    /**建筑 */
    Build = 2,
    /**科技 */
    Technology = 3,
    /**练兵 */
    Soldier = 4,
    /**行军加速 */
    WorldMove = 5,
    /**采集加速 */
    WorldGather = 6,
    /**拜访加速 */
    WorldVisit = 7,
    /**城市建筑加速 */
    CityBuild = 8,
}

interface IItemInfo {
    /** 道具id*/
    itemId: number;
    /** 数量*/
    count: number;
}
interface IKeyValueInfo {
    /** 道具id*/
    key: number;
    /** 数量*/
    value: number;
}

class IItemInfoPool {
    private static pool: IItemInfo[] = [];
    public static create(id: number, count: number): IItemInfo {
        if (this.pool.length > 0) {
            let info = this.pool.pop();
            info.itemId = id;
            info.count = count;
            return info;
        }
        return { itemId: id, count: count };
    }

    public static release(info: IItemInfo) {
        this.pool.push(info);
    }
}

/** 道具管理 */
class PropModel {
    /**道具列表 uuid 为number 用自定义字典存储 */
    private static propDic: Dictionary;
    private static propList: { [key: number]: PropVo[] };

    /** 初始化道具列表*/
    public static init(list: any) {
        this.propDic = Dictionary.create();
        this.propList = [];
    }

    /**清理道具列表*/
    public static clear() {
        this.propList = null;
        this.propDic = null;
    }

    /**初始化背包数据 */
    public static initPorpItems(list: gameProto.IBackpackGrid[]) {
        for (let i = 0; i < list.length; i++) {
            this.addProp(list[i]);
        }
    }

    /**
     * 添加道具
     *  */
    public static addProp(data: gameProto.IBackpackGrid, isNew: boolean = false) {
        let cfg = C.ItemConfig[data.itemId];
        //装备 宝物数据不缓存到背包
        if (!cfg || cfg.mainType == PropMainType.EQUIP || cfg.mainType == PropMainType.TREASURE) return;

        if (this.getPropByUId(data.uuid)) {
            this.updateProp(data);
            return;
        }

        let vo = PropVo.create(data);
        vo.isNew = isNew;
        this.propDic.add(vo.uuid, vo);
        if (isNull(this.propList[vo.itemId])) {
            this.propList[vo.itemId] = [];
        }
        this.propList[vo.itemId].push(vo);

        /**新物品红点 */
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_ITEM_ADD, vo.uuid);
    }

    /**更新物品 */
    public static updateProp(info: gameProto.IBackpackGrid) {
        let vo = this.getPropByUId(info.uuid);
        if (vo) {
            vo.update(info);
            if (vo.count == 0) {
                this.delProp(info.uuid);
            }
        } else {
            this.addProp(info, true);
        }
        com_main.EventMgr.dispatchEvent(EventEnum.PROP_ITEM_CHANGE, info.itemId);
    }

    /**删除物品 */
    public static delProp(uuid: number) {
        let vo = this.getPropByUId(uuid);
        if (!vo) return;
        let list = this.propList[vo.itemId];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].uuid == vo.uuid) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
        if (list.length == 0) delete this.propList[vo.itemId];
        this.propDic.del(uuid);
        vo.onDestroy();
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_ITEM_DEL, uuid);
    }


    /**获得物品 */
    public static getPropByUId(uuid: number): PropVo {
        if (this.propDic.has(uuid)) {
            return this.propDic.get(uuid);
        }
    }

    /**获得道具数据表 */
    public static getPropList() {
        return this.propDic;
    }

    /**获得排序列表 */
    public static getSortPropList() {
        let list = [];
        this.propDic.forEach((key: number, data: PropVo) => {
            list.push(data);
        });
        list.sort(this.sortItemFunc.bind(this));
        return list;
    }

    /**物品排序 */
    private static sortItemFunc(a: PropVo, b: PropVo) {
        if (a.isNew != b.isNew) return a.isNew ? -1 : 1;
        if (a.type != b.type) {
            if (a.type == PropMainType.GIFT) return -1;
            if (b.type == PropMainType.GIFT) return 1;
            return a.type - b.type;
        }
        if (a.quality != b.quality) {
            return b.quality - a.quality;
        }
        return a.itemId - b.itemId;
    }


    /**
     * 获取道具数量
     * itemId 道具id
     *  */
    public static getPropNum(itemId: number): number {
        let itemCfg = C.ItemConfig[itemId]
        //是否是资源
        if (itemCfg.type == PropType.RESOURCE) {
            return RoleData.GetMaterialNumById(itemId);
        }
        let res = 0;
        let list = this.propList[itemId];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                res += list[i].count;
            }
        }
        res = res ? res : 0;
        return res;
    }

    /**
     * 获取某个种类的道具(根据道具表)
     * itemType 道具id
     *  */
    public static getPropItemListInCfgByType(itemType: number) {
        let list = [];

        let cfg = C.ItemConfig;
        for (let i in cfg) {
            if (cfg[i].mainType == itemType) {
                list.push(cfg[i]);
            }
        }

        return list;
    }

    /**
     * 获取某个n种类的道具
     * @param itemType 主类型
     */
    public static getPropItemListByTypes(itemType: PropMainType[], isSort: boolean = true): PropVo[] {
        let list = [];
        for (let i = 0; i < itemType.length; i++) {
            list = list.concat(this.getPropItemListByType(itemType[i], false));
        }
        if (isSort) {
            list.sort(this.sortItemFunc);
        }
        return list;
    }

    /**
     * 获取某个种类的道具
     * @param itemType 主类型
     */
    public static getPropItemListByType(itemType: PropMainType, isSort: boolean = true): PropVo[] {
        let list = [];
        this.propDic.forEach((key: number, data: PropVo) => {
            if (itemType == PropMainType.All) {
                //过滤装备碎片 武将碎片 技能碎片
                switch (data.type) {
                    case PropMainType.EQUIP_SOUL:
                    case PropMainType.SOUL:
                    case PropMainType.SKILL_SOUL:
                    case PropMainType.STONE:
                    case PropMainType.TREA_SOUL: {
                        break;
                    }
                    default: {
                        list.push(data);
                        break;
                    }
                }
            } else {
                if (data.type == itemType)
                    list.push(data);
            }
        });
        if (isSort) {
            list.sort(this.sortItemFunc);
        }
        return list;
    }


    /**
    * 获取某个种类的道具
    * @param itemType 主类型
    * @param subType 子类型
    */
    public static getPropItemListByAllType(itemType: PropMainType, subType: number, isSort: boolean = true): PropVo[] {
        let list = [];
        this.propDic.forEach((key: number, data: PropVo) => {
            if (data.type == itemType && data.subType == subType) {
                list.push(data);
            }
        });

        if (isSort) {
            list.sort(this.sortItemFunc);
        }
        return list;
    }

    /**根据id判断物品是否存在 */
    public static isOwnItemById(itemId: number) {
        if (this.propList[itemId] && this.propList[itemId].length > 0) return true;
        return false;
    }

    /**清理物品记录 */
    public static ClearNewPorpState() {
        this.propDic.forEach((key: number, data: PropVo) => {
            data.isNew = false;
        });
        /**红点(重新计算 背包是否存在新物品 判断红点) */
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_STATE_DEL, null);
    }

    //获取宝石
    public static getGemList(type: PropStoneType = PropStoneType.ALL): PropVo[] {
        let list = this.getPropItemListByType(PropMainType.STONE);
        let res = [];
        for (let i = 0; i < list.length; i++) {
            let info = list[i];
            if (type == PropStoneType.ALL || type == info.subType) {
                res.push(info);
            }
        }

        //升序
        res.sort((a: PropVo, b: PropVo) => {
            return a.itemId - b.itemId;
        });
        return res;
    }

    /**
     * 道具是否足够
     * @param itemId 道具id
     * @param cost 物品数量 1111111
     * @param tipsState (2进制位运算)道具不足时候 是否显示tip [(0-不显示) (1-显示文本tips) (2-显示道具来源)] //例如：3= 1 + 2 显示文本tips+显示道具来源
     * @returns {boolean}
     */
    public static isItemEnough(itemId: number, cost: number, tipsState: number = 0, tipsStr = ""): boolean {
        let itemCfg = C.ItemConfig[itemId];
        let isEnough = false;
        let isResource = itemCfg.type == PropType.RESOURCE;//是否是资源
        if (itemCfg) {
            if (isResource) {
                isEnough = RoleData.isbeyond(itemId, cost);
            } else {
                let itemNum = this.getPropNum(itemId);
                isEnough = itemNum >= cost;
            }
        }

        if (isEnough) return true;
        if (tipsState == 0) return false;
        //勾玉,元宝特殊处理
        if (itemId == PropEnum.GOLD) {
            this.goldLessToCharge();
        } else if (itemId == PropEnum.YU) {
            this.yuLessToCharge();
        } else {
            //弹出提示
            if ((tipsState & 1) == 1) {
                if (tipsStr == "") {
                    let tips = GCodeFromat(CLEnum.BAG_TIPS_DJSL, GLan(itemCfg.name), cost);
                    EffectUtils.showTips(tips, 1, true);

                } else {
                    EffectUtils.showTips(tipsStr, 1, true);
                }

            }
            //弹出道具来源
            if ((tipsState & 2) == 2) {
                if (itemCfg.sourcePrice != '') {
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(itemId);

                } else {
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, itemId);
                }
            }
        }

        return false;
    }
    /**
     * 道具列表是否满足
     * @param tipsState (2进制位运算)道具不足时候 是否显示tip [(0-不显示) (1-显示文本tips) (2-显示道具来源)] //例如：3= 1 + 2 显示文本tips+显示道具来源
     * 
     *  */
    public static isItemListEnough(infos: IItemInfo[], tipsState: number = 0, tipsStr = ""): boolean {
        for (let i = 0; i < infos.length; i++) {
            if (!this.isItemEnough(infos[i].itemId, infos[i].count, tipsState, tipsStr))
                return false;
        }
        return true;
    }

    public static goldLessToCharge(isClose: boolean = false) {
        if (platform.isHidePayFunc()) {
            EffectUtils.showTips(GCode(CLEnum.GOLD_LESS));
            return;
        }
        let tip: string = GCode(CLEnum.GOLD_LESS_TIPS);
        let func = function () {
            if (isClose)
                com_main.UpManager.history()
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        }
        Utils.showConfirmPop(tip, func, this);
    }
    /**勾玉不足提示前往充值*/
    public static yuLessToCharge(isClose: boolean = false) {
        if (platform.isHidePayFunc()) {
            EffectUtils.showTips(GCode(CLEnum.YU_LESS));
            return;
        }
        let tip: string = GCode(CLEnum.YU_LESS_TIPS);
        let func = function () {
            if (isClose)
                com_main.UpManager.history()
            Utils.open_view(TASK_UI.POP_PAY_SHOP_YU_VIEW);
        }
        Utils.showConfirmPop(tip, func, this);
    }
    /**
     * 道具变动飘字
     */
    public static itemAwardTips(valuesMessage: gameProto.IValuesMessage[]) {
        for (let key in valuesMessage) {
            let element = valuesMessage[key];
            let resourceName = Utils.getPropName(element.itemId);
            EffectUtils.showTips(GCodeFromat(CLEnum.BAG_GET_TIPS, resourceName, element.count));
        }
    }
    //=============================================================================================================================================
    //判断红点 begin
    //============================================================================================================================================= 

    /**是否有新物品 */
    public static getNewPorpNum(): number {
        let res = 0;
        this.propDic.forEach((key: number, data: PropVo) => {
            if (data.type != PropMainType.EQUIP_SOUL && data.isNew) {
                res = 1;
                return 'break';
            }
        });
        return res;
    }

    /**是否有合成装备 */
    public static getEquipCompNum(): number {
        let res = 0;
        this.propDic.forEach((key: number, data: PropVo) => {
            if (data.type == PropMainType.EQUIP_SOUL) {
                let cfg = C.EquipmentS2EConfig[data.itemId];
                if (PropModel.getPropNum(data.itemId) >= cfg.fragmentCount) {
                    res = 1;
                    return 'break';
                }
            }
        });
        return res;
    }

    //=============================================================================================================================================
    //判断红点 end
    //============================================================================================================================================= 

    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    public static getCfg(itemId: number): ItemConfig {
        let data = C.ItemConfig[itemId];
        return data;
    }

    public static getqualityPngByItemId(itemId: number) {
        let data = C.ItemConfig[itemId];
        if (data != null) {
            if (data.mainType == PropMainType.SOUL || data.mainType == PropMainType.SKILL_SOUL) {
                return `Qualitykuang${data.quality}_sp_png`;
            } else {
                return `Qualitykuang${data.quality}_png`;
            }
        }
        else
            return "";
    }

    public static getQualitySoulIcon(itemId: number) {
        let data = C.ItemConfig[itemId];
        return Utils.GetResName(`quality_icon${data.quality}_png`, 'quality_icon1_png');
    }


    /**获取道具图片路径 */
    public static getPropIcon(id: number): string {
        let key = id;
        let cfg = C.ItemConfig[key];
        if (cfg) {
            key = cfg.sourceIcon;
        }
        return Utils.GetResName('common_prop_' + key + '_png', "common_prop_101_png");
    }

    /**
	 * 获取品质颜色
	 */
    public static getColorOfItemId(itemId: number) {
        let data = C.ItemConfig[itemId];
        let quality = data ? data.quality : 1;
        return Utils.getColorOfQuality(quality);
    }


    /**物品描述 */
    public static getItemDesc(itemId: number) {
        let data = this.getCfg(itemId);
        let desc = GLan(data.name);
        return desc;
    }
    /**过滤军功显示 */
    public static filterItemList(rewards: any[]) {
        let len: number = rewards.length;
        for (let i = len - 1; i > 0; i--) {
            var element = rewards[i];
            let itemId = element.itemId;
            if (itemId == PropEnum.MILITARY_MERITS_CONSUMED || itemId == PropEnum.MILITARY_MERITS_WEEK)
                rewards.splice(i, 1)
        }
        return rewards;
    }
    /**是否有经验书 */
    public static isHasExpBook(): boolean {
        let list = this.getPropItemListByType(PropMainType.EXP_BOOK);
        for (let i = 0; i < list.length; i++) {
            if (list[i].count > 0) {
                return true;
            }
        }
        return false;
    }
}

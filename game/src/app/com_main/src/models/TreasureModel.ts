enum TreaType {
    ALL = 0,
    /**兵器 */
    WEAPON = 1,
    /**马匹 */
    RIDE = 2,
    /**珍宝 */
    GEM = 3,
}
/**宝物模块 */
class TreasureModel {
    public static STAR_MAX: number = 5;

    /**宝物列表 */
    private static m_tTreaList: { [key: number]: TreasureVo };
    private static m_tPreTreaList: { [key: number]: TreasureVo };

    /**模块初始化 */
    public static init() {
        this.m_tTreaList = {};
        this.m_tPreTreaList = {};
    }

    /**清理 */
    public static clear() {
        this.m_tTreaList = null;
    }

    /**初始化宝物列表 */
    public static initDataList(list: gameProto.ITreasureMessageInfo[]) {
        for (let i: number = 0; i < list.length; i++) {
            if (list[i]) {
                this.addData(list[i]);
            }
        }
    }

    /**添加宝物 */
    public static addData(data: gameProto.ITreasureMessageInfo) {
        let vo = TreasureVo.create(data);
        this.m_tTreaList[vo.itemId] = vo;
        com_main.EventMgr.dispatchEvent(TreaEvent.TREA_ADD, vo.itemId);
    }

    /**刷新宝物信息 */
    public static updateData(body: gameProto.ITreasureMessageInfo) {
        let vo = this.m_tTreaList[body.itemId];
        if (vo) {
            vo.update(body);
        }
    }

    /**是否拥有宝物 */
    public static isOwner(itemId: number) {
        if (this.m_tTreaList[itemId]) return true;
        return false;
    }

    /**获得宝物 */
    public static getData(itemId: number) {
        return this.m_tTreaList[itemId];
    }
    /**获得已拥有宝物列表 */
    public static getOwnerList() {
        let res: number[] = [];
        for (let key in this.m_tTreaList) {
            res.push(Number(key));
        }
        return res;
    }
    /**获得所有宝物列表 */
    public static getAllList(isOwner: boolean = true) {
        if (isOwner) return this.getOwnerList();
        let res: number[] = [];
        for (let key in C.TreasureConfig) {
            let cfg = C.TreasureConfig[key];
            if (unNull(cfg) && !this.isOwner(cfg.id)) {
                res.push(cfg.id);
            }
        }
        return res;
    }

    /**根据武将类型获取可装备列表 */
    public static getTreasByGeneralType(type: SoliderGeneralType = SoliderGeneralType.HAO_JIE): Array<TreasureVo> {
        let res = [];
        for (let key in this.m_tTreaList) {
            let vo = this.m_tTreaList[key] as TreasureVo;
            if (vo && vo.canEquipByType(type)) res.push(vo);
        }
        //升序
        res.sort((a: TreasureVo, b: TreasureVo) => {
            if (a.generalId > 0 && b.generalId == 0) return -1;
            if (a.generalId == 0 && b.generalId > 0) return 1;
            return b.fight - a.fight;
        })
        return res;
    }

    /**等级获得成长值
     *@param id 宝物id
     *@param level 等级
     */
    public static getMainAttris(id: number, level: number, star: number, quality: number): IKeyVal[] {
        let treaCfg = C.TreasureConfig[id];
        let res: IKeyVal[] = [];
        if (treaCfg) {
            let baseAttrs = StringUtils.keyValsToNumberArray(treaCfg.mainAttribute);
            let lvCfg = C.TreasureLevelConfig[level];
            let lvRates = StringUtils.keyValsToNumber(lvCfg.growUp);
            let starCfg = this.getStarCfg(star, quality);
            let starRates = StringUtils.keyValsToNumber(starCfg.attriAddRate);

            for (let i = 0; i < baseAttrs.length; i++) {
                let data = baseAttrs[i];
                let rate = Utils.getAttriValByType(lvRates, data.key) + Utils.getAttriValByType(starRates, data.key);
                data.value = Math.floor(data.value * (1 + rate / 10000));
                res.push(data);
            }
        }
        return res;
    }

    /**获得宝物品质框 */
    public static getTreaQualityBg(quality: number) {
        let imgUrl = "com_trea_quality" + quality + "_png"
        return Utils.GetResName(imgUrl, "com_trea_quality1_png")
    }

    /**获得宝物图标（常规图标） */
    public static getTreaIcon(itemId: number) {
        return PropModel.getPropIcon(itemId);
    }

    /**获得宝物图标(大图标) */
    public static getTreaBigIcon(itemId: number) {
        let cfg = C.ItemConfig[itemId];
        let sourceId = cfg ? cfg.sourceIcon : itemId;
        let imgUrl = `icon_trea_b_${sourceId}_png`;
        return Utils.GetResName(imgUrl, "icon_trea_b_1035_png")
    }

    /**获得宝石类型图标 */
    public static getPropStoneTypeIcon(type: PropStoneType) {
        let imgUrl = "com_stone_icon" + type + "_png";
        return Utils.GetResName(imgUrl, "com_stone_icon1_png");
    }

    /**获得宝石类型名字 */
    public static getPropStoneTypeName(type: PropStoneType) {
        switch (type) {
            case PropStoneType.JJS: return GCode(CLEnum.BAG_ITEM_JJS);
            case PropStoneType.RGS: return GCode(CLEnum.BAG_ITEM_RGS);
            case PropStoneType.HQS: return GCode(CLEnum.BAG_ITEM_HQS);
            case PropStoneType.LSS: return GCode(CLEnum.BAG_ITEM_LSS);
            case PropStoneType.QJS: return GCode(CLEnum.BAG_ITEM_QJS);
            case PropStoneType.YCS: return GCode(CLEnum.BAG_ITEM_YCS);
            case PropStoneType.SJS: return GCode(CLEnum.BAG_ITEM_SJS);
        }
        return '';
    }

    /**预览宝物数据 */
    public static getPreViewVo(id: number) {
        if (!this.m_tPreTreaList[id]) {
            let cfg = C.TreasureConfig[id];
            let data: gameProto.ITreasureMessageInfo = {
                mainAttribute: cfg.mainAttribute,
                allAttribute: cfg.mainAttribute,
                generalId: 0,
                itemId: id,
                level: 1,
                quality: cfg.quality,
                star: 0,
                holes: [],
                secondAttrId: [],
            }
            this.m_tPreTreaList[id] = TreasureVo.create(data);
        }
        return this.m_tPreTreaList[id];
    }

    /**获得红点状态 */
    public static getRedState(itemId: number, type: RedEvtType) {
        if (!FunctionModel.isFunctionOpen(FunctionType.TREASURE)) return 0;
        if (itemId > 0) {
            let vo = this.getData(itemId);
            if (vo) {
                return vo.getRedState(type) ? 1 : 0;
            }
        } else {
            let list = this.getOwnerList();
            for (let i = 0; i < list.length; i++) {
                let vo = this.getData(list[i])
                if (vo.getRedState(type)) return 1;
            }
        }
        return 0;
    }

    /**获得动画名字 */
    public static getMcName(id: number) {
        let cfg = C.ItemConfig[id];
        return cfg ? `Trea${cfg.sourceIcon}` : '';
    }

    /**存在动画资源 */
    public static hasMcRes(id: number) {
        let name = this.getMcName(id);
        let skeletonData = RES.hasRes(name + "_ske_dbbin");
        let pngData = RES.hasRes(name + "_tex_png");
        let textureData = RES.hasRes(name + "_tex_json");
        if (!pngData || !skeletonData || !textureData) {
            return false;
        }
        return true;
    }



    /**============================================================================================================================
     * 配置表 相关
     * ============================================================================================================================
     * */

    /**获得星级配置表 */
    public static getStarCfg(star: number = 0, quality: number = 1) {
        return C.TreasureStarConfigDic[star][quality];
    }

    /**解析加成配置 */
    private static parseAddRateByCfg(configs: any, cfgPropName: string = "attriAddRate") {
        let records = {};
        for (let key in configs) {
            let cfg = configs[key]
            if (cfg != null && cfg != undefined) {
                //表id数据链 (星级 品质)
                records[key] = {}

                let list = StringUtils.keyValsToNumber(cfg[cfgPropName]);
                for (let tmpKey in list) {
                    let attriType = Number(tmpKey);
                    records[key][attriType] = list[attriType];
                }
            }
        }
        return records;
    }


    /**获得对应孔位解锁星级 */
    public static getStoneOpenStar(quality: number, holeId: number) {
        for (let i = 0; i <= TreasureModel.STAR_MAX; i++) {
            let cfg = this.getStarCfg(i, quality);
            if ((cfg.unlockHole - 1) == holeId) return i;
        }
    }

    /**获得所有宝物列表 */
    public static getAllCfgs() {
        let res: TreasureConfig[] = [];
        for (let key in C.TreasureConfig) {
            let cfg = C.TreasureConfig[key];
            if (unNull(cfg)) {
                res.push(cfg);
            }
        }
        return res;
    }

    /**获得宝物固定次属性 */
    public static getSecondAttr(team: number, quality: number) {
        return C.SecondAttributeConfigDic[team] ? C.SecondAttributeConfigDic[team][quality] : null;
    }

}

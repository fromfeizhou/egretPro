/**装备模块 */
enum IEquipPos {
    /**武器 */
    Weapon = 0,
    /**衣服 */
    Cloth = 1,
    /**头盔 */
    Head = 2,
    /**鞋子 */
    Shoes = 3,
}
/**强化枚举 */
enum IEqStrengEnum {
    /**强化 */
    Level = 0,
    /**升阶 */
    Grade = 1,
    /**精炼 */
    Wrought = 2,
}
/**一键枚举 */
enum IEquipWearEnum {
    /**装备 */
    Wear = 0,
    /**卸装 */
    noWear = 1,
}
class EquipModel {
    /**装备位置列表 */
    public static POS_LIST: IEquipPos[] = [IEquipPos.Weapon, IEquipPos.Cloth, IEquipPos.Head, IEquipPos.Shoes];
    /**装备列表 uuid 为number 用自定义字典存储 */
    public static equipDic: Dictionary;
    public static m_tItems: IItemInfo[];//回收所得物品
    public static lvList: number[]; //回收选中的等级类型数组
    /**模块初始化 */
    public static init() {
        this.equipDic = Dictionary.create();
        this.lvList = [];
    }

    /**清理 */
    public static clear() {
        this.equipDic = null;
    }

    /**解析装备列表 */
    public static parseEquips(list: gameProto.IEquipment[]) {
        for (let i = 0; i < list.length; i++) {
            this.addEquip(list[i]);
        }
    }

    /**更新装备 */
    public static updateEquip(data: gameProto.IEquipment) {
        if (this.equipDic.has(data.uuid)) {
            let vo = this.equipDic.get(data.uuid) as EquipVo;
            vo.update(data);
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_IN, vo.slotType);
        }
    }

    /**添加装备 */
    public static addEquip(data: gameProto.IEquipment) {
        if (this.equipDic.has(data.uuid)) {
            this.updateEquip(data);
            return;
        }
        let vo = EquipVo.create(data);
        this.equipDic.add(vo.uuid, vo);
        com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_CHANGE, vo.slotType);
    }

    /**移除装备 */
    public static delEquip(uid: number) {
        if (this.equipDic.has(uid)) {
            let vo = this.equipDic.get(uid) as EquipVo;
            let pos = vo.slotType;
            this.equipDic.del(uid);

            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_CHANGE, pos);
        }
    }



    /**获得装备 */
    public static getEquipVoByUId(uid: number): EquipVo {
        return this.equipDic.get(uid)
    }

    /**获得装备列表 */
    public static getEquipVos(equipPos?: IEquipPos): EquipVo[] {
        let res = [];
        this.equipDic.forEach((key: number, val: EquipVo) => {
            if (isNull(equipPos) || equipPos == val.slotType) {
                res.push(val);
            }
        });

        res.sort((a: EquipVo, b: EquipVo) => { return b.fight - a.fight });

        return res;
    }

    /**
     * 获得可装备装备列表 
     * @uuid 当前装备
     * */
    public static getGenCanEquips(uuid: number, equipPos?: IEquipPos, offGen: boolean = true): EquipVo[] {
        let res = [];
        this.equipDic.forEach((key: number, val: EquipVo) => {
            if (isNull(equipPos) || equipPos == val.slotType) {
                // if (uuid != key) {
                if (offGen) {
                    if (val.generalId == 0) res.push(val);
                } else {
                    res.push(val);
                }
                // }
            }
        });

        res.sort((a: EquipVo, b: EquipVo) => {
            if (a.generalId != b.generalId) {
                return a.generalId > 0 ? 1 : -1;
            }
            return b.fight - a.fight
        });

        return res;
    }

    /**
     * 获得可回收装备列表 
     * @uuid 当前装备
     * */
    public static getCanRemoveEquips(): EquipVo[] {
        let res = [];
        this.equipDic.forEach((key: number, val: EquipVo) => {
            if (val.generalId == 0) res.push(val);
        });

        res.sort((a: EquipVo, b: EquipVo) => {
            return b.fight - a.fight
        });

        return res;
    }
    /**检查是否显示装备满了 */
    public static isEquipfull(ifFull: number) {
        if (ifFull > 0) {
            Utils.open_view(TASK_UI.NOR_EQUIP_FULL_VIEW, { type: ifFull });
        }
    }

    /**获取当前武将穿戴的4件装备 */
    public static checkEquipNum(genVo: GeneralVo, genId: number) {
        let tEquipArr = [];
        for (let i = 0; i < 4; i++) {
            let equipItem = genVo.getEquipByPos(i);
            let tEquipVos = EquipModel.getGenCanEquips(equipItem.equipmentUuid, i, false);
            let vo = this.getEquipVo(tEquipVos, genId);
            tEquipArr.push(vo);
        }
        return tEquipArr;
    }
    /**获取当前武将穿戴的单个装备 */
    private static getEquipVo(tEquipVos: EquipVo[], genId: number) {
        if (tEquipVos && tEquipVos.length > 0) {
            for (let i = 0; i < tEquipVos.length; i++) {
                let vo = tEquipVos[i];
                if (vo.generalId == genId) {
                    return vo;
                }
            }
        }
        return null;
    }
    //=============================================================================================================================================
    //界面相关 begin
    //============================================================================================================================================= 

    /**获得武将装备属性列表 */
    public static getGenEquipAttris(generalId: number): IKeyVal[] {
        let keyVal: { [key: number]: number } = {};

        let keys = [AttriType.ATK, AttriType.HP, AttriType.DEF, AttriType.SOLDIER];
        let genVo = GeneralModel.getOwnGeneral(generalId);
        for (let i = 0; i < 4; i++) {
            let equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0) {
                let eqVo = this.getEquipVoByUId(equip.equipmentUuid);
                this.addAttriInList(keyVal, eqVo.mainAttri);
            } else {
                this.addAttriInList(keyVal, { key: keys[i], value: 0 });
            }
        }
        //强化
        let vals = this.getGenEquipLvAttris(generalId);
        for (let i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        //进阶
        vals = this.getGenEquipGradeAttris(generalId);
        for (let i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        //精炼
        vals = this.getGenEquipWroughtAttris(generalId);
        for (let i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        //(强化,进阶，精炼)大师
        for (let k = 0; k < 3; k++) {
            vals = this.getLevelMaterAttris(k, generalId);
            for (let i = 0; i < vals.length; i++) {
                this.addAttriInList(keyVal, vals[i]);
            }
        }
        //套装
        let suitDatas = this.getGenSuits(generalId);
        let listData: IKeyVal[] = [];
        let attriList = [];
        for (let i = 0; i < suitDatas.length; i++) {
            let suitData = suitDatas[i];
            for (let level = 0; level < 3; level++) {
                if (suitData.value > level) {
                    let attri = EquipModel.getSuitAttri(suitData.key, level);
                    attriList = StringUtils.keyValsToNumberArray(attri);
                }
            }
            for (let j = 0; j < attriList.length; j++) {
                listData.push({
                    key: Number(attriList[j].key),
                    value: Number(attriList[j].value)
                });
            }
        }
        vals = listData;
        for (let i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        let res: IKeyVal[] = [];
        for (let j in keyVal) {
            res.push({ key: Number(j), value: Number(keyVal[j]) });
        }
        return res;
    }

    private static addAttriInList(keyVal: { [key: number]: number }, data: IKeyVal) {
        if (!keyVal[data.key]) {
            keyVal[data.key] = data.value;
        } else {
            keyVal[data.key] += data.value;
        }
    }
    /**获得(强化,进阶,精炼)大师属性 */
    public static getLevelMaterAttris(type: number, generalId: number): IKeyVal[] {
        let res: IKeyVal[] = [];
        let levels = EquipModel.getEqSumLevelsByType(type);
        let vo = GeneralModel.getOwnGeneral(generalId);
        let curLv = levels[levels.length - 1];
        for (let i = 0; i < 4; i++) {
            let equip = vo.getEquipByPos(i);
            if (type == 1) {
                if (curLv > equip.grade) curLv = equip.grade;
            } else if (type == 2) {
                if (curLv > equip.wrought) curLv = equip.wrought;
            } else {
                if (curLv > equip.strengthen) curLv = equip.strengthen;
            }

        }

        let index = -1;
        let nextIndex = -1;
        for (let i = 0; i < levels.length; i++) {
            if (curLv >= levels[i]) {
                index = i;
                nextIndex = i + 1;
            }
        }
        if (index != -1) {
            let attris: string;
            attris = EquipModel.getEqSumConfig(type, levels[index]).attribute;
            let attriList = StringUtils.keyValsToNumberArray(attris);
            res = StringUtils.keyValsToNumberArray(attris);
        }
        return res;
    }

    /**获得武将装备等级加成列表 */
    public static getGenEquipLvAttris(generalId: number): IKeyVal[] {
        let res: IKeyVal[] = [];
        let genVo = GeneralModel.getOwnGeneral(generalId);
        for (let i = 0; i < 4; i++) {
            let equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0 && equip.strengthen > 0) {
                let lvCfg = this.getLevelCfg(equip.id, equip.strengthen);
                if (lvCfg) {
                    let attriStr = lvCfg.addAttribute;
                    let attriList = StringUtils.keyValsToNumberArray(attriStr);
                    res = res.concat(attriList);
                }
            }
        }
        return res;
    }

    /**获得武将装备进阶加成列表 */
    public static getGenEquipGradeAttris(generalId: number): IKeyVal[] {
        let res: IKeyVal[] = [];
        let genVo = GeneralModel.getOwnGeneral(generalId);
        for (let i = 0; i < 4; i++) {
            let equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0 && equip.grade) {
                let eqVo = this.getEquipVoByUId(equip.equipmentUuid);
                res.push(eqVo.getGradeAdd(equip.grade));
            }
        }
        return res;
    }
    /**获得武将装备精炼加成列表 */
    public static getGenEquipWroughtAttris(generalId: number): IKeyVal[] {
        let res: IKeyVal[] = [];
        let resOther: IKeyVal[] = [];
        let keyVal: { [key: number]: number } = {};
        let genVo = GeneralModel.getOwnGeneral(generalId);
        for (let i = 0; i < 4; i++) {
            let equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0 && equip.wrought) {
                let wroungCfg = this.getWroughtCfg(equip.id, equip.wrought);
                this.getWroughtAttris(res, resOther, wroungCfg)
            }
        }
        let allKeyValue = res.concat(resOther);//全部属性（基础属性+加成的额外属性）
        let keyJlVal: { [key: number]: number } = {};
        let resJl: IKeyVal[] = [];  //精炼
        for (let i = 0; i < allKeyValue.length; i++) {
            this.addAttriInList(keyJlVal, allKeyValue[i]);
        }
        for (let j in keyJlVal) {
            resJl.push({ key: Number(j), value: Number(keyJlVal[j]) });
        }
        return resJl;
    }
    /**获得武将装备精炼加成列表 */
    private static getWroughtAttris(res: IKeyVal[], resOther: IKeyVal[], wroungCfg: EquipmentSlotWroughtConfig) {
        if (wroungCfg) {
            let attriStr = wroungCfg.addAttribute;
            let attriList = StringUtils.keyValsToNumberArray(attriStr);
            for (let j = 0; j < attriList.length; j++) {
                j == 0 ? res.push(attriList[j]) : resOther.push(attriList[j]);
            }
        }
    }

    /**获得武将套装列表 */
    public static getGenSuits(generalId: number, isAll?: boolean): IKeyVal[] {
        let res: IKeyVal[] = [];
        let resData: { [key: number]: number } = {};
        let genVo = GeneralModel.getOwnGeneral(generalId);
        for (let i = 0; i < 4; i++) {
            let equip = genVo.getEquipByPos(i);
            let suitId = -1;
            if (equip.equipmentUuid > 0) {
                let eqVo = this.getEquipVoByUId(equip.equipmentUuid);
                suitId = eqVo.suitId;
            }

            if (suitId > 0) {
                if (isNull(resData[suitId])) {
                    resData[suitId] = 0;
                } else {
                    resData[suitId]++;
                }
            }
        }
        for (let id in resData) {

            if (isAll) {
                res.push({ key: Number(id), value: resData[id] })
            } else {
                if (resData[id] >= 1) {
                    res.push({ key: Number(id), value: resData[id] })
                }
            }
        }
        return res;
    }

    //=============================================================================================================================================
    //界面相关 end
    //============================================================================================================================================= 

    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    /**获得进阶加成 */
    public static getGradeAddRate(gradeLv: number) {
        if (gradeLv == 0) return 0;
        if (gradeLv <= 20) return 0.03 * gradeLv;
        if (gradeLv <= 40) return 0.6 + 0.04 * (gradeLv - 20);
        if (gradeLv <= 60) return 1.4 + 0.05 * (gradeLv - 40);
        if (gradeLv <= 80) return 2.4 + 0.06 * (gradeLv - 60);
        return 3.6 + 0.08 * (gradeLv - 80);
    }
    /**等级配置 */
    public static getLevelCfg(pos: IEquipPos, level: number = 0): EquipmentSlotStrengthenConfig {
        return C.EquipmentSlotStrengthenConfigDic[pos][level];
    }

    /**进阶配置 */
    public static getGradeCfg(pos: IEquipPos, level: number = 0): EquipmentSlotUpgradeConfig {
        return C.EquipmentSlotUpgradeConfigDic[pos][level];
    }

    /**精炼配置 */
    public static getWroughtCfg(pos: IEquipPos, level: number = 0): EquipmentSlotWroughtConfig {
        return C.EquipmentSlotWroughtConfigDic[pos][level];
    }

    /**加成配置表 */
    public static getEqSumConfig(type: number, level: number): EquipmentSlotSumConfig {
        return C.EquipmentSlotSumConfigDic[type][level];
    }
    /**根据装备对应位置获取数据配置 */
    public static getLevelPosCfg(pos: IEquipPos, type: PropEnum) {
        let list = [];
        let equipcfg = this.getEquipcfg(type);
        for (let key in equipcfg) {
            if (equipcfg[key].slot == pos) {
                list.push(equipcfg[key]);
            }
        }
        return list;
    }
    /**根据类型返回对应配置 */
    private static getEquipcfg(type: PropEnum) {
        if (type == PropEnum.EQUIP_QH) {
            return C.EquipmentSlotStrengthenConfig;
        } else if (type == PropEnum.EQUIP_SJ) {
            return C.EquipmentSlotUpgradeConfig;
        } else {
            return C.EquipmentSlotWroughtConfig;
        }
    }

    /**加成等级列表 */
    public static getEqSumLevelsByType(type) {
        let cfgs = C.EquipmentSlotSumConfigDic[type];
        let res: number[] = [];
        for (let key in cfgs) {
            if (unNull(key)) res.push(Number(key));
        }
        res.sort((a: number, b: number) => {
            return a - b;
        });
        return res;
    }

    /**
    *  获得装备默认图标
    */
    public static getEquipIconByPos(pos: IEquipPos) {
        switch (pos) {
            case IEquipPos.Cloth:
                return 'equip_icon_yf_png';
            case IEquipPos.Head:
                return 'equip_icon_t_png';
            case IEquipPos.Weapon:
                return 'equip_icon_wq_png';
            case IEquipPos.Shoes:
                return 'equip_icon_x_png';
        }
        return 'equip_icon_t_png';
    }

    /**获得名字 */
    public static getEquipNameByPos(pos: IEquipPos) {
        switch (pos) {
            case IEquipPos.Cloth:
                return GCode(CLEnum.EQUIP_CLOTH);
            case IEquipPos.Head:
                return GCode(CLEnum.EQUIP_HEAD);
            case IEquipPos.Weapon:
                return GCode(CLEnum.EQUIP_WEAPON);
            case IEquipPos.Shoes:
                return GCode(CLEnum.EQUIP_SHOE);
        }
    }
    /**get suit color  (现在所有激活改为都是绿色) */
    public static getSuitColor(val: number) {
        switch (val) {
            case 0:
                return GameConfig.TextColors.green;
            case 1:
                return GameConfig.TextColors.green;
            case 2:
                return GameConfig.TextColors.green;
        }
        return GameConfig.TextColors.gray;
    }
    /**get suit color  (xx件套:)颜色 */
    public static getSuitNumColor(val: number) {
        switch (val) {
            case 0:
                return GameConfig.TextColors.quality2;
            case 1:
                return GameConfig.TextColors.quality2;
            case 2:
                return GameConfig.TextColors.quality2;
        }
        return GameConfig.TextColors.gray;
    }
    /**获得套装属性加成描述 */
    public static getSuitAttriDes(suitId: number, level: number) {
        let suitCfg = C.EquipmentSetConfig[suitId];
        if (suitCfg) {
            return suitCfg[`text${level + 2}`];
        }
        return '';
    }
    /**获得套装属性加成 */
    public static getSuitAttri(suitId: number, level: number) {
        let suitCfg = C.EquipmentSetConfig[suitId];
        if (suitCfg) {
            return suitCfg[`attribute${level + 2}`];
        }
        return '';
    }
    /**获得武将（强化，升阶，精炼）最小等级 */
    public static getMinEquipLevel(generalId: number, type: number) {
        let tEquiplvList: number[] = [];
        let genVo = GeneralModel.getOwnGeneral(generalId);
        for (let i = 0; i < 4; i++) {
            let equipItem = genVo.getEquipByPos(i);
            if (type == 1) {
                tEquiplvList.push(equipItem.strengthen);
            } else if (type == 2) {
                tEquiplvList.push(equipItem.grade);
            } else {
                tEquiplvList.push(equipItem.wrought);
            }
        }

        return Math.min.apply(Math, tEquiplvList);
    }
}

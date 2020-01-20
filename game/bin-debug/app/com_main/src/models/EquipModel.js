/**装备模块 */
var IEquipPos;
(function (IEquipPos) {
    /**武器 */
    IEquipPos[IEquipPos["Weapon"] = 0] = "Weapon";
    /**衣服 */
    IEquipPos[IEquipPos["Cloth"] = 1] = "Cloth";
    /**头盔 */
    IEquipPos[IEquipPos["Head"] = 2] = "Head";
    /**鞋子 */
    IEquipPos[IEquipPos["Shoes"] = 3] = "Shoes";
})(IEquipPos || (IEquipPos = {}));
/**强化枚举 */
var IEqStrengEnum;
(function (IEqStrengEnum) {
    /**强化 */
    IEqStrengEnum[IEqStrengEnum["Level"] = 0] = "Level";
    /**升阶 */
    IEqStrengEnum[IEqStrengEnum["Grade"] = 1] = "Grade";
    /**精炼 */
    IEqStrengEnum[IEqStrengEnum["Wrought"] = 2] = "Wrought";
})(IEqStrengEnum || (IEqStrengEnum = {}));
/**一键枚举 */
var IEquipWearEnum;
(function (IEquipWearEnum) {
    /**装备 */
    IEquipWearEnum[IEquipWearEnum["Wear"] = 0] = "Wear";
    /**卸装 */
    IEquipWearEnum[IEquipWearEnum["noWear"] = 1] = "noWear";
})(IEquipWearEnum || (IEquipWearEnum = {}));
var EquipModel = /** @class */ (function () {
    function EquipModel() {
    }
    /**模块初始化 */
    EquipModel.init = function () {
        this.equipDic = Dictionary.create();
        this.lvList = [];
    };
    /**清理 */
    EquipModel.clear = function () {
        this.equipDic = null;
    };
    /**解析装备列表 */
    EquipModel.parseEquips = function (list) {
        for (var i = 0; i < list.length; i++) {
            this.addEquip(list[i]);
        }
    };
    /**更新装备 */
    EquipModel.updateEquip = function (data) {
        if (this.equipDic.has(data.uuid)) {
            var vo = this.equipDic.get(data.uuid);
            vo.update(data);
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_IN, vo.slotType);
        }
    };
    /**添加装备 */
    EquipModel.addEquip = function (data) {
        if (this.equipDic.has(data.uuid)) {
            this.updateEquip(data);
            return;
        }
        var vo = EquipVo.create(data);
        this.equipDic.add(vo.uuid, vo);
        com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_CHANGE, vo.slotType);
    };
    /**移除装备 */
    EquipModel.delEquip = function (uid) {
        if (this.equipDic.has(uid)) {
            var vo = this.equipDic.get(uid);
            var pos = vo.slotType;
            this.equipDic.del(uid);
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_CHANGE, pos);
        }
    };
    /**获得装备 */
    EquipModel.getEquipVoByUId = function (uid) {
        return this.equipDic.get(uid);
    };
    /**获得装备列表 */
    EquipModel.getEquipVos = function (equipPos) {
        var res = [];
        this.equipDic.forEach(function (key, val) {
            if (isNull(equipPos) || equipPos == val.slotType) {
                res.push(val);
            }
        });
        res.sort(function (a, b) { return b.fight - a.fight; });
        return res;
    };
    /**
     * 获得可装备装备列表
     * @uuid 当前装备
     * */
    EquipModel.getGenCanEquips = function (uuid, equipPos, offGen) {
        if (offGen === void 0) { offGen = true; }
        var res = [];
        this.equipDic.forEach(function (key, val) {
            if (isNull(equipPos) || equipPos == val.slotType) {
                // if (uuid != key) {
                if (offGen) {
                    if (val.generalId == 0)
                        res.push(val);
                }
                else {
                    res.push(val);
                }
                // }
            }
        });
        res.sort(function (a, b) {
            if (a.generalId != b.generalId) {
                return a.generalId > 0 ? 1 : -1;
            }
            return b.fight - a.fight;
        });
        return res;
    };
    /**
     * 获得可回收装备列表
     * @uuid 当前装备
     * */
    EquipModel.getCanRemoveEquips = function () {
        var res = [];
        this.equipDic.forEach(function (key, val) {
            if (val.generalId == 0)
                res.push(val);
        });
        res.sort(function (a, b) {
            return b.fight - a.fight;
        });
        return res;
    };
    /**检查是否显示装备满了 */
    EquipModel.isEquipfull = function (ifFull) {
        if (ifFull > 0) {
            Utils.open_view(TASK_UI.NOR_EQUIP_FULL_VIEW, { type: ifFull });
        }
    };
    /**获取当前武将穿戴的4件装备 */
    EquipModel.checkEquipNum = function (genVo, genId) {
        var tEquipArr = [];
        for (var i = 0; i < 4; i++) {
            var equipItem = genVo.getEquipByPos(i);
            var tEquipVos = EquipModel.getGenCanEquips(equipItem.equipmentUuid, i, false);
            var vo = this.getEquipVo(tEquipVos, genId);
            tEquipArr.push(vo);
        }
        return tEquipArr;
    };
    /**获取当前武将穿戴的单个装备 */
    EquipModel.getEquipVo = function (tEquipVos, genId) {
        if (tEquipVos && tEquipVos.length > 0) {
            for (var i = 0; i < tEquipVos.length; i++) {
                var vo = tEquipVos[i];
                if (vo.generalId == genId) {
                    return vo;
                }
            }
        }
        return null;
    };
    //=============================================================================================================================================
    //界面相关 begin
    //============================================================================================================================================= 
    /**获得武将装备属性列表 */
    EquipModel.getGenEquipAttris = function (generalId) {
        var keyVal = {};
        var keys = [AttriType.ATK, AttriType.HP, AttriType.DEF, AttriType.SOLDIER];
        var genVo = GeneralModel.getOwnGeneral(generalId);
        for (var i = 0; i < 4; i++) {
            var equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0) {
                var eqVo = this.getEquipVoByUId(equip.equipmentUuid);
                this.addAttriInList(keyVal, eqVo.mainAttri);
            }
            else {
                this.addAttriInList(keyVal, { key: keys[i], value: 0 });
            }
        }
        //强化
        var vals = this.getGenEquipLvAttris(generalId);
        for (var i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        //进阶
        vals = this.getGenEquipGradeAttris(generalId);
        for (var i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        //精炼
        vals = this.getGenEquipWroughtAttris(generalId);
        for (var i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        //(强化,进阶，精炼)大师
        for (var k = 0; k < 3; k++) {
            vals = this.getLevelMaterAttris(k, generalId);
            for (var i = 0; i < vals.length; i++) {
                this.addAttriInList(keyVal, vals[i]);
            }
        }
        //套装
        var suitDatas = this.getGenSuits(generalId);
        var listData = [];
        var attriList = [];
        for (var i = 0; i < suitDatas.length; i++) {
            var suitData = suitDatas[i];
            for (var level = 0; level < 3; level++) {
                if (suitData.value > level) {
                    var attri = EquipModel.getSuitAttri(suitData.key, level);
                    attriList = StringUtils.keyValsToNumberArray(attri);
                }
            }
            for (var j = 0; j < attriList.length; j++) {
                listData.push({
                    key: Number(attriList[j].key),
                    value: Number(attriList[j].value)
                });
            }
        }
        vals = listData;
        for (var i = 0; i < vals.length; i++) {
            this.addAttriInList(keyVal, vals[i]);
        }
        var res = [];
        for (var j in keyVal) {
            res.push({ key: Number(j), value: Number(keyVal[j]) });
        }
        return res;
    };
    EquipModel.addAttriInList = function (keyVal, data) {
        if (!keyVal[data.key]) {
            keyVal[data.key] = data.value;
        }
        else {
            keyVal[data.key] += data.value;
        }
    };
    /**获得(强化,进阶,精炼)大师属性 */
    EquipModel.getLevelMaterAttris = function (type, generalId) {
        var res = [];
        var levels = EquipModel.getEqSumLevelsByType(type);
        var vo = GeneralModel.getOwnGeneral(generalId);
        var curLv = levels[levels.length - 1];
        for (var i = 0; i < 4; i++) {
            var equip = vo.getEquipByPos(i);
            if (type == 1) {
                if (curLv > equip.grade)
                    curLv = equip.grade;
            }
            else if (type == 2) {
                if (curLv > equip.wrought)
                    curLv = equip.wrought;
            }
            else {
                if (curLv > equip.strengthen)
                    curLv = equip.strengthen;
            }
        }
        var index = -1;
        var nextIndex = -1;
        for (var i = 0; i < levels.length; i++) {
            if (curLv >= levels[i]) {
                index = i;
                nextIndex = i + 1;
            }
        }
        if (index != -1) {
            var attris = void 0;
            attris = EquipModel.getEqSumConfig(type, levels[index]).attribute;
            var attriList = StringUtils.keyValsToNumberArray(attris);
            res = StringUtils.keyValsToNumberArray(attris);
        }
        return res;
    };
    /**获得武将装备等级加成列表 */
    EquipModel.getGenEquipLvAttris = function (generalId) {
        var res = [];
        var genVo = GeneralModel.getOwnGeneral(generalId);
        for (var i = 0; i < 4; i++) {
            var equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0 && equip.strengthen > 0) {
                var lvCfg = this.getLevelCfg(equip.id, equip.strengthen);
                if (lvCfg) {
                    var attriStr = lvCfg.addAttribute;
                    var attriList = StringUtils.keyValsToNumberArray(attriStr);
                    res = res.concat(attriList);
                }
            }
        }
        return res;
    };
    /**获得武将装备进阶加成列表 */
    EquipModel.getGenEquipGradeAttris = function (generalId) {
        var res = [];
        var genVo = GeneralModel.getOwnGeneral(generalId);
        for (var i = 0; i < 4; i++) {
            var equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0 && equip.grade) {
                var eqVo = this.getEquipVoByUId(equip.equipmentUuid);
                res.push(eqVo.getGradeAdd(equip.grade));
            }
        }
        return res;
    };
    /**获得武将装备精炼加成列表 */
    EquipModel.getGenEquipWroughtAttris = function (generalId) {
        var res = [];
        var resOther = [];
        var keyVal = {};
        var genVo = GeneralModel.getOwnGeneral(generalId);
        for (var i = 0; i < 4; i++) {
            var equip = genVo.getEquipByPos(i);
            if (equip.equipmentUuid > 0 && equip.wrought) {
                var wroungCfg = this.getWroughtCfg(equip.id, equip.wrought);
                this.getWroughtAttris(res, resOther, wroungCfg);
            }
        }
        var allKeyValue = res.concat(resOther); //全部属性（基础属性+加成的额外属性）
        var keyJlVal = {};
        var resJl = []; //精炼
        for (var i = 0; i < allKeyValue.length; i++) {
            this.addAttriInList(keyJlVal, allKeyValue[i]);
        }
        for (var j in keyJlVal) {
            resJl.push({ key: Number(j), value: Number(keyJlVal[j]) });
        }
        return resJl;
    };
    /**获得武将装备精炼加成列表 */
    EquipModel.getWroughtAttris = function (res, resOther, wroungCfg) {
        if (wroungCfg) {
            var attriStr = wroungCfg.addAttribute;
            var attriList = StringUtils.keyValsToNumberArray(attriStr);
            for (var j = 0; j < attriList.length; j++) {
                j == 0 ? res.push(attriList[j]) : resOther.push(attriList[j]);
            }
        }
    };
    /**获得武将套装列表 */
    EquipModel.getGenSuits = function (generalId, isAll) {
        var res = [];
        var resData = {};
        var genVo = GeneralModel.getOwnGeneral(generalId);
        for (var i = 0; i < 4; i++) {
            var equip = genVo.getEquipByPos(i);
            var suitId = -1;
            if (equip.equipmentUuid > 0) {
                var eqVo = this.getEquipVoByUId(equip.equipmentUuid);
                suitId = eqVo.suitId;
            }
            if (suitId > 0) {
                if (isNull(resData[suitId])) {
                    resData[suitId] = 0;
                }
                else {
                    resData[suitId]++;
                }
            }
        }
        for (var id in resData) {
            if (isAll) {
                res.push({ key: Number(id), value: resData[id] });
            }
            else {
                if (resData[id] >= 1) {
                    res.push({ key: Number(id), value: resData[id] });
                }
            }
        }
        return res;
    };
    //=============================================================================================================================================
    //界面相关 end
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    /**获得进阶加成 */
    EquipModel.getGradeAddRate = function (gradeLv) {
        if (gradeLv == 0)
            return 0;
        if (gradeLv <= 20)
            return 0.03 * gradeLv;
        if (gradeLv <= 40)
            return 0.6 + 0.04 * (gradeLv - 20);
        if (gradeLv <= 60)
            return 1.4 + 0.05 * (gradeLv - 40);
        if (gradeLv <= 80)
            return 2.4 + 0.06 * (gradeLv - 60);
        return 3.6 + 0.08 * (gradeLv - 80);
    };
    /**等级配置 */
    EquipModel.getLevelCfg = function (pos, level) {
        if (level === void 0) { level = 0; }
        return C.EquipmentSlotStrengthenConfigDic[pos][level];
    };
    /**进阶配置 */
    EquipModel.getGradeCfg = function (pos, level) {
        if (level === void 0) { level = 0; }
        return C.EquipmentSlotUpgradeConfigDic[pos][level];
    };
    /**精炼配置 */
    EquipModel.getWroughtCfg = function (pos, level) {
        if (level === void 0) { level = 0; }
        return C.EquipmentSlotWroughtConfigDic[pos][level];
    };
    /**加成配置表 */
    EquipModel.getEqSumConfig = function (type, level) {
        return C.EquipmentSlotSumConfigDic[type][level];
    };
    /**根据装备对应位置获取数据配置 */
    EquipModel.getLevelPosCfg = function (pos, type) {
        var list = [];
        var equipcfg = this.getEquipcfg(type);
        for (var key in equipcfg) {
            if (equipcfg[key].slot == pos) {
                list.push(equipcfg[key]);
            }
        }
        return list;
    };
    /**根据类型返回对应配置 */
    EquipModel.getEquipcfg = function (type) {
        if (type == PropEnum.EQUIP_QH) {
            return C.EquipmentSlotStrengthenConfig;
        }
        else if (type == PropEnum.EQUIP_SJ) {
            return C.EquipmentSlotUpgradeConfig;
        }
        else {
            return C.EquipmentSlotWroughtConfig;
        }
    };
    /**加成等级列表 */
    EquipModel.getEqSumLevelsByType = function (type) {
        var cfgs = C.EquipmentSlotSumConfigDic[type];
        var res = [];
        for (var key in cfgs) {
            if (unNull(key))
                res.push(Number(key));
        }
        res.sort(function (a, b) {
            return a - b;
        });
        return res;
    };
    /**
    *  获得装备默认图标
    */
    EquipModel.getEquipIconByPos = function (pos) {
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
    };
    /**获得名字 */
    EquipModel.getEquipNameByPos = function (pos) {
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
    };
    /**get suit color  (现在所有激活改为都是绿色) */
    EquipModel.getSuitColor = function (val) {
        switch (val) {
            case 0:
                return GameConfig.TextColors.green;
            case 1:
                return GameConfig.TextColors.green;
            case 2:
                return GameConfig.TextColors.green;
        }
        return GameConfig.TextColors.gray;
    };
    /**get suit color  (xx件套:)颜色 */
    EquipModel.getSuitNumColor = function (val) {
        switch (val) {
            case 0:
                return GameConfig.TextColors.quality2;
            case 1:
                return GameConfig.TextColors.quality2;
            case 2:
                return GameConfig.TextColors.quality2;
        }
        return GameConfig.TextColors.gray;
    };
    /**获得套装属性加成描述 */
    EquipModel.getSuitAttriDes = function (suitId, level) {
        var suitCfg = C.EquipmentSetConfig[suitId];
        if (suitCfg) {
            return suitCfg["text" + (level + 2)];
        }
        return '';
    };
    /**获得套装属性加成 */
    EquipModel.getSuitAttri = function (suitId, level) {
        var suitCfg = C.EquipmentSetConfig[suitId];
        if (suitCfg) {
            return suitCfg["attribute" + (level + 2)];
        }
        return '';
    };
    /**获得武将（强化，升阶，精炼）最小等级 */
    EquipModel.getMinEquipLevel = function (generalId, type) {
        var tEquiplvList = [];
        var genVo = GeneralModel.getOwnGeneral(generalId);
        for (var i = 0; i < 4; i++) {
            var equipItem = genVo.getEquipByPos(i);
            if (type == 1) {
                tEquiplvList.push(equipItem.strengthen);
            }
            else if (type == 2) {
                tEquiplvList.push(equipItem.grade);
            }
            else {
                tEquiplvList.push(equipItem.wrought);
            }
        }
        return Math.min.apply(Math, tEquiplvList);
    };
    /**装备位置列表 */
    EquipModel.POS_LIST = [IEquipPos.Weapon, IEquipPos.Cloth, IEquipPos.Head, IEquipPos.Shoes];
    return EquipModel;
}());

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
var GeneralVo = /** @class */ (function (_super_1) {
    __extends(GeneralVo, _super_1);
    function GeneralVo(id) {
        var _this = _super_1.call(this) || this;
        /**武将当前等级 */
        _this.level = 0;
        /**当前经验 */
        _this.curExp = 0;
        /**当前星数,当前星数为0 表示没这个英雄*/
        _this.star = 1;
        /**玩家武将技能列表 */
        _this.skills = [];
        /**玩家武将碎片 */
        _this.fragment = 0;
        /**合成需要武将碎片 */
        _this.needFragment = 0;
        /**初始品级 */
        _this.qualityLevel = 0;
        /**是否拥有 */
        _this.isOwn = false;
        /**城市建设状态 */
        _this.cityBuildState = CityBuildEnum.FREE;
        _this.init(id);
        return _this;
    }
    GeneralVo.create = function (id) {
        var obj = new GeneralVo(id);
        return obj;
    };
    GeneralVo.prototype.init = function (id) {
        this.generalId = id;
        this.config = C.GeneralConfig[id] || C.GeneralConfig[1001];
        //初始品级
        this.qualityLevel = this.config.qualityLevel;
        //武将类型
        this.generalOccupation = this.config.generalOccupation;
        this.attriList = StringUtils.keyValsToNumber(this.config.attribute);
        this.soldAttriList = [];
        this.equipSlot = {};
        this.initSkills();
    };
    GeneralVo.prototype.setQualityLevel = function (quality) {
        this.qualityLevel = quality;
    };
    GeneralVo.prototype.onDestroy = function () {
    };
    GeneralVo.prototype.update = function (body) {
        /**协议回调是否升级 */
        var isUpLevel = false;
        var isUpStar = false;
        var isUpgrade = false;
        if (this.upgradeLevel >= 0 && this.upgradeLevel != body.upgradeLevel)
            isUpgrade = true;
        if (this.level > 0 && this.level < body.level)
            isUpLevel = true;
        if (this.star > 0 && this.star < body.star)
            isUpStar = true;
        Utils.voParsePbData(this, body, GeneralVo.AttriKey);
        this.skills.sort(function (a, b) { return a.sequence - b.sequence; });
        //装备信息转换
        this.updateEquipSlot(body['generalEquipment'].slots);
        //属性转换
        for (var i = 0; i < this.attributeList.length; i++) {
            var data = this.attributeList[i];
            this.attriList[data.key] = data.value;
        }
        //兵种属性转换
        for (var i = 0; i < this.soldierAttribute.length; i++) {
            var data = this.soldierAttribute[i];
            this.soldAttriList[data.key] = data.value;
        }
        this.updateTreaVo();
        this.parseTupodanCosume();
        if (isUpLevel) {
            AGame.R.notifyView(TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT, { clientUplvMsg: 1 });
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_LEVEL, this.generalId);
        }
        if (isUpStar) {
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_STAR, this.generalId);
        }
        if (isUpgrade) {
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_TUPODAN, this.generalId);
        }
    };
    /**更新属性 */
    GeneralVo.prototype.updateAttri = function (data) {
        this.fight = data.fight;
        for (var i = 0; i < data.allAttribute.length; i++) {
            var attVk = data.allAttribute[i];
            this.attriList[attVk.key] = attVk.value;
        }
        com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.generalId);
    };
    /**更新装备孔信息 */
    GeneralVo.prototype.updateEquipSlot = function (data) {
        if (!data)
            return;
        for (var i = 0; i < data.length; i++) {
            this.equipSlot[data[i].id] = data[i];
        }
        com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_IN, this.generalId);
    };
    /**更新装备孔信息 */
    GeneralVo.prototype.updateEquipStreng = function (solt) {
        var data = this.equipSlot[solt.id];
        data.strengthen = solt.strengthen;
        data.grade = solt.grade;
        data.wrought = solt.wrought;
    };
    Object.defineProperty(GeneralVo.prototype, "own", {
        get: function () {
            return this.isOwn;
        },
        set: function (_own) {
            if (this.isOwn == _own)
                return;
            this.isOwn = _own;
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_GET, this.generalId);
        },
        enumerable: true,
        configurable: true
    });
    //////////////////////////////////////////////////////////////////////////////////
    /**兵种等级配置表 对应主城建筑等级的兵种 */
    GeneralVo.prototype.getGeneralArmyConfig = function () {
        var armyType = this.config.armyType;
        var armyCfg = MainMapModel.getSoldierLvCfg(armyType);
        return armyCfg;
    };
    /**获得带兵兵种 */
    GeneralVo.prototype.getGeneralArmyType = function () {
        return this.config.armyType;
    };
    /**强化配置表 */
    // public getGeneralStrengthenConfig(next) {
    // 	return GeneralModel.getGeneralStrengthenConfig(this.quality, this.level, next);
    // }
    /**君主加成表 */
    // public getPlayerLevelConfig() {
    // 	return C.PlayerLevelConfig[RoleData.level];
    // }
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * 获取武将声效
     */
    GeneralVo.prototype.getGeneralSound = function () {
        return 0;
        // return this.config.sound;
    };
    /**
     * 获取武将类型图标状态(小兵)
     */
    GeneralVo.prototype.getGeneralArmyTypeIconState = function () {
        return GeneralModel.getGeneralArmyTypeIconState(this.generalId);
    };
    /**
     * 获取武将兵种名称(小兵)
     */
    GeneralVo.prototype.getGeneralArmyTypeName = function () {
        return GeneralModel.getGeneralArmyTypeName(this.generalId);
    };
    /**
     * 获取武将兵种模型ID
     */
    GeneralVo.prototype.getGeneralArmyModelId = function () {
        //zb
        var aconfig = GeneralModel.getGeneralArmyConfig(this.generalId);
        return aconfig.ourModelCode;
    };
    /**
     * 获得武将类型
     */
    GeneralVo.prototype.getGeneralOccupation = function () {
        return this.generalOccupation;
    };
    /**
     * 获得武将类型
     */
    GeneralVo.prototype.getGeneralOccupationIcon = function (imgType) {
        return GeneralModel.getSoldierTypeIcon(this.generalOccupation, imgType);
    };
    //=============================================================================================================================================
    //技能 begin
    //============================================================================================================================================= 
    /**
     * 获取拥有技能信息
     * sequence	技能序号  标记它属于什么技能	[1-4]
     * skillId	技能id ，该值为0或没有值，表示还未获得
     * level	技能等级
     */
    GeneralVo.prototype.getOwnerSkillInfoBySeque = function (sequence) {
        for (var _i = 0, _a = this.skills; _i < _a.length; _i++) {
            var skill = _a[_i];
            if (skill.sequence == sequence) {
                return skill;
            }
        }
        return null;
    };
    /**技能初始化 */
    GeneralVo.prototype.initSkills = function () {
        if (!this.skills || this.skills.length == 0) {
            this.skills = [];
            this.skillNeedSoul = [];
            var anger = StringUtils.keyValsToNumberArray(this.config.angerSkill)[0];
            this.skills.push({ sequence: 1, skillId: anger.key, level: 0 });
            var skillLvCfg = GeneralModel.getSkillLvCfg(anger.key, 1);
            if (skillLvCfg) {
                var consume = Utils.parseCommonItemJson(skillLvCfg.upConsume)[0];
                this.skillNeedSoul.push(consume.itemId);
            }
            var others = StringUtils.keyValsToNumberArray(this.config.passiveSkill);
            for (var i = 0; i < others.length; i++) {
                this.skills.push({ sequence: i + 2, skillId: others[i].key, level: 0 });
                var cfg = C.SkillConfig[others[i].key];
                if (!cfg || cfg.skillType == 3)
                    continue;
                var skillLvCfg_1 = GeneralModel.getSkillLvCfg(others[i].key, 1);
                if (skillLvCfg_1) {
                    var consumes = Utils.parseCommonItemJson(skillLvCfg_1.upConsume);
                    if (consumes.length > 0)
                        this.skillNeedSoul.push(consumes[0].itemId);
                }
            }
        }
    };
    GeneralVo.prototype.getOwnerSkillInfoById = function (skillId) {
        for (var _i = 0, _a = this.skills; _i < _a.length; _i++) {
            var skill = _a[_i];
            if (skill.skillId == skillId) {
                return skill;
            }
        }
        return null;
    };
    /**
     * 技能课升级
     * 注：武将升级升星 影响技能等级上限 为减少运算量 红点事件刷新 不用再次计算
     *  */
    GeneralVo.prototype.canUpSkillList = function () {
        var res = {};
        if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_SKILL))
            return res;
        for (var _i = 0, _a = this.skills; _i < _a.length; _i++) {
            var data = _a[_i];
            res[data.skillId] = false;
            var cfg = C.SkillConfig[data.skillId];
            //过滤被动技能
            if (cfg.skillType == 3)
                continue;
            //等级上限判断
            if (!GeneralModel.isMaxSkill(data.skillId, data.level)) {
                var skillCfg = C.SkillLvConfigDic[data.skillId][data.level];
                var limitParam = skillCfg.upLimit.split('_');
                //武将等级 星级判断
                if (this.level >= Number(limitParam[0]) && this.star >= Number(limitParam[1])) {
                    var costs = Utils.parseCommonItemJson(skillCfg.upConsume);
                    if (PropModel.isItemListEnough(costs)) {
                        res[data.skillId] = true;
                    }
                }
            }
        }
        return res;
    };
    /**是否所需技能碎片 满级不需要*/
    GeneralVo.prototype.isNeedSkillSoul = function (itemId) {
        return this.skillNeedSoul.indexOf(itemId) >= 0;
    };
    //=============================================================================================================================================
    //技能 end
    //============================================================================================================================================= 
    /**
     * 获取品质颜色
     */
    GeneralVo.prototype.getColorOfQuality = function () {
        return Utils.getColorOfQuality(this.quality);
    };
    /**
     * 获取显示星星数
     */
    GeneralVo.prototype.getStarNum = function () {
        var starCfg = C.GeneralStarConfig[this.star];
        if (starCfg) {
            return starCfg.starlevel;
        }
        else {
            return 0;
        }
    };
    /**获得碎片数量 */
    GeneralVo.prototype.getSoulId = function () {
        return this.config.itemId;
    };
    /**获得碎片数量总数 */
    GeneralVo.prototype.getSoulNum = function () {
        return PropModel.getPropNum(this.getSoulId());
    };
    /**获得升星所需数量 */
    GeneralVo.prototype.getUpStarNeedNum = function () {
        var starCfg = C.GeneralStarConfig[this.star];
        if (starCfg) {
            return starCfg.soulNum;
        }
        else {
            return 0;
        }
    };
    /**可合成 */
    GeneralVo.prototype.canCollect = function () {
        if (!this.isOwn) {
            return this.getSoulNum() >= this.config.soul;
        }
        return false;
    };
    /**可升星 */
    GeneralVo.prototype.canUpStar = function () {
        if (this.isOwn) {
            if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_STAR))
                return false;
            if (this.star >= GeneralModel.MAX_STAR)
                return false;
            var needNum = this.getUpStarNeedNum();
            if (needNum > 0 && this.getSoulNum() >= needNum) {
                return true;
            }
        }
        return false;
    };
    /**可升级 */
    GeneralVo.prototype.canUpLevel = function (totalExp) {
        if (!this.own)
            return false;
        if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_LEVELUP))
            return false;
        if (this.level >= GeneralModel.getMaxLevel(this.upgradeLevel)) {
            return false;
        }
        if (this.curExp + totalExp >= this.GetMaxExp())
            return true;
        return false;
    };
    /**可突破 */
    GeneralVo.prototype.canTupodan = function (itemNum) {
        if (!this.own)
            return false;
        if (this.GetGeneralIsTuPo() == 0)
            return false;
        if (this.upgrageItem && RoleData.level >= this.GetGeneralCfg().playerLevel) {
            return itemNum >= this.upgrageItem.count;
        }
        return false;
    };
    /**可激活缘分 */
    GeneralVo.prototype.canActiveFate = function () {
        if (!this.own)
            return false;
        return FateModel.checkCanActiveFate(this.generalId);
    };
    /**记录突破需求 */
    GeneralVo.prototype.parseTupodanCosume = function () {
        var cfg = this.GetGeneralCfg();
        if (cfg && cfg.isUpgrade == 1) {
            this.upgrageItem = Utils.parseCommonItemJson(cfg.consume)[0];
        }
        else {
            this.upgrageItem = null;
        }
    };
    /**客户端模拟升级 */
    GeneralVo.prototype.addExpInClient = function (expNum) {
        //已满级
        if (this.level >= GeneralModel.getMaxLevel(this.upgradeLevel)) {
            return false;
        }
        var max = this.GetMaxExp();
        var totalExp = this.curExp + expNum;
        var oldLv = this.level;
        while (totalExp >= max) {
            //升级判断
            if (this.level + 1 <= GeneralModel.getMaxLevel(this.upgradeLevel)) {
                totalExp -= max;
                this.level++;
                max = this.GetMaxExp();
            }
            else {
                break;
            }
        }
        this.curExp = totalExp;
        com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EXP, this.generalId);
        if (this.level - oldLv > 0) {
            this.addLevelAttri(this.level - oldLv);
            this.parseTupodanCosume();
            AGame.R.notifyView(TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT, { clientUplvMsg: 1 });
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_LEVEL, this.generalId);
        }
        return true;
    };
    /**获得最大经验 */
    GeneralVo.prototype.GetMaxExp = function () {
        if (C.GeneralLevelConfig[this.level]) {
            return C.GeneralLevelConfig[this.level].exp;
        }
        return 100000;
    };
    /**获得当前武将等级配置 */
    GeneralVo.prototype.GetGeneralCfg = function () {
        return C.GeneralLevelConfig[this.level];
    };
    /**获得当前武将突破配置 */
    GeneralVo.prototype.GetGeneralTuPoCfg = function () {
        var tupoLevel = this.upgradeLevel;
        return C.GeneralLevelConfig[tupoLevel];
    };
    /**获得当前武将是否突破 */
    GeneralVo.prototype.GetGeneralIsTuPo = function () {
        var isTupo = 0;
        var cfg = this.GetGeneralCfg();
        if (cfg.isUpgrade == 1) {
            if (this.upgradeLevel != cfg.level) {
                isTupo = 1;
            }
        }
        return isTupo;
    };
    /**添加升级属性(客户端模拟升级) */
    GeneralVo.prototype.addLevelAttri = function (addLv) {
        var addAttri = this.getLevelGrowValues(addLv);
        this.attriList[AttriType.ATK] += addAttri[AttriType.ATK];
        this.attriList[AttriType.DEF] += addAttri[AttriType.DEF];
        this.attriList[AttriType.HP] += addAttri[AttriType.HP];
        this.attriList[AttriType.SOLDIER] += addAttri[AttriType.SOLDIER];
        this.fight = Utils.calculateFight(this.attriList, this.getGeneralArmyType());
    };
    /**获得战力加成系数 */
    GeneralVo.prototype.getFightAddValue = function () {
        //战斗力加成
        var _typeAdd = 1;
        switch (this.config.generalType) {
            case SoliderGeneralType.MENG_JIANG: {
                _typeAdd = 1.2;
                break;
            }
            case SoliderGeneralType.JUN_SHI: {
                _typeAdd = 1.1;
                break;
            }
        }
        return _typeAdd;
    };
    /**获得武将属性队列 */
    GeneralVo.prototype.getGenAttriList = function () {
        return this.attriList;
    };
    /**获得属性值 */
    GeneralVo.prototype.getGenAttriValByType = function (type) {
        return Utils.getAttriValByType(this.attriList, type);
    };
    /**获得等级提升战力 */
    GeneralVo.prototype.getLevelGrowValues = function (upLevel) {
        if (upLevel === void 0) { upLevel = 1; }
        var starcfg = C.GeneralStarConfig[this.star];
        var gencfg = this.config;
        // let attriCfgList = StringUtils.keyValsToNumber(gencfg.attribute);
        var coeff = ConstUtil.getGenCoeffs();
        /**====================================================主属性(无成长)========================================================== */
        var _power = this.attriList[AttriType.POWER];
        var _intelligence = this.attriList[AttriType.INTELLIGENCE];
        var _leadership = this.attriList[AttriType.LEADERSHIP];
        /**====================================================主属性(无成长)========================================================== */
        var rate = StringUtils.keyValsToNumber(starcfg.attribute);
        var atkRate = rate[AttriType.ATK_COEFFICIENT] / 10000, defRate = rate[AttriType.DEF_COEFFICIENT] / 10000, hpRate = rate[AttriType.HP_COEFFICIENT] / 10000, aHpRate = rate[AttriType.SOLDIER_COEFFICIENT] / 10000;
        var _atk = upLevel * (_power * (coeff.Pow2Atk + atkRate) + _intelligence * (coeff.Intel2Atk + atkRate)); //攻击
        var _def = upLevel * (_power * (coeff.Pow2Def + defRate) + _leadership * (coeff.Lead2Def + defRate)); //防御力
        var _hp = upLevel * (_leadership * (coeff.Lead2Hp + hpRate) + _intelligence * (coeff.Intel2Hp + hpRate)); //血量
        var _armyHp = upLevel * (_leadership * (coeff.Lead2AHp + aHpRate) + _intelligence * (coeff.Intel2AHp + aHpRate)); //兵力
        var tmpAttriList = {};
        tmpAttriList[AttriType.ATK] = Math.round(_atk);
        tmpAttriList[AttriType.DEF] = Math.round(_def);
        tmpAttriList[AttriType.HP] = Math.round(_hp);
        tmpAttriList[AttriType.SOLDIER] = Math.round(_armyHp);
        return tmpAttriList;
    };
    /**获得等级提升战力显示 */
    GeneralVo.prototype.getLevelGrowViewValues = function (upLevel) {
        if (upLevel === void 0) { upLevel = 1; }
        var attriList = this.getLevelGrowValues(upLevel);
        var _fight = Utils.calculateFight(attriList, this.getGeneralArmyType());
        var res = [];
        res.push(GCodeFromat(CLEnum.LEVEL_ADD, upLevel));
        res.push(Utils.getAttriFormat({ key: AttriType.ATK, value: attriList[AttriType.ATK] }));
        res.push(Utils.getAttriFormat({ key: AttriType.DEF, value: attriList[AttriType.DEF] }));
        res.push(Utils.getAttriFormat({ key: AttriType.HP, value: attriList[AttriType.HP] }));
        res.push(Utils.getAttriFormat({ key: AttriType.SOLDIER, value: attriList[AttriType.SOLDIER] }));
        //战斗力 额外显示
        res.push(_fight);
        return res;
    };
    //=============================================================================================================================================
    //宝物 begin
    //============================================================================================================================================= 
    /**拥有可装配宝物 */
    GeneralVo.prototype.hasTreaEq = function () {
        if (!this.own || this.treasureId > 0)
            return false;
        var list = TreasureModel.getTreasByGeneralType(this.getGeneralOccupation());
        for (var i = 0; i < list.length; i++) {
            if (list[i].generalId == 0)
                return true;
        }
        return false;
    };
    /**更新宝物数据 */
    GeneralVo.prototype.updateTreaVo = function () {
        if (this.treasureId && this.treasureId > 0) {
            this.treaVo = TreasureModel.getData(this.treasureId);
        }
        else {
            this.treaVo = null;
        }
    };
    /**获得武将宝物属性 */
    GeneralVo.prototype.getTreasureAddList = function () {
        if (this.treasureId) {
            return TreasureModel.getData(this.treasureId).getAllAttriList();
        }
        else {
            return Dictionary.create();
        }
    };
    /**获得宝物对应属性加成 */
    GeneralVo.prototype.getTreaAddValByType = function (type) {
        if (this.treaVo) {
            return this.treaVo.getAllAttriValByName(type);
        }
        return 0;
    };
    /**旧宝物数据缓存 (卡牌动画刷新 调用--发送协议签)*/
    GeneralVo.prototype.recordAttribute = function () {
        this.attriRecord = JSON.parse(JSON.stringify(this.attriList));
        this.fightRecord = this.fight;
    };
    /**获得宝物属性差异 */
    GeneralVo.prototype.getAttributeChangeValues = function () {
        var res = [];
        for (var i in this.attriList) {
            var _a = [Number(i), this.attriList[i]], key = _a[0], value = _a[1];
            var changeVal = value - Utils.getAttriValByType(this.attriRecord, key);
            if (changeVal != 0) {
                var format_1 = changeVal > 0 ? '%s<font color=#00ff00>%s</font>' : '%s<font color=#ff0000>%s</font>';
                if (key != AttriType.ATK_COEFFICIENT && key != AttriType.DEF_COEFFICIENT && key != AttriType.SOLDIER_COEFFICIENT && key != AttriType.HP_COEFFICIENT) {
                    res.push(Utils.getAttriFormat({ key: key, value: changeVal }, true, format_1));
                }
            }
        }
        //战斗力 额外显示
        res.push(this.fight - this.fightRecord);
        return res;
    };
    //=============================================================================================================================================
    //宝物 end
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //装备 begin
    //============================================================================================================================================= 
    /**获得对应孔位装备 */
    GeneralVo.prototype.getEquipByPos = function (pos) {
        return this.equipSlot[pos];
    };
    /**获得对应孔位装备 */
    GeneralVo.prototype.isEquipEmptyPos = function (pos) {
        return this.equipSlot[pos].equipmentUuid == 0;
    };
    /**查找更高战力装备 */
    GeneralVo.prototype.hasEquipHight = function (equip, list) {
        //当前孔有装备 比较战力
        var eqVo = EquipModel.getEquipVoByUId(equip.equipmentUuid);
        for (var i = 0; i < list.length; i++) {
            if (eqVo.fight < list[i].fight) {
                return true;
            }
        }
        return false;
    };
    /**可装备 */
    GeneralVo.prototype.canEquip = function (pos) {
        if (!this.own)
            return false;
        var posList = isNull(pos) ? EquipModel.POS_LIST : [pos];
        for (var i = 0; i < posList.length; i++) {
            var tmpPos = posList[i];
            var equip = this.equipSlot[tmpPos];
            var list = EquipModel.getGenCanEquips(equip.equipmentUuid, tmpPos);
            if (equip.equipmentUuid > 0) {
                //当前孔有装备 比较战力
                if (this.hasEquipHight(equip, list))
                    return true;
            }
            else {
                if (list.length > 0)
                    return true;
            }
        }
        return false;
    };
    /**可升级 */
    GeneralVo.prototype.canEquipLv = function (pos) {
        if (!this.own)
            return false;
        var posList = isNull(pos) ? EquipModel.POS_LIST : [pos];
        for (var i = 0; i < posList.length; i++) {
            var tmpPos = posList[i];
            var equip = this.equipSlot[tmpPos];
            if (!this.isMaxByStrengByType(equip, IEqStrengEnum.Level)) {
                var cfg = EquipModel.getLevelCfg(tmpPos, equip.strengthen);
                var costs = Utils.parseCommonItemJson(cfg.consume);
                if (PropModel.isItemListEnough(costs))
                    return true;
            }
        }
        return false;
    };
    /**可升阶 */
    GeneralVo.prototype.canEquipGrade = function (pos) {
        if (!this.own)
            return false;
        var posList = isNull(pos) ? EquipModel.POS_LIST : [pos];
        for (var i = 0; i < posList.length; i++) {
            var tmpPos = posList[i];
            var equip = this.equipSlot[tmpPos];
            if (!this.isMaxByStrengByType(equip, IEqStrengEnum.Grade)) {
                var cfg = EquipModel.getGradeCfg(tmpPos, equip.grade);
                if (cfg && cfg.level < 100) {
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    if (PropModel.isItemListEnough(costs))
                        return true;
                }
            }
        }
        return false;
    };
    /**可精炼 */
    GeneralVo.prototype.canEquipWrought = function (pos) {
        if (!this.own)
            return false;
        var posList = isNull(pos) ? EquipModel.POS_LIST : [pos];
        for (var i = 0; i < posList.length; i++) {
            var tmpPos = posList[i];
            var equip = this.equipSlot[tmpPos];
            if (!this.isMaxByStrengByType(equip, IEqStrengEnum.Wrought)) {
                var cfg = EquipModel.getWroughtCfg(tmpPos, equip.wrought);
                var costs = Utils.parseCommonItemJson(cfg.consume);
                if (PropModel.isItemListEnough(costs))
                    return true;
            }
        }
        return false;
    };
    /**对应位置装备 对应类型是否达到上限 */
    GeneralVo.prototype.isMaxByStrengByType = function (equip, type) {
        switch (type) {
            case 0:
                return equip.strengthen >= this.getMaxStrengByType(type);
            case 1:
                return equip.grade >= this.getMaxStrengByType(type);
            case 2:
                return equip.wrought >= this.getMaxStrengByType(type);
        }
        return false;
    };
    /**获得对应类型升级上限 */
    GeneralVo.prototype.getMaxStrengByType = function (type) {
        switch (type) {
            case 0:
                return this.level;
            case 1:
                return this.level;
            case 2:
                return this.level * 5;
        }
        return 0;
    };
    /**属性值 */
    GeneralVo.AttriKey = ["generalId", "level", "quality", "treasureId",
        "curExp", "star", "fight", "attributeList", "soldierAttribute", 'skills', 'generalEquipment', 'upgradeLevel'];
    return GeneralVo;
}(BaseClass));

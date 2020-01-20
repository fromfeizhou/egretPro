var UpAttriType;
(function (UpAttriType) {
    UpAttriType[UpAttriType["upStar"] = 1] = "upStar";
    UpAttriType[UpAttriType["TuPo"] = 2] = "TuPo";
})(UpAttriType || (UpAttriType = {}));
var GeneralModel = /** @class */ (function () {
    function GeneralModel() {
    }
    GeneralModel.init = function () {
        this.clear();
        if (!this.ownGenerals) {
            this.ownGenerals = Dictionary.create();
        }
        if (!this.otherPlayerGenerals) {
            this.otherPlayerGenerals = Dictionary.create();
        }
        this.initAllGeneralVo();
    };
    GeneralModel.clear = function () {
        if (this.ownGenerals) {
            this.ownGenerals.onDestroy();
            this.ownGenerals = null;
            this.currGenInfo = null;
        }
        if (this.otherPlayerGenerals) {
            this.otherPlayerGenerals.onDestroy();
            this.otherPlayerGenerals = null;
        }
    };
    /**
     * 其他玩家的武将数据
     */
    GeneralModel.setOtherPlayerGenerals = function (list) {
        this.otherPlayerGenerals.onDestroy();
        var len = list.length;
        for (var i = 0; i < len; i++) {
            var info = list[i];
            var playerId = info.playerId;
            var generals = [];
            for (var j = 0; j < info.generalInfo.length; j++) {
                var generalInfo = info.generalInfo[j];
                generals.push(GeneralVo.create(generalInfo));
            }
            this.otherPlayerGenerals.add(playerId, generals);
        }
    };
    /**
     * 其他玩家的武将数据
     */
    GeneralModel.getOtherPlayerGenerals = function () {
        return this.otherPlayerGenerals;
    };
    GeneralModel.initAllGeneralVo = function () {
        var configs = this.getGeneralConfig();
        var list = ConstUtil.getNumArray(IConstEnum.GENERAL_LIST);
        for (var i = 0; i < list.length; i++) {
            var id = list[i];
            var cfg = configs[id];
            if (cfg != null && cfg != undefined) {
                var vo = GeneralVo.create(id);
                this.ownGenerals.add(vo.generalId, vo);
            }
        }
    };
    /**
     * 设置已拥有的武将数据
     */
    GeneralModel.setOwnGenerals = function (list) {
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            var vo = this.getOwnGeneral(info.generalId);
            if (vo) {
                vo.update(info);
                vo.own = true;
            }
        }
        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
        ScenePopQueWnd.addFightWnd();
    };
    /**
     * 更新已拥有武将数据
     */
    GeneralModel.updateOwnGenerals = function (list) {
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            var vo = this.getOwnGeneral(info.generalId);
            vo.update(info);
        }
        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
        ScenePopQueWnd.addFightWnd();
    };
    /**刷新武将属性 */
    GeneralModel.updateGeneralAttri = function (data) {
        for (var i = 0; i < data.generalAttribute.length; i++) {
            var attriData = data.generalAttribute[i];
            var vo = GeneralModel.getOwnGeneral(attriData.generalId);
            if (vo) {
                vo.updateAttri(attriData);
            }
        }
        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
        ScenePopQueWnd.addFightWnd();
    };
    /**获取武将战斗力 */
    GeneralModel.getGeneralTotalFight = function () {
        var list = [];
        var len = this.ownGenerals.datum.length;
        for (var i = 0; i < len; i++) {
            var data = this.ownGenerals.datum[i];
            if (data.own == true) {
                list.push(data);
            }
        }
        if (list.length > 5) {
            list.sort(function (a, b) {
                return a.fight > b.fight ? -1 : 1;
            });
        }
        var res = 0;
        for (var i = 0; i < 5; i++) {
            if (i >= list.length)
                break;
            res += list[i].fight;
        }
        return res;
    };
    /**
     * 获取（升星,突破)前属性数据
     */
    GeneralModel.getUpStarInfo = function (generalId, type) {
        var generalVo;
        this.currProp = [];
        if (generalId) {
            generalVo = GeneralModel.getOwnGeneral(generalId);
            var attriList = generalVo.attriList; //基础属性
            for (var j in attriList) {
                if (UpAttriType.upStar == type) {
                    if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.CRITICAL) {
                        this.currProp.push({ key: Number(j), value: Number(attriList[j]) });
                    }
                }
                else {
                    if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER) {
                        this.currProp.push({ key: Number(j), value: Number(attriList[j]) });
                    }
                }
            }
        }
    };
    /**升级前,升星前,记录当前激活的技能id */
    GeneralModel.keepCurrSkillId = function (generalId) {
        this.currSkills = [];
        var generalVo;
        if (generalId) {
            generalVo = GeneralModel.getOwnGeneral(generalId);
            for (var i = 0; i < generalVo.skills.length; i++) {
                var info = generalVo.skills[i];
                if (info.skillId > 0 && info.level > 0)
                    this.currSkills.push(info.skillId);
            }
        }
    };
    /**升星升级后获取武将激活技能id列表 */
    GeneralModel.getCurSkills = function (generalId) {
        var skillIdList = [];
        var generalVo;
        if (generalId) {
            generalVo = GeneralModel.getOwnGeneral(generalId);
            for (var i = 0; i < generalVo.skills.length; i++) {
                var info = generalVo.skills[i];
                if (info.skillId > 0 && info.level > 0)
                    skillIdList.push(info.skillId);
            }
        }
        return skillIdList;
    };
    /**动画化判断 */
    GeneralModel.checkCanAtion = function (generalId) {
        var res = 0;
        var skillIds = this.getCurSkills(generalId);
        for (var i = 0; i < skillIds.length; i++) {
            if (this.currSkills && this.currSkills.indexOf(skillIds[i]) == -1) {
                res = skillIds[i];
                break;
            }
        }
        if (res > 0)
            Utils.open_view(TASK_UI.POP_GENERAL_UNLOCK_SKILL, { generalId: generalId, skillId: res });
    };
    /**获取5个最高战斗力武将列表 */
    GeneralModel.getGeneralHightList = function () {
        var list = [];
        var len = this.ownGenerals.datum.length;
        for (var i = 0; i < len; i++) {
            var data = this.ownGenerals.datum[i];
            if (data.own == true) {
                list.push(data);
            }
        }
        list.sort(function (a, b) {
            return a.fight > b.fight ? -1 : 1;
        });
        len = list.length > 5 ? 5 : list.length;
        var res = [];
        for (var i = 0; i < len; i++) {
            res.push(list[i]);
        }
        return res;
    };
    /**获取战斗力最高的近战武将 */
    GeneralModel.getGeneralHightNearAtk = function () {
        var list = [];
        var len = this.ownGenerals.datum.length;
        for (var i = 0; i < len; i++) {
            var data = this.ownGenerals.datum[i];
            if (data.own == true && data.config.generalType != 3) {
                list.push(data);
            }
        }
        list.sort(function (a, b) {
            return a.fight > b.fight ? -1 : 1;
        });
        return list[0];
    };
    /**
     * 获取拥有的武将数据
     */
    GeneralModel.getOwnGeneral = function (id) {
        return this.ownGenerals.get(id);
    };
    /**获得拥有武将列表 */
    GeneralModel.getOwnerGeneralList = function () {
        return this.ownGenerals;
    };
    /**获得默认武将id */
    GeneralModel.getGeneralDefaut = function () {
        return this.getOwnGeneralWithSortFight()[0].generalId;
    };
    /**获得拥有武将列表id */
    GeneralModel.getOwnGenIds = function () {
        var ids = [];
        this.ownGenerals.forEach(function (key, _data) {
            if (_data.own == true) {
                ids.push(_data.generalId);
            }
        }, this);
        return ids;
    };
    /**
     * 获取拥有武将的数量
     */
    GeneralModel.getOwnGeneralNum = function () {
        var num = 0;
        this.ownGenerals.forEach(function (key, _data) {
            if (_data.own == true) {
                num++;
            }
        }, this);
        return num;
    };
    /**
     * 获取排序过的已拥有武将数据
     */
    GeneralModel.getOwnGeneralWithSort = function (armyType) {
        var list = [];
        var len = this.ownGenerals.datum.length;
        for (var i = 0; i < len; i++) {
            var data = this.ownGenerals.datum[i];
            if (data.own == true) {
                if (!armyType || data.config.generalOccupation == armyType)
                    list.push(data);
            }
        }
        list.sort(GeneralModel.compareOfOnBattle);
        return list;
    };
    /**
     * 获取排序过的已拥有武将数据
     */
    GeneralModel.getOwnGeneralWithSortFight = function (generalType) {
        var list = [];
        var len = this.ownGenerals.datum.length;
        for (var i = 0; i < len; i++) {
            var data = this.ownGenerals.datum[i];
            if (data.own == true) {
                if (!generalType || data.config.generalType == generalType)
                    list.push(data);
            }
        }
        list.sort(function (a, b) {
            return b.fight - a.fight;
        });
        return list;
    };
    /**
     * 获取排序过的已拥有武将数据
     * （已上阵的武将排最后）用于重生功能
     * */
    GeneralModel.getOwnGeneralWithOnBattle = function (generalType) {
        var list = [];
        var len = this.ownGenerals.datum.length;
        for (var i = 0; i < len; i++) {
            var data = this.ownGenerals.datum[i];
            if (data.own == true) {
                if (!generalType || data.config.generalType == generalType)
                    list.push(data);
            }
        }
        list.sort(function (a, b) {
            var aboo = TeamModel.isOnBattle(a.generalId) ? 1 : 0;
            var bboo = TeamModel.isOnBattle(b.generalId) ? 1 : 0;
            ;
            if (aboo == bboo) {
                return b.fight - a.fight;
            }
            else {
                return aboo - bboo;
            }
        });
        return list;
    };
    /**
     * 单独设置一个武将数据
     */
    GeneralModel.updateOwnGeneral = function (info) {
        var vo = this.getOwnGeneral(info.generalId);
        vo.update(info);
        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
        ScenePopQueWnd.addFightWnd();
    };
    /**
     * 获取武将列表
     */
    GeneralModel.getAllGeneralInfo = function () {
        var _this = this;
        var onBattleList = [];
        this.ownGenerals.forEach(function (key, _data) {
            if (_data.seat == GeneralState.ON_BATTLE) {
                var _config = _this.getGeneralConfig(_data.generalId);
                var info = { data: _data, config: _config };
                onBattleList.push(info);
            }
        });
        return onBattleList;
    };
    /**
     * 获取武将的数据与配置
     */
    GeneralModel.getGeneral = function (id) {
        var _data = this.getOwnGeneral(id);
        var _config = this.getGeneralConfig(id);
        var info = { data: _data, config: _config };
        return info;
    };
    /**
     * 获取拥有的武将配置
     */
    GeneralModel.getGeneralConfig = function (id) {
        return GeneralData.getGeneralConfig(id);
    };
    /**
     * 获取武将声音
     */
    GeneralModel.getGeneralSoundByGeneralID = function (id) {
        return GeneralData.getGeneralConfig(id).sound;
    };
    /**
     * 获取拥有与未拥有的武将配置
     */
    GeneralModel.getAllGeneralConfig = function (level, armyType) {
        var _own = [];
        var _none = [];
        var configs = this.getGeneralConfig();
        var list = ConstUtil.getNumArray(IConstEnum.GENERAL_LIST);
        for (var i = 0; i < list.length; i++) {
            var id = list[i];
            var config = configs[id];
            if (config != null && config != undefined) {
                var ownGeneral = this.getOwnGeneral(id);
                if (ownGeneral.own) {
                    _own.push(config);
                }
                else {
                    if (!armyType || armyType == config.generalOccupation) {
                        _none.push(config);
                    }
                }
            }
        }
        return { own: _own, none: _none };
    };
    /**
     * 获取武将对应的兵种配置
     */
    GeneralModel.getGeneralArmyConfig = function (id) {
        var config = this.getGeneralConfig(id);
        var armyType = config.armyType;
        var armyCfg = MainMapModel.getSoldierLvCfg(armyType);
        return armyCfg;
    };
    /**
     * 状态初始化
     */
    GeneralModel.initOwnGeneralState = function () {
        var _this = this;
        this.ownGenerals.forEach(function (key, _data) {
            _data.seat = GeneralState.IDLE;
            _data.state = GeneralState.IDLE;
            _this.updateOwnGeneral(_data);
        });
    };
    /**
     * 获取武将类型图标状态
     */
    GeneralModel.getGeneralArmyTypeIconState = function (generalId) {
        var army = GeneralModel.getGeneralArmyConfig(generalId);
        var state = "state" + General_Pro_Code[army.mainType];
        return state;
    };
    /**
     * 获取武将兵种名称
     */
    GeneralModel.getGeneralArmyTypeName = function (generalId) {
        var army = GeneralModel.getGeneralArmyConfig(generalId);
        // let armyMain = C.ArmyMainTypeConfig[army.mainType as number];
        return GLan(army.name);
    };
    /**
     * 获取武将名称
     */
    GeneralModel.getGeneralName = function (generalId) {
        var config = GeneralModel.getGeneralConfig(generalId);
        if (config) {
            return GLan(config.name);
        }
        return generalId;
    };
    /**设置武将名字 */
    GeneralModel.setLabGaneralName = function (generalId, target) {
        var config = GeneralModel.getGeneralConfig(generalId);
        if (config) {
            target.text = GLan(config.name);
            Utils.setLabColorByQuality(target, config.qualityLevel);
        }
    };
    /**
     * 上阵优先排序
     */
    GeneralModel.compareOfOnBattle = function (a, b) {
        if (a.fight == b.fight) {
            if (a.level == b.level) {
                if (a.quality == b.quality) {
                    if (a.star == b.star) {
                        return (a.generalId - b.generalId) / Math.abs((a.generalId - b.generalId)); //升序
                    }
                    else {
                        return (b.star - a.star) / Math.abs((b.star - a.star)); //星级降序
                    }
                }
                else {
                    return (b.quality - a.quality) / Math.abs((b.quality - a.quality));
                }
            }
            else {
                return (b.level - a.level) / Math.abs((b.level - a.level));
            }
        }
        else {
            return (b.fight - a.fight) / Math.abs((b.fight - a.fight));
        }
    };
    /**根据武将等级获取武将升级上限 */
    GeneralModel.getMaxLevel = function (tuPoLevel) {
        var LevelList = [];
        for (var i in C.GeneralLevelConfig) {
            LevelList.push(C.GeneralLevelConfig[i]);
        }
        for (var k = 0; k < LevelList.length; k++) {
            var cfg = LevelList[k];
            if (tuPoLevel < cfg.level) {
                if (cfg.isUpgrade == 1) {
                    return cfg.level;
                }
            }
        }
    };
    /**武将等级上限tips */
    GeneralModel.getMaxLvTips = function () {
        var limitLv = ConstUtil.getValue(IConstEnum.MINIMUM_GENERAL_LEVEL_LIMIT);
        if (RoleData.level < limitLv) {
            return GCodeFromat(CLEnum.GEN_LV_LIMIT, limitLv, limitLv);
        }
        else {
            return GCodeFromat(CLEnum.GEN_LV_LIMIT1);
        }
    };
    //=============================================================================================================================================
    //                                                         武将装备红点 begin
    //============================================================================================================================================= 
    /**是否有武将可装配宝物 */
    GeneralModel.canTreaEquip = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var id = list_1[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.hasTreaEq()) {
                return true;
            }
        }
        return false;
    };
    /**是否有武将可装备 */
    GeneralModel.canEquip = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var id = list_2[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canEquip()) {
                return true;
            }
        }
        return false;
    };
    /**是否有武将可强化装备 */
    GeneralModel.canEquipLv = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
            var id = list_3[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canEquipLv()) {
                return true;
            }
        }
        return false;
    };
    /**是否有武将可进阶装备 */
    GeneralModel.canEquipGrade = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
            var id = list_4[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canEquipGrade()) {
                return true;
            }
        }
        return false;
    };
    /**是否有武将可精炼装备 */
    GeneralModel.canEquipWrought = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        for (var _i = 0, list_5 = list; _i < list_5.length; _i++) {
            var id = list_5[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canEquipWrought()) {
                return true;
            }
        }
        return false;
    };
    /**可合成 */
    GeneralModel.canCollected = function () {
        var res = false;
        this.ownGenerals.forEach(function (key, data) {
            if (data.isOwn == false && data.canCollect()) {
                res = true;
                return 'break;';
            }
        }, this);
        return res;
    };
    /**可升级 */
    GeneralModel.canUpLevel = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        var items = PropModel.getPropItemListByType(PropMainType.EXP_BOOK);
        var totalExp = 0;
        for (var i = 0; i < items.length; i++) {
            var id = items[i].itemId;
            var num = items[i].count;
            var cfg = C.ExpBookConfig[id];
            totalExp += cfg ? cfg.exp * num : 0;
        }
        for (var _i = 0, list_6 = list; _i < list_6.length; _i++) {
            var id = list_6[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canUpLevel(totalExp)) {
                return true;
            }
        }
        return false;
    };
    /**可突破 */
    GeneralModel.canTupodan = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        if (genId && !RedPointModel.hasGeneralInfo(genId))
            return false;
        var itemNum = PropModel.getPropNum(PropEnum.TUPODAN);
        for (var _i = 0, list_7 = list; _i < list_7.length; _i++) {
            var id = list_7[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canTupodan(itemNum)) { //突破后判断升级红点
                return true;
            }
        }
        return false;
    };
    /**可激活缘分 */
    GeneralModel.canActiveFate = function (genId) {
        var list = genId ? [genId] : RedPointModel.getRedGenIds();
        // if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
        if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_FATE))
            return false;
        for (var _i = 0, list_8 = list; _i < list_8.length; _i++) {
            var id = list_8[_i];
            var vo = this.getOwnGeneral(id);
            if (vo && vo.canActiveFate()) { //升星之后判断激活缘分
                return true;
            }
        }
        return false;
    };
    /** 记录点击查看的武将信息*/
    GeneralModel.getClickGenInfo = function (param) {
        this.currGenInfo = param;
    };
    //=============================================================================================================================================
    //                                                         武将装备红点 end
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //                                                         武将资源统一接口begin
    //============================================================================================================================================= 
    /**获得技能图标 */
    GeneralModel.getSkillIcon = function (skillId) {
        var skillInfo = C.SkillConfig[skillId];
        var res = "";
        if (skillInfo) {
            res = Utils.GetResName("icon_jn_" + skillInfo.icon + "_png", "icon_jn_1_png");
        }
        return res;
    };
    /**
     * 排序未获得武将
     */
    GeneralModel.compareNoGeneral = function (a, b) {
        return b.qualityLevel - a.qualityLevel;
    };
    /**头像背景 */
    GeneralModel.getHeadItemBgByQuality = function (quality) {
        if (quality === void 0) { quality = 0; }
        return "general_bg" + quality + "_png";
    };
    // /**(小)武将头像背景 */
    GeneralModel.getComHeadItemBgByQuality = function (quality) {
        if (quality === void 0) { quality = 0; }
        return "small_general_head_bg_" + quality + "_png";
    };
    /**武将类型图标 */
    GeneralModel.getSoldierTypeIcon = function (generalOcc, imgType) {
        if (imgType === void 0) { imgType = 1; }
        var imgTypeFix = "";
        if (imgType == 2)
            imgTypeFix = "2";
        switch (generalOcc) {
            case SoldierMainType.FOOTSOLDIER: {
                return "general_type_bubing" + imgTypeFix + "_png";
            }
            case SoldierMainType.ARROWSOLDIER: {
                return "general_type_gongbing" + imgTypeFix + "_png";
            }
            case SoldierMainType.PIKEMAN: {
                return "general_type_qiangbing2_png";
            }
            default: {
                return "general_type_qibing" + imgTypeFix + "_png";
            }
        }
    };
    /**士兵类型图标 */
    GeneralModel.getIconBySoldierType = function (imgType) {
        if (imgType === void 0) { imgType = 101; }
        switch (imgType) {
            case 101: {
                return "general_type_bubing_png";
            }
            case 102: {
                return "general_type_qibing_png";
            }
            case 103: {
                return "general_type_gongbing_png";
            }
            default: {
                return "general_type_qibing_png";
            }
        }
    };
    /**获取武将头像 */
    GeneralModel.getSoldierLogo = function (idstr) {
        var img_url = "icon_wj_" + idstr + "_png";
        // var texture = RES.getRes(img_url);
        // if (!texture)
        // 	texture = RES.getRes("icon_wj_0_png");
        return Utils.GetResName(img_url, "icon_wj_0_png");
        ;
    };
    /**获取武将展示 */
    GeneralModel.getSoldierBigLogo = function (idstr) {
        var img_url = "icon_wj_b_" + idstr + "_png";
        return Utils.GetResName(img_url, "icon_wj_b_0_png");
    };
    /**获取武将展示 */
    GeneralModel.getCircleLogo = function (idstr) {
        var img_url = "rgh" + idstr + "_png";
        return Utils.GetResName(img_url, "rgh0_png");
    };
    /**存在动画资源 */
    GeneralModel.hasSoliderLogoAnima = function (id) {
        var skeletonData = RES.hasRes("Gen_Anim_" + id + "_ske_dbbin");
        var pngData = RES.hasRes("Gen_Anim_" + id + "_tex_png");
        var textureData = RES.hasRes("Gen_Anim_" + id + "_tex_json");
        if (!pngData || !skeletonData || !textureData) {
            return false;
        }
        return true;
    };
    /**获取武将展示背景 */
    GeneralModel.getSoldierQualityBigLogoBg = function (quaLevel) {
        var img_url = "general_card_bg" + quaLevel + "_jpg";
        return Utils.GetResName(img_url, "general_card_bg1_jpg");
    };
    /**武将卡品质框 */
    GeneralModel.getSoldierQualityBigLogo = function (quaLevel) {
        var img_url = "general_card_bgmk" + quaLevel + "_png";
        return Utils.GetResName(img_url, "general_card_bgmk1_png");
    };
    /**武将等级背景图 */
    GeneralModel.getSoldierQualityLogo = function (quaLevel) {
        var img_url = "tavern_wj_bg_" + quaLevel + "_png";
        return Utils.GetResName(img_url, "tavern_wj_bg_1_png");
    };
    /**武将品质颜色 */
    GeneralModel.getGeneralQualityColor = function (quaLevel) {
        return Utils.getColorOfQuality(quaLevel);
    };
    /**获取武将模型ID */
    GeneralModel.getGeneralModelId = function (generalId) {
        //zb
        var army = GeneralModel.getGeneralArmyConfig(generalId);
        var model = C.ArmyModelConfig[army.ourModelCode];
        return Number(model.code);
    };
    /**获得武将国家资源 */
    GeneralModel.getSoldierNationLogo = function (nationType) {
        var img_url = "";
        switch (nationType) {
            case SoldierNationType.SU: {
                img_url = "lb_sg_png";
                break;
            }
            case SoldierNationType.WEI: {
                img_url = "lb_wg_png";
                break;
            }
            case SoldierNationType.WU: {
                img_url = "lb_w_png";
                break;
            }
            case SoldierNationType.QUN: {
                img_url = "lb_wq_png";
                break;
            }
        }
        return Utils.GetResName(img_url, "lb_sg_png");
    };
    /**
     * 获得星星资源
     */
    GeneralModel.getStarRes = function (type) {
        var imgStar = "gen_star" + type + "_png";
        return Utils.GetResName(imgStar, "gen_star1_png");
    };
    /**
     * 获得星星背景资源
     */
    GeneralModel.getStarBgRes = function (type) {
        var imgBg = "gen_starbg" + type + "_png";
        return Utils.GetResName(imgBg, "gen_starbg1_png");
    };
    /**
     * 获得星星配置表
     */
    GeneralModel.getStarCfg = function (star) {
        var starCfg = C.GeneralStarConfig[star];
        if (starCfg) {
            return starCfg;
        }
        else {
            return C.GeneralStarConfig[1];
        }
    };
    /**排序 */
    GeneralModel.sortBystate = function (a, b) {
        var aAttri = GeneralModel.getAttriById(a.key);
        var bAttri = GeneralModel.getAttriById(b.key);
        if (aAttri < bAttri) { //按id顺序
            return -1;
        }
        else if (aAttri > bAttri) {
            return 1;
        }
        else {
            return 0;
        }
    };
    /**根据Id获取武将属性排序表对应数据id */
    GeneralModel.getAttriById = function (id) {
        for (var key in C.GeneralShowConfig) {
            var attri = C.GeneralShowConfig[key];
            if (attri.AttriId == id) {
                return attri.id;
            }
        }
        return 0;
    };
    GeneralModel.getWarPositionStr = function (pos) {
        return GCode(CLEnum['WAR_POSITION_' + pos]);
    };
    GeneralModel.getNationText = function (generalId) {
        var config = C.GeneralConfig[generalId];
        if (config) {
            return this.getNationTextByCountryId(config.nationType);
        }
        else {
            return { text: GCode(CLEnum.STATE_SHU), color: 0x70f145 };
        }
    };
    GeneralModel.getNationTextByCountryId = function (countryId) {
        if (countryId == 1) {
            return { text: GCode(CLEnum.STATE_WEI), color: 0x44d0f3 };
        }
        else if (countryId == 2) {
            return { text: GCode(CLEnum.STATE_SHU), color: 0x70f145 };
        }
        else if (countryId == 3) {
            return { text: GCode(CLEnum.STATE_WU), color: 0xff2727 };
        }
        else if (countryId == 4) {
            return { text: GCode(CLEnum.STATE_QUN), color: 0xe9e9e6 };
        }
        else {
            return { text: GCode(CLEnum.STATE_QUN), color: 0xe9e9e6 };
        }
    };
    //=============================================================================================================================================
    //                                                         武将资源统一接口end
    //============================================================================================================================================= 
    /**获得升级限制
     * @return [武将等级，武将星级]
    */
    GeneralModel.getUpSkillLimit = function (skillId, level) {
        if (level === void 0) { level = 0; }
        var skillCfg = C.SkillLvConfigDic[skillId][level];
        if (skillCfg) {
            var skills = skillCfg.upLimit.split('_');
            return { level: Number(skills[0]), star: Number(skills[1]) };
        }
        return { level: 999, star: 999 };
    };
    /**技能等级已满 */
    GeneralModel.isMaxSkill = function (skillId, level) {
        var skillCfg = C.SkillLvConfigDic[skillId][level + 1];
        if (!skillCfg)
            return true;
        return false;
    };
    /**获得技能描述 */
    GeneralModel.getSkillDesByLv = function (skillId, level) {
        if (level === void 0) { level = 0; }
        if (C.SkillLvConfigDic[skillId] && C.SkillLvConfigDic[skillId][level]) {
            var cfg = C.SkillLvConfigDic[skillId][level];
            return cfg.describe;
        }
        return "";
    };
    /**获得技能开放描述 */
    GeneralModel.getSkillOpenDes = function (skillId, lineFeed) {
        var limit = this.getUpSkillLimit(skillId, 0);
        if (limit.level > 0 && limit.star > 0) {
            if (!lineFeed)
                return GCodeFromat(CLEnum.GEN_SKILL_OP_DES, limit.level, limit.star);
            return GCodeFromat(CLEnum.GEN_SKILL_OP_DES1, limit.level, limit.star);
        }
        if (limit.level > 0)
            return GCodeFromat(CLEnum.GEN_SKILL_OP_DES2, limit.level);
        return GCodeFromat(CLEnum.GEN_SKILL_OP_DES3, limit.star);
    };
    /**获得技能等级配置表 */
    GeneralModel.getSkillLvCfg = function (skillId, level) {
        if (level === void 0) { level = 1; }
        if (C.SkillLvConfigDic[skillId] && C.SkillLvConfigDic[skillId][level]) {
            return C.SkillLvConfigDic[skillId][level];
        }
        return null;
    };
    /**根据技能获取对应武将配置表 */
    GeneralModel.getSkillLvListbySkill = function (skillId) {
        var skillList = [];
        for (var key in C.SkillLvConfig) {
            if (C.SkillLvConfig[key].skillId == skillId) {
                skillList.push(C.SkillLvConfig[key]);
            }
        }
        return skillList;
    };
    GeneralModel.MAX_STAR = 25; //最大星星
    GeneralModel.FIGHT_RECORD = 0; //战力记录
    GeneralModel.ownGenerals = null;
    /**其他玩家武将信息 */
    GeneralModel.otherPlayerGenerals = null;
    return GeneralModel;
}());

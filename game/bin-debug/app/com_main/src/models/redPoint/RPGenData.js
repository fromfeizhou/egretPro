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
/**
 * 武将红点
 * 说明：武将红点 关联数据多 为减少逻辑判断次数 创建数据结构 记录保存对应的红点状态
 **/
var RPGenData = /** @class */ (function (_super_1) {
    __extends(RPGenData, _super_1);
    function RPGenData() {
        var _a;
        var _this = _super_1.call(this) || this;
        /**红点事件对应属性值访问 */
        _this.genEvt2Prop = (_a = {},
            _a[RedEvtType.GEN_COLLECT] = 'collect',
            _a[RedEvtType.GEN_STAR] = 'star',
            _a[RedEvtType.GEN_SKILL] = 'skills',
            _a);
        return _this;
    }
    /**初始化 */
    RPGenData.prototype.init = function () {
        _super_1.prototype.init.call(this);
        this.evtTypeList = [RedEvtType.GEN_COLLECT, RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN, RedEvtType.GEN_STAR, RedEvtType.GEN_SKILL, RedEvtType.GEN_EQUIP,
            RedEvtType.GEN_EQ_LV, RedEvtType.GEN_EQ_GRADE, RedEvtType.GEN_EQ_WROUGHT, RedEvtType.EQUIP_COMPOSE, RedEvtType.GEN_TREA_EQ, RedEvtType.GEN_FATE];
        this.genStateList = {};
        this.isGenStateListInit = false;
    };
    /**清理 */
    RPGenData.prototype.clear = function () {
        this.genStateList = null;
        _super_1.prototype.clear.call(this);
    };
    /**---------------------------------------------------------------------------------------------------------------
    * 红点ui刷新 begin
    * ---------------------------------------------------------------------------------------------------------------
     /**是否关联事件 */
    RPGenData.prototype.isInEvt = function (type) {
        // error("type", type, this.evtTypeList.indexOf(type));
        return this.evtTypeList.indexOf(type) >= 0;
    };
    /**刷新红点 */
    RPGenData.prototype.refreshView = function (info, evtType) {
        _super_1.prototype.refreshView.call(this, info, evtType);
        switch (evtType) {
            case RedEvtType.GEN_COLLECT: {
                var state = GeneralModel.canCollected();
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_STAR:
            case RedEvtType.GEN_SKILL: {
                this.setGeneralRedState(info, evtType);
                break;
            }
            case RedEvtType.GEN_LEVEL: {
                var state = GeneralModel.canUpLevel(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_FATE: { //缘分
                var state = GeneralModel.canActiveFate(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_TUPODAN: {
                var state = GeneralModel.canTupodan(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQUIP: {
                var state = GeneralModel.canEquip(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQ_LV: {
                var state = GeneralModel.canEquipLv(info.param.generalId);
                ;
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQ_GRADE: {
                var state = GeneralModel.canEquipGrade(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQ_WROUGHT: {
                var state = GeneralModel.canEquipWrought(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.EQUIP_COMPOSE: { //装备合成
                var num = PropModel.getEquipCompNum();
                info.setRedState(evtType, num);
                break;
            }
            case RedEvtType.GEN_TREA_EQ: { //宝物装配
                var state = GeneralModel.canTreaEquip(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
        }
    };
    /**设置武将红点 */
    RPGenData.prototype.setGeneralRedState = function (info, evtType) {
        //没有参数 遍历所有武将对应状态
        if (!info.param.generalId) {
            var res = false;
            for (var genId in this.genStateList) {
                var data = this.genStateList[genId];
                res = this.getGenRedStateByPorpType(data, evtType, null);
                if (res)
                    break;
            }
            info.setRedState(evtType, res ? 1 : 0);
        }
        else {
            //指定武将
            if (this.genStateList[info.param.generalId]) {
                var data = this.genStateList[info.param.generalId];
                var res = this.getGenRedStateByPorpType(data, evtType, info.param);
                ;
                info.setRedState(evtType, res ? 1 : 0);
            }
            else {
                //没有数据 红点屏蔽
                info.setRedState(evtType, 0);
            }
        }
    };
    /**获得武将红点 */
    RPGenData.prototype.getGenRedStateByPorpType = function (data, type, param) {
        var name = this.genEvt2Prop[type];
        if (typeof (data[name]) == 'boolean') {
            return data[name];
        }
        else {
            var list = data[name];
            //技能id
            if (param && param.skillId) {
                return list[param.skillId] ? list[param.skillId] : false;
            }
            else {
                /**任意技能 */
                for (var key in list) {
                    if (list[key])
                        return true;
                }
                return false;
            }
        }
    };
    /**---------------------------------------------------------------------------------------------------------------
   * 红点ui刷新 begin
   * ---------------------------------------------------------------------------------------------------------------


   /**---------------------------------------------------------------------------------------------------------------
   * 监听事件 begin
   * ---------------------------------------------------------------------------------------------------------------
   */
    RPGenData.prototype.initEvent = function () {
        this.addDataEvent(RoleEvent.ROLE_LEVLE, this.onRoleLevel, this);
        this.addDataEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
        this.addDataEvent(FateEvent.FATE_DATA_CHANGE, this.onGeneralFateUpdate, this);
        // this.addDataEvent(GeneralEvent.GENERAL_INIT, this.onGeneralInit, this);
        this.addDataEvent(GeneralEvent.GENERAL_GET, this.onGeneralGet, this);
        this.addDataEvent(GeneralEvent.GENERAL_LEVEL, this.onGeneralLevel, this);
        this.addDataEvent(GeneralEvent.GENERAL_TUPODAN, this.onTupodan, this);
        this.addDataEvent(GeneralEvent.GENERAL_STAR, this.onGeneralStar, this);
        this.addDataEvent(GeneralEvent.GENERAL_SKILL, this.onRedPointGeneralSkill, this);
        this.addDataEvent(GeneralEvent.GENERAL_EQ_COMPOSE, this.onGenEquipCompose, this);
        this.addDataEvent(GeneralEvent.GENERAL_EQUIP_IN, this.onGenEquipIn, this);
        this.addDataEvent(GeneralEvent.GENERAL_EQUIP_CHANGE, this.onEquipChange, this);
        this.addDataEvent(GeneralEvent.GENERAL_EQ_STRENG, this.onGenEquipStreng, this);
        this.addDataEvent(GeneralEvent.GENERAL_EQUIP_TREA, this.onGeneralEquipTrea, this);
        this.addDataEvent(TreaEvent.TREA_ADD, this.onTreaAdd, this);
    };
    /**等级变动 */
    RPGenData.prototype.onRoleLevel = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
    };
    /**突破 */
    RPGenData.prototype.onTupodan = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
    };
    /**宝物获得 */
    RPGenData.prototype.onTreaAdd = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TREA_EQ);
    };
    /**宝物穿戴 */
    RPGenData.prototype.onGeneralEquipTrea = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TREA_EQ);
    };
    /**武将缘分变动 */
    RPGenData.prototype.onGeneralFateUpdate = function (id) {
        var fateCfg = C.RelationConfig[id];
        this.updateGeneralData(RedEvtType.GEN_FATE, fateCfg.generalId);
    };
    /**道具变动 */
    RPGenData.prototype.onItemChange = function (itemId) {
        var cfg = C.ItemConfig[itemId];
        var type = cfg.mainType;
        switch (type) {
            case PropMainType.SOUL: { //将魂碎片
                for (var id in this.genStateList) {
                    var vo = GeneralModel.getOwnGeneral(Number(id));
                    if (!vo)
                        continue;
                    if (vo.isOwn) {
                        this.updateGeneralData(RedEvtType.GEN_STAR, vo.generalId);
                    }
                    else {
                        //武将未合成 及时判定
                        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_COLLECT);
                    }
                }
                break;
            }
            case PropMainType.SKILL_SOUL: {
                for (var id in this.genStateList) {
                    var vo = GeneralModel.getOwnGeneral(Number(id));
                    if (!vo)
                        continue;
                    if (vo.isOwn && vo.isNeedSkillSoul(itemId)) {
                        this.updateGeneralData(RedEvtType.GEN_SKILL, vo.generalId);
                    }
                }
                break;
            }
            case PropMainType.EXP_BOOK: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_LEVEL);
                break;
            }
        }
        switch (itemId) {
            case PropEnum.TUPODAN: { //突破丹
                RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
                break;
            }
        }
        //         case PropMainType.SKILL_SOUL: { //技能碎片更新
        //             this.addEvtInCaches(RedEvtType.GEN_SKILL, itemId);
        //             break;
        //         }
        //         case PropMainType.EQUIP_SOUL: { //装备碎片
        //             this.addNorEvtInCaches(RedEvtType.EQUIP_COMPOSE);
        //             let listhe = PropModel.getPropItemListByType(PropMainType.EQUIP_SOUL);
        //             let sddd = EquipModel.equipDic;
        //             if (listhe.length >= 450) {
        //                 EquipModel.isEquipfull(2);
        //             }
        //             break;
        //         }
        //         case PropMainType.EQUIP_STRENG: {   //强化石头
        //             this.addNorEvtInCaches(RedEvtType.GEN_EQ_LV);
        //             break;
        //         }
        //         case PropMainType.EQUIP_GRADE: {    //进阶石头
        //             this.addNorEvtInCaches(RedEvtType.GEN_EQ_GRADE);
        //             break;
        //         }
        //         case PropMainType.EQUIP_WROUGHT: {  //精炼石
        //             this.addNorEvtInCaches(RedEvtType.GEN_EQ_WROUGHT);
        //             break;
        //         }
        //         case PropMainType.EXP_BOOK: {
        //             //经验书
        //             this.addNorEvtInCaches(RedEvtType.GEN_LEVEL);
        //             break;
        //         }
        //     }
    };
    /**武将数据初始化(废弃 由队伍模块初始化添加) */
    RPGenData.prototype.onGeneralInit = function () {
        if (!this.isGenStateListInit) {
            this.isGenStateListInit = true;
            var configs = C.GeneralConfig;
            var list = ConstUtil.getNumArray(IConstEnum.GENERAL_LIST);
            for (var i = 0; i < list.length; i++) {
                var id = list[i];
                var cfg = configs[id];
                if (cfg != null && cfg != undefined && !LocalModel.hasGeneralOffRed(id)) {
                    var vo = GeneralModel.getOwnGeneral(id);
                    var info = {
                        id: id, star: vo.canUpStar(), fate: vo.canActiveFate(), skills: vo.canUpSkillList()
                    };
                    this.genStateList[id] = info;
                }
            }
        }
    };
    /**武将获得 */
    RPGenData.prototype.onGeneralGet = function (generalId) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_COLLECT);
        this.onRedPointGeneral(generalId);
    };
    /**装备合成 */
    RPGenData.prototype.onGenEquipCompose = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.EQUIP_COMPOSE);
    };
    /**装备装备穿戴 */
    RPGenData.prototype.onGenEquipIn = function (id) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQUIP);
    };
    /**装备变动 （装备增加 删除 武将装备）*/
    RPGenData.prototype.onEquipChange = function (pos) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQUIP);
    };
    /**升级 */
    RPGenData.prototype.onGeneralLevel = function (generalId) {
        this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_LEVEL);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_LV);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_GRADE);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_WROUGHT);
    };
    /**升星 */
    RPGenData.prototype.onGeneralStar = function (generalId) {
        this.updateGeneralData(RedEvtType.GEN_STAR, generalId);
        this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
        this.updateGeneralData(RedEvtType.GEN_FATE, generalId);
    };
    /**获得新技能 */
    RPGenData.prototype.onRedPointGeneralSkill = function (generalId) {
        if (!GeneralModel.getOwnGeneral(generalId).isOwn)
            return;
        this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
    };
    /**
     * 装备强化
     * 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
     * */
    RPGenData.prototype.onGenEquipStreng = function (data) {
        var evtType = RedEvtType.GEN_EQ_LV;
        if (data.type == 1)
            evtType = RedEvtType.GEN_EQ_GRADE;
        if (data.type == 2)
            evtType = RedEvtType.GEN_EQ_WROUGHT;
        RedPointModel.onRedPointEvtUpdate(evtType);
    };
    /**全部更新(初始化  或 新武将获得) */
    RPGenData.prototype.onRedPointGeneral = function (generalId) {
        var vo = GeneralModel.getOwnGeneral(generalId);
        if (vo && vo.isOwn) {
            this.updateGeneralData(RedEvtType.GEN_STAR, generalId);
            this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
            this.updateGeneralData(RedEvtType.GEN_FATE, generalId);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_LEVEL);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQUIP);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_LV);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_GRADE);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_WROUGHT);
            RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TREA_EQ);
        }
    };
    /**武将红点管理数据更新 */
    RPGenData.prototype.updateGeneralData = function (evtType, generalId) {
        if (this.genStateList && unNull(this.genStateList[generalId])) {
            var info = this.genStateList[generalId];
            var vo = GeneralModel.getOwnGeneral(generalId);
            switch (evtType) {
                case RedEvtType.GEN_STAR: {
                    info.star = vo.canUpStar();
                    RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_STAR);
                    break;
                }
                case RedEvtType.GEN_SKILL: {
                    info.skills = vo.canUpSkillList();
                    RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_SKILL);
                    break;
                }
                case RedEvtType.GEN_FATE: {
                    info.fate = vo.canActiveFate();
                    RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_FATE);
                    break;
                }
            }
        }
        else {
            //清除红点
            RedPointModel.onRedPointEvtUpdate(evtType);
        }
    };
    /**---------------------------------------------------------------------------------------------------------------
    * 监听事件 end
    * ---------------------------------------------------------------------------------------------------------------
    */
    /**---------------------------------------------------------------------------------------------------------------
     * 注册延迟函数begin
     * ---------------------------------------------------------------------------------------------------------------
     */
    // protected registerEvent() {
    //     super.registerEvent();
    //     /**升星延迟判断 */
    //     this.registEvtCallBack(RedEvtType.GEN_STAR, (generalId: number) => {
    //         this.updateGeneralData(RedEvtType.GEN_STAR, generalId);
    //     });
    //     /**技能延迟判断 */
    //     this.registEvtCallBack(RedEvtType.GEN_SKILL, (itemId: number) => {
    //         for (let id in this.genStateList) {
    //             let vo = GeneralModel.getOwnGeneral(Number(id));
    //             if (vo.isOwn) {
    //                 if (vo.isNeedSkillSoul(itemId)) {
    //                     this.updateGeneralData(RedEvtType.GEN_SKILL, vo.generalId);
    //                 }
    //             }
    //         }
    //     });
    // }
    /**---------------------------------------------------------------------------------------------------------------
      * 注册延迟函数end
      * ---------------------------------------------------------------------------------------------------------------
      */
    /**拥有 */
    RPGenData.prototype.hasGeneralInfo = function (id) {
        return unNull(this.genStateList[id]);
    };
    /**隐藏提示 */
    RPGenData.prototype.removeGeneralInfo = function (id) {
        delete this.genStateList[id];
        this.onRedPointGeneral(id);
    };
    /**添加提示 */
    RPGenData.prototype.addGeneralInfo = function (id) {
        if (isNull(this.genStateList[id])) {
            var vo = GeneralModel.getOwnGeneral(id);
            var info = {
                id: id, star: vo.canUpStar(), fate: vo.canActiveFate(), skills: vo.canUpSkillList()
            };
            this.genStateList[id] = info;
        }
        this.onRedPointGeneral(id);
    };
    /**获得需要提示武将列表 */
    RPGenData.prototype.getGenStateList = function () {
        return this.genStateList;
    };
    return RPGenData;
}(RPBaseData));

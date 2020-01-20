
/**武将红点结构 */
interface IRedGeneral {
    id: number,
    star: boolean,
    fate: boolean,
    /**技能 */
    skills: { [key: number]: boolean },
}

/**
 * 武将红点
 * 说明：武将红点 关联数据多 为减少逻辑判断次数 创建数据结构 记录保存对应的红点状态
 **/
class RPGenData extends RPBaseData {
    public genStateList: { [key: number]: IRedGeneral };     //武将红点结构
    public isGenStateListInit: boolean;     //武将红点结构是否初始化
    /**红点事件对应属性值访问 */
    public genEvt2Prop: { [key: number]: string } = {
        [RedEvtType.GEN_COLLECT]: 'collect',
        [RedEvtType.GEN_STAR]: 'star',
        [RedEvtType.GEN_SKILL]: 'skills',
    };


    public constructor() {
        super();
    }

    /**初始化 */
    public init() {
        super.init();
        this.evtTypeList = [RedEvtType.GEN_COLLECT, RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN, RedEvtType.GEN_STAR, RedEvtType.GEN_SKILL, RedEvtType.GEN_EQUIP,
        RedEvtType.GEN_EQ_LV, RedEvtType.GEN_EQ_GRADE, RedEvtType.GEN_EQ_WROUGHT, RedEvtType.EQUIP_COMPOSE, RedEvtType.GEN_TREA_EQ, RedEvtType.GEN_FATE];

        this.genStateList = {};
        this.isGenStateListInit = false;
    }

    /**清理 */
    public clear() {
        this.genStateList = null;
        super.clear();
    }


    /**---------------------------------------------------------------------------------------------------------------
    * 红点ui刷新 begin
    * ---------------------------------------------------------------------------------------------------------------
     /**是否关联事件 */
    public isInEvt(type: RedEvtType) {
        // error("type", type, this.evtTypeList.indexOf(type));
        return this.evtTypeList.indexOf(type) >= 0;
    }

    /**刷新红点 */
    public refreshView(info: RedPointView, evtType: RedEvtType) {
        super.refreshView(info, evtType);

        switch (evtType) {
            case RedEvtType.GEN_COLLECT: {
                let state = GeneralModel.canCollected();
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_STAR:
            case RedEvtType.GEN_SKILL: {
                this.setGeneralRedState(info, evtType);
                break;
            }

            case RedEvtType.GEN_LEVEL: {
                let state = GeneralModel.canUpLevel(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_FATE: {   //缘分
                let state = GeneralModel.canActiveFate(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_TUPODAN: {
                let state = GeneralModel.canTupodan(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.GEN_EQUIP: {
                let state = GeneralModel.canEquip(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQ_LV: {
                let state = GeneralModel.canEquipLv(info.param.generalId);;
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQ_GRADE: {
                let state = GeneralModel.canEquipGrade(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.GEN_EQ_WROUGHT: {
                let state = GeneralModel.canEquipWrought(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.EQUIP_COMPOSE: {     //装备合成
                let num = PropModel.getEquipCompNum();
                info.setRedState(evtType, num);
                break;
            }
            case RedEvtType.GEN_TREA_EQ: {   //宝物装配
                let state = GeneralModel.canTreaEquip(info.param.generalId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

        }
    }

    /**设置武将红点 */
    private setGeneralRedState(info: RedPointView, evtType: RedEvtType) {
        //没有参数 遍历所有武将对应状态
        if (!info.param.generalId) {
            let res = false;
            for (let genId in this.genStateList) {
                let data = this.genStateList[genId];
                res = this.getGenRedStateByPorpType(data, evtType, null);
                if (res) break;
            }
            info.setRedState(evtType, res ? 1 : 0);
        } else {
            //指定武将
            if (this.genStateList[info.param.generalId]) {
                let data = this.genStateList[info.param.generalId];
                let res = this.getGenRedStateByPorpType(data, evtType, info.param);;
                info.setRedState(evtType, res ? 1 : 0);
            } else {
                //没有数据 红点屏蔽
                info.setRedState(evtType, 0);
            }
        }
    }

    /**获得武将红点 */
    private getGenRedStateByPorpType(data: IRedGeneral, type: RedEvtType, param?: IRedViewParam) {
        let name = this.genEvt2Prop[type];
        if (typeof (data[name]) == 'boolean') {
            return data[name];
        } else {
            let list: { [key: number]: boolean } = data[name];
            //技能id
            if (param && param.skillId) {
                return list[param.skillId] ? list[param.skillId] : false;
            } else {
                /**任意技能 */
                for (let key in list) {
                    if (list[key]) return true;
                }
                return false;
            }
        }
    }

    /**---------------------------------------------------------------------------------------------------------------
   * 红点ui刷新 begin
   * ---------------------------------------------------------------------------------------------------------------


   /**---------------------------------------------------------------------------------------------------------------
   * 监听事件 begin
   * ---------------------------------------------------------------------------------------------------------------
   */
    protected initEvent() {
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
    }

    /**等级变动 */
    private onRoleLevel() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
    }

    /**突破 */
    private onTupodan() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
    }

    /**宝物获得 */
    private onTreaAdd() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TREA_EQ);
    }
    /**宝物穿戴 */
    private onGeneralEquipTrea() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TREA_EQ);
    }
    /**武将缘分变动 */
    private onGeneralFateUpdate(id: number) {
        let fateCfg: RelationConfig = C.RelationConfig[id];
        this.updateGeneralData(RedEvtType.GEN_FATE, fateCfg.generalId);
    }
    /**道具变动 */
    private onItemChange(itemId: number) {
        let cfg = C.ItemConfig[itemId];
        let type: PropMainType = cfg.mainType;
        switch (type) {
            case PropMainType.SOUL: {    //将魂碎片
                for (let id in this.genStateList) {
                    let vo = GeneralModel.getOwnGeneral(Number(id));
                    if (!vo) continue;
                    if (vo.isOwn) {
                        this.updateGeneralData(RedEvtType.GEN_STAR, vo.generalId);
                    } else {
                        //武将未合成 及时判定
                        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_COLLECT);
                    }
                }
                break;
            }
            case PropMainType.SKILL_SOUL: {
                for (let id in this.genStateList) {
                    let vo = GeneralModel.getOwnGeneral(Number(id));
                    if (!vo) continue;
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

    }

    /**武将数据初始化(废弃 由队伍模块初始化添加) */
    private onGeneralInit() {
        if (!this.isGenStateListInit) {
            this.isGenStateListInit = true;
            let configs = C.GeneralConfig;
            let list = ConstUtil.getNumArray(IConstEnum.GENERAL_LIST);
            for (let i = 0; i < list.length; i++) {
                let id = list[i];
                let cfg = configs[id];
                if (cfg != null && cfg != undefined && !LocalModel.hasGeneralOffRed(id)) {
                    let vo: GeneralVo = GeneralModel.getOwnGeneral(id);
                    let info: IRedGeneral = {
                        id: id, star: vo.canUpStar(), fate: vo.canActiveFate(), skills: vo.canUpSkillList()
                    };
                    this.genStateList[id] = info;
                }
            }
        }
    }

    /**武将获得 */
    private onGeneralGet(generalId) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_COLLECT);
        this.onRedPointGeneral(generalId);
    }

    /**装备合成 */
    private onGenEquipCompose() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.EQUIP_COMPOSE);
    }

    /**装备装备穿戴 */
    private onGenEquipIn(id: number) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQUIP);
    }

    /**装备变动 （装备增加 删除 武将装备）*/
    private onEquipChange(pos: IEquipPos) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQUIP);
    }


    /**升级 */
    private onGeneralLevel(generalId: number) {
        this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_LEVEL);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_TUPODAN);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_LV);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_GRADE);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GEN_EQ_WROUGHT);
    }

    /**升星 */
    private onGeneralStar(generalId: number) {
        this.updateGeneralData(RedEvtType.GEN_STAR, generalId);
        this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
        this.updateGeneralData(RedEvtType.GEN_FATE, generalId);
    }

    /**获得新技能 */
    public onRedPointGeneralSkill(generalId: number) {
        if (!GeneralModel.getOwnGeneral(generalId).isOwn) return;
        this.updateGeneralData(RedEvtType.GEN_SKILL, generalId);
    }

    /**
     * 装备强化 
     * 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
     * */
    public onGenEquipStreng(data: { id?: number, type: number }) {
        let evtType = RedEvtType.GEN_EQ_LV;
        if (data.type == 1) evtType = RedEvtType.GEN_EQ_GRADE;
        if (data.type == 2) evtType = RedEvtType.GEN_EQ_WROUGHT;
        RedPointModel.onRedPointEvtUpdate(evtType);
    }


    /**全部更新(初始化  或 新武将获得) */
    public onRedPointGeneral(generalId: number) {
        let vo = GeneralModel.getOwnGeneral(generalId)
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
    }

    /**武将红点管理数据更新 */
    public updateGeneralData(evtType: RedEvtType, generalId: number) {
        if (this.genStateList && unNull(this.genStateList[generalId])) {
            let info: IRedGeneral = this.genStateList[generalId];
            let vo: GeneralVo = GeneralModel.getOwnGeneral(generalId);
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
        } else {
            //清除红点
            RedPointModel.onRedPointEvtUpdate(evtType);
        }

    }


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
    public hasGeneralInfo(id: number) {
        return unNull(this.genStateList[id]);
    }

    /**隐藏提示 */
    public removeGeneralInfo(id: number) {
        delete this.genStateList[id];
        this.onRedPointGeneral(id);
    }

    /**添加提示 */
    public addGeneralInfo(id: number) {
        if (isNull(this.genStateList[id])) {
            let vo: GeneralVo = GeneralModel.getOwnGeneral(id);
            let info: IRedGeneral = {
                id: id, star: vo.canUpStar(), fate: vo.canActiveFate(), skills: vo.canUpSkillList()
            };
            this.genStateList[id] = info;
        }
        this.onRedPointGeneral(id);
    }

    /**获得需要提示武将列表 */
    public getGenStateList() {
        return this.genStateList;
    }

}

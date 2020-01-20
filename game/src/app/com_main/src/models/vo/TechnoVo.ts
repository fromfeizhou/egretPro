/**
 * 科技信息
 */
class TechnoVo extends egret.HashObject implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["id", "level"];

    public id; //科技id
    public level; //科技等级 

    public techCfg: TechnologyConfig;   //配置表
    public techLvlCfg: TechnologyLevelConfig;   //科技等级配置表
    public techEffCfg: TechnologyEffectConfig;  //科技效果配置表
    public type; //科技类型

    public addMainType: number;    //加成主类型
    public addSubType: number;   //加成子类型
    public addValue: number;     //加成值
    public addValType:number;   //绝对值 万分比

    public static create(body?: any) {
        var obj: TechnoVo = new TechnoVo(body);
        return obj;
    }

    public constructor(body: any) {
        super();
        this.init(body);
    }

    public init(body?: gameProto.ITechnology) {
        if (body) this.parseKeys(body);
        this.techCfg = C.TechnologyConfig[this.id] || C.TechnologyConfig[1];
        // this.techLvlCfg = C.TechnologyLevelConfig[this.id] || C.TechnologyLevelConfig[1];
        this.techLvlCfg = TechnoModel.getTechnoLvCfg(this.id, this.level);
        this.techEffCfg = C.TechnologyEffectConfig[this.id] || C.TechnologyEffectConfig[1];
        this.type = this.techCfg.type;
    }

    /**更新数据 */
    public update(body?: gameProto.ITechnology) {
        this.parseKeys(body);
        com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.id);
    }
    /**解析服务器协议 */
    private parseKeys(body: any) {
        Utils.voParsePbData(this, body, TechnoVo.AttriKey);
        this.parseAddVal();
    }

    /**解析加成 */
    private parseAddVal() {
        if (this.level == 0) return;
        let cfg = TechnoModel.getTechnoLvCfg(this.id, this.level);
        if (isNull(cfg))
            return;
        let res = StringUtils.keyValsToNumberArray(cfg.effect);
        if (res.length > 0) {
            let keyVal = res[0];
            let attCfg = C.TechnologyEffectConfig[keyVal.key];
            this.addMainType = attCfg.type;
            this.addSubType = attCfg.subType;
            this.addValType = attCfg.valType; 
            this.addValue = this.addValType == 0 ? keyVal.value : keyVal.value / 10000;
        }
    }

    /**最大等级 */
    public get maxLevel() {
        return this.techCfg.maxLevel;
    }

    /**是否满级 */
    public isMaxLevel() {
        return this.level >= this.techCfg.maxLevel;
    }


    /**获取位置 */
    public get gidPos(): { row: number, col: number } {
        return { row: this.techCfg.row, col: this.techCfg.col };
    }

    public onDestroy() {
    }

    /**是否可以升级 */
    public canUpLevel(): boolean {
        if (this.isMaxLevel()) return false;
        //等级限制
        let info = new com_main.LvUpConditionsBuildInfo(BuildingType.MINISTRY_DEFENCE, this.techLvlCfg.limitLv);
        if (!info.getIsCan()) return false;

        //前置条件
        let limits = StringUtils.keyValsToNumberArray(this.techLvlCfg.limitTechs);
        for (let i = 0; i < limits.length; i++) {
            let info2 = new com_main.LvUpConditionsTechnologyInfo(limits[i].key, limits[i].value);
            if (!info2.getIsCan()) return false;
        }

        //材料
        let itemCosts = Utils.parseCommonItemJson(this.techLvlCfg.consume);
        if (itemCosts) {
            for (let i = 0; i < itemCosts.length; i++) {
                let info3 = new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count);
                if (!info3.getIsCan()) return false;
            }
        }
        return true;
    }

}
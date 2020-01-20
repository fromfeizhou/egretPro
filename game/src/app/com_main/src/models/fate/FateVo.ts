/**
 * 武将
 */
class FateVo extends egret.HashObject implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["id"];

    public id; //缘分id
    public generlId: number;//武将id
    public relationId: number;//类型
    public level: number;//等级
    public status: number = FateStatus.NOT_ACTIVE;
    public fateCfg: RelationConfig;

    public disGeneralSoulList: number[] = [];

    public static create(id?: any) {
        var obj: FateVo = new FateVo(id);
        return obj;
    }

    public constructor(id: any) {
        super();
        this.init(id);
    }
    public onDestroy() {
    }
    public init(id?: number) {
        this.parseData(id);
    }

    public parseData(id: number) {

        this.fateCfg = C.RelationConfig[id] || C.RelationConfig[1];
        this.id = id;
        this.generlId = this.fateCfg.generalId;
        this.relationId = this.fateCfg.relationId;
        this.level = this.fateCfg.level;
        this.updateStatus();
    }
    /**更新数据 */
    public updateStatus() {
        let curMaxLevl: number = unNull(FateModel.getFateTypeCurLev(this.relationId)) ? FateModel.getFateTypeCurLev(this.relationId) : 0;
        if (this.level <= curMaxLevl) {
            this.status = FateStatus.FINISH_ACTIVE;
            return;
        }
        //判断是否达成激活状态
        let triggerParameter: string[] = this.fateCfg.triggerParameter.split(",");
        let isActive: boolean = true;
        this.disGeneralSoulList = [];
        for (let index = 0; index < triggerParameter.length; index++) {
            let triggerArr: string[] = triggerParameter[index].split("_");
            isActive = isActive && this.checkGeneral(Number(triggerArr[0]), Number(triggerArr[1]))
        }
        this.status = isActive ? FateStatus.CAN_ACTIVE : FateStatus.NOT_ACTIVE;

        // com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.id);
    }
    public isOwnGeneral(): boolean {
        let genVo: GeneralVo = GeneralModel.getOwnGeneral(this.generlId);
        if (isNull(genVo)) return false;
        return genVo.isOwn;
    }
    public checkGeneral(generalId: number, star: number): boolean {
        let genVo: GeneralVo = GeneralModel.getOwnGeneral(generalId);
        if (isNull(genVo)) return false;
        if (!genVo.isOwn) {
            this.disGeneralSoulList.push(genVo.getSoulId())
            return false
        }
        if (genVo.star >= star) return true;
        this.disGeneralSoulList.push(genVo.getSoulId())
        return false;
    }




}
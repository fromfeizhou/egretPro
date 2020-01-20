
class WorldEventVo extends BaseClass implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["eventCoordinatesId", "eventDataId", "userMapEventData"];

    public eventCoordinatesId: number;   //事件位置配置表id
    public eventDataId: number;  //事件配置表id
    public userMapEventData: gameProto.IUserMapEventData;    //事件属性

    public dataCfg: EventDataConfig;         //事件配置表
    public coordCfg: EventCoordinatesConfig;     //位置配置表
    public cityId: number;       //城池id
    public type: WorldEventType;     //事件类型
    public subType: number;   //事件枚举
    public image: string;        //事件形象
    public npcId: number;        //战斗事件怪物id
    public pos: { x: number, y: number }; //事件位置

    public static create(body?: gameProto.IMapEventData) {
        var obj: WorldEventVo = new WorldEventVo(body);
        return obj;
    }

    public constructor(body?: gameProto.IMapEventData) {
        super();
        this.init(body);
    }

    public init(body?: gameProto.IMapEventData) {
        this.parseKeys(body);
        this.initCfg();
    }

    /**更新数据 */
    public update(body?: gameProto.IMapEventData) {
        this.parseKeys(body);
    }
    /**解析服务器协议 */
    private parseKeys(body: any) {
        Utils.voParsePbData(this, body, WorldEventVo.AttriKey);
    }

    /**初始化配置 */
    private initCfg() {
        this.dataCfg = C.EventDataConfig[this.eventDataId];
        this.coordCfg = C.EventCoordinatesConfig[this.eventCoordinatesId];
        if (!this.dataCfg || !this.coordCfg) return;
        this.cityId = this.coordCfg.cityId;
        this.pos = { x: this.coordCfg.posX, y: this.coordCfg.posY };
        this.type = this.dataCfg.affairType;
        this.subType = this.dataCfg.subAffairType;
        this.image = this.dataCfg.image;
        this.npcId = this.dataCfg.npcId;

    }

    /**获得事件名字 */
    public getEventName(): string {
        if (this.dataCfg) return GLan(this.dataCfg.name);
        return '';
    }

    /**获得奖励 */
    public getReward(): string {
        if (this.dataCfg) return this.dataCfg.reward;
        return '';
    }

    /**获得事件等级 */
    public getEventLv(): number {
        if (this.dataCfg) return this.dataCfg.lv;
        return 1;
    }

    /**采集/战斗 剩余时间 */
    public getWorkingTime() {
        return this.userMapEventData.endTime - this.userMapEventData.startTime - this.userMapEventData.speedTime;
    }

    /**操作队伍id */
    public getTeamId() {
        return this.userMapEventData ? this.userMapEventData.teamId : 0;
    }
    /**得到战斗id */
    public getBattleId() {
        return this.userMapEventData ? this.userMapEventData.battleId : 0;
    }
    public onDestroy() {
    }
}
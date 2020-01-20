class VoBuffOnSkill extends BaseClass implements IFObject {

    public buId: number;   //目标id
    public bufId: number;
    public bufSysId: number;
    public happenTime: number;      //触发时间 (0攻击前 ，1攻击后)
    public removeBufId: number;     //触发移除的BUFDII

    //BUFF 目标元素ID(14位)+buffId(14位)+buffSysId(20位)+buff触发时间类型(0攻击前 1攻击后)（1位）+取消buffId(14位)
    public constructor(data)
    {
        super();
        this.init(data);
    }

    public init(data){
        this.buId = data.elementId;
        this.bufId = data.buffId;
        this.bufSysId = data.buffSysId;
        this.happenTime = data.isAttackAfter;
        this.removeBufId = data.unBuff;

        // debugBatt("技能BUFF >> ", this.buId, this.bufId, this.bufSysId, this.happenTime, this.removeBufId);
        debugSkill("技能BUFF >> buffid:"+this.bufSysId  ,"目标id："+this.buId, "触发时间:"+ this.happenTime + "取消buffid" + this.removeBufId)
    }

    public onDestroy() {
        this.buId = 0;
        this.bufId = 0;
        this.bufSysId = 0;
        this.happenTime = 0;
        this.removeBufId = 0;
    }

	
}


class VoBuffOnSceneEff extends BaseClass implements IFObject {
    public bufId: number;
    public bufSysId: number;
    public happenTime: number;      //触发时间 (1攻击前 ，2攻击后)
    public pos:{x,y} = { x : 0, y : 0 };
    //场景BUFF buffId(14位)+buffSysId(22位)+buff触发时间类型(0攻击前 1攻击后)（1位）+中心点（不一定有，X（8位）Z（7位））
    public constructor(data)
    {
        super();
        this.init(data);

    }

    public init(data){
        this.bufId = data.buffId;
        this.bufSysId = data.buffSysId;
        this.happenTime = data.isAttackAfter;

        let position = ISOMap.getInstance().leftDownCellToPixel(data.x,data.y);
        this.pos.x = position[0];
        this.pos.y = position[1];
        // pos = FightPointConvert.convertServerDataMinus2(posx, posy, ModelFight.GRID_SIZE_X / 2, ModelFight.GRID_SIZE_Y / 2);
        debugBatt("场景BUFF >> ", this.bufId, this.bufSysId, this.happenTime, this.pos.x, this.pos.y);
    }

    public onDestroy() {
        this.bufId = 0;
        this.bufSysId = 0;
        this.happenTime = 0;      //触发时间 (1攻击前 ，2攻击后)
        this.pos = { x : 0, y : 0 };
    }
}

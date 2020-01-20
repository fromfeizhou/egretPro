class VoAttackData extends BaseClass implements IFObject {
	public id: number;
	public hp: number;
	public angry: number;
	public isOffSet: number;
	public toPosX: number;
	public toPosY: number;
	public way: number;

	public constructor(attackerValue: gameProto.IRealTimeWarAttacker, atthp:number) {
		super();
		this.init(attackerValue , atthp)
	}

	public init(attackerValue: gameProto.IRealTimeWarAttacker, atthp:number){
		this.hp = atthp;
        this.id = attackerValue.elementId;
        this.angry = attackerValue.anger;
        this.isOffSet = attackerValue.isOffset;
        this.toPosX = attackerValue.offsetX;
        this.toPosY = attackerValue.offsetZ;
        this.way = attackerValue.direction;
		if (this.isOffSet > 0)
		{
			debug("攻击者移动  >> " + this.id + "  , toPosX:" + this.toPosX + "  , toPosY:" + this.toPosY);
		}

		// debugBatt("攻击者id  >> " + this.id);
	}

	public onDestroy() {
		this.id = 0;
		this.hp = 0;
		this.angry = 0;
		this.isOffSet = 0;
		this.toPosX = 0;
		this.toPosY = 0;
		this.way = 0;
	}
}

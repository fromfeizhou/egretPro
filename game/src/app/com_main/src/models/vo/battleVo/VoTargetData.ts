class VoTargetMoveData
{
    public moveType :EnumHurtMoveType;    //1击退,  2 击飞
    public movePosX :number;
    public movePosY :number;

    public constructor(xy :number)
    {
        this.moveType = (xy >> 27) & 0xf;
        this.movePosX = (xy >> 19) & 0xff;
        this.movePosY = (xy >> 12) & 0x7f;
    }
}

class VoTargetData extends BaseClass implements IFObject {
    public id: number;
    public attackStatus: number;
    public attackHurt: number;
    public hp: number;
    public angry: number;
    public isDirectHurt: number;    //是否直接伤害(0为直接，1为间接)
    public moveData: VoTargetMoveData = null;

    // /**反弹伤害 */
    // public reboundDamage: number;
    // /**吸收伤害 */
    // public absorbHurt: number;
    // /**克制 */
    // public restrain: number;

    public constructor(target: gameProto.IWarTarget)
    {
        super();
        this.init(target);
    }

    public init(target:gameProto.IWarTarget){
        this.hp = target.troops;
        this.attackHurt = target.hurt;
        //战斗数值 目标元素ID(14位)+攻击状态（4位）+目标当前怒气(武将才有)（7位）+是否间接（1位）[1暴击 ,2闪避 ,3 免疫, 4破防, 5暴击+破防]
        this.id = (target.value >> 17) & 0x3fff;
        this.attackStatus = (target.value >> 13) & 0xf;
        this.angry = (target.value >> 6) & 0x7f;
        this.isDirectHurt = (target.value >> 5) & 0x1;

        if(target.xy > 0)
        {
            this.moveData = new VoTargetMoveData(target.xy);
        }

        if(this.attackStatus == 0 && target.ext){
            if(target.ext.reboundHurt > 0){
                this.attackStatus = AttackResult.REBOUND;
            }

            if(target.ext.absorbHurt > 0){
                this.attackStatus = AttackResult.ABSORB;
            }

            if(target.ext.restrain > 0){
                this.attackStatus = AttackResult.RESTRAIN;
            }
            // this.reboundDamage = target.ext.reboundHurt;
            // this.absorbHurt = target.ext.absorbHurt;
            // this.restrain = target.ext.restrain;
        }
    }

    public onDestroy(){
        this.hp = 0;
        this.attackHurt = 0;
        this.id = 0;
        this.attackStatus = 0;
        this.angry = 0;
        this.isDirectHurt = 0;
        this.moveData = null;

        // this.reboundDamage = 0;
        // this.absorbHurt = 0;
        // this.restrain = 0;
    }

}

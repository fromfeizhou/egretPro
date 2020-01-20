
class VipVo extends BaseClass implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["rechargeGold", "rechargeMoney", "vipExp", "vipLevel", "vipDailyReward", "receivedVipLevelReward"];
    public rechargeGold: number; // 充值元宝
    public rechargeMoney: number; // 充值金额
    public vipExp: number; // vip经验
    public vipLevel: number; // vip等级
    public vipDailyReward: boolean; // vip每日奖励
    public receivedVipLevelReward: number[]; // vip等级奖励已领取 

    /**=================================================================================================================================
	 * 客户端自定义字段
	 * =================================================================================================================================
     */

    public static create(body?: gameProto.IRechargeInfo) {
        var obj: VipVo = new VipVo(body);
        return obj;
    }

    public constructor(body?: gameProto.IRechargeInfo) {
        super();
        this.init(body);
    }

    public init(body?: gameProto.IRechargeInfo) {
        if (!body)
            return;
        this.parseKeys(body);
    }

    /**更新数据 */
    public update(body?: gameProto.IRechargeInfo) {
        this.parseKeys(body);
        com_main.EventMgr.dispatchEvent(VipEvent.VIP_UPDATE, null);
    }
    /**解析服务器协议 */
    private parseKeys(body: any) {
        Utils.voParsePbData(this, body, VipVo.AttriKey);
    }


    public onDestroy() {
    }
}
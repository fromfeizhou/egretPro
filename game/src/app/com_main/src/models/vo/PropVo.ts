
class PropVo extends BaseClass implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ['uuid', 'itemId', 'count', 'level', 'position'];
    public uuid: number; // 唯一id
    public itemId: number; //物品id
    public count: number; //数量
    public level: number;

    /**=================================================================================================================================
	 * 客户端自定义字段
	 * =================================================================================================================================
     */
    public config: ItemConfig;  //物品配置
    public type: PropMainType;   //物品大类
    public subType: number;      //物品子类
    public isNew: boolean;   //新获得物品
    public quality: number;  //物品品质

    public static create(body?: gameProto.IBackpackGrid) {
        var obj: PropVo = ObjectPool.pop(PropVo,'PropVo', body);
        return obj;
    }

    public onDestroy() {
        ObjectPool.push(this);
    }


    public constructor(body?: gameProto.IBackpackGrid) {
        super();
        this.init(body);
        this.isNew = false;
    }

    public init(body?: gameProto.IBackpackGrid) {
        Utils.voParsePbData(this, body, PropVo.AttriKey, ['uuid']);
        this.config = C.ItemConfig[this.itemId];
        this.type = this.config.mainType;
        this.subType = this.config.subType;
        this.quality = this.config.quality;
    }

    /**更新数据 */
    public update(body?: gameProto.IBackpackGrid) {
        Utils.voParsePbData(this, body, PropVo.AttriKey, ['uuid']);
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_ITEM_UPDATE, this.uuid);
    }



    /**是否碎片 */
    public isSoul() {
        return this.type == PropMainType.SOUL || this.type == PropMainType.SKILL_SOUL;
    }
}
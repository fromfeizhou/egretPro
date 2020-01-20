
class EquipVo extends BaseClass implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["uuid", "equipmentId", "slotType", "generalId"];
    public uuid: number; // 唯一id
    public equipmentId: number; // 装备配置id
    public slotType: number; // 格子类型 0-3 ： 0-武器,1-装甲,2-头盔,3-靴子 
    public generalId: number;    //携带武将

    /**=================================================================================================================================
	 * 客户端自定义字段
	 * =================================================================================================================================
     */
    public fight: number;    //战斗力
    public config: EquipmentConfig;  //装备配置
    public itemCfg: ItemConfig;  //物品配置
    public mainAttri: IKeyVal;   //主属性
    public suitId: number;   //套装id
    public quality: number;  //品质

    public static create(body?: gameProto.IEquipment) {
        var obj: EquipVo = new EquipVo(body);
        return obj;
    }

    public constructor(body?: gameProto.IEquipment) {
        super();
        this.init(body);
    }

    public init(body?: gameProto.IEquipment) {
        this.parseKeys(body);
        this.config = C.EquipmentConfig[this.equipmentId] || C.EquipmentConfig[1000101];
        this.mainAttri = StringUtils.keyValsToNumberArray(this.config.attribute)[0];
        this.fight = Utils.calculateNorFight({ [this.mainAttri.key]: this.mainAttri.value });
        this.suitId = this.config.setId;

        this.itemCfg = C.ItemConfig[this.equipmentId] || C.ItemConfig[1000101];
        this.quality = this.itemCfg.quality;
    }

    /**更新数据 */
    public update(body?: gameProto.IEquipment) {
        this.parseKeys(body);
    }
    /**解析服务器协议 */
    private parseKeys(body: any) {
        let oldId = this.generalId;
        Utils.voParsePbData(this, body, EquipVo.AttriKey, ['uuid']);

        if (unNull(oldId) && this.generalId != oldId) {
            if (this.generalId && this.generalId > 0) {
                com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_DEL, this.uuid);
            } else {
                com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ADD, this);
            }
        }
    }

    /**获得进阶加成 */
    public getGradeAdd(gradeLv: number): IKeyVal {
        let addRate = EquipModel.getGradeAddRate(gradeLv);
        let val = Math.ceil(this.mainAttri.value * addRate);
        return { key: this.mainAttri.key, value: val };
    }

    /**获得回收物品 */
    public getDecomposeItems() {
        let res = Utils.parseCommonItemJson(this.config.decomposition);
        return res;
    }

    public onDestroy() {
    }
}
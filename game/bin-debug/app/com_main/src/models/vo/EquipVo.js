var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EquipVo = /** @class */ (function (_super_1) {
    __extends(EquipVo, _super_1);
    function EquipVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    EquipVo.create = function (body) {
        var obj = new EquipVo(body);
        return obj;
    };
    EquipVo.prototype.init = function (body) {
        var _a;
        this.parseKeys(body);
        this.config = C.EquipmentConfig[this.equipmentId] || C.EquipmentConfig[1000101];
        this.mainAttri = StringUtils.keyValsToNumberArray(this.config.attribute)[0];
        this.fight = Utils.calculateNorFight((_a = {}, _a[this.mainAttri.key] = this.mainAttri.value, _a));
        this.suitId = this.config.setId;
        this.itemCfg = C.ItemConfig[this.equipmentId] || C.ItemConfig[1000101];
        this.quality = this.itemCfg.quality;
    };
    /**更新数据 */
    EquipVo.prototype.update = function (body) {
        this.parseKeys(body);
    };
    /**解析服务器协议 */
    EquipVo.prototype.parseKeys = function (body) {
        var oldId = this.generalId;
        Utils.voParsePbData(this, body, EquipVo.AttriKey, ['uuid']);
        if (unNull(oldId) && this.generalId != oldId) {
            if (this.generalId && this.generalId > 0) {
                com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_DEL, this.uuid);
            }
            else {
                com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ADD, this);
            }
        }
    };
    /**获得进阶加成 */
    EquipVo.prototype.getGradeAdd = function (gradeLv) {
        var addRate = EquipModel.getGradeAddRate(gradeLv);
        var val = Math.ceil(this.mainAttri.value * addRate);
        return { key: this.mainAttri.key, value: val };
    };
    /**获得回收物品 */
    EquipVo.prototype.getDecomposeItems = function () {
        var res = Utils.parseCommonItemJson(this.config.decomposition);
        return res;
    };
    EquipVo.prototype.onDestroy = function () {
    };
    /**属性值 */
    EquipVo.AttriKey = ["uuid", "equipmentId", "slotType", "generalId"];
    return EquipVo;
}(BaseClass));

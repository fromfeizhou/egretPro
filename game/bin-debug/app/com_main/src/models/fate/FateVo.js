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
/**
 * 武将
 */
var FateVo = /** @class */ (function (_super_1) {
    __extends(FateVo, _super_1);
    function FateVo(id) {
        var _this = _super_1.call(this) || this;
        _this.status = FateStatus.NOT_ACTIVE;
        _this.disGeneralSoulList = [];
        _this.init(id);
        return _this;
    }
    FateVo.create = function (id) {
        var obj = new FateVo(id);
        return obj;
    };
    FateVo.prototype.onDestroy = function () {
    };
    FateVo.prototype.init = function (id) {
        this.parseData(id);
    };
    FateVo.prototype.parseData = function (id) {
        this.fateCfg = C.RelationConfig[id] || C.RelationConfig[1];
        this.id = id;
        this.generlId = this.fateCfg.generalId;
        this.relationId = this.fateCfg.relationId;
        this.level = this.fateCfg.level;
        this.updateStatus();
    };
    /**更新数据 */
    FateVo.prototype.updateStatus = function () {
        var curMaxLevl = unNull(FateModel.getFateTypeCurLev(this.relationId)) ? FateModel.getFateTypeCurLev(this.relationId) : 0;
        if (this.level <= curMaxLevl) {
            this.status = FateStatus.FINISH_ACTIVE;
            return;
        }
        //判断是否达成激活状态
        var triggerParameter = this.fateCfg.triggerParameter.split(",");
        var isActive = true;
        this.disGeneralSoulList = [];
        for (var index = 0; index < triggerParameter.length; index++) {
            var triggerArr = triggerParameter[index].split("_");
            isActive = isActive && this.checkGeneral(Number(triggerArr[0]), Number(triggerArr[1]));
        }
        this.status = isActive ? FateStatus.CAN_ACTIVE : FateStatus.NOT_ACTIVE;
        // com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.id);
    };
    FateVo.prototype.isOwnGeneral = function () {
        var genVo = GeneralModel.getOwnGeneral(this.generlId);
        if (isNull(genVo))
            return false;
        return genVo.isOwn;
    };
    FateVo.prototype.checkGeneral = function (generalId, star) {
        var genVo = GeneralModel.getOwnGeneral(generalId);
        if (isNull(genVo))
            return false;
        if (!genVo.isOwn) {
            this.disGeneralSoulList.push(genVo.getSoulId());
            return false;
        }
        if (genVo.star >= star)
            return true;
        this.disGeneralSoulList.push(genVo.getSoulId());
        return false;
    };
    /**属性值 */
    FateVo.AttriKey = ["id"];
    return FateVo;
}(egret.HashObject));

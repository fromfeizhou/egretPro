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
var WorldEventVo = /** @class */ (function (_super_1) {
    __extends(WorldEventVo, _super_1);
    function WorldEventVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    WorldEventVo.create = function (body) {
        var obj = new WorldEventVo(body);
        return obj;
    };
    WorldEventVo.prototype.init = function (body) {
        this.parseKeys(body);
        this.initCfg();
    };
    /**更新数据 */
    WorldEventVo.prototype.update = function (body) {
        this.parseKeys(body);
    };
    /**解析服务器协议 */
    WorldEventVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, WorldEventVo.AttriKey);
    };
    /**初始化配置 */
    WorldEventVo.prototype.initCfg = function () {
        this.dataCfg = C.EventDataConfig[this.eventDataId];
        this.coordCfg = C.EventCoordinatesConfig[this.eventCoordinatesId];
        if (!this.dataCfg || !this.coordCfg)
            return;
        this.cityId = this.coordCfg.cityId;
        this.pos = { x: this.coordCfg.posX, y: this.coordCfg.posY };
        this.type = this.dataCfg.affairType;
        this.subType = this.dataCfg.subAffairType;
        this.image = this.dataCfg.image;
        this.npcId = this.dataCfg.npcId;
    };
    /**获得事件名字 */
    WorldEventVo.prototype.getEventName = function () {
        if (this.dataCfg)
            return GLan(this.dataCfg.name);
        return '';
    };
    /**获得奖励 */
    WorldEventVo.prototype.getReward = function () {
        if (this.dataCfg)
            return this.dataCfg.reward;
        return '';
    };
    /**获得事件等级 */
    WorldEventVo.prototype.getEventLv = function () {
        if (this.dataCfg)
            return this.dataCfg.lv;
        return 1;
    };
    /**采集/战斗 剩余时间 */
    WorldEventVo.prototype.getWorkingTime = function () {
        return this.userMapEventData.endTime - this.userMapEventData.startTime - this.userMapEventData.speedTime;
    };
    /**操作队伍id */
    WorldEventVo.prototype.getTeamId = function () {
        return this.userMapEventData ? this.userMapEventData.teamId : 0;
    };
    /**得到战斗id */
    WorldEventVo.prototype.getBattleId = function () {
        return this.userMapEventData ? this.userMapEventData.battleId : 0;
    };
    WorldEventVo.prototype.onDestroy = function () {
    };
    /**属性值 */
    WorldEventVo.AttriKey = ["eventCoordinatesId", "eventDataId", "userMapEventData"];
    return WorldEventVo;
}(BaseClass));

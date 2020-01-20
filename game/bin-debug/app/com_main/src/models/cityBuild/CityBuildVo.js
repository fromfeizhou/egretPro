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
 * 城市建设数据
 * 键值对-cityId-generalId
 */
var CityBuildVo = /** @class */ (function (_super_1) {
    __extends(CityBuildVo, _super_1);
    function CityBuildVo() {
        var _this = _super_1.call(this) || this;
        // 自定义数据
        _this.cityBuildState = CityBuildEnum.FREE;
        return _this;
    }
    CityBuildVo.create = function () {
        var obj = new CityBuildVo();
        return obj;
    };
    CityBuildVo.prototype.init = function (body) {
        this.parseKeys(body);
        if (this.generalId > 0)
            CityBuildModel.updateGens(this.generalId, this.cityId);
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.cityId);
    };
    CityBuildVo.prototype.onDestroy = function () {
    };
    /**更新数据 */
    CityBuildVo.prototype.update = function (body) {
        var oldId = this.generalId;
        this.parseKeys(body);
        if (this.generalId != oldId && this.generalId == 0) {
            CityBuildModel.updateGens(oldId, this.cityId, true);
            this.resetData();
        }
        if (this.generalId > 0)
            CityBuildModel.updateGens(this.generalId, this.cityId);
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.cityId);
    };
    /**解析服务器协议 */
    CityBuildVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, CityBuildVo.AttriKey);
        if (this.isDoneCityBuilding()) {
            this.cityBuildState = CityBuildEnum.DONE;
        }
        else if (this.isInCityBuilding()) {
            this.cityBuildState = CityBuildEnum.BUILDING;
        }
        else {
            this.cityBuildState = CityBuildEnum.FREE;
        }
    };
    /**是否在建造中 */
    CityBuildVo.prototype.isInCityBuilding = function () {
        return this.startDate > 0;
    };
    /**是否建造完成 */
    CityBuildVo.prototype.isDoneCityBuilding = function () {
        if (isNull(this.startDate) || this.startDate == 0)
            return false;
        var curtime = TimerUtils.getServerTime();
        var mEndDate = this.endDate - this.speedTime; // 实际结束时间
        var time = curtime - mEndDate;
        return time > 0;
    };
    /**定时器更新 */
    CityBuildVo.prototype.updateTime = function () {
        if (this.endDate > 0) {
            if (this.cityBuildState == CityBuildEnum.DONE)
                return;
            if (this.isDoneCityBuilding()) {
                this.cityBuildState = CityBuildEnum.DONE;
                // CityBuildProxy.C2S_CITY_MADE_INFO(this.cityId);
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.cityId);
            }
        }
    };
    CityBuildVo.prototype.resetData = function () {
        this.generalId = 0;
        this.endDate = 0;
        this.startDate = 0;
        this.speedTime = 0;
    };
    /**是否真正建造中 */
    CityBuildVo.prototype.isBuilding = function () {
        return this.cityBuildState == CityBuildEnum.BUILDING;
    };
    CityBuildVo.prototype.canReward = function () {
        return this.cityBuildState == CityBuildEnum.DONE;
    };
    /**属性值 */
    CityBuildVo.AttriKey = [
        "generalId", "cityId", "startDate", "levelReward",
        "sumExp", "endDate", "madeLevel", "speedTime"
    ];
    return CityBuildVo;
}(BaseClass));

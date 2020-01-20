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
var CSBFaction;
(function (CSBFaction) {
    CSBFaction[CSBFaction["NONE"] = 0] = "NONE";
    CSBFaction[CSBFaction["OUR"] = 1] = "OUR";
    CSBFaction[CSBFaction["EMENY"] = 2] = "EMENY";
})(CSBFaction || (CSBFaction = {}));
var CSBCityInfoVo = /** @class */ (function (_super_1) {
    __extends(CSBCityInfoVo, _super_1);
    function CSBCityInfoVo(body) {
        var _this = _super_1.call(this) || this;
        //箭塔数量,index 0表示左塔，1表示右塔
        _this.towerNum = [];
        /**城市名 */
        _this.m_sCityName = '';
        /**点击后显示面板的状态 */
        _this.m_menuStatus = "atk";
        _this.m_infoStatus = "our";
        _this.init(body);
        return _this;
    }
    CSBCityInfoVo.create = function (body) {
        var obj = new CSBCityInfoVo(body);
        return obj;
    };
    CSBCityInfoVo.prototype.init = function (body) {
        var keys = [
            "areaId", "occupant", "warAreaId", "defTeamNum", "attTeamNum", "towerNum", "status"
        ];
        for (var ind in keys) {
            var key = keys[ind];
            this[key] = body[key];
        }
        this.m_bIsOur = CrossModel.getSelfGroup() == this.occupant;
        if (this.occupant == 0) {
            this.m_faction = CSBFaction.NONE;
        }
        else if (this.m_bIsOur) {
            this.m_faction = CSBFaction.OUR;
        }
        else {
            this.m_faction = CSBFaction.EMENY;
        }
        this.m_isCamp = this.areaId > 5;
        /**点击面板的状态 */
        if (!this.m_isCamp && this.m_bIsOur) {
            this.m_menuStatus = 'own';
        }
        else if (!this.m_isCamp && !this.m_bIsOur) {
            this.m_menuStatus = 'atk';
        }
        else if (this.m_isCamp && this.m_bIsOur) {
            this.m_menuStatus = 'camp';
        }
        else {
            this.m_menuStatus = 'emenyCamp';
        }
        if (DEBUG) {
            this.m_sCityName = this.warAreaId + GLan(C.CrossServerAreaConfig[this.areaId].name);
        }
        else {
            this.m_sCityName = GLan(C.CrossServerAreaConfig[this.areaId].name);
        }
        this.m_sCityName = GLan(C.CrossServerAreaConfig[this.areaId].name);
    };
    /**是否我方阵营 */
    CSBCityInfoVo.prototype.isMyGroup = function () {
        return this.m_bIsOur;
    };
    /**是否城门 */
    CSBCityInfoVo.prototype.isMyCamp = function () {
        return this.m_bIsOur && this.m_isCamp;
    };
    /**获取阵营 */
    CSBCityInfoVo.prototype.getFaction = function () {
        return this.m_faction;
    };
    /**获取面板状态 */
    CSBCityInfoVo.prototype.getMenuStatus = function () {
        return this.m_menuStatus;
    };
    CSBCityInfoVo.prototype.getTowerNum = function () {
        var num = 0;
        for (var _i = 0, _a = this.towerNum; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i) {
                num += 1;
            }
        }
        return num;
    };
    CSBCityInfoVo.prototype.getCityName = function () {
        return this.m_sCityName;
    };
    CSBCityInfoVo.prototype.onDestroy = function () {
    };
    return CSBCityInfoVo;
}(BaseClass));

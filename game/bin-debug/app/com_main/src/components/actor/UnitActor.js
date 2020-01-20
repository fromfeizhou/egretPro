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
var com_main;
(function (com_main) {
    /**战斗单位对象 */
    var UnitActor = /** @class */ (function (_super_1) {
        __extends(UnitActor, _super_1);
        function UnitActor() {
            return _super_1.call(this) || this;
        }
        UnitActor.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            if (this.m_pUnitInfo)
                this.m_pUnitInfo.onDestroy();
            this.m_pUnitInfo = null;
            // if (this.m_pSkillAtk) this.m_pSkillAtk.onDestroy();
            this.m_pSkillAtk = null;
        };
        UnitActor.prototype.getUnitInfo = function () {
            return this.m_pUnitInfo;
        };
        UnitActor.prototype.setUnitInfo = function (vo) {
            this.m_pUnitInfo = vo;
            if (vo) {
                this.id = vo.elementId;
            }
        };
        UnitActor.prototype.setSkillAtk = function (vo) {
            this.m_pSkillAtk = vo;
        };
        UnitActor.prototype.getSkillAtk = function () {
            return this.m_pSkillAtk;
        };
        UnitActor.prototype.getHp = function () {
            var data = this.getUnitInfo();
            return data ? data.getHp() : 0;
        };
        return UnitActor;
    }(com_main.Actor));
    com_main.UnitActor = UnitActor;
})(com_main || (com_main = {}));

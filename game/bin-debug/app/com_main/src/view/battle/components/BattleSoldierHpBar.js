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
    var BattleSoldierHpBar = /** @class */ (function (_super_1) {
        __extends(BattleSoldierHpBar, _super_1);
        function BattleSoldierHpBar() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("battle_new/components/soldierHpBarSkin.exml");
            return _this;
        }
        BattleSoldierHpBar.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        BattleSoldierHpBar.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeFromParent();
            this.m_pUnitInfo = null;
            BattleSoldierHpBar.BATTLE_SOLDIER_HP_SHOW_TIME = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_HP_SHOW_TIME); //小兵被攻击血条显示时间
            BattleSoldierHpBar.BATTLE_SOLDIER_HP_DISAPPLLE_TIME = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_HP_DISAPPLLE_TIME); //小兵血条小时渐变消失时间
            BattleSoldierHpBar.BATTLE_SOLDIER_HP_MOVE_TIME = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_HP_MOVE_TIME); //小兵血条掉血量移动时间
        };
        BattleSoldierHpBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (!this.m_pUnitInfo) {
                return;
            }
            this.initHP();
        };
        BattleSoldierHpBar.prototype.setData = function (unitInfo) {
            this.m_pUnitInfo = unitInfo;
        };
        BattleSoldierHpBar.prototype.initHP = function () {
            if (this.m_pUnitInfo.faction == FactionType.ATK) {
                this.HP_image.source = "pro_017_png";
            }
            else if (this.m_pUnitInfo.faction == FactionType.DEF) {
                this.HP_image.source = "pro_016_png";
            }
        };
        BattleSoldierHpBar.prototype.setHP = function (hp) {
            var _this = this;
            Tween.removeTweens(this.HP_image);
            Tween.removeTweens(this);
            if (this.HP_image) {
                var width = Math.min(1, hp / this.m_pUnitInfo.getMaxHp()) * 34;
                Tween.get(this.HP_image).to({ width: width }, BattleSoldierHpBar.BATTLE_SOLDIER_HP_MOVE_TIME);
            }
            Tween.get(this).wait(BattleSoldierHpBar.BATTLE_SOLDIER_HP_SHOW_TIME).to({ alpha: 0 }, BattleSoldierHpBar.BATTLE_SOLDIER_HP_DISAPPLLE_TIME).call(function () {
                _this.visible = false;
            });
            this.visible = true;
            this.alpha = 1;
        };
        BattleSoldierHpBar.prototype.setHpNoTween = function (hp) {
            Tween.removeTweens(this.HP_image);
            var width = Math.min(1, hp / this.m_pUnitInfo.getMaxHp()) * 34;
            this.HP_image.width = width;
        };
        return BattleSoldierHpBar;
    }(com_main.CComponent));
    com_main.BattleSoldierHpBar = BattleSoldierHpBar;
})(com_main || (com_main = {}));

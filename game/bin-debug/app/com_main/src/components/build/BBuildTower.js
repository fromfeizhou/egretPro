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
    /** 城墙 */
    var BBuildTower = /** @class */ (function (_super_1) {
        __extends(BBuildTower, _super_1);
        function BBuildTower(unit) {
            var _this = _super_1.call(this) || this;
            _this.init(unit);
            return _this;
        }
        BBuildTower.create = function (unit) {
            var obj = new BBuildTower(unit);
            return obj;
        };
        BBuildTower.prototype.init = function (unit) {
            var config = MAP_ELE_CONFIG[BattleModel.getMapId()];
            this.m_pWidth = config.tower_W;
            this.m_pHeight = config.tower_H;
            this.setUnitInfo(unit);
            _super_1.prototype.init.call(this);
            this.createSkin();
        };
        BBuildTower.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        BBuildTower.prototype.setHp = function (v) {
            this.m_pUnitInfo.setHp(v);
        };
        BBuildTower.prototype.getMapXY = function () {
            return [this.x, this.y];
        };
        BBuildTower.prototype.createSkin = function () {
            var config = MAP_ELE_CONFIG[BattleModel.getMapId()];
            this.m_image = new eui.Image(config.towerImg);
            // this.m_image
            this.addChild(this.m_image);
            this.m_image.x = config.tower_PX;
            this.m_image.y = config.tower_PY;
            this.m_hpBgImg = new eui.Image("proBg_016_png");
            this.m_hpBgImg.width = 68;
            this.m_hpBgImg.height = 7;
            this.m_hpBgImg.x = 150;
            this.m_hpBgImg.y = -55;
            this.m_hpBgImg.scale9Grid = new egret.Rectangle(4, 3, 2, 3);
            this.addChild(this.m_hpBgImg);
            this.m_hpImg = new eui.Image("pro_022_png");
            this.m_hpImg.width = 63;
            this.m_hpImg.height = 5;
            this.m_hpImg.x = 150 + 1;
            this.m_hpImg.y = -55 + 1;
            this.addChild(this.m_hpImg);
            if (this.m_pUnitInfo) {
                this.changeHp(this.m_pUnitInfo.getHp(), 0);
            }
        };
        BBuildTower.prototype.changeHp = function (hp, attackHurt, isShowHP, isBuff) {
            if (isShowHP === void 0) { isShowHP = false; }
            if (isBuff === void 0) { isBuff = false; }
            if (this.m_pUnitInfo) {
                var width = Math.min(1, hp / this.m_pUnitInfo.getMaxHp()) * 63;
                this.m_hpImg.width = width;
                this.m_pUnitInfo.setHp(hp);
                com_main.BattleSkillMgr.getInstance().dealTower(this.getUnitInfo().elementId, hp);
            }
        };
        return BBuildTower;
    }(com_main.UnitActor));
    com_main.BBuildTower = BBuildTower;
})(com_main || (com_main = {}));

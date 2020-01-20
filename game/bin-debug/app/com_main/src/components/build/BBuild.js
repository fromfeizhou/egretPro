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
    var BBuild = /** @class */ (function (_super_1) {
        __extends(BBuild, _super_1);
        function BBuild(unit) {
            var _this = _super_1.call(this) || this;
            _this.init(unit);
            return _this;
        }
        BBuild.create = function (unit) {
            var obj = ObjectPool.pop(com_main.BBuild, "com_main.BBuild", unit);
            return obj;
        };
        BBuild.prototype.init = function (unit) {
            var config = MAP_ELE_CONFIG[BattleModel.getMapId()];
            this.m_pWidth = config.wall_W;
            this.m_pHeight = config.wall_H;
            _super_1.prototype.init.call(this);
            this.setUnitInfo(unit);
            if (unit) {
                this.createSkin();
            }
        };
        BBuild.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        BBuild.prototype.getMapXY = function () {
            return [this.x, this.y];
        };
        BBuild.prototype.setHp = function (v) {
            this.m_pUnitInfo.setHp(v);
        };
        BBuild.prototype.createSkin = function () {
            var config = MAP_ELE_CONFIG[BattleModel.getMapId()];
            this.m_image = new eui.Image(config.wallImg);
            this.addChild(this.m_image);
            this.m_hpBgImg = new eui.Image("proBg_016_png");
            this.m_hpBgImg.width = 106;
            this.m_hpBgImg.height = 14;
            this.m_hpBgImg.x = 455;
            this.m_hpBgImg.y = 300;
            this.m_hpBgImg.scale9Grid = new egret.Rectangle(4, 3, 2, 3);
            this.addChild(this.m_hpBgImg);
            this.m_hpImg = new eui.Image("pro_022_png");
            this.m_hpImg.width = 102;
            this.m_hpImg.height = 10;
            this.m_hpImg.x = 455 + 2;
            this.m_hpImg.y = 300 + 2;
            this.addChild(this.m_hpImg);
            if (this.m_pUnitInfo) {
                this.changeHp(this.m_pUnitInfo.getHp(), 0);
            }
        };
        BBuild.prototype.changeHp = function (hp, attackHurt, isShowHP, isBuff) {
            if (isShowHP === void 0) { isShowHP = false; }
            if (isBuff === void 0) { isBuff = false; }
            if (this.m_pUnitInfo) {
                var width = Math.min(1, hp / this.m_pUnitInfo.getMaxHp()) * 102;
                this.m_hpImg.width = width;
                this.m_pUnitInfo.setHp(hp);
                com_main.BattleSkillMgr.getInstance().dealWall(this.getUnitInfo().elementId, hp);
            }
        };
        return BBuild;
    }(com_main.UnitActor));
    com_main.BBuild = BBuild;
})(com_main || (com_main = {}));

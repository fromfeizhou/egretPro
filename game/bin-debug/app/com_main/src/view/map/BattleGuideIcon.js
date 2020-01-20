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
    /**战斗指引图标 */
    var BattleGuideIcon = /** @class */ (function (_super_1) {
        __extends(BattleGuideIcon, _super_1);
        function BattleGuideIcon() {
            var _this = _super_1.call(this) || this;
            _this.touchEnabled = true;
            _this.name = BattleGuideIcon.NAME;
            _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTapFunc, _this);
            _this.initView();
            return _this;
        }
        BattleGuideIcon.create = function () {
            return new BattleGuideIcon();
        };
        BattleGuideIcon.prototype.onDestroy = function () {
            this.m_pTarPos = null;
            Utils.removeFromParent(this);
        };
        BattleGuideIcon.prototype.initView = function () {
            this.m_pIcon = PImage.create();
            var texture = RES.getRes('battle_guide_png');
            if (texture) {
                this.m_pIcon.texture = texture;
                this.m_pIcon.validateNow();
            }
            else {
                debug("指引图标资源没找到！！");
                this.m_pIcon.texture = null;
            }
            Utils.addChild(this, this.m_pIcon);
        };
        BattleGuideIcon.prototype.setTargetLocalPos = function (pos) {
            this.m_pTarPos = pos;
        };
        BattleGuideIcon.prototype.setTargetGlobalPos = function (pos) {
            var radian = Utils.MathUtils.getRadian2(this.x, this.y, pos.x, pos.y);
            var angle = Utils.MathUtils.getAngle(radian);
            this.rotation = angle;
        };
        BattleGuideIcon.prototype.onTapFunc = function (evt) {
            var map = com_main.BattleSceneMgr.getInstance().getMapView();
            if (map && this.m_pTarPos) {
                map.moveTo(this.m_pTarPos.x, this.m_pTarPos.y);
            }
        };
        BattleGuideIcon.NAME = 'BattleGuideIcon';
        return BattleGuideIcon;
    }(egret.DisplayObjectContainer));
    com_main.BattleGuideIcon = BattleGuideIcon;
})(com_main || (com_main = {}));

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
    /**
     * 道具
     */
    var ComFightItem = /** @class */ (function (_super_1) {
        __extends(ComFightItem, _super_1);
        function ComFightItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/ComFightItemSkin.exml");
            return _this;
        }
        ComFightItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ComFightItem.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.m_labfightNum);
            _super_1.prototype.onDestroy.call(this);
        };
        ComFightItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置战斗力 */
        ComFightItem.prototype.setFight = function (fight, isAction) {
            if (isAction === void 0) { isAction = false; }
            if (this.m_nFightVal == fight)
                return;
            if (isAction) {
                var oldFight = this.m_nFightVal;
                var change = fight - oldFight;
                if (change == 0)
                    return;
                this.setEff();
                CommonUtils.NumberActionTo(this.m_labfightNum, Number(this.m_labfightNum.text), fight);
            }
            else {
                this.m_labfightNum.scaleX = 1;
                this.m_labfightNum.scaleY = 1;
                Tween.removeTweens(this.m_labfightNum);
                this.m_labfightNum.text = fight + '';
            }
            this.m_nFightVal = fight;
        };
        /**获得文本战力 */
        ComFightItem.prototype.getFight = function () {
            return this.m_nFightVal;
        };
        /**战力提升特效 */
        ComFightItem.prototype.setEff = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_GenUpFightNum);
            this.m_effect.play(IETypes.EUI_GenUpFightNum, 1, true);
            this.m_effect.x = 120;
            this.m_effect.y = 18;
            this.m_pEffRoot.addChild(this.m_effect);
        };
        return ComFightItem;
    }(com_main.CComponent));
    com_main.ComFightItem = ComFightItem;
})(com_main || (com_main = {}));

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
    /** 道具 */
    var TreaIconView = /** @class */ (function (_super_1) {
        __extends(TreaIconView, _super_1);
        function TreaIconView() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("treasure/TreaIconViewSkin.exml");
            return _this;
        }
        TreaIconView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TreaIconView.prototype.onDestroy = function () {
            this.clearMc();
            this.stopAction();
            this.clearEffect();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaIconView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_nLocalY = this.m_iconRoot.y;
        };
        /**物品id */
        TreaIconView.prototype.setItemId = function (id, isMc) {
            if (isMc === void 0) { isMc = false; }
            if (this.m_nItemId == id)
                return;
            this.m_nItemId = id;
            this.refreshView(isMc);
        };
        // public get itemId() {
        //     return this.m_nItemId;
        // }
        /**刷新显示 */
        TreaIconView.prototype.refreshView = function (isMc) {
            var res = TreasureModel.getTreaBigIcon(this.m_nItemId);
            if (res == 'icon_trea_b_1055_png') {
                this.currentState = 'bagua';
            }
            else {
                this.currentState = 'normal';
            }
            this.commitProperties();
            this.clearMc();
            this.stopAction();
            if (isMc && TreasureModel.hasMcRes(this.m_nItemId)) {
                this.m_mcIcon = NormalMcMgr.createMc(TreasureModel.getMcName(this.m_nItemId));
                this.m_pMcRoot.addChild(this.m_mcIcon);
                this.m_imgIcon.visible = false;
            }
            else {
                this.m_imgIcon.visible = true;
                this.m_imgIcon.source = TreasureModel.getTreaBigIcon(this.m_nItemId);
                if (isMc)
                    this.doAction();
            }
        };
        TreaIconView.prototype.clearMc = function () {
            if (this.m_mcIcon) {
                NormalMcMgr.removeMc(this.m_mcIcon);
                this.m_mcIcon = null;
            }
        };
        /**宝物动画 */
        TreaIconView.prototype.doAction = function () {
            if (!this.m_bIsAction) {
                this.m_bIsAction = true;
                var ty = this.m_nLocalY;
                var gap = 20;
                var tw = egret.Tween.get(this.m_iconRoot, { loop: true });
                tw.to({ y: ty - gap }, 1500, Ease.sineInOut);
                tw.to({ y: ty }, 1500, Ease.sineInOut);
            }
        };
        /**宝物动画 */
        TreaIconView.prototype.stopAction = function () {
            if (this.m_bIsAction) {
                egret.Tween.removeTweens(this.m_iconRoot);
                this.m_iconRoot.y = this.m_nLocalY;
                this.m_bIsAction = false;
            }
        };
        /**添加背景特效 */
        TreaIconView.prototype.createEffect = function () {
            if (!this.m_effBg) {
                this.m_effBg = NormalMcMgr.createMc(IETypes.EUI_TreaBg);
                this.m_pEffRoot.addChild(this.m_effBg);
            }
        };
        /**移除背景特效 */
        TreaIconView.prototype.clearEffect = function () {
            if (this.m_effBg) {
                NormalMcMgr.removeMc(this.m_effBg);
                this.m_effBg = null;
            }
        };
        return TreaIconView;
    }(com_main.CComponent));
    com_main.TreaIconView = TreaIconView;
})(com_main || (com_main = {}));

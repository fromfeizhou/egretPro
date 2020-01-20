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
    var ComGenCard = /** @class */ (function (_super_1) {
        __extends(ComGenCard, _super_1);
        function ComGenCard() {
            var _this = _super_1.call(this) || this;
            _this.name = ComGenCard.NAME;
            _this.skinName = Utils.getAppSkin("common/ComGenCardSkin.exml");
            return _this;
        }
        ComGenCard.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ComGenCard.prototype.onDestroy = function () {
            this.clearHeroMc();
            _super_1.prototype.onDestroy.call(this);
        };
        ComGenCard.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置动画 */
        ComGenCard.prototype.setInfo = function (id, isMc, isMask) {
            if (isMc === void 0) { isMc = false; }
            if (isMask === void 0) { isMask = true; }
            if (PlatConst.isLowMcMachine()) {
                //微信小游戏UI不显示武将动画
                isMc = false;
            }
            if (isMask) {
                this.mask = this.m_imgMask;
            }
            else {
                this.m_imgMask.visible = false;
            }
            if (this.m_nId == id && this.m_bIsMc == isMc)
                return;
            this.m_nId = id;
            this.m_bIsMc = isMc;
            this.refreshView();
        };
        /**动画播放 */
        ComGenCard.prototype.play = function () {
            if (this.m_heroMc)
                this.m_heroMc.play('animation');
        };
        /**动画停止 */
        ComGenCard.prototype.stop = function () {
            if (this.m_heroMc)
                this.m_heroMc.stop();
        };
        /**显示刷新 */
        ComGenCard.prototype.refreshView = function () {
            this.clearHeroMc();
            this.m_imgIcon.source = "";
            var cfg = C.GeneralConfig[this.m_nId];
            if (!cfg)
                return;
            if (this.m_bIsMc && GeneralModel.hasSoliderLogoAnima(cfg.role)) {
                this.m_heroMc = GeneralMCMgr.createMc("Gen_Anim_" + cfg.role);
                this.m_pMcRoot.addChild(this.m_heroMc);
            }
            else {
                this.m_imgIcon.source = GeneralModel.getSoldierBigLogo(cfg.role);
            }
        };
        /**清理动画 */
        ComGenCard.prototype.clearHeroMc = function () {
            if (this.m_heroMc) {
                GeneralMCMgr.removeMc(this.m_heroMc.dbName);
                this.m_heroMc = null;
            }
        };
        Object.defineProperty(ComGenCard.prototype, "heroIcon", {
            /**获得动画形象 */
            get: function () {
                if (this.m_heroMc)
                    return this.m_heroMc;
                return this.m_imgIcon;
            },
            enumerable: true,
            configurable: true
        });
        ComGenCard.NAME = 'ComGenCard';
        return ComGenCard;
    }(com_main.CComponent));
    com_main.ComGenCard = ComGenCard;
})(com_main || (com_main = {}));

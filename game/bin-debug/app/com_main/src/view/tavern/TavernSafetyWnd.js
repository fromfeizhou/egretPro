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
     * 保底召唤
     */
    var TavernSafetyWnd = /** @class */ (function (_super_1) {
        __extends(TavernSafetyWnd, _super_1);
        function TavernSafetyWnd(sorce) {
            var _this = _super_1.call(this) || this;
            _this.WIDTH = 370; //保底进度条width值
            _this.name = TavernSafetyWnd.NAME;
            _this.m_currSorce = sorce;
            _this.initApp("tavern/TavernSafetyWndSkin.exml");
            return _this;
        }
        TavernSafetyWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            this.clearGeneralEffect();
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        TavernSafetyWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.TAVEN_SAFETY_CALL));
            this.m_MaxSorce = ConstUtil.getValue(IConstEnum.TAVERN_EXCHANGE_SCORE); //积分上限
            this.m_labTip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TAVEN_SAFETY_TIP, this.m_MaxSorce));
            this.refreshInfo();
            this.createGeneralEffect();
        };
        /**刷新积分 */
        TavernSafetyWnd.prototype.refreshInfo = function () {
            this.m_pScore.text = this.m_currSorce + '/' + this.m_MaxSorce;
            this.m_imgPro.width = this.m_currSorce >= this.m_MaxSorce ? this.WIDTH : (this.m_currSorce / this.m_MaxSorce) * this.WIDTH;
        };
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置红品质特效 */
        TavernSafetyWnd.prototype.createGeneralEffect = function () {
            if (this.m_effect)
                return;
            this.m_effect = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_pEffRoot.addChild(this.m_effect);
        };
        TavernSafetyWnd.prototype.clearGeneralEffect = function () {
            if (this.m_effect) {
                NormalMcMgr.removeMc(this.m_effect);
                this.m_effect = null;
            }
        };
        TavernSafetyWnd.NAME = 'TavernSafetyWnd';
        return TavernSafetyWnd;
    }(com_main.CView));
    com_main.TavernSafetyWnd = TavernSafetyWnd;
})(com_main || (com_main = {}));

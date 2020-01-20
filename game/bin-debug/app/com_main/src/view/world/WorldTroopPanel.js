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
    var WorldTroopPanel = /** @class */ (function (_super_1) {
        __extends(WorldTroopPanel, _super_1);
        function WorldTroopPanel(data) {
            var _this = _super_1.call(this) || this;
            _this.m_nOrder = 0;
            _this.m_gold = 0;
            _this.m_nOrder = data.order;
            _this.name = WorldTroopPanel.NAME;
            _this.initApp("world/WorldTroopPanelSkin.exml");
            return _this;
        }
        WorldTroopPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        WorldTroopPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            this.m_pQuickAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP_ALL));
            this.m_btnTrian.setTitleLabel(GCode(CLEnum.GO_TO));
            this.m_teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nOrder);
            this.calcuGold();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldTroopPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, this.closeView);
            com_main.EventManager.addTouchScaleListener(this.m_btnTrian, this, this.onTrainBtn);
            com_main.EventManager.addTouchScaleListener(this.m_pQuickAddBtn, this, this.onQuickTroop);
        };
        WorldTroopPanel.prototype.onTrainBtn = function () {
            com_main.UpManager.history();
            if (!this.m_teamVo.isSoliderStorageFull()) {
                Utils.open_view(TASK_UI.ARMS_PANEL);
            }
            else {
                Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
            }
        };
        WorldTroopPanel.prototype.onQuickTroop = function () {
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nOrder);
            if (TeamModel.isWar(teamVo.state)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL1), 1, true);
                return;
            }
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold, 1)) {
                TeamModel.isNeedTroopTips = true;
                com_main.UpManager.history();
                TeamProxy.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS(this.m_nOrder);
            }
        };
        WorldTroopPanel.prototype.calcuGold = function () {
            var gold = Math.ceil(this.m_teamVo.getFillHpCostGold());
            this.m_pQuickAddBtn.setCostLabel("" + gold);
            this.m_gold = gold;
        };
        WorldTroopPanel.prototype.closeView = function () {
            com_main.UpManager.history();
        };
        WorldTroopPanel.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnClose);
        };
        WorldTroopPanel.NAME = "WorldTroopPanel";
        return WorldTroopPanel;
    }(com_main.CView));
    com_main.WorldTroopPanel = WorldTroopPanel;
})(com_main || (com_main = {}));

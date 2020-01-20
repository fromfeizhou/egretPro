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
     * 部队事件选中面板
     */
    var WorldHeroEvtPanel = /** @class */ (function (_super_1) {
        __extends(WorldHeroEvtPanel, _super_1);
        function WorldHeroEvtPanel(data) {
            var _this = _super_1.call(this) || this;
            _this.name = WorldHeroEvtPanel.NAME;
            _this.m_evtPosId = data.evtPosId;
            _this.m_cityId = data.cityId;
            _this.initApp("world/WorldHeroEvtPanelSkin.exml");
            return _this;
        }
        WorldHeroEvtPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldHeroEvtPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_aPopUp.setTitleLabel('出征部队选择');
            this.m_pCollection = new eui.ArrayCollection();
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = com_main.WorldHeroEvtItem;
            this.m_pList.useVirtualLayout = true;
            var list = [];
            for (var i = 0; i < TeamModel.getTeamMax(1 /* WORLD */); i++) {
                var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, i);
                // if (!teamVo.isEmptyTeam()) {
                list.push({ order: i, cityId: this.m_cityId, evtId: this.m_evtPosId });
                // }
            }
            list.sort(this.sortyByState);
            this.m_pCollection.replaceAll(list);
            this.onGuideCondition();
        };
        /**根据状态排序 */
        WorldHeroEvtPanel.prototype.sortyByState = function (p1, p2) {
            var teamVo1 = TeamModel.getTeamVoByType(1 /* WORLD */, p1.order);
            var state1 = WorldModel.getTeamEvtTypeById(teamVo1.id);
            if (teamVo1.isEmptyTeam())
                state1 = 200;
            var teamVo2 = TeamModel.getTeamVoByType(1 /* WORLD */, p2.order);
            var state2 = WorldModel.getTeamEvtTypeById(teamVo2.id);
            if (teamVo2.isEmptyTeam())
                state2 = 200;
            if (state1 != state2) {
                return state1 - state2;
            }
            else {
                return p1.order - p2.order;
            }
        };
        /**检查新手引导面板条件 */
        WorldHeroEvtPanel.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_EVT_SEL_WND);
        };
        WorldHeroEvtPanel.NAME = "WorldHeroEvtPanel";
        return WorldHeroEvtPanel;
    }(com_main.CView));
    com_main.WorldHeroEvtPanel = WorldHeroEvtPanel;
})(com_main || (com_main = {}));

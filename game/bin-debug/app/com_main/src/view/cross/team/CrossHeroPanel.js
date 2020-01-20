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
     * 出征部队选择
     */
    var CrossHeroPanel = /** @class */ (function (_super_1) {
        __extends(CrossHeroPanel, _super_1);
        function CrossHeroPanel(cId) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.WorldHeroPanel.NAME;
            _this.m_nCId = cId;
            _this.initApp("world/world_hero_panel.exml");
            return _this;
        }
        CrossHeroPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        CrossHeroPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.currentState = 'cross';
            this.commitProperties();
            this.m_aPopUp.setTitleLabel('出征部队选择');
            this.m_pCollection = new eui.ArrayCollection();
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = com_main.CrossHeroItem;
            this.m_pList.useVirtualLayout = true;
            var list = [];
            for (var i = 0; i < TeamModel.getTeamMax(5 /* CROSS_SERVER */); i++) {
                var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, i);
                list.push({ order: i });
            }
            //排序
            list.sort(this.sortFunc);
            this.m_pCollection.replaceAll(list);
            this.initEvent();
        };
        CrossHeroPanel.prototype.sortFunc = function (p1, p2) {
            var teamVo1 = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, p1.order);
            var state1 = teamVo1.state;
            if (teamVo1.isEmptyTeam())
                state1 = 200;
            var teamVo2 = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, p2.order);
            var state2 = teamVo2.state;
            if (teamVo2.isEmptyTeam())
                state2 = 200;
            if (state1 != state2) {
                return state1 - state2;
            }
            else {
                return p1.order - p2.order;
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        CrossHeroPanel.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.refreshItem, this);
            this.m_pList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        };
        CrossHeroPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            this.m_pList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        };
        /**刷新组件 */
        CrossHeroPanel.prototype.refreshItem = function (vo) {
            //只刷新世界地图队伍
            if (vo && vo.teamType == 5 /* CROSS_SERVER */) {
                for (var i = 0; i < this.m_pCollection.source.length; i++) {
                    var data = this.m_pCollection.getItemAt(i);
                    if (data.order == vo.order) {
                        this.m_pCollection.itemUpdated(data);
                        return;
                    }
                }
            }
        };
        /**选中队伍 */
        CrossHeroPanel.prototype.onListHandler = function (e) {
            var data = e.item;
            if (data) {
                var order = data.order;
                //队伍未解锁
                if (order > TeamModel.getTeamMax(5 /* CROSS_SERVER */)) {
                    return;
                }
                var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, order);
                if (!teamVo)
                    return;
                //空队伍
                if (teamVo.isEmptyTeam()) {
                    com_main.UpManager.history();
                    Utils.open_view(TASK_UI.CROSS_SERVER_TEAM_PANEL, { id: order });
                    return;
                }
                if (teamVo.state != 0 /* IDLE */) {
                    var tips = TeamModel.getStateDes(teamVo.state);
                    EffectUtils.showTips(tips, 1, true);
                    return;
                }
                if (!isNull(this.m_nCId)) {
                    CrossProxy.send_C2S_CROSS_SERVER_TEAM_MOVE(1, teamVo.id, this.m_nCId);
                }
                else {
                    CrossProxy.C2S_CROSS_SERVER_ATTACK_GATE(teamVo.id);
                }
                com_main.UpManager.history();
            }
        };
        CrossHeroPanel.NAME = "CrossHeroPanel";
        return CrossHeroPanel;
    }(com_main.CView));
    com_main.CrossHeroPanel = CrossHeroPanel;
})(com_main || (com_main = {}));

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
     * 武将缘分弹出框
     */
    var TeamFateView = /** @class */ (function (_super_1) {
        __extends(TeamFateView, _super_1);
        function TeamFateView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = TeamFateView.NAME;
            _this.m_nIndex = data.order;
            _this.m_type = data.type;
            _this.initApp("fate/TeamFateViewSkin.exml");
            return _this;
        }
        TeamFateView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.FATE_UI]);
        };
        TeamFateView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.FATE_GEN_TITLE));
            var teamVo = TeamModel.getTeamVoByType(this.m_type, this.m_nIndex);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_tCollections;
            this.m_List.itemRenderer = com_main.TeamFateCell;
            this.refreshFateView();
        };
        TeamFateView.prototype.refreshFateView = function () {
            var teamVo = TeamModel.getTeamVoByType(this.m_type, this.m_nIndex);
            var m_pTmpTeamList = teamVo.cloneTeamGeneralData();
            var generalList = [];
            for (var index = 0; index < m_pTmpTeamList.length; index++) {
                if (m_pTmpTeamList[index].generalId > 0 && FateModel.checkGeneralFate(m_pTmpTeamList[index].generalId)) {
                    generalList.push(m_pTmpTeamList[index].generalId);
                }
            }
            this.m_tCollections.replaceAll(generalList);
        };
        TeamFateView.NAME = 'TeamFateView';
        return TeamFateView;
    }(com_main.CView));
    com_main.TeamFateView = TeamFateView;
})(com_main || (com_main = {}));

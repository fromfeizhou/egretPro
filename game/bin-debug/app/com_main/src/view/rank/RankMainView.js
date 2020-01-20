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
     * 排行榜主界面
     */
    var RankMainView = /** @class */ (function (_super_1) {
        __extends(RankMainView, _super_1);
        function RankMainView(param) {
            var _this = _super_1.call(this) || this;
            _this.name = RankMainView.NAME;
            _this.initApp("rank/rank_main_view.exml");
            _this.m_nCurIndex = param == null ? 0 : param.defTag;
            return _this;
        }
        RankMainView.prototype.onDestroy = function () {
            RankModel.clear();
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.RANK]);
        };
        RankMainView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.RANK));
            this.m_nTypes = [RankType.PLAYER, RankType.GENREAL, RankType.LEGION, RankType.COUNTRY, RankType.ONEHERO];
            this.InitTagGroup();
            this.InitListView();
            this.changeView(0);
            WorshipProxy.send_C2S_WORSHIP_INFO(WorshipType.FIGHT_RANK);
        };
        RankMainView.prototype.changeView = function (index) {
            this.m_nCurIndex = index;
            this.m_TagGroup.selectedIndex = this.m_nCurIndex;
            this.m_ViewStack.selectedIndex = index;
            RankProxy.C2S_RANK_COMM(this.m_nTypes[this.m_nCurIndex]);
        };
        RankMainView.prototype.InitTagGroup = function () {
            this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_ZL) });
            this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_WJ) });
            this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_LM) });
            this.m_TagGroup.addTabBtnData({ name: GCode(CLEnum.RANK_CITY) });
            this.m_TagGroup.addTabBtnData({ name: '神将排行' });
            this.m_TagGroup.setChangeCallback(this.changeTag, this);
        };
        /**切卡按钮点击 */
        RankMainView.prototype.changeTag = function (index) {
            this.changeView(index);
        };
        RankMainView.prototype.InitListView = function () {
            this.validateNow();
            this.m_tViews = [];
            for (var i = 0; i < this.m_nTypes.length; i++) {
                var view = new com_main.RankListPage(this.m_nTypes[i]);
                this.m_ViewStack.addChild(view);
                this.m_tViews.push(view);
            }
        };
        RankMainView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_RANK_COMM,
                ProtoDef.S2C_WORSHIP_INFO,
                ProtoDef.S2C_WORSHIP,
            ];
        };
        RankMainView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_RANK_COMM: {
                    this.m_tViews[this.m_nCurIndex].Refresh();
                    break;
                }
                case ProtoDef.S2C_WORSHIP_INFO:
                case ProtoDef.S2C_WORSHIP: {
                    this.m_tViews[this.m_nCurIndex].Refresh();
                    break;
                }
            }
        };
        RankMainView.NAME = "RankMainView";
        return RankMainView;
    }(com_main.CView));
    com_main.RankMainView = RankMainView;
})(com_main || (com_main = {}));

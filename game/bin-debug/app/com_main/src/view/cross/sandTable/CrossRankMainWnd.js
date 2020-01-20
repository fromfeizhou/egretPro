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
    var CrossRankMainWnd = /** @class */ (function (_super_1) {
        __extends(CrossRankMainWnd, _super_1);
        function CrossRankMainWnd(n) {
            var _this = _super_1.call(this) || this;
            _this.m_tViews = [];
            _this.m_curIndex = 0;
            _this.m_resetTime = 0;
            _this.name = CrossRankMainWnd.NAME;
            _this.initApp("cross/sandTable/CrossRankMainWndSkin.exml");
            return _this;
        }
        CrossRankMainWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_RANK_COMM,
            ];
        };
        CrossRankMainWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_RANK_COMM: {
                    if (this.m_curIndex < 2)
                        this.m_tViews[this.m_curIndex].Refresh();
                    break;
                }
            }
        };
        CrossRankMainWnd.prototype.onDestroy = function () {
            RankModel.clear();
            this.m_tViews = null;
            com_main.EventManager.removeEventListeners(this);
            // Utils.TimerManager.remove(this.updateCDTime, this);
            _super_1.prototype.onDestroy.call(this);
        };
        CrossRankMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.RANK));
            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.CROSS_RANK_GR)] = { tag: 0, id: 0 };
            this.m_tabData[GCode(CLEnum.CROSS_RANK_JT)] = { tag: 1, id: 1 };
            this.m_tabData[GCode(CLEnum.CROSS_RANK_RY)] = { tag: 2, id: 2 };
            this.refreshTabBtns();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_nTypes = [RankType.CROSS_SERVER_PLAYER_RANK, RankType.CROSS_SERVER_UNION_RANK];
            this.validateNow();
            //个人排名奖励
            var kraView = new com_main.CrossRankPageSL(this.m_nTypes[0]);
            this.m_tabViewStack.addChild(kraView);
            //军团荣誉排名
            var kcaView = new com_main.CrossRankPageSL(this.m_nTypes[1]);
            this.m_tabViewStack.addChild(kcaView);
            //荣誉累计奖励
            var kcadView = new com_main.CrossRankPageH();
            this.m_tabViewStack.addChild(kcadView);
            this.m_tViews.push(kraView);
            this.m_tViews.push(kcaView);
            this.m_tViews.push(kcadView);
            this.validateNow();
            this.initView(this.m_curIndex);
            // this.calcuResetTime();
            // this.updateCDTime();
            // Utils.TimerManager.doTimer(60000, 0, this.updateCDTime, this);
            var container = this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.CROSS_RANK_RY));
            RedPointModel.AddInfoListener(container, { x: 132, y: -5 }, [RedEvtType.CROSS_RANK_RY], 2);
        };
        /**刷新切卡 */
        CrossRankMainWnd.prototype.refreshTabBtns = function () {
            this.m_comTabGroup.clearTabBtn();
            var tags = [GCode(CLEnum.CROSS_RANK_GR), GCode(CLEnum.CROSS_RANK_JT), GCode(CLEnum.CROSS_RANK_RY)];
            this.m_comTabGroup.initNorTabBtns(tags);
        };
        CrossRankMainWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        CrossRankMainWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            var name = this.m_comTabGroup.selName;
            var data = this.m_tabData[name];
            if (!data)
                return;
            this.m_tabViewStack.selectedIndex = data.tag;
            if (this.m_curIndex < 2)
                RankProxy.C2S_RANK_COMM(this.m_nTypes[this.m_curIndex]);
        };
        CrossRankMainWnd.NAME = 'CrossRankMainWnd';
        return CrossRankMainWnd;
    }(com_main.CView));
    com_main.CrossRankMainWnd = CrossRankMainWnd;
})(com_main || (com_main = {}));

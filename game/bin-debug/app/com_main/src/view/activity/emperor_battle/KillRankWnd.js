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
     * 襄阳战（帝位争夺）
     * 杀敌排行榜
     */
    var KillRankWnd = /** @class */ (function (_super_1) {
        __extends(KillRankWnd, _super_1);
        function KillRankWnd(n) {
            var _this = _super_1.call(this) || this;
            _this.m_tViews = [];
            _this.m_curIndex = 0;
            _this.m_resetTime = 0;
            _this.name = KillRankWnd.NAME;
            _this.initApp("activity/emperorBattle/rankReward/KillRankWndSkin.exml");
            return _this;
        }
        KillRankWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_XIANGYANG_INFO,
            ];
        };
        KillRankWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_INFO: {
                    this.m_tViews[0].Refresh();
                    this.m_tViews[1].Refresh();
                    break;
                }
            }
        };
        KillRankWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            RankModel.clear();
            this.m_tViews = null;
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateCDTime, this);
        };
        KillRankWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.XIANGYANG_RANK_TITLE));
            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.PLAYER_RANK_REWARD)] = { tag: 0, id: 0 };
            this.m_tabData[GCode(CLEnum.COUNTRY_RANK_REWARD)] = { tag: 1, id: 1 };
            this.m_tabData[GCode(CLEnum.PLAYER_BATTLE_REWARD)] = { tag: 2, id: 2 };
            this.refreshTabBtns();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            // Utils.toStageBestScale(this.m_tabViewStack);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            //个人排名奖
            var kraView = new com_main.KillRankAwardView(width, height);
            this.m_tabViewStack.addChild(kraView);
            //国家排名奖
            var kcaView = new com_main.KillCountryAwardView(width, height);
            this.m_tabViewStack.addChild(kcaView);
            //个人挑战奖
            var kcadView = new com_main.KillCountAwardView(width, height);
            this.m_tabViewStack.addChild(kcadView);
            this.m_tViews.push(kraView);
            this.m_tViews.push(kcaView);
            this.m_tViews.push(kcadView);
            this.validateNow();
            this.initView(this.m_curIndex);
            this.calcuResetTime();
            this.updateCDTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateCDTime, this);
            var container = this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.PLAYER_BATTLE_REWARD));
            RedPointModel.AddInfoListener(container, { x: 132, y: -5 }, [RedEvtType.PLAYER_BATTLE_REWARD], 2);
        };
        KillRankWnd.prototype.calcuResetTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            var cur = new Date(curtime);
            cur.setHours(0);
            cur.setMinutes(0);
            cur.setSeconds(0);
            var day = cur.getDay();
            this.m_resetTime = cur.getTime() + (8 - day) * 3600 * 24 * 1000;
        };
        KillRankWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        /**刷新切卡 */
        KillRankWnd.prototype.refreshTabBtns = function () {
            this.m_comTabGroup.clearTabBtn();
            var tags = [GCode(CLEnum.PLAYER_RANK_REWARD), GCode(CLEnum.COUNTRY_RANK_REWARD), GCode(CLEnum.PLAYER_BATTLE_REWARD)];
            this.m_comTabGroup.initNorTabBtns(tags);
        };
        KillRankWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            var name = this.m_comTabGroup.selName;
            var data = this.m_tabData[name];
            if (!data)
                return;
            this.m_tabViewStack.selectedIndex = data.tag;
        };
        /**
         * 更新倒计时时间
         */
        KillRankWnd.prototype.updateCDTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            var str = Utils.DateUtils.getCountdownStrByCfg(this.m_resetTime - curtime, 1);
            this.m_pCDTtime.text = str;
        };
        KillRankWnd.NAME = "KillRankWnd";
        return KillRankWnd;
    }(com_main.CView));
    com_main.KillRankWnd = KillRankWnd;
})(com_main || (com_main = {}));

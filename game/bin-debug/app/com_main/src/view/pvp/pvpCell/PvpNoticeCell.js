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
    var PvpNoticeCell = /** @class */ (function (_super_1) {
        __extends(PvpNoticeCell, _super_1);
        function PvpNoticeCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("pvp_arena/PvpNoticeCellSkin.exml"); //Utils.getSkinName("app/pvp/pvpCell/PvpArenaRankCellSkin.exml");
            return _this;
        }
        PvpNoticeCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.init();
        };
        PvpNoticeCell.prototype.init = function () {
        };
        PvpNoticeCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.updateView(this.data);
        };
        PvpNoticeCell.prototype.updateView = function (data) {
            this.m_comState.stateId = data.countryId;
            this.m_pPlayerName.text = data.playerName;
            this.m_pLbForce.text = data.force + "";
            this.m_pBattleState.source = data.challengeWin ? "lb_cg_png" : "lb_sb_png";
            this.m_pRank.text = Math.abs(data.modifyRank) + "";
            this.m_pScoreState.visible = data.modifyRank != 0;
            this.m_pScoreState.source = data.challengeWin ? "com_state_up_png" : "com_state_down_png";
            var time = TimerUtils.getServerTimeMill() - data.challengeTime;
            var t = Math.floor(time * 0.001 / 3600);
            if (t > 0) {
                if (t > 24) {
                    this.m_pTime.text = GCodeFromat(CLEnum.ARENA_TIME, Math.floor(t / 24));
                }
                else {
                    this.m_pTime.text = GCodeFromat(CLEnum.ARENA_TIME1, t);
                }
            }
            else {
                this.m_pTime.text = GCodeFromat(CLEnum.ARENA_TIME2, Math.floor(time * 0.001 / 60));
            }
            this.m_pHead.info = { type: 1, url: data.head.toString(), official: 0, vip: 0 };
        };
        return PvpNoticeCell;
    }(eui.ItemRenderer));
    com_main.PvpNoticeCell = PvpNoticeCell;
})(com_main || (com_main = {}));

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
     * 活动类军营系统
     * @export
     * @class CampView
     * @extends CView
     */
    var CampPatroView = /** @class */ (function (_super_1) {
        __extends(CampPatroView, _super_1);
        function CampPatroView() {
            var _this = _super_1.call(this) || this;
            _this.name = CampPatroView.NAME;
            _this.initApp("team/CampPatroViewSkin.exml");
            return _this;
        }
        CampPatroView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CampPatroView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_teamPanel.setTeamData(2 /* PVE */);
            this.m_teamPanel.setTeamTileName(GCode(CLEnum.CAMP_ARMY1));
            this.m_teamPanel.setfightBtnName(GCode(CLEnum.CAMP_FIGHT));
            this.addEvent();
        };
        CampPatroView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBack, this, function () {
                com_main.UpManager.history();
            });
            com_main.EventMgr.addEvent(TeamUIEvent.TEAM_BTN_FIGHT, this.onBtnFight, this);
        };
        CampPatroView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TeamUIEvent.TEAM_BTN_FIGHT, this);
        };
        /**挑战按钮点击 */
        CampPatroView.prototype.onBtnFight = function () {
            var teamVo = TeamModel.getTeamVoByType(2 /* PVE */);
            if (teamVo.isEmptyTeam()) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_TIPS), 1, true);
                return;
            }
            PatrolProxy.send_C2S_PATROL_CHALLENGE();
        };
        CampPatroView.NAME = "CampPatroView";
        return CampPatroView;
    }(com_main.CView));
    com_main.CampPatroView = CampPatroView;
})(com_main || (com_main = {}));

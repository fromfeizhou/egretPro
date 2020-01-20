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
     * @class CampNorView
     * @extends CView
     */
    var CampNorView = /** @class */ (function (_super_1) {
        __extends(CampNorView, _super_1);
        function CampNorView(data) {
            var _this = _super_1.call(this) || this;
            _this.nationLimit = [];
            _this.typeLimit = [];
            _this.name = CampNorView.NAME;
            _this.m_nWarType = data.type;
            _this.m_nBattleId = data.battleId;
            _this.copyType = data.copyType ? data.copyType : 0;
            _this.setTeamType();
            _this.currentState = _this.m_nTeamType == 4 /* HISTORY_WAR */ ? "history" : "normal";
            _this.initApp("team/CampNorViewSKin.exml");
            return _this;
        }
        CampNorView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CampNorView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.updateLimitTips();
            this.m_teamPanel.setTeamData(this.m_nTeamType, 0, false, this.m_nBattleId);
            this.m_nIndex = TeamModel.defTeamOrder;
            // this.m_comIndexBar.initBar(this.m_nIndex, 1,this.changeTeamHandler,this);
            this.refreshNorView();
            this.addEvent();
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        CampNorView.prototype.setTeamType = function () {
            switch (this.m_nWarType) {
                case CheckPointType.PK_DEF: {
                    this.m_nTeamType = 3 /* DEF_APK */;
                    break;
                }
                case CheckPointType.HISTORY_WAR: {
                    this.m_nTeamType = 4 /* HISTORY_WAR */;
                    break;
                }
                default:
                    this.m_nTeamType = 2 /* PVE */;
                    break;
            }
        };
        CampNorView.prototype.updateLimitTips = function () {
            if (this.m_nWarType == CheckPointType.HISTORY_WAR) {
                var hiswarCfg = C.HistoryWarConfig[this.m_nBattleId];
                if (isNull(hiswarCfg))
                    return;
                this.nationLimit = StringUtils.stringToNumberArray2(hiswarCfg.nationTypeLimit);
                this.typeLimit = StringUtils.stringToNumberArray2(hiswarCfg.generalOccupationLimit);
                var nationTips = "禁止势力：<font color=0xff0000>";
                var typeTips = "禁止兵种：<font color=0xff0000>";
                for (var _i = 0, _a = this.nationLimit; _i < _a.length; _i++) {
                    var nation = _a[_i];
                    nationTips += Utils.getCountryName(nation);
                }
                nationTips += "</font>";
                if (this.nationLimit.length == 0)
                    nationTips = "";
                this.m_lbNation.textFlow = Utils.htmlParser(nationTips);
                this.m_lbNation.visible = this.nationLimit.length > 0;
                for (var _b = 0, _c = this.typeLimit; _b < _c.length; _b++) {
                    var typeStr = _c[_b];
                    typeTips += Utils.getSoilderTypeName(typeStr);
                }
                typeTips += "</font>";
                if (this.typeLimit.length == 0)
                    typeTips = "";
                this.m_lbtype.textFlow = Utils.htmlParser(typeTips);
                this.m_lbtype.visible = this.typeLimit.length > 0;
                this.m_lbtype.includeInLayout = this.typeLimit.length > 0;
                this.m_lbNation.includeInLayout = this.nationLimit.length > 0;
            }
        };
        CampNorView.prototype.addEvent = function () {
            var _this = this;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBack, this, function () {
                if (_this.m_teamPanel.m_bInDragGuide)
                    return;
                com_main.UpManager.history();
            });
            com_main.EventMgr.addEvent(TeamUIEvent.TEAM_BTN_FIGHT, this.onBtnFight, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onWorldUpdateList, this);
        };
        CampNorView.prototype.onWorldUpdateList = function (vo) {
            if (vo.teamType == this.m_nTeamType) {
                this.m_ptips.visible = this.m_nTeamType != 3 /* DEF_APK */ && TeamModel.hasPVEEmptyPos();
            }
        };
        CampNorView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TeamUIEvent.TEAM_BTN_FIGHT, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
        };
        /**挑战按钮点击 */
        CampNorView.prototype.onBtnFight = function () {
            var teamVo = TeamModel.getTeamVoByType(this.m_nTeamType, this.m_nIndex);
            if (teamVo.isEmptyTeam()) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_TIPS), 1, true);
                return;
            }
            switch (this.m_nWarType) {
                case CheckPointType.CHECKPOINT: {
                    HeadQuartersProxy.send_HQ_CHALLENGES(this.m_nBattleId, 1);
                    break;
                }
                case CheckPointType.ARENA: {
                    ArenaProxy.send_ENTER_ARENA_BATTLE(1);
                    break;
                }
                case CheckPointType.PK: {
                    PvpArenaProxy.send_APK_CHALLENGE(this.m_nBattleId);
                    break;
                }
                case CheckPointType.BOSS: {
                    BossProxy.C2S_CHALLENGE_BOSS(this.m_nBattleId);
                    break;
                }
                case CheckPointType.MATERIAL: {
                    var currCount = MaterialModel.getCurrCount(this.copyType);
                    if (currCount <= 0) {
                        EffectUtils.showTips(GCode(CLEnum.MAT_NO_NUMBER), 1, true);
                        return;
                    }
                    MaterialProxy.C2S_MATERIAL_CHALLENGE(this.m_nBattleId, false); //挑战
                    break;
                }
                case CheckPointType.HISTORY_WAR: {
                    HistoryBattleProxy.C2S_HISTORY_WAR_FIGHT(this.m_nBattleId);
                    break;
                }
            }
        };
        /**刷新通用显示 */
        CampNorView.prototype.refreshNorView = function () {
            var btnName = GCode(CLEnum.CAMP_FIGHT);
            var tileName = GCode(CLEnum.CAMP_ARMY);
            this.refreshTitleName();
            if (this.m_nWarType == CheckPointType.NONE) {
                this.m_teamPanel.currentState = 'embattle';
            }
            else if (this.m_nWarType == CheckPointType.PK_DEF) {
                this.m_teamPanel.currentState = 'pvpDef';
            }
            else {
                this.m_teamPanel.currentState = 'normal';
                this.m_teamPanel.setfightBtnName(btnName);
            }
            this.m_ptips.visible = this.m_nTeamType != 3 /* DEF_APK */ && TeamModel.hasPVEEmptyPos();
        };
        /**切换下标 */
        CampNorView.prototype.changeTeamHandler = function () {
            // this.m_nIndex = this.m_comIndexBar.index;
            this.refreshTitleName();
            this.m_teamPanel.setTeamData(this.m_nTeamType, this.m_nIndex);
        };
        /**部队名字 */
        CampNorView.prototype.refreshTitleName = function () {
            var name = GCode(CLEnum.CAMP_ARMY1);
            if (this.m_nTeamType == 4 /* HISTORY_WAR */) {
                name = GCode(CLEnum.CAMP_HISTORY);
            }
            this.m_teamPanel.setTeamTileName(name);
        };
        /**检查新手引导面板条件 */
        CampNorView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.CAMP_WND);
        };
        /**全局访问 */
        CampNorView.getClass = function () {
            return SceneManager.getClass(LayerEnums.POPUP, CampNorView.NAME);
        };
        /**拖动指引 */
        CampNorView.doDragGuide = function () {
            var obj = this.getClass();
            if (obj)
                obj.m_teamPanel.doDragGuide();
        };
        CampNorView.NAME = "CampNorView";
        return CampNorView;
    }(com_main.CView));
    com_main.CampNorView = CampNorView;
})(com_main || (com_main = {}));

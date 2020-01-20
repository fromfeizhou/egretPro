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
     * 军营系统
     * @export
     * @class CampNorView
     * @extends CView
     */
    var CrossServerDetailWnd = /** @class */ (function (_super_1) {
        __extends(CrossServerDetailWnd, _super_1);
        function CrossServerDetailWnd() {
            var _this = _super_1.call(this) || this;
            _this.m_ownWin = 0 /* NO_RESULT */;
            _this.name = com_main.CrossServerCampView.NAME;
            _this.initApp("cross/CrossServerDetailWndSkin.exml");
            return _this;
        }
        CrossServerDetailWnd.prototype.listenerProtoNotifications = function () {
            return [];
        };
        CrossServerDetailWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        CrossServerDetailWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CrossServerDetailWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pBtn.setTitleLabel(GCode(CLEnum.CROSS_SAND_VIEW));
            this.addEvent();
            this.refreshDetailView();
        };
        /**刷新界面数据 */
        CrossServerDetailWnd.prototype.refreshDetailView = function () {
            var data = CrossModel.getCrossDetialData();
            this.m_ownServerWarVo = data.warA;
            this.m_emenyServerWarVo = data.warB;
            this.m_ownWin = data.win;
            this.m_city = data.warCityId;
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CROSS_WAR_TITLE));
            if (this.m_ownServerWarVo) {
                this.refreshCampData(true, this.m_ownServerWarVo);
            }
            if (this.m_emenyServerWarVo) {
                this.refreshCampData(false, this.m_emenyServerWarVo);
            }
            this.refreshCityData();
            this.refrshState();
            this.refrshOpenTime();
            this.updateWelfare();
            Utils.toStageBestScaleHeigt(this.m_pRoot);
        };
        /**刷新我方和敌方数据*/
        CrossServerDetailWnd.prototype.refreshCampData = function (isOwn, serverWarVo) {
            if (isOwn === void 0) { isOwn = true; }
            var camp = isOwn ? "own" : "enemy";
            this["m_" + camp + "King"].Init(serverWarVo.emperorData, GCode(CLEnum.CROSS_JOB_KING), serverWarVo.serverId);
            this["m_" + camp + "General_0"].Init(serverWarVo.weiKingData, GCode(CLEnum.CROSS_JOB_L));
            this["m_" + camp + "General_1"].Init(serverWarVo.shuKingData, GCode(CLEnum.CROSS_JOB_M));
            this["m_" + camp + "General_2"].Init(serverWarVo.wuKingData, GCode(CLEnum.CROSS_JOB_R));
        };
        /**刷新城池数据 */
        CrossServerDetailWnd.prototype.refreshCityData = function () {
            var crossCityCfg = C.CrossServerCityConfig[this.m_city];
            this.m_cityIcon.visible = unNull(crossCityCfg);
            this.m_pAWard.visible = unNull(crossCityCfg);
            if (isNull(crossCityCfg)) {
                this.m_lbCity.text = GCode(CLEnum.CROSS_TIPS1);
                // this.m_cityName.text = GCode(CLEnum.CROSS_TIPS1);
                this.m_cityName.text = CrossModel.getStateName();
                this.m_RewardRoot.removeChildren();
                return;
            }
            this.m_lbCity.text = CrossModel.getCrossCityTypeName(crossCityCfg.cityType) + "\u3010" + crossCityCfg.cityName + "\u3011";
            this.m_cityName.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CROSS_CITY_NAME, crossCityCfg.cityName, crossCityCfg.cityType));
            this.m_cityIcon.texture = RES.getRes(crossCityCfg.icon + "_png");
            this.m_RewardRoot.removeChildren();
            var rewardCfg = CrossModel.getCrossServerRewardConfig(6 /* WIN_SERVER */, crossCityCfg.cityType);
            var rewardList0 = rewardCfg.reward;
            for (var i = 0, len = rewardList0.length; i < len; i++) {
                var itemView = com_main.ComItemNew.create("count");
                itemView.scaleX = 0.8;
                itemView.scaleY = 0.8;
                itemView.setItemInfo(rewardList0[i].itemId, rewardList0[i].count);
                this.m_RewardRoot.addChild(itemView);
            }
        };
        /**刷新时间 */
        CrossServerDetailWnd.prototype.refrshOpenTime = function () {
            var time = CrossModel.openTime;
            var subTime = CrossModel.openTime - TimerUtils.getServerTime();
            this.m_pGTime.visible = unNull(subTime) && subTime > 0;
            var timeStr = Utils.DateUtils.getDateStr(time, 2);
            this.m_openTime.textFlow = Utils.htmlParser(timeStr);
        };
        /**刷新按钮状态 */
        CrossServerDetailWnd.prototype.refrshState = function () {
            this.updateCampResult(true); //我方
            this.updateCampResult(false); //对方
            this.m_pStateBtn.setTitleLabel(GCode(CLEnum.CROSS_ENTER_WAR));
            this.m_pBtn.setTitleLabel(GCode(CLEnum.CROSS_SAND_VIEW));
            this.m_pStateBtn.visible = CrossModel.isWar() || CrossModel.crossStatus == 3 /* MATCH_SUC */;
        };
        CrossServerDetailWnd.prototype.updateCampResult = function (isOwn) {
            if (isOwn === void 0) { isOwn = true; }
            var camp = isOwn ? "own" : "enemy";
            this["m_" + camp + "Result"].visible = this.m_ownWin != 0 /* NO_RESULT */;
            this["m_" + camp + "ResultImg"].visible = this.m_ownWin != 0 /* NO_RESULT */;
            this["m_" + camp + "ResultImg"].source = (this.m_ownWin == 1 /* WIN */ && isOwn) || (this.m_ownWin == 2 /* FAIL */ && !isOwn) ? "lb_ty1_s_png" : "lb_ty4_b_png";
        };
        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */
        CrossServerDetailWnd.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pStateBtn, this, this.onBtnStateHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pBtn, this, this.onBtnSandTable);
            com_main.EventManager.addTouchScaleListener(this.m_bRule, this, this.onBtnRule);
            com_main.EventManager.addTouchScaleListener(this.m_btnWelfare, this, this.onclickWelfare);
            com_main.EventMgr.addEvent(CrossWarEvent.CROSS_SERVER_STATUS, this.onServerStatus, this);
        };
        CrossServerDetailWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(CrossWarEvent.CROSS_SERVER_STATUS, this);
        };
        CrossServerDetailWnd.prototype.onServerStatus = function () {
            this.updateWelfare();
        };
        /**更新每日福利 */
        CrossServerDetailWnd.prototype.updateWelfare = function () {
            // 每日福利
            this.m_btnWelfare.visible = CrossModel.rewardStatus == 1;
        };
        CrossServerDetailWnd.prototype.onBtnStateHandler = function (pvt) {
            switch (CrossModel.crossStatus) {
                case 3 /* MATCH_SUC */:
                case 4 /* WALL_WAR */: {
                    SceneManager.enterScene(SceneEnums.CROSS_WALL_WAR_MAP);
                    break;
                }
                case 5 /* CITY_WAR */: {
                    SceneManager.enterScene(SceneEnums.CROSS_WAR_MAP);
                }
            }
        };
        CrossServerDetailWnd.prototype.onclickWelfare = function () {
            CrossProxy.C2S_CROSS_SERVER_GET_DAY_REWARD();
        };
        CrossServerDetailWnd.prototype.onBtnSandTable = function () {
            CrossModel.openSandTable();
        };
        CrossServerDetailWnd.prototype.onBtnRule = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.CROSS_BZWD), title: GCode(CLEnum.WOR_HELP_TITLE) });
        };
        CrossServerDetailWnd.NAME = "CrossServerDetailWnd";
        return CrossServerDetailWnd;
    }(com_main.CView));
    com_main.CrossServerDetailWnd = CrossServerDetailWnd;
})(com_main || (com_main = {}));

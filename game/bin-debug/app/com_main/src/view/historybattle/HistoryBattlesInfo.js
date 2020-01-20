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
    var HistoryBattlesInfo = /** @class */ (function (_super_1) {
        __extends(HistoryBattlesInfo, _super_1);
        function HistoryBattlesInfo(param) {
            var _this = _super_1.call(this) || this;
            _this.name = HistoryBattlesInfo.NAME;
            _this.m_nChapterId = param;
            _this.initApp("HistoryBattle/HistoryBattlesInfoSkin.exml");
            _this.initViewData();
            return _this;
        }
        HistoryBattlesInfo.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            while (this.m_Generals.numChildren > 0) {
                var item = this.m_Generals.getChildAt(0);
                if (item.onDestroy) {
                    item.onDestroy();
                }
                else {
                    Utils.removeFromParent(item);
                }
            }
            com_main.EventMgr.removeEventByObject(HistoryWarEvent.HISTORY_UPDATE_NUM, this);
        };
        HistoryBattlesInfo.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_BtnEdit, this, this.onBtnEdit);
            com_main.EventManager.addTouchScaleListener(this.m_BtnMoppingUp, this, this.onBtnMoppingUp);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBattle, this, this.onBtnBattle);
            com_main.EventMgr.addEvent(HistoryWarEvent.HISTORY_UPDATE_NUM, this.onInfoMaxNum, this);
            this.Refresh_BtnLabel();
            this.Refresh();
            this.onGuideCondition();
        };
        /** 初始化界面数据 */
        HistoryBattlesInfo.prototype.initViewData = function () {
            this._chapterCfg = C.HistoryWarConfig[this.m_nChapterId];
            this._starConfig = C.HistoryWarStarConfig[this.m_nChapterId];
            this.updateViewModel();
        };
        /** showModel:设置显示模式:0-默认，1-无扫荡，2-预览*/
        HistoryBattlesInfo.prototype.updateViewModel = function () {
            this.m_BtnMoppingUp.visible = HistoryBattleModel.isPassWar(this.m_nChapterId) ? true : false;
            this.m_labFirst.text = HistoryBattleModel.isPassWar(this.m_nChapterId) ? GCode(CLEnum.QUA_FALL) : GCode(CLEnum.QUA_FALL_FIRST);
            this.m_labLmitTip.textFlow = Utils.htmlParser(HistoryBattleModel.getLimitTips(this.m_nChapterId));
            var tempId = HeadQuartersModel.fightRecordId;
            var lockid = this._chapterCfg.prevPointId;
            var lastChapterCfg = C.HistoryWarConfig[lockid];
            this.m_labLockTip.text = '';
            if (lastChapterCfg) {
                this.m_labLockTip.text = (HistoryBattleModel.isPassWar(lockid)) ? '' : GCodeFromat(CLEnum.QUA_PASS_LIMIT, lastChapterCfg.level);
            }
            this.m_pBtnRoot.visible = HistoryBattleModel.getDefCopyId() >= this.m_nChapterId && HistoryBattleModel.isPassWar(lockid);
            var showModel = 0;
            showModel = HistoryBattleModel.isCleanHistoryLevel(this.m_nChapterId) ? 2 : 1;
            switch (showModel) {
                case 1:
                    {
                        this.m_BtnMoppingUp.visible = false;
                        this.m_BtnBattle.visible = true;
                        break;
                    }
                case 2:
                    {
                        this.m_BtnMoppingUp.visible = true;
                        this.m_BtnBattle.visible = false;
                        break;
                    }
            }
        };
        // /**当前前置关卡权重值 */
        // private getPerNum(vo: any) {
        // 	vo = vo.replace('[', '');
        // 	vo = vo.replace(']', '');
        // 	let allper = vo.split(',');
        // 	let num = Number(allper[0]);
        // 	return num;
        // }
        /** 按钮事件 - 布阵 */
        HistoryBattlesInfo.prototype.onBtnEdit = function () {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.HISTORY_WAR, battleId: this.m_nChapterId });
        };
        /** 按钮事件 - 扫荡 */
        HistoryBattlesInfo.prototype.onBtnMoppingUp = function () {
            var maxCount = this._chapterCfg.maxChallengeCount; //某关卡最大挑战次数
            if (this.m_maxSaodNum >= maxCount) {
                EffectUtils.showTips(GCode(CLEnum.QUA_SWEEP_FAL), 1, true);
                return;
            }
            if (NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).reCount > 0) {
                HistoryBattleProxy.C2S_HISTORY_WAR_CLEAN_UP(this._chapterCfg.id);
            }
            else {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips("挑战次数不足");
                    return;
                }
                HistoryBattleModel.BuyChallengedTimes();
            }
        };
        /** 按钮事件 - 挑战 */
        HistoryBattlesInfo.prototype.onBtnBattle = function () {
            var maxCount = this._chapterCfg.maxChallengeCount; //某关卡最大挑战次数
            if (this.m_maxSaodNum >= maxCount) {
                EffectUtils.showTips(GCode(CLEnum.QUA_SWEEP_FAL), 1, true);
                return;
            }
            if (this._chapterCfg) {
                if (RoleData.level < this._chapterCfg.lockLv) {
                    EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LEVEL, this._chapterCfg.lockLv), 1, true);
                    return;
                }
                // if (TeamModel.isEmptyTeamHistoryWar()) {
                TeamModel.cleanTeamByType(4 /* HISTORY_WAR */);
                Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.HISTORY_WAR, battleId: this.m_nChapterId });
                return;
                // }
                // HistoryBattleProxy.C2S_HISTORY_WAR_FIGHT(this.m_nChapterId);
            }
        };
        /** 刷新界面 */
        HistoryBattlesInfo.prototype.Refresh = function () {
            this.Refresh_Title();
            this.Refresh_Heros();
            this.Refresh_Items();
            this.Refresh_StarInfo();
            this.Refresh_RecomPower();
            this.onInfoMaxNum();
        };
        HistoryBattlesInfo.prototype.Refresh_Title = function () {
            this.m_PopUp.setTitleLabel("\u7B2C" + this._chapterCfg.level + "\u5173");
        };
        /** 刷新 - 按钮文字*/
        HistoryBattlesInfo.prototype.Refresh_BtnLabel = function () {
            this.m_BtnEdit.setTitleLabel(GCode(CLEnum.CAMP));
            this.m_BtnMoppingUp.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
            this.m_BtnBattle.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
        };
        /** 刷新 - 过关星星信息 */
        HistoryBattlesInfo.prototype.Refresh_StarInfo = function () {
            this["m_starDesc1"].text = GLan(this._starConfig.oneStarConfig);
            this["m_starDesc2"].text = GLan(this._starConfig.twoStarConfig);
            this["m_starDesc3"].text = GLan(this._starConfig.threeStarConfig);
            var levelInfo = HistoryBattleModel.getLevelInfo(this._chapterCfg.chapterId, this._chapterCfg.id);
            var starInfo = levelInfo == null ? 0 : levelInfo.star;
            if (starInfo) {
                for (var index = 0; index < starInfo; index++) {
                    var iconKey = "m_starIcon" + (index + 1);
                    if (this[iconKey])
                        this[iconKey].source = "common_star_png";
                    var textKey = "m_starDesc" + (index + 1);
                    if (this[textKey])
                        this[textKey].textColor = GameConfig.TextColors.white;
                }
            }
        };
        /** 刷新 - 次数 */
        HistoryBattlesInfo.prototype.onInfoMaxNum = function () {
            var leveInfo = HistoryBattleModel.getLevelInfo(this._chapterCfg.chapterId, this._chapterCfg.id);
            var maxCount = this._chapterCfg.maxChallengeCount; //某关卡最大挑战次数
            var figthNum = leveInfo == null ? maxCount : leveInfo.fightNum;
            var starNum = leveInfo == null ? 0 : leveInfo.star;
            this.m_pSaoRoot.visible = true;
            this.m_labSaodNum.text = figthNum + '/' + maxCount;
        };
        /** 刷新 - 推荐战力 */
        HistoryBattlesInfo.prototype.Refresh_RecomPower = function () {
            if (this._starConfig)
                this.m_RecomPower.text = this._chapterCfg.lockLv.toString();
        };
        /** 刷新 - 战斗头像 */
        HistoryBattlesInfo.prototype.Refresh_Heros = function () {
            if (this._chapterCfg) {
                var heroInfos = JSON.parse(this._chapterCfg.generalInfos);
                for (var i = 0; i < heroInfos.length; i++) {
                    var item = com_main.GeneralHeadRender.create("arena");
                    var info = heroInfos[i];
                    var id = parseInt(info[0]);
                    var starNum = info[1];
                    var level = info[2];
                    item.setGenViewInfo(id, level, starNum);
                    this.m_Generals.addChild(item);
                }
            }
        };
        /** 刷新 - 物品信息 */
        HistoryBattlesInfo.prototype.Refresh_Items = function () {
            if (this._chapterCfg) {
                var reward = void 0;
                if (HistoryBattleModel.isPassWar(this.m_nChapterId)) {
                    reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.winReward, true);
                }
                else {
                    reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.firstReward);
                }
                for (var i = 0; i < reward.length; i++) {
                    var item = com_main.ComItemNew.create("count");
                    item.setItemInfo(reward[i].itemId, reward[i].count);
                    this["m_Items"].addChild(item);
                }
            }
        };
        /**检查新手引导面板条件 */
        HistoryBattlesInfo.prototype.onGuideCondition = function () {
            // EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_INFO_WND);
        };
        HistoryBattlesInfo.NAME = 'HistoryBattlesInfo';
        return HistoryBattlesInfo;
    }(com_main.CView));
    com_main.HistoryBattlesInfo = HistoryBattlesInfo;
})(com_main || (com_main = {}));

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
    var HeadQuartersInfo = /** @class */ (function (_super_1) {
        __extends(HeadQuartersInfo, _super_1);
        function HeadQuartersInfo(param) {
            var _this = _super_1.call(this) || this;
            _this.name = HeadQuartersInfo.NAME;
            _this.m_nChapterId = param;
            _this.initApp("headquarters/HeadQuartersInfoSkin.exml");
            _this.initViewData();
            return _this;
        }
        HeadQuartersInfo.prototype.onDestroy = function () {
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
            com_main.EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_NUM, this);
        };
        HeadQuartersInfo.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_BtnEdit, this, this.onBtnEdit);
            com_main.EventManager.addTouchScaleListener(this.m_BtnMoppingUp, this, this.onBtnMoppingUp);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBattle, this, this.onBtnBattle);
            com_main.EventMgr.addEvent(QuarterEvent.QUARTER_INFO_NUM, this.onInfoMaxNum, this);
            this.Refresh_BtnLabel();
            this.Refresh();
            this.onGuideCondition();
        };
        /** 初始化界面数据 */
        HeadQuartersInfo.prototype.initViewData = function () {
            this._chapterCfg = C.ChapterConfig[this.m_nChapterId];
            // this._checkPointCfg = C.CheckPointConfig[checkPointId];
            this._starConfig = C.StarConfig[this.m_nChapterId];
            this.updateViewModel();
        };
        /** showModel:设置显示模式:0-默认，1-无扫荡，2-预览*/
        HeadQuartersInfo.prototype.updateViewModel = function () {
            this.m_BtnMoppingUp.visible = this._chapterCfg.stageType != 0 && HeadQuartersModel.isPassWar(this.m_nChapterId) ? true : false;
            if (this._chapterCfg.difficultyType == IQuarLevel.NORMAL) {
                this.m_labFirst.text = HeadQuartersModel.isPassWar(this.m_nChapterId) ? GCode(CLEnum.QUA_FALL) : GCode(CLEnum.QUA_FALL_FIRST);
            }
            else {
                this.m_labFirst.text = HeadQuartersModel.isPassWar(this.m_nChapterId) ? GCode(CLEnum.BOSS_DROP) : GCode(CLEnum.QUA_FALL_FIRST);
            }
            var tempId = HeadQuartersModel.fightRecordId;
            var lockid = this.getPerNum(this._chapterCfg.prevPointId) ? this.getPerNum(this._chapterCfg.prevPointId) : 0;
            var lastChapterCfg = C.ChapterConfig[lockid];
            this.m_labLockTip.text = '';
            if (lastChapterCfg) {
                var str = lastChapterCfg.difficultyType == IQuarLevel.HARD ? GCode(CLEnum.HARD) : GCode(CLEnum.NORMAL);
                this.m_labLockTip.text = (HeadQuartersModel.isPassWar(lockid)) ? '' : GCodeFromat(CLEnum.QUA_PASS_LIMIT, str + lastChapterCfg.title);
            }
            this.m_pBtnRoot.visible = HeadQuartersModel.getDefCopyId(this._chapterCfg.chapterId) >= this.m_nChapterId && HeadQuartersModel.isPassWar(lockid);
            var showModel = 0;
            switch (showModel) {
                case 1:
                    {
                        this.m_BtnMoppingUp.visible = false;
                        break;
                    }
                case 2:
                    {
                        this.m_BtnEdit.visible = false;
                        this.m_BtnMoppingUp.visible = false;
                        this.m_BtnBattle.visible = false;
                        break;
                    }
            }
        };
        /**当前前置关卡权重值 */
        HeadQuartersInfo.prototype.getPerNum = function (vo) {
            vo = vo.replace('[', '');
            vo = vo.replace(']', '');
            var allper = vo.split(',');
            var num = Number(allper[0]);
            return num;
        };
        /** 按钮事件 - 布阵 */
        HeadQuartersInfo.prototype.onBtnEdit = function () {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.CHECKPOINT, battleId: this.m_nChapterId });
        };
        /** 按钮事件 - 扫荡 */
        HeadQuartersInfo.prototype.onBtnMoppingUp = function () {
            var maxCount = this._chapterCfg.maxChallengeCount; //某关卡最大挑战次数
            if (this.m_maxSaodNum >= maxCount) {
                EffectUtils.showTips(GCode(CLEnum.QUA_SWEEP_FAL), 1, true);
                return;
            }
            var type;
            if (this._chapterCfg.difficultyType == IQuarLevel.HARD) {
                type = IFunCountEnum.HQ_HARD_FREE_COUNT;
            }
            else {
                type = IFunCountEnum.COPY_FREE_COUNT;
            }
            if (NormalModel.getFunCountById(type).reCount) {
                HeadQuartersProxy.send_HQ_CLEAN_UP(this.m_nChapterId);
            }
            else {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips("扫荡次数不足");
                    return;
                }
                HeadQuartersModel.BuyChallengedTimes(type);
            }
        };
        /** 按钮事件 - 挑战 */
        HeadQuartersInfo.prototype.onBtnBattle = function () {
            var maxCount = this._chapterCfg.maxChallengeCount; //某关卡最大挑战次数
            if (this.m_maxSaodNum >= maxCount) {
                EffectUtils.showTips(GCode(CLEnum.QUA_SWEEP_FAL), 1, true);
                return;
            }
            if (HeadQuartersModel.canChallenges(this.m_nChapterId)) {
                HeadQuartersProxy.send_HQ_CHALLENGES(this.m_nChapterId, 1);
            }
        };
        /** 刷新界面 */
        HeadQuartersInfo.prototype.Refresh = function () {
            this.Refresh_Title();
            this.Refresh_Heros();
            this.Refresh_Items();
            this.Refresh_StarInfo();
            this.Refresh_RecomPower();
            this.onInfoMaxNum(null);
        };
        HeadQuartersInfo.prototype.Refresh_Title = function () {
            this.m_PopUp.setTitleLabel(this._chapterCfg.title);
        };
        /** 刷新 - 按钮文字*/
        HeadQuartersInfo.prototype.Refresh_BtnLabel = function () {
            this.m_BtnEdit.setTitleLabel(GCode(CLEnum.CAMP));
            this.m_BtnMoppingUp.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
            this.m_BtnBattle.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
        };
        /** 刷新 - 过关星星信息 */
        HeadQuartersInfo.prototype.Refresh_StarInfo = function () {
            this["m_starDesc1"].text = GLan(this._starConfig.oneStarConfig);
            this["m_starDesc2"].text = GLan(this._starConfig.twoStarConfig);
            this["m_starDesc3"].text = GLan(this._starConfig.threeStarConfig);
            var starInfo = HeadQuartersModel.getStarInfo(this._chapterCfg.chapterId, this._chapterCfg.id);
            if (starInfo) {
                for (var index = 0; index <= starInfo.condition.length; index++) {
                    var iconKey = "m_starIcon" + starInfo.condition[index];
                    if (this[iconKey])
                        this[iconKey].source = "common_star_png";
                    var textKey = "m_starDesc" + starInfo.condition[index];
                    if (this[textKey])
                        this[textKey].textColor = GameConfig.TextColors.white;
                }
            }
        };
        /** 刷新 - 最大扫荡次数 */
        HeadQuartersInfo.prototype.onInfoMaxNum = function (count) {
            var starInfo = HeadQuartersModel.getStarInfo(this._chapterCfg.chapterId, this._chapterCfg.id);
            var maxCount = this._chapterCfg.maxChallengeCount; //某关卡最大挑战次数
            if (starInfo) {
                this.m_pSaoRoot.visible = true;
                starInfo.count = count ? count : starInfo.count;
                this.m_maxSaodNum = starInfo.count;
                if (count && count > 0 && count < maxCount) {
                    this.m_labSaodNum.text = (maxCount - count) + '/' + maxCount;
                }
                else {
                    this.m_labSaodNum.text = starInfo.count < maxCount ? (maxCount - starInfo.count) + '/' + maxCount : '0/' + maxCount;
                }
            }
            else {
                this.m_pSaoRoot.visible = false;
            }
        };
        /** 刷新 - 推荐战力 */
        HeadQuartersInfo.prototype.Refresh_RecomPower = function () {
            if (this._starConfig)
                this.m_RecomPower.text = this._starConfig.power.toString();
        };
        /** 刷新 - 战斗头像 */
        HeadQuartersInfo.prototype.Refresh_Heros = function () {
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
        HeadQuartersInfo.prototype.Refresh_Items = function () {
            if (this._chapterCfg) {
                var reward = void 0;
                if (HeadQuartersModel.isPassWar(this.m_nChapterId)) {
                    if (this._chapterCfg.difficultyType == IQuarLevel.NORMAL) {
                        reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.winReward);
                    }
                    else {
                        reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.winReward, true);
                    }
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
        HeadQuartersInfo.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_INFO_WND);
        };
        HeadQuartersInfo.NAME = 'HeadQuartersInfo';
        return HeadQuartersInfo;
    }(com_main.CView));
    com_main.HeadQuartersInfo = HeadQuartersInfo;
})(com_main || (com_main = {}));

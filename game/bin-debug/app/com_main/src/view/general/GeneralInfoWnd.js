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
//武将详细信息表
var com_main;
(function (com_main) {
    var GeneralInfoWnd = /** @class */ (function (_super_1) {
        __extends(GeneralInfoWnd, _super_1);
        function GeneralInfoWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.sliderIndex = 0;
            _this.sliderList = [];
            _this.name = GeneralInfoWnd.NAME;
            _this.initViewData(param);
            _this.initApp("general/GeneralInfoWndSkin.exml");
            _this.m_gSound = GeneralModel.getGeneralSoundByGeneralID(_this.m_generalId);
            Sound.playGeneralSoundByID(_this.m_gSound);
            return _this;
        }
        GeneralInfoWnd.prototype.initViewData = function (param) {
            this.m_generalId = param.generalId || GeneralModel.getGeneralDefaut();
            this.m_nTagIndex = param.tag || 1;
            if (this.m_generalId) {
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
                if (this.m_generalVo.own) {
                    this.sliderList = param.ownList || GeneralModel.getOwnGenIds();
                }
                else {
                    this.sliderList = param.noList || [this.m_generalId];
                }
                for (var i in this.sliderList) {
                    if (this.m_generalId == this.sliderList[i]) {
                        this.sliderIndex = Number(i);
                    }
                }
            }
        };
        GeneralInfoWnd.prototype.listenerProtoNotifications = function () {
            return [ProtoDef.GENERAL_USE_EXP_BOOK, ProtoDef.GENERAL_UP_STAR, ProtoDef.RECRUITED_GENERAL,
                ProtoDef.OPEN_SKILL, ProtoDef.GENERAL_TREASURE_WEAR, ProtoDef.GENERAL_UPGRADE];
        };
        GeneralInfoWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.RECRUITED_GENERAL: {
                    var data = body;
                    if (data.generalInfo.generalId != this.m_generalId)
                        return;
                    this.refreshTabBtns();
                    this.refreshInfo();
                    break;
                }
                case ProtoDef.GENERAL_USE_EXP_BOOK: {
                    this.refreshLevelInfo();
                    break;
                }
                case ProtoDef.GENERAL_UP_STAR: {
                    this.refreshStarInfo();
                    break;
                }
                case ProtoDef.OPEN_SKILL: {
                    this.refreshSkillInfo();
                    break;
                }
                //宝物装备
                case ProtoDef.GENERAL_TREASURE_WEAR: {
                    this.refreshTreasureInfo();
                    break;
                }
                //突破
                case ProtoDef.GENERAL_UPGRADE: {
                    this.refreshTuPoInfo();
                    break;
                }
            }
        };
        GeneralInfoWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            Sound.stopGeneralSoundByID(this.m_gSound);
        };
        GeneralInfoWnd.prototype.childrenCreated = function () {
            var _a;
            _super_1.prototype.childrenCreated.call(this);
            this.m_mainTop.setTitleName(GCode(CLEnum.GEN_TITLE_WJXX));
            this.m_mainTop.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_tTagInfo = (_a = {},
                _a[GCode(CLEnum.GEN_ATTR)] = { viewId: 0, guideId: -1 },
                _a[GCode(CLEnum.GEN_STRENG)] = { viewId: 1, guideId: IGUIDECD.GEN_TAB_UP },
                _a[GCode(CLEnum.GEN_SKILL)] = { viewId: 2, guideId: IGUIDECD.GEN_TAB_SKILL },
                _a[GCode(CLEnum.GEN_TREA)] = { viewId: 3, guideId: IGUIDECD.GEN_TAB_TREA },
                _a);
            this.refreshTabBtns();
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            this.m_tabAttri = new com_main.GeneralAttriView(width, height);
            this.m_tabViewStack.addChild(this.m_tabAttri);
            this.m_tabStreng = new com_main.GeneralStrengView(width, height);
            this.m_tabViewStack.addChild(this.m_tabStreng);
            this.m_tabSkill = new com_main.GeneralSkillView(width, height);
            this.m_tabViewStack.addChild(this.m_tabSkill);
            this.m_tabTrea = new com_main.GeneralTreaView(width, height);
            this.m_tabViewStack.addChild(this.m_tabTrea);
            this.m_tabViews = [];
            this.m_tabViews.push(this.m_tabAttri);
            this.m_tabViews.push(this.m_tabStreng);
            this.m_tabViews.push(this.m_tabSkill);
            this.m_tabViews.push(this.m_tabTrea);
            this.refreshInfo();
            this.changeContentTag(this.m_nTagIndex);
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
            this.m_nTabOldTime = TimerUtils.getServerTime();
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        /**刷新切卡 */
        GeneralInfoWnd.prototype.refreshTabBtns = function () {
            if (this.m_generalVo) {
                var curState = this.m_generalVo.isOwn ? 0 : 1;
                if (curState == this.m_tabBtnState)
                    return;
                this.m_tabBtnState = curState;
                this.m_comTabTopGroup.clearTabBtn();
                var tags = [GCode(CLEnum.GEN_ATTR)];
                if (curState == 0) {
                    if (FunctionModel.isFunctionOpen(FunctionType.GENERAL_LEVELUP) || FunctionModel.isFunctionOpen(FunctionType.GENERAL_STAR)) {
                        tags.push(GCode(CLEnum.GEN_STRENG));
                    }
                    if (FunctionModel.isFunctionOpen(FunctionType.GENERAL_SKILL)) {
                        tags.push(GCode(CLEnum.GEN_SKILL));
                    }
                    if (FunctionModel.isFunctionOpen(FunctionType.GENERAL_TREASURE)) {
                        tags.push(GCode(CLEnum.GEN_TREA));
                    }
                }
                this.m_comTabTopGroup.initNorTabBtns(tags);
            }
        };
        /**只刷新当前页内容( 减少 切卡处理刷新页面 提高性能) */
        GeneralInfoWnd.prototype.refreshCurTab = function () {
            var info = this.m_tTagInfo[this.m_comTabTopGroup.selName];
            var view = this.m_tabViews[info.viewId];
            view.generalId = this.m_generalId;
        };
        GeneralInfoWnd.prototype.refreshInfo = function () {
            //刷新英雄图片
            this.m_imgGeneralCardBg.source = GeneralModel.getSoldierQualityBigLogoBg(this.m_generalVo.qualityLevel);
            this.m_genCard.generalId = this.m_generalId;
            if (this.m_generalVo.own) {
                this.m_comTabTopGroup.touchEnabled = true;
                this.m_comTabTopGroup.touchChildren = true;
                this.refreshCurTab();
            }
            else {
                //刷新属性部分
                this.m_comTabTopGroup.touchEnabled = false;
                this.m_comTabTopGroup.touchChildren = false;
                this.refreshCurTab();
            }
            this.initRedPointEvt();
        };
        /**红点 */
        GeneralInfoWnd.prototype.initRedPointEvt = function () {
            if (this.m_generalVo && this.m_generalVo.isOwn) {
                RedPointModel.AddInfoListener(this.m_comTabTopGroup.getTabBtnByName(GCode(CLEnum.GEN_STRENG)), { x: 118, y: -3 }, [RedEvtType.GEN_STAR, RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN], 2, { generalId: this.m_generalId });
                RedPointModel.AddInfoListener(this.m_comTabTopGroup.getTabBtnByName(GCode(CLEnum.GEN_SKILL)), { x: 118, y: -3 }, [RedEvtType.GEN_SKILL], 2, { generalId: this.m_generalId });
                RedPointModel.AddInfoListener(this.m_comTabTopGroup.getTabBtnByName(GCode(CLEnum.GEN_TREA)), { x: 118, y: -3 }, [RedEvtType.GEN_TREA_EQ], 2, { generalId: this.m_generalId });
            }
            RedPointModel.AddInfoListener(this.m_genCard.image_fate, { x: 45, y: 3, scale: 0.78 }, [RedEvtType.GEN_FATE], 2, { generalId: this.m_generalId });
        };
        /**宝物 */
        GeneralInfoWnd.prototype.refreshTreasureInfo = function () {
            //刷新属性部分
            this.m_tabAttri.refreshView();
            this.m_tabTrea.refreshView();
            this.m_genCard.refreshTreasureAction();
            this.m_genCard.refreshInfo(true); //刷新战力
        };
        /**刷新升星成功 */
        GeneralInfoWnd.prototype.refreshStarInfo = function () {
            //刷新属性部分
            this.m_tabAttri.refreshView();
            //刷新升星模块
            this.m_tabStreng.refreshView();
            this.m_genCard.refreshUpStarAction();
            //刷新战力
            this.m_genCard.refreshInfo(true);
            Utils.open_view(TASK_UI.POP_GENERAL_UPSTAR_VIEWII, this.m_generalId);
        };
        /**刷新技能升级成功 */
        GeneralInfoWnd.prototype.refreshSkillInfo = function () {
            //刷新技能模块
            this.m_tabSkill.refreshView();
            this.m_genCard.refreshInfo(true);
        };
        /**刷新升级成功 */
        GeneralInfoWnd.prototype.refreshLevelInfo = function () {
            //刷新属性部分
            this.m_tabAttri.refreshView();
            //刷新升星模块
            this.m_tabStreng.refreshView();
            //刷新战力
            this.m_genCard.refreshInfo(true);
            GeneralModel.checkCanAtion(this.m_generalId);
        };
        /**刷新突破成功 */
        GeneralInfoWnd.prototype.refreshTuPoInfo = function () {
            //刷新属性部分
            this.m_tabAttri.refreshView();
            //刷新升星模块
            this.m_tabStreng.refreshView();
            this.m_genCard.refreshTuPoAction();
            //刷新战力
            this.m_genCard.refreshInfo(true);
            Utils.open_view(TASK_UI.POP_GENERAL_TUPO_VIEW, this.m_generalId);
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        /////////////////////////////////////////////////////////////////自定义事件 继承VIEW自带事件监听
        GeneralInfoWnd.prototype.listNotificationInterests = function () {
            return [TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT];
        };
        GeneralInfoWnd.prototype.handleNotification = function (notification) {
            var body = notification.getBody();
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT: {
                    this.refreshLevelInfoByClient(body.clientUplvMsg);
                    break;
                }
            }
        };
        /**刷新客户端升级成功 */
        GeneralInfoWnd.prototype.refreshLevelInfoByClient = function (state) {
            this.m_tabStreng.refreshLevelView();
            if (state == 1) {
                this.m_genCard.refreshUpLevelAction();
            }
        };
        GeneralInfoWnd.prototype.addEvent = function () {
            this.m_comTabTopGroup.setChangeCallback(this.changeContentTag, this);
            com_main.EventManager.addTouchScaleListener(this.btn_left, this, this.onclickButtonLeft);
            com_main.EventManager.addTouchScaleListener(this.btn_right, this, this.onclickButtonRight);
        };
        GeneralInfoWnd.prototype.removeEvent = function () {
        };
        /**切卡 */
        GeneralInfoWnd.prototype.changeContentTag = function (index) {
            if (index >= this.m_comTabTopGroup.dataNum)
                index = 0;
            this.m_comTabTopGroup.selectedIndex = index;
            var info = this.m_tTagInfo[this.m_comTabTopGroup.selName];
            this.m_tabViewStack.selectedIndex = info.viewId;
            this.refreshCurTab();
            this.onGuideConditionTab(info.guideId);
        };
        /**切换操作限时 */
        GeneralInfoWnd.prototype.checkTabTime = function () {
            var time = TimerUtils.getServerTime();
            if (time - this.m_nTabOldTime < 1) {
                EffectUtils.showTips(GCode(CLEnum.ACTION_FAST), 1, true);
                return false;
            }
            this.m_nTabOldTime = time;
            return true;
        };
        GeneralInfoWnd.prototype.onclickButtonLeft = function () {
            if (!this.checkTabTime())
                return;
            var index = this.sliderIndex - 1;
            if (index < 0) {
                index = this.sliderList.length - 1;
            }
            this.setCurSoliderIndex(index);
        };
        GeneralInfoWnd.prototype.onclickButtonRight = function () {
            if (!this.checkTabTime())
                return;
            var index = this.sliderIndex + 1;
            if (index > this.sliderList.length - 1) {
                index = 0;
            }
            this.setCurSoliderIndex(index);
        };
        GeneralInfoWnd.prototype.setCurSoliderIndex = function (index) {
            if (this.sliderIndex == index)
                return;
            this.sliderIndex = index;
            this.m_generalId = this.sliderList[index];
            this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            this.refreshInfo();
            this.refreshTabBtns();
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**检查新手引导面板条件 */
        GeneralInfoWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_INFO_WND);
        };
        /**检查新手引导面板条件 */
        GeneralInfoWnd.prototype.onGuideConditionTab = function (id) {
            if (id <= 0)
                return;
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        };
        GeneralInfoWnd.NAME = "GeneralInfoWnd";
        return GeneralInfoWnd;
    }(com_main.CView));
    com_main.GeneralInfoWnd = GeneralInfoWnd;
})(com_main || (com_main = {}));

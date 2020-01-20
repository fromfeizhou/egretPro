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
     * 活动相关
     */
    var RepeatActivityWnd = /** @class */ (function (_super_1) {
        __extends(RepeatActivityWnd, _super_1);
        function RepeatActivityWnd(pageType) {
            var _this = _super_1.call(this) || this;
            _this.m_pViews = [];
            _this.name = RepeatActivityWnd.NAME;
            _this.m_nCurWelfareType = pageType || AcViewType.NOR_SEVEN;
            _this.initApp("pay/recharge/RechargeWndSkin.exml");
            return _this;
        }
        RepeatActivityWnd.prototype.onDestroy = function () {
            this.m_pViews = null;
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        };
        RepeatActivityWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_DAY_TITLE));
            this.validateNow();
            this.addSignView();
            this.addRepeatView();
            this.addPowerView();
            this.addLevelView();
            this.addCountryView();
            this.addLegionView();
            this.addArenaView();
            //强制渲染一次 获取宽高
            // this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            for (var i = 0; i < this.m_pViews.length; i++) {
                this.m_pViews[i].setViewSize(width, height);
            }
            var index = 0;
            for (var i = 0; i < this.m_pViews.length; i++) {
                var view = this.m_pViews[i];
                if (view.activityType == this.m_nCurWelfareType) {
                    index = i;
                    break;
                }
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);
        };
        /**切换当前卡 */
        RepeatActivityWnd.prototype.changeTag = function (index) {
            this.m_nCurWelfareType = this.m_pViews[index].activityType;
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        };
        /**添加签到*/
        RepeatActivityWnd.prototype.addSignView = function () {
            var type = AcViewType.SIGN_MONTH_DAY;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_SIGN_UP) });
            var signUp = new com_main.WelfareSignUp(type);
            this.m_tabViewStack.addChild(signUp);
            this.m_pViews.push(signUp);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_SIGN_UP)), { x: 132, y: -5 }, [RedEvtType.SIGN_MONTH_DAY], 2);
        };
        /**构建七日循环的基础数据 */
        RepeatActivityWnd.prototype.addRepeatView = function () {
            var activiVo = ActivityModel.getActivityVo(AcViewType.NOR_SEVEN);
            if (!activiVo)
                return;
            for (var key in activiVo.taskInfoDic) {
                var vo = activiVo.taskInfoDic[key];
                this.m_comTabGroup.addTabBtnData({ name: vo.cfg.title });
                var view = new com_main.RepeatActivityView(AcViewType.NOR_SEVEN, vo.taskId);
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(vo.cfg.title), { x: 132, y: -5 }, [RedEvtType.NOR_OPEN_SEVEN], 2, { dayTaskId: vo.taskId });
                this.m_tabViewStack.addChild(view);
                this.m_pViews.push(view);
            }
        };
        /**添加战力冲榜*/
        RepeatActivityWnd.prototype.addPowerView = function () {
            var type = AcViewType.FIGHT_RANKING_AWARD;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_POWER) });
            var rankPower = new com_main.RankActView(type);
            this.m_tabViewStack.addChild(rankPower);
            this.m_pViews.push(rankPower);
        };
        /**添加等级冲榜*/
        RepeatActivityWnd.prototype.addLevelView = function () {
            var type = AcViewType.LEVEL_RANKING_AWARD;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_LEVEL) });
            var rankLevel = new com_main.RankActView(type);
            this.m_tabViewStack.addChild(rankLevel);
            this.m_pViews.push(rankLevel);
        };
        /**添加国家城池冲榜*/
        RepeatActivityWnd.prototype.addCountryView = function () {
            var type = AcViewType.COUNTRY_CITYS_RANKING;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_CITY) });
            var rankCountry = new com_main.RankActView(type);
            this.m_tabViewStack.addChild(rankCountry);
            this.m_pViews.push(rankCountry);
        };
        /**添加联盟战力冲榜*/
        RepeatActivityWnd.prototype.addLegionView = function () {
            var type = AcViewType.GUILD_FORCE_RANKING;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_LM) });
            var rankLegion = new com_main.RankActView(type);
            this.m_tabViewStack.addChild(rankLegion);
            this.m_pViews.push(rankLegion);
        };
        /**添加竞技场战力冲榜*/
        RepeatActivityWnd.prototype.addArenaView = function () {
            var type = AcViewType.APK_RANKING;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.ARENA_RANK) });
            var rankArena = new com_main.RankActView(type);
            this.m_tabViewStack.addChild(rankArena);
            this.m_pViews.push(rankArena);
        };
        RepeatActivityWnd.NAME = 'RepeatActivityWnd';
        return RepeatActivityWnd;
    }(com_main.CView));
    com_main.RepeatActivityWnd = RepeatActivityWnd;
})(com_main || (com_main = {}));

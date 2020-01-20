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
     * 1.预告UI Advance
     */
    var EmperorBattleAdvanceView = /** @class */ (function (_super_1) {
        __extends(EmperorBattleAdvanceView, _super_1);
        function EmperorBattleAdvanceView() {
            var _this = _super_1.call(this) || this;
            _this.name = EmperorBattleAdvanceView.NAME;
            _this.initApp("activity/emperorBattle/EmperorBattleAdvanceSkin.exml");
            return _this;
        }
        EmperorBattleAdvanceView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_XIANGYANG_EMPROR_COUNTRY_REWARD,
                ProtoDef.S2C_COUNTRY_EMPEROR_INFO
            ];
        };
        EmperorBattleAdvanceView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_EMPROR_COUNTRY_REWARD: {
                    var data = body;
                    if (data)
                        this.refreshGetItem(data.message);
                    break;
                }
                case ProtoDef.S2C_COUNTRY_EMPEROR_INFO: {
                    CountryModel.setCountryEmperorInfo(body);
                    this.refreshBtnGet();
                    this.refreshEmperor();
                    break;
                }
            }
        };
        EmperorBattleAdvanceView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.updateTime, this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.XIANGYANG_ADVANCE_VIEW]);
        };
        EmperorBattleAdvanceView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnInfo, this, this.onclickInfo);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onclickGet);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnJoin, this, this.onclickJoin);
            com_main.EventManager.addTouchScaleListener(this.m_btnEmp, this, this.onclickEmp);
        };
        EmperorBattleAdvanceView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        EmperorBattleAdvanceView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.XIANGYANG_TITLE));
            this.addEvent();
            this.m_empVo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            // this.m_labDes.text = GCode(CLEnum.AC_KING_PT/*襄阳战开始后，第一队世界编队将自动参战*/);
            this.m_labDes.visible = false;
            this.m_labPrivilege.text = (GCode(CLEnum.XIANGYANG_PRIVILEGE));
            this.m_labPrivilegeContent.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_PRIVILEGE_DES));
            this.m_labEffect.text = (GCode(CLEnum.XIANGYANG_EFFECT));
            this.m_labEffectContent.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_EFFECT_DES));
            this.m_labEffectNum.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_EFFECT_NUM));
            // 城池发光
            Utils.isGlow(true, this.m_imgXy, 0XEECE79, 0.8);
            this.refreshBtnJoin();
            this.refreshBtnGet();
            this.refreshEmperor();
            this.showItem();
            this.refreshTime();
        };
        EmperorBattleAdvanceView.prototype.refreshTime = function () {
            if (!this.m_empVo || TimerUtils.getServerTimeMill() > this.m_empVo.closeDate) {
                // SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
                this.m_labTime.text = "襄阳战停战期";
                AcBattleProxy.C2S_XIANGYANG_INFO();
                CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
                return;
            }
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            this.updateTime();
        };
        /**刷新倒计时 */
        EmperorBattleAdvanceView.prototype.updateTime = function () {
            if (TimerUtils.getServerTimeMill() > this.m_empVo.closeDate) {
                Utils.TimerManager.remove(this.updateTime, this);
                // SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
                this.m_labTime.text = "襄阳战停战期";
                AcBattleProxy.C2S_XIANGYANG_INFO();
                CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
                return;
            }
            var time = Math.floor((this.m_empVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
            if (time <= 0) {
                // let stopTime = Math.floor((this.m_empVo.closeDate - TimerUtils.getServerTimeMill()) / 1000);
                // this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_FIGHT_TIME, Utils.DateUtils.getFormatBySecond(stopTime, 4)));
                EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_TASK, CLEnum.XIANGYANG_TITLE));
                com_main.UpManager.history();
                return;
            }
            this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_FIGHT_TIME, Utils.DateUtils.getFormatBySecond(time, 4)));
        };
        //点击规则说明
        EmperorBattleAdvanceView.prototype.onclickInfo = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.XIANGYANG_DES), title: GCode(CLEnum.XIANGYANG_TITLE) });
        };
        //点击领取按钮
        EmperorBattleAdvanceView.prototype.onclickGet = function (e) {
            if (this.m_empVo.m_data.emperorCountryReard) {
                AcBattleProxy.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD();
            }
            else {
                error("MissionView: data is null!");
            }
        };
        //点击报名按钮
        EmperorBattleAdvanceView.prototype.onclickJoin = function (e) {
            var minJoinLevel = ConstUtil.getValue(IConstEnum.XIANGYANG_LEVEL_LIMIT);
            if (RoleData.level < minJoinLevel) {
                EffectUtils.showTips(GCodeFromat(CLEnum.XIANGYANG_JOIN_LEVEL, minJoinLevel));
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.XIANGYANG_JOIN));
                if (!this.m_empVo.isJoin) {
                    this.m_empVo.isJoin = true;
                    this.refreshBtnJoin();
                }
            }
        };
        //点击称帝特权详情
        EmperorBattleAdvanceView.prototype.onclickEmp = function (e) {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.XIANGYANG_PRIVILEGE_TXT), title: GCode(CLEnum.XIANGYANG_PRIVILEGE) });
        };
        /**显示奖励 */
        EmperorBattleAdvanceView.prototype.showItem = function () {
            var militoryAwardCfg = C.XiangyangEveryDayRewardConfig[1];
            var reward = militoryAwardCfg.reward;
            var rewardList = Utils.parseCommonItemJson(reward);
            this.m_awardList.removeChildren();
            for (var i = 0; i < rewardList.length; i++) {
                var itemView = com_main.ComItemNew.create("name_num");
                itemView.scaleX = itemView.scaleY = 0.8;
                itemView.setItemInfo(rewardList[i].itemId, rewardList[i].count);
                this.m_awardList.addChild(itemView);
            }
        };
        EmperorBattleAdvanceView.prototype.refreshGetItem = function (message) {
            com_main.GetRewardView.getInstance().show(message);
            this.m_empVo.m_data.emperorCountryReard = false;
            this.refreshBtnGet();
        };
        EmperorBattleAdvanceView.prototype.refreshBtnJoin = function () {
            Utils.isGray(this.m_empVo.isJoin, this.m_pBtnJoin);
            this.m_pBtnJoin.setTitleLabel(this.m_empVo.isJoin ? GCode(CLEnum.JOIN_DONE) : GCode(CLEnum.JOIN));
            this.m_pBtnJoin.enabled = !this.m_empVo.isJoin;
        };
        EmperorBattleAdvanceView.prototype.refreshBtnGet = function () {
            // 数值显示
            var ecrState = isNull(this.m_empVo.m_data) ? false : this.m_empVo.m_data.emperorCountryReard;
            // 是不是皇帝国家成员
            var info = CountryModel.getCountryEmperorInfo();
            var btnGetLabel = GCode(CLEnum.TAKE_OUT);
            if (Object.keys(info).length == 0) {
                btnGetLabel = GCode(CLEnum.TAKE_OUT);
            }
            else {
                if (info.country === RoleData.countryId) {
                    btnGetLabel = ecrState ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.TAKE_OUT_END);
                    this.m_pBtnGet.enabled = ecrState;
                }
                else {
                    btnGetLabel = GCode(CLEnum.TAKE_OUT);
                }
            }
            Utils.isGray(!ecrState, this.m_pBtnGet);
            this.m_pBtnGet.setTitleLabel(btnGetLabel);
            this.m_pBtnGet.enabled = ecrState;
        };
        /**显示上一届皇帝 */
        EmperorBattleAdvanceView.prototype.refreshEmperor = function () {
            var info = CountryModel.getCountryEmperorInfo();
            if (Object.keys(info).length == 0) {
                this.m_imgCountry.visible = false;
                this.m_imgCountry.source = "common_country1_" + CountryType.NONE + "_png";
                this.m_labEmp.textFlow = Utils.htmlParser(GCode(CLEnum.XIANGYANG_CITY));
            }
            else {
                this.m_imgCountry.visible = true;
                this.m_imgCountry.source = "common_country1_" + info.country + "_png";
                this.m_labEmp.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_EMPEROR_NAME, info.nickName));
            }
        };
        EmperorBattleAdvanceView.NAME = 'EmperorBattleAdvanceView';
        return EmperorBattleAdvanceView;
    }(com_main.CView));
    com_main.EmperorBattleAdvanceView = EmperorBattleAdvanceView;
})(com_main || (com_main = {}));

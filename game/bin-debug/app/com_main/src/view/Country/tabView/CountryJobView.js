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
    var CountryJobView = /** @class */ (function (_super_1) {
        __extends(CountryJobView, _super_1);
        function CountryJobView() {
            var _this = _super_1.call(this) || this;
            _this.name = CountryJobView.NAME;
            _this.dynamicSkinName = Utils.getAppSkin("Country/tabView/CountryJobViewSkin.exml");
            return _this;
        }
        CountryJobView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CountryJobView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.countdown, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_JOB_APPLY_UP, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_INFO, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_SALARY, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_START_IMPEACH, this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_VOTE_IMPEACH, this);
        };
        CountryJobView.prototype.onShow = function () {
            this.InitItems();
            this.initAwardBtn();
            this.addEvent();
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.InitItems();
        //     // this.initTanhe();
        //     this.initAwardBtn();
        //     this.addEvent();
        // }
        CountryJobView.prototype.initAwardBtn = function () {
            if (CountryModel.canAward()) {
                this.btn_jrfl.visible = true;
            }
            else {
                this.btn_jrfl.visible = false;
            }
        };
        CountryJobView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.btn_bzsm, this, this.onclickButtonBzsm);
            com_main.EventManager.addTouchScaleListener(this.btn_jrfl, this, this.onclickButtonJrfl);
            com_main.EventManager.addTouchScaleListener(this.m_btnTanhe, this, this.onclickButtonTanhe);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_JOB_APPLY_UP, this.jobApplyUp, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_INFO, this.countryInfo, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_SALARY, this.countrySalary, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_START_IMPEACH, this.startImpeach, this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_VOTE_IMPEACH, this.voteImpeach, this);
        };
        CountryJobView.prototype.InitItems = function () {
            var _this = this;
            this.m_Items = [];
            var _loop_1 = function (key) {
                var element = C.JobConfig[key];
                var item = this_1["m_Item" + element.sort];
                var jobId = element.id;
                this_1.m_Items.push(item);
                item.Init(jobId);
                com_main.EventManager.addTouchScaleListener(item, this_1, function () { return _this.OnClickItem(jobId); });
            };
            var this_1 = this;
            for (var key in C.JobConfig) {
                _loop_1(key);
            }
        };
        CountryJobView.prototype.Refresh = function () {
            this.m_Items.forEach(function (element) {
                element.Refresh();
            });
        };
        CountryJobView.prototype.initTanhe = function (body) {
            // let day3 = 1;
            var day3 = 259200;
            var day1 = 86400;
            this.m_tanheGroup.visible = false;
            if (TimerUtils.getServerTime() - body.impeachStamp > day1) {
                body.impeachStarterName = "";
                body.impeachStarter = 0;
                body.impeachVote = [];
                body.impeachStamp = 0;
                this.m_impeachEndStamp = null;
            }
            var jobInfo = CountryModel.JobInfos[1]; //是否有君王
            if (!jobInfo) {
                this.m_tanheGroup.visible = false;
                return;
            }
            this.m_btnTanhe.setTitleLabel(GCode(CLEnum.STATE_DH));
            //离线大于三天 或者有人发起弹劾
            if (TimerUtils.getServerTime() - body.kingLastLogin > day3 && //离线三天 
                !body.impeachStarter && //没有人发起弹劾
                CountryModel.Self_PlayerInfo.jobId != 1 && //不是皇帝 并且 官员才能弹劾
                CountryModel.Self_PlayerInfo.jobId > 0) {
                this.m_tanheGroup.visible = true;
                this.m_tanheBg.visible = false;
            }
            else if (body.impeachStarter) {
                this.m_impeachEndStamp = body.impeachStamp + day1;
                this.m_tanheGroup.visible = true;
                var needNum = ConstUtil.getValue(IConstEnum.IMPEACH_NEED_NUM); //Math.ceil((CountryModel.m_jobNumber - 2) /2); 
                this.m_lbTanhe.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.STATE_GZ_TAN_HE, body.impeachStarterName, body.impeachVote.length, needNum));
                this.m_lbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.STATE_GZ_TIME, Utils.DateUtils.getFormatBySecond(this.m_impeachEndStamp - TimerUtils.getServerTime(), 1)));
                Utils.TimerManager.doTimer(1000, 100000, this.countdown, this);
                //不是官员  皇帝 弹劾人 投票人 都显示时间，不显示按钮
                if (CountryModel.Self_PlayerInfo.jobId == 0 || CountryModel.Self_PlayerInfo.jobId == 1
                    || RoleData.playerId == body.impeachStarter || body.impeachVote.indexOf(RoleData.playerId) > -1) {
                    this.m_btnTanhe.visible = false;
                    this.m_tanheBg.visible = true;
                }
            }
        };
        CountryJobView.prototype.countdown = function () {
            this.m_lbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.STATE_GZ_TIME, Utils.DateUtils.getFormatBySecond(this.m_impeachEndStamp - TimerUtils.getServerTime(), 1)));
        };
        CountryJobView.prototype.OnClickItem = function (jobId) {
            Utils.open_view(TASK_UI.COUNTRY_JOB_INFO, jobId);
        };
        CountryJobView.prototype.onclickButtonBzsm = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.STATE_BZWD), title: GCode(CLEnum.WOR_HELP_TITLE) });
        };
        CountryJobView.prototype.onclickButtonJrfl = function () {
            CountryProxy.C2S_COUNTRY_SALARY();
        };
        CountryJobView.prototype.onclickButtonTanhe = function () {
            if (!CountryModel.Self_PlayerInfo.jobId) {
                EffectUtils.showTips("官员才能弹劾");
                return;
            }
            if (this.m_impeachEndStamp) {
                CountryProxy.C2S_COUNTRY_VOTE_IMPEACH();
            }
            else {
                CountryProxy.C2S_COUNTRY_START_IMPEACH();
            }
        };
        CountryJobView.prototype.jobApplyUp = function (data) {
            this.Refresh();
        };
        CountryJobView.prototype.countryInfo = function (data) {
            this.initTanhe(data);
            this.InitItems();
        };
        CountryJobView.prototype.countrySalary = function (data) {
            if (data.errorCode == 0) {
                CountryModel.selfSalaryStamp = TimerUtils.getServerTime();
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
            }
            this.initAwardBtn();
            com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_SALARY_UPDATE, null);
        };
        CountryJobView.prototype.startImpeach = function (data) {
            if (data.errorCode == 0) {
                CountryProxy.send_COUNTRY_INFO();
            }
        };
        CountryJobView.prototype.voteImpeach = function (data) {
            if (data.errorCode == 0) {
                CountryProxy.send_COUNTRY_INFO();
            }
        };
        CountryJobView.NAME = 'CountryJobView';
        return CountryJobView;
    }(com_main.DynamicComponent));
    com_main.CountryJobView = CountryJobView;
})(com_main || (com_main = {}));

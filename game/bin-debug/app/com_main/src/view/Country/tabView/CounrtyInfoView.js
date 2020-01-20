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
    var CountryInfoView = /** @class */ (function (_super_1) {
        __extends(CountryInfoView, _super_1);
        function CountryInfoView() {
            var _this = _super_1.call(this) || this;
            _this.name = CountryInfoView.NAME;
            return _this;
            // this.skinName = this.skinName = Utils.getAppSkin("Country/tabView/CountryInfoViewSkin.exml");
        }
        Object.defineProperty(CountryInfoView.prototype, "visible", {
            set: function (boo) {
                if (boo && (this.skinName == '' || isNull(this.skinName))) {
                    this.skinName = Utils.getAppSkin("Country/tabView/CountryInfoViewSkin.exml");
                    this.refreshAll();
                }
                if (boo != this.visible) {
                    this.$setVisible(boo);
                }
            },
            enumerable: true,
            configurable: true
        });
        CountryInfoView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CountryInfoView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        CountryInfoView.prototype.refreshAll = function () {
            this.InitView();
            this.Refresh();
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.InitView();
        //     this.Refresh();
        // }
        CountryInfoView.prototype.InitView = function () {
            this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            this.m_BtnCancel.setTitleLabel(GCode(CLEnum.CANCEL));
            this.m_APopUp.setTitleLabel(GCode(CLEnum.STATE_TITLE_NOT));
            this.m_APopUp.getCloseBtn().visible = false;
            com_main.EventManager.addTouchScaleListener(this.m_BtnEdit, this, this.OnClickEdit);
            com_main.EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.OnClickConfirm);
            com_main.EventManager.addTouchScaleListener(this.m_BtnCancel, this, this.OnClickCancel);
        };
        CountryInfoView.prototype.OnClickEdit = function () {
            this.SetEditModel(true);
        };
        CountryInfoView.prototype.OnClickConfirm = function () {
            this.SetEditModel(false);
            CountryProxy.send_COUNTRY_NOTICE(this.m_Notice.text);
        };
        CountryInfoView.prototype.OnClickCancel = function () {
            this.SetEditModel(false);
        };
        CountryInfoView.prototype.SetEditModel = function (model) {
            this.m_Notice.touchEnabled = model;
            this.m_BtnConfirm.visible = model;
            this.m_BtnCancel.visible = model;
            this.m_BtnEdit.visible = !model;
        };
        CountryInfoView.prototype.Refresh = function () {
            this.Refresh_Notice();
            this.Refresh_RoleHead();
            this.Refresh_JobName();
            this.Refresh_PlayerName();
            this.Refresh_CountryFlag();
        };
        CountryInfoView.prototype.Refresh_Notice = function () {
            var jobCfg = C.JobConfig[CountryModel.Self_PlayerInfo.jobId];
            this.m_BtnEdit.visible = jobCfg != null && C.JobInfoConfig[jobCfg.effect].editbulletin == 1;
            this.m_Notice.text = Utils.isNullOrEmpty(CountryModel.Notice) ? GCode(CLEnum.STATE_NOTICE) : CountryModel.Notice;
        };
        CountryInfoView.prototype.Refresh_RoleHead = function () {
            var head = 0;
            if (CountryModel.King_PlayerInfo && CountryModel.King_PlayerInfo.playerId > 0) {
                head = CountryModel.King_PlayerInfo.roleHead;
                // head = RoleData.headId;
            }
            this.m_PlayerJob.SetHead(head);
        };
        CountryInfoView.prototype.Refresh_JobName = function () {
            var jobId = 1;
            this.m_PlayerJob.SetJobName(jobId);
        };
        CountryInfoView.prototype.Refresh_PlayerName = function () {
            var kingPlayerName = GCode(CLEnum.STATE_GZ_EMPTY);
            if (CountryModel.King_PlayerInfo && CountryModel.King_PlayerInfo.playerId > 0) {
                kingPlayerName = CountryModel.King_PlayerInfo.name;
            }
            this.m_PlayerJob.SetPlayerName(kingPlayerName);
        };
        CountryInfoView.prototype.Refresh_CountryFlag = function () {
            this.m_comState.stateId = RoleData.countryId;
        };
        CountryInfoView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.COUNTRY_EDITOR_NOTICE,
                ProtoDef.COUNTRY_JOB_APPLY_UP,
            ];
        };
        CountryInfoView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.COUNTRY_EDITOR_NOTICE: {
                    this.Refresh_Notice();
                    break;
                }
                case ProtoDef.COUNTRY_JOB_APPLY_UP: {
                    this.Refresh();
                    break;
                }
            }
        };
        CountryInfoView.NAME = 'CountryInfoView';
        return CountryInfoView;
    }(com_main.CView));
    com_main.CountryInfoView = CountryInfoView;
})(com_main || (com_main = {}));

module com_main {
    export class CountryInfoView extends CView {
        public static NAME = 'CountryInfoView';

        public m_APopUp: com_main.APopUp;
        public m_BtnEdit: eui.Group;
        public m_Notice: eui.EditableText;
        public m_BtnConfirm: com_main.ComButton;
        public m_BtnCancel: com_main.ComButton;
        public m_comState: com_main.ComState;
        public m_PlayerJob: com_main.CountryPlayerJob;

        public constructor() {
            super();
            this.name = CountryInfoView.NAME;
            // this.skinName = this.skinName = Utils.getAppSkin("Country/tabView/CountryInfoViewSkin.exml");
        }

        public set visible(boo: boolean) {
			if (boo && (this.skinName == '' || isNull(this.skinName))) {
				this.skinName = Utils.getAppSkin("Country/tabView/CountryInfoViewSkin.exml");
				this.refreshAll();
			}
			if (boo != this.visible) {
				this.$setVisible(boo);
			}
		}

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        private refreshAll(){
            this.InitView();
            this.Refresh();
        }

        // protected childrenCreated(): void {
        //     super.childrenCreated();

        //     this.InitView();
        //     this.Refresh();
        // }

        private InitView(): void {
            this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            this.m_BtnCancel.setTitleLabel(GCode(CLEnum.CANCEL));

            this.m_APopUp.setTitleLabel(GCode(CLEnum.STATE_TITLE_NOT));
            this.m_APopUp.getCloseBtn().visible = false;
            EventManager.addTouchScaleListener(this.m_BtnEdit, this, this.OnClickEdit);
            EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.OnClickConfirm);
            EventManager.addTouchScaleListener(this.m_BtnCancel, this, this.OnClickCancel);
        }

        private OnClickEdit() {
            this.SetEditModel(true);
        }

        private OnClickConfirm(): void {
            this.SetEditModel(false);
            CountryProxy.send_COUNTRY_NOTICE(this.m_Notice.text);
        }
        private OnClickCancel(): void {
            this.SetEditModel(false);
        }

        private SetEditModel(model: boolean): void {
            this.m_Notice.touchEnabled = model;
            this.m_BtnConfirm.visible = model;
            this.m_BtnCancel.visible = model;
            this.m_BtnEdit.visible = !model;
        }

        public Refresh() {
            this.Refresh_Notice();
            this.Refresh_RoleHead();
            this.Refresh_JobName();
            this.Refresh_PlayerName();
            this.Refresh_CountryFlag();
        }

        public Refresh_Notice(): void {
            let jobCfg = C.JobConfig[CountryModel.Self_PlayerInfo.jobId];
            this.m_BtnEdit.visible = jobCfg != null && C.JobInfoConfig[jobCfg.effect].editbulletin == 1;
            this.m_Notice.text = Utils.isNullOrEmpty(CountryModel.Notice) ? GCode(CLEnum.STATE_NOTICE) : CountryModel.Notice;
        }

        private Refresh_RoleHead(): void {
            let head: number = 0;

            if (CountryModel.King_PlayerInfo && CountryModel.King_PlayerInfo.playerId > 0) {
                head = CountryModel.King_PlayerInfo.roleHead;
                // head = RoleData.headId;
            }
            this.m_PlayerJob.SetHead(head);
        }

        private Refresh_JobName(): void {
            let jobId: number = 1;
            this.m_PlayerJob.SetJobName(jobId);
        }

        private Refresh_PlayerName(): void {
            let kingPlayerName: string = GCode(CLEnum.STATE_GZ_EMPTY);
            if (CountryModel.King_PlayerInfo && CountryModel.King_PlayerInfo.playerId > 0) {
                kingPlayerName = CountryModel.King_PlayerInfo.name;
            }
            this.m_PlayerJob.SetPlayerName(kingPlayerName);
        }

        private Refresh_CountryFlag(): void {
            this.m_comState.stateId = RoleData.countryId;
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.COUNTRY_EDITOR_NOTICE,
                ProtoDef.COUNTRY_JOB_APPLY_UP,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
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
        }
    }
}
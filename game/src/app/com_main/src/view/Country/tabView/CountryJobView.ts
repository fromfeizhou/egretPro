module com_main {
    export class CountryJobView extends DynamicComponent {
        public static NAME = 'CountryJobView';

        public m_Item0:com_main.CountryJobCell;
        public m_Item1:com_main.CountryJobCell;
        public m_Item2:com_main.CountryJobCell;
        public m_Item3:com_main.CountryJobCell;
        public m_Item4:com_main.CountryJobCell;
        public m_Item5:com_main.CountryJobCell;
        public m_Item6:com_main.CountryJobCell;
        public m_Item7:com_main.CountryJobCell;
        public m_Item8:com_main.CountryJobCell;
        public m_Item9:com_main.CountryJobCell;
        public m_Item10:com_main.CountryJobCell;
        public m_Item11:com_main.CountryJobCell;
        public m_Item12:com_main.CountryJobCell;
        public m_Item13:com_main.CountryJobCell;
        public m_Item14:com_main.CountryJobCell;
        public m_tanheGroup:eui.Group;
        public m_tanheBg:eui.Group;
        public m_lbTanhe:eui.Label;
        public m_lbTime:eui.Label;
        public m_btnTanhe:com_main.ComButton;
        public btn_bzsm:eui.Group;
        public btn_jrfl:eui.Group;

        private m_Items: CountryJobCell[];

        public constructor() {
            super();
            this.name = CountryJobView.NAME;
            this.dynamicSkinName = Utils.getAppSkin("Country/tabView/CountryJobViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.countdown, this);

            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_JOB_APPLY_UP,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_INFO,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_SALARY,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_START_IMPEACH,this);
            com_main.EventMgr.removeEventByObject(CountryEvent.COUNTRY_VOTE_IMPEACH,this);
        }

        protected onShow(){
            this.InitItems();
            this.initAwardBtn();
            this.addEvent();
        }

        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.InitItems();
        //     // this.initTanhe();
        //     this.initAwardBtn();
        //     this.addEvent();
        // }

        public initAwardBtn(){
            if(CountryModel.canAward()){
                this.btn_jrfl.visible = true;
            }else{
                this.btn_jrfl.visible = false;
            }
        }

        private addEvent(){
            EventManager.addTouchScaleListener(this.btn_bzsm, this, this.onclickButtonBzsm);
            EventManager.addTouchScaleListener(this.btn_jrfl, this, this.onclickButtonJrfl);
            EventManager.addTouchScaleListener(this.m_btnTanhe, this, this.onclickButtonTanhe);

            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_JOB_APPLY_UP,this.jobApplyUp,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_INFO,this.countryInfo,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_SALARY,this.countrySalary,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_START_IMPEACH,this.startImpeach,this);
            com_main.EventMgr.addEvent(CountryEvent.COUNTRY_VOTE_IMPEACH,this.voteImpeach,this);
        }

        private InitItems(): void {
            this.m_Items = [];
            for (let key in C.JobConfig) {
                let element = C.JobConfig[key];
                let item = this["m_Item" + element.sort] as CountryJobCell;
                let jobId = element.id;
                this.m_Items.push(item);
                item.Init(jobId);
                EventManager.addTouchScaleListener(item, this, () => this.OnClickItem(jobId));
            }
        }

        public Refresh(): void {
            this.m_Items.forEach(element => {
                element.Refresh();
            });
        }

        private m_impeachEndStamp: number; //弹劾倒计时结束时间
        public initTanhe(body:gameProto.CountryInfoResp){

            // let day3 = 1;
            let day3 = 259200;
            let day1 = 86400;

            this.m_tanheGroup.visible = false;
            if(TimerUtils.getServerTime() - body.impeachStamp > day1){
                body.impeachStarterName = "";
                body.impeachStarter = 0;
                body.impeachVote = [];
                body.impeachStamp = 0;
                this.m_impeachEndStamp = null;
            }
            let jobInfo = CountryModel.JobInfos[1];    //是否有君王
            if( !jobInfo ){
                this.m_tanheGroup.visible = false;
                return ;
            }
            this.m_btnTanhe.setTitleLabel(GCode(CLEnum.STATE_DH));

            
            //离线大于三天 或者有人发起弹劾
            if( TimerUtils.getServerTime() - body.kingLastLogin > day3 && //离线三天 
                !body.impeachStarter && //没有人发起弹劾
                CountryModel.Self_PlayerInfo.jobId != 1 && //不是皇帝 并且 官员才能弹劾
                CountryModel.Self_PlayerInfo.jobId > 0){ 
                this.m_tanheGroup.visible = true;
                this.m_tanheBg.visible = false;
            }else if( body.impeachStarter){
                this.m_impeachEndStamp = body.impeachStamp + day1;
                this.m_tanheGroup.visible = true;
                
                let needNum = ConstUtil.getValue(IConstEnum.IMPEACH_NEED_NUM); //Math.ceil((CountryModel.m_jobNumber - 2) /2); 
                
                this.m_lbTanhe.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.STATE_GZ_TAN_HE,body.impeachStarterName,body.impeachVote.length, needNum));
                this.m_lbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.STATE_GZ_TIME,Utils.DateUtils.getFormatBySecond(this.m_impeachEndStamp - TimerUtils.getServerTime() , 1)));
                Utils.TimerManager.doTimer(1000,100000,this.countdown,this)

                //不是官员  皇帝 弹劾人 投票人 都显示时间，不显示按钮
                if(CountryModel.Self_PlayerInfo.jobId == 0 || CountryModel.Self_PlayerInfo.jobId == 1
                    || RoleData.playerId == body.impeachStarter || body.impeachVote.indexOf(RoleData.playerId) > -1){
                    this.m_btnTanhe.visible = false;
                    this.m_tanheBg.visible = true;
                }
            }

            
        }

        public countdown(){
            this.m_lbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.STATE_GZ_TIME,Utils.DateUtils.getFormatBySecond(this.m_impeachEndStamp - TimerUtils.getServerTime() , 1)));
        }

        private OnClickItem(jobId: number): void {
            Utils.open_view(TASK_UI.COUNTRY_JOB_INFO, jobId);
        }

        public onclickButtonBzsm(){
            Utils.open_view(TASK_UI.COM_HELP_DOC, {content:GCode(CLEnum.STATE_BZWD),title:GCode(CLEnum.WOR_HELP_TITLE)});
        }

        public onclickButtonJrfl(){
            CountryProxy.C2S_COUNTRY_SALARY();
        }

        public onclickButtonTanhe(){

            if(!CountryModel.Self_PlayerInfo.jobId){
                EffectUtils.showTips("官员才能弹劾");
                return;
            }

            if(this.m_impeachEndStamp){
                CountryProxy.C2S_COUNTRY_VOTE_IMPEACH();
            }else{
                CountryProxy.C2S_COUNTRY_START_IMPEACH();
            }
        }

        private jobApplyUp(data){
            this.Refresh();
        }

        private countryInfo(data){
            this.initTanhe(data);
            this.InitItems();
        }

        private countrySalary(data){
            if(data.errorCode == 0){
                CountryModel.selfSalaryStamp = TimerUtils.getServerTime();
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
            }
            this.initAwardBtn();
            EventMgr.dispatchEvent(CountryEvent.COUNTRY_SALARY_UPDATE,null);
        }

        private startImpeach(data){
            if(data.errorCode == 0){
                CountryProxy.send_COUNTRY_INFO();
            }
        }

        private voteImpeach(data){
            if(data.errorCode == 0){
                CountryProxy.send_COUNTRY_INFO();
            }
        }
    }
}
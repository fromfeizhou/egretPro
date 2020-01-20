module com_main {
    /**
     * 新武将拜访
     */
    export class NewGeneralView extends CView {
        public static NAME = "NewGeneralView";

        public m_allGroup:eui.Group;
        public m_titleImg:eui.Image;
        public m_genImg:com_main.ComGenCard;
        public m_video:eui.Group;
        public m_playBtn:eui.Image;
        public m_panelGroup:eui.Group;
        public m_btn0:com_main.NewGenTab;
        public m_btn1:com_main.NewGenTab;
        public m_btn2:com_main.NewGenTab;
        public m_btnClose:eui.Image;
        public m_lbDowntime:eui.Label;

        //动态加载
        public panel0:com_main.NewGenVisPanel;
        public panel1:com_main.NewGenLimitBuyPanel;
        public panel2:com_main.NewGenDetailPanel;

        private video: egret.Video;
        public m_tabLogic: ComTabLogic;
        private m_vo: AcNewGenVisVo;           //活动数据

        public constructor() {
            super();
            this.name = NewGeneralView.NAME;
            this.initApp("activity/newGeneral/NewGeneralSkin.exml");
        }

        $onRemoveFromStage(isclear = false): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            this.panel0.onDestroy();
            this.panel1.onDestroy();
            this.panel2.onDestroy();

            this.m_tabLogic.onDestory();
            Utils.TimerManager.remove(this.updateDownTime, this);

            SceneResGroupCfg.clearModelRes([ModuleEnums.NEW_GEN_UI]);

            // if(this.video){
            //     this.video.
            // }
        }

        
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
            this.m_btn0.setTitleLabel(GCode(CLEnum.NEW_GEN_BF));
            this.m_btn1.setTitleLabel(GCode(CLEnum.NEW_GEN_XG));
            this.m_btn2.setTitleLabel(GCode(CLEnum.NEW_GEN_XQ));

            this.panel0 = new NewGenVisPanel();
            this.panel1 = new NewGenLimitBuyPanel();
            this.panel2 = new NewGenDetailPanel();

            this.m_panelGroup.addChild(this.panel0);
            this.m_panelGroup.addChild(this.panel1);
            this.m_panelGroup.addChild(this.panel2);

            this.m_tabLogic = new ComTabLogic();
            this.m_tabLogic.init([this.m_btn0,this.m_btn1,this.m_btn2],[this.panel0,this.panel1,this.panel2]);

            this.m_genImg.setInfo(this.m_vo.getNewGenRewordCfg().generalId,true,true)
            this.m_titleImg.source = this.m_vo.getNewGenRewordCfg().titleStr + '_png';

            this.initEvent();

            this.updateDownTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateDownTime, this);

            this.m_vo.setClick();

            if( isNull(this.m_vo.getNewGenRewordCfg().videoUrl) || this.m_vo.getNewGenRewordCfg().videoUrl == ''){
                this.m_video.visible = false;
                this.m_playBtn.visible = false;
            }
        }
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_btnClose, this, this.onCloseClick);
            EventManager.addTouchScaleListener(this.m_playBtn, this, this.onClickPlay);
            

            RedPointModel.AddInfoListener(this.m_btn0, { x: this.m_btn0.width - 10, y: 3 }, [RedEvtType.NEW_GEN_VIS], 3);
            RedPointModel.AddInfoListener(this.m_btn1, { x: this.m_btn1.width - 10, y: 3 }, [RedEvtType.NEW_GEN_LIMIT_BUY], 3);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

        public updateDownTime() {
            let activiVo = this.m_vo;
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate)
                return;
            let str = Utils.DateUtils.getActiveDownStr(activiVo.closeDate - curtime);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_lbDowntime.textFlow = Utils.htmlParser(`${timeStr} ${str}`);
        }
        
        protected onCloseClick(e: egret.TouchEvent) {
            UpManager.history();
        }

        private m_isLoadVied: boolean = false;
        private onClickPlay(){

            if(this.m_isLoadVied) return ;
            this.m_isLoadVied = true;

            this.video = new egret.Video();
            let url = this.m_vo.getNewGenRewordCfg().videoUrl;
            this.video.load( LoginConst.getResUrl(url, 'video'));
            this.video.width = 300;                 //设置视频宽
            this.video.height = 200;                //设置视频高
            this.video.x = 151;
            this.video.y = 472;
            this.video.fullscreen = false;

            //监听视频加载完成
            this.video.once(egret.Event.COMPLETE, this.onLoad, this);
            //监听视频加载失败
            this.video.once(egret.IOErrorEvent.IO_ERROR, this.onLoadErr, this);
            this.addChild(this.video);
        }

        private onLoad(e: egret.Event) {
            if(this.video){
                this.video.play(0,true);
                this.m_isLoadVied = false;
            }
        }

        private onLoadErr(e: egret.Event) {
            console.log("video load error happened");
        }
    }
}
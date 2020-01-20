module com_main {
    /**
     * 新7天活动
     */
    export class NewYearWnd extends CView {
        public static NAME = "NewYearWnd";

        public m_labTimeStr: eui.Label;
        public m_panelGroup: eui.Group;
        public m_btn0: com_main.SevenIITabBtn;
        public m_btn1: com_main.SevenIITabBtn;
        public m_btn2: com_main.SevenIITabBtn;
        public m_btn3: com_main.SevenIITabBtn;
        public m_btn4: com_main.SevenIITabBtn;
        public m_btnClose: eui.Image;
        public m_imgBg: eui.Image;

        public panel0: com_main.SevenIILoginPanel;
        public panel1: com_main.SevenIIChargePanel;
        public panel2: com_main.SevenIIChargePanel;
        public panel3: com_main.SevenIIShopPanel;
        public panel4: com_main.SevenIICornucopiaPanel;
        public m_tabLogic: ComTabLogic;

        private m_vo: AcLoginDayVo;           //活动数据
        public constructor() {
            super();
            this.name = NewYearWnd.NAME;
            this.initApp("activity/sevenII/SevenIIWndSkin.exml");
        }

        $onRemoveFromStage(isclear = false): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            this.panel0.onDestroy();
            this.panel1.onDestroy();
            this.panel2.onDestroy();
            this.panel3.onDestroy();
            this.panel4.onDestroy();

            super.onDestroy();
            this.removeEvent();
            this.m_tabLogic.onDestory();
            SceneResGroupCfg.clearModelRes([ModuleEnums.SEVENII_UI]);
        }


        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_imgBg.source = 'zyt_7t_dbj02_png';
            this.m_vo = ActivityModel.getActivityVo<AcLoginDayVo>(AcViewType.SIGN_CONTIN_DAY_3);

            this.panel0 = new SevenIILoginPanel(AcViewType.SIGN_CONTIN_DAY_3);
            this.panel1 = new SevenIIChargePanel();
            this.panel2 = new SevenIIChargePanel();
            this.panel3 = new SevenIIShopPanel(AcViewType.AC_SHOP_2);
            this.panel4 = new SevenIICornucopiaPanel(AcViewType.TREASEURE_BOWL_2);

            for (let i = 0; i <= 4; i++) {
                this.m_panelGroup.addChild(this['panel' + i]);
                this['panel' + i].x = 136;
                this['panel' + i].y = 108;
            }

            this.m_btn0.setTitleLabel('登录有礼');
            this.m_btn1.setTitleLabel('单充返利');
            this.m_btn2.setTitleLabel('累充好礼');
            this.m_btn3.setTitleLabel('特惠商城');
            this.m_btn4.setTitleLabel('开服抽奖');
            this.panel1.setType(AcViewType.RECHARGE_SINGLE_3);
            this.panel2.setType(AcViewType.RECHARGE_ADD_UP_5);
            this.m_tabLogic = new ComTabLogic();
            this.m_tabLogic.init([this.m_btn0, this.m_btn1, this.m_btn2, this.m_btn3, this.m_btn4], [this.panel0, this.panel1, this.panel2, this.panel3, this.panel4]);
            RedPointModel.AddInfoListener(this.m_btn0, { x: 70, y: -15 }, [RedEvtType.LOGIN_DAY_3], 2);
            RedPointModel.AddInfoListener(this.m_btn1, { x: 70, y: -15 }, [RedEvtType.RECHARD_SINGLE_3], 2);
            RedPointModel.AddInfoListener(this.m_btn2, { x: 70, y: -15 }, [RedEvtType.RECHARD_ADD_4], 2);
            RedPointModel.AddInfoListener(this.m_btn4, { x: 70, y: -15 }, [RedEvtType.TREASEURE_BOWL_2], 2);

            this.updateDownTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateDownTime, this);

            this.initEvent();
        }
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_btnClose, this, this.onCloseClick);
        }

        private removeEvent() {

            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateDownTime, this);
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

        protected onCloseClick(e: egret.TouchEvent) {
            UpManager.history();
        }

        public updateDownTime() {
            let activiVo = this.m_vo;
            if(!activiVo)return;
            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate)
                return;
            let str = Utils.DateUtils.getActiveDownStr(activiVo.closeDate - curtime);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labTimeStr.textFlow = Utils.htmlParser(`${timeStr} ${str}`);
        }
    }
}
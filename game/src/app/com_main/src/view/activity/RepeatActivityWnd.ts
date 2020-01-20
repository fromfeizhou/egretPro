
module com_main {
    export interface IRepeatActivityWnd {
        activityType: AcViewType;
        bInit: boolean;
        setViewSize(width: number, height: number): void;
        initView(): void;
        refreshView(): void;
    }
	/**
	 * 活动相关
	 */
    export class RepeatActivityWnd extends CView {
        public static NAME = 'RepeatActivityWnd';

        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;

        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_nWidth: number;    //切卡宽度
        private m_nHeight: number;   //切卡高度
        private m_pViews: Array<IRepeatActivityWnd> = [];
        public m_nCurWelfareType: AcViewType;

        public constructor(pageType: AcViewType) {
            super();
            this.name = RepeatActivityWnd.NAME;
            this.m_nCurWelfareType = pageType || AcViewType.NOR_SEVEN;
            this.initApp("pay/recharge/RechargeWndSkin.exml");
        }

        public onDestroy(): void {
            this.m_pViews = null;
            super.onDestroy();

            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
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
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;
            for (let i = 0; i < this.m_pViews.length; i++) {
                this.m_pViews[i].setViewSize(width, height);
            }
            let index = 0;
            for (let i = 0; i < this.m_pViews.length; i++) {
                let view = this.m_pViews[i];
                if (view.activityType == this.m_nCurWelfareType) {
                    index = i;
                    break;
                }
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);
        }
        /**切换当前卡 */
        private changeTag(index: number) {
            this.m_nCurWelfareType = this.m_pViews[index].activityType;
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        }
        /**添加签到*/
        private addSignView() {
            let type = AcViewType.SIGN_MONTH_DAY;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_SIGN_UP) });
            let signUp = new WelfareSignUp(type);
            this.m_tabViewStack.addChild(signUp);
            this.m_pViews.push(signUp);

            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_SIGN_UP)),
                { x: 132, y: -5 }, [RedEvtType.SIGN_MONTH_DAY], 2);
        }
        /**构建七日循环的基础数据 */
        public addRepeatView() {
            let activiVo = ActivityModel.getActivityVo<AcTaskVo>(AcViewType.NOR_SEVEN);
            if (!activiVo)
                return;
            for (let key in activiVo.taskInfoDic) {
                let vo = activiVo.taskInfoDic[key];
                this.m_comTabGroup.addTabBtnData({ name: vo.cfg.title });
               let view = new RepeatActivityView(AcViewType.NOR_SEVEN, vo.taskId);
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(vo.cfg.title),
                    { x: 132, y: -5 }, [RedEvtType.NOR_OPEN_SEVEN], 2, { dayTaskId: vo.taskId });

                this.m_tabViewStack.addChild(view);
                this.m_pViews.push(view);
            }

        }
        /**添加战力冲榜*/
        private addPowerView() {
            let type = AcViewType.FIGHT_RANKING_AWARD;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_POWER) });
            let rankPower = new RankActView(type);
            this.m_tabViewStack.addChild(rankPower);
            this.m_pViews.push(rankPower);
        }
        /**添加等级冲榜*/
        private addLevelView() {
            let type = AcViewType.LEVEL_RANKING_AWARD;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_LEVEL) });
            let rankLevel = new RankActView(type);
            this.m_tabViewStack.addChild(rankLevel);
            this.m_pViews.push(rankLevel);
        }
        /**添加国家城池冲榜*/
        private addCountryView() {
            let type = AcViewType.COUNTRY_CITYS_RANKING;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_CITY) });
            let rankCountry = new RankActView(type);
            this.m_tabViewStack.addChild(rankCountry);
            this.m_pViews.push(rankCountry);
        }
        /**添加联盟战力冲榜*/
        private addLegionView() {
            let type = AcViewType.GUILD_FORCE_RANKING;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.RANK_LM) });
            let rankLegion = new RankActView(type);
            this.m_tabViewStack.addChild(rankLegion);
            this.m_pViews.push(rankLegion);
        }
        /**添加竞技场战力冲榜*/
        private addArenaView() {
            let type = AcViewType.APK_RANKING;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.ARENA_RANK) });
            let rankArena = new RankActView(type);
            this.m_tabViewStack.addChild(rankArena);
            this.m_pViews.push(rankArena);
        }
        
    }
}
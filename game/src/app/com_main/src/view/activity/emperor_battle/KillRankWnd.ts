module com_main {
    /**
     * 襄阳战（帝位争夺）
     * 杀敌排行榜
     */
    export class KillRankWnd extends CView {
        public static NAME = "KillRankWnd";

        public m_pCDTtime: com_main.CLabel;
        private m_MainTopNew: MainTopNew;    //标题
        private m_comTabGroup: ComTabGroup;
        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_tViews: any[] = [];

        private m_curIndex = 0;
        private m_tabData: { [name: string]: { tag: number, id: number } };


        private m_resetTime: number = 0;
        public constructor(n) {
            super();
            this.name = KillRankWnd.NAME;
            this.initApp("activity/emperorBattle/rankReward/KillRankWndSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_XIANGYANG_INFO,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_INFO: {
                    this.m_tViews[0].Refresh();
                    this.m_tViews[1].Refresh();
                    break;
                }
            }
        }
        public onDestroy(): void {
            super.onDestroy();
            RankModel.clear();
            this.m_tViews = null;
            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateCDTime, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.XIANGYANG_RANK_TITLE));

            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.PLAYER_RANK_REWARD)] = { tag: 0, id: 0 };
            this.m_tabData[GCode(CLEnum.COUNTRY_RANK_REWARD)] = { tag: 1, id: 1 }
            this.m_tabData[GCode(CLEnum.PLAYER_BATTLE_REWARD)] = { tag: 2, id: 2 }
            this.refreshTabBtns();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            // Utils.toStageBestScale(this.m_tabViewStack);
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;


            //个人排名奖
            let kraView = new KillRankAwardView(width, height);
            this.m_tabViewStack.addChild(kraView);

            //国家排名奖
            let kcaView = new KillCountryAwardView(width, height);
            this.m_tabViewStack.addChild(kcaView);

            //个人挑战奖
            let kcadView = new KillCountAwardView(width, height);
            this.m_tabViewStack.addChild(kcadView);

            this.m_tViews.push(kraView);
            this.m_tViews.push(kcaView);
            this.m_tViews.push(kcadView);

            this.validateNow();

            this.initView(this.m_curIndex);

            this.calcuResetTime();
            this.updateCDTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateCDTime, this);

            let container = <egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.PLAYER_BATTLE_REWARD));
            RedPointModel.AddInfoListener(container, { x: 132, y: -5 }, [RedEvtType.PLAYER_BATTLE_REWARD], 2);
        }
        public calcuResetTime() {
            let curtime = TimerUtils.getServerTimeMill();
            let cur: Date = new Date(curtime);
            cur.setHours(0);
            cur.setMinutes(0);
            cur.setSeconds(0);
            let day: number = cur.getDay();
            this.m_resetTime = cur.getTime() + (8 - day) * 3600 * 24 * 1000;
        }
        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }

        /**刷新切卡 */
        private refreshTabBtns() {
            this.m_comTabGroup.clearTabBtn();
            let tags = [GCode(CLEnum.PLAYER_RANK_REWARD), GCode(CLEnum.COUNTRY_RANK_REWARD), GCode(CLEnum.PLAYER_BATTLE_REWARD)];
            this.m_comTabGroup.initNorTabBtns(tags);
        }

        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            let name = this.m_comTabGroup.selName;
            let data = this.m_tabData[name];
            if (!data) return;
            this.m_tabViewStack.selectedIndex = data.tag;
        }
        /**
         * 更新倒计时时间
         */
        public updateCDTime() {
            let curtime = TimerUtils.getServerTimeMill();
            let str = Utils.DateUtils.getCountdownStrByCfg(this.m_resetTime - curtime, 1);
            this.m_pCDTtime.text = str;
        }
    }
}
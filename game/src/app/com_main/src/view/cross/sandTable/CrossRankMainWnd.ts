module com_main {
    export class CrossRankMainWnd extends CView {
        public static NAME = 'CrossRankMainWnd';

        public m_tabViewStack: eui.ViewStack;
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;
        public m_pCDTtime: com_main.CLabel;

        private m_tViews: any[] = [];
        private m_curIndex = 0;
        private m_tabData: { [name: string]: { tag: number, id: number } };
        private m_resetTime: number = 0;
        private m_nTypes: RankType[];

        public constructor(n) {
            super();
            this.name = CrossRankMainWnd.NAME;
            this.initApp("cross/sandTable/CrossRankMainWndSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_RANK_COMM,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_RANK_COMM: {
                    if (this.m_curIndex < 2) this.m_tViews[this.m_curIndex].Refresh();
                    break;
                }
            }
        }

        public onDestroy(): void {
            RankModel.clear();
            this.m_tViews = null;
            EventManager.removeEventListeners(this);
            // Utils.TimerManager.remove(this.updateCDTime, this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.RANK));

            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.CROSS_RANK_GR)] = { tag: 0, id: 0 };
            this.m_tabData[GCode(CLEnum.CROSS_RANK_JT)] = { tag: 1, id: 1 };
            this.m_tabData[GCode(CLEnum.CROSS_RANK_RY)] = { tag: 2, id: 2 };
            this.refreshTabBtns();
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_nTypes = [RankType.CROSS_SERVER_PLAYER_RANK, RankType.CROSS_SERVER_UNION_RANK];
            this.validateNow();

            //个人排名奖励
            let kraView = new CrossRankPageSL(this.m_nTypes[0]);
            this.m_tabViewStack.addChild(kraView);
            //军团荣誉排名
            let kcaView = new CrossRankPageSL(this.m_nTypes[1]);
            this.m_tabViewStack.addChild(kcaView);
            //荣誉累计奖励
            let kcadView = new CrossRankPageH();
            this.m_tabViewStack.addChild(kcadView);

            this.m_tViews.push(kraView);
            this.m_tViews.push(kcaView);
            this.m_tViews.push(kcadView);

            this.validateNow();

            this.initView(this.m_curIndex);

            // this.calcuResetTime();
            // this.updateCDTime();
            // Utils.TimerManager.doTimer(60000, 0, this.updateCDTime, this);

            let container = <egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.CROSS_RANK_RY));
            RedPointModel.AddInfoListener(container, { x: 132, y: -5 }, [RedEvtType.CROSS_RANK_RY], 2);
        }

        /**刷新切卡 */
        private refreshTabBtns() {
            this.m_comTabGroup.clearTabBtn();
            let tags = [GCode(CLEnum.CROSS_RANK_GR), GCode(CLEnum.CROSS_RANK_JT), GCode(CLEnum.CROSS_RANK_RY)];
            this.m_comTabGroup.initNorTabBtns(tags);
        }

        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }

        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            let name = this.m_comTabGroup.selName;
            let data = this.m_tabData[name];
            if (!data) return;
            this.m_tabViewStack.selectedIndex = data.tag;
            if (this.m_curIndex < 2) RankProxy.C2S_RANK_COMM(this.m_nTypes[this.m_curIndex]);
        }

        // /**重置倒计时时间 */
        // public calcuResetTime() {
        //     let curtime = TimerUtils.getServerTimeMill();
        //     let cur: Date = new Date(curtime);
        //     cur.setHours(0);
        //     cur.setMinutes(0);
        //     cur.setSeconds(0);
        //     let day: number = cur.getDay();
        //     this.m_resetTime = cur.getTime() + (8 - day) * 3600 * 24 * 1000;
        // }

        // /**更新倒计时时间 */
        // public updateCDTime() {
        //     let curtime = TimerUtils.getServerTimeMill();
        //     let str = Utils.DateUtils.getCountdownStrByCfg(this.m_resetTime - curtime, 1);
        //     this.m_pCDTtime.text = str;
        // }
    }
}
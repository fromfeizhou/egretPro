module com_main {
	/**
	 * 国家排行奖励
	 */
    export class KillCountryAwardView extends CView {
        public static NAME = 'KillCountryAwardView';
        public m_pRScroller: eui.Scroller;
        public m_pRankList: eui.List;
        public m_SelfItemGroup: eui.Group;
        public m_plbNoAward: com_main.CLabel;

        private m_tCollections: eui.ArrayCollection;
        public constructor(width: number, height: number) {
            super();
            this.name = KillCountryAwardView.NAME;
            // this.width = width;
            // this.height = height;
            this.initApp("activity/emperorBattle/rankReward/CountryAwardRankViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            Utils.toStageBestScaleHeigt(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pRankList.itemRenderer = CountryAwardRankCell;
            this.m_pRankList.dataProvider = this.m_tCollections;

            this.Refresh();
        }


        /**刷新页面 */
        public Refresh(): void {
            this.Refresh_ItemDatas();
        }

        /**刷新排行榜列表数据 */
        private Refresh_ItemDatas(): void {
            let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
            if (isNull(vo)) return;
            let list = vo.getCountryAwardList();
            if (isNull(list)) return;
            list.sort((a, b) => {
                return b.value - a.value;
            });
            let awardRankList = [];
            for (let i = 0; i < list.length; i++) {
                list[i]["rank"] = i + 1;
                awardRankList.push(list[i]);
            }
            this.m_tCollections.replaceAll(awardRankList);
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
            }
        }
    }
}
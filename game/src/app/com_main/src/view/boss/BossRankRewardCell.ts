module com_main {
    export class BossRankRewardCell extends CComponent {
        public m_rankingNum: eui.Label;
        public m_rankingCoin: eui.Image;
        public m_rItemsRoot: eui.Group;

        private m_pCollection: eui.ArrayCollection;   //boss排名奖励
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/boss/BossRankRewardCellSkin.exml");
        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
        protected createChildren(): void {
            super.createChildren();
        }
        /**设置排名奖励信息 */
        public setItemInfo(rank: number, reward: string,type:number) {
            this.m_rankingCoin.source = "";
            // let bossRank = JSON.parse(rank);
            RankModel.refreshBossRankIcon(this.m_rankingCoin,this.m_rankingNum,rank,type);
            this.setitemlist(reward);
        }
        public setitemlist(reward: string) {
            Utils.removeAllChild(this.m_rItemsRoot);
            let tmpList = Utils.parseCommonItemJson(reward);
            for (let i = 0; i < tmpList.length; i++) {
                let info = tmpList[i];
                let itemView = ComItemNew.create('count');
                itemView.setItemInfo(info.itemId, info.count);
                itemView.scaleX = 0.75;
                itemView.scaleY = 0.75;
                this.m_rItemsRoot.addChild(itemView);
            }
        }

    }
}
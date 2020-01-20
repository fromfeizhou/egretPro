module com_main {
    export class BossRankRewardWnd extends CView {
        public static NAME = "BossRankRewardWnd";
        public m_pItemsRoot: eui.Group;
        public m_rankRewardCellList: eui.List;
        public m_APopUp: com_main.APopUp;

        private m_pCollection: eui.ArrayCollection;   //boss排名奖励数据
        private rawardList: any;//奖励列表
        private currType: number;   //boss类型
        /**boss排名奖励界面 */
        public constructor(param: any) {
            super();
            this.name = BossRankRewardWnd.NAME;
            this.rawardList = param.awards;
            this.currType = param.bossType;
            this.initApp("boss/BossRankRewardWndSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
        }
        protected childrenCreated() {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.EXPLOIT_TAB_PM));
            this.m_APopUp.setBottomBorder(false);

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_rankRewardCellList.dataProvider = this.m_pCollection;
            this.m_rankRewardCellList.itemRenderer = RankRewardRender;
            this.m_rankRewardCellList.useVirtualLayout = true;
            this.initPanel();
        }
        /**初始化排名奖励列表 */
        private initPanel() {
            let rankRewardArr = [];
            for (let i = 0; i < 11; i++) {
                let info = this.rawardList[i];
                let data: RankRewardRD = { rank: info.rank, reward: info.reward, bossType: this.currType };
                rankRewardArr.push(data);
            }
            this.m_pCollection.replaceAll(rankRewardArr);
        }
    }
    export interface RankRewardRD {
        rank: number,
        reward: string,
        bossType: number,
    }
    /**
 * bossItem
 * @class 
 * @extends eui.ItemRenderer
 */
    export class RankRewardRender extends eui.ItemRenderer {
        protected bossRankRewardCell: BossRankRewardCell;
        protected m_imgSelected: eui.Image;

        protected m_tData: RankRewardRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.bossRankRewardCell = new BossRankRewardCell();
            this.addChild(this.bossRankRewardCell);
        }
        protected dataChanged() {
            this.m_tData = this.data;
            this.bossRankRewardCell.setItemInfo(this.m_tData.rank, this.m_tData.reward,this.m_tData.bossType);
        }
    }
}
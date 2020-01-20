module com_main {
	export class ComRankNumItem extends CComponent {

        private m_prank:number;
        private m_pImageRank:CImage;
		private m_pTextRank:CLabel;
		public constructor(id?:number) {
			super();
			this.skinName = Utils.getAppSkin("pvp_arena/ComRankNumItemSkin.exml")
            if(id){
                this.m_prank = id;
            }
		}

		protected childrenCreated(): void {
			super.childrenCreated();
            this.setRankNum(this.m_prank);			
		}

        public setRankNum(rank:number){
			RankModel.refreshRankIcon(this.m_pImageRank,this.m_pTextRank,rank);
        }

		 public onDestroy(): void {
            super.onDestroy();
        }
	}
}
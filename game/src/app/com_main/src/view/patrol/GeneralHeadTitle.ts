module com_main {
	export interface IGenHeadTitle{
		countryId:number;
		name:string;
		factName:string;
		isSelf:boolean;
		titleId?:number;
	}
	export class GeneralHeadTitle extends CComponent{

		public m_headInfo:com_main.BattleHeadInfo;
        public m_factionName:eui.Label;
        public m_playerTitle:eui.Image;

        private m_tData:IGenHeadTitle;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("patrol/generalHeadTitleSkin.exml");
		}

		public onDestroy() {
			super.onDestroy();
			this.removeFromParent();
			this.m_tData = null;
		}
		protected childrenCreated(): void {
			super.childrenCreated();

            this.refreshView();
		}

		public setData(data: IGenHeadTitle) {
			this.m_tData = data;
		}

		public refreshView(){
			this.m_headInfo.showPlayerName(this.m_tData)
            this.m_factionName.text = this.m_tData.factName;
            if(this.m_tData.factName == ""){
                this.m_playerTitle.y = 30;
            }else{
                this.m_playerTitle.y = 10;
            }
			if(this.m_tData.titleId){
				this.m_playerTitle.source = `playerTitle_${this.m_tData.titleId}_png`
			}
		}
	}
}
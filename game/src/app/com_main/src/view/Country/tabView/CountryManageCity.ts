module com_main {
	export class CountryManageCity extends CComponent {
		public static NAME = 'CountryManage';

		private m_CityImg:CImage;
		private m_Label:CLabel;

		private _num:number = 0;
		private m_nType:number;
		public constructor() {
			super();
			this.name = ArenaView.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryManageCitySkin.exml");
				
		}
		
		protected childrenCreated(): void {
            super.childrenCreated();
        }

		public InitCity(type:number):void{
			this.m_nType = type;
			if(type == 3){
				this.m_CityImg.source = format("map_build_{1}_png",4);
			}else{
				this.m_CityImg.source = format("map_build_{1}_png",this.m_nType);
			}
			this.Refresh_Title();
		}

		public AddNum(num:number):void{
			this._num += num;
			this.Refresh_Title();
		}
		
		public ResetNum():void{
			this._num = 0;
			this.Refresh_Title();
		}

		private Refresh_Title():void{
			this.m_Label.text = format("{1}x{2}",WorldModel.getCityTypeName(this.m_nType),this._num);
		}
	}
}
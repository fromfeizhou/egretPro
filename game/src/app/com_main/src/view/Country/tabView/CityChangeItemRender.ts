module com_main {

	export class CityChangeItemRender extends eui.ItemRenderer {

        public m_info:eui.Label;
        public m_flagImg:eui.Image;

		public constructor() {
			super();
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			
		}

		public dataChanged() {
			super.dataChanged();
			if (!this.data) return;

            let countryName = Utils.getCountryName(this.data.countryId,GCode(CLEnum.STATE_ZL));
            let color = Utils.getCountryColor1(this.data.countryId);
            let cityName = WorldModel.getCityName(this.data.cityId);

            let timeStr = Utils.DateUtils.getDateStr(this.data.time);

            if(this.data.type == 1){
                this.m_flagImg.source = 'zyt_qz01_png';
                this.m_info.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_CHANGE_SUC,timeStr,color,countryName,cityName));
            }else{
                this.m_flagImg.source = 'zyt_qz02_png';
                this.m_info.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_CHANGE_FALL,cityName,timeStr,color,countryName));
            }
		}

	}
}
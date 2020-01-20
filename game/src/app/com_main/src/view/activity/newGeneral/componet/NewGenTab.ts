// TypeScript file

module com_main {
	export class NewGenTab extends CComponent implements TabCompont{

		public m_img: eui.Image;
		public m_lb: eui.Label;
		public m_tabIndex: number;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("activity/newGeneral/componet/NewGenTapSkin.exml");
		}

		protected childrenCreated(): void {
            super.childrenCreated();
		}

		setTabIndex(index: number){
			this.m_tabIndex = index;
		}

		getTabIndex(){
			return this.m_tabIndex ;
		}

		public setTitleLabel(str: string){
			this.m_lb.text = str;
		}

		setSelectState(boo: boolean){
			if(boo){
				this.m_img.source = 'btn_144_png'
			}else{
				this.m_img.source = 'btn_143_png'
			}
		}
	}
}
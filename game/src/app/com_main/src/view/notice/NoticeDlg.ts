module com_main {
	/**boss */
	export class NoticeDlg extends CView {

		
		public static NAME = 'NoticeDlg';
		private m_PopUp:com_main.APopUp;
		private m_comTabGroup:ComTabGroup;
		private m_contentText:eui.Label;
		private m_data = [];
		public constructor(data?) {
			super();
			this.name = NoticeDlg.NAME;
			if(data){
				this.m_data = data;
			}
			this.initApp("notice/NoticeDlgSkin.exml");
		}
		protected listenerProtoNotifications(): any[] {
			return [
				// ProtoDef.GET_BOSS,
			];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				// case ProtoDef.GET_BOSS: {
					// let info = BossModel.getInfobyType(this.m_bossType+1); //
					// this.initPanel(info);
				// }
                // break;
			}
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_PopUp.setTitleLabel(GCode(CLEnum.NOTICE_TITLE));
			this.m_PopUp.setBottomBorder();
			// this.m_comTabGroup.addTabBtnData({name:"新服开启"});
            // this.m_comTabGroup.addTabBtnData({name:"更新维护"});
			if(this.m_data.length>0){
				for(let i=0;i<this.m_data.length;i++){
					this.m_comTabGroup.addTabBtnData({name:this.m_data[i].title});
					if(i==0){
						this.m_contentText.textFlow =Utils.htmlParser(this.m_data[i].content);
					}
				}
				this.m_comTabGroup.setChangeCallback(this.onTabBtnClick, this);
			}
			
			
		}
		/**切卡按钮点击 */
		public onTabBtnClick(selectedIndex:number) {
			// let content = "<font color = #e9e9e6>你好中国：</font>\n\n 大家好才是{1}真的好啊<font color = #e9e9e6>《权游三国》</font>与{2}分，大家好才是真的好啊大家好才是真的好啊大家好大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊才是真的好啊大家好才是真的好啊";
			// this.m_contentText.textFlow =Utils.htmlParser(content);
			this.m_contentText.textFlow =Utils.htmlParser(this.m_data[selectedIndex].content);
		}
		public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }
		private initPanel(info){
			
		}
		
	}
}
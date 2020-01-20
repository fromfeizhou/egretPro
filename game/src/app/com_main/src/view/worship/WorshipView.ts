module com_main {

	export class WorshipView extends CView {

		public static NAME = 'WorshipView';
		private m_effect: MCDragonBones;	//按钮特效

        public m_closeBtn:eui.Image;
		public m_cImg:eui.Image;
		public m_pName:eui.Label;
		public m_comFightItem:com_main.ComFightItem;
		public m_legionLb:eui.Label;
		public m_pImg:com_main.ComGenCard;
		public m_p:eui.Group;
		public m_pBtnWorship:eui.Group;
		public m_lb_num:eui.Label;
		public m_desLb:eui.Label;


		public constructor() {
			super();
			this.name = Cornucopia.NAME;
			this.initApp("worship/WorshipSkin.exml");
		}

		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
			this.removeBtnEffect();
			SceneResGroupCfg.clearModelRes([ModuleEnums.WORSHIP_UI]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.refreshEmperor();
            this.refreshWorshipInfo();

            EventManager.addTouchScaleListener(this.m_closeBtn, this, this.onClickBack);
            EventManager.addTouchScaleListener(this.m_pBtnWorship, this, this.onClickWorshipBtn);

            
			this.onGuideCondition();
		}

		/**按钮特效 */
		private addBtnEffect() {
			this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 154;
            this.m_effect.y = 57;
            this.m_pBtnWorship.addChild(this.m_effect);
		}
		/**按钮特效 */
		private removeBtnEffect() {
			if (this.m_effect) {
				this.m_effect.destroy();
				this.m_effect = null;
			}
		}

		
		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_COUNTRY_EMPEROR_INFO,
				ProtoDef.S2C_WORSHIP,
                ProtoDef.S2C_WORSHIP_INFO,
			];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_COUNTRY_EMPEROR_INFO: {
                    this.refreshEmperor();
					break;
				}

                case ProtoDef.S2C_WORSHIP:{
                    let data:gameProto.IS2C_WORSHIP = body as gameProto.IS2C_WORSHIP;
                    if(data.ret == 0){
                        this.m_pBtnWorship.visible = false;
                        this.m_lb_num.visible = true;
                        this.refreshWorshipInfo(true);
                    }
                    break;
                }

                case ProtoDef.S2C_WORSHIP_INFO:{
                    this.refreshWorshipInfo();
                    break;
                }
			}
		}
		private refreshEmperor() {
			let info:gameProto.S2C_COUNTRY_EMPEROR_INFO = CountryModel.getCountryEmperorInfo();
            if(!info) return ;

			this.m_pImg.setInfo(info.head,true,true)


            this.m_pName.text = info.nickName;
            this.m_cImg.source = 'common_country1_'+ info.country +'_png';
            this.m_comFightItem.setFight(info.fight);
			this.m_legionLb.text = info.guild;
			
		}

        private refreshWorshipInfo(isAddOne?) {
            let info = WorshipModel.getWorshipData(1);
            if(!info) return ;
			let num = 0;
			if(isAddOne){
				num = info.beWorshipCount+1;
			}else{
				num = info.beWorshipCount;
			}
			this.m_lb_num.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WORSHIP_NUM, num));
			this.m_desLb.textFlow = Utils.htmlParser(GCode(CLEnum.WORSHIP_DES));

			let isWorship = WorshipModel.getStateByType(WorshipType.KING);
            if(isWorship && info.playerId != RoleData.playerId){
                this.m_pBtnWorship.visible = true;
                this.m_lb_num.visible = false;
				this.addBtnEffect();
            }else{
                this.m_pBtnWorship.visible = false;
                this.m_lb_num.visible = true;
            }

        }

        private onClickWorshipBtn(){
            WorshipProxy.send_C2S_WORSHIP(WorshipType.KING,0);
        }

		//关闭页面
		private onClickBack() {
			com_main.UpManager.history();
		}
	}
}
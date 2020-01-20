/**雕像点击区域 */
module com_main {
	export class StatueView extends CComponent {
        public m_group:eui.Group;
        public m_title:eui.Group;
        public m_comState:com_main.ComState;
        public m_pName:eui.Label;
		
        private m_data;
		public constructor(data) {
			super();
            this.m_data = data;
			this.skinName = Utils.getAppSkin("worship/StatueSkin.exml");
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage(false);
            // EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
            super.childrenCreated();

			this.m_comState.stateId = this.m_data.countryId;
            if(this.m_data.name == RoleData.nickName){
                this.m_pName.textColor = 0x4bfe47;
            }else{
                this.m_pName.textColor = 0xff37ea;
            }
            this.m_pName.text = this.m_data.name;

            if(this.m_data.statueType == StatueType.BattleKing){
                RedPointModel.AddInfoListener(this.m_title, { x: this.m_title.width - 10, y: 3 }, [RedEvtType.BATTLE_KING_WORSHIP], 3);
            }else{
                this.currentState = "modelKing";
            }
		}

        /**检测是否点中图标 */
        public check_is_touch(x: number, y: number): boolean {
            let res = this.m_group.hitTestPoint(x, y,false);
            if (res) this.onClickStatue();
            return res;
        }

        public onDestroy(): void {
            
        }

        public onClickStatue(){
            switch(this.m_data.statueType){
                case StatueType.BattleKing:{
                    Utils.open_view(TASK_UI.WORSHIP_PANEL);
                    return ;
                }
            }
        }
	}
}
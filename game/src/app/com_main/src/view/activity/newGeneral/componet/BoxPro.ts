// TypeScript file

module com_main {
	export class BoxPro extends CComponent {

		public m_proBg:eui.Image;
		public m_pro:eui.Image;
		public box0:com_main.BoxComponet;
		public box1:com_main.BoxComponet;
		public box2:com_main.BoxComponet;
		public box3:com_main.BoxComponet;

		public m_boxsInfo :any[];
		public m_allPro: number;
		public m_curPro: number;

		private m_vo: AcNewGenVisVo;           //活动数据

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("activity/newGeneral/componet/BoxProSkin.exml");
		}

		protected childrenCreated(): void {
            super.childrenCreated();
			this.initEvent();
			this.m_vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
		}

		$onRemoveFromStage(): void {
			this.removeEvent();
			super.$onRemoveFromStage();
		}

		/**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
			for (let i = 0; i < 4; i++) {
				EventManager.addTouchScaleListener(this[`box${i}`], this, this.onClickBox);
            }
        }

        private removeEvent() {
			EventManager.removeEventListeners(this);
        }
		/**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

		public onClickBox(e: egret.TouchEvent){
			let target = e.target;
            let i = 0;
            while(isNull(target.GetBoxState) && i < 10){
                target = target.parent;
                i++;
            }
			let state = target.GetBoxState();
			let boxIndex = target.getId();
			if(state == 1){
				//发送领取宝箱奖励协议
				console.log('发送领取宝箱奖励协议');
				ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD(this.m_vo.id,boxIndex);
			}else{
				let items = this.m_vo.getKeepsakeRewardCfg()[boxIndex -1].reward;
				Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: items,titleStr:'宝箱奖励' });
			}
		}

		public setBoxList(arr: number[]){
			let count = this.m_vo.getCostKeepsake();
			let list = this.m_vo.getBoxReardRecord();

			for(let i = 0; i < 4; i++){
				this['box' + i].x = 20 + arr[i] / this.m_allPro * (604 - 85);
				this['box' + i].initLb(arr[i],Number(i+1));

				if(list.indexOf(Number(i+1)) == -1){
					if(arr[i] <= count){
						this['box' + i].SetBoxState(1);
					}else{
						this['box' + i].SetBoxState(2);
					}
				}else{
					this['box' + i].SetBoxState(0);
				}
			}
		}

        public setPro(allPro: number, curPro: number){
			this.m_allPro = allPro;
			this.m_curPro = curPro;
			this.m_pro.width = Math.min(curPro / allPro * 604,604);

			let list: number[] = [];
			let cfg = this.m_vo.getKeepsakeRewardCfg();
			for(let i = 0; i <= 3; i++){
				list.push(cfg[i].keepsakeCount);
			}
			this.setBoxList(list);
		}
	}
}
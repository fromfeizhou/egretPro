// module com_main {
// 	export class CountryTask extends CComponent {
// 		public static NAME = 'CountryTask';
// 		private m_Title:CLabel;
// 		private m_Describe:CLabel;
// 		private m_BtnFinish:ComButton;
// 		private m_ItemRoot:eui.Group;
// 		private m_textGroup:eui.Group;
// 		private m_CurValue:CLabel;
// 		private m_TotalValue:CLabel;
// 		private m_ProgressBar:ComProgressBar;
// 		private _taskCfg:CountryTaskConfig;
// 		private _conditionCfg:CountryTaskConditionConfig;
// 		private _items:ComItemNew[];
// 		public constructor() {
// 			super();
// 			this.name = ArenaView.NAME;
// 			this.skinName = Utils.getSkinName("app/Country/CountryTaskSkin.exml");	
// 		}
// 		protected childrenCreated(): void {
//             super.childrenCreated();
// 			EventManager.addTouchScaleListener(this.m_BtnFinish, this, this.onBtnFinish);
// 			this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
// 			this.m_ProgressBar.Progress = 0;
// 			let scaleY=(453-GameConfig.getSub())/453;
// 			this.m_textGroup.scaleX = scaleY;
// 			this.m_textGroup.scaleY = scaleY;
// 			this.RefreshConfig();
// 		}
// 		public onDestroy(): void {
// 			EventManager.removeEventListeners(this);
//             super.onDestroy();
//         }
// 		private onBtnFinish():void{
// 			let taskId:number = CountryModel.TaskId;
// 			CountryProxy.send_COUNTRY_TASK_FINISH(taskId);
// 		}
// 		public Refresh():void{
// 			if(CountryModel.TaskId != 0 && this._taskCfg && this._conditionCfg){
// 				this.RefreshTitle();
// 				this.RefreshDescribe();
// 				this.RefreshRewards();
// 				this.RefreshProgress();
// 			}
// 		}
// 		public RefreshConfig():void{
// 			this._taskCfg = C.CountryTaskConfig[CountryModel.TaskId];
// 			if(this._taskCfg){
// 				this._conditionCfg = C.CountryTaskConditionConfig[this._taskCfg.condition];
// 			}
// 			else{
// 				debug("[国家任务]任务ID不存在。ID:" + CountryModel.TaskId);
// 			}
// 		}
// 		private RefreshTitle():void{
// 			this.m_Title.text = GLan(this._taskCfg.name);
// 		}
// 		private RefreshDescribe():void{
// 			this.m_Describe.text = GLan(this._taskCfg.detail);
// 		}
// 		private RefreshProgress():void{
// 			this.m_CurValue.text = CountryModel.TaskCurValue.toString();
// 			let totalValue = CountryModel.TaskCurValue > this._taskCfg.taskGoal?CountryModel.TaskCurValue : this._taskCfg.taskGoal;
// 			this.m_TotalValue.text = totalValue.toString();
// 			this.m_ProgressBar.Progress = CountryModel.TaskCurValue / totalValue;
// 			this.m_BtnFinish.disabled = CountryModel.TaskCurValue < totalValue;
// 		}
// 		private RefreshRewards():void{
// 			if(this._items && this._items.length > 0){
// 				for(let i = 0;i<this._items.length;i++){
// 					this.m_ItemRoot.removeChild(this._items[i]);
// 				}
// 			}
// 			this._items = [];
// 			let reward:any[] = Utils.parseCommonItemJson(this._taskCfg.errandReward);
// 			for(let i = 0;i<reward.length;i++){
// 				let item:ComItemNew = ComItemNew.create("name_num");
// 				item.setItemInfo(reward[i].itemId,reward[i].count)
// 				this._items.push(item);
// 				this.m_ItemRoot.addChild(item);
// 			}
// 		}
// 		public GetRewards(valueMsgs:gameProto.IValuesMessage[]):void{
// 			if(valueMsgs){
// 				Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
// 			}
// 		}
// 	}
// }

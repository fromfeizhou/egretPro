// module com_main {
//      enum BuildOverviewType{
//         /**建筑队列 */
//         BuildQueue = 0,
//         /**科技队列 */        
//         Technology = 10,
//         /**步兵营队列 */        
//         BBYSoldier = 20,
//          /**骑兵营队列 */        
//         QBYSoldier = 21,
//          /**弓兵营队列 */        
//         GBYSoldier = 22,
//         /**聚宝盆免费次数 */        
//         JBPNum = 30,
//         /**英雄挑战 */
//         HeroChallenge_1 = 40,
//         /**英雄挑战 */        
//         HeroChallenge_2 =41,
//         /**英雄挑战 */        
//         HeroChallenge_3 = 42,
//         /**关卡 */        
//         Checkpoint = 50,
//         /**擂台 */        
//         LeiTai = 51,
//         /**巡查 */        
//         XunCha = 52,
//         /**pvp */        
//         Pvp = 60,
//     }
// 	/**
// 	 * 建筑总览组件
// 	 */
//     export class BuildOverviewView extends CComponent {
//         public static NAME = 'BuildOverviewView';
//         private m_pContent:eui.Group;
//         private scroll:CScroller;
//         private m_pCellRoot:eui.Group;
//         private openBtn:CImage;
//         private cellList:any;
//         private isShow:boolean = false;
//         private BuildOverViewCells:BuildOverviewCell[];
//         /**主面板 */
//         private mainGroup: eui.Group;
//         /**列表 */
//         private scroller: eui.Scroller;
//         /**地图 */
//         private bg_imgae: eui.Image;
//         public constructor() {
//             super();
//             this.name = BuildOverviewView.NAME;
//             this.skinName = Utils.getSkinName("app/build/BuildOverviewViewSkin.exml");
//         }
//         public onDestroy(): void {
//             if(this.BuildOverViewCells){
//                 for(let index=0;index<this.BuildOverViewCells.length;index++){
//                     let cell = this.BuildOverViewCells[index];
//                     cell.onDestroy();
//                 }
//                 this.BuildOverViewCells = null;
//             }
//             EventManager.removeEventListeners(this);
//             super.onDestroy();
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.init();
//         }
//         private init(){
//             this.BuildOverViewCells = [];
//             let tempDic = Dictionary.create();
//             let cfg = C.CastleOverviewConfig;
//             for (var key in cfg) {
//                 if (cfg.hasOwnProperty(key)) {
//                    let item = cfg[key];
//                    let dicKey = item.titleName;
//                    if(!tempDic.has(dicKey)){
//                        tempDic.add(dicKey,[]);
//                    }
//                    tempDic.get(dicKey).push(item);
//                 }
//             }
//             let temp = this.m_pCellRoot;
//             tempDic.forEach((key: number, _data: CastleOverviewConfig[]) => {
// 				let dic:CastleOverviewConfig[] = _data ;
// 				let cell = new BuildOverviewCell(dic,this);
//                 this.BuildOverViewCells.push(cell);
//                 this.m_pCellRoot.addChild(cell);
// 		    }, this);     
//         }
//         private updateCell(){
//             for(let index= 0;index<this.BuildOverViewCells.length;index++){
//                 this.BuildOverViewCells[index].updateCell();
//             }
//         }
//     }
//     export class BuildOverviewCell extends CComponent{
//         private m_pTitelIcon:CImage;
//         private m_pTitleText:CLabel;
//         private m_pCellRoot:eui.Group;
//         private cellList:BuildOverviewFuncBase[];
//         private data:CastleOverviewConfig[];
//         private parentView:BuildOverviewView;
//         public constructor(data:CastleOverviewConfig[],parent:BuildOverviewView){
//             super();
//             this.data = data;
//             this.skinName = Utils.getSkinName("app/build/BuildOverviewCellSkin.exml");
//             this.parentView = parent;
//         }
//         protected childrenCreated(): void {
//             super.childrenCreated();
//             this.init();
//         }
//          public onDestroy(): void {
//             if(this.cellList){
//                 for(let index=0;index<this.cellList.length;index++){
//                     let cell = this.cellList[index];
//                     cell.onDestroy();
//                 }
//                 this.cellList = null;
//             }
//             EventManager.removeEventListeners(this);
//             super.onDestroy();
//         }
//         protected init(){
//             this.cellList = [];
//             this.m_pTitelIcon.source =  this.data[0].titleIcon;
//             this.m_pTitleText.text = this.data[0].titleName;
//             let queueIndex = 0;
//             for(let index= 0;index<this.data.length;index++){
//                 let cfg = this.data[index];
//                 let tempCell:BuildOverviewFuncBase = null;
//                 switch(cfg.type){
//                     case BuildOverviewType.BuildQueue:{
//                         tempCell = new BuildQueueOverViewFunction(cfg,queueIndex);
//                         queueIndex++;
//                         break;
//                     }
//                     case BuildOverviewType.Technology:{
//                         tempCell = new TechnologyQueueOverViewFunction(cfg,MBuildId.KJ);
//                         break;
//                     }
//                     case BuildOverviewType.JBPNum:{
//                         tempCell = new JBPFreeNumOverViewFunction(cfg);
//                         break;
//                     }
//                     case BuildOverviewType.BBYSoldier:{
//                          tempCell = new SoldierQueueOverViewFunction(cfg,MBuildId.BBY);
//                         break;
//                     }
//                     case BuildOverviewType.QBYSoldier:{
//                          tempCell = new SoldierQueueOverViewFunction(cfg,MBuildId.QBY);                        
//                         break;
//                     }
//                     case BuildOverviewType.GBYSoldier:{
//                          tempCell = new SoldierQueueOverViewFunction(cfg,MBuildId.GBY);                        
//                         break;
//                     }
//                     case BuildOverviewType.HeroChallenge_1:{//1登门拜访 2 敌将攻城 3 城内治安
//                          tempCell = new HeroChallengeOverViewFunction(cfg,BossType.NOTES);         
//                         break;
//                     }
//                     case BuildOverviewType.HeroChallenge_2:{
//                          tempCell = new HeroChallengeOverViewFunction(cfg,BossType.ACTTACT);                                 
//                         break;
//                     }
//                     case BuildOverviewType.HeroChallenge_3:{
//                          tempCell = new HeroChallengeOverViewFunction(cfg,BossType.SECURITY);                                 
//                         break;
//                     }
//                     case BuildOverviewType.Checkpoint:
//                     case BuildOverviewType.XunCha:
//                     case BuildOverviewType.LeiTai:{
//                          tempCell = new BuildOverviewFuncBase(cfg);                                                         
//                         break;
//                     }
//                     case BuildOverviewType.Pvp:{
//                         tempCell = new PvpOverViewFunction(cfg);   
//                         break;
//                     }
//                 }
//                 if(tempCell){
//                     tempCell.onHideCallback = ()=>{
//                         EventMgr.dispatchEvent(SceneEvent.HIDE_OVER_VIEW,null);
//                     }
//                     this.cellList.push(tempCell);
//                     this.m_pCellRoot.addChild(tempCell);                 
//                 }
//             }
//         }
//         //刷新
//         public updateCell(){
//             for(let index = 0;index<this.cellList.length;index++){
//                 this.cellList[index].update();
//             }
//         }
//     }
//     /**==================================================================================================================================
//     * 建筑总览功能类型 start
//     * ==================================================================================================================================
//     */
//     export class BuildOverviewFuncBase extends CComponent{
//         protected cfg:CastleOverviewConfig;
//         protected m_pTitleIcon:CImage;
//         protected m_pLbTitle:CLabel;
//         protected m_pBtn:eui.Group;
//         protected m_pBtnName:ComButton;
//         private m_pLbDoStr:CLabel;//进行中提示的文本
//         protected m_pSpeedTime:number = 0;
//         protected m_pStartTime:number = 0;
//         protected m_pEndTime:number = 0;
//         protected m_pTimeRoot:eui.Group;
//         protected m_pLbTime:CLabel;
//         protected m_pTimeImage:CImage;//进度条
//         protected m_isActive:boolean;
//         private timeImageWidth:number = 0;
//         private timeCallbackId:number = -1;
//         public onHideCallback:()=>void;
//         public constructor(data:CastleOverviewConfig){
//             super();
//             this.cfg = data;
//             this.skinName = Utils.getSkinName("app/build/BuildOverviewFuncSkin.exml");
//         }
//          protected childrenCreated(): void {
//             super.childrenCreated();
//             this.timeImageWidth = this.m_pTimeImage.width;
//             this.m_pTimeImage.width = 0;
//             this.m_pBtnName.setTitleLabel("前往");
//             this.setCommonInfo();
//             this.init();
//             EventManager.addTouchScaleListener(this.m_pBtn, this, this.clickBtnHandler);
//         }
//         //设置通用信息
//         private setCommonInfo(){
//             this.m_pLbTitle.text = this.cfg.desc;
//             this.m_pLbDoStr.text = this.cfg.doStr;
//             this.m_pTitleIcon.source = this.cfg.cellIcon;
//         }
//         protected init(){}
//         public update(){
//             this.onUpdate();
//         }
//         //子类重写
//         protected onUpdate(){}
//         protected isEnd():boolean{
//             return true;
//         }     
//         //设置时间
//         protected setTime(startTime:number,endTime:number,speedTime:number = 0){
//             this.m_pStartTime = startTime;
//             this.m_pEndTime = endTime;
//             this.m_pSpeedTime = speedTime;
//            // this.setCountDown();
//         }
//         //激活倒计时
//         protected activateCountDown(buildId:number){
//             this.timeCallbackId = buildId;
//             if (!this.m_isActive) {
//                 MainMapModel.addCall(this.timeCallback, this, this.timeCallbackId);
//                 this.m_isActive = true;
//             }
//             this.timeCallback();
//         }
//         //时间回调
//         private timeCallback(){
//            if(!this.isEnd()){
//                this.setCountDown();
//            }else{
//                 this.onTimeEnd();
//            }
//         }
//         protected onTimeEnd(){
//             this.clearTimeCallback();
//             this.m_isActive = false;
//             this.setCountDownEnable(false);
//         }
//         //设置倒计时进度
//         protected setCountDown(){
//             let dateInfo = Utils.DateUtils.getCountdownInfo(this.m_pStartTime,this.m_pEndTime,this.m_pSpeedTime,false);
//             this.m_pLbTime.text = dateInfo[1]+"";
//             this.m_pTimeImage.width = this.timeImageWidth * Number(dateInfo[0]);
//         }
//         //设置时间节点显示
//         protected setCountDownEnable(isShow:boolean){
//             if(this.m_pTimeRoot.visible!=isShow){
//                 this.m_pTimeRoot.visible= isShow;
//                 this.m_pBtn.visible = !isShow;
//             }
//         }
//         private clickBtnHandler(){
//             if(this.onHideCallback){
//                 this.onHideCallback();
//             }
//             this.onClickBtn();
//         }
//         //点击按钮
//         protected onClickBtn(){
//             FunctionModel.funcToPanel(this.cfg.skipId);            
//         }
//         //清除时间回调
// 		public clearTimeCallback(){
// 			MainMapModel.removeCall(this, this.timeCallbackId);
// 		}
//         //销毁
//         public onDestroy(): void {
//             this.clearTimeCallback();
// 			this.destroy();
//             super.onDestroy();
//         }
//         protected destroy(){};
//     }
//     /**建筑队列 */
//     export class BuildQueueOverViewFunction extends BuildOverviewFuncBase{
//         private buildId:number;
//         private m_nIndex:number;
//         public constructor(data:CastleOverviewConfig,index:number){
//             super(data);
//             this.m_nIndex = index;
//         }
//         protected init(){
//             EventMgr.addEvent(BuildEvent.BUILD_QUEUE_CHANGE, this.onBuildQueueChange, this);
//             this.updateView();
//         }
//          protected onClickBtn(){
//              if(this.buildId&&this.buildId!=-1){//移动到建筑
// 				MainMap.moveToBuildAndOpen(this.buildId);
// 			}else{//推荐跳转到建筑
// 				MainMapModel.MoveToCanGradeUpBuild();
// 			}
//          }
//         //当队列改变
// 		private onBuildQueueChange(index :number){
// 			if(this.m_nIndex == index){
// 				this.updateView();
// 			}
// 		}
// 		//刷新界面
// 		private updateView(){
// 			let buildId = MainMapModel.getBuildIdByIndex(this.m_nIndex);
// 			if(buildId == -1){
// 				this.onTimeEnd();
// 			}else{
// 				this.setBuildId(buildId);
// 			}
// 		}
// 		//激活
// 		private setBuildId(id:number){
// 			this.buildId = id;
//             let isBuilding = MainMapModel.isInBuilding(this.buildId);
// 		 	if (isBuilding) {	 
//                 this.activateCountDown(this.buildId);
// 				let info = MainMapModel.getBuildInfo(id);
// 				if(info){
//                     this.setTime(info.buildStartTime,info.buildEndTime);
// 				}
// 			}
//             this.setCountDownEnable(isBuilding);
// 		}
//         protected isEnd():boolean{
//             return !MainMapModel.isInBuilding(this.buildId)
//         }
//         protected destroy(){
//             EventMgr.removeEventByObject(BuildEvent.BUILD_QUEUE_CHANGE, this.onBuildQueueChange);
//         }
//     }
//      /**兵营队列 */
//     export class SoldierQueueOverViewFunction extends BuildOverviewFuncBase{
//         private m_BuildId:number;
//         public constructor(data:CastleOverviewConfig,bId:number){
//             super(data);
//             this.m_BuildId = bId;
//         }
//         protected init(){
//             EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.onSoldierTarin, this);
//             this.updateCell();
//         }
//         private onSoldierTarin(id:number){
//             if(this.m_BuildId == id){
//                 this.updateCell();
//             }
//         }
//         protected updateCell(){
//             let army = MainMapModel.getTrainArmyVoById(this.m_BuildId);
//             if (army == null) {
//                 this.setCountDownEnable(false);
//             } else {
//                 let m_pRemainTime = army.endTime - army.speedTime - TimerUtils.getServerTimeMill();
//                 if (m_pRemainTime <= 0) {
//                     this.setCountDownEnable(false);
//                 }
//                 else {
//                     this.setCountDownEnable(true);
//                     this.activateCountDown(this.m_BuildId);
//                     this.setTime(army.startTime,army.endTime,army.speedTime);
//                 } 
//             }
//         }
//         protected isEnd():boolean{
//             let army = MainMapModel.getTrainArmyVoById(this.m_BuildId);
//             let tempTime = army.endTime - army.speedTime - TimerUtils.getServerTimeMill()
//             return !MainMapModel.isInTrain(this.m_BuildId);//!army|| tempTime<=0;
//         }
//         //设置时间节点显示
//         protected setCountDownEnable(isShow:boolean){
//             this.m_pTimeRoot.visible= isShow
//             if(isShow){
//                 this.m_pBtnName.setTitleLabel("加速");
//             }else{
//                 this.m_pBtnName.setTitleLabel("前往");
//             }
//         }
//         protected onClickBtn(){
//             if(this.m_pTimeRoot.visible){
//                 MainMapModel.openSoliderTrainSpeedUpView(this.m_BuildId);
//             }else{
//                super.onClickBtn();
//             }
//         }
//         protected destroy(){
//             EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this.onSoldierTarin);            
//         }
//     }
//     /**聚宝盆免费次数 */
//     export class JBPFreeNumOverViewFunction extends BuildOverviewFuncBase{
//         private m_pLbCount:CLabel;
//         public constructor(data:CastleOverviewConfig){
//             super(data);
//         }
//         protected init(){
//             EventMgr.addEvent(CornucopiaEvent.ON_PAY_NUM_CHANGE, this.onPayNumChange, this);
//             this.onPayNumChange();
//         }
//         private onPayNumChange(){
//             let info = CornucopiaModel.getCornucopiaInfo();
//             let curRushNum = info?info.count:0;
//             let count = ConstUtil.getValue(IConstEnum.CORNUCOPIA_FREE) - curRushNum;
//             this.m_pLbCount.text = (count < 0 ? 0 : count)+"";
//         }
//         protected destroy(){
//             EventMgr.removeEventByObject(CornucopiaEvent.ON_PAY_NUM_CHANGE, this.onPayNumChange);            
//         }
//     }
//      /**英雄挑战 */
//     export class HeroChallengeOverViewFunction extends BuildOverviewFuncBase{
//         private challengeType:number;
//         public constructor(data:CastleOverviewConfig,type:number){
//             super(data);
//             this.challengeType = type;
//         }
//         protected onUpdate(){
//             let type = RedEvtType.PandectBossNotes;
//             if(this.challengeType == Number(BossType.ACTTACT)) type = RedEvtType.PandectBossActtact;
//             if(this.challengeType == Number(BossType.SECURITY)) type = RedEvtType.PandectBossSecurity;
//             RedPointModel.AddInfoListener(this.m_pBtn, { x: 100, y: -10 }, [type], 3);
//             // this.m_pBtnName.setTitleLabel( BossModel.JudgeIsFight(this.challengeType).res?"挑战":"前往");
//         }
//         protected onClickBtn(){
//             Utils.open_view(TASK_UI.BOSS_INFO_PANEL,{type:this.challengeType});//0开始
//         }
//         protected destroy(){
//         }
//     }
//      /**功能面板 */
//     export class FunctionViewOverViewFunction extends BuildOverviewFuncBase{
//         protected ft:FunctionType;
//         public constructor(data:CastleOverviewConfig,ft:FunctionType){
//             super(data);
//             this.ft = ft;
//         }
//         protected onClickBtn(){
//             FunctionModel.openFunctionByType(this.ft);
//         }
//     }
//     /**竞技场功能面板 */
//     export class PvpOverViewFunction extends BuildOverviewFuncBase{
//         private m_pLbCount:CLabel;
//         public constructor(data:CastleOverviewConfig){
//             super(data);
//         }
//         public onUpdate(){
//             this.m_pLbCount.text = PvpArenaModel.CanChallengeCount+"";
//         }
//     }
// /**科技升级队列 */
//     export class TechnologyQueueOverViewFunction extends BuildOverviewFuncBase{
//         private m_technologyId:number;
//         private m_BuildId :number = -1;
//         public constructor(data:CastleOverviewConfig,id:number){
//             super(data);
//             this.m_BuildId = id;
//         }
//         protected init(){
//             EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_LEVEL_UP, this.updateCell, this);
//             this.setId();
//         }
//         private setId(){
//             this.m_technologyId = TechnologyModel.curUpId;
//             this.updateCell(this.m_technologyId);
//         }
//         private updateCell(tempId:number){
//             this.m_technologyId = TechnologyModel.curUpId;
//             let vo = TechnologyModel.getTechnologyById(tempId);
//             let isUp:boolean = vo&&vo.isCd||false;
//             if(isUp){
//                 this.activateCountDown(this.m_BuildId);
//                 this.setTime(vo.startTime,vo.endTime);
//             }
//             this.setCountDownEnable(isUp);
//         }
//         protected isEnd():boolean{
//             return !TechnologyModel.isCd(this.m_technologyId);
//         }
//         protected destroy(){
//             EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_LEVEL_UP, this.updateCell);            
//         }
//       }
//     /**==================================================================================================================================
//     * 建筑总览功能类型 end
//     * ==================================================================================================================================
//     */
// }

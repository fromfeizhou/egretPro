module com_main {

    /**
     * 幸运转盘
     */
    export class PayFortuneView extends CView {

        public static NAME = "PayFortuneView";

        private readonly METERIALMAXCOUNT:number = 4;

        private m_nIdex: number = 1;
        private m_nNum: number = 1;

        private m_pStart: boolean = false;
        private m_nItem: number = 0;
        private m_nTime: number = -1;

        private m_pLbSelectNum:CLabel;
        private m_pLbFreeStr:CLabel;
        private m_pCostRoot:eui.Group;
        private m_pLbCost:eui.BitmapLabel;
        private m_pLbTime:CLabel;
        private m_pTurnplareCellRoot:eui.Group;
        private m_pBtnBuy:ComButton;
        private turnplateCells:TurnplateCell[]; 
        private turnplateMaterialCells:TurnplateMaterialCell[];
        private reward:any;// valuesMessage
        private m_MainTopNew:MainTopNew;
        private selectDic:Dictionary;
        private isFreeState:boolean;

        public constructor(ty?: number) {
            super();
            this.name = PayFortuneView.NAME;
            this.initApp("pay/pay_fortune_view.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.TURN_TABLE_VIEW,
                ProtoDef.SPIN_TURN_TABLE,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.TURN_TABLE_VIEW: {
                    this.updateView()
					break;
				}
				case ProtoDef.SPIN_TURN_TABLE: {
                    debug("ProtoDef.SPIN_TURN_TABLE====>", body);
                    this.m_nItem = body.id <= 8 ? body.id : body.id - 8;
                    this.onTurnSucceed(body.message);
					break;
				}
			}
        }

        public onDestroy(): void {
            Utils.TimerManager.remove( this.updateTime, this);            
            egret.Tween.removeTweens(this.m_pTurnplareCellRoot);
            EventManager.removeEventListener(this.m_pBtnBuy);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_TUR));
            this.m_MainTopNew.setResources([PropEnum.GOLD]);
            this.m_pBtnBuy.setTitleLabel(GCode(CLEnum.AC_START));
            this.selectDic = Dictionary.create();
            // TurnplateProxy.send_TURN_TABLE_VIEW();
            this.initTurnplateCells();
            this.setCostNum();
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.buyClick)
        }

        private initTurnplateCells(){   
            this.turnplateCells = [];
            this.turnplateMaterialCells = [];            
            for(let i = 0;i < 8;i++){
                this.turnplateCells.push(this["m_pItem_"+i]);
                this.turnplateCells[i].setSelectState(false);
                this.turnplateMaterialCells.push(this["m_pMaterial"+i]);
                this.turnplateMaterialCells[i].onClickHandler = (cell)=>{
                    this.onClickCell(cell);
                }
            }    
        }

        private updateTurnplateCells(){
            let ids= TurnplateModel.getCurTurnPlateItemList();
            for(let i=0;i<ids.length;i++){
                this.turnplateCells[i].setCellId(ids[i]);
                this.turnplateMaterialCells[i].setCellId(ids[i]);
                this.isFreeState = (C.TurnTableConfig[ids[i]]&&C.TurnTableConfig[ids[i]].type ==1);
            }
        }
        /**刷新界面 */
        private updateView(){
            //test
            TurnplateModel.setCurTurnplateItemList(3);
            this.updateTurnplateCells();
        }
        //点击材料
        private onClickCell(cell:TurnplateMaterialCell){
            if(this.selectDic.count>=this.METERIALMAXCOUNT&&!this.selectDic.has(cell.getItemId())){
                EffectUtils.showTips(GCode(CLEnum.AC_CHOICE_FOUR), 1, true);
                return ;
            }
            if(cell){
                cell.onClickSuccess();
                let id = cell.getItemId();
                let num = cell.getClickNum(); 
                if(num <=0){
                    if(this.selectDic.has(id))
                        this.selectDic.del(id);
                }else
                    this.selectDic.add(id,cell);
            }
           // this.m_pLbCost.font ="font_vip_buy_fnt";
            this.setCostNum();
        }

        private setCostNum(){
            if(this.isFreeState){
                this.m_pLbCost.text = "";
                this.m_pLbFreeStr.text =GCode(CLEnum.AC_FREE);
            }else{
                let tempNum = 0;
                this.selectDic.forEach((key: number, _data: TurnplateMaterialCell) => {
                    tempNum += _data.getCurCostNum();
                }, this);
                this.m_pLbCost.text = tempNum+"";
                this.m_pLbFreeStr.text = "";                
            }
            this.m_pCostRoot.visible = !this.isFreeState;
            this.m_pLbSelectNum.text = this.selectDic.count+"/"+ this.METERIALMAXCOUNT;
        }

        private updateTime(){
            this.m_pLbTime.text = Utils.DateUtils.getCountdownStrByTimestamp(TurnplateModel.getEndTime());
           // if( TimerUtils.getServerTimeMill()>TurnplateModel.getEndTime())//主动请求后端刷新
               // TurnplateProxy.send_TURN_TABLE_VIEW();
        }

        //开始转动
        private buyClick(e: egret.Event): void {
            if (this.m_pStart)
                return;
            if(this.selectDic.count<=0){
                 EffectUtils.showTips(GCode(CLEnum.AC_CHOICE_ITEM), 1, true);
                return ;
            }
            this.m_pStart = true;
            debug("=====buyClick============");
            // TurnplateProxy.send_SPIN_TURN_TABLE();
        }

        //转盘结束
        private onTurnSucceed(reward:any){
            this.reset();                        
            this.reward = reward;
            this.m_nItem = 5;// reward.itemId;
            egret.Tween.get(this.m_pTurnplareCellRoot).wait(500).call(this.action, this);
        }
        //重置
        private reset(): void {
            for(let i=0;i<this.turnplateCells.length;i++){
                this.turnplateCells[i].setSelectState(i == 0);
            }
            this.m_nNum = 1;
            this.m_nIdex = 0;
            this.m_nItem = 0;
        }

        private action(): void {
            this.m_nNum ++;
            if (this.m_nNum == 40) {
                this.m_pStart = false;
                return;
            }
            this.onAction();
        }

        private onAction(): void {
            this.turnplateCells[this.m_nIdex].setSelectState(false);
            this.m_nIdex ++;
            if (this.m_nIdex >= 8)
                this.m_nIdex = 0;
            this.turnplateCells[this.m_nIdex].setSelectState(true);
            
            let dt = 0;
            if (this.m_nNum <= 20) {
                dt = 500 - this.m_nNum * (80 + this.m_nNum/10);
                if (dt < 100) dt = 100;
            } else {
                dt = 100 + (this.m_nNum -20) * (50 - (this.m_nNum -20)/10)
                if (this.m_nNum > 25 && this.m_nIdex == this.m_nItem) {
                    if(this.reward){
                        //Utils.open_view(TASK_UI.GET_REWARD_VIEW,this.reward); 
                        this.reward = null;
                    }
                    EffectUtils.showTips(GCodeFromat(CLEnum.AC_GET_ITEM,this.m_nItem), 1, true);
                    this.m_pStart = false;
                    return;
                }
            }
            egret.Tween.get(this.m_pTurnplareCellRoot).wait(dt).call(this.action, this);
        }
    }
}
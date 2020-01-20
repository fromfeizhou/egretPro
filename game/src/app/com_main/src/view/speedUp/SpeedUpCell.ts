module com_main {


    export class SpeedUpCell extends CComponent{
        
        private m_pItem:ComItemNew;
        private m_pSelectState:CImage;
        private m_pLbTime:CLabel;
        private m_pLbName:CLabel;
        private m_pLbNum:CLabel;

        private selectState:boolean;
        private propId:number=0;

        public get PropId():number{
            return  this.propId;
        }

        public onClick:(item:SpeedUpCell)=>void;

        public set SelectState(isShow:boolean){
            if(this.m_pSelectState)
                this.m_pSelectState.visible = isShow;
        }

        public constructor(data:number,selectState:boolean){
            super();
            this.propId = data;
            this.selectState = selectState;
            this.skinName = Utils.getSkinName("app/speed_up/SpeedUpCellSkin.exml");
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.SelectState = this.selectState;
            this.setPropInfo(this.propId);
            this.initEvent();
        }

        private initEvent(){
              EventManager.addTouchTapListener(this, this, this.onClickCell);
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        private onClickCell(){
            if(this.onClick){
                this.onClick(this);
            }
        }

        public setPropInfo(infoId:number){
            this.propId = infoId;     
            this.updateCell();
        }

        private updateCell(){
             
            let baseCfg = C.ItemConfig[this.propId];
            let propCfg = C.QuickenConfig[this.propId];

            this.m_pLbName.text = GLan(baseCfg.name);
            this.m_pLbNum.text = PropModel.getPropNum(this.propId) + "";// this.propInfo.count + "";
            this.m_pLbTime.text = Utils.DateUtils.timeToText(propCfg.reduceTime);
            this.m_pItem.setItemInfo(this.propId);
        }    
    }
}
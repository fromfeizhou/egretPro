module com_main {
	export class ArmyHeadList extends CComponent {
		private generalId :number
		
        private bg_image:eui.Image;

        private headList_group:eui.Group;
        private jiantou_group:eui.Group;
        private jiantou_image:eui.Image;  //箭头图片

        private state = 1 ; //状态1 收缩  状态2 涨开的 
        private isMoving = false; //是否在移动，移动中不给点击

        public get num() {
            return this.headList_group.numChildren;
        }

		public constructor() {
			super();
            this.skinName = Utils.getAppSkin("battle_new/gongchengzhan/army_list.exml");
		}

		
		protected childrenCreated(): void {
            super.childrenCreated();
            this.initData();
        }

        public initData(){
            this.$addEvent();
            EventManager.addTouchTapListener(this.jiantou_group, this, this.onClickJiantou); //箭头
            this.$getArmy();
        }

        protected $addEvent() {
            EventMgr.addEvent(BattleEvent.BATTLE_SIEGE_SELF, this.$getArmy, this)
        }

        protected $removeEvent() {
            EventMgr.removeEventByObject(BattleEvent.BATTLE_SIEGE_SELF, this);
        }

        public $onRemoveFromStage() {
            super.$onRemoveFromStage(false);
        }

        public onDestory(){
            this.$removeEvent();
            EventManager.removeEventListeners(this);
        }


        public onClickJiantou(){
            if(this.isMoving){
                return;
            }
            if(this.state == 1){
                this.isMoving = true;
                let tw = egret.Tween.get(this);
                tw.to({ x: 0},500,egret.Ease.sineOut);
                tw.call(()=>{
                    this.state = 2;
                    this.isMoving = false;
                    this.jiantou_image.scaleX = 1;
                });

            }else if(this.state == 2){
                this.isMoving = true;
                let tw = egret.Tween.get(this);
                tw.to({ x: 158 - this.width},500,egret.Ease.sineOut);
                tw.call(()=>{
                    this.state = 1;
                    this.isMoving = false;
                    this.jiantou_image.scaleX = -1;
                });
            }
            
        }

        protected $getArmy(data?: any) {
            if((BattleModel.isCityWar() || BattleModel.isQuene) && WorldModel.getCityWarInfo()) {
                let cityWarInfo = WorldModel.getCityWarInfo();
                const cid = WorldModel.getCityWarInfo().cityId;
                const curBattleId = BattleModel.getJoinedBattleId();
                let heros = WorldModel.getSiegeSelf();
                if (!heros || heros.length == 0) {
                    this.visible = false;
                    this.headList_group.removeChildren();
                } else {
                    if(heros.length == 1){
                        this.bg_image.visible = false;
                        this.jiantou_group.visible = false;
                        
                        this.x = 158 - this.width;
                        this.state = 1;
                    }else{
                        this.bg_image.visible = true;
                        this.jiantou_group.visible = true;
                        
                        this.x = 0;
                        this.state = 2;
                    }
                    this.visible = true;
                    this.refreshArmyList(heros.reverse());
                }

            // const cid = WorldModel.
            }else{
                this.visible = false;
                this.headList_group.removeChildren();
            }
           
        }

        public refreshArmyList(list:ItfSiegeBase[]){
            this.headList_group.removeChildren();
            for (let o of list) {
                if (o.mainGid == 0) continue;
                let army = new MyHeadRender(o);
                this.headList_group.addChild(army);
            }

            this.x = 158 - this.width;
        }

	}

    
}
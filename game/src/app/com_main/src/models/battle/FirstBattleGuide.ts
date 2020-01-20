
module com_main {
    export class FirstBattleGuide extends BaseClass{

        private squareList:CSquare[];
        private battleMap:BattleMap;
		private step: number = -1;

        public constructor() {
            super();
		}

        public start(){
			this.step = 0;
			Utils.TimerManager.doTimer(5000, 1, this.guideSetp1,this)
			let obj = SceneManager.getClass(LayerEnums.MENU, BattleView.NAME);
			if(obj){
				obj.visible = false;
			}
        }

		public checkStep(){
			if(this.step == 1){
				this.guideSetp2();
				return true;
			}else if(this.step == 2){
				this.guideSetp3();
				return true;
			}
			return false;
		}
        
		//步骤1
		private guideSetp1(){
			this.squareList = [];
			//左边英雄
			let square1 = CSquare.createId(1012,true,true);
			square1.changeStatus(CSquare_Status.STATUS_STAND);
			square1.changeDirection(CSquare_Direction.RIGHT_UP);
			square1.setXY(633,1066);
			BattleSceneMgr.getInstance().addChildToEffect(square1);
			Tween.get(square1)
			.wait(1000)
			.call(()=>{square1.changeStatus(CSquare_Status.STATUS_WALK);})
			.to({x:869,y:915},3000)
			.call(()=>{square1.changeStatus(CSquare_Status.STATUS_STAND);});
			this.squareList[1] = square1;

			//右边英雄
			let square2 = CSquare.createId(1018,true,true);
			square2.changeStatus(CSquare_Status.STATUS_STAND);
			square2.changeDirection(CSquare_Direction.LEFT_DOWN);
			square2.setXY(1127,756);
			BattleSceneMgr.getInstance().addChildToEffect(square2);
			Tween.get(square2)
			.wait(1000)
			.call(()=>{square2.changeStatus(CSquare_Status.STATUS_WALK);})
			.to({x:926,y:876},3000)
			// .call(()=>{ square2.changeStatus(CSquare_Status.STATUS_STAND);
            //             this.dialog(['{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"我奉诏领兵讨伐，应将你们屠戮殆尽。|但念你们本是我大汉子民，也是为世道所迫。|放下兵器开城受降，我可免你们一死。"}',
            //                         '{"isBone":1,"state":"right","heroId":1046,"dialog":"苍天已死黄天当立，我们才是顺天应命。|我看将军尚良心未泯，或早日皈依我太平道可免杀身之祸。"}',
            //                         '{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"那战场上见……"}'
            //             ],this.guideSetp2)});
			.call(()=>{
				com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GUIDE_WAR_PROCESS);
			})

			this.squareList[2] = square2;
			this.step = 1;
		}

		//步骤2
		private guideSetp2(){
			let square1 = this.squareList[1];
			Tween.get(square1)
			.wait(1000)
			.call(()=>{square1.changeStatus(CSquare_Status.STATUS_WALK);
					   square1.changeDirection(CSquare_Direction.LEFT_DOWN);})
			.to({x:633,y:1066},3000)
			// .call(()=>{square1.changeStatus(CSquare_Status.STATUS_STAND);
			// 		   square1.changeDirection(CSquare_Direction.RIGHT_UP);
            //             this.dialog(['{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"今日一战免不了了，都去准备一下吧。"}',
            //                         '{"isBone":1,"state":"right","heroId":1016,"dialog":"将军宅心忠厚本可免去刀兵之灾。可怜我大汉百姓了……"}',
            //                         '{"isBone":1,"state":"right","heroId":1009,"dialog":"没必要为了这些人而不快嘛。"}',
            //             ],this.guideSetp3)});
			.call(()=>{
				com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GUIDE_WAR_PROCESS);
			})
						


			let square2 = this.squareList[2] ;
			Tween.get(square2)
			.wait(1000)
			.call(()=>{square2.changeStatus(CSquare_Status.STATUS_WALK);
					   square2.changeDirection(CSquare_Direction.RIGHT_UP);})
			.to({x:1127,y:756},3000)
			.call(()=>{square2.onDestroy()
						Utils.removeFromParent(square2);
					   this.squareList[2] = null;});

			this.step = 2;
		}


		private showDialog(dialogList:string[]){
			BattleModel.setIsStopPlay(true);
			this.dialog(dialogList,()=>{BattleModel.setIsStopPlay(false);});
		}

        private dialogNum :number;
        private dialogContent:string[];
        private dialogCallback:Function;
		private callbackObj = null;
        private dialog(content:string[],callback,callbackObj?:any){
            this.dialogContent = content;
            this.dialogNum = 0;
            this.dialogCallback = callback;
			this.callbackObj = callbackObj;
            this.dialogNext();
        }
        private dialogNext(){
            if(this.dialogContent[this.dialogNum]){
                Utils.open_view(TASK_UI.GUIDE_DIALOG_VIEW, 
						this.getDialogParam(this.dialogContent[this.dialogNum],this.dialogNext));
                this.dialogNum += 1;
            }else{
				if(this.callbackObj){
					this.dialogCallback.apply(this.callbackObj);
				}else{
					this.dialogCallback();
				}
            }
        }
		//步骤3
        private guideSetp3(){
			let square1 = this.squareList[1];
			Tween.get(square1).to({alpha:0},1000)
			.call(()=>{
				Utils.removeFromParent(square1);
				this.squareList[1] = null;
			});
			// BattleProxy.startBattle(true);
			// BattleModel.setIsStopPlay(false);
			com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_START_BATTLE,null);

			let obj = SceneManager.getClass(LayerEnums.MENU, BattleView.NAME);
            obj.visible = true;

			this.step = 3;
			FightResponseUtil.play();
		}

        public destoryWall(callback:Function){
			// BattleProxy.startBattle(false);
			BattleModel.setIsStopPlay(true);
			this.dialog(['{"isBone":1,"state":"left","heroId":1033,"name":"' + RoleData.nickName + '","dialog":"给城门最后一击。"}'],callback);
			let obj = SceneManager.getClass(LayerEnums.MENU, BattleView.NAME);
            obj.visible = false;
        }

		private getDialogParam(content:any,callback1:any){
			return {stepData:{param:content,skip:false},obj:this,callback:callback1}
		}
    }
}
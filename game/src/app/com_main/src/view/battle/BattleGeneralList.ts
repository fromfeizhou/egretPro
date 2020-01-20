module com_main {
	export class BattleGeneralList extends CComponent {

		private generalList:eui.Group;

		public constructor() {
			super();
            this.skinName = Utils.getAppSkin("battle_new/top_new/battle_general_list.exml");
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage(false);
		}

		protected childrenCreated(): void {

        }

		public onDestroy(): void {
            super.onDestroy();

			//回收对象池
			for(let gHead of this.generalList.$children){
				ObjectPool.push(gHead);
			}
			this.generalList.removeChildren();
        }

		public refreshGeneralList()
		{	
			//回收对象池
			for(let gHead of this.generalList.$children){
				ObjectPool.push(gHead);
			}
			this.generalList.removeChildren();
			// if(this.generalList.$children.length > 0){
			// 	this.generalList.removeChildren();
			// 	ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
			// 	ObjectPool.push(txt);

			// }
			// this.generalList.removeChildren()
			let generalList:UnitInfoVo[] = BattleModel.getUnitListType(UnitType.GENERAL,FactionType.ATK);

			function sortFun(a,b){
				if(a.order > b.order){
					return 1;
				}else if(a.order < b.order){
					return -1;
				}else{
					return 0;
				}
			}

			generalList.sort(sortFun);

			// console.log(generalList);

			for(let unit of generalList)
			{
				let battleHead = ObjectPool.pop(BattleHeadRender,"BattleHeadRender",unit);
				// let battleHead = new BattleHeadRender(unit);
				this.generalList.addChild(battleHead);
			}
		}

		//更新头像血条
		public attrChange(data)
		{
			for(let obj of this.generalList.$children) {
				let battleHead = obj as BattleHeadRender;
				let unitId = battleHead.getUnitId();
				let flowTime = data.flowTime?data.flowTime:0;
				if(unitId == data.id && flowTime >= battleHead.flowTime )
				{
					battleHead.flowTime = flowTime;
					if(!isNull(data.hp)){
						battleHead.setHP(data.hp);
					}
					if(!isNull(data.rage)) {
						battleHead.setRage(data.rage);					
					}
				}
			}
		}
	}

    
}
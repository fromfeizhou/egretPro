module com_main {
	export class DropList extends CComponent {

		private listView: eui.List;
		private scView: eui.Scroller;

		private m_pItemTapCallback: Function;
		private m_pObject;

		private itemWidth: number = 50;
		private itemNum: number = 1;

		private spMask: egret.Shape;

		private isExpand: boolean = false;

		public constructor() {
			super();
			// this.initCom("DropList.exml");
			// this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
			this.skinName = Utils.getComSkin("DropList.exml");
			this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
		}

		private onAddStage() {

		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.spMask = new egret.Shape();
            this.spMask.graphics.beginFill(0x000000);
            this.spMask.graphics.drawRect(this.scView.x, this.scView.y, 200, 50);
            this.spMask.graphics.endFill();
            this.addChild(this.spMask);
            this.mask = this.spMask;
			
			this.refreshExpand();

			this.listView.itemRenderer = DropItem;
			this.listView.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
		}

		private refreshExpand() {
			// this.scView.viewport.scrollV = 0;
			var vh = this.itemWidth;
			if (this.isExpand) {
				// this.scView.viewport.scrollV = 0;
				// this.spMask.height = this.itemWidth * this.itemNum;
				// this.scView.viewport.height = this.itemWidth * this.itemNum;
				vh = this.itemWidth * this.itemNum;
			} else {
				// this.spMask.height = this.itemWidth;
				// this.scView.viewport.height = this.itemWidth;
				vh = this.itemWidth;
			}
			debug("this.itemNum : " + this.itemNum + " vh : " + vh + " this.scView : " + this.scView.height);

			this.spMask.graphics.clear();
			this.spMask.graphics.beginFill(0x000000);
            this.spMask.graphics.drawRect(this.scView.x, this.scView.y, 200, vh);
            this.spMask.graphics.endFill();
			
		}

		private onItemTap(e: eui.PropertyEvent) {
			// debug(this.listView.selectedItem, this.listView.selectedIndex)
			
			this.isExpand = !this.isExpand;
			this.refreshExpand();

			if (!this.isExpand) {
				this.scView.viewport.scrollV = this.listView.selectedIndex * this.itemWidth;
				if (this.m_pItemTapCallback) {
					this.m_pItemTapCallback.call(this.m_pObject, this.listView.selectedIndex);
				}
			} else {
				this.scView.viewport.scrollV = 0;
			}

			debug("sch : " + this.scView.height);
			debug("scvpv : " + this.scView.viewport.scrollV);
		}

		public setItemTapCallback(callback, object) {
			this.m_pItemTapCallback = callback;
			this.m_pObject = object;
		}

		public setArrayCollection(sourceArr: any[]) {
			var ac: eui.ArrayCollection = new eui.ArrayCollection(sourceArr);
			this.listView.dataProvider = ac
			this.itemNum = ac.length;
		}

		public showItem(index){
			this.scView.viewport.scrollV = index * this.itemWidth;
		}

	}
}
module com_main {
	export class LegionCheckCell extends CComponent {
		public static NAME = 'LegionCheckCell';
		public m_comHead: com_main.ComHeadItem;
		public m_comFightItem: com_main.ComFightItem;
		public m_labName:eui.Label;

		public constructor(data: any) {
			super();
			this.skinName = Utils.getAppSkin("common/legion/LegionCheckCellSkin.exml")
		}
		public static create(): LegionCheckCell {
			let obj = ObjectPool.pop(LegionCheckCell, "LegionCheckCell");
			return obj;
		}

		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

		}
		public setInfo(data: IHeadInfo, power: number,name:string) {
			this.m_comHead.info = data;
			this.m_comFightItem.setFight(power);
            this.m_labName.text=name;
		}
	}
}
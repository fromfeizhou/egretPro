
module com_main {
	export interface IVipPrivillRD {
		data: IKeyVal,
		level: number,
	}
	export class VipPrivilegeCell extends eui.ItemRenderer {
		public m_imgNew: com_main.CImage;
		public m_labDes: eui.Label;
		public m_imgUpState: com_main.CImage;

		private m_tData: IVipPrivillRD;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/vip/VipPrivilegeCellSkin.exml");
		}

		public $onRemoveFromStage() {
			this.onDestroy();
			super.$onRemoveFromStage();

		}
		public onDestroy() {
		}

		protected childrenCreated(): void {
			super.childrenCreated();

		}

		public dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data as IVipPrivillRD;
			let data = this.m_tData.data;
			let cfg = C.VipPrivillegesConfig[data.key];

			let value: string = cfg.valType == 0 ? data.value + "" : data.value * 100 + "";
			this.m_labDes.textFlow = Utils.htmlParser(GLanFormat(cfg.description, '<font color=#ffff99>' + value + '</font>'));
			if (this.m_tData.level >= 0) {
				let oldVal = cfg[`vip${this.m_tData.level - 1}`];
				this.m_imgNew.visible = (oldVal == 0);
			}
			// this.m_imgUpState.visible = cfg.valType == 1;
			this.m_imgUpState.visible = VipModel.checkVipPrivileUp(this.m_tData.level, data.key)
		}
	}
}
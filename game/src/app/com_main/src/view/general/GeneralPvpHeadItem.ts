module com_main {
	export class GeneralPvpHeadItem extends CComponent {
		private m_state: string;
		private m_tItem: GeneralHeadRender;

		public constructor(state: string = "arena_base") {
			super();
			this.width = 121;
			this.height = 117;
			this.m_state = state;

		}

		$onRemoveFromStage(): void {
			if (this.m_tItem) {
				this.m_tItem.onDestroy();
				this.m_tItem = null;
			}
			super.$onRemoveFromStage();
		}

		protected createChildren(): void {
			super.createChildren();
			this.m_tItem = GeneralHeadRender.create(this.m_state);
			this.addChild(this.m_tItem);
		}

		public setGenId(id: number) {
			this.m_tItem.setGenId(id);
		}


		/**设置武将信息 */
		public setGeneralArena(vo: gameProto.GeneralWinInfo, simpleData?: IGeneral) {
			if (vo) {
				this.m_tItem.setViewState("arena");
				this.m_tItem.m_pLbLv.text = vo.level + "";
				this.m_tItem.setGenViewInfo(vo.generalId, vo.level, vo.star, vo.quality);
			} else {
				if (simpleData) {
					this.m_tItem.setViewState("arena");
					this.m_tItem.m_pLbLv.text = simpleData.level + "";
					this.m_tItem.setGenViewInfo(simpleData.generalId, simpleData.level, simpleData.star, simpleData.quality);
				} else {
					this.m_tItem.setViewState("arena_base");
					this.m_tItem.Image_head.source = "icon_wj_0_png";
				}

			}

		}
	}
}
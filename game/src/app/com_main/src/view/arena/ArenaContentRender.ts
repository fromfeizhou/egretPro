module com_main {
	export class ArenaContentRender extends eui.ItemRenderer {

		public m_BackGround: com_main.CImage;
		public m_mask: com_main.CImage;
		public m_labStage: eui.BitmapLabel;
		public m_imgIcon: eui.Image;
		public m_groupItem: eui.Group;
		public m_groupBox: eui.Group;
		public m_pLbLevel: com_main.CLabel;
		public m_RecomPower: eui.BitmapLabel;
		public m_currFight: eui.Group;

		private m_state: number = 0;//当前状态
		public constructor(param?) {
			super();
			this.skinName = Utils.getAppSkin("arena/arena_content_render.exml");
		}

		public $onRemoveFromStage() {
			EventManager.removeEventListeners(this.m_groupBox);
			super.$onRemoveFromStage();
		}

		protected childrenCreated() {
			super.childrenCreated();
			// this.cacheAsBitmap = true;
		}

		protected dataChanged() {
			this.Refresh()
		}

		/**
		 * 
		 * Pass,CurStage,UnPass
		 */
		public Refresh() {
			if (this.data.cfg.id < ArenaModel.arenaId || !ArenaModel.arenaId) {
				this.currentState = "Pass";
				this.m_state = ArenaEnum.Pass;
			}
			else if (this.data.cfg.id > ArenaModel.arenaId && !ArenaModel.getAwardById(this.data.cfg.id)) {
				this.currentState = "UnPass";
				this.m_state = ArenaEnum.CurStage;
			}
			else {
				this.currentState = "CurStage";
				this.m_state = ArenaEnum.CurStage;
			}
			this.m_BackGround.source = `arena_item_stage_${this.data.cfg.background}_jpg`;
			let id = this.data.cfg.id;
			this.m_labStage.text = GCodeFromat(CLEnum.CHALL_NUM, id);
			this.m_RecomPower.text = this.data.cfg.power;
			if (this.data.cfg.isBox) {
				this.m_groupBox.visible = true;
				this.m_groupItem.visible = false;
				EventManager.addTouchScaleListener(this.m_groupBox, this, this.onBoxClick);
			} else {
				this.m_groupBox.visible = false;
				this.m_groupItem.visible = true;
				let rewardInfo: IItemInfo[];
				if (this.m_state == ArenaEnum.Pass || ArenaModel.getAwardById(this.data.cfg.id)) {
					rewardInfo = Utils.parseCommonItemJson(this.data.cfg.reward);
				} else {
					rewardInfo = Utils.parseCommonItemJsonInDrop(this.data.cfg.firstReward);
				}
				this.m_groupItem.removeChildren();
				for (let i = 0; i < rewardInfo.length; i++) {
					let item = ComItemNew.create('count');
					item.setItemInfo(rewardInfo[i].itemId, rewardInfo[i].count);
					this.m_groupItem.addChild(item);
				}
				this.validateNow();
			}
			if (ArenaModel.getAwardById(this.data.cfg.id)) {
				this.m_imgIcon.source = '';
			} else {
				this.m_imgIcon.source = 'lb_ssjl_png';
			}
			this.m_currFight.visible = this.data.cfg.id == ArenaModel.arenaId ? true : false;//当前挑战标识
		}
		private onBoxClick() {
			if (this.data.cfg) {
				let arrInfo: any;
				if (this.m_state == ArenaEnum.Pass || ArenaModel.getAwardById(this.data.cfg.id)) {
					arrInfo = this.data.cfg.reward;
				} else {
					// let tmpList: any[] = JSON.parse(this.data.cfg.firstReward);
					arrInfo = Utils.parseCommonItemJsonInDrop(this.data.cfg.firstReward);
				}
				Utils.open_view(TASK_UI.NOR_BOX_INFO_PANEL, { awards: arrInfo });
			}
		}
	}
}
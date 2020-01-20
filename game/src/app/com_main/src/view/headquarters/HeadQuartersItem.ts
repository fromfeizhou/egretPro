module com_main {
	export class HeadQuartersItem extends CComponent {

		public static NAME = 'HeadQuartersItem';

		/** 关卡配置信息 */
		private _config: ChapterConfig;
		public m_imgQuality: com_main.CImage;
		/** 头像 */
		private m_RoleHead: CImage;
		private m_mask: eui.Rect;
		/** 一星父节点 */
		private m_conStar: eui.Group;
		/** 星星背景*/
		public m_conStarBg: eui.Group;



		private m_pBtn: eui.Group;//Normal状态下用到 增加点击区域

		/** 访问器 - 当前关卡ID */
		public get CheckPointId(): number {
			if (this._config)
				return this._config.id;
			return 0;
		}

		public get IsBoss(): boolean {
			if (this._config)
				return this._config.stageType != 0;
			return false;
		}

		public constructor() {
			super();
			this.name = HeadQuartersItem.NAME;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.cacheAsBitmap = true;
		}

		/** 设置章节 */
		public SetCheckPoint(config: ChapterConfig) {
			this._config = config;
			this.Refresh();
		}

		/** 刷新界面 */
		public Refresh(): void {
			if (this._config) {
				this.Refresh_SkinState();
				this.Refresh_ItemPos();
				this.Refresh_RoleHead();
				this.Refresh_Star();
			}
		}

		/** 刷新 - 组件皮肤 */
		private Refresh_SkinState(): void {
			let curState: string = "";
			//关卡类型(0:普通关卡，1:普通Boss，2:大Boss)
			switch (this._config.stageType) {
				case 0: { curState = "Normal"; break; }
				case 1: { curState = "Boss"; break; }
				case 2: { curState = "BossEx"; break; }
			}
			if (HeadQuartersModel.isPassWar(this._config.id)) {
				curState += "Pass";
			}
			this.currentState = curState;
			this.validateNow();
			this.anchorOffsetX = this.width * 0.5;
			this.anchorOffsetY = this.height;
		}

		/** 刷新 - 组件坐标 */
		private Refresh_ItemPos(): void {
			let pos: string[] = this._config.checkPointPos.split("#");
			this.x = parseInt(pos[0]);
			this.y = parseInt(pos[1]) - 12;
		}

		/** 刷新 - Boss关卡，头像 */
		private Refresh_RoleHead(): void {
			if (this._config.stageType != 0) {
				this.m_RoleHead.mask = this.m_mask

				let firstItem = HeadQuartersModel.getFirstItem(this._config.id);
				let source = PropModel.getPropIcon(firstItem.itemId);
				let item = C.ItemConfig[firstItem.itemId];
				this.m_RoleHead.source = source;
				if (this._config.stageType == 1) {
					if (item.quality && item.quality > 0) {
						this.m_imgQuality.source = 'headQuarter' + item.quality + '_png';
					} else {
						this.m_imgQuality.source = 'tx-pt_png';
					}
				} else if (this._config.stageType == 2) {
					if (item.quality && item.quality > 0) {
						this.m_imgQuality.source = 'BossEs' + item.quality + '_png';
					} else {
						this.m_imgQuality.source = 'tx-sj_png';
					} 
				}
				Utils.isGray(this._config.id > HeadQuartersModel.getDefCopyId(this._config.chapterId), this.m_RoleHead);
			}
		}

		/** 刷新 - 星星信息 */
		private Refresh_Star(): void {
			let starNum: number = 0;
			if (this._config.stageType != 0) {
				let chapterInfo: gameProto.IChapterInfo = HeadQuartersModel.getChapterInfo(this._config.chapterId);
				if (chapterInfo && chapterInfo.checkPointInfos) {
					for (let i = 0; i < chapterInfo.checkPointInfos.length; i++) {
						let checkPoint: gameProto.ICheckPointInfo = chapterInfo.checkPointInfos[i];
						if (checkPoint && checkPoint.id == this._config.id) {
							starNum = checkPoint.condition.length;
							break;
						}
					}
				}
			}
			if (this.m_conStar) {
				for (let i = 0; i < this.m_conStar.numChildren; i++) {
					this.m_conStar.removeChildAt(i);
				}
				Utils.removeAllChild(this.m_conStar);

				if (this._config.stageType == 0) return;
				for (let i = 1; i <= 3; i++) {
					let star = new eui.Image();
					let sourceStr: string;
					if (starNum >= i) {
						sourceStr = "common_star_png";
					} else {
						sourceStr = "common_star_empty_png";
					}
					star.source = sourceStr;
					this.m_conStar.addChild(star);
				}
			}
		}
	}
}
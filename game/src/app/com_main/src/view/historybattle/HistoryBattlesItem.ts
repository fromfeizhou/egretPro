module com_main {
	export class HistoryBattlesItem extends CComponent {

		public static NAME = 'HistoryBattlesItem';

		/** 关卡配置信息 */
		private _config: HistoryWarConfig;
		public Image_head: eui.Image;
		public Image_mask: com_main.CImage;
		public m_lbMis: eui.BitmapLabel;
		public m_conStar: eui.Group;



		/** 访问器 - 当前关卡ID */
		public get CheckPointId(): number {
			if (this._config)
				return this._config.id;
			return 0;
		}



		public constructor() {
			super();
			this.name = HistoryBattlesItem.NAME;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.cacheAsBitmap = true;
		}

		/** 设置章节 */
		public SetCheckPoint(config: HistoryWarConfig) {
			this._config = config;
			this.Refresh();
		}

		/** 刷新界面 */
		public Refresh(): void {
			if (this._config) {
				Utils.isGray(this._config.id > HistoryBattleModel.getDefCopyId(), this);
				this.Refresh_ItemPos();
				this.Refresh_RoleHead();
				this.Refresh_Star();
			}
		}


		/** 刷新 - 组件坐标 */
		private Refresh_ItemPos(): void {
			let pos: string[] = this._config.checkPointPos.split("#");
			this.x = parseInt(pos[0]) - 78.5;
			this.y = parseInt(pos[1]) - 20;
		}

		/** 刷新 - Boss关卡，头像 */
		private Refresh_RoleHead(): void {
			this.Image_head.mask = this.Image_mask;
			this.Image_head.source = GeneralModel.getSoldierLogo(this._config.resRoleName);
			this.Image_mask.visible = false;
			this.m_lbMis.text = this._config.level + "";
		}

		/** 刷新 - 星星信息 */
		private Refresh_Star(): void {
			let starNum: number = 0;
			let isHasStar: boolean = false;
			let chapterInfo: gameProto.IHisChapterInfo = HistoryBattleModel.getHisoryWarInfo(this._config.chapterId);
			if (chapterInfo && chapterInfo.LevelInfos) {
				for (let i = 0; i < chapterInfo.LevelInfos.length; i++) {
					let checkPoint: gameProto.IHisLevelInfo = chapterInfo.LevelInfos[i];
					if (checkPoint && checkPoint.id == this._config.id) {
						starNum = checkPoint.star;
						isHasStar = true;
						break;
					}
				}
			}

			if (this.m_conStar) {
				for (let i = 0; i < this.m_conStar.numChildren; i++) {
					this.m_conStar.removeChildAt(i);
				}
				Utils.removeAllChild(this.m_conStar);
				if (!isHasStar) return;
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
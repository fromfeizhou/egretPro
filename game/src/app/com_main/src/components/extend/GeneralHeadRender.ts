module com_main {
	export class GeneralHeadRender extends CComponent {

		public Image_back_di: eui.Image;
		public Image_head: eui.Image;
		public Image_mask: eui.Image;
		public lb_name_before: eui.Label;
		public m_group_start: eui.Group;	//星星
		public m_group_startbg: eui.Group;	//星星
		public m_nStarType: number;		//星星品质
		public Image_type: eui.Image;
		public m_pLbLv: com_main.CLabel;
		public m_pRoot: eui.Group;

		/**上阵ui */
		protected m_pProTroops: eui.Image;
		protected m_pLbTroops: eui.Label;

		public m_generalId = 0;
		public m_generalVo: GeneralVo;

		public static create(state: string) {
			let obj = ObjectPool.pop(GeneralHeadRender, "GeneralHeadRender", state);
			obj.commitProperties();
			return obj;
		}

		/**对象池回收 */
		public onPoolClear() {
			this.setSkin(null)
		}

		$onRemoveFromStage(): void {
			this.$setParent(null);
			Utils.isGray(false,this.Image_head);
			ObjectPool.push(this);
			super.$onRemoveFromStage(false);
		}

		public onDestroy() {
			if(this.$parent == null) return;
			Utils.removeFromParent(this);
			super.onDestroy();
		}

		public constructor(state: string) {
			super();
			this.skinName = Utils.getSkinName("components/com_general_head_render.exml");
			this.init(state);
		}

		public init(state: string = 'base') {
			NodeUtils.reset(this);
			this.currentState = state;
			this.commitProperties();
		}

		protected createChildren(): void {
			super.createChildren();
			this.Image_head.mask = this.Image_mask;
			// this.m_pRoot.cacheAsBitmap = true;
		}

		/**刷新士兵存量进度 
         * @param 当前数量 num
         * @param 最大数量 maxNum
         * @param 是否上阵 isOnBatt
        */
		public refreshArmyPro(num: number, maxNum: number, isOnBatt: boolean = false) {
			if (isOnBatt) {
				this.m_pLbTroops.text = `${num}`;
				this.m_pProTroops.visible = true;
				let per = num / maxNum;
				this.m_pProTroops.scaleX = per > 1 ? 1 : per;
			} else {
				this.m_pLbTroops.text = `${maxNum}`;
				this.m_pProTroops.visible = false;
			}
		}
		/**玩家拥有的武将 */
		public setGenId(id: number) {
			this.m_generalId = id;
			this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
			this.refresh();
		}

		/**非玩家拥有 */
		public setGenViewInfo(generalId: number, level: number = 1, starNum: number = 0, qualityLevel?: number, name?: string) {
			let cfg = C.GeneralConfig[generalId];
			if (!cfg) return;
			if (this.Image_type) {
				this.Image_type.source = GeneralModel.getSoldierTypeIcon(cfg.generalOccupation, 2);
			}
			qualityLevel = qualityLevel || cfg.qualityLevel;
			name = name || GLan(cfg.name);

			this.Image_head.source = GeneralModel.getSoldierLogo(cfg.role);
			this.lb_name_before.text = name;
			this.lb_name_before.textColor = GeneralModel.getGeneralQualityColor(qualityLevel);
			this.m_pLbLv.text = GCodeFromat(CLEnum.LEVEL1, level);

			this.Image_back_di.source = GeneralModel.getComHeadItemBgByQuality(qualityLevel);
			this.refreshStar(starNum);
		}

		public refresh() {
			if (!this.m_generalVo) {
				this.Image_head.source = GeneralModel.getSoldierLogo('0');
				this.Image_back_di.source = GeneralModel.getComHeadItemBgByQuality(0);
				return;
			}
			this.setGenViewInfo(this.m_generalId, this.m_generalVo.level, this.m_generalVo.star, this.m_generalVo.quality);

		}

		/**刷新星星 */
		public refreshStar(starNum: number) {
			this.m_group_start.visible = starNum > 0;
			this.m_group_startbg.visible = starNum > 0;
			let startCfg = GeneralModel.getStarCfg(starNum);
			let starCount = startCfg.starlevel;
			let res = GeneralModel.getStarRes(startCfg.starType);
			this.refreshStarBg(startCfg.starType);
			while (this.m_group_start.numChildren > starCount) {
				this.m_group_start.removeChildAt(0);
			}
			for (let i = this.m_group_start.numChildren; i < starCount; i++) {
				let star = new eui.Image(res);
				star.width = 23;
				star.height = 23;
				this.m_group_start.addChild(star);
			}

		}

		/**刷新星星背景 */
		public refreshStarBg(type: number) {
			// if (this.m_nStarType == type) {
			// 	return;
			// }
			this.m_nStarType = type;
			Utils.removeAllChild(this.m_group_startbg);
			Utils.removeAllChild(this.m_group_start);
			let res = GeneralModel.getStarBgRes(this.m_nStarType);
			for (let i = 0; i < 5; i++) {
				let star = new eui.Image(res);
				star.width = 23;
				star.height = 23;
				this.m_group_startbg.addChild(star);
			}
		}

		public showName() {
			this.lb_name_before.visible = true;
		}

		public setViewState(state: string) {
			if (this.currentState != state) {
				this.currentState = state;
				this.commitProperties();
			}

		}
	}
}
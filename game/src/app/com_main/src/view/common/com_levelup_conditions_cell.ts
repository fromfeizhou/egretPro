
enum LvUpConditionsType {

	Item = 1,
	Build = 2,
	Technology = 3,
}



module com_main {
	/**
	 * 升级条件cell  后续删除building_conditions_cell 
	 */
	export class com_levelup_conditions_cell extends eui.ItemRenderer {
		private m_pBtnGoto: eui.Group;
		private m_icon: com_main.CImage;
		private m_imageIsCan: com_main.CImage;
		private m_pLbDesc: com_main.CLabel;
		private m_pBtnGotoName: com_main.ComButton


		private conditionInfo: LvUpConditionsBaseInfo;


		public constructor(conditionInfo?: LvUpConditionsBaseInfo) {
			super();
			this.touchChildren = true;
			this.skinName = Utils.getAppSkin("common/com_levelup_conditions_skin.exml");
			this.conditionInfo = conditionInfo;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_pBtnGoto, this, this.onClickHundler);
			if (!this.data && this.conditionInfo) {
				this.data = this.conditionInfo;
				this.dataChanged();
			}
		}
		private onClickHundler(e) {

			if (this.data) {
				this.data.onClickGotoBtn();
			}
		}

		$onRemoveFromStage(): void {
			EventManager.removeEventListeners(this);
			super.$onRemoveFromStage();
		}

		//外部设置数据
		public setConditionInfo(info) {
			this.conditionInfo = info;
			if (this.conditionInfo != this.data) {
				this.data = this.conditionInfo;
				this.dataChanged();
				this.visible = true;
			}

		}

		protected dataChanged(): void {
			super.dataChanged();
			if (this.data) {
				//this.data.update(this.m_icon,this.m_pLbDesc,this.m_imageIsCan,this.m_pBtnGoto);
				this.m_pBtnGotoName.setTitleLabel(this.data.getTip());
				this.m_icon.source = this.data.getIconPath();
				this.m_pLbDesc.textFlow =Utils.htmlParser(this.data.getDescStr());
				let tempIsCan = this.data.getIsCan();
				// this.m_pLbDesc.textColor = tempIsCan ? GameConfig.TextColors.white : GameConfig.TextColors.red;
				this.m_pBtnGoto.visible = !tempIsCan;
				if (this.data.width) this.width = this.data.width;
			}
		}

		public isMatch(): boolean {
			if (this.data) {
				return this.data.IsMatch;
			}
			return false;
		}

	}






	//基本材料类型限制
	export class LvUpConditionsBaseInfo {

		protected itemId: number;
		protected descStr: string;
		protected needNum: number;
		protected isCan: boolean;
		protected width: number;
		protected btnTip: string;
		public constructor(id: number, needNum: number, desc?: string, width: number = 500) {
			this.descStr = desc;
			this.needNum = Math.ceil(needNum);
			this.itemId = id;
			this.width = width;
			this.btnTip = GCode(CLEnum.GO_GET);
		}

		public getTip(): string {
			return this.btnTip;
		}

		public getDescStr(): string {
			let count = RoleData.GetMaterialNumById(this.itemId);
			if (count >= this.needNum) {
				return `${this.needNum}`;
			} else {
				return `<font color = #ff0000>${this.needNum}</font>`;
			}
		}

		public getIsCan(): boolean {
			return RoleData.GetMaterialNumById(this.itemId) >= this.needNum;
		}

		public getIconPath(): string {
			return RoleData.GetMaterialIconPathById(this.itemId);
		}

		public getWidth(): number {
			return this.width;
		}

		public setWidth(w: number) {
			this.width = w;
		}

		public get IsMatch(): boolean {
			if (this.getIsCan()) {
				return true;
			} else {
				this.onUnMatch();
			}
			return false;
		}

		public onUnMatch() {
			let desc = "";
			switch (this.itemId) {
				case PropEnum.GOLD: {//金币
					desc = GCode(CLEnum.GOLD_LESS);
					break;
				}
				case PropEnum.FOOD: {//粮食
					desc = GCode(CLEnum.FOOD_LESS);
					break;
				}
				case PropEnum.SILVER: {//银两
					desc = GCode(CLEnum.SILVER_LESS);

					break;
				}
				case PropEnum.WOOD: {//木材
					desc = GCode(CLEnum.WOOD_LESS);
					break;
				}
				case PropEnum.IRON: {//铁
					desc = GCode(CLEnum.IRON_LESS);
					break;
				}
			}
			EffectUtils.showTips(desc, 1, true);
		}


		public onClickGotoBtn() {
			let panelId = 0;
			switch (this.itemId) {
				case PropEnum.GOLD: {//金币
					break;
				}
				case PropEnum.FOOD: {//粮食
					QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.FOOD);
					break;
				}
				case PropEnum.SILVER: {//银两
					QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.SILVER);
					//Utils.open_view(panelId);
					break;
				}
				case PropEnum.WOOD: {//木材
					QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.WOOD);
					break;
				}
				case PropEnum.IRON: {//铁
					QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(PropEnum.IRON);
					break;
				}
			}
		}
	}

	//建筑等级类型限制//(id是建筑类型)
	export class LvUpConditionsBuildInfo extends LvUpConditionsBaseInfo {

		private typeId: number = 0;//建筑类型
		private buildNum: number = 1;//需要几个建筑满足条件
		private needLv: number = 0;//需要多少等级建筑满足条件
		public constructor(id: number, needLv: number, buildNum = 1) {
			super(id, needLv)
			this.typeId = id;
			this.buildNum = buildNum;
			this.needLv = needLv;
			this.descStr = this.getDescStr();
			this.btnTip = GCode(CLEnum.GO_TECHNO);
		}

		public getDescStr(): string {
			let desc = "";
			let tempName = GLan(MainMapModel.getBunildCfgByType(this.itemId).name);
			let finifhNum = MainMapModel.getBuildNumByLvAndType(this.itemId, this.needNum);
			if (this.buildNum <= 1) {
				if (this.typeId == BuildingType.AUDIENCE_HALL) {
					if (MainMapModel.getHallLevel() < this.needLv) {
						desc = GCodeFromat(CLEnum.CITY_BD_NEED_FAL, tempName, this.needNum);
					} else {
						desc = GCodeFromat(CLEnum.CITY_BD_NEED, tempName, this.needNum);
					}
				} else {
					let build = MainMapModel.getBuildInfobyType(this.itemId);
					let lv = MainMapModel.getBuildInfo(build)?MainMapModel.getBuildInfo(build).level:0;
					if (lv < this.needLv) {
						desc = GCodeFromat(CLEnum.CITY_BD_NEED_FAL, tempName, this.needNum);
					}
					else {
						desc = GCodeFromat(CLEnum.CITY_BD_NEED, tempName, this.needNum);
					}
				}

			} else
				desc = GCodeFromat(CLEnum.CITY_BD_NEED_FAL1, this.buildNum, tempName, this.needNum, finifhNum, this.buildNum);
			return desc;
		}

		public getIsCan(): boolean {
			return MainMapModel.getBuildNumByLvAndType(this.itemId, this.needNum) >= this.buildNum;
		}

		public getIconPath(): string {
			return "icon_build_png";
		}

		public onClickGotoBtn() {
			let buildId = MainMapModel.getMaxLimitLvBuildIdByType(this.itemId, this.needNum);
			if (buildId == -1) {
				buildId = MainMapModel.getNotActivaBuildId(this.itemId);
				if (MainMapModel.hasBuild(buildId)) {
					MainMapModel.clearBuildViewIdStack();
					//主城界面跳转建筑
					if (SceneManager.isCityScene()) {
						com_main.UpManager.close();
						com_main.MainMap.moveToBuild(buildId);
					} else {
						EffectUtils.showTips(GCode(CLEnum.CITY_BD_LOCK1), 1, true);
					}
				} else {
					EffectUtils.showTips(GCode(CLEnum.CITY_BD_NO), 1, true);
				}
				return;
			}

			//只要大殿限制应该用id稳妥
			if (MainMapModel.isInBuilding(buildId)) {
				FunctionModel.openFunctionByType(FunctionType.BUILDING_GRADE_SPEED, buildId);
			} else {
				Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, buildId);
			}
		}

		public onUnMatch() {
			let tempName = GLan(MainMapModel.getBunildCfgByType(this.itemId).name);
			let desc = tempName + GCode(CLEnum.LEVEL_LESS);
			EffectUtils.showTips(desc, 1, true);
		}
	}

	//建筑队列类型限制
	export class LvUpConditionsBuildQueueInfo extends LvUpConditionsBaseInfo {
		private stateImage: CImage;
		private btn: ComButton;

		public constructor(id: number) {
			super(id, 0, "");
			this.btnTip = GCode(CLEnum.GO_SPEED);
		}

		public getDescStr(): string {
			return GCodeFromat(CLEnum.CITY_BD_IN1,GLan(C.BuildingConfig[this.itemId].name));
		}

		public getIsCan(): boolean {
			return false;
		}

		public getIconPath(): string {
			return "icon_build_png";
		}

		public onUnMatch() {
			let desc = GCode(CLEnum.CITY_BD_QUE_MAX);
			EffectUtils.showTips(desc, 1, true);
		}

		public onClickGotoBtn() {
			if (!MainMapModel.isInBuilding(this.itemId)) {
				Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, this.itemId);
				return;
			}
			FunctionModel.openFunctionByType(FunctionType.BUILDING_GRADE_SPEED, this.itemId);
		}
	}

	//君主升级类型限制
	export class LvUpConditionsMonarchInfo extends LvUpConditionsBaseInfo {
		private stateImage: CImage;
		private btn: ComButton;

		public constructor(leve: number) {
			super(0, leve, "");
			this.btnTip = GCode(CLEnum.GO_LEVEL);
		}

		public getDescStr(): string {
			let name = GCode(CLEnum.MONACH);
			let desc: string = ""
			if (RoleData.level < this.needNum) {
				desc = GCodeFromat(CLEnum.LEVEL_NEED_FAL,name,this.needNum);
			} else {
				desc =  GCodeFromat(CLEnum.LEVEL_NEED,name,this.needNum);
			}
			return desc;
		}

		public getIsCan(): boolean {
			return RoleData.level >= this.needNum;
		}


		public getIconPath(): string {
			return "icon_build_png";
		}
		public onClickGotoBtn() {
			EffectUtils.showTips('通关挂机副本可获得大量君主经验！', 1, true);
		}

		public onUnMatch() {
			EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LEVEL,this.needNum), 1, true);
		}
	}

	//科技类型限制
	export class LvUpConditionsTechnologyInfo extends LvUpConditionsBaseInfo {

		public constructor(id: number, needLv: number) {
			super(id, needLv, "");
			this.btnTip = GCode(CLEnum.GO_LEVEL);
		}

		public getDescStr(): string {
			let name = GLan(C.TechnologyConfig[this.itemId].name);
			let techVO = TechnoModel.getTechVoById(this.itemId);
			let desc: string = ""
			if (techVO.level < this.needNum) {
				desc = GCodeFromat(CLEnum.LEVEL_NEED_FAL,name,this.needNum);
			} else {
				desc = GCodeFromat(CLEnum.LEVEL_NEED,name,this.needNum);
			}
			return desc;
		}

		public getIsCan(): boolean {
			let techVO = TechnoModel.getTechVoById(this.itemId);
			let isCan = !techVO || techVO.level >= this.needNum;
			return isCan;
		}

		public getIconPath(): string {
			return "Image_tavern_book_png";
		}

		public onClickGotoBtn() {
			EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH, this.itemId);
		}


		public onUnMatch() {
			let desc = GCode(CLEnum.TEC_BE_LESS);
			EffectUtils.showTips(desc, 1, true);
		}
	}

}

interface LevelUp_conditions_Interface {
	conditionType: LvUpConditionsType;
	iconPath: string;
	desc: string;
	isCan: boolean;
}
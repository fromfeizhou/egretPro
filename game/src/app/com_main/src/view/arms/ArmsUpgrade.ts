module com_main {
	/**
	 * 军备进阶面板
	 */
	export class ArmsUpgrade extends CComponent implements IArmsTabView {
		public static NAME = 'ArmsUpgrade';

		public m_pLbTitle: com_main.CLabel;
		public m_materialList: eui.List;
		public m_consumeGroup: eui.Group;
		public m_consumeIcon: com_main.CImage;
		public m_consumeValue: com_main.CLabel;
		public m_btnUp: com_main.ComButton;

		private m_pArrayCollection: eui.ArrayCollection;
		private m_nGradeLv: number;
		private m_nArmyType: SoldierMainType;
		private m_buildTrainCfg: BuildingTrainConfig;
		// private m_ArmyConfig: GeneralSoldierLvConfig;
		private m_costInfos: IItemInfo[];
		public constructor() {
			super();
			this.name = ArmsWnd.NAME;
			this.skinName = Utils.getAppSkin('arms/ArmsUpgradeSkin.exml');
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			this.removeEvent()
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_pArrayCollection = new eui.ArrayCollection([]);
			this.m_materialList.itemRenderer = SoldierUpComsumeCell;
			this.m_materialList.dataProvider = this.m_pArrayCollection;

			this.m_btnUp.setTitleLabel(GCode(CLEnum.GRADE_UP));
			this.addEvent();

		}

		/**切换兵种 */
		public changeType(type: SoldierMainType) {
			this.m_nArmyType = type;
			let buildId = MainMapModel.getBuildInfoBySolider(this.m_nArmyType).id;
			this.m_buildTrainCfg = MainMapModel.getBuildingTrainCfgbyBuildId(buildId);
			this.refreshView();
		}

		/**刷新界面 */
		public refreshView(): void {
			let curCfg = MainMapModel.getSoldierLvCfg(this.m_nArmyType);
			this.m_nGradeLv = TeamModel.getTroopsInfo(this.m_nArmyType).level;

			let armyProgressConfig = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv);
			if (armyProgressConfig == null) { //80级的时候
				armyProgressConfig = TeamModel.getArmyProgressConfig(this.m_nArmyType, 1);
			}
			this.m_costInfos = Utils.parseCommonItemJson(armyProgressConfig.coumses);

			this.m_pLbTitle.text = GLan(curCfg.name) + GCode(CLEnum.GRADE) + this.m_nGradeLv;
			//列表数据
			this.setList();
			//材料数据
			this.updateCosumeGroup();
			//材料消耗
			this.updateCosumeText();
		}


		/**属性显示 */
		private setList(): void {
			let data = [];
			//当前阶 加成属性
			let curCfg = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv);
			let curAttris = StringUtils.keyValsToNumber(curCfg.attribute);
			//下一阶加成属性
			let nextCfg = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv + 1);
			let nextAttris = nextCfg != null ? StringUtils.keyValsToNumber(nextCfg.attribute) : {};
			//等级配置属性
			let levelCfg = MainMapModel.getSoldierLvCfg(this.m_nArmyType);
			let baseAttri = StringUtils.keyValsToNumber(levelCfg.attribute);

			for (let key in curAttris) {
				let attType = Number(key);
				let val = Utils.getAttriValByType(baseAttri, attType) + Utils.getAttriValByType(curAttris, attType);
				let next = Utils.getAttriValByType(baseAttri, attType) + Utils.getAttriValByType(nextAttris, attType);
				data.push({
					key: key, curParm: Utils.getAttriNameByType(attType),
					icon: Utils.getAttriIcon(attType), curAtt: val, preAtt: next
				});
			}

			this.m_pArrayCollection.replaceAll(data);
		}

		private updateCosumeGroup() {
			let costInfos = this.m_costInfos.slice(1, this.m_costInfos.length);
			while (this.m_consumeGroup.numChildren > costInfos.length) {
				this.m_consumeGroup.removeChildAt(0);
			}
			for (let i = 0; i < costInfos.length; i++) {
				let info = costInfos[i];
				let item: ComItemNew = null;
				if (i < this.m_consumeGroup.numChildren) {
					item = this.m_consumeGroup.getChildAt(i) as ComItemNew;
				} else {
					item = ComItemNew.create("count");
					this.m_consumeGroup.addChild(item);
				}
				item.setItemInfo(info.itemId)
				item.refresVal2Max(PropModel.getPropNum(info.itemId), info.count);
			}
		}


		private updateCosumeText() {
			let type = this.m_costInfos[0].itemId;
			let comsumeValue = this.m_costInfos[0].count;
			this.m_consumeIcon.source = RoleData.GetMaterialIconPathById(type);
			this.m_consumeValue.text = CommonUtils.numOutLenght(RoleData.silver) + "/" + comsumeValue;
			this.m_consumeValue.textColor = RoleData.silver < comsumeValue ?
				GameConfig.TextColors.red : GameConfig.TextColors.fontWhite
			//885A2A
			this.m_consumeValue.strokeColor = RoleData.silver < comsumeValue ?
				0X000000 : 0X885A2A;
		}


		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private addEvent() {
			EventManager.addTouchScaleListener(this.m_btnUp, this, this.onUp);
			EventMgr.addEvent(BuildEvent.SOLDIER_UPGRADE, this.onFinishUpgrade, this);
			EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
			EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
		}

		private removeEvent() {
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(BuildEvent.SOLDIER_UPGRADE, this);
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
			EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
		}

		/**资源刷新 */
		private onRoleResource(sourceId: PropEnum) {
			if (!this.m_nArmyType) return;
			this.updateCosumeText();
		}

		/**道具变动 */
		private onItemChange() {
			if (!this.m_nArmyType) return;
			this.updateCosumeGroup();
		}

		private onUp(e): void {
			if (!PropModel.isItemListEnough(this.m_costInfos, 3)) return;

			let cfg = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv + 1);
			if (!cfg) {
				EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX), 1, true);
			}
			let maxLv = MainMapModel.getSoliderBuildLvByType(this.m_nArmyType) + 10;
			if (this.m_nGradeLv > maxLv) {
				EffectUtils.showTips(GCode(CLEnum.ARMY_GRADE_FAL), 1, true);
				return;
			}
			SoldierProxy.send_ARMY_UPGRADE_LEVEL(this.m_nArmyType);
		}
		private onFinishUpgrade(param: any): void {
			// armyType: number, level: number
			if (this.m_nArmyType != param.armyType) return;
			this.m_nGradeLv = TeamModel.getTroopsInfo(this.m_nArmyType).level;
			this.refreshView();
		}
		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

	}

}
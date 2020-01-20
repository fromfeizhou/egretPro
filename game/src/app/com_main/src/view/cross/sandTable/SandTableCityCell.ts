module com_main {
	/**沙盘城市 */
	export class SandTableCityCell extends CComponent {
		public static NAME = 'SandTableCityCell';

		public m_pRoot: eui.Group;
		public m_pPanel: com_main.CImage;
		public m_labName: com_main.CLabel;

		private m_capComp: CaptureFlagCell;
		private m_ofItem: OwnFlagItem;
		private m_imgWar: com_main.CImage;
		private m_pBattleEffect: MCDragonBones;
		private m_data: ISandTableCity = null;
		// 占领标志偏移位置
		private static flagOffset: { [key: string]: { hCenter: number, vCenter: number } } = {
			"city_1": { hCenter: -100, vCenter: -20 },
			"city_2": { hCenter: -80, vCenter: -20 },
			"city_3": { hCenter: -60, vCenter: -10 },
			"city_4": { hCenter: -60, vCenter: -10 },
		};

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("cross/sandTable/SandTableCityCellSkin.exml");
			this.name = SandTableCityCell.NAME;
		}

		protected childrenCreated() {
			super.childrenCreated();
			// this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
			this.addEvent();
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.m_data = null;
			this.clearUI();
			this.removeEvent();
			super.onDestroy();
		}

		private clearUI() {
			if (this.m_pBattleEffect) {
				NormalMcMgr.removeMc(this.m_pBattleEffect);
				this.m_pBattleEffect = null;
			}
			Utils.removeFromParent(this.m_capComp);
			Utils.removeFromParent(this.m_ofItem);
			Utils.removeFromParent(this.m_imgWar);
		}

		/**添加监听事件 */
		private addEvent() {
			EventManager.addTouchScaleListener(this, this, () => {
				console.log("m_data", this.m_data);
				Utils.open_view(TASK_UI.CROSS_SERVER_CITY_TIPS, this.m_data);
			});
		}

		/**移除监听事件 */
		private removeEvent() {
			EventManager.removeEventListeners(this);
		}

		public initData(data: any) {
			if (isNull(data)) return;
			this.m_data = data;

			this.m_labName.text = this.m_data.cityName;
			// 添加占领标志
			if (this.m_data.isCapture) {
				let serverId = PlatConst.zoneId;
				let svo = CrossModel.getWarsandServerVo(this.m_data.servers, serverId);
				let isOwn = svo && svo.status == 2;
				if (isNull(this.m_capComp)) {
					this.m_capComp = new CaptureFlagCell();
					this.m_capComp.initData(this.m_data);
					this.m_capComp.refreshCurrentState(isOwn ? "own" : "other");
					this.addCaptureFlag(this.m_capComp);
				}
				if (isOwn) {
					if (isNull(this.m_ofItem)) {
						this.m_ofItem = new OwnFlagItem();
						this.addEmperorHead(this.m_ofItem);
					}
				} else {
					Utils.removeFromParent(this.m_ofItem);
				}
			} else {
				Utils.removeFromParent(this.m_capComp);
			}

			// 添加交战图标
			if (this.m_data.atWar) {
				if (isNull(this.m_imgWar)) this.addAtWarFlag();
			} else {
				Utils.removeFromParent(this.m_imgWar);
			}
		}

		/**添加占领标志 */
		public addCaptureFlag(object: CComponent | egret.DisplayObjectContainer) {
			if (this.m_pRoot && object) {
				this.m_pRoot.addChild(object as CaptureFlagCell);
				if (object instanceof CComponent) {
					let centerOffset = SandTableCityCell.flagOffset[this.currentState];
					object.horizontalCenter = centerOffset.hCenter;
					object.verticalCenter = centerOffset.vCenter;
				}
			}
		}

		/**添加本服皇帝头像 */
		public addEmperorHead(object: CComponent | egret.DisplayObjectContainer) {
			if (this.m_pRoot && object) {
				this.m_pRoot.addChild(object as OwnFlagItem);
				if (object instanceof OwnFlagItem) {
					object.horizontalCenter = 0;
					object.y = -20;
				}
			}
		}

		/**添加交战图标 */
		public addAtWarFlag() {
			if (isNull(this.m_pRoot)) return;

			// 添加战火动画
			let isWar = CrossModel.crossStatus == CrossServerState.WALL_WAR ||
						CrossModel.crossStatus == CrossServerState.CITY_WAR;
			if (isWar) this.addBattleEffect();

			// 图标
			this.m_imgWar = new com_main.CImage();
			this.m_imgWar.source = "tb_j_png";
			this.m_imgWar.width = this.m_imgWar.height = 64;
			this.m_pRoot.addChild(this.m_imgWar);
			this.m_imgWar.horizontalCenter = 0;
			this.m_imgWar.y = -20;
		}

		private addBattleEffect() {
			if (this.m_pBattleEffect) return;

			this.validateNow();
			let data = this.m_data;
			this.m_pBattleEffect = NormalMcMgr.createMc(IETypes.EWORLD_City_Fire, false);
			if (this.currentState == "city_1") {
				this.m_pBattleEffect.play(`zhanhuo${3}`);
			} else if (this.currentState == "city_2") {
				this.m_pBattleEffect.play(`zhanhuo${3}`);
			} else if (this.currentState == "city_3") {
				this.m_pBattleEffect.play(`zhanhuo${1}`);
			} else if (this.currentState == "city_4") {
				this.m_pBattleEffect.play(`zhanhuo${2}`);
			}
			this.m_pRoot.addChild(this.m_pBattleEffect);
			NodeUtils.setPosition(this.m_pBattleEffect, this.m_pRoot.width / 2, this.m_pRoot.height / 2);
			NodeUtils.setScale(this.m_pBattleEffect, 0.6);
		}
	}


	/**沙盘城市占领标志 */
	export class CaptureFlagCell extends CComponent {
		public static NAME = 'CaptureFlagCell';

		public m_labServer: eui.Label;

		private m_data: ISandTableCity = null;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("cross/sandTable/CaptureFlagCellSkin.exml");
			this.name = CaptureFlagCell.NAME;
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.m_data = null;
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		public initData(data: any) {
			if (isNull(data)) return;
			this.m_data = data;

			this.refreshServerName();
		}

		public refreshServerName() {
			// let len = this.m_data.servers.reduce((pre, cur) => {
			// 	return pre + cur.status == 2 ? 1 : 0;
			// }, 0);
			let len = 0;
			this.m_data.servers.forEach((v, i, a) => {
				if (v.status == 2) len += 1;
			});
			this.m_labServer.text = len + "个服";
		}

		public refreshCurrentState(state: string = "own") {
			this.currentState = state;
		}
	}

	/**本服占领 */
	export class OwnFlagItem extends CComponent {
		public static NAME = 'OwnFlagItem';

		protected m_tItem: ComHeadItem;
		protected m_labFlag: CLabel;

		public constructor() {
			super();
			this.name = OwnFlagItem.NAME;
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.m_tItem.onDestroy();
			super.onDestroy();
		}

		protected createChildren(): void {
			super.createChildren();

			this.m_tItem = new ComHeadItem();
			this.m_tItem.scaleX = this.m_tItem.scaleY = 0.6;
			this.addChild(this.m_tItem);
			this.setHeadInfo(null);

			this.m_labFlag = new CLabel();
			this.m_labFlag.size = 16;
			this.m_labFlag.bold = true;
			this.m_labFlag.textColor = 0xfdff73;
			this.m_labFlag.stroke = 2;
			this.m_labFlag.strokeColor = 0x290d00;
			this.addChild(this.m_labFlag);
			this.m_labFlag.horizontalCenter = 0;
			this.m_labFlag.bottom = 0;
			this.m_labFlag.text = "本服占领";
		}

		public setHeadInfo(val: IHeadInfo) {
			if (isNull(val)) {
				val = { type: RoleData.headType, url: RoleData.headId.toString() };
			}
			if (isNull(this.m_tItem)) return;
			this.m_tItem.info = val;
			this.m_tItem.refreshIconView();
		}
	}

	/**跨服战战场buff图标 */
	export class CrossBuffIconCell extends CComponent {
		public m_labName: eui.Label;
		public m_imgSkillIcon: eui.Image;
		public m_groupLv: eui.Group;
		public m_labLevel: com_main.CLabel;

		public constructor(param?: any) {
			super();
			this.skinName = Utils.getAppSkin("general/General_skill_icon_view.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.currentState = "basebuff";
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		/**设置icon */
		public setIcon(icon: string | egret.Texture, isGray: boolean = true) {
			this.m_imgSkillIcon.source = icon;
			Utils.isGray(isGray, this.m_imgSkillIcon);
		}

		/**设置名字 */
		public setName(name: string = "") {
			this.m_labName.text = "Lv." + name;
		}
	}

	/**跨服战战场 */
	export class CrossBuffCell extends CComponent {
		public m_labTitle: com_main.CLabel;
		public m_labDesc: com_main.CLabel;
		public m_btnUpgrade: com_main.ComCostButton;
		public m_pIcon: com_main.CrossBuffIconCell;

		private m_data: any;

		public constructor(param?: any) {
			super();
			this.skinName = Utils.getAppSkin("cross/sandTable/CrossBuffCellSkin.exml");
			this.m_data = param;
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
			this.addEvent();
		}

		public onDestroy(): void {
			this.removeEvent();
			super.onDestroy();
		}

		/**添加监听事件 */
		private addEvent() {
			EventManager.addTouchScaleListener(this.m_btnUpgrade, this, () => {
				console.log("m_data 升级buff===>", this.m_data);
				let type = this.m_data.type;
				if (type === 1) {
					error("个人Buff升级===>");
				} else if (type === 2) {
					error("全服Buff升级===>");
				}
				CrossProxy.C2S_CROSS_SERVER_BUY_BUFFER(type);
				this.refreshView();
			});
		}

		/**移除监听事件 */
		private removeEvent() {
			EventManager.removeEventListeners(this);
		}

		/**初始化界面数据 */
		public initViewData(data: { type: number, level: number, icon: string, name: string, cost: number, desc: string }) {
			if (isNull(data)) return;

			this.m_data = data;
			this.m_labTitle.text = data.name;
			this.m_labDesc.textFlow = Utils.htmlParser(data.desc);
			this.m_btnUpgrade.setCostLabel(data.cost + "");
			this.m_pIcon.setIcon(data.icon + "_png", false);
			this.m_pIcon.setName(data.level + "");
		}

		/**刷新数据 */
		public refreshView() {
			this.m_data.cost += 10;
			this.m_data.level += 1;
			this.m_labDesc.textFlow = Utils.htmlParser(this.m_data.desc);
			this.m_btnUpgrade.setCostLabel(this.m_data.cost + "");
			this.m_pIcon.setName(this.m_data.level + "");
		}

	}
}
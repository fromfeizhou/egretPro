module com_main {
	/**
	 * 建筑功能入口
	 */
	export class BuildFunctionMenu extends CComponent {

		private m_buildId: number;
		private m_build: MBuild;
		private m_bg: CImage;
		private m_cellList: BuildFunctionMenuCell[];

		public constructor(buildId: number) {
			super();
			this.skinName = Utils.getAppSkin("build/BuildFunctionMenuSkin.exml");
			this.m_buildId = buildId;
		}

		public onDestroy(): void {
			egret.Tween.removeTweens(this.m_bg);
			Utils.removeFromParent(this);
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_cellList = [];
		}

		public check_Click(x: number, y: number): boolean {
			for (let index = 0; index < this.m_cellList.length; index++) {
				let cell = this.m_cellList[index];
				if (cell.visible) {
					if (cell.m_pIcon.hitTestPoint(x, y, true)) {
						this.onClickCell(cell.getCellType());
						return true;
					}
				}
			}
			return false;
		}

		//点击
		private onClickCell(type: number) {
			if (!this.m_build)
				return;
			//待整理
			// switch(type){
			// 	case FunctionType.FT_BBY:
			// 	case FunctionType.FT_QBY:	
			// 	case FunctionType.FT_GBY:{
			// 		if(this.m_build.getBuildSoldierPPState()){
			// 			//SoldierProxy.send_GET_TRAIN_ARMY(this.m_buildId);
			// 		}
			// 		break;
			// 	}
			// }
			// FunctionModel.openFunctionByType(type,this.m_buildId);
			//FunctionManager.openFunctionViewByType(type,C.BuildingConfig[this.m_buildId].type);
			this.hideView();
			MainMap.m_pLastSelectBuild = this.m_buildId;
			MainMap.moveToBuildUI(this.m_buildId);
		}
		//设置面板数据
		public setBuild(build: MBuild) {
			if (build) {
				this.m_build = build;
				this.m_buildId = build.getBuildId();
				this.updateView();
			} else {
				this.hideView();
				this.m_build = null;
			}
		}
		//刷新界面
		private updateView() {
			this.x = this.m_build.x;
			this.y = this.m_build.y + this.m_build.height / 2;
			let namePos = this.m_build.getPosInfo();
			this.x += namePos.nameOffset[0];
			if (this.m_buildId == MBuildId.HALL_BUILD_ID)
				this.y -= 100;



			let arr: number[] = MainMapModel.getOpenRK(this.m_build.getBuildId());
			let posList = this.getRKPos(arr.length);
			let time = 0;
			let add_time = 80;
			let move_time = 200;
			let index = 0;
			this.setBgTween(true);
			for (; index < arr.length; index++) {

				let cell: BuildFunctionMenuCell = this.m_cellList[index];
				if (!cell) {
					cell = new BuildFunctionMenuCell(this.m_buildId);
					this.m_cellList[index] = cell;
					Utils.addChild(this, cell);
				}
				cell.updateView(arr[index], index);
				// if(cell.getCellType() == -1){ //出现-1的情况下，说明必须要去领取才能显示其他的操作
				// 	this.m_cellList.splice(index,1);
				// 	Utils.removeFromParent(cell);
				// 	posList = this.getRKPos(arr.length-1);
				// 	arr.splice(index,1);
				// 	index = index -2;
				// 	continue;
				// }
				cell.visible = true;
				cell.anchorOffsetX = cell.width / 2;
				cell.anchorOffsetY = cell.height / 2;

				cell.scaleX = 0;
				cell.scaleY = 0;
				cell.alpha = 0;

				cell.x = this.width * 0.5;
				cell.y = 0;
				let pos = posList[index];
				egret.Tween.removeTweens(cell);
				egret.Tween.get(cell).wait(time).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1, alpha: 1 }, move_time).call(() => {
					// this.m_pPKNum -= 1;
					// if (this.m_pPKNum == 0) {
					// 	GuideUI.onMove();
					// }
				}, this);
				time += add_time;
				this.m_build.isGlow(true);

				// if (this.m_build.getPPIcon())
				// 	this.m_build.getPPIcon().visible = false;
				this.m_build.showName(false);
			}
			for (; index < this.m_cellList.length; index++) {
				this.m_cellList[index].visible = false;
			}
		}
		//设置bg动画
		private setBgTween(isShow: boolean) {
			egret.Tween.removeTweens(this.m_bg);
			if (isShow) {
				egret.Tween.get(this.m_bg).to({ alpha: 1 }, 500);

			} else {
				egret.Tween.get(this.m_bg).to({ alpha: 0 }, 500).call(this.onDestroy, this);
			}
		}
		//隐藏界面
		public hideView() {

			if (this.m_build) {
				this.setBgTween(false);
				let time = 0;
				let add_time = 80;
				let move_time = 200;
				let index = 0;

				let cells = this.m_cellList;
				let tempx = this.width * 0.5;
				let tempy = 0;

				for (index = 0; index < cells.length; index++) {
					let cell = cells[index];
					if (cell.visible) {
						egret.Tween.removeTweens(cell);
						egret.Tween.get(cell).wait(time).to({ x: tempx, y: tempy, scaleX: 0, scaleY: 0, alpha: 0 }, move_time).call(() => {
							//Utils.removeFromParent(cell);
						}, this);

						time += add_time;
					}
				}
				this.m_build.isGlow(false);
				// this.m_build.checkOutput();
				this.m_build.showName(true);
			}
		}

		public getRKPos(iconlen: number): any {
			let posArray = [];
			switch (iconlen) {

				case 1: {
					posArray.push({ x: 242, y: 119 });
					break;
				}
				case 2: {
					posArray.push({ x: 175, y: 110 });
					posArray.push({ x: 309, y: 110 });
					break;
				}
				case 3: {
					posArray.push({ x: 242, y: 119 });
					posArray.push({ x: 146, y: 105 });
					posArray.push({ x: 338, y: 105 });
					break;
				}
				default: {
					posArray.push({ x: 98, y: 76 });
					posArray.push({ x: 187, y: 115 });
					posArray.push({ x: 297, y: 115 });
					posArray.push({ x: 386, y: 76 });

					break;
				}
			}
			return posArray;
		}

		public getBuild() {
			return this.m_build;
		}

		//获取入口按钮
		public getCellByIndex(index: number): CImage {

			if (index < this.m_cellList.length) {
				return this.m_cellList[index].m_pIcon;
			}
			return null;;
		}
	}

	export class BuildFunctionMenuCell extends CComponent {

		private buildId: number;
		public m_pIcon: CImage;
		// public m_pName: eui.Label;//名字
		private functionId: number = 0;
		public constructor(buildId?: number) {
			super();
			this.skinName = Utils.getAppSkin("build/BuildFunctionMenuCellSkin.exml");
			this.buildId = buildId;
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		public getCellType(): number {
			return this.functionId;
		}

		public updateView(id: number, pos: number) {
			let switchId = id;
			switch (id) {
				case FunctionType.BUILDING_GRADE: {
					switchId = MainMapModel.isInBuilding(this.buildId) ? FunctionType.BUILDING_GRADE_SPEED : id;
					break;
				}
				// case FunctionType.FT_BBY:{
				// 	switchId = MainMapModel.isInTrain(this.buildId)?FunctionType.FT_BBY_SPEED_UP:id;//this.swicthSliderTarnType(,id,);
				// 	break;
				// }
				// case FunctionType.FT_QBY:{
				// 	switchId = MainMapModel.isInTrain(this.buildId)?FunctionType.FT_QBY_SPEED_UP:id;				
				// 	break;
				// }
				// case FunctionType.FT_GBY:{
				// 	switchId =MainMapModel.isInTrain(this.buildId)?FunctionType.FT_GBY_SPEED_UP:id;
				// 	break;
				// }
				// case FunctionType.FT_GBY:{
				// 	switchId =MainMapModel.isInTrain(this.buildId)?FunctionType.FT_GBY_SPEED_UP:id;
				// 	break;
				// }
				// case FunctionType.FT_KILL_BANDITS:{
				// 	switchId =MainMapModel.isOutput(this.buildId)?FunctionType.FT_FATROL_GET_REWORD:id;
				// 	break;
				// }


			}
			this.functionId = switchId;
			let cfgData = C.FunctionConfig[this.functionId];
			if (cfgData) {
				let btnCfg = C.FunctionBtnConfig[cfgData.btnType];
				if (btnCfg)
					this.m_pIcon.source = btnCfg.iconName + "_png";//.texture = Utils.getPopTitleIcon(this.functionId);
				 // this.m_pName.text = cfgData.name;               //不显示建筑文本
			}
		}
	}
}

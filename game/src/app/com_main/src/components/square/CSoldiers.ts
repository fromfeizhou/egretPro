module com_main {
	/**
	 * 方阵管理
	 */
	export class CSoldiers extends UnitActor {
		/**
		 * 方阵配置ID
		 */
		private m_pCID: number = 0;

		/**
		 * 方阵类型
		 */
		private m_pType: number = CSquare_Type.TYPE_1;

		/**
		 * 旗帜
		 * 1 : 红,敌方 
		 * 2 : 绿,友方
		 * 3 : 蓝,己方
		 */
		private m_flagEffectId: number = 1;

		/**
		 * 兵种编号
		 */
		private m_pSoldiersCode: number = 0;

		/**
		 * 临时兵种信息
		 */
		private m_pTempSoldiers: any = { code: 0, x: 0, y: 0 };

		/**
		 * 士兵图片列表
		 */
		private m_pSoldiersList: Array<egret.Bitmap> = [];

		/**
		 * 已阵亡士兵列表
		 */
		private m_pSoldiersDeadList: Array<egret.Bitmap> = [];

		/**
		 * 图片帧处理类
		 */
		private m_pSpriteAnimates: com_main.CSquareAnimation = null;

		/**
		 * 士兵层
		 */
		private m_pSoliderNode: egret.DisplayObjectContainer = null;

	


		/**
		 * 当前状态
		 */
		public m_pStatus: number = CSquare_Status.STATUS_STAND;

		/**
		 * 方向
		 * 
		 * 	5  6  7
		 * 	4     8
		 * 	3  2  1
		 *  8个方向
		 */
		private m_pDirection: number = CSquare_Direction.RIGHT;

		/**
		 * 状态动作播放完后的回调
		 */
		private m_pActionFinishCallback: Function = null;

		/**
		 * 回调对象
		 */
		private m_pActionFinishObject: any = null;


		/**
		 * 帧频类型
		 */
		private m_fpsType = 0;

		/**
		 * 士兵纹理集
		 */
		private m_textureSheet: any = {};


		/**创建特效 */
		private m_pFrameEffect: FrameExecutor;


		/**是否完成资源加载 */
		private m_isResLoadComplete: boolean = false;

		/**信息显示容器*/
		protected m_pContainerLevel1: egret.DisplayObjectContainer;


		/**模型配置信息*/
		private modelConfig: ArmyModelConfig;
		/**攻击动画*/
		private attackEffect: CEffect;

		/**士兵位置列表*/
		private soldierPositionList = [];

		/**先前朝向 up down 用于左右判断 */
		private m_oldDirection: CSquare_Direction;

		/**待执行的方向转换 */
		private m_toPerformDirection: CSquare_Direction;
		/**待执行的状态转换 */
		private m_toPerformStatus: CSquare_Status;

		public getFourDirection() {
			return CSquareFunc.getFourDirection(this.m_pDirection, this.m_oldDirection);
		}

		public static createId(cid: number): CSoldiers {
			let obj = new com_main.CSoldiers();
			obj.initId(cid);
			return obj;
		}

		/**
		 * data.num = 方正类型	
		 */
		public constructor() {
			super();
			this.init();
		}

		public init() {
			this.m_pWidth = Square_Width;
			this.m_pHeight = Square_Height;
			this.width = Square_Width;
			this.height = Square_Height;
			super.init();
			this.alpha = 1;
			//添加了屏幕外隐藏功能需要这句
			this.visible = true;
			this.soldierPositionList = [];
		}

		public initId(cid?: number) {
			this.m_pCID = cid;
			this.width = Square_Width;
			this.height = Square_Height;
			if (this.m_pCID > 0) {
				this.initConfig();
				// this.drawDiamond();
			}
		}


		protected initContainer() {
			if (!this.m_pContainerLevel1) {
				this.m_pContainerLevel1 = new egret.DisplayObjectContainer();
				// this.m_pContainerLevel1.width = this.width;
				// this.m_pContainerLevel1.height = this.height;
				Utils.addChild(this, this.m_pContainerLevel1);
			}

			//显示在最上面
			super.initContainer();
		}


		public getId() {
			return this.id;
		}

		/**
		 * 销毁方法
		 */
		public onDestroy() {
			super.onDestroy();
			this.onCleanup();
		}

		public onCleanup() {
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.removeAction();
				this.m_pSpriteAnimates = null;
			}

			if (this.m_pSoliderNode) {
				Utils.removeFromParent(this.m_pSoliderNode);
				this.m_pSoliderNode = null;
			}

			if (this.m_pContainerLevel1) {
				Utils.removeFromParent(this.m_pContainerLevel1);
				this.m_pContainerLevel1 = null;
			}
			

			this.m_textureSheet = null;
			this.m_isResLoadComplete = false;

			Utils.TimerManager.removeAll(this);
			egret.Tween.removeTweens(this);
			Utils.removeFromParent(this);

			this.modelConfig = null;
			this.soldierPositionList = [];
		}


		/**
		 * 获取配置
		 */
		public initConfig() {
			this.m_isResLoadComplete = false;
			this.m_toPerformDirection = null;
			this.m_toPerformStatus = null;
			this.modelConfig = CSquareMgr.getIns().modelConfig[this.m_pCID];
			let config = this.modelConfig;
			let code = config["code"];
			let path = "soldier_" + code + "_json"; //Soldier_ResPath + "soldier_" + code + ".json";
			RES.getResAsync(path, (sheets: egret.SpriteSheet) => {
				if (!this.parent) return;
				try {
					var texture: any = sheets._textureMap;
					this.m_textureSheet = {};
					for (var name in texture) {
						this.m_textureSheet[name] = texture[name];
					}

					this.m_isResLoadComplete = true;
					if (config)
						this.initSquare(config["code"], config["grid"]);
					else
						error("兵种id : " + this.m_pCID + " 兵种模型配置表中没有该项数据！");

					if (this.m_toPerformDirection)
						this.changeDirection(this.m_toPerformDirection);
					if (this.m_toPerformStatus)
						this.changeStatus(this.m_toPerformStatus);

				} catch (e) {
					error(e);
				}
			}, this);

		}

		/**
		 * 初始化方阵
		 */
		private initSquare(code: number, type: CSquare_Type) {
			this.m_pType = type;
			this.m_pSoldiersCode = code;
			this.m_pStatus = CSquare_Status.STATUS_STAND;
			this.m_pDirection = CSquare_Direction.RIGHT;

			if (this.m_pSoliderNode == null) {
				this.m_pSoliderNode = new egret.DisplayObjectContainer();
				Utils.addChild(this.m_pContainerLevel1, this.m_pSoliderNode);
			}

			let actionName = this.packageActionName(null, CSquare_Direction.RIGHT, CSquare_Status.STATUS_STAND);
			this.createSoldiers(this.m_pSoldiersCode, this.m_pType, actionName);
			if (this.m_pSpriteAnimates == null) {
				this.m_pSpriteAnimates = CSquareAnimation.create(this.m_pSoldiersList, actionName, 5);
				this.m_pSpriteAnimates.setAnimation(this.getSoldierTexture()/*CSquareMgr.getIns().animTexture*/);
			} else {
				this.m_pSpriteAnimates.cleanFrameAnimList();
				this.m_pSpriteAnimates.spriteList = this.m_pSoldiersList;
				this.m_pSpriteAnimates.setAnimation(this.getSoldierTexture());
			}

		}
		public changeHp(teamVo:TeamVo) {
			
		}


		private getSoldierTexture() {
			if (!this.m_textureSheet) this.m_textureSheet = {};
			return this.m_textureSheet;
		}

		/**
		 * 创建士兵
		 */
		private createSoldiers(code: number, type: CSquare_Type, actionName: string) {
			let typeInfo = CSquareFunc.getSquareGrid(type);

			let grid = typeInfo["grid"];
			let row = typeInfo["row"];

			let len = grid.length;
			let animRes = this.getSoldierTexture();
			let offset = this.getActionAnchor(actionName);

			let midWidth = this.width * 0.5;
			let midHeight = this.height * 0.5;


			let comfig = CSquareFunc.getPositionListConfig(this.m_pStatus, this.m_pCID, this.m_pDirection);
			if (!comfig && type != CSquare_Type.TYPE_1) {
				error("创建方阵配置表出错");
				return;
			}

			for (let i: number = 0; i < len; i++) {
				let pos: number = grid[i];
				if (pos != 0) {
					let animTexture: egret.Texture = animRes[actionName + "_0"];
					let soldier = this.m_pSoldiersList[pos - 1];
					if (!soldier) {
						soldier = Utils.DisplayUtils.createBitmap(animTexture);
						this.m_pSoldiersList[pos - 1] = soldier;
					} else {
						soldier.texture = animTexture;
					}

					Utils.addChild(this.m_pSoliderNode, soldier);
					soldier.anchorOffsetX = offset["anchorOffsetX"];
					soldier.anchorOffsetY = offset["anchorOffsetY"];

					if (type != CSquare_Type.TYPE_1) {
						let positionList = comfig["soldier_" + pos].split(",");
						let posx = Number(positionList[0]);
						let posy = Number(positionList[1]);
						soldier.x = posx;
						soldier.y = posy;
					} else {
						soldier.x = midWidth;
						soldier.y = midHeight;
					}
					this.soldierPositionList[pos - 1] = new egret.Point(soldier.x, soldier.y);
				}
			}


		}



		/**
		 * 刷新当前动作
		 */
		private refreshAction(index?: number, direction?: CSquare_Direction, status?: CSquare_Status): void {
			if (!this.m_isResLoadComplete) return;
			let actionName: string = this.packageActionName(null, direction, status);
			status = status || this.m_pStatus;
			let actionData = { "direction": direction, "status": status, "uid": this.getId(), "data": this.getUnitInfo() };
			this.resetSoldiesAnchor(actionName, index);
			this.changeFps(this.getActionFps(actionName));
			// debug("test---> " + this.m_pUnitInfo.name + " : action die " + " index : " + index + "   status :" + status);
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.runActionByName(actionName, index, false, null, null,
					this.getKeyFrame(actionName), this.onKeyFrameCallback, this, actionData, status);
			} else {
				error("this.m_pSpriteAnimates is null");
			}
			this.flipByDirection(index, direction);
		}

		/**
		 * 根据方向决定士兵的翻转
		 */
		private flipByDirection(index?: number, direction?: CSquare_Direction): void {
			direction = direction || this.m_pDirection;
			let len = this.m_pSoldiersList.length;
			if (CSquare_Direction.LEFT_UP == direction ||
				CSquare_Direction.LEFT == direction ||
				CSquare_Direction.LEFT_DOWN == direction ||
				CSquare_Direction.DOWN == direction) {
				if (index != null && index != undefined) {
					this.m_pSoldiersList[index].scaleX = -Soldier_Scale;
				} else {
					for (let i: number = 0; i < len; i++) {
						this.m_pSoldiersList[i].scaleX = -Soldier_Scale;
					}
				}
			} else {
				if (index != null && index != undefined) {
					this.m_pSoldiersList[index].scaleX = Soldier_Scale;
				} else {
					for (let i: number = 0; i < len; i++) {
						this.m_pSoldiersList[i].scaleX = Soldier_Scale;
					}
				}

			}
		}



		/**
		 * 根据动作名获取要派发事件的关键帧
		 */
		private getKeyFrame(actionName: string): number {
			let config = this.getActionAnchor(actionName);
			return config["keyFrame"];
		}

		private onKeyFrameCallback(actionName: string, data: any): void {

		}



		/**
		 * 获取动作的配置锚点
		 */
		private getActionAnchor(actionName: string): any {
			return CSquareMgr.getIns().animAnchor[actionName] || { "anchorOffsetX": 0, "anchorOffsetY": 0 };
		}


		/**
		 * 重设锚点
		 */
		private resetSoldiesAnchor(actionName: string, index?: number): void {
			let offset = this.getActionAnchor(actionName);
			let offsetX = offset["anchorOffsetX"];
			let offsetY = offset["anchorOffsetY"];

			if (index != null && index != undefined) {
				let soldier = this.m_pSoldiersList[index];
				soldier.anchorOffsetX = offsetX;
				soldier.anchorOffsetY = offsetY;
			} else {
				let len = this.m_pSoldiersList.length;
				for (let i: number = 0; i < len; i++) {
					if (!this.m_pSoldiersDeadList[i]) {
						let soldier = this.m_pSoldiersList[i];
						soldier.anchorOffsetX = offsetX;
						soldier.anchorOffsetY = offsetY;
					}
				}
			}

		}

		/**
		 * 获取动作的播放帧速
		 */
		private getActionFps(actionName: string): number {
			let fps = null;
			let data = CSquareMgr.getIns().getAnimAnchor(actionName);
			if (data) {
				fps = data.fps;
				if (this.m_fpsType == 1) {
					fps = data.fps2;
				}
			}
			if (!fps) fps = 8;
			return fps;
		}

		/**
		 * 组装动作名
		 */
		private packageActionName(code?: number, direction?: CSquare_Direction, status?: CSquare_Status): string {
			let actionName: string = "";
			actionName += code || this.m_pSoldiersCode;
			actionName += "_";
			actionName += CSquareFunc.getActionCharByDirection(direction || this.m_pDirection, this.m_oldDirection);
			actionName += "_";
			actionName += CSquareFunc.getActionCharByStatus(status || this.m_pStatus);
			return actionName;
		}

		/**
		 * 设置帧频
		 */
		public set fpsType(v) {
			if (!this.m_isResLoadComplete) return;
			this.m_fpsType = v;
			let actionName = this.packageActionName();
			let fps = this.getActionFps(actionName);
			this.changeFps(fps);
		}

		/**
		 * 获取帧频
		 */
		public get fps() {
			if (this.m_pSpriteAnimates) {
				return this.m_pSpriteAnimates.getFps();
			}
			debug("CSquare:fps------>>: this.m_pSpriteAnimates is " + this.m_pSpriteAnimates);
			return 0;
		}

		/**
		 * 设置帧频
		 */
		public set fps(v) {
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.setFps(v);
			} else {
				debug("CSquare:fps------>>: this.m_pSpriteAnimates is " + this.m_pSpriteAnimates);
			}
		}

		/**
		 * 改变播放帧速
		 */
		private changeFps(fps) {
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.setFps(fps);
			}
		}

		/**
		 * 改变方向
		 */
		public changeDirection(direction: CSquare_Direction): void {
			if (!this.m_isResLoadComplete) this.m_toPerformDirection = direction;

			if (this.m_pDirection != direction) {
				let status = null;

				this.m_pDirection = direction;  //整体朝向才赋值
				if (direction == CSquare_Direction.UP || direction == CSquare_Direction.RIGHT_UP || direction == CSquare_Direction.LEFT_UP) {
					this.m_oldDirection = CSquare_Direction.UP;
				} else if (direction == CSquare_Direction.DOWN || direction == CSquare_Direction.RIGHT_DOWN || direction == CSquare_Direction.LEFT_DOWN) {
					this.m_oldDirection = CSquare_Direction.DOWN;
				}

				this.refreshAction(null, direction, status);
			}
		}

		/**改变状态 */
		public changeStatus(status: CSquare_Status, index?: number, targetNumber?: number): void {
			if (!this.m_isResLoadComplete) {
				this.m_toPerformStatus = status;
			}
			if ((this.m_pStatus != status || status == CSquare_Status.STATUS_ATTACK) &&
				(this.m_pStatus != CSquare_Status.STATUS_DEAD)) {
				if (index == null || index == undefined) this.m_pStatus = status;
				this.refreshAction(index, null, status);
			}
		}


	}
}
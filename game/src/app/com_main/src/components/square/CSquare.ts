module com_main {
	/**
	 * 方阵管理
	 */
	export class CSquare extends UnitActor {
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

		// /**
		//  * 已阵亡士兵列表
		//  */
		// private m_pSoldiersDeadList: Array<egret.Bitmap> = [];

		/**
		 * 图片帧处理类
		 */
		private m_pSpriteAnimates: com_main.CSquareAnimation = null;

		/**
		 * 士兵层
		 */
		private m_pSoliderNode: egret.DisplayObjectContainer = null;

		/**
		 * 身体中点特效层
		 */
		private m_pEffectNode: egret.DisplayObjectContainer = null;

		/**
		 * 头顶特效层
		 */
		private m_pEffectTopNode: egret.DisplayObjectContainer = null;

		/**
		 * 脚底特效层
		 */
		private m_pEffectFootNode: egret.DisplayObjectContainer = null;

		/**
		 * 其它信息层
		 */
		private m_pOtherInfoNode: egret.DisplayObjectContainer = null;

		/**
		 * 特效列表
		 */
		private m_pEffectList: any = {};

		/**
		 * 头像
		 */
		private m_pHeadInfo: BattleGeneralHeadInfo = null;

		/**
		 * 小兵血条
		 */
		private m_pSoliderHpBar: BattleSoldierHpBar = null;

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
		 * 是否反面
		 */
		private m_pIsReverse: boolean = false;

		/**
		 * 状态动作播放完后的回调
		 */
		private m_pActionFinishCallback: Function = null;

		/**
		 * 回调对象
		 */
		private m_pActionFinishObject: any = null;

		/**
		 * 士兵数量
		 */
		private m_soldieNum = 0;
		/**
		 * 总士兵数量
		 */
		private m_totalSoldierNum = 0;

		/**
		 * 最大高度
		 */
		private m_maxHeight = 0;

		/**
		 * 最大宽度
		 */
		private m_maxWidth = 0;

		/**
		 * 帧频类型
		 */
		private m_fpsType = 0;

		/**
		 * 士兵纹理集
		 */
		private m_textureSheet: any = {};


		/**
		 * 仅动画
		 */
		private m_justAnim: boolean = false;


		/**创建特效 */
		private m_pFrameEffect: FrameExecutor;


		/**是否完成资源加载 */
		private m_isResLoadComplete: boolean = false;

		/**待执行的方向转换 */
		private m_toPerformDirection: CSquare_Direction;
		/**待执行的状态转换 */
		private m_toPerformStatus: CSquare_Status;
		/**待添加的特效 */
		private m_toAddEffect: any = {};


		/**信息显示容器*/
		protected m_pContainerLevel1: egret.DisplayObjectContainer;
		/**信息显示容器*/
		protected m_pContainerLevel2: egret.DisplayObjectContainer;
		/**信息显示容器*/
		protected m_pContainerLevel3: egret.DisplayObjectContainer;

		/**是英雄还是小兵队列*/
		public m_unitType: UnitType;
		/**模型配置信息*/
		private modelConfig: ArmyModelConfig;
		/**攻击动画*/
		private attackEffect: CEffect;

		/**
		 * 展示用
		 */
		private isManual: boolean = false;

		/**先前朝向 up down 用于左右判断 */
		private m_oldDirection: CSquare_Direction;

		/**
		 * buff 列表 
		 * 有三个bug列表
		 */
		// private buffList: any[][];

		// private buffImageList: any[];

		private isHitEffect = false;

		/**是否逃跑中 */
		private isRunAway: boolean = false;

		public isStartSkill = false;
		public m_isLife: boolean;
		/**是否克制 */
		public isRestrain:boolean;
		private isStop ;
		/**地图坐标 */
		public m_mapPos;
		/**溃败字体 */
		public m_lRun;

		public set manual(v) {
			this.isManual = v;
		}

		public get manual() {
			return this.isManual;
		}

		/**
		 * 测试用
		 */
		private isTest: boolean = false;
		public set test(v) {
			this.isTest = v;
		}

		public get maxWidth() {
			return this.m_maxWidth;
		}

		public get maxHeight() {
			return this.m_maxHeight;
		}


		public set justAnim(v) {
			this.m_justAnim = v;
		}

		public set isLive(is: boolean){
			this.m_isLife = is;
		}

		public get isLive(){
			return this.m_isLife;
		}

		/**是否逃跑 */
		public get isRun(){
			return this.isRunAway;
		}

		public get CID(){
			return this.m_pCID;
		}

		public static create(vo: UnitInfoVo): CSquare {
			let obj: CSquare = new com_main.CSquare(vo);
			return obj;
		}

		public static createId(cid: number, anim: boolean = true, manual: boolean = false): CSquare {
			// let obj: CSquare = ObjectPool.pop("com_main.CSquare");
			let obj = new com_main.CSquare();
			obj.justAnim = anim;
			obj.manual = manual;
			obj.initId(cid);
			// obj.init();
			return obj;
		}


		/**
		 * data.num = 方正类型	
		 */
		public constructor(vo?: UnitInfoVo) {
			super();
			this.init(vo);
		}

		public init(vo?: UnitInfoVo) {
			this.m_pWidth = Square_Width;
			this.m_pHeight = Square_Height;
			this.width = Square_Width;
			this.height = Square_Height;
			this.m_pFrameEffect = FrameExecutor.create();
			super.init();
			this.alpha = 1;
			//添加了屏幕外隐藏功能需要这句
			this.visible = true;

			if (vo) {
				this.m_unitType = vo.type;
			}

			this.setUnitInfo(vo);
			if (this.getUnitInfo()) {
				// this.addTitle();   //显示血条
				// this.addBarBlood();
				this.initConfig();
			}

			// this.soldierPositionList = [];

			// if (this.getUnitInfo()) {
			// 	this.initConfig();
			// 	// this.drawDiamond();
			// 	// this.drawRect();
			// }
			// this.drawRect();
			// this.buffList = [];
			// this.buffList[BuffType.HEAD_ONEC_BUFF] = [];
			// this.buffList[BuffType.HEAD_CONTINUE_BUFF] = [];
			// this.buffList[BuffType.BODY_CONTINUE_BUFF] = [];

			// this.buffImageList = [];
			this.isHitEffect = false;

			if(this.m_unitType == UnitType.GENERAL || this.justAnim || this.manual){
				this.showHeadInfo();
			}

			if(this.m_unitType == UnitType.GENERAL){
				this.scaleX = this.scaleY = ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SCALE);
			}else if(this.m_unitType == UnitType.SOLDIER){
				this.scaleX = this.scaleY = ConstUtil.getValue(IConstEnum.BATTLE_SOLIDER_SCALE);
			}

			this.isStartSkill = false;
			this.isLive = true;
			this.isRunAway = false;
			this.isRestrain = false;
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
				Utils.addChild(this, this.m_pContainerLevel1);
			}
			if (!this.m_pContainerLevel2) {
				this.m_pContainerLevel2 = new egret.DisplayObjectContainer();
				Utils.addChild(this, this.m_pContainerLevel2);
			}
			if (!this.m_pContainerLevel3) {
				this.m_pContainerLevel3 = new egret.DisplayObjectContainer();
				Utils.addChild(this, this.m_pContainerLevel3);
			}

			//身体中点特效
			if (this.m_pEffectNode == null) {
				this.m_pEffectNode = new egret.DisplayObjectContainer();
				Utils.addChild(this.m_pContainerLevel2, this.m_pEffectNode);
			}

			//头顶特效节点
			if (this.m_pEffectTopNode == null) {
				this.m_pEffectTopNode = new egret.DisplayObjectContainer();
				Utils.addChild(this.m_pContainerLevel2, this.m_pEffectTopNode);
			}

			//脚底特效节点
			if (this.m_pEffectFootNode == null) {
				this.m_pEffectFootNode = new egret.DisplayObjectContainer();
				Utils.addChild(this.m_pContainerLevel1, this.m_pEffectFootNode);
			}

			//其它信息层
			if (this.m_pOtherInfoNode == null) {
				this.m_pOtherInfoNode = new egret.DisplayObjectContainer();
				// this.addChild(this.m_pOtherInfoNode);
				Utils.addChild(this.m_pContainerLevel3, this.m_pOtherInfoNode);
			}


			//显示在最上面
			// super.initContainer();
		}

		public reset(vo?: UnitInfoVo) {
			egret.Tween.removeTweens(this);
			// this.onCleanup();
			this.init(vo);
			let effect: CEffect = CEffectFunc.addEffect(9);
			effect.x = this.x;
			effect.y = this.y;
			effect.play();
		}

		public getId() {
			return this.id;
		}

		/**因为addChild时候不派发事件，所以要在外部调用 */
		public onAddToStage() {
			super.onAddToStage();
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
			if (this.m_pEffectNode) {
				Utils.removeFromParent(this.m_pEffectNode);
				this.m_pEffectNode = null;
			}
			if (this.m_pEffectTopNode) {
				Utils.removeFromParent(this.m_pEffectTopNode);
				this.m_pEffectTopNode = null;
			}

			if (this.m_pEffectFootNode) {
				Utils.removeFromParent(this.m_pEffectFootNode);
				this.m_pEffectFootNode = null;
			}

			if (this.m_pOtherInfoNode) {
				Utils.removeFromParent(this.m_pOtherInfoNode);
				this.m_pOtherInfoNode = null;
			}
			if (this.m_pHeadInfo) {
				Utils.removeFromParent(this.m_pHeadInfo);
				this.m_pHeadInfo = null;
			}

			if (this.m_pSoliderHpBar){
				this.m_pSoliderHpBar.onDestroy();
				this.m_pSoliderHpBar = null;
			}

			if (this.m_pContainerLevel1) {
				Utils.removeFromParent(this.m_pContainerLevel1);
				this.m_pContainerLevel1 = null;
			}
			if (this.m_pContainerLevel2) {
				Utils.removeFromParent(this.m_pContainerLevel2);
				this.m_pContainerLevel2 = null;
			}
			if (this.m_pContainerLevel3) {
				Utils.removeFromParent(this.m_pContainerLevel3);
				this.m_pContainerLevel3 = null;
			}

			if (this.m_pFrameEffect) {
				this.m_pFrameEffect.onDestroy();
				this.m_pFrameEffect = null;
			}
			this.m_textureSheet = null;

			this.m_toPerformDirection = null;
			this.m_toPerformStatus = null;
			this.m_isResLoadComplete = false;


			this.cleanAllEffect();
			this.cleanSoldier();

			Utils.TimerManager.removeAll(this);
			egret.Tween.removeTweens(this);
			Utils.removeFromParent(this);

			this.modelConfig = null;

			// this.soldierPositionList = [];
			// this.soldierTweenTarget = [];
			// this.soldierTweenStep = [];
			// this.tweenTime = 0;
			// this.maxTime = 0;

			// this.buffList[BuffType.HEAD_ONEC_BUFF] = [];
			// this.buffList[BuffType.HEAD_CONTINUE_BUFF] = [];
			// this.buffList[BuffType.BODY_CONTINUE_BUFF] = [];

			// this.buffImageList = [];

			this.m_soldieNum = 0;
			this.m_totalSoldierNum = 0;
			this.m_maxHeight = 0;
			this.m_maxWidth = 0;

			this.m_unitType == null;
			this.isLive = false;
			this.isRunAway = false;
			this.isRestrain = false;

			if(this.m_lRun){
				this.m_lRun.text = "";
				this.m_lRun.letterSpacing = 0;
				AnchorUtil.setAnchor(this.m_lRun, 0);
				Utils.removeFromParent(this.m_lRun);
				ObjectPool.push(this.m_lRun);
				this.m_lRun = null;
			}
		}

		/**
		 * 方阵信息
		 */
		public setUnitInfo(vo: UnitInfoVo) {
			super.setUnitInfo(vo);
			if (vo) {
				this.resetSpeed();
				this.m_pCID = vo.generalModelId;
			}
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

					// if (this.m_pSpriteAnimates)
					// 	this.m_pSpriteAnimates.setAnimation(this.getSoldierTexture());

					// this.refreshAction();
					// this.updateSquareSize();
				} catch (e) {
					error(e);
				}
			}, this);

		}

		/**
		 * 初始化方阵
		 */
		private initSquare(code: number, type: CSquare_Type) {
			// this.m_pType = type;
			this.m_pType = CSquare_Type.TYPE_1;			
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
				// this.refreshAction(null, CSquare_Direction.RIGHT, CSquare_Status.STATUS_STAND);
			}
		}


		private getSoldierTexture() {
			if (!this.m_textureSheet) this.m_textureSheet = {};
			return this.m_textureSheet;
			// return CSquareMgr.getIns().animTexture;
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
			// this.cleanSoldier();
			let offset = this.getActionAnchor(actionName);

			let midWidth = this.width * 0.5;
			let midHeight = this.height * 0.5;

			this.m_soldieNum = 0;
			this.m_totalSoldierNum = 0;

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

					this.m_totalSoldierNum++;
					Utils.addChild(this.m_pSoliderNode, soldier);
					soldier.anchorOffsetX = offset["anchorOffsetX"];
					soldier.anchorOffsetY = offset["anchorOffsetY"];

					if (type != CSquare_Type.TYPE_1) {
						let positionList = comfig["soldier_" + pos].split("|");
						let posx = Number(positionList[0]);
						let posy = Number(positionList[1]);
						soldier.x = posx;
						soldier.y = posy;
						// console.log("posx",posx,"posy",posy);
					} else {
						soldier.x = midWidth;
						soldier.y = midHeight;
					}
				}
			}

			this.m_soldieNum = this.m_totalSoldierNum;
			//头顶特效节点
			this.m_pEffectNode.y = - this.modelConfig.bodyHeight / 2  + this.height/2;
			this.m_pEffectNode.x = this.width / 2;
			this.m_pEffectTopNode.y = - this.modelConfig.bodyHeight + this.height/2;
			this.m_pEffectTopNode.x = this.width / 2;
			this.m_pEffectFootNode.y = 0 + this.height/2;
			this.m_pEffectFootNode.x = this.width / 2;
		}

		/**
		 * 清除
		 */
		private cleanSoldier(): void {
			// this.m_pSoldiersDeadList = [];
			let len = this.m_pSoldiersList.length;
			for (let i: number = 0; i < len; i++) {
				let soldier = this.m_pSoldiersList[i];
				if (soldier.parent) {
					Utils.removeFromParent(soldier);
				}
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		public changeHp(hp, attackHurt,isShowHP:boolean = false,isBuff = false, attackStatus?:AttackResult, isSkill?: boolean) {
			let unitvo = this.getUnitInfo();
			//逃跑不处理
			if (!this.parent || !unitvo || this.isRunAway) {
				return;
			}
			//刷新血条
			if(this.m_pHeadInfo){
				this.m_pHeadInfo.setHP(hp);
			}

			if(GameConfig.BTEELE_QUALITY == BattleQualityEnum.HIGHT){
				if ( unitvo.type == UnitType.SOLDIER   ){
					this.showSoldierHpBar(hp,isShowHP);
				}
				
				if(isShowHP){
					if(isBuff){
						attackHurt = unitvo.troops - hp;
					}
					if(!attackStatus || (this.isRestrain && attackStatus == AttackResult.RESTRAIN)){
						this.showHpChange(-attackHurt);
					}else{
						if(!this.isRestrain && attackStatus == AttackResult.RESTRAIN){
							this.isRestrain = true;
						}
						this.showAttackStatus(attackStatus,attackHurt);
					}
				}
			}
			
			//血量小于0 跳过
			if(unitvo.getHp() > 0 ){
				unitvo.setHp(hp);
			}
			
			if (hp <= 0) {
				this.isLive = false; //死亡
				if(this.m_pHeadInfo) this.m_pHeadInfo.clearSoldierHp();
				//死亡马上清除身上所有特效
				this.cleanAllEffect();
				if(this.m_pStatus == CSquare_Status.STATUS_DEAD){
					return ;
				}
				if(this.m_pStatus == CSquare_Status.STATUS_FLY){
					return;
				}

				if(isSkill && this.getUnitInfo().type == UnitType.SOLDIER){
					this.changeStatus(CSquare_Status.STATUS_FLY);
					BattleSceneMgr.getInstance().addChildToBlood(this,100);
				}else{
					this.changeStatus(CSquare_Status.STATUS_DEAD);
				}
				
				this.killingLastOne();
			}
		}

		/**
		 * 显示暴击
		 */
		public showAttackStatus(attackStatus:AttackResult, attackHurt?: number){
			if(attackStatus == AttackResult.ABSORB){
				this.showBuffText("green","吸收");
				return;
			}

			let [x,y] = this.getMapXY();
			let belong = this.getUnitInfo().belongType;

			let component = new AttackStatusComponent(attackStatus, attackHurt,belong);
			AnchorUtil.setAnchor(component, 0.5);
			component.x = x ;
			if(this.m_unitType == UnitType.GENERAL){
				component.y = y - 80;
			}else{
				component.y = y - 35;
			}
			CEffectFunc.floatCritAction(component, () => {
				Utils.removeFromParent(component);
				component.onDestroy();
			}, this);

			BattleSceneMgr.getInstance().addChildToBlood(component,100);
		}

		/**
		 * 血量
		 */
		public showHpChange(hp) {
			if (hp == 0) return;
			let txt: egret.BitmapText = ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
			txt.letterSpacing = -5;
			if (hp >= 0) {
				hp = "+" + hp + ""
				txt.font = RES.getRes("addHPNumber_fnt"); //CResMgr.getIns().fontList[0];
			} else if (hp < 0) {
				if(this.getUnitInfo().belongType == BelongType.OWN){
					txt.font = RES.getRes("hurtNumber_fnt"); //CResMgr.getIns().fontList[1];
				}else{
					txt.font = RES.getRes("hurtNumber1_fnt"); //CResMgr.getIns().fontList[1];
				}
			}

			let [x,y] = this.getMapXY();

			txt.text = hp + "";
			txt.x = x;
			let scale = 1.3;
			if(this.m_unitType == UnitType.GENERAL){
				txt.y = y - 35 - 140; // - this.height * 0.3;
			}else{
				txt.y = y - 35 - 40;
				scale = 1;
			}
			
			AnchorUtil.setAnchor(txt, 0.5);

			CEffectFunc.floatAction(txt, () => {
				Utils.removeFromParent(txt);
				txt.text = "";
				txt.alpha = 1;
				txt.scaleX = txt.scaleY = 1;
				ObjectPool.push(txt);
			}, this,scale);

			BattleSceneMgr.getInstance().addChildToBlood(txt,100);
		}

		/**
		 * 消灭一个士兵
		 */
		public killingLastOne() {
			if(this.m_pHeadInfo) this.m_pHeadInfo.visible = false;
			if(this.m_pSoliderHpBar) this.m_pSoliderHpBar.visible = false;

			let point = CSquareFunc.getDiePosition(this.m_pDirection, this.m_oldDirection)
			point.x = point.x + this.x;
			point.y = point.y + this.y;
			egret.Tween.removeTweens(this);
			let tw = egret.Tween.get(this);
			if(this.m_pStatus == CSquare_Status.STATUS_FLY){
				tw.wait(100).to({ x: point.x, y: point.y },ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_FLY_TIME));
			}else{
				tw.to({ x: point.x, y: point.y },ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_SLIP_TIME),egret.Ease.cubicOut);
			}
			
		}

		/**
		 * 士兵逃跑动画
		 */
		public runAnimation() {
			this.isRunAway = true;
			this.isLive = false;
			BattleModel.removeUnit(this.getId());
			this.startAction();

			if(GameConfig.BTEELE_QUALITY == BattleQualityEnum.HIGHT){
				let txt: egret.BitmapText = ObjectPool.pop(egret.BitmapText,"egret.BitmapText");//new egret.BitmapText();
				txt.letterSpacing = -6;
				txt.font = RES.getRes("effectGreyNum_fnt");
				txt.text = "溃败";
				txt.y = -15;
				txt.x = 0;
				AnchorUtil.setAnchor(txt, 0.5);
				this.m_pEffectTopNode.addChild(txt);
				this.m_lRun = txt;
			}

			egret.Tween.get(this).wait(666).to({alpha:0},666).call(()=>{
				BattleSceneMgr.getInstance().removeUnitObj(this.getId());
			});
			if(this.m_pSoliderHpBar){
				this.m_pSoliderHpBar.visible = false;
			}
		}

		/**
		 * 获取当前方阵剩余士兵数量
		 */
		public getSoldierNum() {
			return this.m_soldieNum;
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////


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
				this.m_pSpriteAnimates.runActionByName(actionName, index, this.isOneShootByStatus(status), () => {
					if (index != null && index != undefined) {
						//单个士兵动画处理
						this.oneSoldierActionDone(index, status);
					} else {
						if (this.isManual) {
							this.changeStatus(CSquare_Status.STATUS_STAND);
						} else {
							let data = new AGame.Notification(UnitNav.ACTION_FINISH, actionData)
							EventMgr.dispatchEvent(UnitNav.ACTION_FINISH, data);
						}
					}
				}, this, this.getKeyFrame(actionName), this.onKeyFrameCallback, this, actionData, status);
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
		 * 单个士兵动画完成处理
		 */
		private oneSoldierActionDone(index: number, status: CSquare_Status) {
			let soldier = this.m_pSoldiersList[index];
			if (soldier) {
				if (status == CSquare_Status.STATUS_DEAD) {
					// let point = CSquareFunc.getDiePosition(this.m_pDirection)
					// point.x = point.x + soldier.x;
					// point.y = point.y + soldier.y;

					let tw = egret.Tween.get(soldier);
					// tw.to({x:point.x, y:point.y}, 150 )
					tw.to({ "alpha": 0 }, Soldier_GoneTime);
					tw.call(() => {
						// this.m_pSpriteAnimates.removeAction(index);
						Utils.removeFromParent(soldier);
						soldier.alpha = 1;
						if(index == 0){
							if(this.m_pUnitInfo){
								this.m_pSoldiersList.slice(index,1);
								BattleSceneMgr.getInstance().removeUnitObj(this.m_pUnitInfo.elementId);
							}
						}
					});
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
			//击飞死亡动画回调
			if((this.m_pStatus == CSquare_Status.STATUS_FLY || this.m_pStatus == CSquare_Status.STATUS_STAND) && this.getUnitInfo() && this.getUnitInfo().getHp() == 0){
				if(this.m_pSpriteAnimates){
					this.m_pSpriteAnimates.stopAction();
					let actionData = { "direction": this.m_pDirection, "status": CSquare_Status.STATUS_DEAD, "uid": this.getId(), "data": this.getUnitInfo() };
					let data = new AGame.Notification(UnitNav.ACTION_FINISH, actionData)
					EventMgr.dispatchEvent(UnitNav.ACTION_FINISH, data);
				}
			}

			//技能发动时，不要播放砍杀特效
			if (this.isStartSkill) {
				this.isStartSkill = false;
				return;
			}

			if (this.m_pStatus == CSquare_Status.STATUS_ATTACK && this.modelConfig.attackEffect) {
				// let config = CSquareFunc.getAttackEffectId(this.m_pDirection, this.isPlayer());
				let config = CSquareFunc.getAttackEffectId(this.m_pDirection, true);
				this.addEffect(config.effectId);
				if (config.isReversal && this.attackEffect) {
					this.attackEffect.setScale(-1,1);
				}
			}

		}


		/**
		 * 根据当前状态获取当前动作完成后的后续状态
		 * 可做配置表
		 */
		private getFollowActionByStatus(status): CSquare_Status {
			let followStatus: CSquare_Status = status;
			if (status == CSquare_Status.STATUS_ATTACK) {
				followStatus = CSquare_Status.STATUS_STAND;
			}
			return followStatus;
		}


		/**
		 * 根据状态判断是否one shoot动作
		 * 可做配置表
		 */
		private isOneShootByStatus(status: CSquare_Status): boolean {
			let result: boolean = false;
			if ((status == CSquare_Status.STATUS_ATTACK || status == CSquare_Status.STATUS_DEAD || status == CSquare_Status.STATUS_FLY)) {
				result = true;
			}
			return result;
		}


		/**
		 * 获取动作的配置锚点
		 */
		private getActionAnchor(actionName: string): any {
			return CSquareMgr.getIns().animAnchor[actionName] || { "anchorOffsetX": 0, "anchorOffsetY": 0 };
		}

		/**
		 * 获取发射点偏移值
		 */
		public getLaunchPos():{ launchX: number, launchY: number ,launchDeleyTime:number} {
			let actionName = this.packageActionName();
			let pos = { "launchX": 0, "launchY": 0 ,"launchDeleyTime":0};
			let lp = CSquareMgr.getIns().animAnchor[actionName] || pos;
			pos.launchX = lp.launchX;
			pos.launchY = lp.launchY;
			pos.launchDeleyTime = lp.launchDeleyTime;
			if (this.m_pDirection == CSquare_Direction.LEFT ||
				this.m_pDirection == CSquare_Direction.LEFT_DOWN ||
				this.m_pDirection == CSquare_Direction.LEFT_UP) {
				pos.launchX = pos.launchX * -1;
			}
			return pos;
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
					let soldier = this.m_pSoldiersList[i];
					soldier.anchorOffsetX = offsetX;
					soldier.anchorOffsetY = offsetY;
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

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * 添加特效
		 */
		public addEffect(effectid: number, offsetX: number = 0, offsetY: number = 0, finishCallback?: Function, finishThisArgs?: any, buffType?: BuffType) {
			if(!this.m_pFrameEffect){
				return;
			}
			this.m_pFrameEffect.regist(this.onAddEffect, this, { effectid: effectid, offsetX: offsetX, offsetY: offsetY, finishCallback: finishCallback, finishThisArgs: finishThisArgs });
			if (!this.m_pFrameEffect.isExecute()) {
				this.m_pFrameEffect.execute();
			}
		}

		private onAddEffect(arg: { effectid: number, offsetX: number, offsetY: number, finishCallback: Function, finishThisArgs: any, buffType?: BuffType }) {
			if (!this.m_isResLoadComplete) return;
			if (arg.effectid == 0) {
				debug("test---> BUFF没有配置特效");
				return;
			}
			if (this.m_pEffectList[arg.effectid]) {
				// this.m_pEffectList[effectID].onDestroy();
				return;
			}
			let config: EffectConfig = CEffectMgr.getIns().effectConfig[arg.effectid];
			if (!config || this.visible == false) {
				error("CSquare:onAddEffect--->>特效为空 effectid:", arg.effectid);
				return;
			}
			let effect: CEffect = CEffectMgr.getIns().getEffect(arg.effectid);
			if (isNull(effect)) {
				error("CSquare:onAddEffect--->>创建不了 effectid:", arg.effectid);
				return;
			}

			// debug("创建特效id == ",arg.effectid);

			effect.x = arg.offsetX + config["offsetX"] || 0;
			effect.y = arg.offsetY + config["offsetY"] || 0;
			let callbackArgs = null;
			if (effect.spMark == 2) //身体位置buff
				this.m_pEffectNode.addChild(effect);
			else if (effect.spMark == 4) {
				effect.x = this.x;
				effect.y = this.y;
				if (effect.tweenId == 3) {
					effect.y = effect.y - this.m_maxHeight;
				}
				BattleSceneMgr.getInstance().addChildToSuspension(effect);
			} else if (effect.spMark == 5) { //头顶位置buff
				this.m_pEffectTopNode.addChild(effect);	
			} else if (effect.spMark == 6) { //脚底位置buff
				this.m_pEffectFootNode.addChild(effect);
			}
			else {
				this.m_pEffectNode.addChild(effect);
			}

			effect.setScale(this.modelConfig.buffScale,this.modelConfig.buffScale);

			// 循环时间
			if(config.playTime){
				var tw = egret.Tween.get(effect);
				tw.wait(config.playTime).call(() => { this.removeEffect(arg.effectid); });	
			}

			effect.play(null, arg.finishCallback, arg.finishThisArgs, callbackArgs, config.keyFrame);
			if (effect.repeat == true)
				this.m_pEffectList[arg.effectid] = effect;

			this.attackEffect = effect;
		}

		/**
		 * 移除特效
		 */
		public removeEffect(effectID: any) {
			if (this.m_pEffectList[effectID]) {
				this.m_pEffectList[effectID].onCleanup();
				delete this.m_pEffectList[effectID];
			}
		}

		/**
		 * 清除所有特效
		 */
		public cleanAllEffect() {
			for (let key in this.m_pEffectList) {
				let id = Number(key);
				let effect = this.m_pEffectList[id];
				if (effect) {
					effect.onCleanup();
					// Utils.removeFromParent(effect);
					delete this.m_pEffectList[id];
				}
			}
			this.m_pEffectList = {};
		}

		/**
		 * 旋转特效
		 */
		private rotateEffect(direction: CSquare_Direction) {
			let rotate = CSquareFunc.getEffectRotationByDirection(direction);
			let len = this.m_pEffectList.length;
			for (let i: number = 0; i < len; i++) {
				let effect: CEffect = this.m_pEffectList[i];
				if (effect.spMark == 3)
					effect.rotation = rotate;
			}
		}



		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////



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

		/**地图坐标 */
		public set mapPos(point: egret.Point){
			this.m_mapPos = point;
		}

		public get mapPos(){
			return this.m_mapPos;
		}

		public getMapXY():[number,number]{
			if(this.m_mapPos){
				return [this.m_mapPos.x,this.m_mapPos.y];
			}else{
				return [this.x,this.y];
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		/**
		 *  显示喊话
		 */
		public talk(content: string, timeout?: number) {
			content = content || "";//ConstUtil.getString(IConstEnum.GENERAT_TALK);
			//纹理加载完毕才创建容器(需要读取纹理宽高对齐位置)
			if (this.m_pOtherInfoNode) {
				// let talkFrame = new TalkFrame(content, timeout);
				// Utils.addChild(this.m_pOtherInfoNode, talkFrame);
				// egret.callLater(() => {
				// 	let x = 0;
				// 	let y = - 50 - talkFrame.height;
				// 	talkFrame.x = x;
				// 	talkFrame.y = y;
				// }, this);

				let talkFrame = new EnterSkillName(content);
				talkFrame.y = -115;
				Utils.addChild(this.m_pOtherInfoNode, talkFrame);
				
			}
		}

		public flyWordNum(font: string, content: string){
			let talkFrame = new FlyWordNum(content,font);
			talkFrame.setData(content,font);
			talkFrame.y = -80 - 35;
			Utils.addChild(this.m_pOtherInfoNode, talkFrame);
		}


		/**
		 * 显示头像信息
		 */
		public showHeadInfo(duration?: number) {
			if (isNull(this.m_pHeadInfo)) {
				let unitinfo = this.getUnitInfo();
				this.m_pHeadInfo = new BattleGeneralHeadInfo(unitinfo);
			}
			if (!hasParent(this.m_pHeadInfo)) {
				this.m_pHeadInfo.x = -4;
				this.m_pHeadInfo.y = -this.m_maxHeight * 0.5 - 90;
				Utils.addChild(this.m_pContainerLevel3, this.m_pHeadInfo);
			}
		}

		/**
		 * 创建小兵血条
		 */
		public createSoldierHpBar() {
			if(!this.m_pCID) return;
			if (isNull(this.m_pSoliderHpBar)) {
				this.m_pSoliderHpBar = new BattleSoldierHpBar();
			}
			let unitinfo = this.getUnitInfo();
			this.m_pSoliderHpBar.setData(unitinfo);
			if (!hasParent(this.m_pSoliderHpBar)) {
				this.m_pSoliderHpBar.x = 48
				if(!this.modelConfig ){
					this.modelConfig = CSquareMgr.getIns().modelConfig[this.m_pCID];
				}
				this.m_pSoliderHpBar.y = -(this.modelConfig.bodyHeight / 2 + 5);
				Utils.addChild(this.m_pContainerLevel3, this.m_pSoliderHpBar);
			}
		}

		/**
		 * 显示小兵血量
		 */
		public showSoldierHpBar(hp:number, isShowHP:boolean){
			if(!this.m_pSoliderHpBar && isShowHP){
				this.createSoldierHpBar();
			}
			if(isShowHP){
				this.m_pSoliderHpBar.setHP(hp);
			}else if(this.m_pSoliderHpBar){
				this.m_pSoliderHpBar.setHpNoTween(hp);
			}
			
			
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * 获取方向
		 */
		public getDirection(){
			return this.m_pDirection;
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
		 * 改变士兵类型
		 */
		public changeSoldierCode(code: number, index?: number): void {
			if (this.m_pSoldiersCode != code) {
				this.m_pSoldiersCode = code;
				this.refreshAction(index);
			}
		}

		/**
		 * 改变方向
		 */
		public changeDirection(direction: CSquare_Direction, index?: number): void {
			if (!this.m_isResLoadComplete) this.m_toPerformDirection = direction;

			if (this.m_pDirection != direction &&
				(this.m_pStatus != CSquare_Status.STATUS_DEAD || this.isTest == true) || (index != null && index != undefined)) {
				let status = null;
				// if (index != null && index != undefined) {
				// 	if (this.soliderStatusList[index] && this.soliderStatusList[index] == direction) {
				// 		return;
				// 	}
				// 	this.soliderStatusList[index] = direction;
				// 	status = CSquare_Status.STATUS_WALK;
				// } else {
					this.m_pDirection = direction;  //整体朝向才赋值
					if (direction == CSquare_Direction.UP || direction == CSquare_Direction.RIGHT_UP || direction == CSquare_Direction.LEFT_UP) {
						this.m_oldDirection = CSquare_Direction.UP;
					} else if (direction == CSquare_Direction.DOWN || direction == CSquare_Direction.RIGHT_DOWN || direction == CSquare_Direction.LEFT_DOWN) {
						this.m_oldDirection = CSquare_Direction.DOWN;
					}
				// }

				this.refreshAction(index, direction, status);
				this.rotateEffect(direction);

				// this.resetSpeed();
			}
		}

		/**改变状态 */
		public changeStatus(status: CSquare_Status, index?: number, targetNumber?: number): void {
			if(this.m_unitType == UnitType.GENERAL && status == CSquare_Status.STATUS_FLY) return; //英雄击飞跳过

			if (!this.m_isResLoadComplete) {
				this.m_toPerformStatus = status;
			}
			if ((this.m_pStatus != status || status == CSquare_Status.STATUS_ATTACK)) {
				if (index == null || index == undefined) this.m_pStatus = status;
				this.refreshAction(index, null, status);
			}

			if(this.getUnitInfo()){
				//音效
				Sound.playSoldierStatus(this.getUnitInfo().getMainType(),status);
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		public getFourDirection() {
			return CSquareFunc.getFourDirection(this.m_pDirection, this.m_oldDirection);
		}


		/**根据阵营设置转向 */
		public setDirectionOnFaction(faction: FactionType) {
			if (faction == FactionType.ATK) {
				this.changeDirection(CSquare_Direction.RIGHT_UP);
			} else {
				this.changeDirection(CSquare_Direction.LEFT_DOWN);
			}
			this.changeStatus(CSquare_Status.STATUS_STAND);
		}

		/**根据两点设置转向 */
		public setDirectionOnPos(cpos: egret.Point, tpos: egret.Point) {
			if(cpos.x == tpos.x && cpos.y == tpos.y){
				//两个点一样不转向
				return ;
			}
			let radian: number = Utils.MathUtils.getRadian2(cpos.x, cpos.y, tpos.x, tpos.y);
			let angle: number = Utils.MathUtils.getAngle(radian);
			this.setDirectionOnAngle(angle);
		}

		/**根据角度设置转向 */
		public setDirectionOnAngle(angle: number, index?: number) {
			if (this.m_pSpeedType == SpeedType.PASSIVE) {
				debug("CSquare:setDirectionOnAngle--->>被冲锋推动不转向", format("uid:{1}", this.getId()))
				return;
			}
			if ((angle <= 0 && angle >= (ActorDirAngle.Right - AngleDirection / 2))
				|| (angle >= 0 && angle <= (ActorDirAngle.Right + AngleDirection / 2))) {
				// debug("---------->>玩家转向角度：", "右", angle);
				this.changeDirection(CSquare_Direction.RIGHT, index);
			} else if (angle >= (ActorDirAngle.RightUp - AngleDirection / 2)
				&& angle <= (ActorDirAngle.RightUp + AngleDirection / 2)) {
				// debug("---------->>玩家转向角度：", "右上", angle);
				this.changeDirection(CSquare_Direction.RIGHT_UP, index);
			} else if (angle >= (ActorDirAngle.Up - AngleDirection / 2)
				&& angle <= (ActorDirAngle.Up + AngleDirection / 2)) {
				// debug("---------->>玩家转向角度：", "上", angle);
				this.changeDirection(CSquare_Direction.UP, index);
			} else if (angle >= (ActorDirAngle.LeftUp - AngleDirection / 2)
				&& angle <= (ActorDirAngle.LeftUp + AngleDirection / 2)) {
				// debug("---------->>玩家转向角度：", "左上", angle);
				this.changeDirection(CSquare_Direction.LEFT_UP, index);
			} else if (angle >= (ActorDirAngle.Left - AngleDirection / 2)
				|| angle <= (AngleDirection / 2 - ActorDirAngle.Left)) {
				// debug("---------->>玩家转向角度：", "左", angle);
				this.changeDirection(CSquare_Direction.LEFT, index);
			} else if (angle >= (ActorDirAngle.LeftDown - AngleDirection / 2)
				&& angle <= (ActorDirAngle.LeftDown + AngleDirection / 2)) {
				// debug("---------->>玩家转向角度：", "左下", angle);
				this.changeDirection(CSquare_Direction.LEFT_DOWN, index);
			} else if (angle >= (ActorDirAngle.Down - AngleDirection / 2)
				&& angle <= (ActorDirAngle.Down + AngleDirection / 2)) {
				// debug("---------->>玩家转向角度：", "下", angle);
				this.changeDirection(CSquare_Direction.DOWN, index);
			} else if (angle >= (ActorDirAngle.RightDown - AngleDirection / 2)
				&& angle <= (ActorDirAngle.RightDown + AngleDirection / 2)) {
				// debug("---------->>玩家转向角度：", "右下", angle);
				this.changeDirection(CSquare_Direction.RIGHT_DOWN, index);
			} else {
				// debug("玩家转向角度：", angle);
			}
			// this.rotation = angle;
		}

		// /**
		//  * 震开效果
		//  */
		// public squareFlick(gzX: number = 0, gzY: number = 0, dis: number = 10) {
		// 	let len = this.m_pSoldiersList.length;
		// 	for (let i: number = 0; i < len; i++) {
		// 		let soldier = this.m_pSoldiersList[i];
		// 		if (soldier.parent) {
		// 			CSquareFunc.flick(soldier, gzX, gzY, dis);
		// 		}
		// 	}
		// }

		// public toNameString() {
		// 	return this.m_pType + "_" + this.m_pSoldiersCode + "_" + this.hashCode;
		// }

		public get soldierCode() {
			return this.m_pSoldiersCode;
		}

		public resetSpeed(speed?: number){
			if(this.justAnim || this.manual){
				return;
			}
			
			let tempSpeed ;
			if(speed){
				tempSpeed = speed;
				this.getUnitInfo().moveSpeed = speed;
			}else{
				tempSpeed = this.getUnitInfo().moveSpeed;
			}
			this.setMoveSpeed(null,tempSpeed);
			// if(this.m_pDirection == 8 || this.m_pDirection == 4){ //横走
			// 	this.setMoveSpeed(null, 32 / tempSpeed);
			// }else if(this.m_pDirection == 2 || this.m_pDirection == 6){
			// 	this.setMoveSpeed(null, 16 / tempSpeed);
			// }else{
			// 	this.setMoveSpeed(null, 27.5 / tempSpeed);
			// }
		}

		
		//发动技能
		public startSkill(skillEffectId:number) {
			this.changeStatus(CSquare_Status.STATUS_ATTACK);
			//没有蓄力动作,直接播放特效
			let skilleffectData = C.ShowSkillEffectConfig[skillEffectId];
			let arr = skilleffectData.startAnimation.split("|");
			// this.addEffect(skilleffectData.startAnimation);
			for(let i = 0; i < arr.length; i++){
				if(arr[i]){
					this.addEffect(Number(arr[i]));
				}
			}
			this.isStartSkill = true;

			if(skillEffectId == 130){
				let map: BaseMap = BattleSceneMgr.getInstance().getMapView();
				EffectUtils.shakeScreen(map,4);
			}else if(skillEffectId == 134){ //飞鸾翔凤
				let list = [6,7,8,1]; //右上方向
				if(list.indexOf(this.m_pDirection) != -1){
					this.addEffect(123);
				}else{
					this.addEffect(124);
				}
			}
			// egret.Tween.get(this).to({scaleX:2,scaleY:2},800).wait(1000).to({scaleX:1,scaleY:1},800);
		}

		//发动入场技能
		public startEnterSkill(avo: SkillAtkVo) {
			this.changeStatus(CSquare_Status.STATUS_ATTACK);
			let skilldata = avo.getSkillConfig();
			//没有蓄力动作,直接播放特效
			
			if(skilldata.talk){
				this.talk(GLan(skilldata.talk));
			}
			this.isStartSkill = true;
		}

		// private startImage: egret.Bitmap[];
		// private startImageIndex: number;
		public startSkillEffect(skillEffectId:number,isLight = true){
			// 放技能过程 变大 闪光 放技能 缩小
			// if(isLight) this.addEffect(49);
			let tTween:Tween = null;
			let tSX = 0;
			let tSY = 0;
			if(skillEffectId == 130){
				tTween = egret.Tween.get(this.m_pSoldiersList[0]);
				tSX = tSY = 1;
			}else{
				tTween = egret.Tween.get(this);
				tSX = tSY = ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SCALE);
			}
			tTween.to({scaleX: ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SKILL_START_SCALE),scaleY: ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SKILL_START_SCALE)},ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_1))
			.wait(ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_2))
			.call(this.startSkill,this,[skillEffectId])
			.wait(ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_3))
			.to({scaleX: tSX,scaleY: tSY},ConstUtil.getValue(IConstEnum.BATTLE_SKILL_START_TIME_4))

		}

		/**
		 * 受击飞效果
		 */
		public hitFlyToPos(x,y) {
			if(this.isRunAway) return;
			this.changeStatus(CSquare_Status.STATUS_FLY);
			egret.Tween.removeTweens(this);
			let tw = egret.Tween.get(this);
			tw.wait(100)
			.to({ x: x, y: y }, ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_FLY_TIME));
		}

		/**
		 * 受击退效果
		 */
		public hitBackToPos(x,y) {
			if(this.isRunAway) return;
			this.removeTween();
			let tw = egret.Tween.get(this);
			tw.to({ x: x, y: y }, 200, egret.Ease.circInOut)
		}

		public getListLastElement(list: any[]) {
			if (list.length > 0) {
				return list[list.length - 1];
			}
			return null;
		}

		public showBuffText(color: string, text: string){
			let txt: egret.BitmapText = ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
			txt.letterSpacing = -6;

			if(color == "green"){
				txt.font = RES.getRes("effectGreenNum_fnt");
			}else if (color == "red"){
				txt.font = RES.getRes("effectRedNum_fnt");
			}else if (color == "orange"){
				txt.font = RES.getRes("effectOrangeNum_fnt");
			}else if (color == "purple"){
				txt.font = RES.getRes("effectPurpleNum_fnt");
			}

			let [x,y] = this.getMapXY();
			
			txt.scaleX = txt.scaleY = 1.5;
			txt.text = text;
			txt.alpha = 1;
			txt.x = x;
			txt.y = y - 35; // - this.height * 0.3;
			AnchorUtil.setAnchor(txt, 0.5);

			CEffectFunc.buffWorldAction(txt, () => {
				txt.text = "";
				Utils.removeFromParent(txt);
				ObjectPool.push(txt);
			}, this);
			BattleSceneMgr.getInstance().addChildToBlood(txt);
		}

		/**
		 * 添加buff
		 */
		public addBuff(buffID) {
			if(GameConfig.BTEELE_QUALITY == BattleQualityEnum.HIGHT){
				debugBatt("添加特效 ",buffID)
				let buff = BuffData.getBuffConfig(buffID);
				if(buff.describe){
					let strArr = L.getInstance().getLanguage(buff.describe).split("|"); 
					if(strArr[0] == "green" || strArr[0] == "red" || strArr[0] == "orange" || strArr[0] == "purple"){
						if(strArr[2] == "enterskill"){
							// let talkFrame = new FlyWordNum(strArr[1],strArr[0]);//ObjectPool.pop("com_main.FlyWordNum");
							// talkFrame.setData(strArr[1],strArr[0]);
							// talkFrame.y = -80 - 35;
							// Utils.addChild(this.m_pOtherInfoNode, talkFrame);

							this.flyWordNum(strArr[0],strArr[1])
						}else{
							this.showBuffText(strArr[0],strArr[1]);
						}
					}
				}

				if(buff.texiao){
					let effectConfig = C.EffectConfig[buff.texiao];
					this.addEffect(buff.texiao);
				}else{
					debugBatt("buff 特效为空",buff.id);
					return;
				}
			}

			// if (effectConfig) {
			// 	switch (effectConfig.spMark) {
			// 		case BuffType.HEAD_ONEC_BUFF:
			// 			this.buffList[BuffType.HEAD_ONEC_BUFF].push(buffID);
			// 			this.addEffect(buff.texiao);
			// 			break;
			// 		case BuffType.HEAD_CONTINUE_BUFF:
			// 			let currentEffect = this.getListLastElement(this.buffList[BuffType.HEAD_CONTINUE_BUFF]);
			// 			let curBuff = BuffData.getBuffConfig(currentEffect);
			// 			if (curBuff) {
			// 				this.removeEffect(curBuff.texiao);
			// 			}
			// 			this.buffList[BuffType.HEAD_CONTINUE_BUFF].push(buffID);
			// 			this.addEffect(buff.texiao);
			// 			break;
			// 		case BuffType.BODY_CONTINUE_BUFF:
			// 			let bodyEffect = this.getListLastElement(this.buffList[BuffType.BODY_CONTINUE_BUFF]);
			// 			let budyBuff = BuffData.getBuffConfig(bodyEffect);
			// 			if (budyBuff) {
			// 				this.removeEffect(budyBuff.texiao);
			// 			}

			// 			this.buffList[BuffType.BODY_CONTINUE_BUFF].push(buffID);
			// 			this.addEffect(buff.texiao);
			// 			break;
			// 		default:
			// 			break;

			// 	}
			// }
		}

		/**
		 * 删除buff
		 */
		public removeBuff(buffID) {
			debug("移除buff ",buffID)
			let buff = BuffData.getBuffConfig(buffID);

			if(!buff.texiao){
				debugBatt("buff 特效为空",buff.id);
				return;
			}
			let effectConfig = C.EffectConfig[buff.texiao];
			
			this.removeEffect(buff.texiao);
			// if (effectConfig) {
			// 	switch (effectConfig.spMark) {
			// 		case BuffType.HEAD_ONEC_BUFF:
			// 			for (let i in this.buffList[BuffType.HEAD_ONEC_BUFF]) {
			// 				this.buffList[BuffType.HEAD_ONEC_BUFF].splice(Number(i));
			// 			}
			// 			break;
			// 		case BuffType.HEAD_CONTINUE_BUFF:
			// 			for (let i in this.buffList[BuffType.HEAD_CONTINUE_BUFF]) {
			// 				this.buffList[BuffType.HEAD_CONTINUE_BUFF].splice(Number(i));
			// 			}
			// 			let headEffect = this.getListLastElement(this.buffList[BuffType.BODY_CONTINUE_BUFF]);
			// 			let headBuff = BuffData.getBuffConfig(headEffect);
			// 			if (!this.buffImageList[headBuff.texiao]) {
			// 				this.addBuffImage(headBuff.texiao);
			// 			}

			// 			break;
			// 		case BuffType.BODY_CONTINUE_BUFF:
			// 			for (let i in this.buffList[BuffType.BODY_CONTINUE_BUFF]) {
			// 				this.buffList[BuffType.BODY_CONTINUE_BUFF].splice(Number(i));
			// 			}

			// 			let bodyEffect = this.getListLastElement(this.buffList[BuffType.BODY_CONTINUE_BUFF]);
			// 			let bodyBuff = BuffData.getBuffConfig(bodyEffect);
			// 			if (bodyBuff) {
			// 				this.addEffect(bodyBuff.texiao);
			// 			}
			// 			break;
			// 		default:
			// 			break;

			// 	}
			// }
		}
		//技能 动画暂停
		public stopAction() {
			/**士兵逃跑不暂停 */
			if(this.isRunAway){
				return;
			}

			if (this.m_pStatus == CSquare_Status.STATUS_DEAD || this.m_pStatus == CSquare_Status.STATUS_FLY){
				return
			}

			this.isStop = true;
			if(this.m_pSpriteAnimates){
				this.m_pSpriteAnimates.stopAction();
			}
			
			for (let i in this.m_pEffectList) {
				let effect = this.m_pEffectList[i];
				effect.pause();
			}
		}
		//技能 动画开始
		public startAction() {
			if (!this.m_pSpriteAnimates ||this.m_pStatus == CSquare_Status.STATUS_DEAD || this.m_pStatus == CSquare_Status.STATUS_FLY){
				return
			}
			this.isStop = false;
			this.m_pSpriteAnimates.startAction();
			for (let i in this.m_pEffectList) {
				let effect = this.m_pEffectList[i];
				effect.play();
			}
		}

		public drawCenter() {
			let lab = new eui.Label();
			// lab.text = "x = " + this.x + " ; y= " + this.y;
			lab.text = ""+this.m_pUnitInfo.elementId;
			lab.size = 20;
			lab.textColor = 0xff0000;
			lab.stroke = 1;
			lab.x = 60;
			this.addChild(lab);
		}

		public removeTween(){
			egret.Tween.removeTweens(this);
			if(this.m_unitType == UnitType.GENERAL){
				this.scaleX = this.scaleY = ConstUtil.getValue(IConstEnum.BATTLE_GENREAL_SCALE);
			}
		}

		
	}
}
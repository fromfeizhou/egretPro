module com_main {
	export class BattleMap extends BaseMap {

		public static NAME = "BattleMap"

		/**
		 * 测试
		 */
		public static m_pAnimations: any = {};

		/**场景管理 */
		public m_pSceneMgr: BattleSceneMgr;

		/**技能管理 */
		public m_pSkillMgr: BattleSkillMgr;

		// /**排队提示 */
		// private m_pWaitNotice: Battle_Waiting;

		// /**进入单挑战场提示 */
		// private m_pOvOWaitingNotice: OvOWaiyaning;

		// /**单挑按钮 */
		// private m_pOvONotice: OvOButton;

		/**集结后倒计时 */
		private m_pCountTime: number;

		/**单挑战场暂存玩家信息 */
		private m_pOvOInfo: any;

		/**单挑进入战场倒计时 */
		private m_pOvOCountTime: number;

		/**当前地图数据 */
		private m_pMapSetting: MapSetting;
		/**是否第一次移动镜头到城墙 */
		private m_isFirstMove = true;

		/**上下黑框 */
		private m_blackBorder: GuideBlackBorder;

		private m_bIsDestroy: boolean;

		public constructor() {
			super();
			this.name = BattleMap.NAME;
		}

		public init() {
			super.init();
			this.initData();
		}

		public initData(){
			this.SCALE_MAX = 1;
			let cpType = BattleModel.getCheckPointType(); 
			this.SCALE_DEF = 0.8;
			this.setIsCanScale(false);
			if(BattleModel.getMapId() != 6){
				this.setIsCanMove(false);
			}else{
				this.setIsCanMove(true);
			}

			this.m_bIsDestroy = false;
			this.m_pSceneMgr = BattleSceneMgr.getInstance();
			this.m_pSceneMgr.init();
			this.m_pSceneMgr.setMapView(this);

			this.m_pSkillMgr = BattleSkillMgr.getInstance();
			this.m_pSkillMgr.init();
			this.m_pSkillMgr.setMapView(this);

			//避免战斗场景出现黑边
			this.x = 0;
			this.y = 0;
		}

		/**
		 * 销毁方法
		 */
		public onDestroy() {
			super.onDestroy();
			// let mapId = BattleModel.getMapId();
			//清理模块资源 最后调用 避免龙骨动画没有执行destroy
			// SceneResGroupCfg.setResGroup(ModuleEnums.BATTLE_MAP_DYNAMICS,['map_battle_'+mapId]);
			// SceneResGroupCfg.clearModelRes([ModuleEnums.BATTLE,ModuleEnums.BATTLE_MAP_DYNAMICS]);

			this.destoryDate();
			//退出地图，清理国战信息
			WorldModel.clearCityWar();
		}

		public destoryDate(){
			CBulletMgr.getIns().onDestroy();
			CEffectMgr.getIns().onDestroy();
			CSquareMgr.getIns().onDestroy();

			this.m_pSceneMgr.onDestroy();
			this.m_pSceneMgr = null;

			this.m_pSkillMgr.onDestroy();
			this.m_pSkillMgr = null;''

			this.m_pMapSetting = null;
			this.m_pOvOInfo = null;

			FightResponseUtil.reset(); //战斗协议开始
			this.m_isFirstMove = true;

			Utils.TimerManager.remove(this.removeUnit,this);

			if(this.m_blackBorder){
				Utils.removeFromParent(this.m_blackBorder);
			}
			this.m_bIsDestroy = true;
		}

		public setMapSetting(setting: MapSetting) {
			if(this.m_bIsDestroy) return ;
			this.m_pMapSetting = setting;
			let mapid = this.m_pMapSetting.getMapId();
			this.m_pTileConfig = MapData.getTileMapConfig(mapid);

			this.m_pSceneMgr.setMapSetting(this.m_pMapSetting);
		}

		public onEnterDealData(){
			if(this.m_bIsDestroy) return ;
			this.m_pSceneMgr.initView();
			// this.m_pSceneMgr.makeGrid();
			
			// this.m_pSceneMgr.createElement();
			// this.m_pSceneMgr.wallEffect();
			// this.m_pSceneMgr.createNPCObj();
			// this.m_pSceneMgr.createPlayerObjs();  //旗帜 出生点
			
			//防止地图出现黑边
			// this.set_scale(Math.max(0.8, GameConfig.curWidth() / this.m_pBg.width)) ;

			this.m_pSceneMgr.createUnits();
			this.m_pSceneMgr.onEnter();

			//攻墙战地图
			if(BattleModel.getMapId() == 6){
				if(BattleModel.getIsAleardyCurBattle()){
					this.moveTo(881,870,false);
				}else{
					this.moveTo(1480,542,false);
					// TimerManager.getInstance()
					Utils.TimerManager.doTimer(2000,1,()=>{ 
						if(!BattleModel.getJoinedBattleId()){return ;}
						this.moveTo(881,870,true,30);
						this.setForceCall(()=>{ Utils.TimerManager.doTimer(1000,1,()=>{ FightResponseUtil.play(); },this);  },this);						
						Utils.TimerManager.doTimer(2000,1,()=>{ com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER,0); },this);
					},this)
				}
				
			}else{
				let point = ConstUtil.getNumArray(IConstEnum.BATTLE_MAP_1_START_POINT);
				this.moveTo(point[0],point[1],false);
				//开战
				com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER,0);
			}

			if(BattleModel.m_isGuideBattle){
				//电影上下黑边效果
                this.m_blackBorder = new GuideBlackBorder();
            }
		}

		public onEnter() {
			super.onEnter();
			debug("BattleMap:onEnter--->>")

			SceneManager.sceneCreateComplete();
			this.onEnterDealData();

			// let isopen = LocalData.getData('open_map_grid', "0");
			// if (parseInt(isopen)) this.m_pSceneMgr.drawGrid();

			this.resetTile([1, 1, 1]);
			this.m_nMoveRate = 2;

			//移除本场战斗不需要的模型和地图
			SceneResGroupCfg.clearGroup('soldier',BattleModel.getModelList());
			let mapId = BattleModel.getMapId();
			SceneResGroupCfg.clearGroup('map_battle',["map_battle_" + mapId + "_000_jpg"]);
		}

		/**新手新导攻墙战移动镜头 */
		public moveToWall(){
			if(this.m_bIsDestroy) return ;
			if(this.m_isFirstMove){
				this.moveTo(1346,624,true,100);
				this.m_isFirstMove = false;
			}
		}

		public onExit() {
			super.onExit();
			debug("BattleMap:onExit--->>")
			if(this.m_bIsDestroy) return ;
			this.m_pSceneMgr.onExit();
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_WAR_MOVE_SYNC,
				ProtoDef.S2C_WAR_COMBAT_UNIT,
				ProtoDef.S2C_WAR_DEATH,
				ProtoDef.S2C_WAR_FOLLOW_UP,
				ProtoDef.S2C_WAR_BUFF_ADD,
				ProtoDef.S2C_WAR_BUFF_UN,
				ProtoDef.S2C_WAR_BUFF_BLOOD,
				ProtoDef.S2C_WAR_ELEMENT_BLOOD,
				ProtoDef.S2C_WAR_SYNC_MOVE_SPEED,
				ProtoDef.S2C_WAR_OVER
			];
		}

		/**
		 * 处理战斗事件
		 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_WAR_MOVE_SYNC: {       //战斗单位移动
					if(this.m_bIsDestroy) return ;
					this.moveProto(body)
					break;
				}

				case ProtoDef.S2C_WAR_COMBAT_UNIT:{
					if(this.m_bIsDestroy) return ;
					for(let avo of body.realTimeWar){
						
						this.m_pSceneMgr.unitSkillUse(avo);

						if(avo.callCombatUnit){
							for(let data of avo.callCombatUnit){
								let unit1 = BattleModel.getUnit(data.elementId);
								this.m_pSceneMgr.createUnits([unit1]);
							}
						}

						// avo.onDestroy();
						// ObjectPool.push(avo);
					}
					
					break;
				}

				case ProtoDef.S2C_WAR_DEATH:{
					if(this.m_bIsDestroy) return ;
					this.dealWarDeath(body);
					break;
				}

				case ProtoDef.S2C_WAR_FOLLOW_UP: {
					if(this.m_bIsDestroy) return ;
					for (let heroWarData of body.heroWarData) {
						let combatUnit = heroWarData.combatUnit;
						for(let data of combatUnit){
							let unit1 = BattleModel.getUnit(data.elementId);
							this.m_pSceneMgr.createUnits([unit1]);
						}
					}
					break;
				}

				case ProtoDef.S2C_WAR_BUFF_ADD: {
					if(this.m_bIsDestroy) return ;
					this.addBuff(body);
					break;
				}

				case ProtoDef.S2C_WAR_BUFF_UN: {
					if(this.m_bIsDestroy) return ;
					this.removeBuff(body);
					break;
				}

				case ProtoDef.S2C_WAR_BUFF_BLOOD: {
					if(this.m_bIsDestroy) return ;
					this.m_pSceneMgr.buffBlood(body);
					break;
				}

				case ProtoDef.S2C_WAR_ELEMENT_BLOOD: {
					// this.m_pSceneMgr.refreshAnger(body);
					break;
				}

				case ProtoDef.S2C_WAR_SYNC_MOVE_SPEED: {
					if(this.m_bIsDestroy) return ;
					let data = body as gameProto.S2C_WAR_SYNC_MOVE_SPEED;
					for(let i in data.moveSpeedData){
						let moveSpeedData = data.moveSpeedData[i];
						let buId = (moveSpeedData >> 17) & 0x3fff;
						let speed = (moveSpeedData >> 3) & 0x3fff;

						let csquare: CSquare = this.m_pSceneMgr.getDynamicObj(buId, CSquare);
						let unit = BattleModel.getUnit(buId);
						if (csquare && unit) {
							// csquare.setMoveSpeed(null,unit.moveSpeed)
							csquare.resetSpeed(unit.moveSpeed);
						}
					}
					break;
				}

				//战斗结束
				case ProtoDef.S2C_WAR_OVER:{
					this.stopAllSoldier();
				}

			}

		}

		public onTouchBegan(e: egret.TouchEvent): void {
			super.onTouchBegan(e);
			// let obj = Battle_SKillBar.getClass();
			// if (obj && obj.skilltouch) {
			// 	obj.skilltouch = false;
			// 	let rpoint = this.m_pBg.globalToLocal(e.stageX, e.stageY);
			// 	EventMgr.dispatchEvent(SpellNav.SPELL_TOUCH, rpoint);
			// }
		}

		public onTouchMoved(e: egret.TouchEvent): void {
			super.onTouchMoved(e);
			if(this.m_bIsDestroy) return ;
			this.m_pSceneMgr.onTouchMoved(e);
		}

		public onTouchEnd(e: egret.TouchEvent): void {
			super.onTouchEnd(e);

			// var pos = new egret.Point();
			// this.m_pSceneMgr.getWorld().globalToLocal(e.stageX, e.stageY, pos);
			// debug("pos = "+pos.x + "   " + pos.y);

		}

		public startEnterFrame() {
            Utils.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
        }

        public checkCenterPos() {

        }

		public frames = 0;
		public framesTime = 0;
		public onEnterFrame(delta: number) {
			if(this.m_bIsDestroy) return ;
			super.onEnterFrame(delta);
			this.framesTime += delta;
			this.frames +=1
			if(this.frames > 1){
				// 场景对象刷新
				this.m_pSceneMgr.onEnterFrame(this.framesTime);
				FightResponseUtil.enterFrame(this.framesTime);

				this.framesTime = 0;
				this.frames = 0;
			}
		}

		/**
         * 获取实例
         */
        public static getClass(): BattleMap {
            let obj = SceneManager.getClass(LayerEnums.MAP, BattleMap.NAME);
            return obj;
        }

		public createSoldier(id: number, direction: number, x: number, y: number) {
			if(this.m_bIsDestroy) return ;
				let soldier = CSquare.createId(id, true, true);
				soldier.x = x;
				soldier.y = y;
				soldier.changeDirection(direction);
				soldier.changeStatus(CSquare_Status.STATUS_STAND);

				this.m_pSceneMgr.addChildToWorld(soldier);

				this.m_pSoldierList[id] = soldier;

				// GuideUI.showMask2(true);
        }

		// public moveSoldier(id: number, direction: number, x: number, y: number, isFollow: boolean = false) {
        //     let soldier = <CSquare>this.m_pSoldierList[id];
        //     if (soldier) {
        //         soldier.changeDirection(direction);
        //         soldier.changeStatus(CSquare_Status.STATUS_WALK);

        //         let pos1 = egret.Point.create(soldier.x, soldier.y);
        //         let pos2 = egret.Point.create(x, y);

        //         let distance = Point.distance(pos1, pos2);

        //         egret.Tween.get(soldier).to({ x: x, y: y }, distance * 7).call(() => {
		// 			this.m_pSceneMgr.onSortUnits();
        //             soldier.changeStatus(CSquare_Status.STATUS_STAND);
        //         }, this);

        //         if (isFollow) {
        //             this.m_pIsFollow = true;
        //             this.m_pFollowTarget = id;
        //         }
        //     }
        // }

		public showSkillNameEffect(avo: SkillAtkVo,csquare: CSquare)
		{
			if(this.m_bIsDestroy) return ;
			let generalId = avo.attackData.id;
			let sysId = BattleModel.getUnit(generalId).sysId;
			let config: GeneralConfig = GeneralModel.getGeneralConfig(sysId);
			if(avo.getSkillConfig().pauseTime){
				let skillNameEffect = new BattleSkillName1(csquare,avo);
				AGame.R.app.menuLevel.addChild(skillNameEffect);
			}else{
				let skillNameFrame = new SmallActiveSkillName(avo,csquare);
				skillNameFrame.y = 20 + csquare.y - csquare.anchorOffsetY  - 35;
				skillNameFrame.x = 50 + csquare.x - csquare.anchorOffsetX;
				this.m_pSceneMgr.addChildToBlood(skillNameFrame);
				csquare.startSkillEffect(avo.getSkillConfig().skillEffectId);
			}
			if(config && config.skillSound){
				//播放音效
				Sound.playID1(config.skillSound);
			}
		}
		
		/**处理移动协议 */
		public moveProto(body){
			if(this.m_bIsDestroy) return ;
			for(let xy of body.xz){
				let buId = xy >> 17;
				let way = (xy >> 15) & 0x1;
				let posX = (xy >> 7) & 0xff;
				let posY = (xy & 0x7f);
				let position = ISOMap.getInstance().leftDownCellToPixel(posX,posY);

				let unitid = buId;
				let unit = BattleModel.getUnit(unitid);
				let csquare: CSquare = this.m_pSceneMgr.getDynamicObj(unitid, CSquare);
				if (!unit || !csquare) {
					debug(format("S2C_WAR_MOVE_SYNC 没找到战斗单位:uid:{1}", unitid));
					break;
				}
				unit.setCellXY(xy);
				let spos = unit.position;
				let epos = egret.Point.create(position[0],position[1]);//new egret.Point();
				this.m_pSceneMgr.findPathPos(unitid, spos, epos);
				unit.position = epos;
				
				egret.Point.release(epos);
			}
		}

		/**士兵逃跑动画 */
		public soldierEscape(id){
			if(this.m_bIsDestroy) return ;
			// let unit:UnitInfoVo = BattleModel.getUnit(id)
			let csquare: CSquare = this.m_pSceneMgr.getDynamicObj(id, CSquare);
			if(csquare) {
				/**设置逃跑的速度 */
				// unit.setEscape(); 
				let unit = csquare.getUnitInfo();
				csquare.resetSpeed( (unit.moveSpeed * 1 + unit.moveSpeed * Math.random()) * 0.66 * 7) ;
				
				// let [x,y] = unit.getCellXY();
				// let endCellX = 0;
				// if(unit.faction == FactionType.ATK){
				// 	endCellX = x + 3;
				// }else{
				// 	endCellX = x - 3;
				// }
				// let position = ISOMap.getInstance().leftDownCellToPixel(endCellX,y);
				let spos =  unit.position;
				let epos;
				let dis: number = (1 + Math.random()) * 200;

				if(unit.faction == FactionType.ATK){
					epos = new egret.Point(spos.x - dis,spos.y + dis/2);
				}else{
					epos = new egret.Point(spos.x + dis,spos.y - dis/2);
				}

				this.m_pSceneMgr.findPathPos(id, spos, epos);

				csquare.changeStatus(CSquare_Status.STATUS_WALK);
				csquare.runAnimation();
			}
		}

		public dealWarDeath(body){
			// required int64 battleId = 1;//战场ID
			// required int32 flowTime = 2;
			// repeated WarDeathData warDeathData=3;//死亡元素列表
			if(this.m_bIsDestroy) return ;
			for(let deathData of body.warDeathData){
				let elementId = deathData.elementId;
				let isDeath = deathData.isDeath;

				let isDeathSoldier = BattleModel.isSoldierDie(elementId);
				Utils.TimerManager.doTimer(1500,1,this.removeUnit,this,null,null,elementId);

				for( let soldierId of deathData.soldierElementId ){
					this.soldierEscape(soldierId);
				}
			}
		}

		public removeUnit(dt: number,elementId: number){
			if(this.m_bIsDestroy) return ;
			if(this.m_pSceneMgr && this.m_pSceneMgr.removeUnitObj){
				let unit = BattleModel.getUnit(elementId);
				if( unit && unit.type != UnitType.BUILDING_WALL && unit.type != UnitType.BUILDING_BARTIZAN){
					this.m_pSceneMgr.removeUnitObj(elementId);
					BattleModel.removeUnit(elementId);
				}
			}
		}

		public addBuff(body: gameProto.IS2C_WAR_BUFF_ADD){
			if(this.m_bIsDestroy) return ;
			for(let buffdata of body.buffData){
				BattleSkillMgr.getInstance().addBuff(buffdata);
			}
		}

		public removeBuff(body:gameProto.IS2C_WAR_BUFF_UN){
			debug("removeBuff~~~~~~~~~~~~~~~~~~~~~~~~~~~",body)
			if(this.m_bIsDestroy) return ;
			for(let buffdata of body.buffData){
				let buId = (buffdata >> 17) & 0x3fff;
        		let buffId = (buffdata >> 3) & 0x3fff;
				BattleSkillMgr.getInstance().removeBuff(buId,buffId);
			}
		}

		public stopAllSoldier(){
			if(this.m_bIsDestroy) return ;
			let csquareList: CSquare[] = this.m_pSceneMgr.getDynamicObjs();
			for(let i in csquareList){
				let csquare = csquareList[i];
				if( csquare.isLive && csquare.changeStatus){
					csquare.changeStatus(CSquare_Status.STATUS_STAND);
				}
			}
		}
		
	}
}
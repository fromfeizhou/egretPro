module com_main {
	/**
	 * Created by leowang on 2016/12/20
	 */
	/** 战场对象管理 */
	export class BattleSceneMgr extends BaseSceneMgr {
		/**主城列表 */
		private m_pBuildsMain: egret.DisplayObject[];
		/**玩家的战斗单位 */
		private m_pPlayerUnits: egret.DisplayObject[][];

		private m_pBuildHPPercent: number;
		private m_pBuildEffectObjects: MapObject[][];

		private m_pSkillMgr: BattleSkillMgr;
		// /**创建战斗单位 */
		// private m_pFrameUnit: FrameExecutor;
		/**排序战斗单位 */
		private m_pFrameSort: FrameExecutor;
		/**创建其他元素 */
		private m_pFrameElement: FrameExecutor;

		private m_pIconFollow: BattleGuideIcon;
		/**特效列表 */
		private m_wallEffecList: MCDragonBones[];
		/**特效步骤 */
		private m_wallEffectStep: number;
		/**技能特效列表 */
		private m_skillEffectList: Array<any>;


		private mapScale: number;
		private isStart = false;
		private scaleStep: number;

		public static MAP_START_SCALE = 0.65;
		public static MAP_TARGER_SCALE = 0.94;
		public static MAP_SCALE_SPEED = 0.4 / 4000;

		public static FOCUS_TIME = 0;
		public static AUTO_MOVE_DIS = 0;
		public static BATTLE_AUTO_MOVE_FLAME = 0;
		public static GONGCHENG_OFFX = -120;

		public constructor() {
			super();
		}

		public init(): void {
			super.init();
			this.initData();
		}

		public initData() {
			this.m_pBuildsMain = [];
			this.m_pPlayerUnits = [];
			this.m_pBuildEffectObjects = [];
			this.m_wallEffecList = [];
			this.m_skillEffectList = [];
			this.m_pSkillMgr = BattleSkillMgr.getInstance();
			// this.m_pFrameUnit = FrameExecutor.create();
			this.m_pFrameSort = FrameExecutor.create(10);
			this.m_pFrameElement = FrameExecutor.create();

			this.mapScale = BattleSceneMgr.MAP_START_SCALE;

			// if(BattleModel.getMapId() == 6){
			// 	this.isStart = false;
			// }else{
			// 	this.isStart = false;
			// }

			this.isStart = false;


			this.scaleStep = BattleSceneMgr.MAP_SCALE_SPEED;
			this.m_wallEffectStep = 0;

			BattleSceneMgr.FOCUS_TIME = ConstUtil.getValue(IConstEnum.BATTLE_RUN_FOCUS_TIME);
			BattleSceneMgr.AUTO_MOVE_DIS = ConstUtil.getValue(IConstEnum.BATTLE_AUTO_MOVE_DIC);
			BattleSceneMgr.BATTLE_AUTO_MOVE_FLAME = ConstUtil.getValue(IConstEnum.BATTLE_AUTO_MOVE_FLAME);
		}

		public onDestroy() {
			super.onDestroy();

			this.m_pBuildsMain = [];
			this.m_pBuildsMain = null;

			this.m_pPlayerUnits = [];
			this.m_pPlayerUnits = null;

			this.m_pBuildHPPercent = null;
			this.m_pBuildEffectObjects = null;

			this.m_pSkillMgr = null;

			// this.m_pFrameUnit.onDestroy();
			// this.m_pFrameUnit = null;

			this.m_pFrameSort.onDestroy();
			this.m_pFrameSort = null;

			this.m_pFrameElement.onDestroy();
			this.m_pFrameElement = null;

			this.destoryEffectList();
			/**销毁技能 */
			this.destorySkillEffect();

			this.removeUnitGuideIcon();

			this.m_wallEffectStep = 0;
			this.isFocus = false;
		}

		public initView() {
			super.initView();
		}

		public onEnter() {
			super.onEnter();
			// EventMgr.addEvent(UnitNav.ATTR_BBUILD_HP, this.flushBuildEffect, this);
			EventMgr.addEvent(BattleEvent.BATTLE_PLAY_SKILL, this.playSkill, this);
			// EventMgr.addEvent(GuideEvent.GUIDE_START_BATTLE, this.setStartAni, this);
			EventMgr.addEvent(BattleEvent.BATTLE_SIEGE_END, this.siegeEnd, this);
			EventMgr.addEvent(BattleEvent.BATTLE_START_RUN, this.startMoveCamera, this);
			// //防止地图出现黑边
			this.mapScale = Math.max(0.8, GameConfig.curWidth() / this.m_pMapView.m_pBg.width);

			this.m_pMapView.set_scale(this.mapScale);
			debugBatt("BattleSceneMgr:onEnter--->>")


			this.createKezhi();

		}

		public onExit() {
			super.onExit();
			// EventMgr.removeStaticEvent(UnitNav.ATTR_BBUILD_HP, this.flushBuildEffect);
			EventMgr.removeStaticEvent(BattleEvent.BATTLE_PLAY_SKILL, this.playSkill);
			// EventMgr.removeStaticEvent(GuideEvent.GUIDE_START_BATTLE, this.setStartAni);
			EventMgr.removeStaticEvent(BattleEvent.BATTLE_SIEGE_END, this.siegeEnd);
			EventMgr.removeStaticEvent(BattleEvent.BATTLE_START_RUN, this.startMoveCamera);
			debugBatt("BattleSceneMgr:onExit--->>")

			Utils.TimerManager.remove(this.setFocus, this);
		}

		public onTouchMoved(e: egret.TouchEvent): void {
			// this.followUnitGuide();
		}

		/**创建所有战斗单位 */
		public createUnits(units?: UnitInfoVo[]) {
			if(this.m_bIsDestroy) return;
			if (units) {
				for (let index = 0; index < units.length; index++) {
					let element = units[index];
					// this.m_pFrameUnit.regist(this.addUnitObj, this, element.id);
					this.addUnitObj(element.elementId);
				}
			} else {
				let units = BattleModel.getUnits();
				for (let key in units) {
					if (units.hasOwnProperty(key)) {
						let element = units[key];
						// this.m_pFrameUnit.regist(this.addUnitObj, this, element.id);
						this.addUnitObj(element.elementId);
					}
				}
			}
			// if (!this.m_pFrameUnit.isExecute()) {
			// 	this.m_pFrameUnit.execute();
			// }
		}

		/**创建单个战斗单位对象 */
		public addUnitObj(unitid: number) {
			if(this.m_bIsDestroy) return;
			let unitvo: UnitInfoVo = BattleModel.getUnit(unitid);
			if (!unitvo) return;
			// debugBatt("BattleSceneMgr:addUnitObj--->>", unitvo.elementId)
			let obj = this.getDynamicObj(unitvo.elementId);
			if (obj) {
				error("BattleSceneMgr:addUnitObj--->>战斗单位ID重复了", unitvo.elementId)
				this.removeDynamicObj(unitvo.elementId);
			}
			// if (unitvo.type == UnitType.PLAYER_GENERAL || unitvo.type == UnitType.NPC_GENERAL || unitvo.type == UnitType.PLAYER_SOLDIER  || unitvo.type == UnitType.NPC_SOLDIER) {
			// let eid = unitvo.faction == FactionType.ATK ? 3000 : 4000
			// let square = CSquare.create(unitvo);
			// let square = CSquare.createId(eid);
			// let epos = unitvo.targetPosition;
			if (unitvo.type == UnitType.GENERAL || unitvo.type == UnitType.SOLDIER) {
				let epos = unitvo.position;
				let spos = unitvo.position;
				let square = CSquareMgr.getIns().getSquare(unitvo);
				square.setUnitInfo(unitvo);
				square.updatePos(spos, epos);
				square.setXY(spos.x, spos.y);
				this.addDynamicObj(unitvo.elementId, square);
				this.addChildToWorld(square, square.y);
				square.setDirectionOnFaction(unitvo.faction);
				// square.addSoldierToMap();
				square.onAddToStage();




			} else if (unitvo.type == UnitType.BUILDING_WALL) {
				// console.log("城墙 id =========",unitvo.elementId);
				let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
				let build = BBuild.create(unitvo);
				build.setXY(config.wall_x, config.wall_y);
				this.addChildToBuild(build, build.y);
				this.addDynamicObj(unitvo.elementId, build);

				// let tower1 = BBuildTower.create(unitvo);
				// tower1.setXY(784, 763);
				// this.addChildToWorld(tower1, tower1.y);
				// this.addDynamicObj(unitvo.elementId + 500, tower1);

				// let tower2 = BBuildTower.create(unitvo);
				// tower2.setXY(1217, 955);

				// this.addChildToWorld(tower2, tower2.y);
				// this.addDynamicObj(unitvo.elementId + 501, tower2);

				// this.addBuildMainObj(unitvo.faction, build);
				// this.flushBuildEffect();
			} else if (unitvo.type == UnitType.BUILDING_BARTIZAN) {
				let [cellX, cellY] = unitvo.cellXY;

				let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
				let tower1 = BBuildTower.create(unitvo);
				cellY == 25 ? tower1.setXY(config.tower1_x, config.tower1_y) : tower1.setXY(config.tower2_x, config.tower2_y);

				this.addChildToWorld(tower1, tower1.y);
				this.addDynamicObj(unitvo.elementId, tower1);
			}
		}

		/**移除显示对象 */
		public removeUnitObj(unitid: number) {
			if(this.m_bIsDestroy) return;
			let obj: CSquare = this.getDynamicObj(unitid);
			if (obj) {
				if (this.getDynamicObj(unitid)) {
					this.removeDynamicObj(unitid);
				}
			} else {
				// error("BattleSceneMgr:removeUnitObj---> 没找到要删除的对象 uid:", unitid)
			}
		}

		// /**动画移除显示对象 */
		// public removeUnitObjWithAnimation(id: number) {
		// 	debugBatt("BattleSceneMgr:removeUnitObjWithAnimation--->战斗单位死亡 uid:" + id);
		// 	let obj = this.getDynamicObj(id);
		// 	if (obj instanceof CSquare) {
		// 		let csquare: CSquare = obj
		// 		csquare.changeStatus(CSquare_Status.STATUS_DEAD);
		// 	} else if (obj instanceof BBuildPart || obj instanceof BBuild) {
		// 	}
		// }

		// /**添加主城(只添加进缓存，不添加进显示列表) */
		// public addBuildMainObj(faction: FactionType, obj: egret.DisplayObject) {
		// 	this.m_pBuildsMain[faction] = obj;
		// }

		// /**移除主城(只移除缓存，不移除显示列表) */
		// public removeBuildMainObj(faction: FactionType) {
		// 	this.m_pBuildsMain[faction] = null;
		// 	delete this.m_pBuildsMain[faction];
		// }

		// /**获取主城 */
		// public getBuildMainObj(faction: FactionType): BBuild {
		// 	return this.m_pBuildsMain[faction] as BBuild;
		// }

		// /**添加玩家的战斗单位(只添加进缓存，不添加进显示列表) */
		// public addPlayerUnitsObj(playerid: number, unitid: number, obj: CSquare) {
		// 	let objs: egret.DisplayObject[] = this.getPlayerUnitsObj(playerid);
		// 	if (!objs) {
		// 		objs = [];
		// 		this.m_pPlayerUnits[playerid] = objs;
		// 	}
		// 	objs[unitid] = obj;
		// }

		// /**移除玩家的战斗单位(移除缓存，移除显示列表) */
		// public removePlayerUnitsObj(playerid: number, unitid?: number) {
		// 	let objs: egret.DisplayObject[] = this.getPlayerUnitsObj(playerid);
		// 	if (objs) {
		// 		if (unNull(unitid)) {
		// 			objs[unitid] = null;
		// 			delete objs[unitid];
		// 			this.removeUnitObj(unitid);
		// 		} else {
		// 			for (let key in objs) {
		// 				let uid = parseInt(key);
		// 				this.removeUnitObj(uid);
		// 			}
		// 			if (isEmptyArray(this.m_pPlayerUnits)) {
		// 				this.m_pPlayerUnits[playerid] = null;
		// 				delete this.m_pPlayerUnits[playerid];
		// 			}
		// 		}
		// 	}
		// }

		// /**获取玩家的战斗单位 return egret.DisplayObject[unitid] | CSquare */
		// public getPlayerUnitsObj(playerid: number, unitid?: number): any {
		// 	let objs: egret.DisplayObject[] = this.m_pPlayerUnits[playerid];
		// 	if (objs && unitid != undefined) {
		// 		return objs[unitid];
		// 	}
		// 	return objs;
		// }

		/**刷新怒气 */
		public refreshAnger(data: gameProto.S2C_WAR_ELEMENT_BLOOD) {
			if(this.m_bIsDestroy) return;
			// for (let item of data.anger){
			// 	let id = (item >> 17) & 0x3fff;
			// 	let angry = (item >> 14) & 0x2fff;
			// 	com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, {id : id ,  rage:angry});

			// 	// console.log("武将 id =" + id, " 怒气 = "+angry );
			// }
		}

		/**技能使用 */
		public unitSkillUse(avo: SkillAtkVo) {
			if(this.m_bIsDestroy) return;
			debugBatt("BattleSceneMgr:unitSkillUse--->>");
			let unitid = avo.attackData.id;
			let obj = this.getDynamicObj(unitid);
			if (!obj) {
				debugBatt("找不到技能发送者！！", unitid);
				// console.log(this.getDynamicObjs());
				return;
			}
			this.m_pSkillMgr.unitActack(avo);
		}

		public buffBlood(body: gameProto.IS2C_WAR_BUFF_BLOOD) {
			if(this.m_bIsDestroy) return;
			for (let buffBloodData of body.bloodData) {
				debugBatt("BUFF气血 目标id = " + buffBloodData.elementId, "目标血量：" + buffBloodData.troops, "buffid" + buffBloodData.buffId);
				let targetObj: CSquare = this.getDynamicObj(buffBloodData.elementId);
				if (!targetObj) {
					debugBatt("skillEnd  找不到 显示对象");
					continue;
				}
				// console.log("buff 刷新血量",buffBloodData.troops);
				targetObj.changeHp(buffBloodData.troops, 0, true, true);
				com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, { id: buffBloodData.elementId, hp: buffBloodData.troops, rage: buffBloodData.anager, flowTime: body.flowTime });
				// console.log("buff 刷新血量end_________________________");
			}
		}


		// public flushBuildEffect(body?: BattleUnitAttrChangeVo) {
		// 	for (let key in FactionType) {
		// 		let faction = FactionType[FactionType[key]];
		// 		let bbuild = this.getBuildMainObj(faction);
		// 		if (!bbuild) continue;
		// 		let mapobj = bbuild.getMapObj();
		// 		let buildunit = bbuild.getUnitInfo();
		// 		let perhp = buildunit.getPercentHP();
		// 		let percent = MapObject.getBuildHPPercent(mapobj, perhp);
		// 		if (this.m_pBuildHPPercent != percent.percentHp) {
		// 			this.m_pBuildHPPercent = percent.percentHp;
		// 			let mapobjs = this.getBuildEffect(this.m_pBuildHPPercent);
		// 			this.removeAllBuildEffects();
		// 			for (let i = 0; i < mapobjs.length; i++) {
		// 				let element = mapobjs[i];
		// 				this.m_pFrameElement.regist(this.addElementObj, this, element);
		// 			}
		// 			if (!this.m_pFrameElement.isExecute()) {
		// 				this.m_pFrameElement.execute();
		// 			}
		// 		}
		// 	}
		// }

		/**0.3, 0.5, 1 */
		public getBuildEffect(perhp: number) {
			if(this.m_bIsDestroy) return;
			if (!this.m_pBuildEffectObjects[perhp]) {
				this.m_pBuildEffectObjects[perhp] = [];
				let effects = this.m_pMapSetting.listMapObject(LayerName.ELEMENTS, ObjectType.BUILD_EFFECT);
				if (effects) {
					for (let key in effects) {
						let mapobj = effects[key];
						let percent = MapObject.getBuildHPPercent(mapobj, perhp);
						let status = parseInt(MapObject.getBuildHPPercentStatus(mapobj, percent.index));
						if (status > 0) {
							this.m_pBuildEffectObjects[perhp].push(mapobj);
						}
					}
				}
			}
			return this.m_pBuildEffectObjects[perhp];
		}

		private imageDestory: eui.Image;
		/**城墙烧火特效 */
		public wallEffect(step: number, matrixUnitobj?) {
			if(this.m_bIsDestroy) return;
			// if(this.m_wallEffecList.length > 0){
			// 	return;
			// }
			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];

			switch (step) {
				case 2: {
					if (BattleModel.getCheckPointType() == CheckPointType.GM) {
						let effect2 = new MCDragonBones();
						effect2.initAsync("luoshi");
						effect2.play("luoshi", 0);
						effect2.x = 929;
						effect2.y = 759;
						this.addChildToSuspension(effect2, 91);
						this.m_wallEffecList.push(effect2);
					}

					break;
				}
				case 3: {
					let image = new eui.Image(config.posun_img);
					image.x = config.posun_x;
					image.y = config.posun_y;
					this.addChildToSuspension(image, 0);
					this.imageDestory = image;

					if (BattleModel.getCheckPointType() == CheckPointType.GM) {
						let effect2 = new MCDragonBones();
						effect2.initAsync("luoshi");
						effect2.play("luoshi", 0);
						effect2.x = 929;
						effect2.y = 759;
						this.addChildToSuspension(effect2, 91);
						this.m_wallEffecList.push(effect2);
					}

					break;
				}
				case 4: {
					let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
					let effect1 = new MCDragonBones();
					effect1.initAsync(IETypes.EBattle_New_fire_1);
					effect1.play(IETypes.EBattle_New_fire_1);
					effect1.x = config.wallFire_x;
					effect1.y = config.wallFire_y;
					this.addChildToSuspension(effect1, 90);
					this.m_wallEffecList.push(effect1);

					break;
				}
				case 5: {
					let callback = () => {
						for (let effect of this.m_wallEffecList) {
							egret.Tween.get(effect).wait(500)
								.to({ alpha: 0 }, 1000);
						}

						// console.log("摧毁特效");
						let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
						let effect4 = new MCDragonBones();
						effect4.initAsync(IETypes.EBattle_Wall_Boom);
						effect4.playOnceDone(IETypes.EBattle_Wall_Boom, () => { this.destoryEffectList() }, this);
						effect4.x = config.boom_x;
						effect4.y = config.boom_y;
						this.addChildToSuspension(effect4, 100);
						this.m_wallEffecList.push(effect4);
						if (matrixUnitobj) {
							egret.Tween.get(matrixUnitobj).wait(200).to({ alpha: 0 }, 1);
						}
						let unitInfo = matrixUnitobj.getUnitInfo();
						let jianta1 = this.getDynamicObj(unitInfo.elementId + 1);
						if (jianta1) {
							egret.Tween.get(jianta1).wait(200).to({ alpha: 0 }, 1);
						}

						let jianta2 = this.getDynamicObj(unitInfo.elementId + 2);
						if (jianta2) {
							egret.Tween.get(jianta2).wait(200).to({ alpha: 0 }, 1);
						}

						egret.Tween.get(this.imageDestory).wait(200).to({ alpha: 0 }, 1).wait(1000).call(() => {
							if (BattleModel.getCheckPointType() != CheckPointType.GM) {
								Utils.open_view(TASK_UI.MENU_BATTLE_DESTORY_WALL, null);
							}
						}).wait(1200).call(() => {
							let point = ConstUtil.getNumArray(IConstEnum.BATTLE_MAP_2_DESTORE_MOVE_POINT);
							let flame = BattleSceneMgr.BATTLE_AUTO_MOVE_FLAME;
							this.m_pMapView.moveTo(point[0], point[1], true, flame);
						}).wait(5000).call(() => {
							this.setStartAni();
							this.setFocus();
						});

						// BattleProxy.startBattle(true);
						BattleModel.setIsStopPlay(false);

						/**第一场战斗不显示战斗ui */
						if (RoleData.playerId == 0) return;
						let obj = SceneManager.getClass(LayerEnums.MENU, BattleView.NAME);
						obj.visible = true;
						//镜头移动


					}

					let cptype = BattleModel.getCheckPointType();
					// if (cptype == CheckPointType.NEW_PLAYER){
					// 	FirstBattleGuide.getInstance().destoryWall(callback);
					// }else{
					callback();
					// }
					break;
				}

			}
		}

		/**城墙爆炸特效 */
		public playWallEffect(step, matrixUnitobj?) {
			if(this.m_bIsDestroy) return;
			
			if (this.m_wallEffectStep < step) {
				for (let i = this.m_wallEffectStep + 1; i <= step; i++) {
					this.wallEffect(i, matrixUnitobj);
				}
				this.m_wallEffectStep = step;
			}
		}

		/**箭塔爆破 */
		public playTowerFire(index) {
			if(this.m_bIsDestroy) return;

			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
			let effect2 = new MCDragonBones();
			effect2.initAsync(IETypes.EBattle_New_fire_2);
			effect2.play(IETypes.EBattle_New_fire_2);
			if (index == 1) {
				effect2.x = config.towerfire1_x;
				effect2.y = config.towerfire1_y;
			} else if (index == 2) {
				effect2.x = config.towerfire2_x;
				effect2.y = config.towerfire2_y;
			}

			this.addChildToSuspension(effect2);
			this.m_wallEffecList.push(effect2);
		}

		public destoryEffectList() {
			if(this.m_bIsDestroy) return;

			if (!this.m_wallEffecList) return;
			for (let effect of this.m_wallEffecList) {
				effect.destroy();
			}
			this.m_wallEffecList = null;
			//删掉特效图片
			Utils.removeFromParent(this.imageDestory)
		}

		public destorySkillEffect() {
			if(this.m_bIsDestroy) return;

			for (let skillEffect of this.m_skillEffectList) {
				skillEffect.onDestroy();
			}
			this.m_skillEffectList = [];
		}

		/**抖动战斗场景 */
		public shakeScreen() {
			if(this.m_bIsDestroy) return;

			if (this.m_pMapView) {
				EffectUtils.shakeScreen(this.m_pMapView);
				// Utils.ShockUtils.shock(this.m_pMapView);
			}
		}

		public moveDeltaTime = 0;
		public isFocus = false;
		public m_frame = 0;

		public onEnterFrame(delta: number) {
			if (!this.m_pMapView) return;

			//暂停返回
			if (BattleModel.getIsStopPlay()) {
				return;
			}
			this.startAnimation(delta);

			/**镜头移动处理 */
			this.dealFocus(delta);
			this.m_frame += 1;

			// let domove: boolean = false;
			// this.m_pDynamicObjs.forEach((obj: CSquare, index: number, array: any[]) => {
			// 	if (Utils.isGeneralObj(obj) && obj.isLive || obj.isRun) {
			// 		if (!obj.parent) return;
			// 		if (!obj.m_pPath) return;
			// 		if (!obj.m_pPath[obj.m_pIndex]) return;

			// 		obj.m_pMoveTime = delta;
			// 		let cpos = egret.Point.create(obj.x, obj.y);//当前位置
			// 		let npos = obj.pathToPixel(obj.m_pIndex);//目标位置
			// 		let dist: number = egret.Point.distance(cpos, npos);
			// 		let objSpeed = obj.getSpeed();
			// 		if (Math.abs(dist) < objSpeed) {
			// 			obj.setXY(npos.x, npos.y);
			// 			obj.findEnd();
			// 			domove = true;
			// 		} else {
			// 			// let slope = (npos.y - cpos.y) / (npos.x - cpos.x);
			// 			let radian: number = Utils.MathUtils.getRadian2(cpos.x, cpos.y, npos.x, npos.y);
			// 			let speedX: number = objSpeed * Math.cos(radian);
			// 			let speedY: number = objSpeed * Math.sin(radian);
			// 			let angle: number = Math.atan2(speedY, speedX) * 180 / Math.PI;
			// 			obj.setDirectionOnAngle(angle);
			// 			if(obj.m_pStatus == CSquare_Status.STATUS_STAND){
			// 				obj.changeStatus(CSquare_Status.STATUS_WALK)
			// 			}
			// 			let x = obj.x;
			// 			let y = obj.y;
			// 			obj.setXY(x += speedX, y += speedY);
			// 			domove = true;
			// 		}
			// 		egret.Point.release(cpos); //point 入栈
			// 	}
			// }, this)
			// 场景对象移动
			if (this.m_frame > 10) {
				this.onSortUnits();
				this.m_frame = 0;
			}

		}

		public dealFocus(delta: number) {
			if(this.m_bIsDestroy) return;

			let focusTime = BattleSceneMgr.FOCUS_TIME;
			if (this.isFocus) this.moveDeltaTime += delta;
			if (this.moveDeltaTime > focusTime) {
				this.moveDeltaTime = 0;
			} else {
				return;
			}
			//震动可能引发屏幕位置偏差，这个是矫正屏幕位置
			this.m_pMapView.x = this.m_pMapView.y = 0;

			if (this.mapScale < BattleSceneMgr.MAP_TARGER_SCALE) return; // 镜头推进的时候不进行移动

			let argB = 0;
			if (BattleModel.getMapId() != 6) {
				argB = 200;
			} else {
				argB = 400;
			}

			let minX = 3000;
			let minY = 3000;
			let maxX = 0;
			let maxY = 0;

			let map = this.m_pMapView.m_pBg;
			var po = map.globalToLocal(AGame.R.app.stageWidth / 2, AGame.R.app.stageHeight / 2);

			this.m_pDynamicObjs.forEach((obj: CSquare, index: number, array: any[]) => {
				if (Utils.isGeneralObj(obj) && obj.isLive) {
					if (obj.CID != 3007) {
						let transX = (map.height - obj.y + 1.73 * obj.x + argB) / (0.5 + 1.73);
						if (transX < minX) minX = transX;
						if (transX > maxX) maxX = transX;
					}
				}
			}, this)

			let autoMoveDis = BattleSceneMgr.AUTO_MOVE_DIS;
			let midX = (minX + maxX) / 2 + BattleSceneMgr.GONGCHENG_OFFX;
			if (Math.abs(po.x - midX) > autoMoveDis + 100) {
				let flame = BattleSceneMgr.BATTLE_AUTO_MOVE_FLAME;
				this.m_pMapView.moveTo(midX, map.height - (midX + argB) * 0.5, true, flame);
			}
		}

		public setFocus() {
			this.isFocus = true;
		}

		// public sortUnit() {
		// 	this.m_pFrameSort.regist(this.onSortUnits, this, null);
		// 	if (!this.m_pFrameSort.isExecute()) {
		// 		this.m_pFrameSort.execute();
		// 	}
		// }

		public onSortUnits() {
			if(this.m_bIsDestroy) return;

			this.m_pFrameSort.clear();
			this.m_pWorld.sortUnit();
		}

		private addUnitGuideIcon() {
			if(this.m_bIsDestroy) return;

			if (isNull(this.m_pIconFollow)) {
				this.m_pIconFollow = BattleGuideIcon.create();
				SceneManager.addChild(LayerEnums.MENU, this.m_pIconFollow);
			}
			return this.m_pIconFollow;
		}

		private removeUnitGuideIcon() {
			if(this.m_bIsDestroy) return;

			if (this.m_pIconFollow) {
				this.m_pIconFollow.onDestroy();
				this.m_pIconFollow = null;
			}
		}

		// /**战斗指引效果 */
		// public followUnitGuide() {
		// 	//新手不显示
		// 	let cptype = BattleModel.getCheckPointType();

		// 	// if (cptype == CheckPointType.NEW_PLAYER) return;

		// 	let objs: egret.DisplayObject[] = this.getDynamicObjs();
		// 	if (isEmptyArray(objs)) {
		// 		this.removeUnitGuideIcon();
		// 		return;
		// 	}

		// 	let unitcount = 0;
		// 	let showcount = 0;
		// 	let firstunit: CSquare;
		// 	let targetunit: CSquare;
		// 	for (let key in objs) {
		// 		if (objs.hasOwnProperty(key)) {
		// 			let element = objs[key] as CSquare;
		// 			if (Utils.isGeneralObj(element)) {
		// 				unitcount++;
		// 				if (element.visible) {
		// 					showcount++;
		// 				}
		// 				firstunit = firstunit || element;
		// 			}
		// 		}
		// 	}
		// 	if (unitcount > 0 && showcount <= 0) targetunit = firstunit;

		// 	if (isNull(targetunit)) {
		// 		this.removeUnitGuideIcon();
		// 		return;
		// 	}

		// 	let guideIcon = this.addUnitGuideIcon();
		// 	let globalPos = egret.Point.create(0, 0);
		// 	targetunit.parent.localToGlobal(targetunit.x, targetunit.y, globalPos);

		// 	if (globalPos.x > 130
		// 		&& globalPos.x < (GameConfig.curWidth() - 140)
		// 		&& globalPos.y > 185
		// 		&& globalPos.y < (GameConfig.curHeight() - 194 - 50)) {
		// 		guideIcon.visible = false;
		// 	} else {
		// 		guideIcon.visible = true;
		// 		let x = globalPos.x;
		// 		let y = globalPos.y;

		// 		x = x < 150 ? 150 : x;
		// 		x = x > GameConfig.curWidth() - 140 - 110 ? GameConfig.curWidth() - 140 - 103 : x;
		// 		y = y < 195 ? 195 : y;
		// 		y = y > GameConfig.curHeight() - 194 - 110 ? GameConfig.curHeight() - 194 - 110 : y;

		// 		guideIcon.x = x;
		// 		guideIcon.y = y;
		// 	}
		// 	guideIcon.setTargetLocalPos(targetunit.position);
		// 	guideIcon.setTargetGlobalPos(globalPos);
		// }

		//////////////////////////////////////////////////////////////////////////////////////

		/** params 实际像素 */
		public findPathPos(uid: number, spos: egret.Point, epos: egret.Point, call?: Function) {
			if(this.m_bIsDestroy) return;

			let square: CSquare = this.getDynamicObj(uid, CSquare);
			if (!square) return;
			// square.bindFind(call);
			// square.updatePos(spos, epos);

			// let pathdist = egret.Point.distance(spos, epos);
			// let stardist = egret.Point.distance(square.position, spos)

			// if (Math.abs(pathdist) <= 0) { 									// 路程为零时候
			// 	square.findEnd();
			// } else {
			// 	square.setPaht([epos]);
			// }

			//放技能未结束
			if (square.mapPos) {
				BattleSceneMgr.getInstance().addChildToWorld(square);
				square.x = square.mapPos.x;
				square.y = square.mapPos.y;
				square.mapPos = null;
			}

			square.removeTween();
			square.changeStatus(CSquare_Status.STATUS_WALK);

			// //创建对象消耗重灾区
			Tween.get(square).to({ x: epos.x, y: epos.y }, square.getSpeed() + 35).call(() => {
				if (square.m_pStatus == CSquare_Status.STATUS_WALK) {
					square.changeStatus(CSquare_Status.STATUS_STAND);
				}
			});

			if (spos.x != epos.x && spos.y != epos.y) {
				let radian: number = Utils.MathUtils.getRadian2(spos.x, spos.y, epos.x, epos.y);
				let angle: number = Math.atan2(Math.sin(radian), Math.cos(radian)) * 180 / Math.PI;
				square.setDirectionOnAngle(angle);
			}

		}

		// /**寻路径 return cell*/
		// private getPathCell(scell: Cell, ecell: Cell, unit: Unit): egret.Point[] {
		// 	let mapid = BattleModel.getMapId();
		// 	let staggeredFinder: StaggeredFinder = new StaggeredFinder(mapid, this.m_pGrids.getCells());
		// 	let path = staggeredFinder.seachWay(scell, ecell, unit);
		// 	path = path.reverse()
		// 	return path;
		// }

		// /**寻路径 return piexl*/
		// private getPathPiexl(spos: egret.Point, epos: egret.Point, unit: Unit): egret.Point[] {
		// 	let snode: Cell = this.m_pGrids.getCellByPixel(spos.x, spos.y);
		// 	let enode: Cell = this.m_pGrids.getCellByPixel(epos.x, epos.y);
		// 	let path: egret.Point[] = null;
		// 	debugBatt(format("BattleSceneMgr:getPathPiexl--->>star:{1}_{2} end:{3}_{4}", snode.getCellX(), snode.getCellY(), enode.getCellX(), enode.getCellY()));
		// 	//如果是同一个格仔
		// 	if (snode.equals(enode)) {
		// 		path = [epos];
		// 		debugBatt("BattleSceneMgr:getPathPiexl--->>path:", epos.x, epos.y);
		// 	} else {
		// 		path = this.getPathCell(snode, enode, unit);
		// 		path.forEach((value: egret.Point, index: number, array: egret.Point[]) => {
		// 			debugBatt("BattleSceneMgr:getPathPiexl--->>path:", value.x, value.y);
		// 			// 最后终点按实际像素赋值
		// 			if (index == array.length - 1) {
		// 				value.setTo(epos.x, epos.y);
		// 			} else {
		// 				let cell = new Cell(value.x, value.y);
		// 				let pos = cell.cellToPixel();
		// 				value.setTo(pos.x, pos.y);
		// 			}
		// 		});
		// 	}
		// 	return path;
		// }

		public setStartAni() {
			if(this.m_bIsDestroy) return;

			//攻墙地图不缩放
			if (BattleModel.getMapId() != 6) {
				this.isStart = true;
			}
		}

		//出场动画
		public startAnimation(time) {
			if(this.m_bIsDestroy) return;

			let self = this;
			// if(self.isStart && TimerUtils.getServerTimeMill() - BattleModel.getBattleStartTime() > 0 && BattleModel.getIsBattleStop() == false )
			if (self.isStart) {
				self.mapScale = self.mapScale + time * self.scaleStep;
				if (self.mapScale > BattleSceneMgr.MAP_TARGER_SCALE) {
					self.mapScale = BattleSceneMgr.MAP_TARGER_SCALE;
				}

				self.m_pMapView.set_scale(self.mapScale);
				if (self.mapScale >= BattleSceneMgr.MAP_TARGER_SCALE) {
					self.isStart = false;
				}
			}
		}

		public startMoveCamera() {
			if(this.m_bIsDestroy) return;

			if (!this.m_pMapView || !this.m_pMapView.moveTo) {
				return;
			}
			this.setStartAni();
			if (BattleModel.getMapId() != 6) {
				let point = ConstUtil.getNumArray(IConstEnum.BATTLE_MAP_1_MOVE_POINT);
				let flame = ConstUtil.getValue(IConstEnum.BATTLE_MAP_1_MOVE_TIME);
				this.m_pMapView.moveTo(point[0], point[1], true, flame);


				let focusTime = ConstUtil.getValue(IConstEnum.BATTLE_RUN_FOCUS_TIME);
				Utils.TimerManager.doTimer(focusTime, 1, this.setFocus, this);
			} else {
				let point = ConstUtil.getNumArray(IConstEnum.BATTLE_MAP_2_MOVE_POINT);
				let flame = ConstUtil.getValue(IConstEnum.BATTLE_MAP_2_MOVE_TIME);
				this.m_pMapView.moveTo(point[0], point[1], true, flame)
			}
		}

		// public test;
		//播放技能特效
		public playSkill(avo: SkillAtkVo) {
			if(this.m_bIsDestroy) return;
			// let unitobj = this.getDynamicObj(avo.getTargetId());
			// if(!unitobj){
			// 	error("获取不到技能目标！！！！！！！！！！！！！！！！！",avo);
			// 	return;
			// }

			let battleMap = this.m_pMapView as BattleMap;
			let pos = avo.getOnePosition() as egret.Point;
			if (pos == null) {
				let targetObj: CSquare = this.getDynamicObj(avo.attackData.id);
				if (!targetObj) {
					error("技能释放失败!!!!!!", avo);
					return;
				}

				let [x, y] = targetObj.getMapXY();
				pos = new egret.Point(x, y);
			}

			let skilldata = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[skilldata.skillEffectId];

			let effect;

			if (skilleffectData.showType == SkillShowType.NORMOL_SKILL) {
				effect = new NormalSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.BUFF_SKILL) {

			} else if (skilleffectData.showType == SkillShowType.BAGUA_SKILL) {   //八卦
				effect = new BaguaSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.LONGjUANFENG_SKILL) { //龙卷风
				effect = new LongJuanFengSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.TUOZHUAICHUJUE_SKILL) {  //拖拽处决
				effect = new TuoZhuaiSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.YANYUEDAO_SKILL) {   //偃月刀
				effect = new YanyuedaoSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.XUANFENGZHAN_SKILL) {    //旋风斩
				effect = new XuanfengzhanSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.LIEFENG_SKILL) {    //裂缝
				effect = new LiefengSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.HJZD_SKILL) {    //吼叫震动
				effect = new HJZDSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.ASSAULT) {    //冲击技能
				let attIndex = avo.attIndex;
				let attIndexChild = avo.attIndexChild;
				let targetList = avo.targetList;
				debug("赵云技能  >> " + avo.attackData.id, "attIndex= " + attIndex, "attIndexChild =" + attIndexChild, "targetList=", targetList);
				if (avo.attIndexChild == 0) {
					effect = new AssaultSkillAnimation(avo, this, this.m_pMapView, pos);
				} else {
					for (let effect of this.m_skillEffectList) {
						if (effect.setTargetList) {
							effect.setTargetList(avo);
						}
					}
				}
				// console.log("赵云技能 ",avo);
			} else if (skilleffectData.showType == SkillShowType.BINGYU) {
				effect = new BingyuSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.JIANZEHN) {
				effect = new JianzhenSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.LEIDIAN) {
				effect = new ShandianqiuSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.POCHENG_SKILL) {    //破城
				effect = new PoChengSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.BINGYU_COLOR_SKILL) {    //冰雨
				effect = new BingyuColorSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.MEIHUO_SKILL) {    //魅惑
				effect = new MeihuoSkillAnimation(avo, this, this.m_pMapView, pos);
			} else if (skilleffectData.showType == SkillShowType.DUB_LEVEL_SKILL) { //双层技能
				effect = new DubLevelSkillAnimation(avo, this, this.m_pMapView, pos);
			}
			if (effect) {
				this.m_skillEffectList.push(effect);
			}
			//技能音效
			Sound.playID1(skilleffectData.effectSound);
		}

		public removeEffect(effect) {
			if(this.m_bIsDestroy) return;

			for (let i = 0; i <= this.m_skillEffectList.length; i++) {
				if (this.m_skillEffectList[i] == effect) {
					this.m_skillEffectList.splice(i, 1);
				}
			}
		}

		public stopSquareAction(time: number) {
			if(this.m_bIsDestroy) return;

			this.m_pDynamicObjs && this.m_pDynamicObjs.forEach((obj: CSquare, index: number, array: any[]) => {
				if (!obj.parent || !obj.stopAction) return;
				obj.stopAction();
			}, this)

			Utils.TimerManager.doTimer(time, 1, this.startSquareAction, this);

			// console.log("冻结战斗场景~~~~~~~~~~~");
			// BattleModel.setIsStopPlay(true);
		}

		public startSquareAction() {
			if(this.m_bIsDestroy) return;

			this.m_pDynamicObjs && this.m_pDynamicObjs.forEach((obj: CSquare, index: number, array: any[]) => {
				if (!obj.parent || !obj.startAction) return;
				obj.startAction();
			}, this)
			// BattleModel.setIsStopPlay(false);
			// console.log("恢复战斗场景~~~~~~~~~~~");
		}

		public changeAllStand() {
			if(this.m_bIsDestroy) return;

			this.m_pDynamicObjs.forEach((obj: CSquare, index: number, array: any[]) => {
				if (!obj.parent || !obj.changeStatus) return;
				obj.changeStatus(CSquare_Status.STATUS_STAND);
			}, this)
		}

		public playRunSound() {
			if(this.m_bIsDestroy) return;

			let typeList = BattleModel.getSoldierType();
			for (let type of typeList) {
				Sound.playSoldierRun(type);
			}
		}

		//武将头上克制数值提醒
		public createKezhiTips() {
			if(this.m_bIsDestroy) return;

			for (let i = 1; i <= 3; i++) {
				let [type, gId] = BattleModel.getKZGen(i);
				let csquare: CSquare = this.getDynamicObj(gId, CSquare);
				if (csquare && csquare.flyWordNum) {
					if (type == 1) {
						csquare.flyWordNum("green", "属性+20%")
					} else if (type == 2) {
						csquare.flyWordNum("red", "属性-20%")
					}
				}
			}
		}

		//地图上的克制图片
		public createKezhi() {
			if(this.m_bIsDestroy) return;

			let offy = 50;
			let arr = [[800, 370], [1050, 500], [1300, 630]];
			if (!BattleModel.getIsAleardyCurBattle() && BattleModel.getMapId() != 6) {
				for (let i = 1; i <= 3; i++) {
					let t = BattleModel.getKZ(i);
					if (t) {
						let img = new eui.Image(`zyt_kz0${t}_png`);
						img.x = arr[i - 1][0];
						img.y = arr[i - 1][1];
						this.addChildToBuild(img);

						Tween.get(img).wait(2000).to({ alpha: 0 }, 500).call(() => {
							Utils.removeFromParent(img);
						})
					}
				}
			}
		}


		//攻城战结束监听
		public siegeEnd(data: any) {
			if(this.m_bIsDestroy) return;
			
			//等待界面也要弹出结算
			if (BattleModel.isCityWar() || SceneManager.getCurrScene() == SceneEnums.WAIT_BATTLE_MAP) {

				if (data.result && WorldModel.getCityWarInfo() && WorldModel.getCityWarInfo().cityId == data.result.cityId) {
					const result: ItfSiegeResult = data.result;
					Utils.open_view(TASK_UI.POP_WORLD_SIEGE_RESULT, result);
					return;
				}
			}
		}
	}
}
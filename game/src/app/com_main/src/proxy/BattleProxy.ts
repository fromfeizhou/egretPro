class BattleProxy extends BaseProxy {

	public constructor() {
		super();
		FightResponseUtil.battleProxy = this;
	}

	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.S2C_WAR_BATTLE_INIT, this, 'S2C_WAR_BATTLE_INIT', ProxyEnum.RECEIVE], //战场初始化（不管中途还是开始进入，都有个战场初始化过程）
			[ProtoDef.S2C_WAR_COMBAT_UNIT, this, 'S2C_WAR_COMBAT_UNIT', ProxyEnum.RECEIVE], //实时战斗数据推送
			[ProtoDef.S2C_WAR_DEATH, this, 'S2C_WAR_DEATH', ProxyEnum.RECEIVE], //死亡
			[ProtoDef.S2C_WAR_FOLLOW_UP, this, 'S2C_WAR_FOLLOW_UP', ProxyEnum.RECEIVE], //后续部队加入(持久类型才会有)
			[ProtoDef.S2C_WAR_MOVE_SYNC, this, 'S2C_WAR_MOVE_SYNC', ProxyEnum.RECEIVE], //移动同步
			[ProtoDef.S2C_WAR_SYNC_MOVE_SPEED, this, 'S2C_WAR_SYNC_MOVE_SPEED', ProxyEnum.RECEIVE], //同步移动速度
			[ProtoDef.S2C_WAR_BUFF_ADD, this, 'S2C_WAR_BUFF_ADD', ProxyEnum.RECEIVE], //战斗单元添加buff
			[ProtoDef.S2C_WAR_BUFF_UN, this, 'S2C_WAR_BUFF_UN', ProxyEnum.RECEIVE], //取消buff
			[ProtoDef.S2C_WAR_BUFF_OFFSET, this, 'S2C_WAR_BUFF_OFFSET', ProxyEnum.RECEIVE], //BUFF偏移
			[ProtoDef.S2C_WAR_BUFF_BLOOD, this, 'S2C_WAR_BUFF_BLOOD', ProxyEnum.RECEIVE], //BUFF气血
			[ProtoDef.S2C_WAR_ELEMENT_BLOOD, this, 'S2C_WAR_ELEMENT_BLOOD', ProxyEnum.RECEIVE], //更新元素气血
			[ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD, this, 'S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD', ProxyEnum.RECEIVE], //BUFF气血（雷戟专用）
			[ProtoDef.S2C_WAR_GUIDE, this, 'S2C_WAR_GUIDE', ProxyEnum.RECEIVE], //引导通知


			[ProtoDef.C2S_WAR_START, this, 'C2S_WAR_START', ProxyEnum.SEND], //发送开始战斗
			[ProtoDef.S2C_WAR_START, this, 'S2C_WAR_START', ProxyEnum.RECEIVE], //发送开始战斗返回

			[ProtoDef.C2S_WAR_ANAGER_SKILL, this, 'C2S_WAR_ANAGER_SKILL', ProxyEnum.SEND], //怒气技能

			[ProtoDef.C2S_WAR_REENTRY_BATTLE, this, 'C2S_WAR_REENTRY_BATTLE', ProxyEnum.SEND], //重新进入战场
			[ProtoDef.S2C_WAR_REENTRY_BATTLE, this, 'S2C_WAR_REENTRY_BATTLE', ProxyEnum.RECEIVE],


			[ProtoDef.C2S_WAR_QUIT_BATTLE, this, 'C2S_WAR_QUIT_BATTLE', ProxyEnum.SEND], 		//退出战场
			[ProtoDef.S2C_WAR_QUIT_BATTLE, this, 'S2C_WAR_QUIT_BATTLE', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_WAR_QUICK_BATTLE, this, 'C2S_WAR_QUICK_BATTLE', ProxyEnum.SEND], 		//快速战斗返回结果
			[ProtoDef.S2C_WAR_QUICK_BATTLE, this, 'S2C_WAR_QUICK_BATTLE', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_WAR_AUTO, this, 'C2S_WAR_AUTO', ProxyEnum.SEND], 		//设置是否自动战斗
			[ProtoDef.S2C_WAR_AUTO, this, 'S2C_WAR_AUTO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_WAR_AUTO_LIST, this, 'C2S_WAR_AUTO_LIST', ProxyEnum.SEND], //获取各个战斗类型的自动状态
			[ProtoDef.S2C_WAR_AUTO_LIST, this, 'S2C_WAR_AUTO_LIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_WAR_QUERY_HERO_DATA, this, 'C2S_WAR_QUERY_HERO_DATA', ProxyEnum.SEND], //获取战斗对象属性
			[ProtoDef.S2C_WAR_QUERY_HERO_DATA, this, 'S2C_WAR_QUERY_HERO_DATA', ProxyEnum.RECEIVE],


			[ProtoDef.S2C_WAR_SKILL_FAIL, this, 'S2C_WAR_SKILL_FAIL', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_WAR_OVER, this, 'S2C_WAR_OVER', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_GM_WAR, this, 'C2S_GM_WAR', ProxyEnum.SEND],
			[ProtoDef.S2C_GM_WAR, this, 'S2C_GM_WAR', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_GM_WAR_OVER, this, 'S2C_GM_WAR_OVER', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_WAR_OVER_HP, this, 'S2C_WAR_OVER_HP', ProxyEnum.RECEIVE],
		]
	}


	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_WAR_BATTLE_INIT: {
				Loading.hide();
				let data = body as gameProto.IS2C_WAR_BATTLE_INIT;
				let lastMapId = 0;

				if (BattleModel.getJoinedBattleId()) {
					lastMapId = BattleModel.getMapId();
					BattleModel.clear();
					BattleModel.alreadyDestroy = true;
				}
				let battleinfo = BattleInfoVo.create(data);
				BattleModel.addBattleInfo(battleinfo);
				BattleModel.setJoinedBattleId(battleinfo.battleId);
				BattleModel.setMapId(data.terrainId);       		//战场地图

				this.addHeroWarData(data.attack);
				this.addHeroWarData(data.defense);
				this.addSceneUnit(data.sceneCombatUnit);

				// if(DEBUG){
				// 	let atkHp = 0;
				// 	let defHp = 0;
				// 	let SceneUnit = 0;
				// 	for(let i of data.attack){
				// 		for(let k of i.combatUnit){
				// 			atkHp += k.troops;
				// 		}
				// 	}

				// 	for(let i of data.defense){
				// 		for(let k of i.combatUnit){
				// 			defHp += k.troops;
				// 		}
				// 	}

				// 	for(let k of data.sceneCombatUnit){
				// 		SceneUnit += k.troops;
				// 	}
					
				// 	console.log("战斗开始血量 攻方场景",atkHp,defHp,SceneUnit)
				// }

				BattleModel.setAtkAllMaxBlood(data.atkMaxTroops);
				BattleModel.setDefAllMaxBlood(data.defMaxTroops);

				//设置预加技能
				let group = SceneResGroupCfg.getResGroup(ModuleEnums.BATTLE_MAP_INIT)
				let skillGroup = BattleModel.getPreDownload();
				SceneResGroupCfg.setResGroup(SceneEnums.BATTLE_MAP, group.concat(skillGroup));

				//不同场景的重新创建地图
				if(lastMapId != BattleModel.getMapId()){
					SceneManager.enterScene(SceneEnums.BATTLE_MAP, null, false);
					return ;
				}
				let bool = SceneManager.enterScene(SceneEnums.BATTLE_MAP, null);
				if (!bool) {
					let map = com_main.BattleMap.getClass();
					if (map) {
						map.destoryDate();
						map.initData();
						MapUtil.initMapData(BattleModel.getMapId());
						map.setMapSetting(MapLoader.getMapSetting(BattleModel.getMapId()));
						map.onEnterDealData();
					}
					let battleView = com_main.BattleView.getInstance();//SceneManager.getView("com_main.BattleView", body);
					battleView.setData();

					com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_CHANGE_MAP, null);
				}

				break;
			}
			case ProtoDef.S2C_WAR_COMBAT_UNIT: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			case ProtoDef.S2C_WAR_FOLLOW_UP: {
				this.addHeroWarData(body.heroWarData);
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			case ProtoDef.S2C_WAR_MOVE_SYNC: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			case ProtoDef.S2C_WAR_SYNC_MOVE_SPEED: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			case ProtoDef.S2C_WAR_DEATH: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			case ProtoDef.S2C_WAR_BUFF_ADD: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//取消buff
			case ProtoDef.S2C_WAR_BUFF_UN: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//BUFF偏移
			case ProtoDef.S2C_WAR_BUFF_OFFSET: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//BUFF气血
			case ProtoDef.S2C_WAR_BUFF_BLOOD: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//更新元素气血
			case ProtoDef.S2C_WAR_ELEMENT_BLOOD: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//BUFF气血（雷戟专用）
			case ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//引导通知
			case ProtoDef.S2C_WAR_GUIDE: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			//战斗结束
			case ProtoDef.S2C_WAR_OVER: {
				FightResponseUtil.AddData(protocol, body.flowTime, notification);
				return;
			}

			case ProtoDef.S2C_WAR_OVER_HP:{
				// console.log('结算血量 攻守',body.attCountHp,body.defCountHp);
				BattleModel.setLastHp(body.battleId ,body.attCountHp,body.defCountHp);
				com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_OVER, null);
				break;
			}

			//发送开始战斗返回
			case ProtoDef.S2C_WAR_START: {
				// if(body.status == 0){
				Utils.TimerManager.doTimer(500, 1, () => {
					com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_START_RUN, null);
				}, this)
				// }
				break;
			}

			//重新进入战场
			case ProtoDef.S2C_WAR_REENTRY_BATTLE: {
				if(body.state && BattleModel.isReConnectBattle){
					SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
				}
				BattleModel.isReConnectBattle = false;
				break;
			}

			//退出战场
			case ProtoDef.S2C_WAR_QUIT_BATTLE: {
				// // if( body.state == 0 ){
				// 	SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
				// // }
				// let battleType: CheckPointType = BattleModel.getCheckPointType(BattleModel.getJoinedBattleId());
				// if(battleType == CheckPointType.NEW_CITY_WAR){
				// 	SceneManager.enterScene(SceneEnums.WORLD_CITY);
				// }else{
				// 	SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
				// }
				break;
			}

			//快速战斗返回结果
			case ProtoDef.S2C_WAR_QUICK_BATTLE: {
				//返回 1:失败 0:成功 
				if (body.state === 0) {
					FightResponseUtil.quickBattle();
				}
				// else {
				// 	EffectUtils.showTips("此战斗无法跳过", 1, false);
				// }
				break;
			}

			//设置是否自动战斗
			case ProtoDef.S2C_WAR_AUTO: {
				if (body.state == 0) {
					BattleModel.setAutoState(BattleProxy.autoState);
					com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_CHANGE_PLAYER_STATUS, null);
				}
				break;
			}

			//获取各个战斗类型的自动状态
			case ProtoDef.S2C_WAR_AUTO_LIST: {
				BattleModel.setWarAutoList(body);
				break;
			}

			case ProtoDef.S2C_WAR_QUERY_HERO_DATA: {

				// message QueryHeroData{
				// 	required int32 elementId	=1;	//元素ID
				// 	required int64 heroId		=2;	//英雄唯一ID
				// 	required int32 heroSysId	=3;	//英雄配置表ID

				// 	repeated SysKeyValue keyValue 	=4;	//基础属性
				// 	repeated QueryHeroBuffData buffData=5;//buff属性
				// }


				// //查看武将属性
				// message S2C_WAR_QUERY_HERO_DATA{
				// 	required int64 battleId = 1;	//战场ID
				// 	repeated QueryHeroData heroData=2;		//英雄数据
				// }

				for (let heroData of body.heroData) {
					let unit = BattleModel.getUnit(heroData.elementId);
					// debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~start")
					// debug("id :", heroData.elementId, "名字：", unit.getName())
					for (let Attri of heroData.keyValue) {
						let name = Utils.getAttriNameByType(Attri.key);
						let value = Attri.value;
						if (Attri.isFloat == 1) {
							value = value / 10000;
						} else {
							value = value;
						}
						debug(name, " : ", value)
					}
					// debug(heroData.buffData);
					// debug("buff 属性~~~~~~~~~~~~~~~~")
					for (let buff of heroData.buffData) {
						let name = Utils.getAttriNameByType(buff.attributeId);
						let value = buff.attributeValue;
						// debug("buffid = " + buff.buffId, "配置表id=", buff.buffSysId, name, " : ", value);
					}
					// debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~end")
				}


				break;
			}

			case ProtoDef.S2C_WAR_SKILL_FAIL: {
				debugBatt("释放技能失败")
				break;
			}

			case ProtoDef.S2C_GM_WAR: {
				console.log(body);
				if (!body.status) {
					BattleProxy.send_C2S_WAR_REENTRY_BATTLE(body.battleId);
				}
				break;
			}

			case ProtoDef.S2C_GM_WAR_OVER: {
				Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.isVictory, rewards: [], battleType: CheckPointType.GM });
				break;
			}
			default: {
				debug("未处理事件:", protocol);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	public dealData(notification: AGame.INotification) {
		if (!notification) {
			return;
		}
		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_WAR_COMBAT_UNIT: {
				let list = [];
				for (let attackInfo of body.realTimeWar) {
					let avo = SkillAtkVo.create(attackInfo, body.flowTime);
					if (attackInfo.callCombatUnit && attackInfo.callCombatUnit.length > 0) {
						this.addSceneUnit(attackInfo.callCombatUnit);
					}
					list.push(avo);
				}
				body.realTimeWar = list;
				break;
			}

			case ProtoDef.S2C_WAR_FOLLOW_UP: {
				this.addHeroWarData(body.heroWarData);
				break;
			}

			case ProtoDef.S2C_WAR_MOVE_SYNC: {
				break;
			}

			case ProtoDef.S2C_WAR_SYNC_MOVE_SPEED: {
				let data = body as gameProto.S2C_WAR_SYNC_MOVE_SPEED;
				for (let i in data.moveSpeedData) {
					let moveSpeedData = data.moveSpeedData[i];
					let buId = (moveSpeedData >> 17) & 0x3fff;
					let speed = (moveSpeedData >> 3) & 0x3fff;

					let unit = BattleModel.getUnit(buId);
					if (unit) {
						let lastSpeed = unit.moveSpeed;
						unit.setSpeed(speed);
						let cruSpeed = unit.moveSpeed;
						// console.log("lastSpeed = ,speed",lastSpeed,cruSpeed);
					}
				}
				break;
			}

			case ProtoDef.S2C_WAR_DEATH: {
				if (!body.warDeathData) {
					error("body.warDeathData is null");
					error("body", body);
					return;
				}

				for (let deathData of body.warDeathData) {
					let elementId = deathData.elementId;
					let isDeath = deathData.isDeath;

					if (isDeath) {
						let unit = BattleModel.getUnit(elementId);
						if (unit && unit.type == UnitType.GENERAL) {
							BattleModel.addGeneralDie(unit.faction, unit.sysId);
						}
						// BattleModel.removeUnit(elementId);
					}

					for (let elementId of deathData.soldierElementId) {
						BattleModel.addSoldierDie(elementId);
						// BattleModel.removeUnit(elementId);
					}
					// repeated BuffData buffData=3;	//BUFF 目标元素ID(14位)+buffId(14位)+buffSysId(22位)
				}
				break;
			}

			case ProtoDef.S2C_WAR_BUFF_ADD: {
				debugBatt("添加buff");
				debugBatt(body)
				for (let buff of body.buffData) {
					debugBatt("tarId, buffId, buffSysId = ", buff.elementId, buff.buffId, buff.buffSysId);
					BattleModel.addBuff(buff);
				}
				break;
			}

			//取消buff
			case ProtoDef.S2C_WAR_BUFF_UN: {
				// required int64 battleId = 1;	//战场ID
				// required int32 flowTime = 2;
				// repeated int32 buffData=3;	//BUFF 目标元素ID(14位)+buffId(14位)
				debugBatt("取消buff ");
				debugBatt(body)

				break;

			}

			//BUFF偏移
			case ProtoDef.S2C_WAR_BUFF_OFFSET: {
				debugBatt("buff 偏移 ");
				// required int64 battleId = 1;		//战场ID
				// required int32 flowTime = 2;
				// repeated BuffOffsetXy offsetXy=3; 	//buffID（14位 最大值16383）+元素ID（14位 最大值16383）+buff使对方移位 状态（4位）+X轴（8）+y（7位） 状态：0.无，1 击退（往前击退） 2击飞 3冲退 4击退（往两边击退）
				break;

			}

			//BUFF气血
			case ProtoDef.S2C_WAR_BUFF_BLOOD: {
				break;
			}

			//更新元素气血
			case ProtoDef.S2C_WAR_ELEMENT_BLOOD: {

				// required int64 battleId = 1;	//战场ID
				// required int32 flowTime = 2;
				// repeated int32 anger=3; 			//元素ID（14位 最大值16383）+攻击者当前怒气(武将才有)（7位）

				// for (int i = 0; i < msg.anger.Count; i++)
				// {
				// 	number item = msg.anger[i];
				// 	int id = (int)((item >> 17) & 0x3fff);
				// 	int angry = (int)((item >> 10) & 0x7f);
				// 	BattleUnit bu = ModelFight.Instance.GetUnit(id);
				// 	if (bu != null)
				// 	{
				// 		bu.fightObjVo.angry = angry;
				// 		/*      if(MyDebug.isDebug)
				// 			{
				// 				MyDebug.Log("心跳怒气 >> ", id, angry, Director.Instance.Runtime);
				// 			}   */
				// 	}
				// }

				break;
			}

			//BUFF气血（雷戟专用）
			case ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD: {
				break;
			}

			//引导通知
			case ProtoDef.S2C_WAR_GUIDE: {
				break;
			}

			//战斗结束
			case ProtoDef.S2C_WAR_OVER: {
				let data = body as gameProto.IS2C_WAR_OVER;
				FightResponseUtil.isWarOver = true;
				BattleModel.setIsStopPlay(true);
				FightResponseUtil.victory = data.victory;

				let delayTime = ConstUtil.getValue(IConstEnum.BATTLE_SETTLE_DELAY_TIME);
				Utils.TimerManager.doTimer(delayTime, 1, () => {
					FightResponseUtil.showResultView()
				}, this)

				WorldModel.battleOver();

				// console.log('结算血量 攻守',data.attCountHp,data.defCountHp);
				// BattleModel.setLastHp(data.attCountHp,data.defCountHp);

				// com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_OVER, null);
				break;
			}

			default: {
				debug("未处理事件:", protocol);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	public addHeroWarData(data: gameProto.IHeroWarData[]) {
		for (let heroWarData of data) {
			BattleModel.addSoldierType(heroWarData.soldierType);
			// console.log("heroWarData.name", heroWarData.name, "heroWarData.attOrDef =", heroWarData.attOrDef)
			BattleModel.setPlayerName({ attOrDef: heroWarData.attOrDef, name: heroWarData.name, country: heroWarData.country });
			let combatUnit = heroWarData.combatUnit;
			let generalName11 = "";
			let benumberUId = 0;
			for (let unit of combatUnit) {

				unit["faction"] = heroWarData.attOrDef;
				unit["soldierType"] = heroWarData.soldierType;
				unit["soldierLv"] = heroWarData.soldierLv;
				unit["heroPosition"] = heroWarData.heroPosition;

				if (unit.generalName) {
					generalName11 = unit.generalName;
					benumberUId = unit.elementId;
				} else {
					unit.generalName = generalName11;
					unit["benumberUId"] = benumberUId;
				}

				let unitinfo = UnitInfoVo.create(unit)
				BattleModel.addUnit(unitinfo);

				if(unit.type == UnitType.GENERAL){
					BattleModel.setPosInfo(heroWarData.attOrDef,heroWarData.heroPosition,heroWarData.soldierType,unit.elementId);
				}
				
			}
		}
	}

	public addSceneUnit(combatUnit) {
		for (let unit of combatUnit) {
			unit["faction"] = FactionType.DEF;
			unit["type"] = unit.soldierType;
			let unitinfo = UnitInfoVo.create(unit)
			BattleModel.addUnit(unitinfo);
		}
	}

	/////////////////////////////////////////////////////////////////////
	/**发送重新进入战斗 */
	public static send_C2S_WAR_REENTRY_BATTLE(battleId: number) {
		// if (BattleModel.getJoinedBattleId() == battleId) {
		// 	return;
		// }
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_REENTRY_BATTLE) as gameProto.C2S_WAR_REENTRY_BATTLE;
		data.battleId = battleId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**进入战场结果 */
	public static send_C2S_WAR_START() {
		let battleInfo: BattleInfoVo = BattleModel.getJoinedBattleInfo();
		if (!battleInfo) {
			return;
		}
		battleInfo.setTimeStart();

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_START);
		data.battleId = BattleModel.getBattleInfo().battleId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**发送战斗单位使用技能 */
	public static send_BATTLE_USE_SKILL(elementId: number, skillId: number) {
		debugBatt("BattleProxy:---send_BATTLE_USE_SKILL>>", elementId, skillId);
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_ANAGER_SKILL);
		data.battleId = BattleModel.getJoinedBattleId();
		data.elementId = elementId;
		data.baseSkillId = skillId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	//退出战场
	private static exitId: number;
	public static send_C2S_WAR_QUIT_BATTLE(battleId?: number) {
		if (this.exitId == battleId) return;
		this.exitId = battleId;
		debugBatt("BattleProxy:---send_C2S_WAR_QUIT_BATTLE>>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_QUIT_BATTLE);
		data.battleId = battleId ? battleId : BattleModel.getJoinedBattleId();
		AGame.ServiceBuilder.sendMessage(data);
	}

	//快速战斗返回结果
	public static send_C2S_WAR_QUICK_BATTLE() {
		debugBatt("BattleProxy:---send_C2S_WAR_QUICK_BATTLE>>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_QUICK_BATTLE);
		data.battleId = BattleModel.getJoinedBattleId();
		AGame.ServiceBuilder.sendMessage(data);
	}


	//设置是否自动战斗
	public static autoState = true;
	public static send_C2S_WAR_AUTO(autoState: boolean) {
		debugBatt("BattleProxy:---send_C2S_WAR_AUTO>>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_AUTO);
		data.battleId = BattleModel.getJoinedBattleId();
		data.autoState = autoState;
		AGame.ServiceBuilder.sendMessage(data);

		this.autoState = autoState;
	}

	//获取各个战斗类型的自动状态
	public static send_C2S_WAR_AUTO_LIST() {
		debugBatt("BattleProxy:---send_C2S_WAR_AUTO_LIST>>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_AUTO_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	//获取战斗对象属性
	public static send_C2S_WAR_QUERY_HERO_DATA(battleId, list: number[]) {
		debugBatt("BattleProxy:---send_C2S_WAR_QUERY_HERO_DATA>>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_QUERY_HERO_DATA);
		data.battleId = BattleModel.getJoinedBattleId();
		data.elementId = list;
		AGame.ServiceBuilder.sendMessage(data);
	}

	//gm指令战斗
	public static send_C2S_GM_WAR(arg: gameProto.C2S_GM_WAR) {
		debugBatt("BattleProxy:---send_C2S_GM_WAR>>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GM_WAR);
		data.att = arg.att;
		data.def = arg.def;
		data.terrainId = arg.terrainId;
		data.isNotSoldier = arg.isNotSoldier;
		data.isSingleSoldier = arg.isSingleSoldier;
		data.isDefendAuto = arg.isDefendAuto;
		data.isSkillStop = arg.isSkillStop;
		AGame.ServiceBuilder.sendMessage(data);
	}

}

/** 世界地图数据管理 */
class WorldMapModel {

	/**
	 * 建筑信息
	 * id			//城池id
	 * atkCountry	//当前正在攻击该城池的国家
	 * atkNum		//当前的进攻人数
	 * buildCD		//建筑cd
	 * country		//国家(1:魏,2:蜀,3:吴)
	 * maxTroop		//最大守军兵力
	 * maxWallHp	//最大城墙血量
	 * troop		//当前守军兵力
	 * wallHp		//当前城墙血量
	 * mayor		//太守
	 * star			//星级
	 * taskCountry	//进攻国家任务国家
	 * viceMayor	//副城主
	 * 
	 * is_have_enemy	//周围是否有敌国
	 * is_self			//是否自己的国
	 * type				//当前建筑状态
	 */
	private static m_pCityBuildInfo = {};

	/**世界事件
	 * 
	 * 攻城奖励
	 * 
	 */
	private static m_pWorldEvents = {};
	private static m_pMilitaryAffairsEvent = {};

	private static m_pEventRefreshTime = 0;//事件刷新总事件
	private static m_pNextEventRefreshTime = 0;//下次刷新事件时间
	private static m_pNowEventRefreshTime = 0;//当前倒计时时间
	private static m_pIsCountDown = false;//是否开始事件刷新倒计时

	public static m_pCapitalId = 0;//我方国家首都ID
	public static m_pLastSelectId = 0;//最后选择的国家ID

	public static m_pAttackIds = [];//攻击目标列表（建筑id）
	public static m_pDefenseIds = [];//防御目标列表（建筑id）

	/**建筑特效 */
	private static m_pBuildEffects: any = {};

	/**世界地图事件指引 */
	public static m_pEventGudies: any = {};

	/**
	 * 君主选择攻击目标城池id
	 * 结束选择时间戳
	 */
	public static m_pSelectAttackTargetIds: any[] = [];
	public static m_pSelectAttackTargetEndTime: number = 0;

	/**城池数量 */
	private static m_pCountryCount: number = 0;
	/**我方占领城池数量 */
	private static m_pSelfCountryCount: number = 0;
	private static m_pCountryCounts: any = [0, 0, 0];

	/**是否有已经完成的世界时间 */
	public static m_pIsHaveSuccess: boolean = false;

	public static m_pMJData: any = [];

	public static m_pNowEventCount: number = 0;

	public static set countryCount(num: number) {
		this.m_pCountryCount = num;
	}

	public static set selfCountryCount(num: number) {
		this.m_pSelfCountryCount = num;
	}

	public static get countryCount(): number {
		return this.m_pCountryCount;
	}

	public static get selfCountryCount(): number {
		return this.m_pSelfCountryCount;
	}

	public static clear() {
		// this.removeEventRefreshCountDown();
		EffectData.removeEffectModule(EffectData.WORLD_MAP);
		this.clearWorldEvents(WorldEventType.RES_COLLECT);
		this.clearWorldEvents(WorldEventType.RES_COLLECT);
		this.clearWorldEvents(WorldEventType.FIGHT);
	}

	/**添加选择国家攻击目标选择对象 */
	public static addSelectAttackTargetIds(ids: any[], endTime: number) {
		// this.m_pSelectAttackTargetEndTime = endTime;
		// this.m_pSelectAttackTargetIds = ids;
		// let wm = com_main.WorldMap.getClass();
		// if (wm) {
		// 	for (var key in ids) {
		// 		if (ids.hasOwnProperty(key)) {
		// 			var id = ids[key];
		// 			wm.showAttackSelect(id, true);
		// 		}
		// 	}
		// }

	}

	/**移除选择国家攻击目标选择对象 */
	public static removeSelectAttackTargetIds() {
		// let ids = this.m_pSelectAttackTargetIds;
		// let wm = com_main.WorldMap.getClass();
		// if (wm) {
		// 	for (var key in ids) {
		// 		if (ids.hasOwnProperty(key)) {
		// 			var id = ids[key];
		// 			wm.showAttackSelect(id, false);
		// 		}
		// 	}
		// }

		// delete this.m_pSelectAttackTargetIds;
		// this.m_pSelectAttackTargetIds = null;
		// this.m_pSelectAttackTargetEndTime = 0;
	}

	//==================================================================== 世界事件 ========================================

	/**
	 * 清理指定事件
	 * 返回建筑ids
	 * 
	 * isClearReward 是否清除城池奖励事件
	 *  */
	public static clearWorldEvents(_type: WorldEventType): any {
		// if (_type == WorldEventType.GOVERNMENT_AFFAIRS)
		// 	this.removeEventRefreshCountDown();
		// var ids = {};
		// let events = {};

		// if (_type == WorldEventType.MILITARY_AFFAIRS)
		// 	events = this.m_pMilitaryAffairsEvent;
		// else
		// 	events = this.m_pWorldEvents;

		// for (var key in events) {
		// 	if (events.hasOwnProperty(key)) {
		// 		var element = events[key];

		// 		for (var k in element) {
		// 			if (element.hasOwnProperty(k)) {
		// 				var _element = element[k];

		// 				let id = _element.id;
		// 				let index = _element.index;
		// 				let type = _element.worldEventType;
		// 				if (type && type == _type) {
		// 					if (!ids[id])
		// 						ids[id] = [];

		// 					ids[id].push(index);
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		// for (var key in ids) {
		// 	if (ids.hasOwnProperty(key)) {
		// 		var element = ids[key];

		// 		for (var _key in element) {
		// 			if (element.hasOwnProperty(_key)) {
		// 				var _element = element[_key];
		// 				this.removeWorldEvent(+key, +_element, _type);
		// 			}
		// 		}
		// 	}
		// }

		// return ids;
		return [];
	}

	/**
	 * 添加世界事件 
	 * 
	 * 
	 * info:
	 * 		type : WorldEvent
	 * 		id	 : 城池id
	 * 		startTime:倒计时开始时间
	 * 		endTime：倒计时结束时间
	 * 		
	 * 		affairId：事件id，对应CityBattleAffiarsInfo配置表id
	 * 		index：事件唯一索引
	 * */
	public static addWorldEvent(id: number, info: any) {
		if (!this.m_pWorldEvents[id])
			this.m_pWorldEvents[id] = [];

		this.m_pWorldEvents[id].push(info);
	}

	/**
	 * 添加军务事件 
	 * type : WorldEvent
	 * */
	public static addMilitaryAffairsEvent(id: number, info: any) {
		if (!this.m_pMilitaryAffairsEvent[id])
			this.m_pMilitaryAffairsEvent[id] = [];

		this.m_pMilitaryAffairsEvent[id].push(info);
	}


	/**修改抢封地图标 */
	public static changeRobFDIcon(bId: number,texture:egret.Texture){
		let data = this.m_pEventGudies[bId + '.' + 999];

		if (data && data.icon) {
			data.icon.m_pIcon.texture = texture;
		}
	}

	public static getEventGuides(): any {
		return this.m_pEventGudies;
	}

	/**
	 * bid:建筑id
	 * index：事件标识
	 * 
	 * 事件触发后回调
	 */
	public static onTouchWorldEvent(body: any) {
		let bid = body.id;
		let index = body.index;
		let event = this.m_pWorldEvents[bid];
		// if (event) {
		// 	let cfg = C.AffairsConfig;
		// 	for (var key in event) {
		// 		if (event.hasOwnProperty(key)) {
		// 			var element = event[key];
		// 			if (element.index == index) {
		// 				let affairId = element.affairId;
		// 				let _config = cfg[affairId];

		// 				if (_config) {
		// 					let time = _config.time;
		// 					/**如果有倒计时事件，则需要倒计时 */
		// 					if (time) {
		// 						element.startTime = TimerUtils.getServerTimeMill();
		// 						element.endTime = element.startTime + time;
		// 					}

		// 					return element;

		// 				} else {
		// 					error('读取不到配置！！affairId:', affairId);
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		return body;
	}


	/**开启事件刷新倒计时 */
	public static startEventRefreshCountDown() {
		if (!this.m_pIsCountDown && this.m_pNextEventRefreshTime > 0 && this.m_pEventRefreshTime > 0) {
			this.m_pIsCountDown = true;
			Utils.TimerManager.doTimer(1000, 0, this.eventTimeCall, this);
		}
	}

	/**移除事件刷新倒计时 */
	public static removeEventRefreshCountDown() {
		if (this.m_pIsCountDown) {
			Utils.TimerManager.remove(this.eventTimeCall, this);
			this.m_pNextEventRefreshTime = 0;
			this.m_pNowEventRefreshTime = 0;
			this.m_pEventRefreshTime = 0;
			this.m_pIsCountDown = false;
		}
	}

	/**倒计时回调 */
	public static eventTimeCall() {
		this.m_pNowEventRefreshTime += 1000;

		// debug('事件刷新倒计时：',(this.m_pNextEventRefreshTime - this.m_pNowEventRefreshTime)/1000);

		if (this.m_pNowEventRefreshTime > this.m_pNextEventRefreshTime) {
			this.m_pNextEventRefreshTime += this.m_pEventRefreshTime;
			//请求刷新
			// WorldMapProxy.send_CITY_BATTLE_WORLD_AFFAIRS(WorldEventType.GOVERNMENT_AFFAIRS);
		} else {
			let events = this.m_pWorldEvents;
			if (events) {
				let isHaveSuccess = false;
				let time = TimerUtils.getServerTimeMill();
				for (var key in events) {
					if (events.hasOwnProperty(key)) {
						var element = events[key];
						for (var _key in element) {
							if (element.hasOwnProperty(_key)) {
								var _element = element[_key];

								let startTime = _element.startTime;
								let endTime = _element.endTime;

								if (startTime && endTime) {
									if (time >= endTime) {
										isHaveSuccess = true;
										break;
									}
								}
							}
						}
					}
				}

				if (isHaveSuccess != this.m_pIsHaveSuccess) {
					this.m_pIsHaveSuccess = isHaveSuccess;
					// com_main.MainToolsBar.showEvent();
				}

			}
		}

		if (this.m_pSelectAttackTargetEndTime > 0) {
			console.log('国君选择攻击目标倒计时：', (this.m_pSelectAttackTargetEndTime - TimerUtils.getServerTimeMill()) / 1000);
			if (TimerUtils.getServerTimeMill() > this.m_pSelectAttackTargetEndTime)
				this.removeSelectAttackTargetIds();
		}
	}


	//==================================================================== 城池数据 ========================================
	/**
	 * 清除建筑数据
	 */
    public static clear_CityBuildInfo() {

    }


	/**
	 * 解析建筑数据
	 * 1（敌国建筑）我国不可攻打: 周围没有我国建筑 || （周围有我国建筑 && 我国建筑没和首都连通）
	 * 2（敌国建筑）除国家任务外我国可攻打：(atkCountry==0 || atkCountry==我国) && 与我国首都连通 && taskCountry==0 && country!=我国
	 * 3（我国建筑-显示摧毁图标）除国家任务外我方被攻击状态：country==我国 && atkCountry>0 && taskCountry==0
	 * 4（敌国建筑）敌方开战状态（另外2国的战斗）：country!=我国 && atkCountry!=我国 && atkCountry>0
	 * 5（敌国建筑-显示攻击图标）国家任务攻击状态：country!=我国 && （taskCountry==我国 || raidCountry 里面有我国id）
	 * 6（我国建筑-显示防守图标）国家任务防守状态：country==我国 && taskCountry>0
	 * 7 重建状态：buildCD>当前时间：buildCD>当前时间
	 * 
	 * 判断优先级：
	 * 7 > 4 > 1 > 2 > 3 > 5 > 6
	 */
	public static initCityBuildInfo(data: any) {
		let config = C.WorldMapConfig;
		var infos = this.m_pCityBuildInfo;
		let self_country = RoleData.countryId;

		this.m_pCountryCounts = [0, 0, 0];
		this.m_pCountryCount = 0;



		for (var key in data) {
			var item = data[key];
			let id = item.id;
			infos[id] = item;
		}

		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				var element = config[key];
				if (element.type == 1 && infos[element.id].country == RoleData.countryId) {
					this.m_pCapitalId = element.id;
					break;
				}
			}
		}

		for (var key in infos) {
			var item = infos[key];

			var _config = config[key];

			if (!_config) {
				// error('建筑id：', key, " 读取不到配置！");
				continue;
			}

			var info = this.analysisBuildInfo(item, _config);

			infos[key] = info;

			this.m_pCountryCounts[item.country - 1] += 1;

			if (item.country == RoleData.countryId) {
				this.m_pSelfCountryCount += 1;
			}

			this.m_pCountryCount += 1;
		}

	}

	public static updateCityBuildInfo(data: any) {

		let id = data.id;

		var item = data;

		var _config = C.WorldMapConfig[id];

		if (!_config) {
			error('建筑id：', id, " 读取不到配置！");
			return;
		}

		var info = this.analysisBuildInfo(item, _config);

		let old = this.m_pCityBuildInfo[id];

		if (old && old.country != info.country) {
			this.m_pCountryCounts[old.country - 1] -= 1;
			this.m_pCountryCounts[info.country - 1] += 1;
		}

		let cid = RoleData.countryId;

		if ((old && old.country == cid) || info.country == cid) {
			com_main.EventMgr.dispatchEvent(EventEnum.CITY_BUILDS_UPDATE, null);
		}

		this.m_pCityBuildInfo[id] = info;
	}

	private static analysisBuildInfo(info: any, _config: any) {
		let self_country = RoleData.countryId;
		var time = TimerUtils.getServerTimeMill();
		let id = info.id;
		var infos = this.m_pCityBuildInfo;

		// debug('build info:',info);

		let atkCountry = info.atkCountry == null ? 0 : info.atkCountry;
		let taskCountry = info.taskCountry == null ? 0 : info.taskCountry;
		let country = info.country;
		let aroundCityIds = _config.aroundCityId;
		let is_have_enemy = false;//周围是否有敌国
		let is_self = self_country == country;

		let buildStartTime = info.buildStartTime;
		let buildEndTime = info.buildStartTime;
		//zb
		// let _st = buildStartTime ? (<Long>buildStartTime).toNumber() : 0;
		// let _et = buildEndTime ? (<Long>buildEndTime).toNumber() : 0;
		let _st = buildStartTime ? buildStartTime : 0;
		let _et = buildEndTime ? buildEndTime : 0;
		let have_cd = buildStartTime != null && buildEndTime != null && _st > 0 && _et > 0 && TimerUtils.getServerTimeMill() < _et;

		// if (_config.type == 1 && is_self)
		// 	this.m_pCapitalId = id;

		info.is_self = is_self;
		
		if (aroundCityIds != "" && country != self_country) {
			let ids = aroundCityIds.split(",");
			for (var k in ids) {
				let _id = ids[k];
				if (infos[_id]) {
					let _country = parseInt(infos[_id].country);
					if (_country == self_country) {
						/**算出是否与首都连通 */
						if (_id == this.m_pCapitalId || this.isConnectedPoint(_id, this.m_pCapitalId)) {
							is_have_enemy = true;

							break;
						}

					}
				} else {
					error('analysisBuildInfo解析错误ids:' + ids + '   _id：' + _id + '     info:' + infos);
				}

			}
		}

		info.is_have_enemy = is_have_enemy;

		let m_pAttackIds = this.m_pAttackIds;
		let m_pDefenseIds = this.m_pDefenseIds;

		for (var key in m_pDefenseIds) {
			if (m_pDefenseIds.hasOwnProperty(key)) {
				var element = m_pDefenseIds[key];
				if (element == id) {
					m_pDefenseIds.splice(+key, 1);
					break;
				}
			}
		}

		for (var key in m_pAttackIds) {
			if (m_pAttackIds.hasOwnProperty(key)) {
				var element = m_pAttackIds[key];
				if (element == id) {
					m_pAttackIds.splice(+key, 1);
					break;
				}
			}
		}

		var type: BuildEffectType = BuildEffectType.NONE;
		let raidCountry = info.raidCountry;
		let isRaidCountry = false;
		let raidCountryCount = 0;
		if (raidCountry) {
			for (var key in raidCountry) {
				if (raidCountry.hasOwnProperty(key)) {
					var element = raidCountry[key];
					raidCountryCount += 1;
					if (parseInt(element) == self_country) {
						isRaidCountry = true;
						break;
					}
				}
			}
		}

		if (have_cd) {/**7.是否重建中 */
			type = BuildEffectType.BuildING;
		} else if (RoleData.alliance == country) {//联盟状态不可攻打
			type = BuildEffectType.NOT_TO_ATTACK;
		} else if (country != self_country && (atkCountry != self_country && atkCountry > 0 || taskCountry > 0 && taskCountry != self_country)) {/**4.（敌国建筑）敌方开战状态（另外2国的战斗） */
			type = BuildEffectType.ORTHER_ATTACK;
		} else if (isRaidCountry) {/** 8 偷袭状态 */
			type = BuildEffectType.Raid;
		} else if (country != self_country && !is_have_enemy) {/**1.（敌国建筑）我国不可攻打 */
			type = BuildEffectType.NOT_TO_ATTACK;
		} else if ((atkCountry == 0 || atkCountry == self_country) && is_have_enemy && taskCountry == 0) {/**2.（敌国建筑）除国家任务外我国可攻打 */
			type = BuildEffectType.CAN_ATTACK;
		} else if (country == self_country && atkCountry > 0 && taskCountry == 0) {/**3.（我国建筑-显示摧毁图标）除国家任务外我方被攻击状态 */
			type = BuildEffectType.BE_ATTACK;
		} else if (country != self_country && (taskCountry == self_country)) {/**5.（敌国建筑-显示攻击图标）国家任务攻击状态 */
			this.m_pAttackIds.push(id);
			type = BuildEffectType.ATTACK;
		} else if (country == self_country && (taskCountry > 0 || raidCountryCount > 0)) {/**6.（我国建筑-显示防守图标）国家任务防守状态 */
			this.m_pDefenseIds.push(id);
			type = BuildEffectType.DEFEND;
		}

		if (type == BuildEffectType.NONE) {
			type = BuildEffectType.NOT_TO_ATTACK;
		}


		info.type = type;
		info.have_cd = have_cd;

		return info;
	}

	/**
	 * 获取所有建筑信息
	 */
	public static getCityBuildInfos() {
		return this.m_pCityBuildInfo;
	}

	/**
	 * 获取单个建筑信息
	 */
	public static getCityBuildInfo(id: number) {
		let info = this.m_pCityBuildInfo[id];
		return info ? info : null;
	}

	private static dealSearch(config, sourcePoint, targetPoint, searchedPoints: Number[]): boolean {
		// 如果已经查找过了，则跳过
		if (searchedPoints[sourcePoint] != null) {
			return false;
		} else {
			// 加入已查找过列表
			searchedPoints[sourcePoint] = sourcePoint;
			// 获取配置信息
			let cfg = config[sourcePoint];
			let aroundCityIds: string = <string>cfg.aroundCityId;
			let ids = aroundCityIds.split(",");
			let infos = this.m_pCityBuildInfo;
			let countryid = RoleData.countryId;
			// 遍历相邻点ID
			for (let k in ids) {
				let tmpId = parseInt(ids[k]);
				if (infos[tmpId] && infos[tmpId].country == countryid) {
					// 如果相邻ID与目标ID相同，则查找成功
					if (tmpId == targetPoint) {
						return true;
					} else {
						// 如果这个点还没查找过，则递归查找
						if (searchedPoints[tmpId] == null) {
							if (this.dealSearch(config, tmpId, targetPoint, searchedPoints))
								return true;
						}
					}
				}
			}
		}
		return false;
	}


	public static isConnectedPoint(sourcePoint, targetPoint): boolean {
		// 源点与目标点相同，返回false
		if (sourcePoint == targetPoint) {
			return false;
		} else {
			// 记录查找过的点
			let searchedPoints: Number[] = [];
			return this.dealSearch(C.WorldMapConfig, sourcePoint, targetPoint, searchedPoints);
		}
	}

	/**获取国家占有城池数量 */
	public static getCountryCount(cId: number) {
		let count = this.m_pCountryCounts[cId];
		return count ? count : 0;
	}

	public static setMJData(data: any) {
		// //zb
		// // let pId = data.playerId ? (<Long>data.playerId).toNumber() : 0;
		// let pId = data.playerId ? data.playerId : 0;
		// let head = data.head;
		// let level = data.level;
		// let cityId = data.cityId;

		// if (pId == 0) {
		// 	this.m_pMJData = [pId, 0, 0, this.m_pMJData[3]];
		// 	com_main.WorldMap.showMJ();
		// 	this.m_pMJData = [0, 0, 0, 0];
		// } else {
		// 	if (this.m_pMJData.length == 4) {
		// 		let playerId = this.m_pMJData[0];
		// 		if (playerId != 0) {
		// 			this.m_pMJData = [0, 0, 0, 0];
		// 			com_main.WorldMap.showMJ();
		// 		}
		// 	}

		// 	this.m_pMJData = [pId, head, level, cityId];
		// 	com_main.WorldMap.showMJ();
		// }

	}

	// public static addNowEventCount() {
	// 	this.m_pNowEventCount += 1;
	// 	if (this.m_pNowEventCount >= 2) {
	// 		this.refreshIcon();
	// 	}
	// }

	// public static subNowEventCount(flag: boolean = true) {
	// 	this.m_pNowEventCount -= 1;
	// 	if (this.m_pNowEventCount == 1 && flag) {
	// 		this.refreshIcon();
	// 	}
	// }

	// /**刷新世界时间图标 */
	// public static refreshIcon() {
	// 	com_main.WorldMap.refreshIcon();
	// }

	// /**获取我国品阶数量 */
	// public static getBuildLevels() {
	// 	let builds = this.m_pCityBuildInfo;
	// 	let cfg = C.WorldMapConfig;

	// 	let arr = {};

	// 	let self_country = RoleData.countryId;

	// 	if (builds) {
	// 		for (var key in builds) {
	// 			if (builds.hasOwnProperty(key)) {
	// 				var element = builds[key];
	// 				let id = element.id;
	// 				let country = element.country;
	// 				if (country == self_country) {
	// 					let config = cfg[id];
	// 					if (config) {
	// 						let level = config.level;
	// 						if (arr[level]) {
	// 							arr[level] = arr[level] + 1;
	// 						} else {
	// 							arr[level] = 1;
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	return arr;
	// }


}
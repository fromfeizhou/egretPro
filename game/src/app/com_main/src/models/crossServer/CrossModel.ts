
/** 跨服战状态 
 *  0准备期，1已报名，2条件不符合，报名失败,3匹配完成，4跨服进行中-攻城门，5跨服进行中-攻内城	，6跨服战结束
*/
const enum CrossServerState {
	READY = 0,   //准备期
	HAS_SIGN = 1,    //已报名
	SIGN_FAIL = 2,    //报名失败
	MATCH_SUC = 3,	//匹配完成
	WALL_WAR = 4,	//跨服进行中-攻城门
	CITY_WAR = 5,       //跨服进行中-攻内城
	GAME_OVER = 6,//跨服战结束
}


/**跨服战结果状态 
 *  0空闲 1队列 2国战中 4行走 5战斗中 
*/
const enum CrossServerResultState {
	NO_RESULT = 0,//未出结果
	WIN = 1,//胜利
	FAIL = 2,//失败
}

/**跨服城池等级 */
const enum CrossCityLevel {
	CAPITAL = 1,    //皇城
	STATE = 2,      //州城
	TOWN = 3,       //郡城
	COUNTY = 4,     //县城
};

/**跨服战排行榜奖励类型 */
const enum CrossRewardType {
	SINGLE = 1,			//个人
	LEGION = 2,    		//军团
	HONOR = 3,     		//累计
	DAILY = 4,     		//每日
	EMPEROR = 5,     	//皇帝
	WIN_SERVER = 6,   	//胜利服
	FAIL_SERVER = 7,  	//失败服

};

/**跨服 */
class CrossModel {
	public static crossStatus: number = -1;
	public static rewardStatus: number;	//每日奖励领取
	public static openTime: number;	//开战时间
	public static closeTime: number;	//结束时间
	public static honorBoxIds: number[];
	public static init() {
		this.initCityList();
		this.initMaxTroop();
	}

	/**数据清理 */
	public static clear() {
		this.sandTableClear();
		this.resetCrossSeverDetailData();
		this.legionClear();
		this.rankDataClear();
	}

	/**是否开放 */
	public static checkIsOpen() {
		let day = CrossUtil.getValue(CrossServerConstType.OPEN_SERVER_DAY);
		let time = day * 24 * 60 * 60 * 1000;
		if (TimerUtils.ServerTime - TimerUtils.OpenServerTime >= time) {
			return true;
		}
		return false;
	}

	/**获得阶段名字 */
	public static getStateName(){
		switch(this.crossStatus){
			case CrossServerState.READY:
			case CrossServerState.HAS_SIGN:
			case CrossServerState.MATCH_SUC:
				return '准备阶段';
			case CrossServerState.WALL_WAR:
			case CrossServerState.CITY_WAR:
				return '战斗中';
			default:
				return '跨服战结束';
		}
	}

	/**国战状态解析 */
	public static parseCrossServerInfo(data: gameProto.IS2C_CROSS_SERVER_INFO) {
		this.openTime = data.openTime;
		this.closeTime = data.closeTime;
		this.rewardStatus = data.rewardStatus;
		this.honorBoxIds = data.honorBoxIds;

		if (this.crossStatus != data.status) {
			this.crossStatus = data.status;
			if (CrossServerState.GAME_OVER == this.crossStatus) this.resetSandTable();
			this.resetCrossSeverDetailData();
		}
		com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_SERVER_STATUS, null);
	}

	/**战斗中 */
	public static isWar() {
		return this.crossStatus == CrossServerState.WALL_WAR || this.crossStatus == CrossServerState.CITY_WAR;
	}

	/**跨服战红点 */
	public static crossServerRedPoint(): boolean {
		if (CrossModel.isWar() || CrossModel.crossStatus == CrossServerState.MATCH_SUC||CrossModel.rewardStatus == 1) {
			return true;
		}
		return false;
	}
	/**==================================================================================================================================
 	* 补兵 begin
 	* ==================================================================================================================================
 	*/
	public static curTroop: number = 0;
	public static maxTroop: number = 0;

	public static initMaxTroop() {
		this.maxTroop = CrossUtil.getValue(CrossServerConstType.MAX_TROOPS);;
	}

	/**判断补兵是否足够 */
	public static checkCanTroop(order: number): boolean {
		let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, order);
		let troop: number = 0;
		//计算兵力总和
		for (let i = 0; i < teamVo.teamGeneralData.length; i++) {
			let data = teamVo.teamGeneralData[i];
			if (data.generalId > 0) {
				let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
				let armyType = genVo.getGeneralArmyType();
				let subTroop: number = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER) - data.minSoldierTotalCount;
				troop += subTroop;
			}
		}

		return this.curTroop >= troop;
	}

	// public static getCrossServerActId(): number {
	// 	let crossVo: AcCrossServerVo = <AcCrossServerVo>ActivityModel.getActivityVo(AcViewType.CROSS_SERVICE)
	// 	if (isNull(crossVo)) return 0;
	// 	return crossVo.id;
	// }
	/**==================================================================================================================================
	 * 补兵 end
	 * ==================================================================================================================================
	 */
	/**==================================================================================================================================
	 * 跨服战详细界面信息 begin
	 * ==================================================================================================================================
	 */
	private static crossDetailData: gameProto.IS2C_CROSS_SERVER_WAR_RIVAL_INFO;
	private static bCrossServerDetailInit: boolean = false;
	public static parseCrossServerDetail(data: gameProto.IS2C_CROSS_SERVER_WAR_RIVAL_INFO) {
		if (isNull(data)) return;
		this.bCrossServerDetailInit = true;
		this.warCityId = data.warCityId;
		this.crossDetailData = data;
		Utils.open_view(TASK_UI.CROSS_SERVER_DETAIL_VIEW);
	}
	/**打开详情界面 */
	public static openCrossServerDetail() {
		if (this.bCrossServerDetailInit) {
			Utils.open_view(TASK_UI.CROSS_SERVER_DETAIL_VIEW);
		} else {
			CrossProxy.C2S_CROSS_SERVER_WAR_RIVAL_INFO();
		}
	}
	/**得到详情数据 */
	public static getCrossDetialData(): gameProto.IS2C_CROSS_SERVER_WAR_RIVAL_INFO {
		return this.crossDetailData;
	}
	/**重置详情界面数据 */
	private static resetCrossSeverDetailData() {
		this.bCrossServerDetailInit = false;
		this.crossDetailData = null;
	}
	/**==================================================================================================================================
	 * 跨服战详细界面信息 end
	 * ==================================================================================================================================
	 */
	/**==================================================================================================================================
	 * 沙盘 begin
	 * ==================================================================================================================================
	 */
	private static bSandTableInit: boolean;    //沙盘初始化
	private static cityList: com_main.ISandTableCity[];
	public static warCityId: number = 0;

	/**重置沙盘 */
	private static resetSandTable() {
		this.bSandTableInit = null;
		for (let i = 0, len = this.cityList.length; i < len; i++) {
			let item = this.cityList[i];
			item.servers = [];
			item.isCapture = false;
		}
	}

	/**数据清理 */
	private static sandTableClear() {
		this.bSandTableInit = null;
		this.cityList = null;
		this.warCityId = null;
	}

	/**打开沙盘界面 */
	public static openSandTable() {
		if (this.bSandTableInit) {
			Utils.open_view(TASK_UI.CROSS_SERVER_SAND_TABLE);
		} else {
			CrossProxy.C2S_CROSS_SERVER_WAR_SAND_INFO();
		}
	}

	/**收到沙盘数据 */
	public static parseSandTable(data: gameProto.IWarSandCityVo[]) {
		if (isNull(data)) return;
		this.bSandTableInit = true;
		data.forEach((v, i, a) => {
			let cityId: number = v.cityId;
			let iData = this.getCrossCity(cityId) as com_main.ISandTableCity;
			if (iData) {
				let servers = v.servers;
				iData.servers = servers;
				iData.isCapture = servers.some(ele => {
					return ele.status === 2;
				});
			}
		});

		Utils.open_view(TASK_UI.CROSS_SERVER_SAND_TABLE);
	}

	/**获得跨服城池类型名字 */
	public static getCrossCityTypeName(level: number) {
		switch (level) {
			case CrossCityLevel.CAPITAL:
				return GCode(CLEnum.WOR_BD_HC);
			case CrossCityLevel.STATE:
				return GCode(CLEnum.WOR_BD_ZC);
			case CrossCityLevel.TOWN:
				return GCode(CLEnum.WOR_BD_JC);
			case CrossCityLevel.COUNTY:
				return GCode(CLEnum.WOR_BD_XC);
		}
		return GCode(CLEnum.WOR_BD_XC);
	}

	/**获取沙盘城市 */
	public static getCrossCity(cityId: number): com_main.ISandTableCity {
		if (isNull(this.cityList) || this.cityList.length == 0) return null;
		for (let i = 0, len = this.cityList.length; i < len; i++) {
			let item = this.cityList[i];
			if (item.id == cityId) return item;
		}
		return null;
	}

	/**获取沙盘城市列表 */
	public static getCrossCityList(): com_main.ISandTableCity[] {
		return this.cityList;
	}

	/**获取沙盘区服信息 */
	public static getWarsandServerVo(servers: gameProto.IWarsandServerVo[], serverId: number) {
		if (isNull(servers) || isNull(serverId)) return null;
		for (let i = 0, len = servers.length; i < len; i++) {
			if (servers[i].serverId == serverId){
				return servers[i];
			} 
		}
		return null;
	}

	/**根据区服列表拼接字符串 */
	public static joinServerList(servers: gameProto.IWarsandServerVo[]): string {
		if (isNull(servers)) return "无";
		let str = "";
		servers.forEach(ele => {
			if (ele.status === 2) str += ele.serverId + "区 ";
		});
		return str === "" ? "无" : str;
	}

	/**城市配置列表初始化 */
	private static initCityList() {
		if (isNull(this.cityList)) this.cityList = [];
		for (let i in C.CrossServerCityConfig) {
			let vo = C.CrossServerCityConfig[i];
			let item: com_main.ISandTableCity = { id: vo.id, cityName: vo.cityName, servers: [] };
			this.cityList.push(item);
		}
	}
	/**==================================================================================================================================
	 * 沙盘 end
	 * ==================================================================================================================================
	 */
	/**==================================================================================================================================
    * 军团 begin
    * ==================================================================================================================================
    */
	public static armyType: number;  //0皇帝，1魏国，2蜀国，3吴国
	public static armyStatus: number;  //0表示你不是军团长，1=全军覆没 2=驻守城门 3=战斗中
	public static armpGroup: gameProto.IArmyGroup[];  //军团成员信息
	private static armyGroupKV: { [key: number]: gameProto.IArmyGroup }; //军团成员信息
	private static bArmyInit: boolean;	//是否请求数据
	private static legionInit() {
		this.armpGroup = [];
		this.bArmyInit = false;
	}
	private static legionClear() {
		this.armpGroup = null;
	}

	/**打开军团详细 */
	public static openArmyWnd() {
		if (this.bArmyInit) {
			this.doOpenArmyWnd();
		} else {
			CrossProxy.C2S_CROSS_SERVER_ARMY_GROUP();
		}
	}

	/* 军团信息 begin*/
	public static parseCrossLegionData(data: gameProto.IS2C_CROSS_SERVER_ARMY_GROUP) {
		if (data) {
			this.armyType = data.armyType;
			this.armyStatus = data.status;
			this.armpGroup = data.armyGroup;
			this.armyGroupKV = {};
			for (let info of this.armpGroup) {
				this.armyGroupKV[info.id] = info;
			}
			this.bArmyInit = true;
			this.doOpenArmyWnd(true);
		}
	}
	/**判断状态打开界面 */
	private static doOpenArmyWnd(isFirst: boolean = false) {
		if (this.armyStatus == 0) {
			EffectUtils.showTips(GCode(CLEnum.CROSS_LEGION_NO), 1, true);
			return;
		}

		if (isFirst) {
			Utils.open_view(TASK_UI.CRSOS_SERVER_LEGION_UI);
		} else {
			CrossProxy.C2S_CROSS_SERVER_ARMY_HP();
		}
	}

	/* 军团信息2*/
	public static parseCrossLegionDataHp(data: gameProto.IS2C_CROSS_SERVER_ARMY_HP) {
		if (data) {
			this.armyStatus = data.status;
			for (let info of data.armyGroupHp) {
				if (info && this.armyGroupKV[info.id]) this.armyGroupKV[info.id].troopsRate = info.troopsRate;
			}
		}
		Utils.open_view(TASK_UI.CRSOS_SERVER_LEGION_UI);
	}
	/**==================================================================================================================================
	 * 军团 end
	 * ==================================================================================================================================
	 */

	/**==================================================================================================================================
	 * 外城战 begin
	 * ==================================================================================================================================
	 */
	public static wallInfo: gameProto.IS2C_CROSS_SERVER_GATE_INFO;//攻城领导
	public static wallHp: gameProto.IS2C_CROSS_SERVER_GATE_HP;	//血量刷新
	public static wallStatus: number = 0;// 城门状态，0未开战，1开战
	/**城门领袖 */
	public static parseGateInfo(data: gameProto.IS2C_CROSS_SERVER_GATE_INFO) {
		this.wallInfo = data;
		SceneManager.runScene(SceneEnums.CROSS_WALL_WAR_MAP);
	}
	/**血量更新 */
	public static parseGateHp(data: gameProto.IS2C_CROSS_SERVER_GATE_HP) {
		this.wallHp = data;
		com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_WALL_UPDATE, null);
	}
	/**城门状态 */
	public static parseWallStatus(data: gameProto.IS2C_CROSS_SERVER_CITY_STATUS) {
		this.wallStatus = data.status;
		com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_WALL_STATUS, null);
	}

	/**==================================================================================================================================
	 * 外城战 end
	 * ==================================================================================================================================
	 */

	/**==================================================================================================================================
	 * 内城战 begin
	 * ==================================================================================================================================
	 */
	private static moveData: { [key: number]: { startId: number, endId: number } };
	/**
	 * 创建本地移动对象 back为true的时候是反向移动
		   playerId:number(后续拓展)
	 */

	public static createClientMove(orderId: number, startId: number, endId: number) {
		if (!this.moveData) {
			this.moveData = {};
		}

		egret.setTimeout((orderId: number) => {
			if (!this.moveData || !this.moveData[orderId])
				return;

			delete this.moveData[orderId];
		}, this, 5000, orderId);
	}

	private static cityInfo: { [key: number]: CSBCityInfoVo } = {};
	private static selfGroup: number;
	public static setSelfGroup(group: number) {
		this.selfGroup = group;
	}

	public static getSelfGroup() {
		return this.selfGroup;
	}

	public static updateCityInfo(data: gameProto.IWarAreaVo[]) {
		for (let i of data) {
			if (this.cityInfo[i.areaId]) {
				this.cityInfo[i.areaId].init(i);
			} else {
				this.cityInfo[i.areaId] = CSBCityInfoVo.create(i)
			}
		}
	}

	public static updateCityStatus(data: gameProto.IS2C_CROSS_SERVER_CITY_STATUS) {
		if (this.cityInfo[data.cityId]) {
			this.cityInfo[data.cityId].status = data.status;
		}
	}

	public static getCityInfoById(cId: number) {
		return this.cityInfo[cId];
	}

	public static getCIdByWarAreaId(warAreaId: number) {
		for (let i in this.cityInfo) {
			if (this.cityInfo[i].warAreaId == warAreaId)
				return this.cityInfo[i].areaId;
		}
		return 0;
	}

	/**通过唯一id获取城池名字 */
	public static getTeamCityName(teamVo:TeamVo){
		let cId = this.getCIdByWarAreaId(teamVo.cityId);
		if(cId == 0 || cId == 6 || cId == 7){
			return '城门';
		}
		let data = this.getCityInfoById(cId)
		if( data){
			return data.getCityName();
		}
		return '城门'
	}

	public static getCityNumBygroup(group) {
		let num = 0;
		for (let i = 1; i <= 5; i++) {
			if (this.cityInfo[i] && this.cityInfo[i].occupant == group) {
				num += 1;
			}
		}
		return num;
	}

	public static getOwnCityNum() {
		return this.getCityNumBygroup(this.selfGroup);
	}

	public static getEnenyCityNum() {
		return this.getCityNumBygroup(this.selfGroup == 1 ? 2 : 1);
	}

	/**获取自己建造的箭塔数量 */
	public static getTowerNumByGroup(group) {
		let num = 0;
		for (let i = 1; i <= 5; i++) {
			if (this.cityInfo[i] && this.cityInfo[i].occupant == group) {
				if (this.cityInfo[i].towerNum.length == 0) break;
				for (let i = 0; i <= 1; i++) {
					if (this.cityInfo[i].towerNum[i]) {
						num += 1;
					}
				}
			}
		}
		return num;
	}

	/**获取自己建造的箭塔数量 */
	public static getOwnTowerNum() {
		return this.getTowerNumByGroup(this.selfGroup)
	}

	/**获取敌人建造的箭塔数量 */
	public static getEnenyTowerNum() {
		return this.getTowerNumByGroup(this.selfGroup == 1 ? 2 : 1)
	}

	/**得到状况组件data */
	public static getCrossSituData(isOwn: boolean = true): com_main.ICrossWarSitu {
		let crossWarSituVo: com_main.ICrossWarSitu = { isOwn: isOwn, occupant: 1, teamNum: 0 }
		let occupant: number = 0;
		if (isOwn) {
			occupant = this.getSelfGroup()
		} else if (this.getSelfGroup() == 1) {
			occupant = 2;
		} else {
			occupant = 1;
		}
		for (let key in this.cityInfo) {
			let cityInfoVo: gameProto.IWarAreaVo = this.cityInfo[key];
			if (occupant == cityInfoVo.occupant) {
				crossWarSituVo.occupant++;
				crossWarSituVo.teamNum = crossWarSituVo.teamNum + cityInfoVo.defTeamNum;
			}
		}
		return crossWarSituVo;
	}

	/**得到当前战斗的城池 */
	public static getCurWarCity() {
		for (let key in this.cityInfo) {
			let cityInfoVo: gameProto.IWarAreaVo = this.cityInfo[key];
			if (isNull(cityInfoVo)) continue;
			if (cityInfoVo.status == 1) return cityInfoVo.areaId;
		}
		return 1;
	}
	/**==================================================================================================================================
	 * 国战 end
	 * ==================================================================================================================================
	 */

	/**==================================================================================================================================
	 * 排行榜 begin
	 * ==================================================================================================================================
	 */
	/**累计荣誉奖励 */
	public static rankHonor: number;				// 推送玩家累计荣誉
	private static canHonorBoxIds: number[] = [];	// 可领取的宝箱列表

	private static rankDataClear() {
		this.rankHonor = null;
		this.canHonorBoxIds = [];
	}

	/**解析领取每日奖励 */
	public static parseGetDayReward(data: gameProto.IS2C_CROSS_SERVER_GET_DAY_REWARD) {
		if (isNull(data)) return;
		let duanWei = data.duanWei;
		this.rewardStatus = 2;

		let cfg = CrossModel.getCrossServerRewardConfig(CrossRewardType.DAILY, duanWei);
		if (cfg) Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);

		com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_SERVER_STATUS, null);
	}

	/**解析推送玩家累计荣誉 */
	public static parseGetHonor(data: gameProto.IS2C_CROSS_SERVER_GET_HONOR) {
		if (isNull(data)) return;
		this.rankHonor = data.honor;

		this.updateCanHonorBox();
		com_main.EventMgr.dispatchEvent(TaskWorldEvent.CROSS_RANK_RY, null);
	}

	/**解析领取荣誉宝箱 */
	public static parseGetHonorBox(data: gameProto.IS2C_CROSS_SERVER_GET_HONOR_BOX) {
		if (isNull(data)) return;
		let boxId = data.boxId;

		this.updateHonorBox(boxId);
		com_main.EventMgr.dispatchEvent(TaskWorldEvent.CROSS_RANK_RY, null);
	}

	/**更新累计荣誉奖励领取记录 */
	public static updateHonorBox(boxId: number) {
		if (this.honorBoxIds.indexOf(boxId) == -1) this.honorBoxIds.push(boxId);
		this.honorBoxIds.sort((a, b) => {
			return a - b;
		});
	}

	/**更新可领取荣誉奖励列表 */
	public static updateCanHonorBox() {
		let cfgs: CrossServerRewardConfig[] = CrossModel.getCrossServerRewardConfigByType(CrossRewardType.HONOR);
		for (let i = 0; i < cfgs.length; i++) {
			let cfg: CrossServerRewardConfig = cfgs[i];
			if (this.rankHonor >= cfg.value) {
				if (this.canHonorBoxIds.indexOf(cfg.id) == -1) this.canHonorBoxIds.push(cfg.id);
			}
		}
	}

	/**判断当前个人累计荣誉奖励是否可以领取 */
	public static checkHonorBox(boxId: number): boolean {
		// 可领取列表找不到 false
		if (this.canHonorBoxIds.indexOf(boxId) == -1) return false;
		// 领取列表找不到 true
		if (this.honorBoxIds.indexOf(boxId) == -1) return true;
		return false;
	}

	/**更新领取宝箱状态 */
	public static checkHonorBoxState(boxId: number): boolean {
		if (this.honorBoxIds.indexOf(boxId) == -1) return false;
		return true;
	}

	/**奖励弹框显示 */
	public static receiveHonorBox(boxId: number) {
		let cfg = C.CrossServerRewardConfig[boxId];
		if (cfg) Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
	}

	/**获取已经领取的宝箱列表 */
	public static getDoneHonorBoxList() {
		return this.honorBoxIds;
	}

	/**检测累计荣誉奖励红点 */
	public static checkHonorBoxRedPoint(): number {
		if (this.rankHonor > 0) {
			if (this.canHonorBoxIds.length > this.honorBoxIds.length) return 1;
			return 0;
		}
		return 0;
	}

	/**获取奖励信息 */
	public static getCrossServerRewardConfig(type: number, value: number): CrossServerRewardConfig {
		return C.CrossServerRewardConfigDic[type] ? C.CrossServerRewardConfigDic[type][value] : null;
	}

	/**根据type获取奖励配置表 */
	public static getCrossServerRewardConfigByType(type: number): CrossServerRewardConfig[] {
		let cfgList = C.CrossServerRewardConfigDic[type];
		let res: CrossServerRewardConfig[] = [];
		for (let key in cfgList) {
			let cfg = cfgList[key];
			if (cfg) res.push(cfg);
		}
		SortTools.sortMap(res, "value", true);
		return res;
	}
	/**==================================================================================================================================
	 * 排行榜 end
	 * ==================================================================================================================================
	 */

	/**==================================================================================================================================
	 * buffer begin
	 * ==================================================================================================================================
	 */

	/**==================================================================================================================================
	 * buffer end
	 * ==================================================================================================================================
	 */

}
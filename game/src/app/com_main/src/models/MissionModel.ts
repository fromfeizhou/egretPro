
/**
 * 任务类型
 */
enum TaskType {
	ALL = 0,
	/**日常任务 */
	Daily = 1,
	/**主线任务 */
	MainLine = 2,
	/**培养任务 */
	Cultivate = 3,
	/**主城任务 */
	MainCity = 4,
	/**官职任务 */
	Office = 5,
	/**战斗任务 */
	Battle = 6,
	/**活动任务 */
	Activity = 101,

	/**国家任务(魏国) */
	Country = 103,
	/**国家任务(循环) */
	CountryRepeat = 104,
}

enum TaskStatus {
	/** 进行中*/
	PROCESSING = 0,
	/** 完成*/
	FINISH = 1,
	/** 已领取奖励*/
	REWARD = 2,
}

enum LivenssStatus {
	/** 进行中*/
	PROCESSING = 0,
	/** 完成*/
	FINISH = 1,
	/** 已领取奖励*/
	REWARD = 2,
}
//任务事件
interface IMissionEvt {
	taskId: number;
	conditionId: number;
	type: TaskType;
	activityId: number;
}

class MissionModel {
	public static LIVENESS_MAX: number = 100;

	private static taskInfoDic: { [k: number]: MissionInfoVo };		//总任务列表
	private static taskInfoList: { [k: number]: MissionInfoVo[] };	//按类型存储列表
	private static activeNum: number = 0;	//当前活跃度
	private static activeList: { [k: number]: gameProto.ILiveness };	//活跃度奖励列表
	public static isFinishNoticeCon = false;
	public static init() {
		this.initData();
		this.parseLivenessCfg();
	}

	public static initData() {
		this.clear();
		this.taskInfoList = {};
		this.taskInfoDic = {};
		this.activeList = {};
	}

	public static clear() {
		this.taskInfoDic = null;
		this.taskInfoList = null;
		this.activeList = null;
	}

	//获取活跃度列表
	public static getActiveInfoList() {
		return this.activeList
	}

	//获取当前活跃度
	public static getCurActiveNum() {
		return this.activeNum;
	}
	//获取活跃度状态
	public static getActiveInfoById(id: number) {
		return this.activeList[id]
	}

	//活跃度数据
	public static initActivaInfo(data: gameProto.S2C_LIVENESS_INFO) {
		if (data.infos) {
			for (let index = 0; index < data.infos.length; index++) {
				let info = data.infos[index];
				this.activeList[info.id] = info;
			}
		}
		this.activeNum = data.liveness;

		com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_LIVENESS, null);
	}

	//登陆获取所有数据
	public static initPlayerMissionInfoList(data: gameProto.S2C_TASK_LIST) {
		debug("MissionModel: initPlayerMissionInfoList----------------------->>")
		for (let key in data.taskList) {
			//活动任务初始化 不走此协议
			if (data.taskList[key].taskType != TaskType.Activity)
				this.createMissionInfo(data.taskList[key]);
		}
	}

	//活动任务初始化
	public static initActivityList(data: gameProto.IS2C_ACTIVITY_TASK_LIST) {
		let vo = ActivityModel.getActivityVoById<AcTaskVo>(data.activityId);
		if (vo) {
			for (let info of data.taskList) {
				vo.createMissionInfo(info)
			}
		}
	}
	/**接取任务 */
	public static addPlayerMissionInfoList(data: gameProto.S2C_TASK_RECEIVE) {
		switch (data.taskData.taskType) {
			case TaskType.MainLine:
			case TaskType.Country:
			case TaskType.CountryRepeat:
			case TaskType.Daily: {
				this.createMissionInfo(data.taskData, true);
				break;
			}
		}
	}
	/**更新任务状态 */
	public static updateMissionInfos(data: gameProto.IS2C_TASK_PROGRESS) {
		for (let info of data.taskList) {
			if (info.taskType == TaskType.Activity) {
				let vo = ActivityModel.getActivityVoById<AcTaskVo>(info.activityId);
				if (vo && vo.taskInfoDic[info.taskId]) vo.taskInfoDic[info.taskId].update(info);
			} else {
				if (this.taskInfoDic[info.taskId]) this.taskInfoDic[info.taskId].update(info);
			}
		}
	}


	//create info
	private static createMissionInfo(data: gameProto.ITaskData, isEvt: boolean = false) {
		let baseData = C.TaskConfig[data.taskId]

		if (baseData) {
			if (this.taskInfoDic[data.taskId]) {
				this.taskInfoDic[data.taskId].update(data);
			} else {
				let vo = MissionInfoVo.create(data);

				if (vo.taskType == TaskType.MainLine) {
					//删除旧主线任务
					this.delTaskByType(TaskType.MainLine);
				} else if (vo.taskType == TaskType.Country) {
					//删除旧国家任务
					this.delTaskByType(TaskType.Country);
				}

				this.taskInfoDic[vo.taskId] = vo;
				if (!this.taskInfoList[vo.taskType]) {
					this.taskInfoList[vo.taskType] = []
				}
				this.taskInfoList[vo.taskType].push(vo);
				//首次创建 任务 存入taskInfoList 后发送创建任务事件(否则 逻辑层不能通过model访问到 vo节点) 首次初始化不需要发送
				if (isEvt) vo.sendCreateConditionEvt();
			}
		}
	}


	/**按类型移除任务 */
	public static delTaskByType(type: TaskType) {
		//删除主线任务
		let list = this.taskInfoList[type];
		if (!list) return;
		for (let i = 0; i < list.length; i++) {
			delete this.taskInfoDic[list[i].taskId];
		}
		delete this.taskInfoList[type];
	}

	/**
	 * @param taskId 任务id
	 * @param cId 
	 */
	public static onClickMissionCell(taskId: number, cId: number) {
		let vo = this.taskInfoDic[taskId];
		if (vo) {
			let condition = vo.getTaskCondition(cId);
			if (condition.state == TaskStatus.FINISH) {
				MissionProxy.send_MISSION_REWARD(taskId, cId);
			}
			else if (condition.state == TaskStatus.PROCESSING) {
				let cfg = C.TaskConditionConfig[cId];
				FunctionModel.funcToPanel(cfg.turnPanel);
			}
		}
	}

	/**
	 * 获取主线任务tips信息
	 * [注意 主任务 已修改为 唯一1条处理] 服务器做了过滤逻辑
	 * 
	 * */
	public static getMainMissionData(): IMissionEvt {
		let list = this.taskInfoList[TaskType.MainLine];
		let data: MissionInfoVo[] = [];
		if (!list) return null;

		for (let i = 0; i < list.length; i++) {
			let condition = list[i].getCurTaskCondition();
			if (condition) {
				return { taskId: list[i].taskId, conditionId: condition.conditionBaseId, type: list[i].taskType, activityId: list[i].activityId };
			}
		}
		return null;
	}
	//领取
	public static receiveReward(data: gameProto.S2C_TASK_REWARD) {
		debug("MissionModel: Receive Mission Reward ----------------------->>State: " + data.taskConditionId);
		let vo: MissionInfoVo;
		if (data.state == 0) {
			if (data.taskType == TaskType.Activity) {
				let acVo = ActivityModel.getActivityVoById<AcTaskVo>(data.activityId);
				if (acVo) vo = acVo.taskInfoDic[data.taskId];
			} else {
				vo = this.taskInfoDic[data.taskId];
			}
			if (!vo) return;
			vo.setTaskCondtionAward(data.taskConditionId)
			// 0:手动领取
			// 1：自动领取并弹出奖励小条提示
			// 2：自动领取，不弹出奖励小条提示，不显示于任务列表内
			// 3：手动领取任务，弹出奖励小条提示
			// 仅在任务小条可见，任务列表内不可见
			if (vo.cfg.guideTask == 2) return;
			let conditionCfg = vo.getConditionCfg(data.taskConditionId);
			if(conditionCfg) Utils.open_view(TASK_UI.GET_REWARD_VIEW, conditionCfg.rewardItem);
		}
	}

	//一键领取
	public static receiveAllReward(data: gameProto.S2C_TASK_REWARD_MULTI) {
		let reward: IItemInfo[] = [];
		for (let i = 0; i < data.taskCondition.length; i++) {
			let condition = data.taskCondition[i];
			let taskId = C.TaskConditionConfig[condition.conditionBaseId].taskId;
			let vo = this.getMissionInfoById(taskId);
			vo.setTaskCondtionAward(condition.conditionBaseId);
			reward = reward.concat(C.TaskConditionConfig[condition.conditionBaseId].rewardItem);
		}
		if (reward.length > 0) {
			Utils.open_view(TASK_UI.GET_REWARD_VIEW, reward);
		}
	}

	/**获得任务列表 */
	public static getMissionInfoList(missionType: TaskType) {
		if (this.taskInfoList[missionType]) {
			return this.taskInfoList[missionType];
		}
		return [];
	}

	/**获得主任务数据 */
	public static getMissionInfoById(taskId: number) {
		return this.taskInfoDic[taskId]
	}

	/**获得子任务数据 */
	public static getConditoinInfoById(taskId: number, cId: number) {
		let vo = this.taskInfoDic[taskId];
		if (vo) {
			let condition = vo.getTaskCondition(cId);
			return condition;
		}
		return null;
	}


	/**获取完成数量(红点) */
	public static getFinishMissionByType(type: TaskType): number {
		let res = 0;
		if (type == TaskType.ALL) {
			res += this.getFinishMission(TaskType.Daily);
			res += this.getFinishMission(TaskType.MainLine);
			res += this.getFinishMission(TaskType.Cultivate);
			res += this.getFinishMission(TaskType.MainCity);
			return res;
		}
		//有指定类型
		return this.getFinishMission(type)
	}

	private static getFinishMission(type: TaskType) {
		let res = 0;
		let list = this.getMissionInfoList(type);
		for (let i = 0; i < list.length; i++) {
			let info = list[i];
			res += info.getFinishConditionNum();
		}
		return res;
	}

	/**获取完成任务的条件ID(用于一键领取) */
	public static getFinishCidByType(type: TaskType) {
		let res = [];
		//有指定类型
		let list = this.getMissionInfoList(type);
		for (let i = 0; i < list.length; i++) {
			let info = list[i];
			res = res.concat(info.getFinishConditionCId());
		}
		return res;
	}


	/**获取可领取活跃度宝箱(红点) */
	public static getActivityBoxNum(): number {
		let res = 0;
		for (let id in this.activeList) {
			let data = this.activeList[id];
			if (data != null && data != undefined) {
				if (data.state == LivenssStatus.FINISH) {
					res++;
				}
			}
		}
		return res;
	}
	/**存在子任务 */
	public static hasMissionById(taskId: number, cId: number): boolean {
		let condition = this.getConditoinInfoById(taskId, cId);
		if (condition && condition.state != TaskStatus.REWARD) {
			return true;
		}
		return false;
	}


	//=============================================================================================================================================
	//国家任务 begin
	//============================================================================================================================================= 

	/**获得当前进行国家任务 */
	public static getCountryTask() {
		let list = this.taskInfoList[TaskType.Country];
		if (list && list.length > 0) {
			for (let info of list) {
				let res = info.getCurTaskCondition();
				if (res) return res;
			}
		}
		//显示循环任务
		list = this.taskInfoList[TaskType.CountryRepeat];
		if (list && list.length > 0) {
			return list[0].condition[0];
		}
	}

	//=============================================================================================================================================
	//国家任务 end
	//============================================================================================================================================= 

	//=============================================================================================================================================
	//配置表 begin
	//============================================================================================================================================= 
	/**解析活跃度配置表 */
	public static parseLivenessCfg() {
		for (let key in C.LivesRewardConfig) {
			let cfg = C.LivesRewardConfig[key];
			if (unNull(cfg) && cfg.liveness > MissionModel.LIVENESS_MAX) {
				MissionModel.LIVENESS_MAX = cfg.liveness;
			}
		}
	}

	/**获得子任务 */
	public static conditionCfgs: { [taskId: number]: TaskConditionConfig[] };
	public static getConditionCfgs(taskId: number) {
		if (!this.conditionCfgs) {
			this.conditionCfgs = {};
			for (let key in C.TaskConditionConfig) {
				let cfg = C.TaskConditionConfig[key];
				if (unNull(cfg)) {
					if (!this.conditionCfgs[cfg.taskId]) this.conditionCfgs[cfg.taskId] = [];
					this.conditionCfgs[cfg.taskId].push(cfg);
				}
			}

			for (let key in this.conditionCfgs) {
				if (this.conditionCfgs[key]) this.conditionCfgs[key].sort((a, b) => { return a.id - b.id });
			}
		}
		return this.conditionCfgs[taskId];
	}

	//=============================================================================================================================================
	//配置表 end
	//============================================================================================================================================= 



}
/**
 * 任务基本信息
 *
 */
class MissionInfoVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = ["taskId", "taskType", "activityId", "taskLink"];

	// 基础表任务id
	public taskId: number;	//任务id
	// 任务类型
	public taskType: TaskType;	//任务类型
	public condition: gameProto.ITaskCondition[];	//任务节点（已领奖的节点 服务器不会发送） 更新时候动态结构
	public activityId: number;	//活动id
	public taskLink: gameProto.ITaskLink;	//线性继承进度类 任务

	public conditionDic: { [k: number]: gameProto.ITaskCondition };
	private m_taskcfg: TaskConfig | ActivityTaskConfig;	//通过get方法获取

	public static create(body?: gameProto.ITaskData) {
		var obj: MissionInfoVo = new MissionInfoVo(body);
		return obj;
	}
	public onDestroy() {
	}

	public constructor(body: any) {
		super();
		this.init(body);
	}


	public init(body: gameProto.ITaskData) {
		this.parseKeys(body);
		this.initCondition(body);

		this.conditionDic = {};
		for (let i = 0; i < this.condition.length; i++) {
			let info = this.condition[i];
			this.conditionDic[info.conditionBaseId] = info;
		}
		// this.checkAuto();
	}

	/**初始化子任务 */
	private initCondition(body: gameProto.ITaskData) {
		if (this.taskLink) {
			//线性任务初始化
			this.condition = [];
			let conditonCfgs = this.getConditionCfgs();
			if (this.taskLink.rewardOrderType == 0) {
				//领奖顺序固定
				for (let i = this.taskLink.rewardOrderLink; i < conditonCfgs.length; i++) {
					let cfg = conditonCfgs[i];
					let state = i >= this.taskLink.overOrder ? TaskStatus.PROCESSING : TaskStatus.FINISH;
					let process = state == TaskStatus.FINISH ? cfg.paramValue : this.taskLink.count;
					if (cfg.order > this.taskLink.overOrder) process = this.taskLink.nextCount;

					this.condition.push({ conditionBaseId: cfg.id, maxCount: cfg.paramValue, count: process, order: cfg.order, state: state });
				}
			} else {
				//领奖无序
				for (let i = 0; i < conditonCfgs.length; i++) {
					let cfg = conditonCfgs[i];
					let state = i >= this.taskLink.overOrder ? TaskStatus.PROCESSING : TaskStatus.FINISH;
					let process = state == TaskStatus.PROCESSING ? this.taskLink.count : cfg.paramValue;
					if (state == TaskStatus.FINISH) {
						if (this.matchAward(cfg.order, this.taskLink.rewardOrder)) state = TaskStatus.REWARD;
					}
					//未领奖任务初始化


					if (cfg.order > this.taskLink.overOrder) process = this.taskLink.nextCount;
					this.condition.push({ conditionBaseId: cfg.id, maxCount: cfg.paramValue, count: process, order: cfg.order, state: state });
				}
			}
		} else {
			this.condition = body.condition;
			for (let info of this.condition) {
				info.maxCount = this.getConditionCfg(info.conditionBaseId).paramValue;
			}
		}
	}

	/**是否领取 */
	private matchAward(order: number, rewardIds: number[]) {
		order = order - 1;//order 由1开始
		let index = Math.floor(order / 31);
		if (index >= rewardIds.length) return;
		let row = 30 - (order % 30);
		return (1 << row) & rewardIds[index];
	}

	/**更新数据 */
	public update(body: gameProto.ITaskData) {
		this.parseKeys(body);
		if (this.taskLink) {
			//更新链式任务
			this.updateOrder();
		} else {
			//更新常规任务
			this.updateConditoin(body);
		}

		// this.checkAuto();
	}

	/**常规任务更新 */
	private updateConditoin(body: gameProto.ITaskData) {
		for (let i = 0; i < body.condition.length; i++) {
			let info = body.condition[i];
			let localData = this.conditionDic[info.conditionBaseId]
			if (localData) {
				if (localData.count != info.count || localData.state != info.state) {
					localData.count = info.count;
					localData.state = info.state;
					let param: IMissionEvt = { taskId: this.taskId, conditionId: info.conditionBaseId, type: this.taskType, activityId: this.activityId }
					com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_INFO, param);
				}
			} else {
				//主线任务 单条codition发送 有机会使用
				this.conditionDic[info.conditionBaseId] = info;
				info.maxCount = this.getConditionCfg(info.conditionBaseId).paramValue;
				let param: IMissionEvt = { taskId: this.taskId, conditionId: info.conditionBaseId, type: this.taskType, activityId: this.activityId }
				com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_ADD_INFO, param);
			}

			/**新手条件 */
			if (this.taskType == TaskType.MainLine) {
				GuideModel.sendGuideRecordByTask(info.conditionBaseId, info.state);
			}
		}
	}

	/**更新order */
	public updateOrder() {
		if (this.taskType == TaskType.MainLine || this.taskType == TaskType.Country || this.taskType == TaskType.CountryRepeat) return;
		for (let info of this.condition) {
			let isEvt = false;
			if (info.state == TaskStatus.PROCESSING)
				if (info.order <= this.taskLink.overOrder) {
					info.state = TaskStatus.FINISH;
					info.count = info.maxCount;
					isEvt = true;
				} else {
					let process = this.taskLink.count;
					if (info.order > this.taskLink.overOrder) process = this.taskLink.nextCount;
					info.count = process;
				}
			let param: IMissionEvt = { taskId: this.taskId, conditionId: info.conditionBaseId, type: this.taskType, activityId: this.activityId }
			com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_INFO, param);
		}
	}


	/**发送创建任务对象事件  （model 创建vo后调用 保证数据存在model列表） */
	public sendCreateConditionEvt() {
		for (let i = 0; i < this.condition.length; i++) {
			let param: IMissionEvt = { taskId: this.taskId, conditionId: this.condition[i].conditionBaseId, type: this.taskType, activityId: this.activityId }
			com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_ADD_INFO, param);
			/**新手条件 */
			if (this.taskType == TaskType.MainLine) {
				GuideModel.sendGuideRecordByTask(param.conditionId, this.condition[i].state);
			}
		}
	}

	/**解析服务器协议 */
	private parseKeys(body: any) {
		Utils.voParsePbData(this, body, MissionInfoVo.AttriKey);
	}

	/**获得任务对象 */
	public getTaskCondition(cId: number) {
		let info = this.conditionDic[cId];
		return info;
	}

	/**获取任务下面的子列表 */
	public getTaskConditionList(): gameProto.ITaskCondition[] {
		let res = [];
		for (let key in this.conditionDic) {
			let conditon = this.conditionDic[key];
			res.push(conditon);
		}
		return res;
	}

	/**修改任务状态(已领奖 领取奖励) */
	public setTaskCondtionAward(cId: number) {
		let info = this.getTaskCondition(cId);
		if(!info) return;
		info.state = TaskStatus.REWARD;
		if (this.taskType != TaskType.Daily && this.taskType != TaskType.Activity && this.taskType != TaskType.CountryRepeat) {
			//非日常任务完成 活动任务 发送删除消息
			let param: IMissionEvt = { taskId: this.taskId, conditionId: cId, type: this.taskType, activityId: this.activityId }
			//删除任务节点数据
			this.delRewardCodition(cId);
			com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_DELETE_INFO, param);

			let newTask = this.getPriorityTask()
			if (newTask) {
				let param: IMissionEvt = { taskId: this.taskId, conditionId: newTask.conditionBaseId, type: this.taskType, activityId: this.activityId }
				com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_ADD_INFO, param);

			}
		} else {
			//日常任务发送 更新消息
			let param: IMissionEvt = { taskId: this.taskId, conditionId: cId, type: this.taskType, activityId: this.activityId }
			com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_INFO, param);
		}

		/**新手条件 */
		if (this.taskType == TaskType.MainLine) {
			GuideModel.sendGuideRecordByTask(cId, info.state);
		}
	}

	/**获得任务状态 */
	public getTaskConditionState(cId: number): number {
		let info = this.getTaskCondition(cId);
		if (info) return info.state;
		return 0;
	}

	/**获取当前优先级最高任务 */
	public getPriorityTask(): gameProto.ITaskCondition {
		let conditon = null;
		for (let key in this.conditionDic) {
			let tmp = this.conditionDic[key];
			if (tmp.state == TaskStatus.FINISH) {
				return tmp;
			}
			if (!conditon && tmp.state == TaskStatus.PROCESSING) {
				conditon = tmp;
			}
		}
		return conditon;
	}

	/**主线任务显示 */
	public getCurTaskCondition() {
		for (let key in this.conditionDic) {
			let conditon = this.conditionDic[key];
			if (conditon.state != TaskStatus.REWARD) {
				return conditon;
			}
		}
	}

	/**获取完成节点数量(红点计数) */
	public getFinishConditionNum() {
		let res = 0;
		for (let key in this.conditionDic) {
			let conditon = this.conditionDic[key];
			if (conditon && conditon.state == TaskStatus.FINISH) {
				res++;
			}
		}
		return res;
	}
	/**获取完成节点全部条件ID(用于一键领取) */
	public getFinishConditionCId() {
		let res = [];
		for (let key in this.conditionDic) {
			let conditon = this.conditionDic[key];
			if (conditon && conditon.state == TaskStatus.FINISH) {
				res.push(conditon.conditionBaseId);
			}
		}
		return res;
	}


	/**删除已领奖任务节点 */
	public delRewardCodition(cId: number) {
		delete this.conditionDic[cId];
	}

	/**检查自动领奖 */
	// private checkAuto() {
	// 	/**新手条件 */
	// 	if (this.taskType == TaskType.MainLine && this.isAuto()) {
	// 		for (let key in this.conditionDic) {
	// 			let conditon = this.conditionDic[key];
	// 			if (conditon && conditon.state == TaskStatus.FINISH) {
	// 				MissionProxy.send_MISSION_REWARD(this.taskId, conditon.conditionBaseId);
	// 			}
	// 		}
	// 	}
	// }
	// /**自动领奖 */
	// private isAuto() {
	// 	return this.cfg.guideTask == 1 || this.cfg.guideTask == 2;
	// }

	/**获取配置表 */
	public get cfg() {
		if (!this.m_taskcfg) {
			if (this.taskType == TaskType.Activity) {
				let vo = ActivityModel.getActivityVoById<AcTaskVo>(this.activityId);
				if (vo) this.m_taskcfg = vo.configs[this.taskId];
			} else {
				this.m_taskcfg = C.TaskConfig[this.taskId];
			}
		}
		return this.m_taskcfg;
	}

	/**获得所有子任务配置 */
	private getConditionCfgs() {
		if (this.taskType == TaskType.Activity) {
			let vo = ActivityModel.getActivityVoById<AcTaskVo>(this.activityId);
			if (vo) return vo.getConditionCfgs(this.taskId);
		} else {
			return MissionModel.getConditionCfgs(this.taskId);
		}
	}

	/**获得所有子任务配置 */
	public getConditionCfg(id: number) {
		if (this.taskType == TaskType.Activity) {
			let vo = ActivityModel.getActivityVoById<AcTaskVo>(this.activityId);
			if (vo) return vo.configsII[id];
		} else {
			return C.TaskConditionConfig[id];
		}
	}
}
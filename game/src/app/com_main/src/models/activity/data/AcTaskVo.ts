/**任务活动 */
class AcTaskVo extends ActivityVo implements IFObject {
    public taskInfoDic: { [id: number]: MissionInfoVo };

    public configs: { [key: number]: ActivityTaskConfig };	//任务配置表
    public configsII: { [key: number]: ActivityTaskConditionConfig };	//任务条件表

    public constructor() {
        super();
        this.taskInfoDic = {};
    }
    public createMissionInfo(data: gameProto.ITaskData) {
        if (this.taskInfoDic[data.taskId]) {
            this.taskInfoDic[data.taskId].update(data);
        } else {
            let vo = MissionInfoVo.create(data);
            this.taskInfoDic[vo.taskId] = vo;
        }
    }

    /**获得红点 */
    public getDayRedState(day: number, taskId?: number) {
        let openDay = Math.ceil((TimerUtils.getServerTimeMill() - this.openDate) / 86400000);
        if (taskId) {
            for (let key in this.taskInfoDic) {
                let vo = this.taskInfoDic[key];
                if (taskId == vo.taskId && openDay - vo.cfg.rewardDay >= 0 && vo.getFinishConditionNum() > 0) return 1;
            }
            return 0;
        } else {
            day = day ? day : 0;
            for (let key in this.taskInfoDic) {
                let vo = this.taskInfoDic[key];
                if (vo.cfg.rewardDay == day || day == 0) {
                    if (!taskId || taskId == vo.taskId) {
                        if (openDay - vo.cfg.rewardDay >= 0 && vo.getFinishConditionNum() > 0) return 1;
                    }
                }
            }
            return 0;
        }
    }

    /**获得日常任务红点 */
    public getRedState(taskId?: number) {
        for (let key in this.taskInfoDic) {
            let vo = this.taskInfoDic[key];
            if (taskId) {
                if (taskId == vo.taskId && vo.getFinishConditionNum() > 0) return 1;
            } else {
                if (vo.getFinishConditionNum() > 0) return 1;
            }
        }
        return 0;
    }

    /**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        MissionProxy.C2S_ACTIVITY_TASK_LIST(this.id);
    }

    /**获得子任务 */
	public conditionCfgs: { [taskId: number]: ActivityTaskConditionConfig[] };
	public getConditionCfgs(taskId: number) {
		if (!this.conditionCfgs) {
			this.conditionCfgs = {};
			for (let key in this.configsII) {
				let cfg = this.configsII[key];
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

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}
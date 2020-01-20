/**襄阳战 */
class AcEmperorBattleVO extends ActivityVo implements IFObject {
    public static MAX_KILL_AWARD: number = 0;

    public m_data: gameProto.IS2C_XIANGYANG_INFO;

    public commRank: gameProto.ICommRank[];
    public receiveId: number;
    public warCount: number;
    public svReceiveId: number;// 服务器推送可领奖id

    /**襄阳战个人战功奖励列表 */
    private m_pKillAwardList: number[] = [];
    private m_pCountryAwardList: { countryId: number, value?: number, rank?: number }[];

    public constructor() {
        super();
        this.m_pKillAwardList = [];
        AcEmperorBattleVO.MAX_KILL_AWARD = C.XiangyangPlayerBattleRewardConfig ? Utils.objectLenght(C.XiangyangPlayerBattleRewardConfig) : 0;
        this.m_pCountryAwardList = [];
    }

    public init(body?: gameProto.IActivityInfo) {
        super.init(body);
        ActivityModel.addActivityVo(this);
        this.calcuResetTime();
    }

    public parseData(data: gameProto.IS2C_XIANGYANG_INFO) {
        this.calcuResetTime();
        this.m_data = data;

        this.commRank = data.commRank;
        this.receiveId = data.receiveId;
        this.warCount = data.warCount;

        this.clearCountryAwrdList();
        this.updateCountryAward(data.wei, CountryType.WEI);
        this.updateCountryAward(data.shu, CountryType.SHU);
        this.updateCountryAward(data.wu, CountryType.WU);
        this.updateKillAward(data.receiveId);
    }

    /**攻击准备期间 */
    public isInAttReady() {
        let curTime: number = TimerUtils.getServerTimeMill();
        // let readyTime: number = ConstUtil.getValue(IConstEnum.XIANGYANG_FIGHT_TIME) * 1000;
        return curTime >= this.preViewDate && curTime <= this.openDate;
    }

    /**战斗期 */
    public isInBattleTime() {
        let curTime: number = TimerUtils.getServerTimeMill();
        return curTime >= this.preViewDate && curTime <= this.closeDate;
    }

    public close() {
        this.m_pKillAwardList = null;
        this.m_pCountryAwardList = null;
        super.close();
    }

    /**所有玩家排行榜数据 */
    public getRankData() {
        return this.commRank;
    }

    public getWarCountReceiveId(): [number, number] {
        return [this.warCount, this.receiveId];
    }

    /**所有单个国家玩家排行榜数据 */
    public getSingleRankData(countryId: number): gameProto.ICommRank[] {
        let list: gameProto.ICommRank[] = [];
        let listRank = this.getRankData();
        if (isNull(listRank)) return list;
        listRank.forEach((v, i, a) => {
            if (v.playerHead.countryId == countryId) {
                list.push(v);
            }
        });
        return list;
    }

    /**获取玩家个人的排行榜数据 */
    public getPlayerRankData(): gameProto.ICommRank {
        let data: gameProto.ICommRank = null;
        let listRank = this.getSingleRankData(RoleData.countryId);
        listRank.forEach((v, i, a) => {
            if (v.playerHead.playerId === RoleData.playerId) {
                data = v;
            }
        });
        return data;
    }

    /**检查是否开启 */
    public checkIsOpen() {
        super.checkIsOpen();
        if (this.bActivited) WorldModel.openTick();
    }

    /**图标是否可见 */
    public isOpenIcon() {
        return true;
    }

    /**预告倒计时(ms) */
    public getPreTime() {
        return this.preViewDate - TimerUtils.getServerTimeMill();
    }

    /**是否预告请求 */
    public isNoticeRequest() {
        return true;
    }

    /**本地修正活动时间 */
    public calcuResetTime() {
        if (TimerUtils.getServerTimeMill() < this.closeDate) return;

        let timeDelay = 7 * 3600 * 24 * 1000;
        this.preViewDate = this.preViewDate + timeDelay;
        this.openDate = this.openDate + timeDelay;
        this.closeDate = this.closeDate + timeDelay;
    }

    /**弹称帝面板 */
    public emperorCoronation(info: gameProto.IS2C_EMPEROR_CHANE_NOTICE) {
        // Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION, info);
        ScenePopQueWnd.addEmperorNotice(info);
    }

    /**更新襄阳战个人战功奖励领取记录 */
    public updateKillAward(id: number, single: boolean = false) {
        if (isNull(id) || id < 1) return;
        if (isNull(this.m_pKillAwardList)) this.m_pKillAwardList = [];
        if (single) {
            if (this.m_pKillAwardList.indexOf(id) == -1) this.m_pKillAwardList.push(id);
        } else {
            for (let i = 1; i <= id; i++) {
                if (this.m_pKillAwardList.indexOf(i) == -1) this.m_pKillAwardList.push(i);
            }
        }
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.EXPLOIT_AWARD_UPDATE, null);
    }

    /**判断当前个人战功奖励是否可以领取 */
    public checkKillAward(curPro: number, isReceive: boolean = false): boolean {
        if (isReceive) {
            if (this.m_pKillAwardList.indexOf(curPro) == -1) return true;
            return false;
        }
        let xyConfig: XiangyangPlayerBattleRewardConfig = C.XiangyangPlayerBattleRewardConfig[curPro];
        if (isNull(xyConfig)) return false;
        let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
        let [warCount, receiveId] = vo.getWarCountReceiveId();
        if (isNull(warCount)) return false;
        if (warCount < xyConfig.count)
            return false;
        if (this.m_pKillAwardList.indexOf(curPro) != -1)
            return false;
        if (curPro > 1 && this.m_pKillAwardList.indexOf(curPro - 1) == -1)
            return false;
        return true;
    }

    /**更新领取宝箱状态 */
    public checkKillAwardBoxState(curPro): boolean {
        if (this.m_pKillAwardList.indexOf(curPro) == -1)
            return false;
        return true;
    }

    /**奖励弹框显示 */
    public receiveKillReward(data: gameProto.IS2C_XIANGYANG_RECEIVE) {
        if (data.state == 0) {
            let cfg = C.XiangyangPlayerBattleRewardConfig[data.receiveId]
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
            }
        }
    }


    public updateCountryAward(value: number, countryId: number) {
        let awList: { countryId: number, value?: number } = { countryId: countryId, value: value };
        this.m_pCountryAwardList.push(awList);
    }

    /**获取已经领取的宝箱列表 */
    public getDoneKillAwardList() {
        return this.m_pKillAwardList;
    }

    /**获取国家战功列表 */
    public getCountryAwardList() {
        return this.m_pCountryAwardList;
    }

    /**清除列表 */
    public clearCountryAwrdList() {
        this.m_pCountryAwardList = [];
    }

    /**检测个人挑战奖励红点 */
    public checkBattleRewardRedPoint(): number {
        if (this.svReceiveId && this.svReceiveId > 0) {
            if (this.checkKillAward(this.svReceiveId, true)) return 1;
            return 0;
        }
        for (let curPro = 1; curPro <= AcEmperorBattleVO.MAX_KILL_AWARD; curPro++) {
            if (this.checkKillAward(curPro)) return 1;
        }
        return 0;
    }

    private _isJoin: boolean = false;
    public get isJoin(): boolean {
        return this._isJoin;
    }
    public set isJoin(v: boolean) {
        this._isJoin = v;
    }

    /**=====================================================================================
	 * 配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return false;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        if (!FunctionModel.isFunctionOpen(FunctionType.WORLD_MAP)) return;
        AcBattleProxy.C2S_XIANGYANG_INFO();
        WorldProxy.m_pVersion = null;
    }

	/**=====================================================================================
	 * 配置相关 end
	 * =====================================================================================
	 */

}
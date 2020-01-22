class ActivityVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = ["id", "rechargeIds", "viewType", "btnId", "preViewDate", "openDate", "closeDate", "closeIconDate"];

	public id: number;//活动Id
	public rechargeIds: number[];	//充值类型
	public viewType: number;//活动显示类型
	public btnId: number;	//按钮id
	public openDate: number;//活动开始时间
	public closeDate: number;//活动结束时间
	public closeIconDate: number;//活动关闭时间
	public preViewDate: number;	//图标预告时间

	protected bActivited: boolean;	//是否激活
	protected bPreNotice: boolean;	//预告时间到 发送通知状态值（只发送一次）

	protected bClose: boolean;	//活动是否结束(奖励领取完毕等)
	protected bIsInitCfg: boolean;	//配置已经初始化
	public configs: any;	//配置表（子类重写类型）
	public configsII: any;	//配置表（子类重写类型）
	protected bIsInitReCfg: boolean;	//充值配置已经初始化
	public rechargeCfgs: gameProto.IRechargeConfig[];

	public constructor() {
		super();
	}

	public onDestroy() {
	}

	public init(body?: gameProto.IActivityInfo) {
		this.parseKeys(body);
		this.bActivited = false;
		this.bClose = false;
		this.checkIsOpen();
		this.checkPreIcon();
		//发送活动开放事件
		com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
	}

	/**检查是否开启 */
	public checkIsOpen() {
		if (this.bActivited) return;
		let time = TimerUtils.getServerTimeMill();
		if (time >= this.openDate && time < this.closeDate) {
			this.activited = true;
		}
	}

	/**预告检测 */
	public checkPreIcon() {
		if (this.bActivited) return;
		if(this.preNotice) return;
		if (this.preViewDate > 0) {
			if (TimerUtils.getServerTimeMill() > this.preViewDate) {
				this.preNotice = true;
			}
		}
	}

	/**发送预告通知 */
	public set preNotice(val: boolean) {
		if (this.bPreNotice == val) return;
		this.bPreNotice = val;
		ActivityModel.addActivityVo(this);
		com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
		//预告激活 添加请求数据
		if (this.isNoticeRequest()) {
			this.requestActivityData();
		}
	}

	public get preNotice(): boolean {
		return this.bPreNotice;
	}

	/**图标是否可见 */
	public isOpenIcon() {
		if (this.bClose) return false;

		let time = TimerUtils.getServerTimeMill();

		if (this.preViewDate > 0) {
			return time > this.preViewDate && time < this.closeIconDate;
		} else {
			return time > this.openDate && time < this.closeIconDate;
		}
	}

	/**预告倒计时(ms) */
	public getPreTime() {
		return this.openDate - TimerUtils.getServerTimeMill();
	}

	/**更新数据 */
	public update(body?: gameProto.IActivityInfo) {
		let isNewAc:boolean = false;
		if(this.openDate != body.openDate || this.closeDate != body.closeDate){
			isNewAc = true;
		}

		this.parseKeys(body);
		//重置的新活动
		if(isNewAc){
			//过期活动不会执行更新 预告活动等待下一次tick判断
			if(this.activited) this.requestActivityInfo();
		}
	}

	/**解析服务器协议 */
	private parseKeys(body: any) {
		Utils.voParsePbData(this, body, ActivityVo.AttriKey);
	}


	/**是否激活 */
	public get activited() {
		return this.bActivited;
	}

	/**活动激活 */
	public set activited(val: boolean) {
		if (this.bActivited == val) return;
		this.bActivited = val;
		if (val) {
			ActivityModel.addActivityVo(this);
			this.requestActivityData();
		}
		com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
	}

	/**活動關閉 只能由model remove方法调用*/
	public close() {
		this.activited = false;
		this.bClose = true;
		com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
	}

	/**
	 * 获得活动进度
	 * 0-预告
	 * 1-进行
	 * 2-结束
	 * 3-关闭
	 *  */
	public getProcess(): IAcProEnum {
		let time = TimerUtils.getServerTimeMill();
		if (this.preViewDate > 0 && time > this.preViewDate && time < this.openDate) {
			return IAcProEnum.NOTICE;
		}
		if (time > this.closeIconDate) return IAcProEnum.CLOSE;
		if (this.activited) return IAcProEnum.PROCESS;
		return IAcProEnum.FINISH;
	}
	/**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */
	/**请求活动充值配置 */
	public requestRechargeCfg() {
		if (this.bIsInitReCfg) return;
		PayProxy.C2S_RECHARGE_CONFIGS(this.id, this.rechargeIds);
	}
	/**解析充值配置表 */
	public parseRechargeCfg(cfgs: gameProto.IRechargeConfig[]) {
		this.rechargeCfgs = cfgs;
		this.bIsInitReCfg = true;
	}
	/**请求活动配置与内容 */
	public requestActivityData() {
		if (this.isNeedServerCfg()) this.requestActivityCfg();
		if (this.rechargeIds.length > 0) this.requestRechargeCfg();
		this.requestActivityInfo();
	}

	/**请求活动配置 */
	public requestActivityCfg() {
		if (this.bIsInitCfg) return;
		ActivityProxy.C2S_ACTIVITY_COMM_CONFIG(this.id);
	}

	/**解析活动配置 */
	public parseAcitvityCfg(data?: string[]) {
		this.configs = ActivityModel.parseTable(data[0]);
		if (data.length > 1) this.configsII = ActivityModel.parseTable(data[1]);
		this.bIsInitCfg = true;
	}

	/**是否需要读取服务器配置(子类重写) */
	public isNeedServerCfg(): boolean {
		/**此处加一行空函数 js文件 否则外网下载不完整此处中断 原因未明 */
		debug('')
		return false;
	}

	/**请求活动内容(子类重写)  */
	public requestActivityInfo() {
		debug('')
	}

	/**是否预告请求 */
	public isNoticeRequest() {
		return false;
	}


	/**跨天请求 */
	public crossDayRequest(){
		debug('')
	}
	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */

}
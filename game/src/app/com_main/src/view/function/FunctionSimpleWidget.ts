/**
 * 功能通用按钮
 */
module com_main {
	export class FunctonSimpleWidget extends FunctionWidgetBase {

		public static NAME = "FunctonSimpleWidget";
		public constructor() {
			super();
			this.m_pIconType = FuncIconType.FUNCTION;
		}

		protected childrenCreated(): void {
			super.childrenCreated();

		}

		public onDestroy() {
			super.onDestroy();
		}

		/**红点监听(子类重写) */
		public initRedPointEvt() {
			let data: { res: RedEvtType[], param: IRedViewParam, viewType: number } = this.getRedEvts();
			if (data.res.length > 0) {
				if (data.viewType == 4) {
					RedPointModel.AddInfoListener(this.m_pConIcon, { x: 0, y: 0 }, data.res, 4, data.param);
				} else {
					if (this.pos == FunctionPosType.FPT_BOTTOM) {
						RedPointModel.AddInfoListener(this.m_pConIcon, { x: 63, y: 4, scale: 0.78 }, data.res, 2, data.param);
					} else {
						RedPointModel.AddInfoListener(this.m_pConIcon, { x: 40, y: 3, scale: 0.78 }, data.res, 2, data.param);
					}
				}
			} else {
				RedPointModel.RemoveInfoListenerByCode(this.m_pConIcon.hashCode);
			}
		}

		/**获得红点事件 */
		private getRedEvts() {
			let res = [];
			let param: IRedViewParam = {};
			let viewType: number = 2;
			for (let i = 0; i < this.m_nIds.length; i++) {
				let funcId = this.m_nIds[i];
				switch (funcId) {
					//武将
					case FunctionType.GENERAL: {
						this.addRedEvtInList(res, [RedEvtType.GEN_COLLECT, RedEvtType.GEN_COLLECT]);
						break;
					}
					case FunctionType.GENERAL_LEVELUP: {
						this.addRedEvtInList(res, [RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN]);
					}
					case FunctionType.GENERAL_STAR: {
						this.addRedEvtInList(res, [RedEvtType.GEN_STAR]);
						break;
					}
					case FunctionType.GENERAL_SKILL: {
						this.addRedEvtInList(res, [RedEvtType.GEN_SKILL]);
						break;
					}
					case FunctionType.GENERAL_TREASURE: {
						this.addRedEvtInList(res, [RedEvtType.GEN_TREA_EQ]);
						break;
					}
					//物品
					case FunctionType.PACK: {
						this.addRedEvtInList(res, [RedEvtType.BAG_NEW]);
						break;
					}
					//任务
					case FunctionType.MAIN_TASK: {
						this.addRedEvtInList(res, [RedEvtType.TASK]);
						param.taskType = TaskType.ALL;
						break;
					}
					//国家
					case FunctionType.COUNTRY: {
						this.addRedEvtInList(res, [RedEvtType.TASK_COUNTRY, RedEvtType.TAX_COUNTRY, RedEvtType.JOB_COUNTRY, RedEvtType.CITY_CHANGE_COUNTRY]);
						break;
					}
					//科技处理
					case FunctionType.TECHNOLOGY: {
						this.addRedEvtInList(res, [RedEvtType.TECHNO]);
						break;
					}
					case FunctionType.PATROL: {
						this.addRedEvtInList(res, [RedEvtType.PATROL]);
						break;
					}
					//酒馆
					case FunctionType.GENERAL_RECRUITMENT: {
						this.addRedEvtInList(res, [RedEvtType.TANVERN]);
						break;
					}
					/**跨服 */
					case FunctionType.CROSS_SERVER: {
						this.addRedEvtInList(res, [RedEvtType.CROSS_SERVER]);
						viewType = 4;
						break;
					}
					//装备
					case FunctionType.EQUIPMENT: {
						this.addRedEvtInList(res, [RedEvtType.GEN_EQUIP, RedEvtType.EQUIP_COMPOSE]);
						break;
					}
					case FunctionType.EQUIPMENT_STENG: {
						this.addRedEvtInList(res, [RedEvtType.GEN_EQ_LV]);
						break;
					}
					case FunctionType.EQUIPMENT_GRADE: {
						this.addRedEvtInList(res, [RedEvtType.GEN_EQ_GRADE]);
						break;
					}
					case FunctionType.EQUIPMENT_WROUGH: {
						this.addRedEvtInList(res, [RedEvtType.GEN_EQ_WROUGHT]);
						break;
					}
					//兵备
					case FunctionType.ARMEY: {
						this.addRedEvtInList(res, [RedEvtType.ARMS_TRAIN, RedEvtType.ARMS_GRADE]);
						break;
					}
					//聚宝
					case FunctionType.FREE_MONEY: {
						this.addRedEvtInList(res, [RedEvtType.CORN, RedEvtType.CORN_AWARD]);
						break;
					}
					//邮件
					case FunctionType.MAIL: {
						this.addRedEvtInList(res, [RedEvtType.MAIL]);
						break;
					}
					//在线奖励
					case FunctionType.ONLINE: {
						this.addRedEvtInList(res, [RedEvtType.ONLINE]);
						viewType = 4;
						break;
					}
					//限时活动
					case FunctionType.GIFTBAG: {
						this.addRedEvtInList(res, [RedEvtType.GIFT_BAG]);
						viewType = 4;
						break;
					}
					//布阵
					case FunctionType.CAMP: {
						this.addRedEvtInList(res, [RedEvtType.TEAM_CAMP]);
						break;
					}
					//宝物
					case FunctionType.TREASURE_UPGRADE_LEVEL: {
						this.addRedEvtInList(res, [RedEvtType.TREA_STRENG]);
						break;
					}
					case FunctionType.TREASURE_UPGRADE_STAR: {
						this.addRedEvtInList(res, [RedEvtType.TREA_STAR]);
						break;
					}
					case FunctionType.TREASURE_ASSEMBLING_GEMSTONE: {
						this.addRedEvtInList(res, [RedEvtType.TREA_INLAY]);
						break;
					}
					//排行榜
					case FunctionType.RANK: {
						this.addRedEvtInList(res, [RedEvtType.FIGHT_RANK_WORSHIP]);
						break;
					}
				}
			}
			let data: { res: RedEvtType[], param: IRedViewParam, viewType: number } = { res: res, param: param, viewType: viewType }
			return data;
		}


		/**添加事件红点类型 */
		private addRedEvtInList(res: RedEvtType[], types: RedEvtType[]) {
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				if (res.indexOf(type) == -1) res.push(type);
			}
		}

		/**点击回调 则此实现 丢给子类（FunctonSimpleWidget	FunctionActiWidget）重写回调) */
		protected onClickHandle() {
			super.onClickHandle();
			let funcId = this.m_nIds[0];
			//过滤判断对应功能是否开启
			FunctionModel.openFunctionByType(funcId);
		}

		/**按钮id初始化 */
		protected initIdAction(ids: number[]) {
			if (ids.indexOf(FunctionType.CROSS_SERVER) >= 0) {
				let time = CrossModel.openTime * 1000 - TimerUtils.getServerTimeMill();;
				if (unNull(time) && time > 0) this.createTimeOutLab(time, 4);
				return;
			}
			//没有倒计时 清理
			this.clearTimeOut();
		}

	}
}
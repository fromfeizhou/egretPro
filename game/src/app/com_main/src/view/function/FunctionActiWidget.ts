/**
 * 活动按钮
 */
module com_main {
	export class FunctionActiWidget extends FunctionWidgetBase {
		public static NAME = "FunctionActiWidget";
		public static WIDTH: number = 76;
		public constructor() {
			super();
			this.m_pIconType = FuncIconType.ACTIVITY;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public onDestroy() {
			super.onDestroy();
		}

		/**活动结束 */
		public isActiviyEnd() {
			if (this.m_nIds && this.m_nIds.length > 0)
				return false;
			return true;
		}


		/**红点监听(子类重写) */
		public initRedPointEvt() {
			let evts = this.getRedEvts();
			if (evts.res.length > 0) {
				if (evts.viewType == 2) {
					RedPointModel.AddInfoListener(this.m_pConIcon, { x: 50, y: 0, scale: 0.78 }, evts.res, evts.viewType, evts.param);

				} else {
					RedPointModel.AddInfoListener(this.m_pConIcon, { x: 0, y: 0 }, evts.res, evts.viewType, evts.param);

				}
			} else {
				RedPointModel.RemoveInfoListenerByCode(this.m_pConIcon.hashCode);
			}

		}

		/**获得红点事件 */
		private getRedEvts() {
			let res = [];
			let param: IRedViewParam = {};
			let viewType: number = 4;
			for (let i = 0; i < this.m_nIds.length; i++) {
				let acId = this.m_nIds[i];
				switch (acId) {
					case AcViewType.OPEN_SEVEN: {	//开服7天活动
						this.addRedEvtInList(res, [RedEvtType.OPEN_SEVEN]);
						break;
					}
					case AcViewType.NOR_SEVEN: {	//循环7天活动
						this.addRedEvtInList(res, [RedEvtType.NOR_OPEN_SEVEN]);
						break;
					}
					case AcViewType.CARD_MONTH_WEEK: {	//周卡月卡
						this.addRedEvtInList(res, [RedEvtType.CARD_MONTH]);
						break;
					}
					case AcViewType.RECHARGE_ADD_UP: {	//累计充值
						this.addRedEvtInList(res, [RedEvtType.RECHARD_ADD]);
						break;
					}
					case AcViewType.RECHARGE_SINGLE: {	//单笔充值
						this.addRedEvtInList(res, [RedEvtType.RECHARD_SINGLE]);
						break;
					}
					case AcViewType.CONSUME_GIFT: {	//消费豪礼
						this.addRedEvtInList(res, [RedEvtType.CONSUME_GIFT]);
						break;
					}
					case AcViewType.SIGN_CONTIN_DAY: {	//7天登录活动
						this.addRedEvtInList(res, [RedEvtType.LOGIN_DAY]);
						break;
					}
					case AcViewType.FUND_GROWTH: {	//成长基金
						this.addRedEvtInList(res, [RedEvtType.GROWTH_FUN]);
						break;
					}
					case AcViewType.SIGN_MONTH_DAY: {	//月签到
						this.addRedEvtInList(res, [RedEvtType.SIGN_MONTH_DAY]);
						break;
					}
					case AcViewType.THRONE: {
						this.addRedEvtInList(res, [RedEvtType.THRONE]);
						break;
					}
					case AcViewType.ONE_GIFT_BAG: {
						this.addRedEvtInList(res, [RedEvtType.ONE_GIFT_BAG]);
						break;
					}
					case AcViewType.FIRST_RECHARGE: {
						viewType = 2;
						this.addRedEvtInList(res, [RedEvtType.FIRST_RECHARGE]);
						break;
					}
					case AcViewType.XIANGYANG: {
						this.addRedEvtInList(res, [RedEvtType.XIANGYANG]);
						break;
					}
					case AcViewType.PRIZE: {
						this.addRedEvtInList(res, [RedEvtType.TURNTABLE]);
						break;
					}
					case AcViewType.SIGN_CONTIN_DAY_2: {
						this.addRedEvtInList(res, [RedEvtType.LOGIN_DAY_2]);
						break;
					}
					case AcViewType.RECHARGE_ADD_UP_3: {
						this.addRedEvtInList(res, [RedEvtType.RECHARD_ADD_3]);
						break;
					}
					case AcViewType.RECHARGE_SINGLE_2: {
						this.addRedEvtInList(res, [RedEvtType.RECHARD_SINGLE_2]);
						break;
					}
					case AcViewType.TREASEURE_BOWL: {
						this.addRedEvtInList(res, [RedEvtType.TREASEURE_BOWL]);
						break;
					}
					case AcViewType.NEW_GEN_VIS: {
						viewType = 2;
						this.addRedEvtInList(res, [RedEvtType.NEW_GEN_VIS, RedEvtType.NEW_GEN_LIMIT_BUY]);
						break;
					}
					/**春节活动 */
					case AcViewType.SIGN_CONTIN_DAY_3: {	//新春7天登录活动
						this.addRedEvtInList(res, [RedEvtType.LOGIN_DAY_3]);
						break;
					}
					case AcViewType.RECHARGE_SINGLE_3: {
						this.addRedEvtInList(res, [RedEvtType.RECHARD_SINGLE_3]);
						break;
					}
					case AcViewType.RECHARGE_ADD_UP_5: {	//新春累计充值
						this.addRedEvtInList(res, [RedEvtType.RECHARD_ADD_4]);
						break;
					}
					case AcViewType.TREASEURE_BOWL_2: {
						this.addRedEvtInList(res, [RedEvtType.TREASEURE_BOWL_2]);
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
			let type = this.m_nIds[0];
			let activiVo: ActivityVo = ActivityModel.getActivityVo<ActivityVo>(type);
			if (!activiVo)
				return;
			switch (type) {
				/**开服活动 */
				case AcViewType.OPEN_SEVEN: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_SEVEN_DAY);
					break;
				}
				/**首充 */
				case AcViewType.FIRST_RECHARGE: {
					Utils.open_view(TASK_UI.POP_PAY_First_VIEW);
					break;
				}
				/**一元礼包 */
				case AcViewType.ONE_GIFT_BAG: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_ONE_GIFT_BAG);
					break;
				}
				/**累计充值，单笔充值，消费豪礼,每日登录 */
				case AcViewType.RECHARGE_SINGLE:
				case AcViewType.CARD_MONTH_WEEK:
				case AcViewType.CONSUME_GIFT:
				case AcViewType.RECHARGE_ADD_UP:
				case AcViewType.SIGN_CONTIN_DAY:
				case AcViewType.FUND_GROWTH:
				case AcViewType.PURCHAGE_BAG: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_ADD_RECHARGE);
					break;
				}
				/**循环奖励*/
				case AcViewType.NOR_SEVEN:
				case AcViewType.SIGN_MONTH_DAY:
				case AcViewType.FIGHT_RANKING_AWARD:
				case AcViewType.LEVEL_RANKING_AWARD: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_REPEAT, type);
					break;
				}
				/**封王战*/
				case AcViewType.THRONE: {
					Utils.open_view(TASK_UI.POP_KING_VIEW);
					break;
				}
				/**南蛮入侵*/
				case AcViewType.BARBARIANATTACK: {
					this.onBarAttackIcon();
					break;
				}

				/**古战场*/
				case AcViewType.ANCIENTBATTLEFIELD: {
					// EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT,150));
					WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
					break;
				}

				/**襄阳战*/
				case AcViewType.XIANGYANG: {
					this.onEmperorIcon();
					break;
				}
				/**幸运转盘*/
				case AcViewType.PRIZE: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_TURNTABLE, type);
					break;
				}
				/**新7天活动，新累充，新单充，特惠商店，充值聚宝盆*/
				case AcViewType.SIGN_CONTIN_DAY_2:
				case AcViewType.RECHARGE_ADD_UP_3:
				case AcViewType.RECHARGE_ADD_UP_4:
				case AcViewType.RECHARGE_SINGLE_2:
				case AcViewType.AC_SHOP:
				case AcViewType.TREASEURE_BOWL: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_SEVENII, type);
					break;
				}
				/**新春活动，新春累充，新春单充，新春特惠商店，新春充值聚宝盆*/
				case AcViewType.SIGN_CONTIN_DAY_3:
				case AcViewType.RECHARGE_ADD_UP_5:
				case AcViewType.RECHARGE_ADD_UP_6:
				case AcViewType.RECHARGE_SINGLE_3:
				case AcViewType.AC_SHOP_2:
				case AcViewType.TREASEURE_BOWL_2: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_NEWYAER, type);
					break;
				}
				// case AcViewType.RECHARGE_ADD_UP_2:
				case AcViewType.NEW_GEN_VIS: {
					Utils.open_view(TASK_UI.POP_ACTIVITY_NEW_GENERAL, type);
					break;
				}

				/**免单商城 */
				// case ActivityBtnType.FREE_SHOP: {
				// 	ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.FREE_ITEM);
				// 	break;
				// }
			}
		}

		/**南蛮入侵 */
		private onBarAttackIcon() {
			let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
			if (vo.isOpenIcon()) {
				if (vo.evtDatas.length > 0) {
					Utils.open_view(TASK_UI.POP_ACTIVITY_BAR_ATK);
				} else {
					EffectUtils.showTips(GCode(CLEnum.AC_BAR_LIMIT));
				}
			} else {
				EffectUtils.showTips(GCode(CLEnum.AC_UNOPEN));
			}
		}

		/**襄阳战 */
		private onEmperorIcon() {
			let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
			// if (vo && vo.isOpenIcon()) {

			// 	// 活动期间--准备和攻城期间
			// 	if (vo.activited) {
			// 		SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
			// 	} else {
			// 		// EffectUtils.showTips(GCode(CLEnum.XIANGYANG_TITLE) + GCode(CLEnum.CLOSE));
			// 		Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE);
			// 	}
			// } else {						// 预告期间
			// 	Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE);
			// }
			if (vo) {
				let curTime: number = TimerUtils.getServerTimeMill();
				if (curTime < vo.preViewDate) {
					AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW();
				} else if (curTime < vo.closeDate) {
					SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
				} else {
					AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW();
				}
			} else {
				AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW();
			}
		}


		/**按钮id初始化 */
		protected initIdAction(ids: number[]) {
			//倒计时显示
			for (let i = 0; i < ids.length; i++) {
				let type = ids[i];
				let vo: ActivityVo = ActivityModel.getActivityVo<ActivityVo>(type);
				if (vo) {
					let time = vo.getPreTime();
					if (time > 0) this.createTimeOutLab(time, 4);
					return;
				}
			}
			//没有倒计时 清理
			this.clearTimeOut();
		}
	}
}
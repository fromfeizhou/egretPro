// module com_main {
// 	export class WelfareLoginCell extends CComponent {
// 		private m_pLbDay: eui.Label;    //累计充值标题

// 		private m_group: eui.Group;  //奖励
// 		private m_pBtnGet: ComButton;

// 		private m_nAwardId: number;      //累计充值奖励id
// 		private m_nDay: number;	//登录天数

// 		public constructor(awardId: number) {
// 			super();
// 			this.m_nAwardId = awardId;
// 			this.skinName = Utils.getSkinName("app/welfare/WelfareLoginCellSkin.exml");
// 		}

// 		public onDestroy(): void {
// 			super.onDestroy();
// 			EventManager.removeEventListener(this.m_pBtnGet);
// 		}

// 		$onRemoveFromStage(): void {
// 			this.onDestroy();
// 			super.$onRemoveFromStage();
// 		}


// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.cacheAsBitmap = true;
// 			this.m_pBtnGet.setTitleLabel("领取");
// 			EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);

// 			this.refreshView();

// 		}

// 		/**获得配置表id */
// 		public get awardId() {
// 			return this.m_nAwardId;
// 		}

// 		/**刷新界面 */
// 		public refreshView() {
// 			//配置设计错误 暂时先用 后续必须加表
// 			let awardCfg = C.DailyLoginRewardActConfig[this.m_nAwardId];
// 			if (awardCfg) {
// 				this.m_nDay = awardCfg.day;
// 				this.m_pLbDay.text = awardCfg.day + '天';
// 				let items = Utils.parseCommonItemJson(awardCfg.reward);
// 				if (items.length > 0) {
// 					for (let i = 0; i < items.length; i++) {
// 						let itemView = ComItemNew.create('name_num');
// 						itemView.setItemInfo(items[i].itemId, items[i].count);
// 						this.m_group.addChild(itemView);
// 					}

// 				}
// 			}
// 		}

// 		/**刷新按钮显示 */
// 		// public refreshBtnByData(data: gameProto.DailyLoginActResp) {
// 		// 	let day = data.day;
// 		// 	let awardList = data.received;
// 		// 	if (day < this.m_nDay) {
// 		// 		this.m_pBtnGet.setTitleLabel("领取");
// 		// 		this.m_pBtnGet.disabled = true;
// 		// 		return;
// 		// 	}
// 		// 	if (awardList.indexOf(this.m_nAwardId) >= 0) {
// 		// 		this.m_pBtnGet.setTitleLabel("已领取");
// 		// 		this.m_pBtnGet.disabled = true;
// 		// 	} else {
// 		// 		this.m_pBtnGet.setTitleLabel("领取");
// 		// 		this.m_pBtnGet.disabled = false;
// 		// 	}
// 		// }

// 		/**刷新按钮显示 为 已领取 */
// 		public refreshBtnByGet() {
// 			this.m_pBtnGet.setTitleLabel("已领取");
// 			this.m_pBtnGet.disabled = true;
// 		}

// 		/**领取奖励 */
// 		private onBtnGetHandler(e: egret.Event): void {
// 			WelfareProxy.send_DAILY_LOGIN_ACT_REWARD(this.m_nAwardId);
// 		}

// 	}

// }

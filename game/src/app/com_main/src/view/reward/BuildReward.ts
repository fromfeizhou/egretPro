// module com_main {
// 	export class BuildReward extends CView {

// 		private m_pRewardIdList: number[];
// 		private m_pBuildId: number;
// 		private m_pRank: number;
// 		private m_pEffectArray: any[] = [];

// 		/// 组件成员
// 		public m_pBg: com_main.APopUp;
// 		public m_pLbRank: eui.Label;
// 		public m_itemLists: eui.Group;
// 		public m_pGetBtn: com_main.ComButton;

// 		protected listenerProtoNotifications(): any[] {
// 			return [
// 				ProtoDef.CITY_BATTLE_GAIN_WIN_REWARD
// 			];
// 		}

// 		/**处理协议号事件 */
// 		protected executes(notification: AGame.INotification) {
// 			let body = notification.getBody();
// 			let protocol: number = Number(notification.getName());
// 			debug("BuildReward:execute -------->protocol, body:", protocol, body)
// 			switch (protocol) {
// 				case ProtoDef.CITY_BATTLE_GAIN_WIN_REWARD: {
// 					MessageTip.AddMessageInfo("成功领取奖励");
// 					debug("领取奖励返回, 飘字并关闭奖励界面");
// 					UpManager.history();
// 					break;
// 				}
// 			}
// 		}

// 		public constructor(result: any) {
// 			super();
// 			this.initApp("map/build/build_reward.exml");
// 			// 奖励ID列表
// 			this.m_pRewardIdList = result.reward;
// 			// 城池ID
// 			this.m_pBuildId = result.id;
// 			// 排名
// 			this.m_pRank = result.rank;
// 		}

// 		public onDestroy(): void {
// 			super.onDestroy();
// 			for (let i = 0; i < this.m_pEffectArray.length; i++) {
// 				ImageEffect.removeAction(this.m_pEffectArray[i]);
// 			}
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.initRankInfo();
// 			this.initRewardInfo();
// 		}

// 		/**
// 		 * 初始化排名
// 		 */
// 		private initRankInfo() {
// 			if (this.m_pRank > 0) {
// 				this.m_pLbRank.text = "第" + this.m_pRank + "名";
// 			}
// 		}

// 		/**
// 		 * 初始化奖励信息
// 		 */
// 		private initRewardInfo() {
// 			// 奖励配置
// 			let cfg = C.CityBattleWinRewardConfig;
// 			debug(cfg);

// 			let types = [];
// 			let rewardIndex = 0;
// 			const maxRewardCount = this.m_itemLists.numChildren;
// 			// 初始化固定奖励列表,取每种类型奖励去占一个格子
// 			for (let key in cfg) {
// 				// 一项奖励数据
// 				let rewardInfo = cfg[key];
// 				// 每种类型取一项数据
// 				if (!types[rewardInfo.type.valueOf()]) {
// 					types[rewardInfo.type.valueOf()] = true;
// 					let rewardItemList = JSON.parse(rewardInfo.reward);
// 					// 奖励列表是数组
// 					for (let i = 0; i < rewardItemList.length && rewardIndex < maxRewardCount; i++) {
// 						// 根据奖励设置奖励格子的内容						
// 						if (rewardItemList[i]) {
// 							let item: com_main.ComRewardItem = <com_main.ComRewardItem>this.m_itemLists.getChildAt(rewardIndex);
// 							let dataArray: number[] = rewardItemList[i];
// 							debug(dataArray);
// 							item.setSquareData(dataArray[0], dataArray[1], dataArray[2], rewardInfo.type.valueOf(), rewardInfo.description);
// 							rewardIndex++;
// 						}
// 					}
// 				}
// 			}

// 			// 根据服务器发过来的奖励ID设置可领取的奖励
// 			let canGetReward: boolean = false;
// 			for (let i = 0; i < this.m_pRewardIdList.length; i++) {
// 				let id = this.m_pRewardIdList[i];
// 				let rewardInfo = cfg[id];
// 				if (rewardInfo) {
// 					let rewardItemList = JSON.parse(rewardInfo.reward);
// 					for (let j = 0; j < rewardItemList.length; j++) {
// 						let dataArray = rewardItemList[j];
// 						for (let k = 0; k < maxRewardCount; k++) {
// 							let item: com_main.ComRewardItem = <com_main.ComRewardItem>this.m_itemLists.getChildAt(k);
// 							if (item.getType() == rewardInfo.type && !item.isSetReward()) {
// 								item.setRewardInfo(dataArray[0], dataArray[1], dataArray[2], rewardInfo.description, false);
// 								canGetReward = true;

// 								this.setEfffect(item);

// 								break;
// 							}
// 						}
// 					}
// 				}
// 			}

// 			// 领取按钮图片
// 			this.m_pGetBtn.setTitleImg("font_lq_new_png");
// 			if (canGetReward) {
// 				com_main.EventManager.addTouchScaleListener(this.m_pGetBtn, this, this.onClickGetBtn);
// 			} else {
// 				// 置灰
// 				this.m_pGetBtn.disabled = true;
// 			}
// 		}

// 		private setEfffect(obj) {
// 			let effectImg = new egret.Bitmap(RES.getRes("common_dcjl_bg_png"));
// 			effectImg.width = 183;
// 			effectImg.height = 175;
// 			effectImg.anchorOffsetX = effectImg.width / 2 + 1;
// 			effectImg.anchorOffsetY = effectImg.height / 2 + 8;
// 			effectImg.x = obj.x + obj.width / 2;
// 			effectImg.y = obj.y + obj.height / 2;
// 			Utils.addChild(this, effectImg);
// 			this.setChildIndex(effectImg, 4);

// 			let gemEffect = ImageEffect.load(IETypes.EUI_Gem_Particle);
// 			gemEffect.anchorOffsetX = gemEffect.width / 2 + 50;
// 			gemEffect.anchorOffsetY = gemEffect.height / 2 + 100;
// 			gemEffect.x = obj.x + obj.width / 2;
// 			gemEffect.y = obj.y + obj.height / 2;
// 			Utils.addChild(this, gemEffect);
// 			this.m_pEffectArray.push(gemEffect);
// 			ImageEffect.runAction(gemEffect, () => { }, this, false);
// 		}

// 		/**
// 		 * 领取按钮点击事件
// 		 */
// 		private onClickGetBtn(evt: egret.TouchEvent) {
// 			debug("请求领取城池奖励,城池ID:" + this.m_pBuildId);
// 			RewardProxy.sendCityBattleGainWinRewardReq(this.m_pBuildId);
// 		}
// 	}
// }
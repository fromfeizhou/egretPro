// module com_main {
// 	/**
// 	 * 新手地图建筑
// 	 */
// 	export class NBuild extends egret.DisplayObjectContainer {

// 		public static NAME = 'NBuild';
// 		private m_pBuild: egret.Bitmap;//建筑

// 		private m_pBuild_name_icon: egret.Bitmap = null;//名字前面icon
// 		private m_pBuild_name: any = null;//名字

// 		private static BUILD_IMG_PREFIX = "map_build_";
// 		private static BUILD_IMG_SUFFIX = "_png";

// 		private m_pBuildConfig: any = null;

// 		private m_pBuild_effect: egret.Bitmap = null;//状态动画
// 		private m_pBuildEffectType: string = '';

// 		private m_pIsGray: boolean = false;

// 		private m_pFlagType: string = '';
// 		private m_pFlag: egret.Bitmap = new egret.Bitmap();//旗帜

// 		private m_pWorldEvents = {};
// 		private m_pWorldEventsNum = 0;//世界事件数量

// 		/**
// 		 * 倒计时列表
// 		 * strat 必须
// 		 * end	 必须
// 		 * icon
// 		 * 
// 		 * 可选
// 		 * pro
// 		 */
// 		private m_pCountDowns = {};
// 		private m_pCountDownsNum = 0;

// 		private m_pID: number = 0;

// 		/**
//          * 销毁方法
//          */
//         public onDestroy() {

// 			var self = this;

// 			Utils.removeFromParent(self.m_pBuild);
// 			self.m_pBuild = null;

// 			Utils.removeFromParent(self.m_pBuild_name);
// 			self.m_pBuild_name = null;

// 			if (self.m_pBuild_name_icon) {
// 				Utils.removeFromParent(self.m_pBuild_name_icon);
// 				self.m_pBuild_name_icon = null;
// 			}

// 			if (self.m_pBuild_effect) {
// 				EffectData.removeEffect(EffectData.WORLD_MAP, self.m_pBuildEffectType, self.m_pBuild_effect);
// 				Utils.removeFromParent(self.m_pBuild_effect);
// 				self.m_pBuild_effect = null;
// 			}

// 			Utils.TimerManager.remove(self.time_call, self);

// 			self.clearWorldEvents();

// 			EffectData.removeEffect(EffectData.WORLD_MAP, self.m_pFlagType, self.m_pFlag);
// 			Utils.removeFromParent(self.m_pFlag);
// 			self.m_pFlag = null;

//         }

// 		public static create(config: any): NBuild {
// 			var obj = new NBuild(config);
// 			return obj;
// 		}

//         public constructor(config: any) {
//             super();

// 			this.name = NBuild.NAME;

// 			this.m_pBuildConfig = config;

// 			this.m_pID = config.id;

//             this.touchEnabled = false;
//             this.touchChildren = false;

//             this.init();
//         }

// 		/**初始化建筑 */
// 		private init() {
// 			this.add_build();

// 			if (this.m_pBuildConfig && this.m_pBuildConfig.type > 3) {
//                 this.add_build_name_s();
//             } else {
// 				this.add_build_name();
// 			}

// 			this.refresh_flag();

// 			this.show_effect();

// 			this.refreshWorldEvents();

// 		}

// 		/**添加建筑图片 */
// 		private add_build() {
// 			let config = this.m_pBuildConfig;

//             let url = NBuild.BUILD_IMG_PREFIX + config.type + NBuild.BUILD_IMG_SUFFIX;

//             if (config.type > 3) {
//                 url = 'map_build_icon13_png';
//             }

// 			this.m_pBuild = new egret.Bitmap(RES.getRes(url));

// 			this.width = this.m_pBuild.width;
// 			this.height = this.m_pBuild.height;

// 			this.x = config.posX;
//             this.y = config.posY;

// 			Utils.addChild(this, this.m_pBuild);
// 		}

// 		/**添加建筑名字 */
// 		private add_build_name() {

// 			let self = this;

// 			let config = self.m_pBuildConfig;

// 			let terrain = config.terrain;//名字前面图标   2就不显示图标
// 			let build = self.m_pBuild;

// 			let bg = new egret.Bitmap(RES.getRes('map_build_icon-nameBJ_png'));
// 			bg.anchorOffsetY = bg.height / 2;
// 			bg.anchorOffsetX = bg.width / 2;
// 			bg.x = build.width / 2 + 10;
// 			bg.y = build.height + bg.height / 2;
// 			Utils.addChildAt(self, bg, 3);

// 			self.m_pBuild_name = new egret.Bitmap(RES.getRes('font_build_' + config.id + '_png'));
// 			self.m_pBuild_name.anchorOffsetX = self.m_pBuild_name.width / 2;
// 			self.m_pBuild_name.anchorOffsetY = self.m_pBuild_name.height / 2;
// 			self.m_pBuild_name.x = bg.x;
// 			self.m_pBuild_name.y = bg.y;

// 			self.m_pBuild_name.scaleX = 0.7;
// 			self.m_pBuild_name.scaleY = 0.7;
// 			Utils.addChildAt(self, self.m_pBuild_name, 4);

// 			if (terrain != 2 && terrain > 0) {
// 				let texture = RES.getRes('map_build_icon_' + terrain + '_png');
// 				if (texture) {
// 					self.m_pBuild_name_icon = new egret.Bitmap(texture);
// 					self.m_pBuild_name_icon.anchorOffsetX = self.m_pBuild_name_icon.width;
// 					self.m_pBuild_name_icon.anchorOffsetY = self.m_pBuild_name_icon.height / 2;
// 					self.m_pBuild_name_icon.x = self.m_pBuild_name.x - self.m_pBuild_name.width / 2 - 2;
// 					self.m_pBuild_name_icon.y = bg.y;

// 					Utils.addChildAt(self, self.m_pBuild_name_icon, 4);
// 				}
// 			}
// 		}

// 		/**添加建筑名字 */
// 		private add_build_name_s() {

// 			let self = this;

// 			let config = self.m_pBuildConfig;

// 			let terrain = config.terrain;//名字前面图标   2就不显示图标
// 			let build = self.m_pBuild;

// 			let bg = new egret.Bitmap(RES.getRes('map_build_icon-nameBJ_png'));
// 			bg.width = 125;
// 			bg.height = 30;
// 			bg.anchorOffsetY = bg.height / 2;
// 			bg.anchorOffsetX = bg.width / 2;
// 			bg.x = build.width / 2 + 10;
// 			bg.y = build.height + bg.height / 2;
// 			Utils.addChildAt(self, bg, 3);

// 			let build_name = new eui.Label();
// 			build_name.size = 21;
// 			build_name.textColor = 0xFFFDDD;
// 			build_name.fontFamily = 'SimHei';
// 			build_name.text = GLan(config.name);
// 			build_name.anchorOffsetX = build_name.width / 2;
// 			build_name.anchorOffsetY = build_name.height / 2;
// 			build_name.x = bg.x;
// 			build_name.y = bg.y;

// 			build_name.scaleX = 0.7;
// 			build_name.scaleY = 0.7;

// 			self.m_pBuild_name = build_name;
// 			Utils.addChildAt(self, self.m_pBuild_name, 4);
// 		}

// 		/**
// 		 * 检测是否点中建筑
// 		 * 如果没点中，返回0
// 		 * 点中则返回建筑id
// 		 */
// 		public check_is_touch(x: number, y: number): number {

// 			if (this.m_pIsGray)
// 				return 0;

// 			var build_id = 0;
// 			var self = this;

// 			let events = this.m_pWorldEvents;
// 			for (var key in events) {
// 				if (events.hasOwnProperty(key)) {
// 					// var data = events[key];
// 					// let icon: MapIcon = data.icon;
// 					// let type = +key;

// 					// if (icon.check_is_touch(x, y)) {

// 					// 	this.onIconTouch(icon);

// 					// 	return 0;
// 					// }
// 				}
// 			}

// 			if (self.m_pBuild.hitTestPoint(x, y, true)) {
// 				build_id = this.m_pID;

// 				NoviceMapModel.m_pLastSelectBID = this.m_pID;

// 			//	Guide.touchCall(GuideTargetType.NoviceBuild);

// 				Utils.open_view(TASK_UI.POP_NOVICE_BUILD_INFO, this.m_pBuildConfig);
// 			}

// 			return build_id;
// 		}

// 		// private onIconTouch(icon: MapIcon) {
// 		// 	let type = icon.m_pType;

// 		// 	debug('点中世界事件：', type);

// 		// 	switch (type) {
// 		// 		case WorldEvent.REPAIR_BUILD://修城1
// 		// 		case WorldEvent.FIELD://,屯田_2
// 		// 		case WorldEvent.MINE://,矿山_3
// 		// 		case WorldEvent.STUDY://,进修_4
// 		// 		case WorldEvent.CONSCRIPTION://,募兵_5
// 		// 		case WorldEvent.AFFAIRS://,新军务_6
// 		// 		case WorldEvent.CRAFTSMAN://,招募工匠_7
// 		// 		case WorldEvent.SELL_FOOD://,卖粮_8
// 		// 		case WorldEvent.SENIOR_STUDY://,高级进修_9
// 		// 		case WorldEvent.BUY_GIFTS://,购买礼物 _10
// 		// 		case WorldEvent.BANDIT://,山贼_11
// 		// 		case WorldEvent.WATER_THIEF://,水贼_12
// 		// 		case WorldEvent.MOUNTED_BRIGANDS://,马贼_13
// 		// 		case WorldEvent.REBEL_FORCES://,叛军_14
// 		// 		case WorldEvent.BURN_CAMP://,烧营_15
// 		// 		case WorldEvent.BARRACKS://,兵营_16
// 		// 		case WorldEvent.FLEET: {//,车队_17

// 		// 			if (icon.gray) {
// 		// 				console.log(GLan(500078));
// 		// 				// EffectUtils.showTips(GLan(500078), 5, true);
// 		// 				EffectUtils.showTips('同时最多只能处理2个世界事件', 5, true);
// 		// 				return;
// 		// 			}

// 		// 			let data = icon.data;

// 		// 			if (icon.isSuccess) {
// 		// 				NoviceMapProxy.send_CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD(data.index);
// 		// 			} else {
// 		// 				if (data) {
// 		// 					MapEventConfirm.m_pLastSelectEventIcon = icon;
// 		// 					Utils.open_view(TASK_UI.POP_MAP_EVENT_CONFIRM, data);
// 		// 				}
// 		// 			}
// 		// 			break;
// 		// 		}
// 		// 	}
// 		// }

// 		/**
// 		 * 刷新旗帜 
// 		 * 1：魏国 蓝
// 		 * 2：蜀国 红
// 		 * 3：吴国 绿
// 		 * */
// 		private refresh_flag() {
// 			if (RoleData.countryId == 0) return;

// 			let config = this.m_pBuildConfig;

// 			let icon = config.type;
// 			let country = RoleData.countryId;
// 			let flagType = country == 1 ? IETypes.EBuild_Flag_Blue : (country == 2 ? IETypes.EBuild_Flag_Red : IETypes.EBuild_Flag_Green);

// 			if (flagType == this.m_pFlagType)
// 				return;

// 			if (this.m_pFlagType != '') {
// 				/**移除旗帜 */
// 				EffectData.removeEffect(EffectData.WORLD_MAP, this.m_pFlagType, this.m_pFlag);
// 				this.m_pFlag.texture = null;
// 			}

// 			this.m_pFlagType = flagType;

// 			EffectData.addEffect(EffectData.WORLD_MAP, flagType, this.m_pFlag);

// 			if (!this.m_pFlag.$parent) {
// 				let x = icon == 3 ? 40 : (icon == 2 ? 60 : 95);
// 				let y = icon == 3 ? -120 : (icon == 2 ? -120 : -115);

// 				this.m_pFlag.x = x;
// 				this.m_pFlag.y = y;

// 				Utils.addChildAt(this, this.m_pFlag, 5)
// 			}

// 		}

// 		/**显示建筑状态 */
// 		public show_effect() {
// 			let cfg = this.m_pBuildConfig;
// 			let type = parseInt(cfg.Status);
// 			let gid = parseInt(cfg.guideId);
		
// 			let icon = cfg.type;

// 			var is_can_add: boolean = true;

// 			var x: number = 0;
// 			var y: number = 0;
// 			var show_type: string = '';

// 			if (RoleData.countryId > 0) {
// 				type = BuildEffectType.ATTACK;
// 				if (cfg.country == RoleData.countryId)
// 					type = BuildEffectType.NONE;
// 			}

// 			switch (type) {
// 				case BuildEffectType.NONE://没状态
// 				case BuildEffectType.ORTHER_ATTACK://（敌国建筑）敌方开战状态（另外2国的战斗）
// 				case BuildEffectType.NOT_TO_ATTACK://（敌国建筑）我国不可攻打
// 				case BuildEffectType.CAN_ATTACK://（敌国建筑）除国家任务外我国可攻打
// 					{
// 						is_can_add = false;

// 						break;
// 					}
// 				case BuildEffectType.BuildING: {//重建状态：buildCD>当前时间
// 					is_can_add = false;
// 					break;
// 				}
// 				case BuildEffectType.ATTACK: {//（敌国建筑-显示攻击图标）国家任务攻击状态
// 					show_type = IETypes.EBuild_Attack;

// 					x = icon == 3 ? 30 : (icon == 2 ? 50 : 80);
// 					y = icon == 3 ? -35 : (icon == 2 ? -28 : -12);

// 					break;
// 				}
// 				case BuildEffectType.DEFEND: {//（我国建筑-显示防守图标）国家任务防守状态

// 					show_type = IETypes.EBuild_Defend;

// 					x = icon == 3 ? 10 : (icon == 2 ? 30 : 60);
// 					y = icon == 3 ? -135 : (icon == 2 ? -130 : -110);
// 					break;
// 				}
// 				case BuildEffectType.BE_ATTACK: {//（我国建筑-显示摧毁图标）除国家任务外我方被攻击状态

// 					show_type = IETypes.EBuild_BeAttack;

// 					x = icon == 3 ? -48 : (icon == 2 ? -30 : -2);
// 					y = icon == 3 ? -55 : (icon == 2 ? -44 : -25);

// 					break;
// 				}
// 				case BuildEffectType.Raid: {//（我国建筑-显示摧毁图标）除国家任务外我方被攻击状态

// 					show_type = IETypes.EBuild_Raid;

// 					x = icon == 3 ? 54 : (icon == 2 ? 75 : 110);
// 					y = icon == 3 ? -5 : (icon == 2 ? 0 : 17);

// 					break;
// 				}
// 				default: {
// 					is_can_add = false;
// 					return;
// 				}
// 			}
// 			// debug("show_effect:", is_can_add, type);

// 			if (is_can_add) {

// 				this.m_pBuild_effect = new egret.Bitmap();
// 				this.m_pBuild_effect.x = x;
// 				this.m_pBuild_effect.y = y;

// 				EffectData.addEffect(EffectData.WORLD_MAP, show_type, this.m_pBuild_effect);

// 				this.m_pBuildEffectType = show_type;


// 				Utils.addChild(this, this.m_pBuild_effect);
// 			}
// 		}

// 		public time_call() {

// 			let count_downs = this.m_pCountDowns;

// 			let removeKey = [];

// 			for (let key in count_downs) {
// 				if (count_downs.hasOwnProperty(key)) {
// 					let data = count_downs[key];
// 					let pro: CCProgress = data.pro;

// 					let time = TimerUtils.getServerTimeMill();
// 					let start_time = data.start;
// 					let end_time = data.end;

// 					if (pro) {
// 						let now = time - start_time;
// 						let all = end_time - start_time;
// 						let sub = (end_time - time) / 1000;

// 						let per = parseInt((now / all * 100) + '');

// 						pro.value = per;
// 					}


// 					if (time >= end_time) {
// 						removeKey.push(key);
// 					}
// 				}
// 			}

// 			for (let index in removeKey) {
// 				if (removeKey.hasOwnProperty(index)) {
// 					var key = removeKey[index];

// 					this.time_success(key);
// 					// this.removeWorldEvent(key);
// 				}
// 			}

// 		}

// 		private time_success(index) {
// 			// this.removeCountDown(index);
// 			// let evt = this.m_pWorldEvents[index];
// 			// if (evt) {
// 			// 	let icon: MapIcon = evt.icon;
// 			// 	if (icon)
// 			// 		icon.success();
// 			// }
// 		}



// 		/**刷新世界事件图标 */
// 		public refreshWorldEvents() {
// 			// let events = NoviceMapModel.getWorldEvents(this.m_pID);
// 			// let len = this.m_pWorldEventsNum;
// 			// let events_len = events.length;

// 			// let removeType = [];
// 			// if (events_len > len && len < 4) {
// 			// 	for (let i = len; i < events_len; i++) {

// 			// 		let data = events[i];
// 			// 		let type = data.type;
// 			// 		let worldEventType = data.worldEventType;
// 			// 		let index = data.index;

// 			// 		if (worldEventType == WorldEventType.GOVERNMENT_AFFAIRS) {
// 			// 			console.log(data);
// 			// 		}

// 			// 		var start = data.startTime;
// 			// 		var end = data.endTime;
// 			// 		var pro: CCProgress = null;
// 			// 		var icon: MapIcon = null;

// 			// 		if (start && start > 0 && start >= end && type == WorldEvent.WIN_REWARD) {
// 			// 			removeType.push(index);
// 			// 			continue;
// 			// 		}

// 			// 		let _success = false;

// 			// 		switch (type) {
// 			// 			case WorldEvent.WIN_REWARD: {//

// 			// 				icon = new MapIcon(type, WorldEventType.NONE);

// 			// 				if (icon) {

// 			// 					/**攻城奖励 */
// 			// 					pro = new CCProgress(ProgressTypes.PT_BUILD);

// 			// 					Utils.addChildAt(this, icon, 1);
// 			// 					Utils.addChildAt(this, pro, 2);
// 			// 				} else {
// 			// 					error('加载不到图片');
// 			// 					continue;
// 			// 				}

// 			// 				break;
// 			// 			}
// 			// 			default: {
// 			// 				icon = new MapIcon(type, worldEventType);

// 			// 				if (icon) {
// 			// 					icon.data = data;

// 			// 					Utils.addChildAt(this, icon, 1);

// 			// 					if (start) {
// 			// 						if (TimerUtils.getServerTimeMill() >= end) {
// 			// 							icon.success();
// 			// 							_success = true;
// 			// 							NoviceMapModel.addNowEventCount();
// 			// 						} else {
// 			// 							icon.isCanTouch = false;
// 			// 							pro = new CCProgress(ProgressTypes.PT_BUILD);

// 			// 							Utils.addChildAt(this, pro, 2);


// 			// 						}

// 			// 					}

// 			// 				}
// 			// 				break;
// 			// 			}
// 			// 		}

// 			// 		if (icon) {

// 			// 			if (start && !_success) {
// 			// 				this.addCountDown(index, this.createCountDownData(start, end, pro));

// 			// 				if (_success || type <= WorldEvent.FLEET)
// 			// 					NoviceMapModel.addNowEventCount();
// 			// 			}

// 			// 			this.m_pWorldEvents[index] = this.createWorldEventData(icon, pro);

// 			// 			this.m_pWorldEventsNum += 1;



// 			// 			if (this.m_pWorldEventsNum == 4)
// 			// 				break;
// 			// 		}
// 			// 	}

// 			// 	this.refreshWorldEventPos();

// 			// 	let build_id = this.m_pID;

// 			// 	for (var key in removeType) {
// 			// 		if (removeType.hasOwnProperty(key)) {
// 			// 			var index = removeType[key];
// 			// 			NoviceMapModel.removeWorldEvent(build_id, index);
// 			// 		}
// 			// 	}
// 			// }

// 		}

// 		private addCountDown(key: any, data: any) {
// 			this.m_pCountDowns[key] = data;
// 			this.m_pCountDownsNum += 1;

// 			if (this.m_pCountDownsNum == 1) {
// 				Utils.TimerManager.doTimer(1, 0, this.time_call, this);
// 			}
// 		}

// 		public addWorldEventCountDown(data: any) {

// 			if (data) {
// 				let index = data.index;

// 				let event = this.m_pWorldEvents[index];

// 				if (event) {
// 					let icon = event.icon;
// 					let pro = event.pro;
// 					if (!pro) {
// 						icon.isCanTouch = false;
// 						let pro = new CCProgress(ProgressTypes.PT_BUILD);
// 						event.pro = pro;
// 						Utils.addChild(this, pro);

// 						this.refreshWorldEventPos();

// 						this.addCountDown(index, this.createCountDownData(data.startTime, data.endTime, pro));

// 						// if (icon.type <= WorldEvent.FLEET)
// 						// 	NoviceMapModel.addNowEventCount();
// 					} else {
// 						this.modifyCountDownData(index, data.startTime, data.endTime);
// 					}
// 				}
// 			}
// 		}

// 		public removeWorldEvent(key: any, isClear: boolean = false) {
// 			let event = this.m_pWorldEvents[key];

// 			let flag = this.removeCountDown(key);

// 			if (event) {
// 				let pro = event.pro;
// 				let icon = event.icon;

// 				// if (icon.type <= WorldEvent.FLEET && (flag || icon.isSuccess))
// 				// 	NoviceMapModel.subNowEventCount();

// 				if (icon) {
// 					if (icon.onDestroy && typeof (icon.onDestroy) == 'function') {
// 						icon.onDestroy();
// 					}
// 					Utils.removeFromParent(icon);
// 				}

// 				// if (key == CBuild.WIN_REWARD_INDEX && !isClear)
// 				// 	NoviceMapModel.removeWorldEvent(this.m_pID, key);
// 				delete this.m_pWorldEvents[key];
// 				this.m_pWorldEventsNum -= 1;

// 				this.refreshWorldEventPos();
// 				// this.refreshWorldEvents();
// 			}

// 		}

// 		private removeCountDown(key: any): boolean {

// 			let data = this.m_pCountDowns[key];

// 			if (data) {

// 				let pro = data.pro;

// 				if (pro) {
// 					Utils.removeFromParent(pro);
// 				}

// 				delete this.m_pCountDowns[key];

// 				// if (key == CBuild.BUILD_CD) {
// 				// 	this.m_pInfo.have_cd = false;
// 				// 	Utils.isGray(false, this.m_pBuild);
// 				// 	this.refresh_flag();
// 				// }

// 				this.m_pCountDownsNum -= 1;

// 				if (this.m_pCountDownsNum == 0) {
// 					Utils.TimerManager.remove(this.time_call, this);
// 				}

// 				return true;
// 			}

// 			return false;
// 		}

// 		/**检测cd是否存在 */
// 		private checkCountDown(key: any) {
// 			return this.m_pCountDowns[key] ? true : false;
// 		}

// 		/**创建倒计时参数 */
// 		private createCountDownData(start: any, end: any, pro: CCProgress = null) {
// 			return {
// 				'start': start,
// 				'end': end,
// 				'pro': pro
// 			}
// 		}

// 		/**创建世界事件数据 */
// 		private createWorldEventData(icon: any, pro: CCProgress = null) {
// 			return {
// 				'icon': icon,
// 				'pro': pro
// 			};
// 		}

// 		/**修改倒计时时间 */
// 		private modifyCountDownData(key: any, start: any, end: any) {
// 			let data = this.m_pCountDowns[key];

// 			if (data) {
// 				data.start = start;
// 				data.end = end;
// 			}
// 		}

// 		private clearWorldEvents() {
// 			let count_downs = this.m_pWorldEvents;

// 			// this.removeCD();

// 			let removeKey = [];

// 			for (let key in count_downs) {
// 				if (count_downs.hasOwnProperty(key)) {
// 					removeKey.push(key);
// 				}
// 			}

// 			for (let index in removeKey) {
// 				if (removeKey.hasOwnProperty(index)) {
// 					var key = removeKey[index];
// 					this.removeWorldEvent(+key, true);
// 				}
// 			}

// 			this.m_pWorldEvents = null;
// 			this.m_pCountDowns = null;
// 		}

// 		/**
// 		 * 重置位置
// 		 * 
// 		 * 0：右下
// 		 * 1：左下
// 		 * 2：左上
// 		 * 3：右上
// 		 */
// 		private refreshWorldEventPos() {

// 			/**
// 			 * 1:首都
// 			 */
// 			let icon = this.m_pBuildConfig.type;
// 			let pos_data = {
// 				1: [
// 					[275, 155, 0.5, 0.5],
// 					[258, 41, 0, 1],
// 					[74, 44, 1, 1],
// 					[53, 157, 0.5, 0.5],
// 				],
// 				2: [
// 					[243, 131, 0.5, 0.5],
// 					[223, 26, 0, 1],
// 					[48, 22, 1, 1],
// 					[0, 131, 0.5, 0.5],
// 				],
// 				3: [
// 					[204, 111, 0.5, 0.5],
// 					[182, 18, 0, 1],
// 					[45, 21, 1, 1],
// 					[0, 111, 0.5, 0.5],
// 				],
// 			}

// 			let pos = pos_data[icon];

// 			if (pos) {
// 				let events = this.m_pWorldEvents;
// 				var index = 0;

// 				if (events[-1]) {
// 					this.setPos(events[-1], pos[index]);
// 					index += 1;
// 				}

// 				for (var key in events) {
// 					if (events.hasOwnProperty(key)) {
// 						var item = events[key];

// 						if (+key == -1) {
// 							continue;
// 						}

// 						let pro: CCProgress = item.pro;
// 						let icon = item.icon;
// 						let _pos_data = pos[index];


// 						icon.x = _pos_data[0];
// 						icon.y = _pos_data[1];

// 						icon.anchorOffsetX = icon.width * _pos_data[2];
// 						icon.anchorOffsetY = icon.height * _pos_data[3];

// 						if (pro) {

// 							let _subx = 0.5 - _pos_data[2];
// 							let _suby = 0 - _pos_data[3];

// 							pro.anchorOffsetX = pro.width / 2;
// 							pro.anchorOffsetY = pro.height;

// 							pro.x = icon.x + icon.width * _subx;
// 							pro.y = icon.y + icon.height * _suby + 20;
// 						}

// 						index += 1;
// 					}
// 				}
// 			} else {
// 				error('refreshWorldEventPos   没有坐标！！！！！！', this.m_pID);
// 			}
// 		}

// 		private setPos(data: any, pos: any) {
// 			var item = data;

// 			let pro: CCProgress = item.pro;
// 			let icon = item.icon;
// 			let _pos_data = pos;


// 			icon.x = _pos_data[0];
// 			icon.y = _pos_data[1];

// 			icon.anchorOffsetX = icon.width * _pos_data[2];
// 			icon.anchorOffsetY = icon.height * _pos_data[3];

// 			if (pro) {

// 				let _subx = 0.5 - _pos_data[2];
// 				let _suby = 0 - _pos_data[3];

// 				pro.anchorOffsetX = pro.width / 2;
// 				pro.anchorOffsetY = pro.height;

// 				pro.x = icon.x + icon.width * _subx;
// 				pro.y = icon.y + icon.height * _suby + 20;
// 			}
// 		}

// 		// public getWorldEvent(index: number): MapIcon {
// 		// 	let data = this.m_pWorldEvents[index];
// 		// 	if (data) {
// 		// 		let icon = data.icon;
// 		// 		if (icon)
// 		// 			return icon;
// 		// 	}
// 		// 	return null;
// 		// }

// 		/**刷新世界事件是否灰化 */
// 		public refreshEventIcon() {
// 			// let events = this.m_pWorldEvents;
// 			// let flag = NoviceMapModel.m_pNowEventCount >= 2;
// 			// for (var key in events) {
// 			// 	if (events.hasOwnProperty(key)) {
// 			// 		var data = events[key];
// 			// 		let icon: MapIcon = data.icon;
// 			// 		let type = icon.type;
// 			// 		let isCountDown = this.checkCountDown(key);
// 			// 		if (type >= WorldEvent.REPAIR_BUILD && type <= WorldEvent.FLEET) {
// 			// 			if (!icon.isSuccess && !isCountDown) {
// 			// 				icon.gray = flag;
// 			// 			}
// 			// 		} else {
// 			// 			icon.gray = false;
// 			// 		}
// 			// 	}
// 			// }
// 		}
// 	}
// }
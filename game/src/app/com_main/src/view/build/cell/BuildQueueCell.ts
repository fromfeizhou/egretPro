module com_main {
	export class BuildQueueCell extends CComponent {

		private buildId: number = -1;
		private m_pIcon: CImage;
		private m_pLbTime: CLabel;
		private m_pBarBg: CImage;
		private m_pBar: CImage;

		private m_isActive: boolean = false;
		private m_endTime: number;
		private m_startTime: number;

		private m_nIndex: number;
		private maxBarWidth: number = 0;
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/map/cell/build_queue_cell_skin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.maxBarWidth = this.m_pBar.width;
			this.m_pBar.width = 0;
			EventManager.addTouchScaleListener(this, this, this.onClickCel);
			EventMgr.addEvent(BuildEvent.BUILD_QUEUE_CHANGE, this.onBuildQueueChange, this);
		}

		public onDestroy(): void {
			EventMgr.removeEventByObject(BuildEvent.BUILD_QUEUE_CHANGE, this);
			this.clearTimeCallback();
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}

		//点击
		public onClickCel() {
			if (this.buildId != -1) {
				com_main.MainMap.moveToBuild(this.buildId,true)
				com_main.MainMap.showMoveSelectEffect(this.buildId)
			} else {
				MainMapModel.MoveToCanGradeUpBuild();
			}
		}

		//设置时间
		private setTimeStr() {
			if (this.m_pLbTime) {
				let buildVo: MainMapBuildVo = MainMapModel.getBuildInfo(this.buildId);
				if (buildVo) {
					let dateInfo = Utils.DateUtils.getCountdownInfo(buildVo.buildStartTime * 1000, buildVo.buildEndTime * 1000, buildVo.speedTime * 1000, false);
					this.m_pLbTime.text = dateInfo[1] + "";
					this.m_pBar.width = this.maxBarWidth * Number(dateInfo[0]);
				}

				// let curtime = TimerUtils.getServerTimeMill();
				// let time = this.m_endTime - curtime;
				// time = time<0? 0:time;
				// this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond1(Math.floor(time * 0.001));
				// //let rate = 
				// let allTime = this.m_endTime - this.m_startTime;
				// if(allTime==0){
				// 	this.m_pBar.width = 0;
				// }else{
				// 	let edTime = curtime - this.m_startTime;
				// 	let barWidth = this.m_pBarBg.width*(edTime)/allTime;
				// 	this.m_pBar.width = barWidth;
				// }
			} else {
				error("BuildQueueCelle is Error!!!!")
			}

		}

		private timeCallback() {
			if (!MainMapModel.isInBuilding(this.buildId)) {
				this.onInActive();
			} else {
				this.setTimeStr();
			}
		}
		//设置索引
		public set index(val: number) {
			this.m_nIndex = val;
			this.updateView();
		}
		//当队列改变
		private onBuildQueueChange(index: number) {
			if (this.m_nIndex == index) {
				this.updateView();
			}
		}
		//刷新界面
		private updateView() {
			let buildId = MainMapModel.getBuildIdByIndex(this.m_nIndex);
			if (buildId == -1) {
				this.onInActive();
			} else {
				this.setBuildId(buildId);
			}
		}
		//空闲state
		private onInActive() {
			this.clearTimeCallback();
			this.m_pBar.width = 0;
			this.currentState = "free";
			this.m_pLbTime.text = GCode(CLEnum.CITY_BD_IDEL);
			this.m_isActive = false;
			this.buildId = -1;
		}

		//激活state
		private setBuildId(id: number) {
			this.buildId = id;
			if (MainMapModel.isInBuilding(this.buildId)) {
				if (!this.m_isActive) {
					MainMapModel.addCall(this.timeCallback, this, this.buildId);
					this.m_isActive = true;
				}
				let info = MainMapModel.getBuildInfo(id);
				if (info) {
					this.m_endTime = info.buildEndTime;
					this.m_startTime = info.buildStartTime;
					this.setTimeStr();
				}
				this.currentState = "work";
			}
		}

		public getBuildId() {
			return this.buildId;
		}

		public getBuildLevel() {
			let buildVo: MainMapBuildVo = MainMapModel.getBuildInfo(this.buildId);
			if (buildVo) {
				return buildVo.level;
			}
			return 0;
		}

		public autoLevelUp() {
			let id = MainMapModel.getRecommedBuildId();
			if (id == -1) {
				return 0;
			}
			com_main.MainMap.moveToBuildAndOpen(id, true);
			return id;
		}

		//清除回调
		private clearTimeCallback() {
			MainMapModel.removeCall(this, this.buildId);
		}
	}
}
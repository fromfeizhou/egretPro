module com_main {
	export class CBulletMgr {

		private static g_instance = null;
		public static getIns(): CBulletMgr {
			CBulletMgr.g_instance = CBulletMgr.g_instance || new CBulletMgr();
			return CBulletMgr.g_instance;
		}

		private static FRAME_TIME_UPDATE: number = 1 / 30;
		private updateTime: number = 0;

		private m_pBulletConfig = null;

		private m_pEnableBulletList: Array<CBullet> = [];
		private m_pBulletList: Array<CBullet> = [];
		private m_timeOnEnterFrame: number = 0;
		private m_isStart: boolean = false;

		public constructor() {

		}

		public onDestroy() {
			this.m_isStart = false;
			// Utils.TimerManager.remove(this.onTick, this);

			let len = this.m_pBulletList.length;
			for (let i: number = 0; i < len; i++) {
				let bullet: CBullet = this.m_pBulletList[i];
				if (bullet) {
					Utils.removeFromParent(bullet);
					//要实现这里
					bullet.onDestroy();
				}
			}
			this.m_pBulletList = [];
			// this.m_pBulletList = null;

			len = this.m_pEnableBulletList.length;
			for (let i: number = 0; i < len; i++) {
				let bullet: CBullet = this.m_pEnableBulletList[i];
				if (bullet) {
					Utils.removeFromParent(bullet);
					//要实现这里
					bullet.onDestroy();
				}
			}
			this.m_pEnableBulletList = [];
			egret.stopTick(this.onTick, this);
		}

		public get bulletConfig(): any {
			if (this.m_pBulletConfig == null) {
				this.m_pBulletConfig = C["BulletConfig"]; //Utils.arrayToMap(C.BulletConfig, "id");
			}
			return this.m_pBulletConfig;
		}

		private onTick(time: number): boolean {
			let delta = time - this.updateTime;
			if(delta < 30) return ;
			this.updateTime = time;
			// let now = timeStamp;
			// let time = this.m_timeOnEnterFrame;
			// let pass = now - time;
			// let frameTime: number = CBulletMgr.FRAME_TIME_UPDATE;
			// let delta = pass * 0.001;
			// this.updateTime += delta;
			// this.m_timeOnEnterFrame = now;

			// let bullet_list =  this.m_pBulletList;

			// while (this.updateTime >= frameTime) {
			// 	for (let key in bullet_list) {
			// 		let bullet: CBullet = bullet_list[key];
			// 		if (bullet.getStart())
			// 			bullet.onTick(pass);
			// 	}
			// 	this.updateTime -= frameTime;
			// }

			// if(BattleModel.getIsStopPlay()){
			// 	return;
			// }

			// debug("test ---> fps : " + delta);
			let bullet_list = this.m_pBulletList;
			for (let key in bullet_list) {
				let bullet: CBullet = bullet_list[key];
				if (bullet && bullet.getStart()){
					bullet.onTick(delta);
				}
			}

			return false;
		}

		private addBullet(bullet: CBullet, index: number) {
			this.m_pBulletList[index] = bullet
			if (this.m_isStart == false) {
				this.m_isStart = true;
				this.updateTime = egret.getTimer();
				egret.startTick(this.onTick, this);
			}
		}

		public removeBullet(index: number) {
			let len = this.m_pBulletList.length;
			if (len > 0) {
				let bullet: CBullet = this.m_pBulletList[index];
				if(bullet){
					Utils.removeFromParent(bullet);
					this.m_pBulletList[index] = undefined;
				}
				
			}
			len = this.m_pBulletList.length;
			if (len <= 0) {
				this.m_isStart = false;
				egret.stopTick(this.onTick, this);
			}
		}

		public recycleBullet(bullet) {
			this.removeBullet(bullet.index);
			this.m_pEnableBulletList.push(bullet);
		}

		public getEnableBullet() {
			return this.m_pEnableBulletList.pop();
		}

		public getBullet(missileId?: number, configID?: number, data?: any, speed?: number): CBullet {
			// configID = configID || 1;
			// let len = this.m_pBulletList.length;
			// for (let i: number = 0; i < len; i++) {
			// 	let bullet: CBullet = this.m_pBulletList[i];
			// 	if (!bullet.parent) {
			// 		bullet.setIndex(i);
			// 		bullet.reset(configID, data, speed);
			// 		return bullet;
			// 	}
			// }
			// let bullet: CBullet = CBullet.create(configID, data, speed);
			// bullet.setIndex(this.m_pBulletList.length);
			// this.addBullet(bullet);
			// return bullet;

			configID = configID || 1;
			// let len = this.m_pBulletList.length;
			// for (let i: number = 0; i < len; i++) {
			// 	let bullet: CBullet = this.m_pBulletList[i];
			// 	if (bullet && bullet.missileId == missileId) {
			// 		return bullet;
			// 	}
			// }
			let bullet = this.getEnableBullet();
			if (bullet) {
				bullet.reset(missileId, configID, data, speed);
			} else {
				bullet = CBullet.create(missileId, configID, data, speed);
			}
			bullet.setIndex(this.m_pBulletList.length);
			this.addBullet(bullet, bullet.index);
			return bullet;
		}
	}
}
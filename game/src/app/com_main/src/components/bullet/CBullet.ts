module com_main {
	export class CBullet extends egret.DisplayObjectContainer implements IFObject {

		private m_timeOnEnterFrame: number = 0;

		private m_t: number = 0;
		private m_tPercent: number = 0;

		// /**
		//  * 服务端ID
		//  */
		// private m_missileId: number;

		/**
		 * 飞行总时间
		 */
		private m_totalTime: number = 0;
		/**
		 * 当前计时
		 */
		private m_curTime: number = 0;

		/**
		 * 目标点
		 */
		private m_pTargetPoint: egret.Point = new egret.Point();
		/**
		 * 出发点
		 */
		private m_pOriginPoint: egret.Point = new egret.Point();
		/**
		 * 拉扯点
		 */
		private m_pCurvePoint: egret.Point = new egret.Point();
		/**
		 * 两点距离
		 */
		private m_pDistance: number = 0;

		/**
		 * 管理类标记的index
		 */
		private m_index: number;

		/**
		 * 速度
		 */
		private m_speed: number = 2000;

		/**
		 * 击中特效ID
		 */
		private m_hitEffect: number;

		/**
		 * 击中音效
		 */
		private m_hitSound: number;


		/**
		 * 是否使用投石车轨迹
		 */
		private m_isCatapultTrack: number = 0;

		/**
		 * 是否自转
		 */
		private m_isAutoRatation: number = 0;


		private m_isStart: boolean = false;

		/**
		 * 用于设置拖动点,两点间距离的百分比,取值0-1
		 */
		protected m_disPercent: number = 1.2;

		/**
		 * 两点间夹角的偏离值,用于设置拖动点
		 */
		protected m_angleOffset: number = 0.4;

		/**
		 * 弹跳次数
		 */
		private m_bounceTime: number = 0;

		/**
		 * 当前已弹跳次数
		 */
		private m_curBounceTime: number = 0;

		/**
		 * 路径集
		 */
		private m_paths: Array<any> = [];

		/**
		 * 
		 */
		private m_skillVo: SkillAtkVo = null;

		/**
		 * 
		 */
		private m_isShowFinishEffect: boolean = true;

		/**
		 * 
		 */
		private m_pBullet: egret.Bitmap = Utils.DisplayUtils.createBitmap();

		/**
		 * 回归点
		 */
		private m_returnPos: egret.Point;

		/**
		 * 是否回到原点
		 */
		private m_isReturn: boolean = false;

		/**
		 * 是否显示完结特效
		 */
		// private m_isShowDoneEffect: boolean = true;

		// /**
		//  * 
		//  */
		// private m_pFinishCallback: Function;
		// /**
		//  * 
		//  */
		// private m_pFinishThisArgs: any;

		private m_tempTime: number;

		private m_data: any = null;
		/**
		 * 角度隔帧算一次
		 */
		public m_flame = 1;

		public set data(v) {
			this.m_data = v;
		}


		// public get missileId() {
		// 	return this.m_missileId;
		// }

		public get index() {
			return this.m_index;
		}

		public setIndex(index): void {
			this.m_index = index;
		}

		public set skillVo(vo) {
			this.m_skillVo = vo;
		}

		public set returnPos(pos) {
			this.m_returnPos = pos;
		}

		public get returnPos() {
			return this.m_returnPos;
		}

		public set isReturn(v) {
			this.m_isReturn = v;
		}

		public get isReturn() {
			return this.m_isReturn;
		}

		

		public static create(missileId?: number, configID?: number, data?: any, speed?: number): CBullet {
			var obj = new CBullet();
			obj.touchEnabled = false;
			obj.touchChildren = false;
			obj.data = data;
			obj.initWithConfig(missileId, configID, speed);
			return obj;
		}

		public constructor() {
			super();
			this.m_pBullet.touchEnabled = false;
			Utils.addChild(this, this.m_pBullet);
		}

		public init() {

		}

		public onDestroy() {
			if (this.m_pBullet) {
				Utils.removeFromParent(this.m_pBullet);
				this.m_pBullet = null;
			}
			this.m_skillVo = null;
			this.m_returnPos = null;
			// this.m_isShowDoneEffect = true;
		}

		public reset(missileId?: number, configID?: number, data?: any, speed?: number): void {
			this.m_t = 0;
			this.data = data;
			this.m_isShowFinishEffect = true;
			this.initWithConfig(missileId, configID, speed);
		}

		public initWithConfig(missileId?: number, configID?: number, speed?: number) {
			// this.m_missileId = missileId;
			var config = CBulletMgr.getIns().bulletConfig[configID];
			this.m_isCatapultTrack = config["isCatapultTrack"];
			this.m_pBullet.texture = RES.getRes(config["pic"]);
			this.m_speed = speed || config["speed"];
			this.m_disPercent = config["disPercent"];
			this.m_angleOffset = config["angleOffset"];
			this.m_hitEffect = config["effect"];
			this.m_hitSound = config["sound"];
			this.m_isAutoRatation = config["autoRotation"] || 0;
			// this.m_isShowDoneEffect = isShowDoneEffect;

			this.anchorOffsetX = this.width * 0.5;
			this.anchorOffsetY = this.height * 0.5;

		}


		// private onEnter(): void {
		// }

		// private onExit(): void {
		// }

		// public setFinishCallback(callback, thisArgs) {
		// 	this.m_pFinishCallback = callback;
		// 	this.m_pFinishThisArgs = thisArgs;
		// }

		public resetPath(target, origin, curve?): void {
			this.x = origin.x;
			this.y = origin.y;
			this.m_pTargetPoint = new egret.Point(target.x, target.y);
			this.m_pOriginPoint = new egret.Point(origin.x, origin.y);
			this.m_pDistance = egret.Point.distance(this.m_pTargetPoint, this.m_pOriginPoint);
			this.m_pCurvePoint = curve || this.getCurvePoint();
			// this.m_tPercent = (this.m_speed * (1 / 30) * 1000 * 100) / (this.m_pDistance / this.m_speed);//1 / ((this.m_pDistance / this.m_speed) / 1000 * 30); // //0.01 * this.m_speed / this.m_pDistance;

			let rotation = Math.atan2(this.m_pTargetPoint.x - this.x, this.m_pTargetPoint.y - this.y) * 180 / Math.PI;
			this.rotation = rotation;
			// console.log("this.rotation = "+this.rotation);

			this.m_t = 0;
			this.m_curTime = 0;
			// debug("test ---> bullet " + "index : " + this.m_index + " time : " + Math.floor(this.m_pDistance / this.m_speed) + "毫秒");
			this.m_totalTime = Math.floor(this.m_pDistance / this.m_speed);
			// error("this.m_totalTime : " + this.m_totalTime);
			// this.move();
		}

		public addPath(origin, target): void {
			let path = { origin: new egret.Point(origin.x, origin.y), target: new egret.Point(target.x, target.y) };
			this.m_paths.push(path);
		}

		public setCurvePoint(curve): void {
			this.m_pCurvePoint = curve;
		}

		public start(): void {
			if (this.m_isStart) return;
			let path = this.m_paths.shift();
			this.resetPath(path.target, path.origin);

			this.m_tempTime = egret.getTimer();
			this.m_isStart = true;
			this.onTick(1);

			if (!this.m_pDistance) this.finish();
		}

		public getStart(): boolean {
			return this.m_isStart;
		}

		public set speed(sp) {
			this.m_speed = sp;
		}

		/**
		 * 播放击中特效
		 */
		private playHitEffect() {
			if (!this.m_hitEffect) return;
			let effect: CEffect = CEffectFunc.addEffect(this.m_hitEffect); //CEffectMgr.getIns().getEffect(this.m_hitEffect);
			effect.x = this.x;
			effect.y = this.y;
			effect.play();
		}

		private move(): void {
			this.m_flame += 1;
			let lastX = this.x;
			let lastY = this.y;

			let diff = (1 - this.m_t);
			let diffSqr = Math.pow(diff, 2);
			let tSqr = Math.pow(this.m_t, 2);
			let curMult = 2 * this.m_t * diff;

			this.x = diffSqr * this.m_pOriginPoint.x + curMult * this.m_pCurvePoint.x + tSqr * this.m_pTargetPoint.x;
			this.y = diffSqr * this.m_pOriginPoint.y + curMult * this.m_pCurvePoint.y + tSqr * this.m_pTargetPoint.y;

			if(this.m_flame > 2){
				this.m_flame = 0;
				let dx = this.x - lastX;
				let dy = this.y - lastY;
				let rotation = Math.atan2(dy, dx) * 180 / Math.PI;

				if (this.m_isAutoRatation == 0)
					this.rotation = rotation;
			}
			// else
			// 	this.rotation = (this.rotation + 10) % 360;
			// console.log("this.rotation = "+this.rotation);
		}

		/**
		 * 出发点和目标的的角度
		 */
		private getAngle() {
			let dx = this.m_pTargetPoint.x - this.m_pOriginPoint.x;
			let dy = this.m_pTargetPoint.y - this.m_pOriginPoint.y;
			let dt = Math.atan2(dy, dx);
			let angle = dt * 180 / Math.PI + 90;
			// debug("angle : " + angle + " dt : " + dt);
			// var temp = Math.abs(angle % 180 - 90) / 90;
			// this.m_angleOffset = 1 - temp;
			// this.m_disPercent = 1 - temp * 0.5;
			if (this.m_isCatapultTrack == 1) {
				this.getCatapultSetting(angle);
				this.m_angleOffset = Math.abs(this.m_angleOffset);
			}
			else {
				this.m_angleOffset = Math.abs(this.m_angleOffset);
				if (this.m_angleOffset != 0)
					this.adjustBulletCurve(angle);
			}
			// this.m_angleOffset = Math.abs(this.m_angleOffset);
			if (angle >= 0 && angle <= 180) this.m_angleOffset = -this.m_angleOffset
			return dt + this.m_angleOffset;
		}

		/**调整子弹曲线
		 * 根据角度的不同调整
		 */
		private adjustBulletCurve(angle) {
			let upAngle = 0;
			let upOffset = 20;
			let upRightAngle = upAngle + upOffset;
			let upRightOffset = 60;
			let upLeftAngle = upAngle - upOffset;
			let upLeftOffset = 60;

			let bottomAngle = 180;
			let bottomOffset = 20;
			let bottomRightAngle = bottomAngle - bottomOffset;
			let bottomRighOffset = 60;
			let bottomLeftAngle = bottomAngle + bottomOffset;
			let bottomLeftOffset = 60;

			let rightUpAngle = upRightAngle + upRightOffset;
			let rightBottomAngle = bottomRightAngle - bottomRighOffset;

			let leftUpAngle = upLeftAngle - upLeftOffset;
			let leftBottomAngle = bottomLeftAngle + bottomLeftOffset;


			if ((angle >= upRightAngle && angle <= rightUpAngle) || (angle >= leftUpAngle && angle <= upLeftAngle)
				|| (angle >= bottomLeftAngle && angle <= leftBottomAngle) || (angle >= rightBottomAngle && angle <= bottomRightAngle)) {
				this.m_angleOffset = this.m_angleOffset - (this.m_angleOffset * 0.3);
				this.m_disPercent = this.m_disPercent - this.m_disPercent * 0.3;
			} else if ((angle < bottomLeftAngle && angle > bottomRightAngle) || (angle < upRightAngle && angle > upLeftAngle)) {
				this.m_angleOffset = 0.15;
				this.m_disPercent = 0.5;
			} else {

				let upperLimit = 300;
				let lowerLimit = 100;
				let limitDis = upperLimit - lowerLimit;
				if (this.m_pDistance < upperLimit) {
					let adjustPercent = this.m_pDistance / limitDis;
					if (adjustPercent < 0.3) adjustPercent = 0.3;
					this.m_angleOffset = this.m_angleOffset * adjustPercent;
					// this.m_disPercent = this.m_disPercent * adjustPercent;
					// if (this.m_pDistance < lowerLimit) {
					// 	this.m_angleOffset = 0;
					// 	this.m_disPercent = 0.5;
					// } else {
					// 	let adjustPercent = this.m_pDistance / limitDis;
					// 	if (adjustPercent < 0.3) adjustPercent = 0.3;
					// 	this.m_angleOffset = this.m_angleOffset * adjustPercent;
					// 	this.m_disPercent = this.m_disPercent * adjustPercent;
					// }
				}

			}


		}

		/**
		 * 使用投石车设定
		 */
		private getCatapultSetting(angle: number) {
			var absAngle = Math.abs(angle);
			var temp = Math.abs(absAngle % 180 - 90) / 90;
			this.m_angleOffset = 1 - temp;
			this.m_disPercent = 1 - temp * 0.5;
			if (angle >= 110 && angle <= 250) {
				this.m_disPercent = 0.5;
			}
			// debug("bullet---> temp : " + temp + " angle : " + angle);
			// debug("bullet---> disPercent : " + this.m_disPercent + " angleOffset : " + this.m_angleOffset);
			// if (absAngle <= 90 && absAngle >= 60) {
			// 	this.m_angleOffset = 1;
			// 	this.m_disPercent = 1;
			// } else {
			// 	this.m_angleOffset = 0.2;
			// 	this.m_disPercent = 0.5;
			// }
			// this.m_angleOffset = Math.abs(this.m_angleOffset);
			// if (angle >= 0 && angle <= 180) this.m_angleOffset = -this.m_angleOffset
		}

		public getCurvePoint() {
			var angle = this.getAngle();
			var dis = egret.Point.distance(this.m_pTargetPoint, this.m_pOriginPoint);
			var disPercent = dis * this.m_disPercent;
			var x = this.m_pOriginPoint.x + Math.cos(angle) * disPercent;
			var y = this.m_pOriginPoint.y + Math.sin(angle) * disPercent;
			return new egret.Point(x, y);
			// let midPos = new egret.Point();
			// midPos.x = this.m_pOriginPoint.x + ((this.m_pTargetPoint.x - this.m_pOriginPoint.x) * 0.5);
			// midPos.y = this.m_pOriginPoint.y + ((this.m_pTargetPoint.y - this.m_pOriginPoint.y) * 0.5);
			// let k1 = (this.m_pTargetPoint.y - this.m_pOriginPoint.y) / (this.m_pTargetPoint.x - this.m_pOriginPoint.x);
			// let k2 = -1 / k1;
			// let dx = ((this.m_pTargetPoint.x - this.m_pOriginPoint.x) / Math.abs(this.m_pTargetPoint.x - this.m_pOriginPoint.x));
			// let v = new egret.Point(1 * dx, -Math.abs(k2 * 1));
			// v.x *= 10;
			// v.y *= 10;
			// let pos = new egret.Point(midPos.x + v.x, midPos.y + v.y);
			// return pos;
		}


		private nextPath() {
			if (this.m_paths.length > 0) {
				this.m_isShowFinishEffect = true;
				let path = this.m_paths.shift();
				let origin = new egret.Point(this.x, this.y);
				this.resetPath(path.target, origin);
				return true;
			}
			if (this.m_returnPos && this.m_isReturn) {
				let origin = new egret.Point(this.x, this.y);
				this.resetPath(this.m_returnPos, origin);
				this.m_returnPos = null;
				return true;
			}
			return false;
		}

		// /**
		//  * 是否有下一次弹跳
		//  */
		// private isNextBounce() {
		// 	if (this.m_skillVo) {
		// 		let config = this.m_skillVo.getSkillConfig();
		// 		if (this.m_skillVo.catapultTimes >= config.missileCatapultNum || this.m_skillVo.catapultTimes == -1)
		// 			return false;
		// 		else
		// 			return true;
		// 	}
		// 	// error("this.m_skillVo : " + this.m_skillVo);
		// 	return false;
		// }

		private finish(): void {
			// debug("test ---> bullet " + "index : " + this.m_index + " finish : " + Math.floor(egret.getTimer() - this.m_tempTime) + "毫秒");
			this.m_isStart = false;
			//TODO
			//派发事件
			// CBulletMgr.getIns().removeBullet(this.m_index);
			// Utils.open_view(MapNav.BULLET_FINISH, this.m_data);

			// if (this.m_pFinishCallback && this.m_pFinishThisArgs) {
			// 	this.m_pFinishCallback.call(this.m_pFinishThisArgs);
			// 	this.m_pFinishCallback = null;
			// 	this.m_pFinishThisArgs = null;
			// }

			this.m_data = null;
			this.m_skillVo = null;
			this.m_returnPos = null;

			// this.playHitEffect();

			CBulletMgr.getIns().recycleBullet(this);
			// Utils.removeFromParent(this);
			// if (this.parent) this.parent.removeChild(this);
		}

		public onTick(delta: number): boolean {
			if (this.m_isStart) {
				this.m_curTime += delta;
				this.m_t = this.m_curTime / this.m_totalTime;
				// this.m_t += this.m_tPercent; //0.01 * this.m_speed / this.m_pDistance;
				if (this.m_t >= 1) {
					this.m_t = 1;
					if (this.m_isShowFinishEffect == true) {
						this.m_isShowFinishEffect = false;
						this.playHitEffect();
					}
					if (!this.nextPath() /*&& !this.isNextBounce()*/)
						this.finish();
				}
				this.move();
				// Utils.isInStage(this);
			}

			return false;
		}


	}
}
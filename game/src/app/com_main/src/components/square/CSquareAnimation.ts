module com_main {

	export class CSquareFrameAnim extends FrameAnim {

		/**延迟帧数 */
		private m_delayFrame: number = 0;
		/**延迟帧计数 */
		private m_delayCount: number = 0;

		public constructor(actionName?: string) {
			super();
			this.actionName = actionName;
		}

		public static createAnim(framesToHold: number = 3, actionName?: string, frameNumType: number = 0): CSquareFrameAnim {
			var action: CSquareFrameAnim = new CSquareFrameAnim(actionName);
			action.framesToHold = framesToHold;
			action.frameNumType = frameNumType;
			return action;
		}

		/**
		 * 重设延迟帧数
		 */
		public resetDelay(delay) {
			this.m_delayFrame = delay;
			this.m_delayCount = 0;
		}

		public nextFrame(successIsReset: boolean = true): void {
			// ++this.m_pNextFrameIndex;
			if (this.m_delayCount < this.m_delayFrame)
			{
				++this.m_delayCount;
			}else{
				++this.m_pNextFrameIndex;
			}
			// if (this.m_pNextFrameIndex >= this.framesToHold && this.m_delayCount >= this.m_delayFrame) {
			if (this.m_pNextFrameIndex >= this.framesToHold ) {
				this.m_pNextFrameIndex = 0;
				if (this.m_bIsReverse) {
					--this.m_pFrameIndex;
					this.isFrameFinished = this.m_pFrameIndex < 0;
					if (this.isFrameFinished) {
						if (successIsReset)
							this.m_pFrameIndex = this.m_pNumFrames - 1;
						else
							this.m_pFrameIndex = 0;
					}
				} else {
					++this.m_pFrameIndex;

					this.isFrameFinished = this.m_pFrameIndex >= this.numFrames;
					if (this.isFrameFinished) {
						if (successIsReset)
							this.m_pFrameIndex = 0;
						else
							this.m_pFrameIndex = this.m_pNumFrames - 1;
					}
				}
			}
		}
	}


	export class CSquareAnimation extends SpriteAnimation {

		private m_actionName = "";

		private m_pSpriteList: Array<egret.Bitmap> = null;
		private m_pActionList: Array<Object> = [];

		private m_pFrameAnimList: Array<FrameAnim> = [];

		private m_pFrameAnims: Array<CSquareFrameAnim> = [];
		private m_pSinglePlayFrameAnims: Array<CSquareFrameAnim> = [];
		private m_numFrameAnims: number = 0;

		protected m_pIsOneShoot: boolean = false;

		private m_fps: number = 0;

		private m_lastFrameIndex: number = 0;
		private m_keyFrameIndex: number;

		private m_pKeyCallback: any = null;
		private m_pKeyCallObject: any = null;

		private m_data: any = {};

		public static create(targetList: Array<egret.Bitmap>, actionName?: string, framesToHold: number = 3, frameNumType: number = 0): CSquareAnimation {
			var obj = new CSquareAnimation(targetList, actionName, framesToHold, frameNumType);
			obj.spriteList = targetList;
			return obj;
		}

		public constructor(targetList: Array<egret.Bitmap>, actionName?: string, framesToHold: number = 3, frameNumType: number = 0) {
			super(null, actionName, framesToHold, frameNumType);
			this.m_actionName = actionName;
		}

		public initFrameAnims(actionName?: string, framesToHold: number = 3, frameNumType: number = 0) {
			for (let i: number = 0; i < this.m_numFrameAnims; i++) {
				let frameAnim = this.m_pFrameAnims[i];
				if (!frameAnim) {
					frameAnim = CSquareFrameAnim.createAnim(framesToHold, actionName, frameNumType);
					frameAnim.animations = this.anim.animations;
					this.m_pFrameAnims[i] = frameAnim;
				}
			}
		}

		public set spriteList(targetList: Array<egret.Bitmap>) {
			this.m_pSpriteList = targetList;
			this.m_numFrameAnims = this.m_pSpriteList.length;
			this.initFrameAnims(this.m_actionName);
		}

		public setSpriteList(targetList: Array<egret.Bitmap>, actionName?: string) {
			if (actionName) this.m_actionName = actionName;
			this.spriteList = targetList;
		}

		public setAnimation(anims: any) {
			try {
				for (let i: number = 0; i < this.m_numFrameAnims; i++) {
					let frameAnim = this.m_pFrameAnims[i];
					frameAnim.animations = anims;
					frameAnim.resetAction();
				}
			} catch (e) {
				error(e);
			}
			this.m_pLoaded = true;
			this.isLife = true;
		}

		public setFps(fps, index?: number) {
			let trans = Math.ceil((1 / fps) / (1 / 30));
			if (index != null && index != undefined) {
				let frameAnim = this.m_pFrameAnims[index];
				if (frameAnim)
					frameAnim.framesToHold = trans;
			} else {
				this.m_fps = trans;
				for (let i: number = 0; i < this.m_numFrameAnims; i++) {
					let frameAnim = this.m_pFrameAnims[i];
					if (frameAnim)
						frameAnim.framesToHold = trans;
				}
			}
		}

		public getFps(index?: number) {
			if (index != null && index != undefined) { }
			return this.m_fps;
		}

		public runActionByName(actionName?: string, index?: number,
			isOneShoot: boolean = false, callback?: Function, thisArg?: any,
			keyFrame?: number, keyCallback?: Function, keyCallObject?: any,
			data?: any,status?: CSquare_Status): void {

			if (index != null && index != undefined && status == CSquare_Status.STATUS_DEAD) {
				this.m_pActionList[index] = { "isOneShoot": isOneShoot, "callback": callback, "thisArg": thisArg };
			} else {
				this.m_pIsOneShoot = isOneShoot;
				this.m_pCallback = callback;
				this.m_pThisArg = thisArg;
			}

			this.m_keyFrameIndex = keyFrame;
			this.m_pKeyCallback = keyCallback;
			this.m_pKeyCallObject = keyCallObject;

			this.m_data = data;

			if (actionName) {
				this.m_pIsStart = true;
				if (this.m_pLoaded) {
					if (index != null && index != undefined) {
						let frameAnim = this.m_pFrameAnims[index];
						if(frameAnim){
							frameAnim.actionName = actionName;
							frameAnim.isFrameFinished = false;
							frameAnim.resetFrameIndex();
							frameAnim.resetAction();
							frameAnim.isPlay = true;

							if(status == CSquare_Status.STATUS_DEAD){
								//单独播放处理,放到独立播放列表
								this.m_pSinglePlayFrameAnims[index] = frameAnim;
								this.m_pFrameAnims[index] = null;
							}
						}
						
						
						// console.log("Single Single Single",actionName);

					} else {
						for (let i: number = 0; i < this.m_numFrameAnims; i++) {
							let frameAnim = this.m_pFrameAnims[i];
							if (frameAnim) {
								if(status == CSquare_Status.STATUS_ATTACK){
									frameAnim.resetDelay(i*3%15);
								}
								
								frameAnim.actionName = actionName;
								frameAnim.isFrameFinished = false;
								frameAnim.resetFrameIndex();
								frameAnim.resetAction();
								frameAnim.isPlay = true;
							}
						}
					}
					this.refreshFrame();
					this.isLife = true;
				}
			}
		}

		public cleanFrameAnimList() {
			for (var i: number = 0; i < this.m_pSinglePlayFrameAnims.length; i++) {
				var frameAnim = this.m_pSinglePlayFrameAnims[i];
				if (frameAnim) {
					frameAnim.clear();
					frameAnim = null;
				}
				delete this.m_pSinglePlayFrameAnims[i];
				this.m_pSinglePlayFrameAnims[i] = null;
			}
			this.m_pSinglePlayFrameAnims = [];
		}

		private cleanFrameAnim() {
			for (var i: number = 0; i < this.m_pFrameAnims.length; i++) {
				let frameAnim = this.m_pFrameAnims[i];
				if (frameAnim) {
					frameAnim.clear();
					frameAnim = null;
				}
			}
			this.m_pFrameAnims = [];
		}

		public removeAction(index?: number) {
			if (index != null && index != undefined) {
				var frameAnim = this.m_pSinglePlayFrameAnims[index];
				if (frameAnim) {
					frameAnim.clear();
					frameAnim = null;
				}
				delete this.m_pSinglePlayFrameAnims[index];
				this.m_pSinglePlayFrameAnims[index] = null;
				this.m_pActionList[index] = null;
				this.m_pSpriteList[index] = null;
			} else {
				super.removeAction();
				this.cleanFrameAnim();
				this.m_pActionList = [];
			}
			this.m_pKeyCallback = null;
			this.m_pKeyCallObject = null;
		}

		private nextFrameInFrameAnimList(): void {
			for (var i: number = 0; i < this.m_pSinglePlayFrameAnims.length; i++) {
				let frameAnim = this.m_pSinglePlayFrameAnims[i];
				if (frameAnim && frameAnim.isPlay) frameAnim.nextFrame(false);
			}
		}

		private nextFrame(oneShoot) {
			for (var i: number = 0; i < this.m_pFrameAnims.length; i++) {
				let frameAnim = this.m_pFrameAnims[i];
				if (frameAnim && frameAnim.isPlay) frameAnim.nextFrame(!oneShoot);
			}
		}

		private finishInFrameAnimList(): void {
			for (let i: number = 0; i < this.m_pSinglePlayFrameAnims.length; i++) {
				let frameAnim = this.m_pSinglePlayFrameAnims[i];
				let action = this.m_pActionList[i];
				if (frameAnim && frameAnim.isFrameFinished) {
					frameAnim.isPlay = false;
					if (action && action["isOneShoot"] && action["callback"]) {
						action["callback"].call(action["thisArg"]);
					}
				}
			}
		}

		private finish(): void {
			//第一个最后死,所以拿第一个作标准
			let frameAnim = this.m_pFrameAnims[0];
			let action = this.m_pActionList[0];
			if (frameAnim && frameAnim.isFrameFinished) {
				if (this.m_pIsOneShoot) {
					frameAnim.isPlay = false;
					this.stopAction();
					if (this.m_pCallback) {
						this.m_pCallback.call(this.m_pThisArg);
						this.m_pCallback = null;
						return;
					}
				}
			}
		}

		private refreshFrame(): void {
			// if (this.anim.nextFrameIndex == 0) {

			let len = this.m_pSpriteList.length;
			for (let i = 0; i < len; i++) {
				let sprite: egret.Bitmap = this.m_pSpriteList[i];
				if (sprite && sprite.parent) {
					let frameAnim: FrameAnim = this.m_pFrameAnims[i];
					if (frameAnim) {
						if (frameAnim.nextFrameIndex == 0 && frameAnim.isPlay)
							sprite.texture = frameAnim.getFrame2();
					} else {
						let singleFA = this.m_pSinglePlayFrameAnims[i];
						sprite.texture = singleFA.getFrame2();
					}
				}
			}

			// }

		}

		public onEnterFrame(): void {

			if (!this.isLife) return;
			// var lastTime = egret.getTimer();

			// if (this.anim.isPlay)
			// 	this.anim.nextFrame();
			this.nextFrame(this.m_pIsOneShoot);
			this.nextFrameInFrameAnimList();

			this.onKeyFrame();

			// if (this.anim.isFrameFinished) {
			// 	if (this.m_pIsOneShoot && this.anim.isPlay) {
			// 		this.anim.isPlay = false;
			// 		this.stopAction();
			// 		if (this.m_pCallback) {
			// 			this.m_pCallback.call(this.m_pThisArg);
			// 			// this.m_pCallback = null;
			// 			// this.m_pThisArg = null;
			// 			return;
			// 		}
			// 	}
			// }
			this.finishInFrameAnimList();
			this.finish();

			this.refreshFrame();

			// var passTime = egret.getTimer() - lastTime;
			// debug("animation refresh time : " + passTime);
		}


		/**
		 * 配置的关键帧回调
		 */
		private onKeyFrame(): void {
			// if (this.m_keyFrameIndex != null && this.m_keyFrameIndex != undefined
			// 	&& this.m_keyFrameIndex == this.anim.frameIndex
			// 	&& this.m_lastFrameIndex != this.anim.frameIndex) {
			// 	if (this.m_pKeyCallback) {
			// 		this.m_pKeyCallback.call(this.m_pKeyCallObject, this.anim.actionName, this.m_data);
			// 	}
			// }
			// this.m_lastFrameIndex = this.anim.frameIndex;

			//第一个是最后移除的,所以以它做标准
			let frameAnim = this.m_pFrameAnims[0];
			if (frameAnim) {
				if (this.m_keyFrameIndex != null && this.m_keyFrameIndex != undefined
					&& this.m_keyFrameIndex == frameAnim.frameIndex
					&& this.m_lastFrameIndex != frameAnim.frameIndex) {
					if (this.m_pKeyCallback) {
						this.m_pKeyCallback.call(this.m_pKeyCallObject, frameAnim.actionName, this.m_data);
					}
				}
				this.m_lastFrameIndex = frameAnim.frameIndex;
			}
		}

		private drawRect(width: number, height: number): any {
			var rt: egret.RenderTexture = new egret.RenderTexture();
			var shape = new egret.Shape();
			shape.graphics.clear();
			shape.graphics.beginFill(0xff0000, 0.5);
			shape.graphics.drawRect(0, 0, width, height);
			shape.graphics.endFill();
			rt.drawToTexture(shape);
			return rt;
		}

	}
}
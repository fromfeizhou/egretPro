module com_main {
	export class CEffect extends egret.DisplayObjectContainer implements IFObject {

		/**
		 * 
		 */
		private m_pBitmap: egret.Bitmap = null;

		/**
		 * 
		 */
		private m_pTxtList = [];

		/**
		 * 特效ID
		 */
		private m_effectID: number;

		/**
		 * 特效名
		 */
		private m_effectName: string;

		/**
		 * 特效字
		 */
		private m_effectFont: number;

		/**
		 * 特效文件名
		 */
		private m_effectFile: string;

		/**
		 * 是否重复播放
		 */
		private m_isRepeat: number;

		/**
		 * 特殊标识
		 */
		private m_spMark: number;

		/**
		 * 缓动动画
		 */
		private m_tween: number;

		/**
		 * 播放帧数
		 */
		private m_fps: number;

		/**
		 * 默认帧频
		 */
		private m_defaultFps: number = 12;

		/**
		 * 播放完回调
		 */
		private m_pFinishCallback: Function = null;
		/**
		 * 
		 */
		private m_pFinishThisArgs: any = null;

		/**
		 * 回调函数参数
		 */
		private m_pFinishArgs: any = null;

		/**
		 * 
		 */
		private m_pSpriteAnimates: SpriteAnimation = null;


		private m_textureSheet: any = {};

		/**
		 * 是否完成资源加载
		 */
		private m_isResLoadComplete: boolean = false;

		/**
		 * 是否开始播放
		 */
		private m_isStartToPlay: boolean = false;

		/**
		 * 待操作
		 */
		private m_todoOperation: any = {};

		/**
		 * 
		 */
		private m_isDestroy: boolean = false;


		private m_data: any;

		/**
		 * 关键帧
		 */
		private keyFrame:number;

		/**
		 * 缩放
		 */
		private m_scaleX:number;
		private m_scaleY:number;

		public static create(effectID?: number, data?: any): CEffect {
			let obj = new CEffect(effectID, data); //ObjectPool.pop("com_main.CEffect", effectID);
			return obj;
		}

		public constructor(effectID?: number, data?: any) {
			super();
			this.init(effectID, data);
		}

		public onDestroy() {

			this.m_isDestroy = true;

			this.m_pFinishCallback = null;
			this.m_pFinishThisArgs = null;
			this.m_pFinishArgs = null;

			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.removeAction();
				this.m_pSpriteAnimates = null;
			}

			if (this.m_pBitmap) {
				Utils.removeFromParent(this.m_pBitmap);
				this.m_pBitmap = null;
			}

			if (this.m_pTxtList) {
				for (let index in this.m_pTxtList) {
					let txt = this.m_pTxtList[index];
					Utils.removeFromParent(txt);
				}
				this.m_pTxtList = null;
			}
			// Utils.removeAllChild(this);
			Utils.removeFromParent(this);
			// ObjectPool.push(this);
		}

		public onCleanup() {
			this.reInitProperty();

			this.m_pFinishCallback = null;
			this.m_pFinishThisArgs = null;
			this.m_pFinishArgs = null;

			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.anim.framesToHold = this.fpsToHold(this.m_defaultFps);
				this.m_pSpriteAnimates.stopAction();
			}

			if (this.m_pBitmap) {
				this.m_pBitmap.scaleX = 1;
				this.m_pBitmap.scaleY = 1;
				this.m_pBitmap.alpha = 1;
				Utils.removeFromParent(this.m_pBitmap);
			}

			if (this.m_pTxtList) {
				for (let index in this.m_pTxtList) {
					let txt = this.m_pTxtList[index];
					// txt.x = 0;
					// txt.y = 0;
					// txt.scaleX = 1;
					// txt.scaleY = 1;
					// txt.alpha = 1;
					Utils.removeFromParent(txt);
				}
				this.m_pTxtList = [];
			}

			Utils.removeFromParent(this)
		}


		private reInitProperty() {
			this.visible = true;
			this.scaleX = 1;
			this.scaleY = 1;
			this.alpha = 1;
			this.m_isResLoadComplete = false;
			this.m_isStartToPlay = false;
			this.m_todoOperation = {};
		}

		public init(effectID?: number, data?: any): void {
			if (!effectID) return;

			this.m_scaleX = 1;
			this.m_scaleY = 1;

			this.m_isDestroy = false;
			this.m_effectID = effectID;
			this.m_data = data;

			this.rotation = 0;
			this.keyFrame = -1;

			if (!this.m_pBitmap) {
				this.m_pBitmap = new egret.Bitmap(); //Utils.DisplayUtils.createBitmap();
			}

			let config = CEffectMgr.getIns().effectConfig[this.m_effectID];
			if (config) {
				this.m_effectName = config["effectName"];
				this.m_effectFont = config["effectFont"];
				this.m_effectFile = config["effectFile"];
				this.m_isRepeat = config["isRepeat"];
				this.m_spMark = config["spMark"] || 0;
				this.m_tween = config["tween"] || 0;
				this.m_fps = config["fps"] || this.m_defaultFps;

				

				//设置锚点
				if(config){
					if(config.anchorOffsetX) this.anchorOffsetX = config.anchorOffsetX;
					if(config.anchorOffsetY) this.anchorOffsetY = config.anchorOffsetY;
				}

			} else {
				debug("effect---> can not find effect of id : " + this.m_effectID);
				this.m_effectName = "";
				this.m_effectFont = 0;
				this.m_effectFile = "";
				this.m_isRepeat = 0;
				this.m_spMark = 0;
				this.m_tween = 0;

				error("特效id 为空！！",effectID)
			}

			this.initConfig();
		}

		private initConfig() {
			let self = this;
			function onGetRes(sheets: egret.SpriteSheet, key: string) {
				if (this.m_isDestroy) return;
				let texture: egret.MapLike<egret.Texture> = sheets._textureMap;
				self.m_textureSheet = {};
				for (let name in texture) {
					self.m_textureSheet[name] = texture[name];
				}

				self.m_isResLoadComplete = true;

				if (!self.m_pBitmap.parent) Utils.addChild(self, self.m_pBitmap);

				try {
					let effectTexture: egret.Texture = self.getEffectTexture()[self.m_effectName + "_0"];
					if (effectTexture) {
						let config = CEffectMgr.getIns().effectConfig[this.m_effectID];
						let effectScale = config["scale"];

						self.m_pBitmap.texture = effectTexture;
						self.m_pBitmap.scaleX = effectScale;
						self.m_pBitmap.scaleY = effectScale;
						
						self.width = effectTexture.textureWidth * effectScale;
						self.height = effectTexture.textureHeight * effectScale;

						self.anchorOffsetX = self.width * 0.5;
						self.anchorOffsetY = self.height * 0.5;
						
						self.scaleX = this.m_scaleX;
						self.scaleY = this.m_scaleY;
						

						if (!self.m_pSpriteAnimates) {
							self.m_pSpriteAnimates = new SpriteAnimation(self.m_pBitmap);
							self.m_pSpriteAnimates.tempTag = true;
							// self.m_pSpriteAnimates.successIsReset = true;
						}
						self.m_pSpriteAnimates.anim.framesToHold = self.fpsToHold(this.m_fps);
						self.m_pSpriteAnimates.anim.actionName = self.m_effectName;
						self.m_pSpriteAnimates.isRepeat = false;
					}
				} catch (e) {
					error("缺少特效资源:", self.m_effectName, e);
				}

				self.setEffectCollection(self.getEffectTexture());
				if (self.m_isStartToPlay) {
					self.play(self.m_todoOperation.isRepeat, self.m_todoOperation.finishCallback, self.m_todoOperation.finishThisArgs,self.m_todoOperation.finishArgs);
				}
			}

			if (this.m_tween != 0) {
				this.m_isResLoadComplete = true;
				if (this.m_tween == 3) {
					// let lan = C["LanguageConfig"];
					let fontRes = RES.getRes("font_skill_1_fnt");
					if (this.m_data && this.m_data.faction) {
						if (this.m_data.faction == 2) fontRes = RES.getRes("font_skill_2_fnt");
						else if (this.m_data.faction == 3) fontRes = RES.getRes("font_skill_3_fnt");
					}
					let strList: String = GLan(Number(this.m_effectFont)); //lan[Number(this.m_effectName)]["name"]; //
					let len = strList.length;
					this.width = 0;
					this.height = 0;
					if (!this.m_pTxtList) this.m_pTxtList = [];
					for (let i: number = 0; i < len; i++) {
						let str = strList[i];
						let txt: egret.BitmapText = this.m_pTxtList[i]; //ObjectPool.pop("egret.BitmapText");
						if (!txt) {
							txt = new egret.BitmapText();
							this.m_pTxtList.push(txt);
						}
						// txt.letterSpacing = -20;
						txt.font = fontRes; //CResMgr.getIns().fontList[0];
						txt.text = str;
						txt.anchorOffsetX = txt.width * 0.5;
						txt.anchorOffsetY = txt.height * 0.5;
						txt.x = (txt.width * 1.1) * i + (txt.width * 0.5);
						Utils.addChild(this, txt);

						this.width = this.width + txt.width;
						this.height = txt.height;
					}
					this.anchorOffsetX = this.width * 0.5;
					this.anchorOffsetY = this.height * 0.5;
				} else {

					if (!this.m_pBitmap.parent)
						Utils.addChild(this, this.m_pBitmap);

					let effectTexture: egret.Texture = RES.getRes(this.m_effectName);
					if (effectTexture) {
						this.m_pBitmap.texture = effectTexture
						this.width = effectTexture.textureWidth;
						this.height = effectTexture.textureHeight;
						this.anchorOffsetX = this.width * 0.5;
						this.anchorOffsetY = this.height * 0.5;
					} else {
						error('Texture is null：', this.m_effectName);
					}

				}
			} else {
				let fileName = this.m_effectFile + "_json";
				if (RES.hasRes(fileName)) {
					// let data = RES.getRes(fileName);
					// if (data) {
					// 	onGetRes(data, fileName);
					// } else {
					// 	RES.getResAsync(fileName, onGetRes, this);
					// }
					RES.getResAsync(fileName, onGetRes, this);
				} else {
					// RES.getResByUrl(fileName, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
				}
			}
		}

		public setScale(scaleX,scaleY){
			this.m_scaleX = scaleX;
			this.m_scaleY = scaleY;
		}

		private getEffectTexture() {
			return this.m_textureSheet; //CEffectMgr.getIns().effectTexture[this.m_effectName + "_0"];
		}

		/**
		 * 
		 */
		private fpsToHold(fps): number {
			if (fps)
				return Math.ceil((1 / fps) / (1 / 30));
			return this.m_defaultFps;
		}

		/**
		 * 手动设置
		 */
		public manualSetting(actionName: string, anchorOffsetX?: any, anchorOffsetY?: any): void {
			this.m_isResLoadComplete = true;
			if (!this.m_pBitmap) {
				this.m_pBitmap = new egret.Bitmap();
			}
			if (!this.m_pBitmap.parent)
				Utils.addChild(this, this.m_pBitmap);
			
			//zb
			let aa :CEffectMgr = CEffectMgr.getIns();
			let bb = aa.effectTexture;
			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			let effectTexture: egret.Texture = bb[actionName + "_0"];
			this.m_pBitmap.texture = effectTexture;
			this.width = effectTexture.textureWidth;
			this.height = effectTexture.textureHeight;
			this.anchorOffsetX = anchorOffsetX || (this.width * 0.5);
			this.anchorOffsetY = anchorOffsetY || (this.height * 0.5);

			if (!this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates = new SpriteAnimation(this.m_pBitmap);
				this.m_pSpriteAnimates.tempTag = true;
			}
			this.m_pSpriteAnimates.anim.actionName = actionName;
			this.m_pSpriteAnimates.isRepeat = true;
		}

		public resetActionName(actionName: string): void {
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.anim.actionName = actionName;
			} else {
				debug("test---> 并不是帧动画!");
			}
		}

		public play(isRepeat?: boolean, finishCallback?: Function, finishThisArgs?: any,finishArgs?:any,keyFrame?:number): void {
			this.m_isStartToPlay = true;
			
			if (this.m_isResLoadComplete) {
				let self = this;
				this.m_pFinishCallback = finishCallback;
				this.m_pFinishThisArgs = finishThisArgs;
				this.m_pFinishArgs = finishArgs
				if (this.m_tween != 0) {
					let obj: any = this.m_pBitmap;
					if (this.m_tween == 3) {
						obj = this.m_pTxtList;
					}
					CEffectFunc.getTweenEffect(this.m_tween, obj, () => {
						// self.onDestroy();
						self.onCleanup();
					}, this);
				} else {
					if (isRepeat == null || isRepeat == undefined) {
						isRepeat = (this.m_isRepeat != 0);
					}
					let callback = null;
					let callbackObj = null;
					if (!isRepeat) {
						callback = () => {
							// self.onDestroy();
							if (this.m_pFinishCallback && this.m_pFinishThisArgs){
								this.m_pFinishCallback.call(this.m_pFinishThisArgs,this.m_pFinishArgs);

								this.m_pFinishCallback = null;
								this.m_pFinishThisArgs = null;
								this.m_pFinishArgs = null;
							}
								
							if(this.keyFrame >= 0){
								this.keyFrame = -1;
							}else{
								self.onCleanup();
							}
						};
						callbackObj = self;
					}

					if (this.m_pSpriteAnimates) {
						this.m_pSpriteAnimates.isRepeat = isRepeat;
						this.m_pSpriteAnimates.runAction(callback, callbackObj,true,this.keyFrame);
					}
				}
			} else {
				this.m_todoOperation.isRepeat = isRepeat;
				this.m_todoOperation.finishCallback = finishCallback;
				this.m_todoOperation.finishThisArgs = finishThisArgs;
				this.m_todoOperation.finishArgs = finishArgs;
				this.keyFrame = keyFrame;
			}

		}

		/**
		 * 暂停
		 * 仅非缓动动画特效的
		 */
		public pause(): void {
			if (this.m_isResLoadComplete && this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.stopAction();
			}
		}

		public playWithManualSetting(isRepeat: boolean = true): void {
			if (!this.m_isResLoadComplete) return;
			let self = this;
			let callback = null;
			let callbackObj = null;
			if (!isRepeat) {
				callback = () => {
					// self.onDestroy();
					self.onCleanup();
				};
				callbackObj = self;
			}
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.isRepeat = isRepeat;
				this.m_pSpriteAnimates.runAction(callback, callbackObj);
			}
		}

		/**
		 * 当前播放的帧序列
		 */
		public get currentFrameIndex(): number {
			if (this.m_pSpriteAnimates) return this.m_pSpriteAnimates.currentFrameIndex;
			return -1;
		}

		public get spMark() {
			return this.m_spMark;
		}

		public get repeat() {
			return this.m_isRepeat != 0;
		}

		public get tweenId() {
			return this.m_tween;
		}

		public setEffectCollection(textures: any) {
			if (this.m_pSpriteAnimates) {
				this.m_pSpriteAnimates.anim.animations = textures;
				this.m_pSpriteAnimates.anim.resetAction();
				this.m_pSpriteAnimates.m_pLoaded = true;
			}
		}

	}
}
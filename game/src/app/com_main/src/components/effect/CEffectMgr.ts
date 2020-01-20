module com_main {
	export class CEffectMgr {

		private static g_instance = null;
		public static getIns(): CEffectMgr {
			if (CEffectMgr.g_instance == null) {
				CEffectMgr.g_instance = new CEffectMgr();
			}
			return CEffectMgr.g_instance;
		}


		private m_pEffectTexture: any = {};

		private m_pNumComplete: number;
		private m_pLoaderNum: number;
		private m_pLoaderComplete: Function = null;
		private m_pLoaderCompleteThis: any = null;

		private m_pEffectConfig: any = null;

		private m_pEffectList: Array<CEffect> = [];

		public constructor() {

		}

		public onDestroy() {
			// ObjectPool.clearClass("com_main.CEffect");

			delete this.m_pEffectTexture;
			this.m_pEffectTexture = {};

			delete this.m_pEffectConfig;
			this.m_pEffectConfig = null;

			let len = this.m_pEffectList.length;
			for (let i: number = 0; i < len; i++) {
				let effect = this.m_pEffectList[i];
				effect.onDestroy();
			}
			this.m_pEffectList = [];
		}

		public get effectConfig(): any {
			if (this.m_pEffectConfig == null) {
				this.m_pEffectConfig = C.EffectConfig; //Utils.arrayToMap(C.EffectTestConfig, "id");
			}
			return this.m_pEffectConfig;
		}

		public get effectTexture(): any {
			return this.m_pEffectTexture;
		}

		public set effectTexture(tex) {
			this.m_pEffectTexture = tex;
		}

		public loadFile(files: any[], callback?: Function, callbackThis?: any): void {
			this.m_pNumComplete = 0;
			this.m_pLoaderNum = files.length;
			this.m_pLoaderComplete = callback;
			this.m_pLoaderCompleteThis = callbackThis;

			for (var i: number = 0; i < this.m_pLoaderNum; i++) {
				var url = files[i];
				RES.getResByUrl(url, this.onFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
			}
		}

		private onFileLoadComplete(sheets: egret.SpriteSheet): void {
			var texture: any = sheets._textureMap;
			for (var name in texture) {
				this.m_pEffectTexture[name] = texture[name];
			}
			this.m_pNumComplete++;
			if (this.m_pNumComplete == this.m_pLoaderNum) {
				if (this.m_pLoaderComplete) {
					if (this.m_pLoaderCompleteThis) {
						this.m_pLoaderComplete.call(this.m_pLoaderCompleteThis);
					}
					else {
						this.m_pLoaderComplete(sheets);
					}
					this.m_pLoaderComplete = null;
					this.m_pLoaderCompleteThis = null;
				}
			}
		}


		private getEnableEffect(effectID?: number, data?: any) {
			let len = this.m_pEffectList.length;
			for (let i: number = 0; i < len; i++) {
				let effect = this.m_pEffectList[i];
				if (effect && !effect.parent) {
					effect.init(effectID, data);
					return effect;
				}

			}
			return null;
		}

		public getEffect(effectID?: number, data?: any): CEffect {
			let effect: CEffect = this.getEnableEffect(effectID, data); //CEffect.create(effectID); //;
			if (!effect) {
				effect = CEffect.create(effectID, data);
				this.m_pEffectList.push(effect);
			}
			effect.setEffectCollection(this.m_pEffectTexture);
			return effect;
		}

	}
}
module com_main {
	export class CResMgr {

		private static g_instance = null;
		public static getIns(): CResMgr {
			if (CResMgr.g_instance == null) {
				CResMgr.g_instance = new CResMgr();
			}
			return CResMgr.g_instance;
		}

		private m_pNumComplete: number;
		private m_pLoaderNum: number;
		private m_pLoaderComplete: Function = null;
		private m_pLoaderCompleteThis: any = null;

		private m_texList: any = {};
		private m_fontList: any[] = [];
		private m_effectList: any = {};

		private m_isLoading: boolean = false;

		public get texList() {
			return this.m_texList;
		}

		public get effectList() {
			return this.m_effectList;
		}

		public get fontList() {
			return this.m_fontList;
		}

		public constructor() {
		}

		public onDestroy() {
			this.m_texList = [];
			this.m_fontList = [];
			this.m_effectList = [];
		}

		public loadFile(files: any[], fontFiles: any[], effectFiles: any[], callback?: Function, callbackThis?: any) {
			if (this.m_isLoading == true) return;
			let filesLen = files.length;
			let fontFilesLen = fontFiles.length;
			let effectFilesLen = effectFiles.length;
			this.m_pNumComplete = 0;
			this.m_pLoaderNum = filesLen + fontFilesLen + effectFilesLen;
			this.m_pLoaderComplete = callback;
			this.m_pLoaderCompleteThis = callbackThis;

			for (var i: number = 0; i < filesLen; i++) {
				var url = files[i];
				RES.getResByUrl(url, this.onFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
			}

			// for (var i: number = 0; i < fontFilesLen; i++) {
			// 	var url = fontFiles[i];
			// 	RES.getResByUrl(url, this.onFontFileLoadComplete, this, RES.ResourceItem.TYPE_FONT);
			// }

			for (var i: number = 0; i < effectFilesLen; i++) {
				var url = effectFiles[i];
				RES.getResByUrl(url, this.onEffectFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
			}
		}


		private allLoadComplete(): void {
			if (this.m_pNumComplete == this.m_pLoaderNum) {
				if (this.m_pLoaderComplete) {
					if (this.m_pLoaderCompleteThis) {
						this.m_pLoaderComplete.call(this.m_pLoaderCompleteThis);
					}
					this.m_pLoaderComplete = null;
					this.m_pLoaderCompleteThis = null;
				}
				this.m_isLoading = false;
			}
		}

		private onFileLoadComplete(sheets: egret.SpriteSheet): void {
			var texture: any = sheets._textureMap;
			for (var name in texture) {
				// this.m_pAnimTexture[name] = texture[name];
				this.m_texList[name] = texture[name];
			}
			this.m_pNumComplete++;
			this.allLoadComplete();
		}

		private onEffectFileLoadComplete(sheets: egret.SpriteSheet): void {
			var texture: any = sheets._textureMap;
			for (var name in texture) {
				// this.m_pAnimTexture[name] = texture[name];
				this.m_effectList[name] = texture[name];
			}
			this.m_pNumComplete++;
			this.allLoadComplete();
		}

		// private onFontFileLoadComplete(font: egret.BitmapFont): void {
		// 	this.m_fontList.push(font);
		// 	this.m_pNumComplete++;
		// 	this.allLoadComplete();
		// }


		public getTextureFromGroup(name: string) {
			//xzb
			let group:any = RES.getGroupByName(name);
			let list = {};
			for (let i: number = 0; i < group.length; i++) {
				let resItem = group[i];
				let texList1:string = resItem.data.subkeys;
				let texList = texList1.split(",");
				for (let j: number = 0; j < texList.length; j++) {
					let texName = texList[j];
					list[texName] = RES.getRes(texName);
				}
			}
			return list;
		}

	}
}
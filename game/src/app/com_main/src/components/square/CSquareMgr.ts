module com_main {
	export class CSquareMgr {

		private static g_instance = null;
		public static getIns(): CSquareMgr {
			if (CSquareMgr.g_instance == null) {
				CSquareMgr.g_instance = new CSquareMgr();
			}
			return CSquareMgr.g_instance;
		}


		private m_pSquareList: Array<CSquare> = [];

		private m_pAnimTexture: any = {};

		private m_pNumComplete: number;
		private m_pLoaderNum: number;
		private m_pLoaderComplete: Function = null;
		private m_pLoaderCompleteThis: any = null;

		private m_pAnimationAnchor: any = null;
		private m_pSquareConfig: any = null;
		private m_pModelConfig: any = null;


		// private m_exitCountdown: any = null;

		public constructor() {
		}

		public onDestroy() {
			// Utils.TimerManager.remove(this.exitCountdown, this);
			// ObjectPool.clearClass("com_main.CSquare");
			delete this.m_pAnimTexture;
			this.m_pAnimTexture = {};

			var len = this.m_pSquareList.length;
			for (var i: number = 0; i < len; i++) {
				let square = this.m_pSquareList[i];
				if(square.onDestroy){
					square.onDestroy();
				}
				Utils.removeFromParent(square);
			}
			// this.m_pSquareList = [];
		}

		public set animTexture(tex) {
			this.m_pAnimTexture = tex;
		}

		public get animTexture(): any {
			return this.m_pAnimTexture;
		}

		public get animAnchor(): any {
			if (this.m_pAnimationAnchor == null) {
				this.m_pAnimationAnchor = C.ArmyActionConfig;
			}
			return this.m_pAnimationAnchor;
		}

		public getAnimAnchor(actionName: string) {
			let data = this.m_pAnimationAnchor[actionName];
			if (data)
				return data;
			debug("%s is not exist in anchor config", actionName);
			return null;
		}

		// public get squareConfig(): any {
		// 	if (this.m_pSquareConfig == null) {
		// 		this.m_pSquareConfig = C.ArmyConfig;
		// 	}
		// 	return this.m_pSquareConfig;
		// }

		public get modelConfig(): any {
			if (this.m_pModelConfig == null) {
				this.m_pModelConfig = C.ArmyModelConfig;
			}
			return this.m_pModelConfig;
		}

		// public getEffectFlagConfig(id) {
		// 	return C.EffectBattleFlagConfig[id];
		// }

		/**
		 * 从对象池中获取方阵
		 * 没有空余的则新添加进去
		 */
		public getSquare(vo/*id: number, status?: CSquare_Status, direction?: CSquare_Direction*/): CSquare {
			// var square: CSquare = null;
			// var len = this.m_pSquareList.length;
			// for (var i: number = 0; i < len; i++) {
			// 	square = this.m_pSquareList[i];
			// 	if (!square.parent) {
			// 		square.resetSquare(id, status, direction);
			// 		return square;
			// 	}
			// }
			// square = CSquare.createId(id);
			// this.m_pSquareList.push(square);
			// return square;
			let square = this.getEnableSquare(vo);
			if (!square) {
				square = CSquare.create(vo);
				this.m_pSquareList.push(square);
			}
			return square;
		}

		private getEnableSquare(vo) {
			var len = this.m_pSquareList.length;
			for (var i: number = 0; i < len; i++) {
				let square = this.m_pSquareList[i];
				if (square && !square.parent) {
					square.init(vo);
					return square;
				}
			}
			return null;
		}


		private lenOfCollection(collection) {
			let num = 0
			for (let key in collection) {
				if (collection[key])
					num++;
			}
			return num;
		}

		// /**
		//  * 退出倒计时
		//  */
		// public setExitCountdown(playerId, countTime) {
		// 	if (!this.m_exitCountdown) {
		// 		this.m_exitCountdown = {};
		// 	}
		// 	this.m_exitCountdown[playerId] = countTime;
		// 	if (this.lenOfCollection(this.m_exitCountdown) > 0) {
		// 		Utils.TimerManager.remove(this.exitCountdown, this);
		// 		Utils.TimerManager.doTimer(1000, 0, this.exitCountdown, this);
		// 	}
		// }


		// private exitCountdown(delt) {
		// 	for (let id in this.m_exitCountdown) {
		// 		let playerId = Number(id);
		// 		this.m_exitCountdown[playerId] -= delt;
		// 		let time = this.m_exitCountdown[playerId];
		// 		if (time < 0) time = 0;
		// 		time = Math.ceil(time * 0.001);
		// 		let units: egret.DisplayObject[] = BattleSceneMgr.getInstance().getPlayerUnitsObj(playerId);
		// 		if (units) {
		// 			for (let key in units) {
		// 				if (units.hasOwnProperty(key)) {
		// 					let element = units[key] as CSquare;
		// 					if (element.setExitCountTime) element.setExitCountTime(time);
		// 					if (time <= 3) element.talk(GLan(500077));
		// 				}
		// 			}
		// 		}
		// 		if (this.m_exitCountdown[playerId] <= 0) {
		// 			this.m_exitCountdown[playerId] = null;
		// 		}
		// 	}
		// 	if (this.lenOfCollection(this.m_exitCountdown) <= 0) {
		// 		Utils.TimerManager.remove(this.exitCountdown, this);
		// 	}
		// }


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
				this.m_pAnimTexture[name] = texture[name];
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

	}
}
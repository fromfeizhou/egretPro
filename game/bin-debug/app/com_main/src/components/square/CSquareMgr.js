var com_main;
(function (com_main) {
    var CSquareMgr = /** @class */ (function () {
        // private m_exitCountdown: any = null;
        function CSquareMgr() {
            this.m_pSquareList = [];
            this.m_pAnimTexture = {};
            this.m_pLoaderComplete = null;
            this.m_pLoaderCompleteThis = null;
            this.m_pAnimationAnchor = null;
            this.m_pSquareConfig = null;
            this.m_pModelConfig = null;
        }
        CSquareMgr.getIns = function () {
            if (CSquareMgr.g_instance == null) {
                CSquareMgr.g_instance = new CSquareMgr();
            }
            return CSquareMgr.g_instance;
        };
        CSquareMgr.prototype.onDestroy = function () {
            // Utils.TimerManager.remove(this.exitCountdown, this);
            // ObjectPool.clearClass("com_main.CSquare");
            delete this.m_pAnimTexture;
            this.m_pAnimTexture = {};
            var len = this.m_pSquareList.length;
            for (var i = 0; i < len; i++) {
                var square = this.m_pSquareList[i];
                if (square.onDestroy) {
                    square.onDestroy();
                }
                Utils.removeFromParent(square);
            }
            // this.m_pSquareList = [];
        };
        Object.defineProperty(CSquareMgr.prototype, "animTexture", {
            get: function () {
                return this.m_pAnimTexture;
            },
            set: function (tex) {
                this.m_pAnimTexture = tex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSquareMgr.prototype, "animAnchor", {
            get: function () {
                if (this.m_pAnimationAnchor == null) {
                    this.m_pAnimationAnchor = C.ArmyActionConfig;
                }
                return this.m_pAnimationAnchor;
            },
            enumerable: true,
            configurable: true
        });
        CSquareMgr.prototype.getAnimAnchor = function (actionName) {
            var data = this.m_pAnimationAnchor[actionName];
            if (data)
                return data;
            debug("%s is not exist in anchor config", actionName);
            return null;
        };
        Object.defineProperty(CSquareMgr.prototype, "modelConfig", {
            // public get squareConfig(): any {
            // 	if (this.m_pSquareConfig == null) {
            // 		this.m_pSquareConfig = C.ArmyConfig;
            // 	}
            // 	return this.m_pSquareConfig;
            // }
            get: function () {
                if (this.m_pModelConfig == null) {
                    this.m_pModelConfig = C.ArmyModelConfig;
                }
                return this.m_pModelConfig;
            },
            enumerable: true,
            configurable: true
        });
        // public getEffectFlagConfig(id) {
        // 	return C.EffectBattleFlagConfig[id];
        // }
        /**
         * 从对象池中获取方阵
         * 没有空余的则新添加进去
         */
        CSquareMgr.prototype.getSquare = function (vo /*id: number, status?: CSquare_Status, direction?: CSquare_Direction*/) {
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
            var square = this.getEnableSquare(vo);
            if (!square) {
                square = com_main.CSquare.create(vo);
                this.m_pSquareList.push(square);
            }
            return square;
        };
        CSquareMgr.prototype.getEnableSquare = function (vo) {
            var len = this.m_pSquareList.length;
            for (var i = 0; i < len; i++) {
                var square = this.m_pSquareList[i];
                if (square && !square.parent) {
                    square.init(vo);
                    return square;
                }
            }
            return null;
        };
        CSquareMgr.prototype.lenOfCollection = function (collection) {
            var num = 0;
            for (var key in collection) {
                if (collection[key])
                    num++;
            }
            return num;
        };
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
        CSquareMgr.prototype.loadFile = function (files, callback, callbackThis) {
            this.m_pNumComplete = 0;
            this.m_pLoaderNum = files.length;
            this.m_pLoaderComplete = callback;
            this.m_pLoaderCompleteThis = callbackThis;
            for (var i = 0; i < this.m_pLoaderNum; i++) {
                var url = files[i];
                RES.getResByUrl(url, this.onFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
            }
        };
        CSquareMgr.prototype.onFileLoadComplete = function (sheets) {
            var texture = sheets._textureMap;
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
        };
        CSquareMgr.g_instance = null;
        return CSquareMgr;
    }());
    com_main.CSquareMgr = CSquareMgr;
})(com_main || (com_main = {}));

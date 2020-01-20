var com_main;
(function (com_main) {
    var CBulletMgr = /** @class */ (function () {
        function CBulletMgr() {
            this.updateTime = 0;
            this.m_pBulletConfig = null;
            this.m_pEnableBulletList = [];
            this.m_pBulletList = [];
            this.m_timeOnEnterFrame = 0;
            this.m_isStart = false;
        }
        CBulletMgr.getIns = function () {
            CBulletMgr.g_instance = CBulletMgr.g_instance || new CBulletMgr();
            return CBulletMgr.g_instance;
        };
        CBulletMgr.prototype.onDestroy = function () {
            this.m_isStart = false;
            // Utils.TimerManager.remove(this.onTick, this);
            var len = this.m_pBulletList.length;
            for (var i = 0; i < len; i++) {
                var bullet = this.m_pBulletList[i];
                if (bullet) {
                    Utils.removeFromParent(bullet);
                    //要实现这里
                    bullet.onDestroy();
                }
            }
            this.m_pBulletList = [];
            // this.m_pBulletList = null;
            len = this.m_pEnableBulletList.length;
            for (var i = 0; i < len; i++) {
                var bullet = this.m_pEnableBulletList[i];
                if (bullet) {
                    Utils.removeFromParent(bullet);
                    //要实现这里
                    bullet.onDestroy();
                }
            }
            this.m_pEnableBulletList = [];
            egret.stopTick(this.onTick, this);
        };
        Object.defineProperty(CBulletMgr.prototype, "bulletConfig", {
            get: function () {
                if (this.m_pBulletConfig == null) {
                    this.m_pBulletConfig = C["BulletConfig"]; //Utils.arrayToMap(C.BulletConfig, "id");
                }
                return this.m_pBulletConfig;
            },
            enumerable: true,
            configurable: true
        });
        CBulletMgr.prototype.onTick = function (time) {
            var delta = time - this.updateTime;
            if (delta < 30)
                return;
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
            var bullet_list = this.m_pBulletList;
            for (var key in bullet_list) {
                var bullet = bullet_list[key];
                if (bullet && bullet.getStart()) {
                    bullet.onTick(delta);
                }
            }
            return false;
        };
        CBulletMgr.prototype.addBullet = function (bullet, index) {
            this.m_pBulletList[index] = bullet;
            if (this.m_isStart == false) {
                this.m_isStart = true;
                this.updateTime = egret.getTimer();
                egret.startTick(this.onTick, this);
            }
        };
        CBulletMgr.prototype.removeBullet = function (index) {
            var len = this.m_pBulletList.length;
            if (len > 0) {
                var bullet = this.m_pBulletList[index];
                if (bullet) {
                    Utils.removeFromParent(bullet);
                    this.m_pBulletList[index] = undefined;
                }
            }
            len = this.m_pBulletList.length;
            if (len <= 0) {
                this.m_isStart = false;
                egret.stopTick(this.onTick, this);
            }
        };
        CBulletMgr.prototype.recycleBullet = function (bullet) {
            this.removeBullet(bullet.index);
            this.m_pEnableBulletList.push(bullet);
        };
        CBulletMgr.prototype.getEnableBullet = function () {
            return this.m_pEnableBulletList.pop();
        };
        CBulletMgr.prototype.getBullet = function (missileId, configID, data, speed) {
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
            var bullet = this.getEnableBullet();
            if (bullet) {
                bullet.reset(missileId, configID, data, speed);
            }
            else {
                bullet = com_main.CBullet.create(missileId, configID, data, speed);
            }
            bullet.setIndex(this.m_pBulletList.length);
            this.addBullet(bullet, bullet.index);
            return bullet;
        };
        CBulletMgr.g_instance = null;
        CBulletMgr.FRAME_TIME_UPDATE = 1 / 30;
        return CBulletMgr;
    }());
    com_main.CBulletMgr = CBulletMgr;
})(com_main || (com_main = {}));

var com_main;
(function (com_main) {
    var CEffectMgr = /** @class */ (function () {
        function CEffectMgr() {
            this.m_pEffectTexture = {};
            this.m_pLoaderComplete = null;
            this.m_pLoaderCompleteThis = null;
            this.m_pEffectConfig = null;
            this.m_pEffectList = [];
        }
        CEffectMgr.getIns = function () {
            if (CEffectMgr.g_instance == null) {
                CEffectMgr.g_instance = new CEffectMgr();
            }
            return CEffectMgr.g_instance;
        };
        CEffectMgr.prototype.onDestroy = function () {
            // ObjectPool.clearClass("com_main.CEffect");
            delete this.m_pEffectTexture;
            this.m_pEffectTexture = {};
            delete this.m_pEffectConfig;
            this.m_pEffectConfig = null;
            var len = this.m_pEffectList.length;
            for (var i = 0; i < len; i++) {
                var effect = this.m_pEffectList[i];
                effect.onDestroy();
            }
            this.m_pEffectList = [];
        };
        Object.defineProperty(CEffectMgr.prototype, "effectConfig", {
            get: function () {
                if (this.m_pEffectConfig == null) {
                    this.m_pEffectConfig = C.EffectConfig; //Utils.arrayToMap(C.EffectTestConfig, "id");
                }
                return this.m_pEffectConfig;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CEffectMgr.prototype, "effectTexture", {
            get: function () {
                return this.m_pEffectTexture;
            },
            set: function (tex) {
                this.m_pEffectTexture = tex;
            },
            enumerable: true,
            configurable: true
        });
        CEffectMgr.prototype.loadFile = function (files, callback, callbackThis) {
            this.m_pNumComplete = 0;
            this.m_pLoaderNum = files.length;
            this.m_pLoaderComplete = callback;
            this.m_pLoaderCompleteThis = callbackThis;
            for (var i = 0; i < this.m_pLoaderNum; i++) {
                var url = files[i];
                RES.getResByUrl(url, this.onFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
            }
        };
        CEffectMgr.prototype.onFileLoadComplete = function (sheets) {
            var texture = sheets._textureMap;
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
        };
        CEffectMgr.prototype.getEnableEffect = function (effectID, data) {
            var len = this.m_pEffectList.length;
            for (var i = 0; i < len; i++) {
                var effect = this.m_pEffectList[i];
                if (effect && !effect.parent) {
                    effect.init(effectID, data);
                    return effect;
                }
            }
            return null;
        };
        CEffectMgr.prototype.getEffect = function (effectID, data) {
            var effect = this.getEnableEffect(effectID, data); //CEffect.create(effectID); //;
            if (!effect) {
                effect = com_main.CEffect.create(effectID, data);
                this.m_pEffectList.push(effect);
            }
            effect.setEffectCollection(this.m_pEffectTexture);
            return effect;
        };
        CEffectMgr.g_instance = null;
        return CEffectMgr;
    }());
    com_main.CEffectMgr = CEffectMgr;
})(com_main || (com_main = {}));

var com_main;
(function (com_main) {
    var CResMgr = /** @class */ (function () {
        function CResMgr() {
            this.m_pLoaderComplete = null;
            this.m_pLoaderCompleteThis = null;
            this.m_texList = {};
            this.m_fontList = [];
            this.m_effectList = {};
            this.m_isLoading = false;
        }
        CResMgr.getIns = function () {
            if (CResMgr.g_instance == null) {
                CResMgr.g_instance = new CResMgr();
            }
            return CResMgr.g_instance;
        };
        Object.defineProperty(CResMgr.prototype, "texList", {
            get: function () {
                return this.m_texList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CResMgr.prototype, "effectList", {
            get: function () {
                return this.m_effectList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CResMgr.prototype, "fontList", {
            get: function () {
                return this.m_fontList;
            },
            enumerable: true,
            configurable: true
        });
        CResMgr.prototype.onDestroy = function () {
            this.m_texList = [];
            this.m_fontList = [];
            this.m_effectList = [];
        };
        CResMgr.prototype.loadFile = function (files, fontFiles, effectFiles, callback, callbackThis) {
            if (this.m_isLoading == true)
                return;
            var filesLen = files.length;
            var fontFilesLen = fontFiles.length;
            var effectFilesLen = effectFiles.length;
            this.m_pNumComplete = 0;
            this.m_pLoaderNum = filesLen + fontFilesLen + effectFilesLen;
            this.m_pLoaderComplete = callback;
            this.m_pLoaderCompleteThis = callbackThis;
            for (var i = 0; i < filesLen; i++) {
                var url = files[i];
                RES.getResByUrl(url, this.onFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
            }
            // for (var i: number = 0; i < fontFilesLen; i++) {
            // 	var url = fontFiles[i];
            // 	RES.getResByUrl(url, this.onFontFileLoadComplete, this, RES.ResourceItem.TYPE_FONT);
            // }
            for (var i = 0; i < effectFilesLen; i++) {
                var url = effectFiles[i];
                RES.getResByUrl(url, this.onEffectFileLoadComplete, this, RES.ResourceItem.TYPE_SHEET);
            }
        };
        CResMgr.prototype.allLoadComplete = function () {
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
        };
        CResMgr.prototype.onFileLoadComplete = function (sheets) {
            var texture = sheets._textureMap;
            for (var name in texture) {
                // this.m_pAnimTexture[name] = texture[name];
                this.m_texList[name] = texture[name];
            }
            this.m_pNumComplete++;
            this.allLoadComplete();
        };
        CResMgr.prototype.onEffectFileLoadComplete = function (sheets) {
            var texture = sheets._textureMap;
            for (var name in texture) {
                // this.m_pAnimTexture[name] = texture[name];
                this.m_effectList[name] = texture[name];
            }
            this.m_pNumComplete++;
            this.allLoadComplete();
        };
        // private onFontFileLoadComplete(font: egret.BitmapFont): void {
        // 	this.m_fontList.push(font);
        // 	this.m_pNumComplete++;
        // 	this.allLoadComplete();
        // }
        CResMgr.prototype.getTextureFromGroup = function (name) {
            //xzb
            var group = RES.getGroupByName(name);
            var list = {};
            for (var i = 0; i < group.length; i++) {
                var resItem = group[i];
                var texList1 = resItem.data.subkeys;
                var texList = texList1.split(",");
                for (var j = 0; j < texList.length; j++) {
                    var texName = texList[j];
                    list[texName] = RES.getRes(texName);
                }
            }
            return list;
        };
        CResMgr.g_instance = null;
        return CResMgr;
    }());
    com_main.CResMgr = CResMgr;
})(com_main || (com_main = {}));

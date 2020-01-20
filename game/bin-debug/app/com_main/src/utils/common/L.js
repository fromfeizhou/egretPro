var L = /** @class */ (function () {
    function L() {
        this.isInit = false;
        this.m_pLan = new Array();
    }
    //格式化语言包
    L.prototype.getLanguageFormat = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var str = this.getLanguage(key);
        if (!str)
            return '##Not Exist##';
        str = str.replace(/%%/g, "%");
        for (var i in args) {
            var arg = args[i];
            if (L.SD_REG.test(str)) {
                str = str.replace(RegExp.$1, arg);
            }
        }
        return str;
    };
    L.prototype.getLanguage = function (key) {
        var str = (this.m_pLan[L.KEY_LAN] && this.m_pLan[L.KEY_LAN][key]) ? this.m_pLan[L.KEY_LAN][key] : key;
        if (typeof (str) != "string")
            return str;
        str = this.isJsonStr(str) ? str : str.replace(/(\\n)/g, '\n');
        return str;
    };
    L.prototype.isJsonStr = function (str) {
        var _a = [str[0], str[str.length - 1]], begin = _a[0], end = _a[1];
        if (begin == '{' && end == ']')
            return true;
        if (begin == '[' && end == ']')
            return true;
        return false;
    };
    L.prototype.getObject = function () {
        return this.m_pLan[L.KEY_DFA];
    };
    L.getInstance = function () {
        if (!L._instance) {
            L._instance = new L();
        }
        return L._instance;
    };
    L.prototype.loadConfig = function (callback, obj) {
        if (this.isInit) {
            callback.call(obj);
            return;
        }
        this.m_pLoadedCallback = callback;
        this.m_pCallInstance = obj;
        console.log("L:loadConfig------>>", GameConfig.getLanUrl());
        RES.getResByUrl(GameConfig.getLanUrl(), function (data) {
            if (data) {
                var zip = new JSZip(data);
                for (var i in zip.files) {
                    var name = zip.files[i].name;
                    if (name.indexOf('/') > 0)
                        continue;
                    var text = zip.files[i].asText();
                    var data = JSON.parse(text);
                    debug("lan:", data);
                    this.m_pLan[data.clazzName] = {};
                    for (var j = 0; j < data.data.length; j++) {
                        this.m_pLan[data.clazzName][data.data[j][0]] = data.data[j][1];
                    }
                }
                this.onLoaded();
            }
            //读取配置后销毁
            RES.destroyRes(GameConfig.getLanUrl());
        }, this, RES.ResourceItem.TYPE_BIN);
    };
    L.prototype.onLoaded = function () {
        this.m_pLoadedCallback.call(this.m_pCallInstance);
        this.m_pLoadedCallback = null;
        this.m_pCallInstance = null;
        this.isInit = true;
    };
    L.KEY_LAN = "LanguageConfig";
    L.KEY_DFA = "DAFConfig";
    L.REPLACE_REG = /{[a-zA-Z0-9]+}/;
    L.SD_REG = new RegExp("(%s|%d)");
    return L;
}());
/**语言包 */
function GLan(key) {
    return L.getInstance().getLanguage(key);
}
/**
 * 语言包格式化
 * %s 符号替换
 **/
function GLanFormat(key) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (_a = L.getInstance()).getLanguageFormat.apply(_a, [key].concat(args));
}
/**程序语言包  */
function GCode(key) {
    return L.getInstance().getLanguage(C.CodeLanConfig[key].value);
}
/**程序语言包格式化 */
function GCodeFromat(key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return GLanFormat.apply(void 0, [C.CodeLanConfig[key].value].concat(args));
}

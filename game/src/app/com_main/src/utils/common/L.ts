class L {
	private static _instance: L;
	private m_pLan: Array<any>[];

	private m_pLoadedCallback: Function;
	private m_pCallInstance: any;

	public static KEY_LAN = "LanguageConfig";
	public static KEY_DFA = "DAFConfig";
	public static REPLACE_REG: RegExp = /{[a-zA-Z0-9]+}/;
	public static SD_REG: RegExp = new RegExp("(%s|%d)");

	public isInit = false;

	//格式化语言包
	public getLanguageFormat(key: any, ...args: any[]) {
		var str: string = this.getLanguage(key);
		if (!str) return '##Not Exist##';
		str = str.replace(/%%/g, "%");
		for (var i in args) {
			var arg = args[i];
			if (L.SD_REG.test(str)) {
				str = str.replace(RegExp.$1, arg);
			}
		}
		return str;
	}

	public getLanguage(key: any) {
		let str = (this.m_pLan[L.KEY_LAN] && this.m_pLan[L.KEY_LAN][key]) ? this.m_pLan[L.KEY_LAN][key] : key;
		if (typeof (str) != "string") return str;
		str = this.isJsonStr(str) ? str : str.replace(/(\\n)/g, '\n');
		return str;
	}

	private isJsonStr(str: string) {
		let [begin, end] = [str[0], str[str.length - 1]];
		if (begin == '{' && end == ']') return true;
		if (begin == '[' && end == ']') return true;
		return false;
	}

	public getObject() {
		return this.m_pLan[L.KEY_DFA];
	}

	public constructor() {
		this.m_pLan = new Array();
	}

	public static getInstance() {
		if (!L._instance) {
			L._instance = new L();
		}
		return L._instance;
	}

	public loadConfig(callback: Function, obj: any) {
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
					var name: string = zip.files[i].name;
					if (name.indexOf('/') > 0) continue;
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
	}

	private onLoaded() {
		this.m_pLoadedCallback.call(this.m_pCallInstance);
		this.m_pLoadedCallback = null;
		this.m_pCallInstance = null;
		this.isInit = true;
	}
}

/**语言包 */
function GLan(key: any) {
	return L.getInstance().getLanguage(key)
}

/**
 * 语言包格式化  
 * %s 符号替换
 **/
function GLanFormat(key: any, ...args: any[]) {
	return L.getInstance().getLanguageFormat(key, ...args);
}

/**程序语言包  */
function GCode(key: CLEnum) {
	return L.getInstance().getLanguage(C.CodeLanConfig[key].value);
}

/**程序语言包格式化 */
function GCodeFromat(key: CLEnum, ...args: any[]) {
	return GLanFormat(C.CodeLanConfig[key].value, ...args);
}
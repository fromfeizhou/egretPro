/**
* 对象存储器,可根据字符名称和对象作为标签名来存储的数据.
* 建议"get"一次后缓存好数据不要频繁使用"get对象key","字符key"不影响
* 支持用对象作为key存储数据.
* @author 交流联系方式 564139153@qq.com 一块红布
*/
class Dictionary extends egret.HashObject implements IFObject {
	/**
	 * 字典计数器
	 */
	private _count: number = 0;
	/**
	 * 字符索引对象
	 */
	private _maps: Object;
	/**
	 * hashCode索引对象
	 */
	private _hashMaps: Object;
	/**
	 * 对象索引数组
	 */
	private _objKeys: Array<any>;
	/**
	 * 对象索引数组对应的数据
	 */
	private _objDatum: Array<any>;

	public static create(body?: any) {
		let obj = new Dictionary(body);
		return obj;
	}

	public constructor(body?: any) {
		super()
		this.init(body);
	}

	public init(body?: any) {
		this._maps = {};
		this._hashMaps = {};
		this._objKeys = [];
		this._objDatum = [];

		if (body) {
			for (var key in body) {
				this.add(key, body[key])
			}
		}
	}

	public clear() {
		this._maps = {};
		this._hashMaps = {};
		this._objKeys.length = 0;
		this._objDatum.length = 0;
		this._count = 0;
	}

	public onDestroy(): void {
		this.clear()
	}

	/**
	 * 添加指定类型的数据
	 * @param key 可以是对象、字符、数字
	 * @param data 任何类型
	 */
	public add(key: any, data: any): void {
		// if(key instanceof Long) {
		// 	key = key.toString(16)
		// }
		if (typeof (key) !="object" ) {
			if (!this._maps[key]) {
				this._count++;
			}
			this._maps[key] = data;
		} else if (key instanceof egret.HashObject) {
			if (!this._hashMaps[key.hashCode]) {
				this._count++;
			}
			this._hashMaps[key.hashCode] = [key, data];
		} else {
			var index: number = this._objKeys.lastIndexOf(key);
			if (index == -1) {
				this._objKeys.push(key);
				this._objDatum.push(data);
				this._count++;
			} else {
				this._objDatum[index] = data;
			}
		}
	}

	/**
	 * 删除指定类型的全部数据
	 * @param key  可以是对象、字符、数字
	 *
	 */
	public del(key: any): void {
		var index: number;
		// if(key instanceof Long) {
		// 	key = key.toString(16)
		// }
		if (typeof (key) !="object" ) {
			if (this._maps[key]) {
				delete this._maps[key];
				this._count--;
			}
		} else if (key instanceof egret.HashObject) {
			if (this._hashMaps[key.hashCode]) {
				delete this._hashMaps[key.hashCode];
				this._count--;
			}
		} else {
			index = this._objKeys.lastIndexOf(key);
			if (index != -1) {
				this._objKeys.splice(index, 1);
				this._objDatum.splice(index, 1);
				this._count--;
			}
		}
	}

	/**
	 * 获取存储中的数据,对象作为key实际上需要进行遍历索引，所以在同一个字典中尽量不要添加过多的key会影响性能,
	 * 建议get一次后缓存好数据不要频繁使用get对象key,字符key不影响
	 * @param key 可以是对象、字符、数字
	 * @return
	 */
	public get(key: any): any {
		// if(key instanceof Long) {
		// 	key = key.toString(16)
		// }
		if (typeof (key) !="object" ) {
			if (!this._maps[key]) {
				return null;
			}
			return this._maps[key];
		} else if (key instanceof egret.HashObject) {
			if (!this._hashMaps[key.hashCode]) {
				return null;
			}
			return this._hashMaps[key.hashCode][1];
		} else {
			var index: number = this._objKeys.lastIndexOf(key);
			if (index != -1) {
				return this._objDatum[index];
			}
			return null;
		}
	}

	/**
	 * 检查是否有该类型的数据存在
	 * @param key 可以是对象、字符、数字
	 * @return
	 */
	public has(key: any): boolean {
		// if(key instanceof Long) {
		// 	key = key.toString(16)
		// }
		if (typeof (key) !="object" ) {
			if(this._maps[key] == null ||this._maps[key]== undefined)
				return false
			return true;
		} else if (key instanceof egret.HashObject) {
			return this._hashMaps[key.hashCode] ? true : false;
		} else {
			var index: number = this._objKeys.lastIndexOf(key);
			if (index != -1) {
				return true;
			}
			return false;
		}
	}

	/**
	 *  获取字典中储存数据的个数
	 *
	 */
	public get count(): number {
		return this._count;
	}

	/**
	 * 对字典中的每一项执行函数，用该函数可以省去for循环，
	 * 允许回调函数中删除当前正在执行的key，
	 * 但是删除字典中的其他key可能会出现少遍历或重复遍历的情况.
	 *
	 */
	public forEach(callback: (key: any, data: any) => any, thisObject: any = null): void {
		var name, arr,funcRes;
		for (name in this._maps) {
			funcRes = callback.call(thisObject, name, this._maps[name]);
			if(funcRes == 'break') return;
		}
		for (name in this._hashMaps) {
			arr = this._hashMaps[name];
			funcRes = callback.call(thisObject, arr[0], arr[1]);
			if(funcRes == 'break') return;
		}
		for (var j: number = 0; j < this._objKeys.length; j++) {
			var key: any = this._objKeys[j];
			funcRes = callback.call(thisObject, this._objKeys[j], this._objDatum[j]);
			if (key != this._objKeys[j]) {
				j--;
			}

			if(funcRes == 'break') return;
		}
	}

	/**
	 *  获取字典中储存key和data的队列
	 *
	 */
	public get elements(): Array<{ key: any; data: any }> {
		var _list: Array<{ key: any; data: any }> = [];
		var name, arr;
		for (name in this._maps) {
			_list.push({ key: name, data: this._maps[name] });
		}
		for (name in this._hashMaps) {
			arr = this._hashMaps[name];
			_list.push({ key: arr[0], data: arr[1] });
		}
		var len: number = this._objKeys.length;
		for (var j: number = 0; j < len; j++) {
			_list.push({ key: this._objKeys[j], data: this._objDatum[j] });
		}
		return _list;
	}

	/**
	 *  获取字典中储存key队列
	 *
	 */
	public get keys(): Array<any> {
		var _list: Array<any> = [];
		var name;
		for (name in this._maps) {
			_list.push(name);
		}
		for (name in this._hashMaps) {
			_list.push(this._hashMaps[name][0]);
		}
		_list = _list.concat(this._objKeys);
		return _list;
	}

	/**
	 *  获取字典中储存data的队列
	 *
	 */
	public get datum(): Array<any> {
		var _list: Array<any> = [];
		var name;
		for (name in this._maps) {
			_list.push(this._maps[name]);
		}
		for (name in this._hashMaps) {
			_list.push(this._hashMaps[name][1]);
		}
		_list = _list.concat(this._objDatum);
		return _list;
	}

	/**
	 *  打印字典中的所有数据
	 *
	 */
	public dump(): void {
		var name, arr;
		for (name in this._maps) {
			debug("key:", name, "---> data:", this._maps[name]);
		}
		for (name in this._hashMaps) {
			arr = this._hashMaps[name];
			debug("key:", arr[0], "---> data:", arr[1]);
		}
		var len: number = this._objKeys.length;
		for (var j: number = 0; j < len; j++) {
			debug("key:", typeof (this._objKeys[j]), " ---> data:", this._objDatum[j]);
		}
	}

	public static assign(target:any, ass: any): any {
		for (let p in ass) { 
			if(ass.hasOwnProperty(p) && (target.hasOwnProperty(p) ))
				target[p]=ass[p];
		}
		return target;
	}
}
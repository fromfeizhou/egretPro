// /**
//  * 对象池（待优化）
//  */
// class Pool {
// 	private static _pool = {};

// 	/**
// 	 * 将对象存进对象池中
// 	 * @param name 存进对象池的名称，一般用对象类名
// 	 * @param cla 对象
// 	 */
// 	public static saveCla(name: string, cla: any): void {
// 		if (cla["_InPool"]) return;
// 		if (isNull(this._pool[name])) this._pool[name] = [];
// 		this._pool[name].push(cla);
// 	}

// 	/**
// 	 * 通过对象池获取对象
// 	 * @param name 取对象的对象池名，一般用对象类名
// 	 * @param cla 需要实例化的对象
// 	 */
// 	public static getCla(name: string, cla: any): any {
// 		if (!isNull(this._pool[name] && this._pool[name].length > 0)) {
// 			return this._pool[name].pop();
// 		}
// 		let newCla = new cla();
// 		newCla["_InPool"] = false;
// 		return newCla;
// 	}

// 	/**
// 	 * 通过对象池获取对象
// 	 * @param name 取对象的对象池名，一般用对象类名
// 	 * @param createFunc 构造方法
// 	 */
// 	public static getByCreateFunc(name: string, createFunc: Function): any {
// 		if (!isNull(this._pool[name] && this._pool[name].length > 0)) {
// 			return this._pool[name].pop();
// 		}
// 		let newCla = createFunc();
// 		newCla["_InPool"] = false;
// 		return newCla;
// 	}

// 	/**
// 	 * 销毁对象并存进对象池中
// 	 * @param name 存进对象池的名称，一般用对象类名
// 	 * @param obj 对象
// 	 */
// 	public static destroyObj(name: string, obj: any): void {
// 		if (obj instanceof egret.DisplayObject) {
// 			if (obj["destroy"] && obj["destroy"] instanceof Function) {
// 				obj["destroy"]();
// 			}
// 		}
// 		this.saveCla(name, obj);
// 	}

// }
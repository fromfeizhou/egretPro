/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
class BaseClass extends egret.HashObject {

	public constructor() {
		super();
	}

	/**
	 * 获取一个单例
	 * @returns {any}
	 */
	// public static getInstance<T>(...args: any[]): T {
	public static getInstance(...args: any[]) {
		let Class: any = this;
		if (!Class._instance) {
			let argsLen: number = args.length;
			if (argsLen == 0) {
				Class._instance = new Class();
			} else if (argsLen == 1) {
				Class._instance = new Class(args[0]);
			} else if (argsLen == 2) {
				Class._instance = new Class(args[0], args[1]);
			} else if (argsLen == 3) {
				Class._instance = new Class(args[0], args[1], args[2]);
			} else if (argsLen == 4) {
				Class._instance = new Class(args[0], args[1], args[2], args[3]);
			} else if (argsLen == 5) {
				Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
			}
		}
		return Class._instance;
	}
}
module com_main {
	export class EventMgr {

		private static eventList: any = {};

		/**
		 * 添加事件侦听
		 * type 事件ID
		 * callback 事件处理
		 * thisObject 对象
		 */
		public static addEvent(type: number|string, callback: Function, thisObject: Object): void {
			if (this.eventList[type] == null) {
				this.eventList[type] = [];
			}
			// let num = this.eventList[type].length;
			if(!this.hasEvent(type,callback,thisObject as egret.HashObject)){
				this.eventList[type].push({ "callback": callback, "thisObject": thisObject });
			}
		}

		/**
		 * 删除静态对象使用 其他对象使用（removeEventByObject）
		 * 【注意】 同一个类多个实例 回调函数值相同 (移除会移除监听列表 位置0的回调) 导致难以发现的bug
		 * 所以只用做静态对象的移除（静态对象 通常只会调用一次监听）
		 * 删除事件侦听
		 */
		public static removeStaticEvent(type: number|string, callback: Function): void {
			let events:{ callback: Function, thisObject: Object }[] = this.eventList[type];
			if (events != null) {
				for (let i = events.length - 1; i>=0; i--) {
					let evt = events[i];
					if (evt["callback"] == callback) {
						events.splice(i, 1);
					}
				}
				if(events.length == 0)
				delete this.eventList[type]
			}
		}

		/**
		 * 删除事件侦听
		 */
		public static removeEventByObject(type: number|string, thisObject: egret.HashObject): void {
			let events:{ callback: Function, thisObject: egret.HashObject }[] = this.eventList[type];
			if (events != null) {
				for (let i = events.length - 1; i>=0; i--) {
					let evt = events[i];
					if (evt["thisObject"].hashCode == thisObject.hashCode) {
						events.splice(i, 1);
					}
				}
				if(events.length == 0)
				delete this.eventList[type]
			}
		}


		/**
		 * 派发事件
		 * type 事件ID
		 * data 自定义数据
		 */
		public static dispatchEvent(type: number|string, data: any) {
			let events = this.eventList[type];
			if (events) {
				let num: number = events.length;
				for (let i: number = 0; i < num; i++) {
					let evt = events[i];
					let callback: Function = <Function>evt["callback"];
					let obj: Object = evt["thisObject"];
					callback.apply(obj, [data]);
				}
			}
		}

		/**
		 * 判断EventMgr是否有该事件的某个回调函数S
		 * type 事件ID
		 * callback 回调函数
		 */
		public static hasEvent(type: number|string,callback:Function,thisObject: egret.HashObject):boolean{
			let events = this.eventList[type];
			if (events != null){
				let num: number = events.length;
				for (let i: number = 0; i < num; i++) {
					let evt = events[i];
					let cb: Function = <Function>evt["callback"];
					let obj: egret.HashObject = evt["thisObject"];
					if(cb==callback) 
					{
						if(obj && thisObject && obj.hashCode == thisObject.hashCode)
						return true;
					}
				}
			}
			return false;
		}

	}
}
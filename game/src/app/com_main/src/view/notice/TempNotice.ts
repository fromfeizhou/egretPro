module com_main {
	export class TempNotice {
		public static array: any[] = [];
		public static isInit: boolean = false;

		public static addNotice(msg) {
			this.array.push(msg);
			if (this.array.length == 1 && !this.isInit) {
				this.isInit = true;
				Utils.TimerManager.doFrame(2, 0, this.onEnterFrame, this);
			}
		}

		private static onEnterFrame() {
			if (TempNotice.array.length != 0) {
				if (!TempNoticeUi.GetInstance.getState()) {
					TempNoticeUi.GetInstance.setData(TempNotice.array[0]);
					TempNotice.array.shift();
				}
			} else {
				this.isInit = false;
				Utils.TimerManager.remove(this.onEnterFrame, this);
			}
		}
		// this.setAnnouncementTxt("测试顺序插入，2次",3);////////////////////////////////////////////////
		// this.setAnnouncementState("测试优先级插入,循环1次", 2, 1);/////////////////////////////////////
		// this.setAnnouncementState("测试优先级插入1,循环2次", 1, 2);////////////////////////////////////
		// this.setAnnouncementState("测试优先级插入2,循环3次", 2, 3);////////////////////////////////////
		// this.setAnnouncementState("测试优先级插入3,循环1次", 3, 1);////////////////////////////////////
		// this.setAnnouncementState("测试优先级插入4,循环2次", 2, 2);////////////////////////////////////
		// this.announcementArray.push({ txt: "我方", cycleNumber: this.cycleNumber });
		// this.announcementArray.push({ txt: "我方取得", cycleNumber: this.cycleNumber });
		// this.announcementArray.push({ txt: "我方取得胜利", cycleNumber: this.cycleNumber });

		// private static setTempNoticeState(content: string, priority: number, cycle?: number) {   //优先级
		// 	if (this.array.length == 0) {
		// 		this.array.splice(0, 0, { txt: content, cycleNumber: cycle });
		// 	} else {
		// 		if (priority == 0) {
		// 			this.array.splice(1, 0, { txt: content, cycleNumber: cycle });
		// 		}
		// 		if (0 < priority && priority <= this.array.length) {
		// 			this.array.splice(priority, 0, { txt: content, cycleNumber: cycle });
		// 		} else {
		// 			this.array.push({ txt: content, cycleNumber: cycle });
		// 		}
		// 	}
		// }
	}
}
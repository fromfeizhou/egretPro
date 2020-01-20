module AGame {
	export class View extends AComponent {

		public constructor() {
			super();
		}

		protected onCreate(): void {
			
		 }

		public onRefresh(body?): void { }

		public resize(): void { }

		protected initApp(skinName: string = ''): void {
			this.init('app/' + skinName);
		}

		protected initCom(skinName: string = ''): void {
			this.init('components/' + skinName);
		}

		protected init(skinName: string = ''): void {
			this.skinName = "resource/skins/" + skinName;
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
		}

		private createCompleteEvent(event: egret.Event): void {
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
			this.registerEvents();
			this.registerProxys();
			this.onCreate();
			
		}

		/////////////////////////////////////////////////////////////////自定义事件
		protected listNotificationInterests(): any[] {
			return [];
		}

		protected handleNotification(notification: INotification) {
			let body = notification.getBody();
			let name = notification.getName();
			// console.log("View:handleNotification--->>", name, body);
			switch (name) {
				case "value":
					break;
				default:
					break;
			}
		}

		protected registerEvents(): void {
			let interests: string[] = this.listNotificationInterests();
			let len: Number = interests.length;
			if (!R.router) return;
			let router = R.router.getObserver();
			if (len > 0) {
				let observer: Observer = new Observer(this.handleNotification, this);

				for (let i: number = 0; i < len; i++) {
					router.registerObserver(interests[i], observer);
				}
			}
		}

		protected unRegisterEvents(): void {
			let interests: string[] = this.listNotificationInterests();
			let i: number = interests.length;
			let router = R.router.getObserver();
			while (i--)
				router.removeObserver(interests[i], this);
		}
		/////////////////////////////////////////////////////////////////协议号事件
		/**注册协议号事件 */
		protected listenerProtoNotifications(): any[] {
			return [];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			// console.log("View:execute -------->protocol, body:", protocol, body)
			switch (protocol) {
				case 0: {
					break;
				}
			}
		}

		/**
		 * 监听协议号事件
		 */
		protected registerProxys(): void {
			let interests: string[] = this.listenerProtoNotifications();
			let len: Number = interests.length;
			if (len > 0) {
				for (let i: number = 0; i < len; i++) {
					ServiceBuilder.Instance.registerProxy(interests[i], this.executes, this);
				}
			}
		}

        /**
         * 移除协议号监听
         */
		protected removeProxys() {
			ServiceBuilder.Instance.removeProxy(this);
		}
		/////////////////////////////////////////////////////////////////

		public onDestroy(): void {
			super.onDestroy();
			this.unRegisterEvents();
			this.removeProxys();
		}
	}
}
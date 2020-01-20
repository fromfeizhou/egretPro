module AGame {
	export class Controller implements IController {
		protected m_name: string;

		protected listenerRouterNotifications(): any[] {
			return [];
		}

		public register() {
			let interests: any[] = this.listenerRouterNotifications();
			let len: Number = interests.length;
			if (len > 0) {
				for (let i: number = 0; i < len; i++) {
					AGame.R.registerRouter(interests[i][0], interests[i][1]);
				}
			}
		}

		public execute(notification: INotification) {
			let name = notification.getName();
			let body = notification.getBody();
			// console.log("Controller:execute--->>", name, body);
			switch (name) {
				case 0:
					break;
				default:
					break;
			}
		}
	}
}
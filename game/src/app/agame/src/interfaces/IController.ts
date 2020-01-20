module AGame {
	export interface IController {
		register();
		execute(notification: INotification);
	}
}
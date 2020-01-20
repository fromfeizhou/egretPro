module AGame {
	export interface IHandlerObserver {
		registerObserver(notificationName: string, observer: IObserver);
		removeObserver(notificationName: string, notifyContext: any);
		notifyObservers(notification: INotification);
	}
	export interface IRouter {
		executeRouter(notification: INotification): void;
		registerRouter(notificationName: any, commandClassRef: Function): void;
		notifyObservers(notification: INotification);
		hasRouter(notificationName: string): boolean;
		removeRouter(notificationName: string): void;
		getObserver(): IHandlerObserver;
	}
}
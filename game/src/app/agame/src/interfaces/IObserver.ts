module AGame {
	export interface IObserver {
		/**
		 * Set the notification method.
		 *
		 * The notification method should take one parameter of type <code>INotification</code>.
		 * 
		 * @param notifyMethod
		 * 		The notification (callback) method of the interested object.
		 */
		setNotifyMethod(notifyMethod: Function): void;

		/**
		/**
		 * Set the notification context.
		 * 
		 * @param notifyContext
		 * 		The notification context (this) of the interested object.
		 */
		setNotifyContext(notifyContext: any): void;

		/**
		 * Notify the interested object.
		 * 
		 * @param notification
		 * 		The <code>INotification</code> to pass to the interested object's notification
		 * 		method.
		 */
		notifyObserver(notification: INotification): void;

		/**
		 * Compare an object to the notification context.
		 *
		 * @param object
		 * 		The object to compare.
		 *
		 * @return
		 * 		The object and the notification context are the same.
		 */
		compareNotifyContext(object: any): boolean;
	}
}
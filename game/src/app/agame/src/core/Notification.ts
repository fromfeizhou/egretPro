module AGame {
	export class Notification implements INotification{
		/**
		 * The name of the <code>Notification</code>.
		 *
		 * @protected
		 */
		name:any = null;

		/**
		 * The body data to send with the <code>Notification</code>.
		 *
		 * @protected
		 */
		body:any = null;

		/**
		 * The type identifier of the <code>Notification</code>.
		 *
		 * @protected
		 */
		type:string = null;

		/**
		 * Constructs a <code>Notification</code> instance.
		 *
		 * @param name
		 * 		The name of the notification.
		 *
		 * @param body
		 * 		Body data to send with the <code>Notification</code>.
		 * 
		 * @param type
		 * 		Type identifier of the <code>Notification</code>.
		 */
		constructor( name:any, body:any=null, type:string=null )
		{
			this.name = name;
			this.body = body;
			this.type = type;
		}

		/**
		 * Get the name of the <code>Notification</code> instance.
		 * 
		 * @return
		 *		The name of the <code>Notification</code> instance.
		 */
		getName():any
		{
			return this.name;
		}

		/**
		 * Set the body of the <code>Notification</code> instance.
		 *
		 * @param body
		 * 		The body of the <code>Notification</code> instance.
		 */
		setBody( body:any ):void
		{
			this.body = body;
		}

		/**
		 * Get the body of the <code>Notification</code> instance.
		 * 
		 * @return
		 *		The body object of the <code>Notification</code> instance.
		 */
		getBody():any
		{
			return this.body;
		}

		/**
		 * Set the type of the <code>Notification</code> instance.
		 *
		 * @param type
		 * 		The type of the <code>Notification</code> instance.
		 */
		setType( type:string ):void
		{
			this.type = type;
		}

		/**
		 * Get the type of the <code>Notification</code> instance.
		 * 
		 * @return
		 *		The type of the <code>Notification</code> instance.
		 */
		getType():string
		{
			return this.type;
		}

		/**
		 * Get a textual representation of the <code>Notification</code> instance.
		 *
		 * @return
		 * 		The textual representation of the <code>Notification</code>	instance.
		 */
		toString():string
		{
			var msg:string = "Notification Name: " + this.getName();
			msg += "\nBody:" + (( this.getBody() == null ) ? "null" : this.getBody().toString());
			msg += "\nType:" + (( this.getType() == null ) ? "null" : this.getType());
			return msg;
		}
	}
}
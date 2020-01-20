var AGame;
(function (AGame) {
    var Observer = /** @class */ (function () {
        /**
         * Constructs an <code>Observer</code> instance.
         *
         * @param notifyMethod
         * 		The notification method of the interested object.
         *
         * @param notifyContext
         * 		The notification context of the interested object.
         */
        function Observer(notifyMethod, notifyContext) {
            /**
             * The notification method of the interested object.
             * @protected
             */
            this.notify = null;
            /**
             * The notification context of the interested object.
             * @protected
             */
            this.context = null;
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
        }
        /**
         * Get the notification method.
         *
         * @return
         * 		The notification (callback) method of the interested object.
         */
        Observer.prototype.getNotifyMethod = function () {
            return this.notify;
        };
        /**
         * Set the notification method.
         *
         * The notification method should take one parameter of type <code>INotification</code>.
         *
         * @param notifyMethod
         * 		The notification (callback) method of the interested object.
         */
        Observer.prototype.setNotifyMethod = function (notifyMethod) {
            this.notify = notifyMethod;
        };
        /**
         * Get the notification context.
         *
         * @return
         * 		The notification context (<code>this</code>) of the interested object.
         */
        Observer.prototype.getNotifyContext = function () {
            return this.context;
        };
        /**
         * Set the notification context.
         *
         * @param notifyContext
         * 		The notification context (this) of the interested object.
         */
        Observer.prototype.setNotifyContext = function (notifyContext) {
            this.context = notifyContext;
        };
        /**
         * Notify the interested object.
         *
         * @param notification
         * 		The <code>INotification</code> to pass to the interested object's notification
         * 		method.
         */
        Observer.prototype.notifyObserver = function (notification) {
            this.getNotifyMethod().call(this.getNotifyContext(), notification);
        };
        /**
         * Compare an object to the notification context.
         *
         * @param object
         * 		The object to compare.
         *
         * @return
         * 		The object and the notification context are the same.
         */
        Observer.prototype.compareNotifyContext = function (object) {
            return object === this.context;
        };
        return Observer;
    }());
    AGame.Observer = Observer;
})(AGame || (AGame = {}));

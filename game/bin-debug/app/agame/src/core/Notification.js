var AGame;
(function (AGame) {
    var Notification = /** @class */ (function () {
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
        function Notification(name, body, type) {
            if (body === void 0) { body = null; }
            if (type === void 0) { type = null; }
            /**
             * The name of the <code>Notification</code>.
             *
             * @protected
             */
            this.name = null;
            /**
             * The body data to send with the <code>Notification</code>.
             *
             * @protected
             */
            this.body = null;
            /**
             * The type identifier of the <code>Notification</code>.
             *
             * @protected
             */
            this.type = null;
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
        Notification.prototype.getName = function () {
            return this.name;
        };
        /**
         * Set the body of the <code>Notification</code> instance.
         *
         * @param body
         * 		The body of the <code>Notification</code> instance.
         */
        Notification.prototype.setBody = function (body) {
            this.body = body;
        };
        /**
         * Get the body of the <code>Notification</code> instance.
         *
         * @return
         *		The body object of the <code>Notification</code> instance.
         */
        Notification.prototype.getBody = function () {
            return this.body;
        };
        /**
         * Set the type of the <code>Notification</code> instance.
         *
         * @param type
         * 		The type of the <code>Notification</code> instance.
         */
        Notification.prototype.setType = function (type) {
            this.type = type;
        };
        /**
         * Get the type of the <code>Notification</code> instance.
         *
         * @return
         *		The type of the <code>Notification</code> instance.
         */
        Notification.prototype.getType = function () {
            return this.type;
        };
        /**
         * Get a textual representation of the <code>Notification</code> instance.
         *
         * @return
         * 		The textual representation of the <code>Notification</code>	instance.
         */
        Notification.prototype.toString = function () {
            var msg = "Notification Name: " + this.getName();
            msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
            msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
            return msg;
        };
        return Notification;
    }());
    AGame.Notification = Notification;
})(AGame || (AGame = {}));

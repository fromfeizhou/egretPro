var AGame;
(function (AGame) {
    var Controller = /** @class */ (function () {
        function Controller() {
        }
        Controller.prototype.listenerRouterNotifications = function () {
            return [];
        };
        Controller.prototype.register = function () {
            var interests = this.listenerRouterNotifications();
            var len = interests.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    AGame.R.registerRouter(interests[i][0], interests[i][1]);
                }
            }
        };
        Controller.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            // console.log("Controller:execute--->>", name, body);
            switch (name) {
                case 0:
                    break;
                default:
                    break;
            }
        };
        return Controller;
    }());
    AGame.Controller = Controller;
})(AGame || (AGame = {}));

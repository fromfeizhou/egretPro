var AGame;
(function (AGame) {
    var R = /** @class */ (function () {
        function R() {
        }
        R.startup = function (root) {
            this.initialize();
            if (root) {
                this.m_pApp.registerView(root);
            }
        };
        Object.defineProperty(R, "app", {
            get: function () {
                return this.m_pApp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R, "router", {
            get: function () {
                return this.m_pRouter;
            },
            enumerable: true,
            configurable: true
        });
        R.initialize = function () {
            if (!this.m_pApp)
                this.m_pApp = AGame.App.Instance;
            if (!this.m_pRouter)
                this.m_pRouter = AGame.Router.Instance;
        };
        R.registerRouter = function (notificationName, commandClassRef) {
            this.m_pRouter.registerRouter(notificationName, commandClassRef);
        };
        R.notifyObservers = function (notification) {
            if (this.m_pRouter)
                this.m_pRouter.notifyObservers(notification);
        };
        R.notifyView = function (name, body, type) {
            this.notifyObservers(new AGame.Notification(name, body, type));
        };
        return R;
    }());
    AGame.R = R;
})(AGame || (AGame = {}));

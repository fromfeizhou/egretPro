var AGame;
(function (AGame) {
    var HandlerObserver = /** @class */ (function () {
        function HandlerObserver() {
            this.m_pObserverMap = {};
        }
        HandlerObserver.prototype.registerObserver = function (notificationName, observer) {
            var observers = this.m_pObserverMap[notificationName];
            if (observers)
                observers.push(observer);
            else
                this.m_pObserverMap[notificationName] = [observer];
        };
        HandlerObserver.prototype.removeObserver = function (notificationName, notifyContext) {
            var observers = this.m_pObserverMap[notificationName];
            if (!observers)
                return;
            var i = observers.length;
            while (i--) {
                var observer = observers[i];
                if (observer.compareNotifyContext(notifyContext)) {
                    observers.splice(i, 1);
                    break;
                }
            }
            if (observers.length == 0)
                delete this.m_pObserverMap[notificationName];
        };
        HandlerObserver.prototype.notifyObservers = function (notification) {
            var notificationName = notification.getName();
            var observersRef = this.m_pObserverMap[notificationName];
            if (observersRef) {
                var observers = observersRef.slice(0);
                var len = observers.length;
                for (var i = 0; i < len; i++) {
                    var observer = observers[i];
                    observer.notifyObserver(notification);
                }
            }
        };
        return HandlerObserver;
    }());
    AGame.HandlerObserver = HandlerObserver;
    var Router = /** @class */ (function () {
        function Router() {
            this.m_pCommandMap = null;
            if (Router.instance)
                throw Error(Router.SINGLETON_MSG);
            Router.instance = this;
            this.m_pCommandMap = {};
            this.initializeRouter();
        }
        Router.prototype.getObserver = function () {
            return this.m_pObserver;
        };
        Router.prototype.initializeRouter = function () {
            this.m_pObserver = new HandlerObserver();
        };
        Router.prototype.executeRouter = function (notification) {
            var commandClassRef = this.m_pCommandMap[notification.getName()];
            if (commandClassRef) {
                var command = new commandClassRef();
                command.execute(notification);
            }
        };
        Router.prototype.registerRouter = function (notificationName, commandClassRef) {
            if (!this.m_pCommandMap[notificationName])
                this.m_pObserver.registerObserver(notificationName, new AGame.Observer(this.executeRouter, this));
            this.m_pCommandMap[notificationName] = commandClassRef;
        };
        Router.prototype.hasRouter = function (notificationName) {
            return this.m_pCommandMap[notificationName] != null;
        };
        Router.prototype.removeRouter = function (notificationName) {
            // if the Command is registered...
            if (this.hasRouter(notificationName)) {
                this.m_pObserver.removeObserver(notificationName, this);
                delete this.m_pCommandMap[notificationName];
            }
        };
        Router.prototype.notifyObservers = function (notification) {
            this.m_pObserver.notifyObservers(notification);
        };
        Object.defineProperty(Router, "Instance", {
            get: function () {
                if (!Router.instance)
                    Router.instance = new Router();
                return Router.instance;
            },
            enumerable: true,
            configurable: true
        });
        Router.SINGLETON_MSG = "Router singleton already constructed!";
        return Router;
    }());
    AGame.Router = Router;
})(AGame || (AGame = {}));

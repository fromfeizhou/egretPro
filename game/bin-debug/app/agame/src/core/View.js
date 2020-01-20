var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AGame;
(function (AGame) {
    var View = /** @class */ (function (_super_1) {
        __extends(View, _super_1);
        function View() {
            return _super_1.call(this) || this;
        }
        View.prototype.onCreate = function () {
        };
        View.prototype.onRefresh = function (body) { };
        View.prototype.resize = function () { };
        View.prototype.initApp = function (skinName) {
            if (skinName === void 0) { skinName = ''; }
            this.init('app/' + skinName);
        };
        View.prototype.initCom = function (skinName) {
            if (skinName === void 0) { skinName = ''; }
            this.init('components/' + skinName);
        };
        View.prototype.init = function (skinName) {
            if (skinName === void 0) { skinName = ''; }
            this.skinName = "resource/skins/" + skinName;
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        };
        View.prototype.createCompleteEvent = function (event) {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.registerEvents();
            this.registerProxys();
            this.onCreate();
        };
        /////////////////////////////////////////////////////////////////自定义事件
        View.prototype.listNotificationInterests = function () {
            return [];
        };
        View.prototype.handleNotification = function (notification) {
            var body = notification.getBody();
            var name = notification.getName();
            // console.log("View:handleNotification--->>", name, body);
            switch (name) {
                case "value":
                    break;
                default:
                    break;
            }
        };
        View.prototype.registerEvents = function () {
            var interests = this.listNotificationInterests();
            var len = interests.length;
            if (!AGame.R.router)
                return;
            var router = AGame.R.router.getObserver();
            if (len > 0) {
                var observer = new AGame.Observer(this.handleNotification, this);
                for (var i = 0; i < len; i++) {
                    router.registerObserver(interests[i], observer);
                }
            }
        };
        View.prototype.unRegisterEvents = function () {
            var interests = this.listNotificationInterests();
            var i = interests.length;
            var router = AGame.R.router.getObserver();
            while (i--)
                router.removeObserver(interests[i], this);
        };
        /////////////////////////////////////////////////////////////////协议号事件
        /**注册协议号事件 */
        View.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        View.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            // console.log("View:execute -------->protocol, body:", protocol, body)
            switch (protocol) {
                case 0: {
                    break;
                }
            }
        };
        /**
         * 监听协议号事件
         */
        View.prototype.registerProxys = function () {
            var interests = this.listenerProtoNotifications();
            var len = interests.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    AGame.ServiceBuilder.Instance.registerProxy(interests[i], this.executes, this);
                }
            }
        };
        /**
         * 移除协议号监听
         */
        View.prototype.removeProxys = function () {
            AGame.ServiceBuilder.Instance.removeProxy(this);
        };
        /////////////////////////////////////////////////////////////////
        View.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.unRegisterEvents();
            this.removeProxys();
        };
        return View;
    }(AGame.AComponent));
    AGame.View = View;
})(AGame || (AGame = {}));

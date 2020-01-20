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
var com_main;
(function (com_main) {
    var LoadingCtrl = /** @class */ (function (_super_1) {
        __extends(LoadingCtrl, _super_1);
        function LoadingCtrl() {
            return _super_1.call(this) || this;
        }
        LoadingCtrl.prototype.listenerRouterNotifications = function () {
            return [
                ["LOADING_SHOW", LoadingCtrl],
                ["LOADING_HIDE", LoadingCtrl],
            ];
        };
        LoadingCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            switch (name) {
                case "LOADING_SHOW":
                    Loading.show();
                    break;
                case "LOADING_HIDE":
                    Loading.hide();
                    break;
            }
        };
        return LoadingCtrl;
    }(AGame.Controller));
    com_main.LoadingCtrl = LoadingCtrl;
})(com_main || (com_main = {}));

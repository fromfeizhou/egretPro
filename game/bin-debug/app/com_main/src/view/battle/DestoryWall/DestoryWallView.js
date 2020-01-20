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
    /**
     * 攻破城墙
     */
    var DestoryWallView = /** @class */ (function (_super_1) {
        __extends(DestoryWallView, _super_1);
        function DestoryWallView() {
            var _this = _super_1.call(this) || this;
            _this.name = DestoryWallView.NAME;
            _this.initApp("battle_new/destoryWall/DestoryWallViewSkin.exml");
            return _this;
        }
        DestoryWallView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        DestoryWallView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pShowAni.addEventListener("complete", this.onBgAniFinish, this);
            this.m_pShowAni.play(0);
        };
        //播完动画
        DestoryWallView.prototype.onBgAniFinish = function (event) {
            // UpManager.history();
            Utils.removeFromParent(this);
        };
        DestoryWallView.NAME = 'DestoryWallView';
        return DestoryWallView;
    }(com_main.CView));
    com_main.DestoryWallView = DestoryWallView;
})(com_main || (com_main = {}));

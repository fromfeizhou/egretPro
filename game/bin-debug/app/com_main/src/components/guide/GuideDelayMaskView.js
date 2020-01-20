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
     * 指引遮罩面板相关
     */
    var GuideDelayMaskView = /** @class */ (function (_super_1) {
        __extends(GuideDelayMaskView, _super_1);
        function GuideDelayMaskView(delay) {
            if (delay === void 0) { delay = 500; }
            var _this = _super_1.call(this) || this;
            _this.m_nDelay = delay;
            _this.name = GuideDelayMaskView.NAME;
            _this.skinName = Utils.getComSkin("guide/guide_delay_mask_view_skin.exml");
            return _this;
        }
        GuideDelayMaskView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            _super_1.prototype.onDestroy.call(this);
        };
        GuideDelayMaskView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchTapListener(this, this, function () { });
            Utils.TimerManager.doTimer(30, 0, this.onTimeHandler, this);
        };
        GuideDelayMaskView.prototype.onTimeHandler = function () {
            this.m_nDelay -= 30;
            if (this.m_nDelay <= 0) {
                if (com_main.WorldView.isMove() || com_main.MainMap.isMove())
                    return;
                Utils.TimerManager.remove(this.onTimeHandler, this);
                this.closeView();
            }
        };
        GuideDelayMaskView.prototype.closeView = function () {
            SceneManager.closeGuidePanelByName(GuideDelayMaskView.NAME);
        };
        GuideDelayMaskView.NAME = 'GuideDelayMaskView';
        return GuideDelayMaskView;
    }(com_main.CView));
    com_main.GuideDelayMaskView = GuideDelayMaskView;
})(com_main || (com_main = {}));

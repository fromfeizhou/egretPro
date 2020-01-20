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
var Loading = /** @class */ (function (_super_1) {
    __extends(Loading, _super_1);
    function Loading(delay) {
        var _this = _super_1.call(this) || this;
        _this.m_pAlphas = [
            0.05,
            0.05,
            0.05,
            0.1,
            0.1,
            0.1,
            0.1,
            0.2,
            0.4,
            0.6,
            0.8,
            1
        ];
        _this.m_pNowIndex = 1;
        _this.m_delay = 0;
        _this.m_delay = delay;
        _this.name = Loading.NAME;
        _this.touchChildren = false;
        _this.skinName = Utils.getSkinName("loading/loading.exml");
        return _this;
    }
    Loading.show = function (delay) {
        if (delay === void 0) { delay = 300; }
        var view = Loading.getClass();
        if (!view) {
            view = new Loading(delay);
            SceneManager.addChild(LayerEnums.NET, view, 1);
            Utils.TimerManager.doTimer(10000, 1, this.removeTime, this);
        }
    };
    Loading.hide = function () {
        var view = Loading.getClass();
        if (view)
            view.onDestroy();
        Utils.TimerManager.remove(this.removeTime, this);
    };
    Loading.removeTime = function () {
        var view = Loading.getClass();
        if (view)
            view.onDestroy();
        Utils.TimerManager.remove(this.removeTime, this);
    };
    Loading.getClass = function () {
        var obj = SceneManager.getClass(LayerEnums.NET, Loading.NAME);
        return obj;
    };
    Loading.prototype.onDestroy = function () {
        Utils.TimerManager.remove(this.call, this);
        Utils.removeFromParent(this);
    };
    Loading.prototype.childrenCreated = function () {
        _super_1.prototype.childrenCreated.call(this);
        this.height = this.stage.stageHeight;
        this.width = this.stage.stageWidth;
        this.delaySetting();
        Utils.TimerManager.doFrame(5, 0, this.call, this);
    };
    /**强制指引拦截事件 */
    Loading.prototype.$hitTest = function (stageX, stageY) {
        return this;
    };
    ;
    Loading.prototype.delaySetting = function () {
        if (this.m_delay > 0) {
            this.alpha = 0;
            var tw = egret.Tween.get(this);
            tw.wait(this.m_delay);
            tw.set({ alpha: 1 });
        }
    };
    Loading.prototype.call = function () {
        this.m_pNowIndex = this.m_pNowIndex + 1 > 12 ? 1 : this.m_pNowIndex + 1;
        var alphas = this.m_pAlphas;
        var group = this.m_pGroup;
        for (var key in alphas) {
            if (alphas.hasOwnProperty(key)) {
                var alpha = +alphas[key];
                var obj = group.getChildByName('icon' + this.m_pNowIndex);
                if (obj) {
                    obj.alpha = alpha;
                    this.m_pNowIndex = this.m_pNowIndex + 1 > 12 ? 1 : this.m_pNowIndex + 1;
                }
                else {
                    error('读取不到图片：Loading：icon', this.m_pNowIndex);
                }
            }
        }
    };
    Loading.NAME = 'Loading';
    return Loading;
}(com_main.CComponent));

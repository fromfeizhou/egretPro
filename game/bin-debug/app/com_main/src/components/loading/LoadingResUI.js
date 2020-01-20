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
var LoadingResUI = /** @class */ (function (_super_1) {
    __extends(LoadingResUI, _super_1);
    function LoadingResUI(delay) {
        var _this = _super_1.call(this) || this;
        _this.m_pDelay = delay;
        _this.name = LoadingResUI.NAME;
        _this.skinName = "resource/skins/loading/loading_res_ui.exml";
        return _this;
    }
    // private m_pHorseAnim: com_main.SpriteAnimation;
    LoadingResUI.getClass = function () {
        var obj = SceneManager.getClass(LayerEnums.NET, LoadingResUI.NAME);
        return obj;
    };
    LoadingResUI.show = function (delay) {
        if (delay === void 0) { delay = 60000; }
        var view = LoadingResUI.getClass();
        if (!view) {
            view = new LoadingResUI(delay);
            view.height = AGame.R.app.stageHeight;
            SceneManager.addChild(LayerEnums.NET, view, 0);
        }
    };
    LoadingResUI.hide = function () {
        var view = LoadingResUI.getClass();
        if (view)
            view.onDestroy();
    };
    LoadingResUI.prototype.onDestroy = function () {
        com_main.EventManager.removeEventListeners(this);
        Utils.removeFromParent(this);
    };
    LoadingResUI.prototype.childrenCreated = function () {
        _super_1.prototype.childrenCreated.call(this);
        //适配 
        this.width = AGame.R.app.stageWidth;
        Utils.toStageMaxScale(this.m_imgLoginBg);
        this.setProgress(0, 0);
        this.m_imgLogo.source = LoginConst.getResUrl('login_lb_qysg.png');
    };
    LoadingResUI.prototype.setProgress = function (progress, total, resName, anim) {
        if (anim === void 0) { anim = false; }
        // debug("LoadingSceneUI:setProgress--->>加载进度", progress, total);
        if (resName) {
            if (total == 0) {
                this.m_pLblProgress.text = resName;
            }
            else {
                this.m_pLblProgress.text = format("正在疯狂加载中。。。{1} ({2}/{3})", resName, progress, total);
            }
        }
        else {
            this.m_pLblProgress.text = format("正在疯狂加载中。。。({1}/{2})", progress, total);
        }
        if (total == 0)
            return;
        var percent = (progress + 1) / total; //加载完里面切界面 看不见最后一个进度
        percent = percent > 1 ? 1 : percent;
        this.m_pProgressImg.width = this.m_pProgressGroup.width * percent;
    };
    LoadingResUI.NAME = "LoadingResUI";
    return LoadingResUI;
}(eui.Component));

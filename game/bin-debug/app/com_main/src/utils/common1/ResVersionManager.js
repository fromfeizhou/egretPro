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
/**
 * Created by yangsong on 15-4-21.
 * 单一资源通过版本号加载管理类
 */
var ResVersionManager = /** @class */ (function (_super_1) {
    __extends(ResVersionManager, _super_1);
    /**
     * 构造函数
     */
    function ResVersionManager() {
        var _this = _super_1.call(this) || this;
        _this.res_loadByVersion();
        return _this;
    }
    /**
     * Res加载使用版本号的形式
     */
    ResVersionManager.prototype.res_loadByVersion = function () {
        // RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
        //     var version: string = "";
        //     var resVersion: any = ResVersionManager.resVersionData;
        //     var urlTemp: string = url.substring(9);
        //     if (resVersion && resVersion[urlTemp]) {
        //         version = resVersion[urlTemp];
        //     }
        //     if (version.length == 0) {
        //         version = Math.random() + "";
        //     }
        //     if (url.indexOf("?") == -1) {
        //         url += "?v=" + version;
        //     } else {
        //         url += "&v=" + version;
        //     }
        //     return url;
        // }
    };
    /**
     * 加载资源版本号配置文件
     * @param url 配置文件路径
     * @param complateFunc 加载完成执行函数
     * @param complateFuncTarget 加载完成执行函数所属对象
     */
    ResVersionManager.prototype.loadConfig = function (url, complateFunc, complateFuncTarget) {
        this.complateFunc = complateFunc;
        this.complateFuncTarget = complateFuncTarget;
        RES.getResByUrl(url, this.loadResVersionComplate, this);
    };
    /**
     * 配置文件加载完成
     * @param data
     */
    ResVersionManager.prototype.loadResVersionComplate = function (data) {
        ResVersionManager.resVersionData = data;
        this.complateFunc.call(this.complateFuncTarget);
    };
    return ResVersionManager;
}(BaseClass));

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
 * Created by Tint_ on 2017/3/28.
 */
var UIBaseElement = /** @class */ (function (_super_1) {
    __extends(UIBaseElement, _super_1);
    function UIBaseElement(skinName, _loadingRes) {
        if (skinName === void 0) { skinName = ""; }
        if (_loadingRes === void 0) { _loadingRes = null; }
        var _this = _super_1.call(this) || this;
        _this._loadingRes = null;
        _this.touchEnabled = _this.touchChildren = false;
        _this.visible = true;
        _this._loadingRes = _loadingRes;
        if (skinName && skinName.length > 0) {
            // TimerUtils.tempTimeStart(); 
            _this.visible = false;
            // ResManager.loadEXML(skinName, this.loadedSkin, this);
            var self_1 = _this;
            self_1.skinName = skinName;
            // mLog.log("EXML加载用时..." + self, TimerUtils.tempTimeEnd());
            Utils.TimerManager.doTimer(20, 1, self_1.loaded, self_1);
            // this.loaded();
        }
        return _this;
    }
    UIBaseElement.prototype.__onLoadComplete = function (event) {
        Utils.TimerManager.doTimer(1, 1, this.loaded, this);
        console.log(event.groupName + ":资源加载完成.....");
    };
    UIBaseElement.prototype.__loadError = function (event) {
        console.log(event.groupName + ":loadError.....");
    };
    UIBaseElement.prototype.loadedSkin = function (clazz, url) {
        var self = this;
        self.skinName = clazz;
        // mLog.log("EXML加载用时..." + self, TimerUtils.tempTimeEnd());
        Utils.TimerManager.doTimer(1, 1, self.loaded, self);
    };
    /**
     * 设置皮肤
     * @param name 对应在wnd目录下面的文件名
     */
    UIBaseElement.prototype.setSkinName = function (name) {
        // this.skinName = ResManager.x2UIName(name);
    };
    UIBaseElement.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
    };
    UIBaseElement.prototype.loaded = function () {
        this.visible = true;
        Utils.TimerManager.remove(this.loaded, this);
    };
    return UIBaseElement;
}(eui.Component));

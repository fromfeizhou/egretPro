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
 * cacheAsBitmap的替代方案，解决QQ浏览器在1G内存的机器上最多能使用20个Canvas的限制
 */
var RenderTextureManager = /** @class */ (function (_super_1) {
    __extends(RenderTextureManager, _super_1);
    /**
     * 构造函数
     */
    function RenderTextureManager() {
        var _this = _super_1.call(this) || this;
        _this._pool = [];
        _this._useNum = 0;
        if (_this.isLowerQQBrowser()) {
            _this._maxNum = 18;
        }
        else {
            _this._maxNum = -1;
        }
        return _this;
    }
    /**
     * 是否是低端手机的QQ浏览器
     * @returns {boolean}
     */
    RenderTextureManager.prototype.isLowerQQBrowser = function () {
        if (Utils.DeviceUtils.IsQQBrowser) {
            //判定机型，因为拿不到内存信息，现在只能根据机型进行判定
            var arr = [
                "2013022",
                "Lenovo A630t",
                "SM-G3818",
                "vivo X3t",
                "GT-I9100"
            ];
            var lower = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (navigator.userAgent.indexOf(arr[i]) != -1) {
                    lower = true;
                    break;
                }
            }
            return lower;
        }
        return false;
    };
    /**
     * 获取一个egret.RenderTexture
     * @returns {egret.RenderTexture}
     */
    RenderTextureManager.prototype.pop = function () {
        var result = this._pool.pop();
        if (!result) {
            if (this._maxNum == -1 || this._useNum < this._maxNum) {
                result = new egret.RenderTexture();
                this._useNum++;
            }
        }
        return result;
    };
    /**
     * 回收一个egret.RenderTexture
     * @param texture
     */
    RenderTextureManager.prototype.push = function (texture) {
        var exists = false;
        for (var i = 0, len = this._pool.length; i < len; i++) {
            if (this._pool[i] == texture) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this._pool.push(texture);
        }
    };
    return RenderTextureManager;
}(BaseClass));

// TypeScript file
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
     * 入场技能
     */
    var FlyWordNum = /** @class */ (function (_super_1) {
        __extends(FlyWordNum, _super_1);
        function FlyWordNum(content, color) {
            if (color === void 0) { color = "green"; }
            var _this = _super_1.call(this) || this;
            _this.m_content = "";
            _this.skinName = Utils.getAppSkin("battle_new/components/BattleNumEffect.exml");
            _this.m_content = content;
            _this.labelColor = color;
            return _this;
        }
        FlyWordNum.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        FlyWordNum.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.animation.play(0);
            this.animation.addEventListener("complete", this.onTweenComplete, this);
            if (this.labelColor == "green") {
                this.label.font = "effectGreenNum_fnt";
            }
            else if (this.labelColor == "red") {
                this.label.font = "effectRedNum_fnt";
            }
            else if (this.labelColor == "orange") {
                this.label.font = "effectOrangeNum_fnt";
            }
            else if (this.labelColor == "purple") {
                this.label.font = "effectPurpleNum_fnt";
            }
            this.label.text = this.m_content;
        };
        FlyWordNum.prototype.setData = function (content, color) {
            if (color === void 0) { color = "green"; }
            this.m_content = content;
            this.labelColor = color;
        };
        /**
         * 动画组播放完成
         */
        FlyWordNum.prototype.onTweenComplete = function () {
            Utils.removeFromParent(this);
        };
        return FlyWordNum;
    }(com_main.CComponent));
    com_main.FlyWordNum = FlyWordNum;
})(com_main || (com_main = {}));

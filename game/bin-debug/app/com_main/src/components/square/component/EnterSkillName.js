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
    var EnterSkillName = /** @class */ (function (_super_1) {
        __extends(EnterSkillName, _super_1);
        function EnterSkillName(content) {
            var _this = _super_1.call(this) || this;
            _this.m_content = "";
            _this.skinName = Utils.getAppSkin("battle_new/components/BattleEnterSkillName.exml");
            _this.m_content = content;
            return _this;
        }
        EnterSkillName.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EnterSkillName.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.name_lb.text = this.m_content;
            this.animation.play();
            this.animation.addEventListener("complete", this.onTweenComplete, this);
        };
        /**
         * 动画组播放完成
         */
        EnterSkillName.prototype.onTweenComplete = function () {
            Utils.removeFromParent(this);
        };
        return EnterSkillName;
    }(com_main.CComponent));
    com_main.EnterSkillName = EnterSkillName;
})(com_main || (com_main = {}));

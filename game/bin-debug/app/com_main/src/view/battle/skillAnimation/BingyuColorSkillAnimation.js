// 冰雨渲染颜色技能
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
    var BingyuColorSkillAnimation = /** @class */ (function (_super_1) {
        __extends(BingyuColorSkillAnimation, _super_1);
        function BingyuColorSkillAnimation(avo, battleSceneMgr, mapView, position) {
            var _this = _super_1.call(this, avo, battleSceneMgr, mapView, position) || this;
            _this.light = 0;
            // if(this.effect){
            Tween.get(_this)
                .to({ lightNum: 1 }, 100)
                .wait(_this.targetObjList.length * 35 + 1000)
                .call(_this.recoveryColor, _this);
            return _this;
            // }
        }
        BingyuColorSkillAnimation.prototype.recoveryColor = function () {
            Tween.removeTweens(this);
            Tween.get(this)
                .to({ lightNum: 0 }, 500);
        };
        Object.defineProperty(BingyuColorSkillAnimation.prototype, "lightNum", {
            get: function () {
                return this.light;
            },
            set: function (num) {
                this.light = num;
                var r = -27 * num;
                var g = -27 * num;
                var b = 2 * num;
                var colorMatrix = [
                    1, 0, 0, 0, r,
                    0, 1, 0, 0, g,
                    0, 0, 1, 0, b,
                    0, 0, 0, 1, 0
                ];
                var fliter = new egret.ColorMatrixFilter(colorMatrix);
                // this.mapView.filters = [fliter];
                // if(num == 0){
                //     this.mapView.filters = [];
                // }
                this.battleSceneMgr.setColor(fliter);
            },
            enumerable: true,
            configurable: true
        });
        return BingyuColorSkillAnimation;
    }(com_main.ShandianqiuSkillAnimation));
    com_main.BingyuColorSkillAnimation = BingyuColorSkillAnimation;
})(com_main || (com_main = {}));

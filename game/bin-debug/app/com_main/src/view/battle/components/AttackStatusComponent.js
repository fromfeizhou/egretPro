/**
 * 攻击状态
 */
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
    var AttackStatusComponent = /** @class */ (function (_super_1) {
        __extends(AttackStatusComponent, _super_1);
        function AttackStatusComponent(attackStatus, hp, belong) {
            var _this = _super_1.call(this) || this;
            _this.light = 0;
            _this.width = 237;
            _this.height = 92;
            if (attackStatus == AttackResult.CRIT) {
                if (belong == BelongType.OWN) {
                    _this.createFont("baojiNum_fnt", "暴击" + hp);
                }
                else {
                    _this.createFont("baojiNumWhite_fnt", "暴击" + hp);
                }
            }
            else if (attackStatus == AttackResult.RESTRAIN) {
                if (belong == BelongType.OWN) {
                    _this.createFont("kezhiNum_fnt", "克制" + hp);
                }
                else {
                    _this.createFont("kezhiNum_grey_fnt", "克制" + hp);
                }
            }
            else {
                _this.createImage(AttackResultImage[attackStatus]);
            }
            return _this;
        }
        AttackStatusComponent.prototype.createImage = function (src) {
            this.m_image = new eui.Image();
            this.m_image.source = RES.getRes(src);
            this.m_image.x = 118;
            this.m_image.y = 46;
            AnchorUtil.setAnchor(this.m_image, 0.5);
            this.addChild(this.m_image);
        };
        AttackStatusComponent.prototype.createFont = function (fontSrc, word) {
            // this.num = new egret.BitmapText();
            this.num = ObjectPool.pop(egret.BitmapText, "egret.BitmapText");
            this.num.font = RES.getRes(fontSrc);
            this.num.text = word;
            this.num.x = 118;
            this.num.y = 46;
            this.num.letterSpacing = 0;
            AnchorUtil.setAnchor(this.num, 0.5);
            this.addChild(this.num);
        };
        Object.defineProperty(AttackStatusComponent.prototype, "lightNum", {
            get: function () {
                return this.light;
            },
            set: function (num) {
                this.light = num;
                var colorMatrix = [
                    1, 0, 0, 0, num,
                    0, 1, 0, 0, num,
                    0, 0, 1, 0, num,
                    0, 0, 0, 1, 0
                ];
                var fliter = new egret.ColorMatrixFilter(colorMatrix);
                this.filters = [fliter];
            },
            enumerable: true,
            configurable: true
        });
        AttackStatusComponent.prototype.onDestroy = function () {
            this.visible = false;
            this.filters = [];
            this.light = 0;
            if (this.num) {
                Utils.removeFromParent(this.num);
                this.num.text = '';
                AnchorUtil.setAnchor(this.num, 0);
                ObjectPool.push(this.num);
                this.num = null;
            }
            if (this.m_image) {
                Utils.removeFromParent(this.m_image);
                this.m_image = null;
            }
        };
        return AttackStatusComponent;
    }(eui.Component));
    com_main.AttackStatusComponent = AttackStatusComponent;
})(com_main || (com_main = {}));

/**部队进攻路线 */
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
    var AttackWay = /** @class */ (function (_super_1) {
        __extends(AttackWay, _super_1);
        function AttackWay(startPoint, endPoint) {
            var _this = _super_1.call(this) || this;
            _this.lineNun = 1;
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            var spr = new eui.Image("ImgArrow_1_png");
            _this.line = spr;
            spr.name = "line";
            spr.height = egret.Point.distance(endPoint, startPoint);
            spr.fillMode = egret.BitmapFillMode.REPEAT;
            var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
            spr.rotation = angle + 90;
            _this.addChild(spr);
            _this.x = endPoint.x;
            _this.y = endPoint.y;
            var crossServerConst = C.CrossServerConstConfig[CrossServerConstType.TEAM_MOVE_TIME];
            var time = Number(crossServerConst.value) * 1000;
            Tween.get(spr).wait(time).call(function () {
                Utils.removeFromParent(_this);
                _this.line = null;
            });
            return _this;
        }
        AttackWay.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
            this.onDestroy();
        };
        AttackWay.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.TimerManager.doFrame(5, 0, this.runLine, this);
        };
        AttackWay.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Tween.removeTweens(this.line);
            Utils.TimerManager.remove(this.runLine, this);
        };
        AttackWay.prototype.runLine = function () {
            if (this.line) {
                this.line.source = "ImgArrow_" + this.lineNun + "_png";
                this.lineNun += 1;
                if (this.lineNun > 3) {
                    this.lineNun = 1;
                }
            }
        };
        return AttackWay;
    }(com_main.CComponent));
    com_main.AttackWay = AttackWay;
})(com_main || (com_main = {}));

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
//跨服战动画
var com_main;
(function (com_main) {
    var CrossHero = /** @class */ (function (_super_1) {
        __extends(CrossHero, _super_1);
        function CrossHero(data) {
            var _this = _super_1.call(this) || this;
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            _this.m_data = data;
            return _this;
        }
        CrossHero.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            // var square = CSquare.createId(this.m_data.gId, false, true);
            var square = com_main.CSquare.createId(1008, false, true);
            square.test = true;
            this.square = square;
            this.addChild(this.square);
            square.changeStatus(2);
            var radian = Utils.MathUtils.getRadian2(this.m_data.startPoint.x, this.m_data.startPoint.y, this.m_data.endPoint.x, this.m_data.endPoint.y);
            var angle1 = Math.atan2(Math.sin(radian), Math.cos(radian)) * 180 / Math.PI;
            square.setDirectionOnAngle(angle1);
            var headInfo = new com_main.BattleHeadInfo();
            headInfo.anchorOffsetX = headInfo.width / 2;
            headInfo.anchorOffsetY = headInfo.height / 2;
            headInfo.x = 64;
            headInfo.y = -18 - 25;
            headInfo.showFactionName({ name: this.m_data.playerName, faction: this.m_data.faction });
            square.addChild(headInfo);
            this.x = this.m_data.startPoint.x;
            this.y = this.m_data.startPoint.y + 15;
            var crossServerConst = C.CrossServerConstConfig[CrossServerConstType.TEAM_MOVE_TIME];
            var time = Number(crossServerConst.value) * 1000;
            Tween.get(this).to({ x: this.m_data.endPoint.x, y: this.m_data.endPoint.y + 15 }, time).call(function () {
                Utils.removeFromParent(_this);
            });
        };
        CrossHero.prototype.onDestroy = function () {
            Tween.removeTweens(this);
        };
        return CrossHero;
    }(eui.Component));
    com_main.CrossHero = CrossHero;
})(com_main || (com_main = {}));

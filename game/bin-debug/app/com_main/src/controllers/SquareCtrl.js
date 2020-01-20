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
     * 方阵状态控制器
     */
    var SquareCtrl = /** @class */ (function (_super_1) {
        __extends(SquareCtrl, _super_1);
        function SquareCtrl() {
            return _super_1.call(this) || this;
        }
        SquareCtrl.prototype.register = function () {
            _super_1.prototype.register.call(this);
            com_main.EventMgr.addEvent(UnitNav.ACTION_FINISH, this.execute, this);
        };
        SquareCtrl.prototype.execute = function (notification) {
            // debug("SquareCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case UnitNav.ACTION_FINISH:
                    this.onActionFinish(body);
                    break;
                default:
                    break;
            }
        };
        SquareCtrl.prototype.onActionFinish = function (body) {
            var status = body["status"];
            if (status == CSquare_Status.STATUS_DEAD) {
                this.onDeadFinish(body);
            }
            else if (status == CSquare_Status.STATUS_ATTACK) {
                this.onAttackFinish(body);
            }
            else if (status == CSquare_Status.STATUS_FLY) {
                this.onAttackFinish(body);
            }
        };
        SquareCtrl.prototype.onDeadFinish = function (body) {
            var data = body["data"];
            if (!data) {
                debug("动画播放完，但是没找到数据删除！！");
                return;
            }
            var uid = data.elementId;
            var square = com_main.BattleSceneMgr.getInstance().getDynamicObj(uid, com_main.CSquare);
            if (square) {
                var tw = egret.Tween.get(square);
                tw.to({ "alpha": 0 }, Soldier_GoneTime);
                tw.call(function () {
                    //不移除，收到 BATTLE_UNIT_DISAPPEAR 再移除
                    BattleModel.removeUnit(uid);
                    if (com_main.BattleMap.getClass()) {
                        com_main.BattleSceneMgr.getInstance().removeUnitObj(uid);
                    }
                });
            }
        };
        SquareCtrl.prototype.onAttackFinish = function (body) {
            var uid = body["uid"];
            if (uid) {
                var square = com_main.BattleSceneMgr.getInstance().getDynamicObj(uid, com_main.CSquare);
                if (square) {
                    square.changeStatus(CSquare_Status.STATUS_STAND);
                }
            }
        };
        SquareCtrl.prototype.onHitFlyFinish = function (body) {
            var uid = body["uid"];
            if (uid) {
                var square = com_main.BattleSceneMgr.getInstance().getDynamicObj(uid, com_main.CSquare);
                if (square) {
                    square.changeStatus(CSquare_Status.STATUS_STAND);
                }
            }
        };
        return SquareCtrl;
    }(AGame.Controller));
    com_main.SquareCtrl = SquareCtrl;
})(com_main || (com_main = {}));

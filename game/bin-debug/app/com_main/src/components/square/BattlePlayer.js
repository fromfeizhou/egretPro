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
    var BattlePlayer = /** @class */ (function (_super_1) {
        __extends(BattlePlayer, _super_1);
        function BattlePlayer(generalId) {
            var _this = _super_1.call(this) || this;
            _this.m_positionList = [[150, 294], [224, 241], [445, 104], [361, 141]];
            _this.m_centerList = [[241, 217], [251, 210], [358, 153], [319, 174]];
            _this.m_dirList = [CSquare_Direction.RIGHT_UP, CSquare_Direction.RIGHT_UP, CSquare_Direction.LEFT_DOWN, CSquare_Direction.LEFT_DOWN];
            _this.m_squareList = [];
            _this.generalId = generalId;
            _this.initSquare();
            return _this;
        }
        BattlePlayer.prototype.onDestroy = function () {
            if (this.m_skillEffect) {
                this.m_skillEffect.destroy();
            }
            for (var i = 0; i <= 3; i++) {
                var square = this.m_squareList[i];
                egret.Tween.removeTweens(square);
                square.onDestroy();
            }
        };
        BattlePlayer.prototype.initSquare = function () {
            this.width = 600;
            this.height = 400;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            var heroList = [1001, 1002];
            var positionList = this.m_positionList;
            var gconfig = GeneralModel.getGeneralConfig(1009);
            var gCid = gconfig.ourModelCode;
            var armCfg = C.GeneralSoldierLvConfig[gconfig.armyType];
            var cid = armCfg.ourModelCode;
            this.m_pSoldier = com_main.CSquare.createId(cid, true, true);
            this.m_pSoldier.x = 150;
            this.m_pSoldier.y = 294;
            this.m_pSoldier.test = true;
            this.m_pSoldier.changeDirection(CSquare_Direction.RIGHT_UP);
            this.m_pSoldier.changeStatus(CSquare_Status.STATUS_STAND);
            this.addChild(this.m_pSoldier);
            this.m_squareList.push(this.m_pSoldier);
            this.m_pHero = com_main.CSquare.createId(gCid, true, true);
            this.m_pHero.x = 224;
            this.m_pHero.y = 241;
            this.m_pHero.test = true;
            this.m_pHero.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_pHero.changeDirection(CSquare_Direction.RIGHT_UP);
            this.addChild(this.m_pHero);
            this.m_squareList.push(this.m_pHero);
            //////////////////////////////////////////////
            //右上小兵
            gconfig = GeneralModel.getGeneralConfig(1005);
            armCfg = C.GeneralSoldierLvConfig[gconfig.armyType];
            gCid = gconfig.ourModelCode;
            cid = armCfg.ourModelCode;
            this.m_pSoldier1 = com_main.CSquare.createId(cid, true, true);
            this.m_pSoldier1.x = 445;
            this.m_pSoldier1.y = 104;
            this.m_pSoldier1.test = true;
            this.m_pSoldier1.changeDirection(CSquare_Direction.LEFT_DOWN);
            this.m_pSoldier1.changeStatus(CSquare_Status.STATUS_STAND);
            this.addChild(this.m_pSoldier1);
            this.m_squareList.push(this.m_pSoldier1);
            this.m_pHero1 = com_main.CSquare.createId(gCid, true, true);
            this.m_pHero1.x = 361;
            this.m_pHero1.y = 141;
            this.m_pHero1.test = true;
            this.m_pHero1.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_pHero1.changeDirection(CSquare_Direction.LEFT_DOWN);
            this.addChild(this.m_pHero1);
            this.m_squareList.push(this.m_pHero1);
            // this.m_pHero1.addSoldierToMap();
        };
        BattlePlayer.prototype.moveCenter = function () {
            var centerList = this.m_centerList;
            var positionList = this.m_positionList;
            var _loop_1 = function (i) {
                var square = this_1.m_squareList[i];
                square.manual = true;
                square.x = positionList[i][0];
                square.y = positionList[i][1];
                square.visible = true;
                square.changeDirection(this_1.m_dirList[i]);
                square.changeStatus(CSquare_Status.STATUS_WALK);
                egret.Tween.removeTweens(square);
                var tw = egret.Tween.get(square);
                tw.to({ x: centerList[i][0], y: centerList[i][1] }, this_1.calculateTime(new egret.Point(square.x, square.y), new egret.Point(centerList[i][0], centerList[i][1])));
                tw.call(function () {
                    square.changeStatus(CSquare_Status.STATUS_ATTACK);
                });
            };
            var this_1 = this;
            for (var i in this.m_squareList) {
                _loop_1(i);
            }
        };
        BattlePlayer.prototype.returnInit = function () {
            var positionList = this.m_positionList;
            //右上小兵返回 
            var sq1 = this.m_squareList[0];
            var sq2 = this.m_squareList[1];
            sq1.visible = false;
            sq2.visible = false;
            for (var i = 2; i <= 3; i++) {
                var square = this.m_squareList[i];
                square.changeStatus(CSquare_Status.STATUS_WALK);
                square.changeDirection(CSquare_Direction.RIGHT_UP);
                egret.Tween.removeTweens(square);
                var tw = egret.Tween.get(square);
                tw.to({ x: positionList[i][0], y: positionList[i][1] }, 2000);
                tw.call(function () {
                    // square.changeDirection(CSquare_Direction.LEFT_DOWN);
                    // square.changeStatus(CSquare_Status.STATUS_STAND);
                    // square.manualChangeStand(CSquare_Direction.LEFT_DOWN);
                });
            }
            if (this.m_skillEffect) {
                this.m_skillEffect.stop();
                this.m_skillEffect.visible = false;
            }
        };
        BattlePlayer.prototype.calculateTime = function (point1, point2) {
            var dis = egret.Point.distance(point1, point2);
            return dis / 30 * 1000;
        };
        BattlePlayer.prototype.playSkillEffect = function () {
            var effectMC;
            var animation = "luojian";
            if (this.m_skillEffect) {
                effectMC = this.m_skillEffect;
            }
            else {
                effectMC = new MCDragonBones();
                effectMC.initAsync(animation);
                this.m_skillEffect = effectMC;
            }
            effectMC.visible = true;
            effectMC.play(animation, 0, false);
            effectMC.x = this.width / 2;
            effectMC.y = this.height / 2;
            this.addChild(effectMC);
        };
        return BattlePlayer;
    }(egret.DisplayObjectContainer));
    com_main.BattlePlayer = BattlePlayer;
})(com_main || (com_main = {}));

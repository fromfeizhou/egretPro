var com_main;
(function (com_main) {
    var CSquareFunc = /** @class */ (function () {
        function CSquareFunc() {
        }
        /**
         * 根据状态获取动画对应的状态字符
         */
        CSquareFunc.getActionCharByStatus = function (status) {
            var strStatus = "";
            switch (status) {
                case CSquare_Status.STATUS_STAND:
                    strStatus = "s";
                    break;
                case CSquare_Status.STATUS_WALK:
                    strStatus = "w";
                    break;
                case CSquare_Status.STATUS_ATTACK:
                    strStatus = "a";
                    break;
                case CSquare_Status.STATUS_DEAD:
                    strStatus = "d";
                    break;
                case CSquare_Status.STATUS_FLY:
                    strStatus = "f";
                    break;
                default:
                    error("status : " + status + " has no match char!");
                    break;
            }
            return strStatus;
        };
        /**
         * 根据状态获取士兵位置
         */
        CSquareFunc.getPositionListConfig = function (status, id, direction, targetNumber, oldDirection) {
            var config;
            var configId = "";
            var strStatus = "";
            var code = 0;
            if (id == SoilderType.RedCavalry || id == SoilderType.BlueCavalry) {
                code = 101;
            }
            else if (id == SoilderType.RedInfantry || id == SoilderType.blueInfantry) {
                code = 100;
            }
            else if (id == SoilderType.RedArchers || id == SoilderType.BlueArchers) {
                code = 102;
            }
            else if (id == SoilderType.RedPIKEMAN || id == SoilderType.BluePIKEMAN) {
                code = 103;
            }
            switch (status) {
                case CSquare_Status.STATUS_STAND:
                    strStatus = "s";
                    config = UnitData.getSquareSoldierPositionConfig(code + "_7_" + strStatus);
                    break;
                case CSquare_Status.STATUS_WALK:
                    strStatus = "w";
                    if (code == 102 || code == 100) { //步兵 弓兵一样
                        if (direction == CSquare_Direction.RIGHT_UP
                            || direction == CSquare_Direction.LEFT || direction == CSquare_Direction.RIGHT || direction == CSquare_Direction.LEFT_UP || direction == CSquare_Direction.RIGHT_DOWN) {
                            config = UnitData.getSquareSoldierPositionConfig(100 + "_7_" + strStatus);
                            // }else if(direction == CSquare_Direction.LEFT_UP || direction == CSquare_Direction.RIGHT_DOWN){
                            // 	config = UnitData.getSquareSoldierPositionConfig(100 + "_5_" + strStatus );
                        }
                        else if (direction == CSquare_Direction.LEFT_DOWN) {
                            config = UnitData.getSquareSoldierPositionConfig(100 + "_3_" + strStatus);
                        }
                        else {
                            config = UnitData.getSquareSoldierPositionConfig(100 + "_7_" + strStatus);
                        }
                    }
                    else if (code == 101) { //骑兵
                        if (oldDirection == CSquare_Direction.DOWN) {
                            if (direction == CSquare_Direction.LEFT) {
                                direction = CSquare_Direction.LEFT_DOWN;
                            }
                            else if (direction == CSquare_Direction.RIGHT) {
                                direction = CSquare_Direction.RIGHT_DOWN;
                            }
                        }
                        else if (oldDirection == CSquare_Direction.UP) {
                            if (direction == CSquare_Direction.LEFT) {
                                direction = CSquare_Direction.LEFT_UP;
                            }
                            else if (direction == CSquare_Direction.RIGHT) {
                                direction = CSquare_Direction.RIGHT_UP;
                            }
                        }
                        else {
                            if (direction == CSquare_Direction.LEFT || direction == CSquare_Direction.RIGHT) {
                                direction = CSquare_Direction.RIGHT_UP;
                            }
                        }
                        config = UnitData.getSquareSoldierPositionConfig(code + "_" + direction + "_" + strStatus);
                    }
                    break;
                case CSquare_Status.STATUS_ATTACK:
                    strStatus = "a";
                    if (code == 100 || code == 101) { //步兵 骑兵一样
                        code = 100;
                        if (targetNumber && targetNumber < 5) {
                            config = UnitData.getSquareSoldierPositionConfig(code + "_" + direction + "_" + strStatus + "_less");
                        }
                        else {
                            config = UnitData.getSquareSoldierPositionConfig(code + "_" + direction + "_" + strStatus);
                        }
                    }
                    break;
                case CSquare_Status.STATUS_DEAD:
                    strStatus = "d";
                    break;
                default:
                    error("status : " + status + " has no match char!");
                    break;
            }
            return config;
        };
        /**
         * 根据状态获取士兵位置
         */
        CSquareFunc.getAttackEffectId = function (direction, isplayer) {
            var effectId = 0;
            var isReversal = false; //是否翻转
            switch (direction) {
                case CSquare_Direction.RIGHT_DOWN:
                    effectId = 53;
                    break;
                case CSquare_Direction.DOWN:
                    effectId = 53;
                    isReversal = true;
                    break;
                case CSquare_Direction.LEFT_DOWN:
                    effectId = 53;
                    isReversal = true;
                    break;
                case CSquare_Direction.LEFT:
                    effectId = 52;
                    isReversal = true;
                    break;
                case CSquare_Direction.LEFT_UP:
                    effectId = 52;
                    isReversal = true;
                    break;
                case CSquare_Direction.UP:
                    effectId = 52;
                    break;
                case CSquare_Direction.RIGHT_UP:
                    effectId = 52;
                    break;
                case CSquare_Direction.RIGHT:
                    effectId = 52;
                    break;
                default:
                    //sayError("direction : " + direction + " has no match!");
                    break;
            }
            if (!isplayer) {
                if (effectId == 52) {
                    effectId = 50;
                }
                else if (effectId == 53) {
                    effectId = 51;
                }
            }
            return { effectId: effectId, isReversal: isReversal };
        };
        /**
         * 根据方向获取动画对应的方向字符
         */
        CSquareFunc.getActionCharByDirection = function (direction, oldDirection) {
            switch (direction) {
                case CSquare_Direction.LEFT_UP:
                    direction = CSquare_Direction.RIGHT_UP;
                    break;
                case CSquare_Direction.LEFT:
                    if (oldDirection == CSquare_Direction.UP) {
                        direction = CSquare_Direction.RIGHT_UP;
                    }
                    else {
                        direction = CSquare_Direction.RIGHT_DOWN;
                    }
                    break;
                case CSquare_Direction.RIGHT:
                    if (oldDirection == CSquare_Direction.UP) {
                        direction = CSquare_Direction.RIGHT_UP;
                    }
                    else {
                        direction = CSquare_Direction.RIGHT_DOWN;
                    }
                    break;
                case CSquare_Direction.LEFT_DOWN:
                    direction = CSquare_Direction.RIGHT_DOWN;
                    break;
                case CSquare_Direction.UP:
                    direction = CSquare_Direction.RIGHT_UP;
                    break;
                case CSquare_Direction.DOWN:
                    direction = CSquare_Direction.RIGHT_DOWN;
                    break;
                default:
                    //sayError("direction : " + direction + " has no match!");
                    break;
            }
            return direction;
        };
        /**
         * 根据方向方阵朝向  斜上 斜下 4个方向
         */
        CSquareFunc.getFourDirection = function (direction, oldDirection) {
            switch (direction) {
                case CSquare_Direction.LEFT_UP:
                    direction = CSquare_Direction.LEFT_UP;
                    break;
                case CSquare_Direction.LEFT:
                    if (oldDirection == CSquare_Direction.UP) {
                        direction = CSquare_Direction.LEFT_UP;
                    }
                    else {
                        direction = CSquare_Direction.LEFT_DOWN;
                    }
                    break;
                case CSquare_Direction.RIGHT:
                    if (oldDirection == CSquare_Direction.UP) {
                        direction = CSquare_Direction.RIGHT_UP;
                    }
                    else {
                        direction = CSquare_Direction.RIGHT_DOWN;
                    }
                    break;
                case CSquare_Direction.LEFT_DOWN:
                    direction = CSquare_Direction.LEFT_DOWN;
                    break;
                case CSquare_Direction.UP:
                    direction = CSquare_Direction.RIGHT_UP;
                    break;
                case CSquare_Direction.DOWN:
                    direction = CSquare_Direction.LEFT_DOWN;
                    break;
                default:
                    //sayError("direction : " + direction + " has no match!");
                    break;
            }
            return direction;
        };
        /**
         * 根据方向获取特效旋转角度
         */
        CSquareFunc.getEffectRotationByDirection = function (direction) {
            var effectRotation = 0;
            switch (direction) {
                case CSquare_Direction.DOWN:
                    effectRotation = 270;
                    break;
                case CSquare_Direction.LEFT:
                    effectRotation = 0;
                    break;
                case CSquare_Direction.LEFT_DOWN:
                    effectRotation = 315;
                    break;
                case CSquare_Direction.LEFT_UP:
                    effectRotation = 45;
                    break;
                case CSquare_Direction.RIGHT:
                    effectRotation = 180;
                    break;
                case CSquare_Direction.RIGHT_DOWN:
                    effectRotation = 225;
                    break;
                case CSquare_Direction.RIGHT_UP:
                    effectRotation = 135;
                    break;
                case CSquare_Direction.UP:
                    effectRotation = 90;
                    break;
            }
            return effectRotation;
        };
        /**
         * 根据旋转角度获取特效方向
         */
        CSquareFunc.getEffectDirectionByRotation = function (angle) {
            var temp = CSquare_Direction.RIGHT;
            if ((angle <= 0 && angle >= (ActorDirAngle.Right - AngleDirection / 2))
                || (angle >= 0 && angle <= (ActorDirAngle.Right + AngleDirection / 2))) {
                temp = CSquare_Direction.RIGHT;
            }
            else if (angle >= (ActorDirAngle.RightUp - AngleDirection / 2)
                && angle <= (ActorDirAngle.RightUp + AngleDirection / 2)) {
                temp = CSquare_Direction.RIGHT_UP;
            }
            else if (angle >= (ActorDirAngle.Up - AngleDirection / 2)
                && angle <= (ActorDirAngle.Up + AngleDirection / 2)) {
                temp = CSquare_Direction.UP;
            }
            else if (angle >= (ActorDirAngle.LeftUp - AngleDirection / 2)
                && angle <= (ActorDirAngle.LeftUp + AngleDirection / 2)) {
                temp = CSquare_Direction.LEFT_UP;
            }
            else if (angle >= (ActorDirAngle.Left - AngleDirection / 2)
                || angle <= (AngleDirection / 2 - ActorDirAngle.Left)) {
                temp = CSquare_Direction.LEFT;
            }
            else if (angle >= (ActorDirAngle.LeftDown - AngleDirection / 2)
                && angle <= (ActorDirAngle.LeftDown + AngleDirection / 2)) {
                temp = CSquare_Direction.LEFT_DOWN;
            }
            else if (angle >= (ActorDirAngle.Down - AngleDirection / 2)
                && angle <= (ActorDirAngle.Down + AngleDirection / 2)) {
                temp = CSquare_Direction.DOWN;
            }
            else if (angle >= (ActorDirAngle.RightDown - AngleDirection / 2)
                && angle <= (ActorDirAngle.RightDown + AngleDirection / 2)) {
                temp = CSquare_Direction.RIGHT_DOWN;
            }
            else {
                // debug("玩家转向角度：", angle);
            }
            return temp;
        };
        /**
         * 获取方阵排列
         */
        CSquareFunc.getSquareGrid = function (type) {
            var grid = null;
            var row = 3;
            var num = 0;
            switch (type) {
                case CSquare_Type.TYPE_1:
                    grid = CSquare_Grid1x1;
                    break;
                case CSquare_Type.TYPE_2:
                    grid = CSquare_Grid2x2;
                    break;
                case CSquare_Type.TYPE_2_1:
                    grid = CSquare_Grid2x2_1;
                    break;
                case CSquare_Type.TYPE_2_2:
                    grid = CSquare_Grid2x2_2;
                    break;
                case CSquare_Type.TYPE_3:
                    grid = CSquare_Grid3x3;
                    break;
                case CSquare_Type.TYPE_4:
                    grid = CSquare_Grid4x3;
                    row = 4;
                    break;
                case CSquare_Type.TYPE_5:
                    grid = CSquare_Grid5x3;
                    row = 5;
                case CSquare_Type.TYPE_3_1:
                    grid = CSquare_Grid4x3_8;
                    row = 4;
                    break;
                case CSquare_Type.TYPE_2X4:
                    grid = CSquare_Grid2x4_8;
                    row = 4;
                    break;
                default:
                    error("can not find " + type + " of CSquare_Type");
                    break;
            }
            return { "grid": grid, "row": row, "num": num };
        };
        /**
         * 获取对象的中心点
         */
        CSquareFunc.getObjectCenter = function (target) {
            var point = {};
            point["x"] = target.width * 0.5;
            point["y"] = target.height * 0.5;
            return point;
        };
        /**
         * 画对象区域
         */
        CSquareFunc.drawTargetArea = function (target, color) {
            if (color === void 0) { color = 0x00FF00; }
            var shape = new egret.Shape();
            shape.graphics.clear();
            shape.graphics.beginFill(0x00FF00, 0.5);
            shape.graphics.drawRect(target.x, target.y, target.width, target.height);
            shape.graphics.endFill();
            // this.addChild(shape);
            return shape;
        };
        /**
         * 震开效果
         * obj 要处理的对象
         * gzX 原爆点X
         * gzY 原爆点Y
         * dis 炸飞距离
         */
        CSquareFunc.flick = function (obj, gzX, gzY, dis) {
            if (gzX === void 0) { gzX = 0; }
            if (gzY === void 0) { gzY = 0; }
            if (dis === void 0) { dis = 10; }
            var ox = obj.x;
            var oy = obj.y;
            var dx = obj.x - gzX;
            var dy = obj.y - gzY;
            var at = Math.atan2(dy, dx);
            var x = obj.x + Math.cos(at) * dis;
            var y = obj.y + Math.sin(at) * dis;
            var tw = egret.Tween.get(obj);
            tw.to({ "x": x, "y": y }, 200);
            tw.wait(100);
            tw.to({ "x": ox, "y": oy }, 200);
        };
        /**
         * 飘血效果
         */
        CSquareFunc.hpChangeAction = function (obj, height, callback, thisArg) {
            obj.y = -80;
            obj.alpha = 0;
            egret.Tween.get(obj)
                .to({ y: -35, alpha: 1 }, 100)
                .to({ y: -50 }, 100)
                .wait(400)
                .to({ y: -130, alpha: 0 }, 450) //, egret.Ease.backOut)
                // .to({
                // 	alpha: 0,
                // 	y: height - 400
                // }, 300)
                .call(callback, thisArg);
            // egret.Tween.get(obj)
            // 	.wait(600)
            // 	.to({
            // 		alpha: 0,
            // 	}, 700);
        };
        /**
         *
         */
        CSquareFunc.battleInfoAction = function (obj, callback, thisArg) {
            obj.scaleX = 0.8;
            obj.scaleY = 0.8;
            obj.alpha = 0;
            egret.Tween.get(obj)
                .to({ scaleX: 2.2, scaleY: 2.2, alpha: 1 }, 100) //, egret.Ease.backOut)
                .to({ scaleX: 1.5, scaleY: 1.5 }, 100) //, egret.Ease.backOut)
                .wait(200)
                .to({ alpha: 0 }, 450)
                .call(callback, thisArg);
        };
        /**
         * 突击动画
         */
        CSquareFunc.strikeAction = function (obj) {
            var tw = egret.Tween.get(obj);
        };
        /**
         * 获取死亡后退位置
         */
        CSquareFunc.getDiePosition = function (direction, oldDirection) {
            //斜度按30度算
            var step = ConstUtil.getValue(IConstEnum.BATTLE_SOLDIER_DIE_DIS);
            var point = new egret.Point();
            if (direction == CSquare_Direction.DOWN || direction == CSquare_Direction.LEFT_DOWN) {
                point.x = 0.86 * step;
                point.y = -0.5 * step;
            }
            else if (direction == CSquare_Direction.RIGHT_DOWN) {
                point.x = -0.86 * step;
                point.y = -0.5 * step;
            }
            else if (direction == CSquare_Direction.RIGHT_UP
                || direction == CSquare_Direction.UP) {
                point.x = -0.86 * step;
                point.y = 0.5 * step;
            }
            else if (direction == CSquare_Direction.LEFT_UP) {
                point.x = 0.86 * step;
                point.y = 0.5 * step;
            }
            else if (direction == CSquare_Direction.RIGHT) {
                if (oldDirection == CSquare_Direction.UP) {
                    point.x = -0.86 * step;
                    point.y = 0.5 * step;
                }
                else {
                    point.x = -0.86 * step;
                    point.y = -0.5 * step;
                }
            }
            else if (direction == CSquare_Direction.LEFT) {
                if (oldDirection == CSquare_Direction.UP) {
                    point.x = 0.86 * step;
                    point.y = 0.5 * step;
                }
                else {
                    point.x = 0.86 * step;
                    point.y = -0.5 * step;
                }
            }
            return point;
        };
        return CSquareFunc;
    }());
    com_main.CSquareFunc = CSquareFunc;
})(com_main || (com_main = {}));

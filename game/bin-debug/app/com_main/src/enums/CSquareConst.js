/**
 * 方阵宽
 */
var Square_Width = 128;
/**
 * 方阵高
 */
var Square_Height = 64;
/**
 * 士兵死亡消失时间(毫秒)
 */
var Soldier_GoneTime = 1000;
/**
 * 士兵缩放
 */
var Soldier_Scale = 1;
/**
 *  方向
 *
 *  5  6  7
 *  4     8
 *  3  2  1
 *  8个方向
 */
var CSquare_Direction;
(function (CSquare_Direction) {
    CSquare_Direction[CSquare_Direction["RIGHT_DOWN"] = 1] = "RIGHT_DOWN";
    CSquare_Direction[CSquare_Direction["DOWN"] = 2] = "DOWN";
    CSquare_Direction[CSquare_Direction["LEFT_DOWN"] = 3] = "LEFT_DOWN";
    CSquare_Direction[CSquare_Direction["LEFT"] = 4] = "LEFT";
    CSquare_Direction[CSquare_Direction["LEFT_UP"] = 5] = "LEFT_UP";
    CSquare_Direction[CSquare_Direction["UP"] = 6] = "UP";
    CSquare_Direction[CSquare_Direction["RIGHT_UP"] = 7] = "RIGHT_UP";
    CSquare_Direction[CSquare_Direction["RIGHT"] = 8] = "RIGHT"; //右
})(CSquare_Direction || (CSquare_Direction = {}));
/**
 * 方阵整体状态
 */
var CSquare_Status;
(function (CSquare_Status) {
    CSquare_Status[CSquare_Status["STATUS_STAND"] = 1] = "STATUS_STAND";
    CSquare_Status[CSquare_Status["STATUS_WALK"] = 2] = "STATUS_WALK";
    CSquare_Status[CSquare_Status["STATUS_ATTACK"] = 3] = "STATUS_ATTACK";
    CSquare_Status[CSquare_Status["STATUS_DEAD"] = 4] = "STATUS_DEAD";
    CSquare_Status[CSquare_Status["STATUS_FLY"] = 5] = "STATUS_FLY";
})(CSquare_Status || (CSquare_Status = {}));
/**
 * 方阵类型
 */
var CSquare_Type;
(function (CSquare_Type) {
    CSquare_Type[CSquare_Type["TYPE_1"] = 1] = "TYPE_1";
    CSquare_Type[CSquare_Type["TYPE_2"] = 2] = "TYPE_2";
    CSquare_Type[CSquare_Type["TYPE_3"] = 3] = "TYPE_3";
    CSquare_Type[CSquare_Type["TYPE_4"] = 4] = "TYPE_4";
    CSquare_Type[CSquare_Type["TYPE_5"] = 5] = "TYPE_5";
    CSquare_Type[CSquare_Type["TYPE_3_1"] = 8] = "TYPE_3_1";
    CSquare_Type[CSquare_Type["TYPE_2_1"] = 20] = "TYPE_2_1";
    CSquare_Type[CSquare_Type["TYPE_2_2"] = 21] = "TYPE_2_2";
    CSquare_Type[CSquare_Type["TYPE_2X4"] = 22] = "TYPE_2X4";
})(CSquare_Type || (CSquare_Type = {}));
/**
 * 1x1方阵排列
 */
var CSquare_Grid1x1 = [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0
];
/**
 * 2x2方阵排列
 */
var CSquare_Grid2x2 = [
    0, 1, 0,
    4, 0, 2,
    0, 3, 0
];
/**
 * 2x2方阵排列(5个人的...)
 */
var CSquare_Grid2x2_1 = [
    0, 2, 0,
    5, 1, 3,
    0, 4, 0
];
/**
 * 2x2方阵排列(3个人的...)
 */
var CSquare_Grid2x2_2 = [
    0, 1, 0,
    2, 0, 0,
    0, 0, 3
];
/**
 * 3x3方阵排列
 */
var CSquare_Grid3x3 = [
    9, 5, 6,
    4, 1, 2,
    8, 3, 7
];
/**
 * 4x3六边形排列
 */
var CSquare_Grid4x3 = [
    0, 1, 2, 0,
    3, 0, 0, 4,
    0, 5, 6, 0
];
/**
 * 5x3六边形排列
 */
var CSquare_Grid5x3 = [
    0, 1, 0, 2, 0,
    3, 0, 7, 0, 4,
    0, 5, 0, 6, 0
];
var CSquare_Grid4x3_8 = [
    0, 1, 2, 0,
    3, 4, 5, 6,
    0, 7, 8, 0
];
var CSquare_Grid2x4_8 = [
    6, 1, 2, 5,
    7, 3, 4, 8,
];

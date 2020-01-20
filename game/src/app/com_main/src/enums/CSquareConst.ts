
/**
 * 方阵宽
 */
const Square_Width = 128;
/**
 * 方阵高
 */
const Square_Height = 64;

/**
 * 士兵死亡消失时间(毫秒)
 */
const Soldier_GoneTime = 1000;

/**
 * 士兵缩放
 */
const Soldier_Scale = 1;

/**
 *  方向
 * 
 *  5  6  7
 *  4     8
 *  3  2  1
 *  8个方向
 */
enum CSquare_Direction {
    RIGHT_DOWN = 1,//右下
    DOWN = 2,//下
    LEFT_DOWN = 3,//左下
    LEFT = 4,//左
    LEFT_UP = 5,//左上
    UP = 6,//上
    RIGHT_UP = 7,//右上
    RIGHT = 8//右
}

/**
 * 方阵整体状态
 */
enum CSquare_Status {
    STATUS_STAND = 1,//站立状态
    STATUS_WALK = 2,//步行状态
    STATUS_ATTACK = 3,//普通攻击状态
    STATUS_DEAD = 4,//死亡状态
    STATUS_FLY = 5,//击飞状态
}

/**
 * 方阵类型
 */
enum CSquare_Type {
    TYPE_1 = 1,//1*1
    TYPE_2 = 2,//2*2
    TYPE_3 = 3,//3*3
    TYPE_4 = 4,//4*3
    TYPE_5 = 5,//5*3

    TYPE_3_1 = 8,//8人6边形  斜45度

    TYPE_2_1 = 20,//2*2 十字形,5个人...
    TYPE_2_2 = 21,//2*2 十字形,3个人...

    TYPE_2X4 = 22,//8人 两排4个人
}

/**
 * 1x1方阵排列
 */
const CSquare_Grid1x1: number[] = [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0
]

/**
 * 2x2方阵排列
 */
const CSquare_Grid2x2: number[] = [
    0, 1, 0,
    4, 0, 2,
    0, 3, 0
]

/**
 * 2x2方阵排列(5个人的...)
 */
const CSquare_Grid2x2_1: number[] =[
    0, 2, 0,
    5, 1, 3,
    0, 4, 0
]

/**
 * 2x2方阵排列(3个人的...)
 */
const CSquare_Grid2x2_2: number[] =[
    0, 1, 0,
    2, 0, 0,
    0, 0, 3
]

/**
 * 3x3方阵排列
 */
const CSquare_Grid3x3: number[] = [
    9, 5, 6,
    4, 1, 2,
    8, 3, 7
]

/**
 * 4x3六边形排列
 */
const CSquare_Grid4x3: number[] = [
    0, 1, 2, 0,
    3, 0, 0, 4,
    0, 5, 6, 0
]

/**
 * 5x3六边形排列
 */
const CSquare_Grid5x3: number[] = [
    0, 1, 0, 2, 0,
    3, 0, 7, 0, 4,
    0, 5, 0, 6, 0
]

const CSquare_Grid4x3_8: number[] = [
    0, 1, 2, 0,
    3, 4, 5, 6,
    0, 7, 8, 0
]

const CSquare_Grid2x4_8: number[] = [
    6, 1, 2, 5,
    7, 3, 4, 8,
]



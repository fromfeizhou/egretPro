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
/**
 * Created by yangsong on 2014/11/22.
 * 数学计算工具类
 */
var MathUtils = /** @class */ (function (_super_1) {
    __extends(MathUtils, _super_1);
    function MathUtils() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    /**
     * 设A（x1,y1) B(x2,y2)
     * 则中点坐标x=(x1+x2)/2,y=(y1+y2)/2
     */
    MathUtils.prototype.getMid2Pos = function (start, end) {
        return { x: (start.x + end.x) * 0.5, y: (start.y + end.y) * 0.5 };
    };
    /**
     * 获取两点间角度
     * @returns {number}
     */
    MathUtils.prototype.getPosAngle = function (start, end) {
        var radian = this.getRadian2(start.x, start.y, end.x, end.y);
        return this.getAngle(radian);
    };
    /**
     * 获取两点间弧度
     * @returns {number}
     */
    MathUtils.prototype.getPosRadian2 = function (start, end) {
        return this.getRadian2(start.x, start.y, end.x, end.y);
    };
    /**
     * 获取两点间距离
     * @returns {number}
     */
    MathUtils.prototype.getPosDis = function (start, end) {
        return this.getDistance(start.x, start.y, end.x, end.y);
    };
    /**
     * 弧度制转换为角度值
     * 角度 = 180°×弧度÷π
     * @param radian 弧度制
     * @returns {number}
     */
    MathUtils.prototype.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * 弧度 = 角度×π÷180°
     * @param angle
     */
    MathUtils.prototype.getRadian = function (angle) {
        return angle * Math.PI / 180;
    };
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.prototype.getRadian2 = function (p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.prototype.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    /**
     * 设A（x1,y1) B(x2,y2)
     * 则中点坐标x=(x1+x2)/2,y=(y1+y2)/2
     */
    MathUtils.prototype.getMiddle2Point = function (p1X, p1Y, p2X, p2Y) {
        return new egret.Point((p1X + p2X) / 2, (p1Y + p2Y) / 2);
    };
    /**
     * 计算格子的对角线长度
     * @param x
     * @param y
     * @return
     */
    MathUtils.prototype.getDiagonal = function (x, y) {
        return parseInt(Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))).toFixed());
    };
    /**
     * 1. (yb-ya)/(xb-xa)= (yd - yb)/(xd-xb)
     * 2. (yd-yb)^2 + (xd-xb)^2 = d^2
     *
     * 假设
     * yab = yb-ya, xab = xb-xa
     * ybd = yd-yb, xbd = xd-xb
     * =>
     * 3. yab/xab = ybd/xbd
     * 4. ybd^2 + xbd^2 = d^2
     *
     * 由3得到
     * 5 ybd = (yab/xab)*xbd
     * 5 带入 4 得到
     *
     * 6. ((yab/xab)*xbd)^2 + xbd^2 = d^2
     * =>
     * 7. (xbd^2) * ((yab/xab)^2 + 1) = d^2
     * =>
     * 8. xbd^2 = (d^2)/((yab/xab)^2 + 1)
     *
     * 需要注意的是
     * 1. yb-ya 和 yd-yb 的符号必须保持一致(因为在延长线上)
     * 2. 暂时没有考虑 xb - xa == 0的情况
     *
     * xa, ya: A 点坐标
     * xb, yb: B 点坐标
     * d: D点到B点的距离
     * return D 点坐标
     *
     * this.foo(+0.0, +0.0, +1.0, +1.0, 2); 第一象限
     * this.foo(+0.0, +0.0, -1.0, +1.0, 2); 第二象限
     * this.foo(+0.0, +0.0, -1.0, -1.0, 2); 第三象限
     * this.foo(+0.0, +0.0, +1.0, -1.0, 2); 第四象限
     */
    MathUtils.prototype.foo = function (xa, ya, xb, yb, d) {
        var xab, yab;
        var xbd, ybd;
        var xd, yd;
        xab = xb - xa;
        yab = yb - ya;
        xbd = Math.sqrt((d * d) / ((yab / xab) * (yab / xab) + 1));
        if (xab > 0) {
            xbd = Math.sqrt((d * d) / ((yab / xab) * (yab / xab) + 1));
        }
        else {
            xbd = -Math.sqrt((d * d) / ((yab / xab) * (yab / xab) + 1));
        }
        xd = xb + xbd;
        yd = yb + yab / xab * xbd;
        egret.log("xd=%f,yd=%f\n", xd, yd);
        return egret.Point.create(xd, yd);
    };
    /**
     * 值限制范围
     * @param val
     * @param min 默认值0
     * @param max 默认值1
     */
    MathUtils.prototype.val2Range = function (val, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        val = Math.max(min, val);
        val = Math.min(max, val);
        return val;
    };
    return MathUtils;
}(BaseClass));

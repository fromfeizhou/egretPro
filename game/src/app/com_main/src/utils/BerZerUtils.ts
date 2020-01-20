/**
 * Created by Yong on 2016/7/5.
 */
class BerZerUtils {
    public static getBerZerPoints(point_num: number, P0: egret.Point, PM: egret.Point, Ctrlpoints: any[], getRotation = false) {
        var length = Ctrlpoints.length;
        point_num = point_num * 2;
        var factor = 0;
        var change_factor = 1 / point_num;

        var point_list = [];
        for (var i = 0; i < point_num; i++) {
            var x = 0;
            var y = 0;
            var rotationX = 0;
            var rotationY = 0;
            var rotation = 0;
            if (length == 2) {
                x = this.get3BerZerValue(factor, P0.x, Ctrlpoints[0].x, Ctrlpoints[1].x, PM.x);
                y = this.get3BerZerValue(factor, P0.y, Ctrlpoints[0].y, Ctrlpoints[1].y, PM.y);
                if (getRotation) {
                    rotationX = this.get3BerZerRotation(factor, P0.x, Ctrlpoints[0].x, Ctrlpoints[1].x, PM.x);
                    rotationY = this.get3BerZerRotation(factor, P0.y, Ctrlpoints[0].y, Ctrlpoints[1].y, PM.y);
                    rotation = Math.atan2(rotationY, rotationX);
                }
            } else {
                x = this.get2BerZerValue(factor, P0.x, Ctrlpoints[0].x, PM.x);
                y = this.get2BerZerValue(factor, P0.y, Ctrlpoints[0].y, PM.y);
                if (getRotation) {
                    rotationX = this.get2BerZerRotation(factor, P0.x, Ctrlpoints[0].x, PM.x);
                    rotationY = this.get2BerZerRotation(factor, P0.y, Ctrlpoints[0].y, PM.y);
                    rotation = Math.atan2(rotationY, rotationX);
                }
            }

            var point = egret.Point.create(x, y);
            if (getRotation) {
                point["rotation"] = rotation * 180 / Math.PI;
            }
            point_list.push(point);
            factor += change_factor;
        }

        return point_list;
    }

    public static get2BerZerValue(factor, P0, P1, P2) {
        var val = (1 - factor) * (1 - factor) * P0 + 2 * factor * (1 - factor) * P1 + factor * factor * P2;
        return Math.floor(val);
    }

    public static get2BerZerRotation(factor, P0, P1, P2) {
        var val = -2 * (1 - factor) * P0 + 2 * (-factor + (1 - factor)) * P1 + 2 * factor * P2;
        return val;
    }

    public static get3BerZerValue(factor, P0, P1, P2, P3) {
        var val = P0 * Math.pow(1 - factor, 3) + 3 * P1 * factor * Math.pow(1 - factor, 2) +
            3 * P2 * Math.pow(factor, 2) * (1 - factor) + P3 * Math.pow(factor, 3);
        return Math.floor(val);
    }

    public static get3BerZerRotation(factor, P0, P1, P2, P3) {
        var val = -3 * P0 * Math.pow(1 - factor, 2) + 3 * P1 * (factor * (-2 * (1 - factor)) + Math.pow(1 - factor, 2)) +
            3 * P2 * (-Math.pow(factor, 2) + 2 * factor * (1 - factor)) + 3 * P3 * Math.pow(factor, 2);
        return val;
    }
}
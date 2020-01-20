/**
 * Created by yangsong on 15-1-12.
 * 通用工具类
 */
class CommonUtils extends BaseClass {
    public constructor() {
        super();
    }

    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    public static addLableStrokeColor(lable: eui.Label, color: any, width: any): void {
        lable.strokeColor = color;
        lable.stroke = width;
    }

    /**
     * 深度复制
     * @param _data
     */
    public static copyDataHandler(obj: any): any {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i: number = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    }

    // /**
    //  * 锁屏
    //  */
    // public static lock():void {
    //     App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = false;
    // }

    // /**
    //  * 解屏
    //  */
    // public static unlock():void {
    //     App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = true;
    // }

    /**
     * 万字的显示
     * @param label
     * @param num
     */
    public static labelIsOverLenght = function (label, num) {
        var str = null;
        if (num < 10000) {
            str = num;
        }
        else if (num < 1000000) {
            let nums = (num / 1000) / 10;
            str = nums.toFixed(1).toString() + GCode(CLEnum.NUM_WAN);
        }
        else {
            str = Math.floor(num / 10000).toString() + GCode(CLEnum.NUM_WAN);
        }
        label.text = str;
    };

    /**
    * 万字的显示
    * @param label
    * @param num
    */
    public static numOutLenght = function (num): string {
        var str = null;
        if (num < 10000) {
            str = num;
        } else {
            let numStr = (num / 10000);
            str = (Math.floor(numStr * 10) / 10) + GCode(CLEnum.NUM_WAN);
        }
        return str;
    };

    /**
    * 万字的显示 (不保留小数点)
    * @param label
    * @param num
    */
    public static numOutFight = function (num): string {
        if (num >= 100000000) {
            let nums = num / 100000000;
            return nums.toFixed(2).toString() + GCode(CLEnum.NUM_YI);
        }
        var str = null;
        if (num < 10000) {
            str = num;
        } else {
            let numStr = (num / 10000);
            str = Math.floor(numStr) + GCode(CLEnum.NUM_WAN);
        }
        return str;
    };

    /**万转数字 */
    public static OutlenToNum(valStr: string) {
        let isOver = valStr.indexOf(GCode(CLEnum.NUM_WAN)) >= 0;
        valStr = valStr.replace(GCode(CLEnum.NUM_WAN), '');
        let val = Number(valStr);
        val = isOver ? val * 10000 : val;
        return val;
    }


    /**
    * 万 亿 字的显示
    * @param label
    * @param num
    */
    public static numOutLenght2 = function (num): string {
        if (num >= 100000000) {
            let nums = num / 100000000;
            return nums.toFixed(2).toString() + GCode(CLEnum.NUM_YI);
        }
        return CommonUtils.numOutLenght(num);
    };

    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    public static int64ToNumber(obj) {
        return parseInt(obj.toString());
    }

    /**
     * 数字滚动动画
     */
    public static NumberActionTo(target: any, start: number, end: number, time: number = 1000, isOutNum: boolean = false, isZoom: boolean = true) {
        Tween.removeTweens(target);
        if (isZoom) {
            target.scaleX = 1.5;
            target.scaleY = 1.5;
        }
        target.actionCurNum = start;
        let tw = egret.Tween.get(target, {
            onChange: function () {
                if (this.text) {
                    if (isOutNum) {
                        CommonUtils.labelIsOverLenght(this, Math.floor(this.actionCurNum));
                    } else {
                        this.text = Math.floor(this.actionCurNum) + "";
                    }
                }
            }, onChangeObj: target
        });

        tw.to({ actionCurNum: end }, time, egret.Ease.sineOut)

        tw.call(() => {
            if (isZoom) {
                target.scaleX = 1;
                target.scaleY = 1;
            }
            if (isOutNum) {
                CommonUtils.labelIsOverLenght(this, end);
            } else {
                target.text = end + "";
            }
        }, target);
    }
}

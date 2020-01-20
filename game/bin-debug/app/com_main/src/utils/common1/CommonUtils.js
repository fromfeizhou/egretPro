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
 * Created by yangsong on 15-1-12.
 * 通用工具类
 */
var CommonUtils = /** @class */ (function (_super_1) {
    __extends(CommonUtils, _super_1);
    function CommonUtils() {
        return _super_1.call(this) || this;
    }
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    CommonUtils.addLableStrokeColor = function (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 深度复制
     * @param _data
     */
    CommonUtils.copyDataHandler = function (obj) {
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
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };
    /**万转数字 */
    CommonUtils.OutlenToNum = function (valStr) {
        var isOver = valStr.indexOf(GCode(CLEnum.NUM_WAN)) >= 0;
        valStr = valStr.replace(GCode(CLEnum.NUM_WAN), '');
        var val = Number(valStr);
        val = isOver ? val * 10000 : val;
        return val;
    };
    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    CommonUtils.int64ToNumber = function (obj) {
        return parseInt(obj.toString());
    };
    /**
     * 数字滚动动画
     */
    CommonUtils.NumberActionTo = function (target, start, end, time, isOutNum, isZoom) {
        var _this = this;
        if (time === void 0) { time = 1000; }
        if (isOutNum === void 0) { isOutNum = false; }
        if (isZoom === void 0) { isZoom = true; }
        Tween.removeTweens(target);
        if (isZoom) {
            target.scaleX = 1.5;
            target.scaleY = 1.5;
        }
        target.actionCurNum = start;
        var tw = egret.Tween.get(target, {
            onChange: function () {
                if (this.text) {
                    if (isOutNum) {
                        CommonUtils.labelIsOverLenght(this, Math.floor(this.actionCurNum));
                    }
                    else {
                        this.text = Math.floor(this.actionCurNum) + "";
                    }
                }
            }, onChangeObj: target
        });
        tw.to({ actionCurNum: end }, time, egret.Ease.sineOut);
        tw.call(function () {
            if (isZoom) {
                target.scaleX = 1;
                target.scaleY = 1;
            }
            if (isOutNum) {
                CommonUtils.labelIsOverLenght(_this, end);
            }
            else {
                target.text = end + "";
            }
        }, target);
    };
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
    CommonUtils.labelIsOverLenght = function (label, num) {
        var str = null;
        if (num < 10000) {
            str = num;
        }
        else if (num < 1000000) {
            var nums = (num / 1000) / 10;
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
    CommonUtils.numOutLenght = function (num) {
        var str = null;
        if (num < 10000) {
            str = num;
        }
        else {
            var numStr = (num / 10000);
            str = (Math.floor(numStr * 10) / 10) + GCode(CLEnum.NUM_WAN);
        }
        return str;
    };
    /**
    * 万字的显示 (不保留小数点)
    * @param label
    * @param num
    */
    CommonUtils.numOutFight = function (num) {
        if (num >= 100000000) {
            var nums = num / 100000000;
            return nums.toFixed(2).toString() + GCode(CLEnum.NUM_YI);
        }
        var str = null;
        if (num < 10000) {
            str = num;
        }
        else {
            var numStr = (num / 10000);
            str = Math.floor(numStr) + GCode(CLEnum.NUM_WAN);
        }
        return str;
    };
    /**
    * 万 亿 字的显示
    * @param label
    * @param num
    */
    CommonUtils.numOutLenght2 = function (num) {
        if (num >= 100000000) {
            var nums = num / 100000000;
            return nums.toFixed(2).toString() + GCode(CLEnum.NUM_YI);
        }
        return CommonUtils.numOutLenght(num);
    };
    return CommonUtils;
}(BaseClass));

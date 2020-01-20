/**
 * Created by Tint_ on 2017/4/5.
 */
var UIShowStyle;
(function (UIShowStyle) {
    /**正常*/
    UIShowStyle[UIShowStyle["Normal"] = 0] = "Normal";
    /**滑动, 自上而下*/
    UIShowStyle[UIShowStyle["SlideTopDown"] = 1] = "SlideTopDown";
    /**滑动, 自左而右*/
    UIShowStyle[UIShowStyle["SlideLeftRight"] = 2] = "SlideLeftRight";
    /**滑动, 自右而左*/
    UIShowStyle[UIShowStyle["SlideRightLeft"] = 3] = "SlideRightLeft";
    /**缩放*/
    UIShowStyle[UIShowStyle["ScaleStyle"] = 4] = "ScaleStyle";
    /**滑动, 自下而上*/
    UIShowStyle[UIShowStyle["SlideBottomUp"] = 5] = "SlideBottomUp";
    UIShowStyle[UIShowStyle["PopPanel"] = 6] = "PopPanel";
})(UIShowStyle || (UIShowStyle = {}));
var UIAlignStyle;
(function (UIAlignStyle) {
    UIAlignStyle[UIAlignStyle["Normal"] = 0] = "Normal";
    /**屏幕中间*/
    UIAlignStyle[UIAlignStyle["MiddleCenter"] = 1] = "MiddleCenter";
    UIAlignStyle[UIAlignStyle["BottomLeft"] = 2] = "BottomLeft";
})(UIAlignStyle || (UIAlignStyle = {}));

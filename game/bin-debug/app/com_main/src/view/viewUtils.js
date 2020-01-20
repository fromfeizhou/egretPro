var viewUtils = /** @class */ (function () {
    function viewUtils() {
    }
    viewUtils.setPos = function (Obj, x, y) {
        Obj.x = x;
        Obj.y = y;
    };
    viewUtils.setAnchorCenter = function (Obj) {
        Obj.anchorOffsetX = Obj.width / 2;
        Obj.anchorOffsetY = Obj.height / 2;
    };
    return viewUtils;
}());

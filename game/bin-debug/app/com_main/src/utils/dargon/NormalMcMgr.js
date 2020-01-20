/**
 * 通用特效对象池
 */
var NormalMcMgr = /** @class */ (function () {
    function NormalMcMgr() {
    }
    /**
     * 添加动画
     * 循环播放动画 isAuto = true
     * 播放单次动画 isAuto = false  外部调用 playNorOnce 函数  手动回收对象
     *  */
    NormalMcMgr.createMc = function (name, isAuto) {
        if (isAuto === void 0) { isAuto = true; }
        if (!this.mcChace[name]) {
            this.mcChace[name] = [];
        }
        var mc;
        if (this.mcChace[name].length > 0) {
            mc = this.mcChace[name].pop();
            if (isAuto)
                mc.play(name);
        }
        else {
            mc = new MCDragonBones();
            mc.initAsync(name);
            mc.touchEnabled = false;
            mc.touchChildren = false;
            if (isAuto)
                mc.play(name);
        }
        NodeUtils.reset(mc);
        return mc;
    };
    /**移除动画 */
    NormalMcMgr.removeMc = function (mc) {
        if (mc) {
            mc.stop();
            Utils.removeFromParent(mc);
            if (this.mcChace[mc.dbName]) {
                this.mcChace[mc.dbName].push(mc);
            }
        }
    };
    /**清理所有缓存计数 */
    NormalMcMgr.clearMc = function (offNames) {
        //全部清理
        for (var key in this.mcChace) {
            //过滤通用特效
            if (offNames && offNames.indexOf(key) >= 0)
                continue;
            var list = this.mcChace[key];
            for (var i = 0; i < list.length; i++) {
                list[i].destroy();
            }
            this.mcChace[key] = [];
        }
    };
    /**动画缓存 */
    NormalMcMgr.mcChace = {};
    return NormalMcMgr;
}());

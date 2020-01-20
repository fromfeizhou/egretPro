// TypeScript file
var GeneralMCMgr = /** @class */ (function () {
    function GeneralMCMgr() {
    }
    /**添加武将动画 */
    GeneralMCMgr.createMc = function (name) {
        if (!this.mclist[name]) {
            var mc = new MCDragonBones();
            mc.initAsync(name);
            mc.touchEnabled = false;
            mc.touchChildren = false;
            this.mclist[name] = mc;
            this.mcArray.push(mc);
        }
        this.mclist[name].play('animation');
        this.checkMcLen();
        return this.mclist[name];
    };
    /**移除武将动画 */
    GeneralMCMgr.removeMc = function (name) {
        var mc = this.mclist[name];
        if (mc) {
            mc.stop();
            Utils.removeFromParent(mc);
        }
    };
    /**检查骨骼动画长度 立即清理缓存*/
    GeneralMCMgr.checkMcLen = function () {
        if (this.mcArray.length > GeneralMCMgr.MAX_NUM) {
            var mc = this.mcArray.shift();
            var name_1 = mc.dbName;
            mc.destroy();
            delete this.mclist[name_1];
            DragonBonesManager.cleanDragonBones([name_1]);
        }
    };
    /**清理所有缓存计数 */
    GeneralMCMgr.clearMc = function () {
        while (this.mcArray.length > 0) {
            var mc = this.mcArray.shift();
            delete this.mclist[mc.dbName];
            mc.destroy();
        }
    };
    GeneralMCMgr.mclist = {};
    GeneralMCMgr.mcArray = [];
    GeneralMCMgr.MAX_NUM = 5;
    return GeneralMCMgr;
}());

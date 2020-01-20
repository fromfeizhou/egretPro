// TypeScript file
class GeneralMCMgr {
    public static mclist: { [key: string]: MCDragonBones } = {};
    public static mcArray: MCDragonBones[] = [];
    public static MAX_NUM: number = 5;

    /**添加武将动画 */
    public static createMc(name: string) {
        if (!this.mclist[name]) {
            let mc = new MCDragonBones();
            mc.initAsync(name);
            mc.touchEnabled = false;
            mc.touchChildren = false;
            this.mclist[name] = mc;
            this.mcArray.push(mc);
        }
        this.mclist[name].play('animation')
        this.checkMcLen();
        return this.mclist[name];
    }

    /**移除武将动画 */
    public static removeMc(name: string) {
        let mc = this.mclist[name];
        if (mc) {
            mc.stop();
            Utils.removeFromParent(mc);
        }
    }

    /**检查骨骼动画长度 立即清理缓存*/
    private static checkMcLen() {
        if (this.mcArray.length > GeneralMCMgr.MAX_NUM) {
            let mc = this.mcArray.shift();
            let name = mc.dbName;
            mc.destroy();
            delete this.mclist[name];
            DragonBonesManager.cleanDragonBones([name]);
        }
    }

    /**清理所有缓存计数 */
    public static clearMc() {
        while (this.mcArray.length > 0) {
            let mc = this.mcArray.shift();
            delete this.mclist[mc.dbName];
            mc.destroy();
        }
    }
}

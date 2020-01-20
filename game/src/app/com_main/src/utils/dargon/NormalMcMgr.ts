/**
 * 通用特效对象池
 */
class NormalMcMgr {
    /**动画缓存 */
    public static mcChace: { [key: string]: MCDragonBones[] } = {};

    /**
     * 添加动画
     * 循环播放动画 isAuto = true
     * 播放单次动画 isAuto = false  外部调用 playNorOnce 函数  手动回收对象
     *  */
    public static createMc(name: string, isAuto: boolean = true) {
        if (!this.mcChace[name]) {
            this.mcChace[name] = [];
        }
        let mc: MCDragonBones;
        if (this.mcChace[name].length > 0) {
            mc = this.mcChace[name].pop();
            if (isAuto) mc.play(name);
        } else {
            mc = new MCDragonBones();
            mc.initAsync(name);
            mc.touchEnabled = false;
            mc.touchChildren = false;
            if (isAuto) mc.play(name);
        }
        NodeUtils.reset(mc);
        return mc;
    }

    /**移除动画 */
    public static removeMc(mc: MCDragonBones) {
        if (mc) {
            mc.stop();
            Utils.removeFromParent(mc);
            if (this.mcChace[mc.dbName]) {
                this.mcChace[mc.dbName].push(mc);
            }
        }
    }


    /**清理所有缓存计数 */
    public static clearMc(offNames?: string[]) {
        //全部清理
        for (let key in this.mcChace) {
            //过滤通用特效
            if (offNames && offNames.indexOf(key) >= 0) continue;
            let list = this.mcChace[key];
            for (let i = 0; i < list.length; i++) {
                list[i].destroy();
            }
            this.mcChace[key] = [];
        }
    }
}

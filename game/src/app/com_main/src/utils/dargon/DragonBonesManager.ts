import EgretTextureAtlas = dragonBones.EgretTextureAtlas;
import DragonBonesData = dragonBones.DragonBonesData;
/**
 * Created by Tint_ on 2017/3/27.
 * 骨骼动画管理
 */
class DragonBonesManager {
    /**动画实例计数 */
    public static mcInsCache: { [key: string]: number } = {};
    /**添加实例计数 */
    public static addMcInsCahce(name: string) {
        if (!this.mcInsCache[name]) this.mcInsCache[name] = 0;
        this.mcInsCache[name]++;
    }
    /**移除实例计数 */
    public static removeMcInsCache(name: string) {
        if (!this.mcInsCache[name]) return;
        this.mcInsCache[name]--;
    }

    /**移除所有实例计数为0的动画对象 */
    public static clearZeroIns() {
        let res = [];
        for (let name in this.mcInsCache) {
            if (this.mcInsCache[name] == 0) {
                res.push(name);
                delete this.mcInsCache[name];
            }
        }
        this.cleanDragonBones(res);
    }

    public static getDragonBones(dbName: string): dragonBones.EgretArmatureDisplay {
        let armature: dragonBones.EgretArmatureDisplay = DBManager.getInstance().getDragonBones(dbName);
        return armature;
    }
    public static getDragonBonesMovie(dbName: string): dragonBones.Movie {
        let movie: dragonBones.Movie = DBManager.getInstance().getDragonBonesMovie(dbName);
        return movie;
    }
    public static removeAll() {
        dragonBones.WorldClock.clock.clear();
    }
    public static release() {

    }
    // public static addArmature2Parent(armature: dragonBones.Armature, parent: egret.DisplayObjectContainer) {
    //     dragonBones.WorldClock.clock.add(armature);
    //     parent.addChild(armature.display);
    // }
    // public static render(passedTime: number) {
    //     dragonBones.WorldClock.clock.advanceTime(passedTime / 1000);
    // }
    // public static removeArmature(armature: dragonBones.Armature) {
    //     if (armature == null) return;
    //     dragonBones.WorldClock.clock.remove(armature);
    //     armature.animation.reset()
    //     armature.dispose();
    //     armature = null;
    // }

    /**释放龙骨动画资源内存 
     * name 动画名 数组
     * isReleaseRes 释放图片资源 默认true
    */
    public static cleanDragonBones(name: string[], isReleaseRes: boolean = true) {
        for (let dragonBones of name) {
            DBManager.getInstance().cleanDragonBonesData(dragonBones, isReleaseRes);
        }
    }
}
class DBManager {
    private static _mInstance: DBManager = null;
    public static getInstance(check: boolean = false): DBManager {
        if (check) return DBManager._mInstance;
        if (DBManager._mInstance == null) {
            DBManager._mInstance = new DBManager();
        }
        return DBManager._mInstance;
    }
    private static SKINNAME_URL: string = "";
    private _mDragonBonesDataPools: any = null;
    private factory;
    constructor() {
        this._mDragonBonesDataPools = {};
        this.factory = dragonBones.EgretFactory.factory;

        this.factory.soundEventManager.addEventListener(dragonBones.EventObject.SOUND_EVENT, this.animationEventHandler, this);

    }


    public animationEventHandler(event: dragonBones.EgretEvent) {
        let eventObject = event.eventObject;
        // console.log(eventObject.animationState.name, event.type, eventObject.name ? eventObject.name : "");
        if (event.type == "soundEvent" && eventObject.name && AGame.R.app.mapLevel.visible) {
            Sound.playName(eventObject.name + "_mp3");
        }
    }

    public getDragonBones(name: string): dragonBones.EgretArmatureDisplay {
        let ta = this._mDragonBonesDataPools[name];
        if (ta == null) {
            let skeletonData = RES.getRes(DBManager.SKINNAME_URL + name + "_ske_dbbin");
            this.factory.parseDragonBonesData(skeletonData, name)
            let group = RES.getGroupByName(name);
            for (let i = 0; i < group.length; i++) {
                if (group[i].type == 'json') {
                    let resName = group[i].name;
                    let textureData = RES.getRes(resName);
                    let texture = RES.getRes(resName.replace('json', 'png'));
                    this.factory.parseTextureAtlasData(textureData, texture, name);
                }
            }

            this._mDragonBonesDataPools[name] = true;
        }
        return this.factory.buildArmatureDisplay(name);
    }
    // 创建 白鹭极速格式 的动画
    public getDragonBonesMovie(name: string): dragonBones.Movie {
        let ta = this._mDragonBonesDataPools[name];
        if (ta == null) {
            let skeletonData = RES.getRes(DBManager.SKINNAME_URL + name + "_ske_dbmv");
            let texture = RES.getRes(DBManager.SKINNAME_URL + name + "_tex_png");
            dragonBones.addMovieGroup(skeletonData, texture);
            this._mDragonBonesDataPools[name] = true;
        }
        return dragonBones.buildMovie(name);
    }

    public cleanDragonBonesData(name: string, isReleaseRes: boolean = true) {
        // this._mDragonBonesDataPools = {};
        // dragonBones.EgretFactory.factory.clear(true);
        if (isReleaseRes) {
            RES.destroyRes(name);
        }
        this._mDragonBonesDataPools[name] = null;
        dragonBones.EgretFactory.factory.removeDragonBonesData(name, true)
        dragonBones.EgretFactory.factory.removeTextureAtlasData(name, true);
    }
}
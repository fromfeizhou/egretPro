var EgretTextureAtlas = dragonBones.EgretTextureAtlas;
var DragonBonesData = dragonBones.DragonBonesData;
/**
 * Created by Tint_ on 2017/3/27.
 * 骨骼动画管理
 */
var DragonBonesManager = /** @class */ (function () {
    function DragonBonesManager() {
    }
    /**添加实例计数 */
    DragonBonesManager.addMcInsCahce = function (name) {
        if (!this.mcInsCache[name])
            this.mcInsCache[name] = 0;
        this.mcInsCache[name]++;
    };
    /**移除实例计数 */
    DragonBonesManager.removeMcInsCache = function (name) {
        if (!this.mcInsCache[name])
            return;
        this.mcInsCache[name]--;
    };
    /**移除所有实例计数为0的动画对象 */
    DragonBonesManager.clearZeroIns = function () {
        var res = [];
        for (var name_1 in this.mcInsCache) {
            if (this.mcInsCache[name_1] == 0) {
                res.push(name_1);
                delete this.mcInsCache[name_1];
            }
        }
        this.cleanDragonBones(res);
    };
    DragonBonesManager.getDragonBones = function (dbName) {
        var armature = DBManager.getInstance().getDragonBones(dbName);
        return armature;
    };
    DragonBonesManager.getDragonBonesMovie = function (dbName) {
        var movie = DBManager.getInstance().getDragonBonesMovie(dbName);
        return movie;
    };
    DragonBonesManager.removeAll = function () {
        dragonBones.WorldClock.clock.clear();
    };
    DragonBonesManager.release = function () {
    };
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
    DragonBonesManager.cleanDragonBones = function (name, isReleaseRes) {
        if (isReleaseRes === void 0) { isReleaseRes = true; }
        for (var _i = 0, name_2 = name; _i < name_2.length; _i++) {
            var dragonBones_1 = name_2[_i];
            DBManager.getInstance().cleanDragonBonesData(dragonBones_1, isReleaseRes);
        }
    };
    /**动画实例计数 */
    DragonBonesManager.mcInsCache = {};
    return DragonBonesManager;
}());
var DBManager = /** @class */ (function () {
    function DBManager() {
        this._mDragonBonesDataPools = null;
        this._mDragonBonesDataPools = {};
        this.factory = dragonBones.EgretFactory.factory;
        this.factory.soundEventManager.addEventListener(dragonBones.EventObject.SOUND_EVENT, this.animationEventHandler, this);
    }
    DBManager.getInstance = function (check) {
        if (check === void 0) { check = false; }
        if (check)
            return DBManager._mInstance;
        if (DBManager._mInstance == null) {
            DBManager._mInstance = new DBManager();
        }
        return DBManager._mInstance;
    };
    DBManager.prototype.animationEventHandler = function (event) {
        var eventObject = event.eventObject;
        // console.log(eventObject.animationState.name, event.type, eventObject.name ? eventObject.name : "");
        if (event.type == "soundEvent" && eventObject.name && AGame.R.app.mapLevel.visible) {
            Sound.playName(eventObject.name + "_mp3");
        }
    };
    DBManager.prototype.getDragonBones = function (name) {
        var ta = this._mDragonBonesDataPools[name];
        if (ta == null) {
            var skeletonData = RES.getRes(DBManager.SKINNAME_URL + name + "_ske_dbbin");
            this.factory.parseDragonBonesData(skeletonData, name);
            var group = RES.getGroupByName(name);
            for (var i = 0; i < group.length; i++) {
                if (group[i].type == 'json') {
                    var resName = group[i].name;
                    var textureData = RES.getRes(resName);
                    var texture = RES.getRes(resName.replace('json', 'png'));
                    this.factory.parseTextureAtlasData(textureData, texture, name);
                }
            }
            this._mDragonBonesDataPools[name] = true;
        }
        return this.factory.buildArmatureDisplay(name);
    };
    // 创建 白鹭极速格式 的动画
    DBManager.prototype.getDragonBonesMovie = function (name) {
        var ta = this._mDragonBonesDataPools[name];
        if (ta == null) {
            var skeletonData = RES.getRes(DBManager.SKINNAME_URL + name + "_ske_dbmv");
            var texture = RES.getRes(DBManager.SKINNAME_URL + name + "_tex_png");
            dragonBones.addMovieGroup(skeletonData, texture);
            this._mDragonBonesDataPools[name] = true;
        }
        return dragonBones.buildMovie(name);
    };
    DBManager.prototype.cleanDragonBonesData = function (name, isReleaseRes) {
        if (isReleaseRes === void 0) { isReleaseRes = true; }
        // this._mDragonBonesDataPools = {};
        // dragonBones.EgretFactory.factory.clear(true);
        if (isReleaseRes) {
            RES.destroyRes(name);
        }
        this._mDragonBonesDataPools[name] = null;
        dragonBones.EgretFactory.factory.removeDragonBonesData(name, true);
        dragonBones.EgretFactory.factory.removeTextureAtlasData(name, true);
    };
    DBManager._mInstance = null;
    DBManager.SKINNAME_URL = "";
    return DBManager;
}());

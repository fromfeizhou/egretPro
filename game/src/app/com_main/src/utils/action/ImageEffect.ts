/**
 * Created by yaowan on 2016/12/20.
 */

class EImageSprite extends egret.Bitmap {
    public eff_config;
    public EFF_NAME;
    public res_loaded;

    public constructor() {
        super();
        this.touchEnabled = false;
    }
}

class ImageEffect {

    private static m_pAnimMap = {};

    public static load_2(eff_type: string, loader?: Function, loaderThis?: any): com_main.SpriteAnimation {
        var eff_config = EffectData.loadConfig(eff_type);
        var anim = new com_main.SpriteAnimation(null, eff_type, eff_config.fHold, eff_config.fType);
        anim.isRepeat = eff_config.isRepeat;

        var paths = this.load_Common_files(eff_type, eff_config.fileNum);
        anim.loadFiles(paths, loader, loaderThis, anim);
        return anim;
    }


    public static load(eff_type: string, loader?: Function, loaderThis?: any): EImageSprite {
        var sprite = new EImageSprite();
        var eff_config = EffectData.loadConfig(eff_type);
        var anim = new com_main.SpriteAnimation(sprite, eff_type, eff_config.fHold, eff_config.fType);
        anim.isRepeat = eff_config.isRepeat;

        var paths = this.load_Common_files(eff_type, eff_config.fileNum);
        anim.loadFiles(paths, loader, loaderThis);
        this.m_pAnimMap[sprite.hashCode] = anim;
        sprite.visible = false;
        return sprite;
    }

    public static removeActions() {
        for (var key in this.m_pAnimMap) {
            var anim = <com_main.SpriteAnimation>this.m_pAnimMap[key];
            anim.removeAction();
        }
        this.m_pAnimMap = null;
        this.m_pAnimMap = {};
    }

    public static removeAction(sprite: EImageSprite) {
        if (sprite) {
            sprite.eff_config = null;
            var anim = <com_main.SpriteAnimation>this.m_pAnimMap[sprite.hashCode];
            if (anim) {
                anim.removeAction();
            }
            anim = null;
            delete this.m_pAnimMap[sprite.hashCode];
            egret.Tween.removeTweens(sprite);
            // if(sprite.parent) sprite.parent.removeChild(sprite);
            Utils.removeFromParent(sprite);
            sprite = null;
        }
    }


    public static runAction(sprite: EImageSprite, callback?: Function, thisArg?: any, needReset: boolean = true) {
        sprite.visible = true;
        var anim = this.m_pAnimMap[sprite.hashCode];
        if (!anim) {
            error("ImageEffect:runAction========>", sprite);
            return;
        }
        if (anim.anim) sprite.texture = anim.anim.getFrame();
        var showFunc = function () {
            sprite.visible = false;
            if (callback) callback.call(thisArg);
        }
        anim.runAction(showFunc, this, needReset);
    }

    public static stopAction(sprite: EImageSprite) {
        sprite.visible = true;
        var anim = <com_main.SpriteAnimation>this.m_pAnimMap[sprite.hashCode];
        if (anim) {
            anim.stopAction();
        } else {
            egret.Tween.removeTweens(sprite);
            sprite.visible = false;
        }
    }

    private static load_Common_files(fileName, num) {
        var names = fileName.split('_');
        var paths = [];

        var src = GameConfig.getResRemoteUrl() + "assets/effects/" + names[0] + "/" + fileName + "/";

        if (num > 1) {
            for (var i = 0; i < num; i++) {
                var path = src + fileName + "_" + i + ".json";
                paths.push(path);
            }
        } else {
            var path = src + fileName + ".json";
            paths.push(path);
        }
        return paths;
    }
}
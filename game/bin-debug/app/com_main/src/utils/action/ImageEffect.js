/**
 * Created by yaowan on 2016/12/20.
 */
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
var EImageSprite = /** @class */ (function (_super_1) {
    __extends(EImageSprite, _super_1);
    function EImageSprite() {
        var _this = _super_1.call(this) || this;
        _this.touchEnabled = false;
        return _this;
    }
    return EImageSprite;
}(egret.Bitmap));
var ImageEffect = /** @class */ (function () {
    function ImageEffect() {
    }
    ImageEffect.load_2 = function (eff_type, loader, loaderThis) {
        var eff_config = EffectData.loadConfig(eff_type);
        var anim = new com_main.SpriteAnimation(null, eff_type, eff_config.fHold, eff_config.fType);
        anim.isRepeat = eff_config.isRepeat;
        var paths = this.load_Common_files(eff_type, eff_config.fileNum);
        anim.loadFiles(paths, loader, loaderThis, anim);
        return anim;
    };
    ImageEffect.load = function (eff_type, loader, loaderThis) {
        var sprite = new EImageSprite();
        var eff_config = EffectData.loadConfig(eff_type);
        var anim = new com_main.SpriteAnimation(sprite, eff_type, eff_config.fHold, eff_config.fType);
        anim.isRepeat = eff_config.isRepeat;
        var paths = this.load_Common_files(eff_type, eff_config.fileNum);
        anim.loadFiles(paths, loader, loaderThis);
        this.m_pAnimMap[sprite.hashCode] = anim;
        sprite.visible = false;
        return sprite;
    };
    ImageEffect.removeActions = function () {
        for (var key in this.m_pAnimMap) {
            var anim = this.m_pAnimMap[key];
            anim.removeAction();
        }
        this.m_pAnimMap = null;
        this.m_pAnimMap = {};
    };
    ImageEffect.removeAction = function (sprite) {
        if (sprite) {
            sprite.eff_config = null;
            var anim = this.m_pAnimMap[sprite.hashCode];
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
    };
    ImageEffect.runAction = function (sprite, callback, thisArg, needReset) {
        if (needReset === void 0) { needReset = true; }
        sprite.visible = true;
        var anim = this.m_pAnimMap[sprite.hashCode];
        if (!anim) {
            error("ImageEffect:runAction========>", sprite);
            return;
        }
        if (anim.anim)
            sprite.texture = anim.anim.getFrame();
        var showFunc = function () {
            sprite.visible = false;
            if (callback)
                callback.call(thisArg);
        };
        anim.runAction(showFunc, this, needReset);
    };
    ImageEffect.stopAction = function (sprite) {
        sprite.visible = true;
        var anim = this.m_pAnimMap[sprite.hashCode];
        if (anim) {
            anim.stopAction();
        }
        else {
            egret.Tween.removeTweens(sprite);
            sprite.visible = false;
        }
    };
    ImageEffect.load_Common_files = function (fileName, num) {
        var names = fileName.split('_');
        var paths = [];
        var src = GameConfig.getResRemoteUrl() + "assets/effects/" + names[0] + "/" + fileName + "/";
        if (num > 1) {
            for (var i = 0; i < num; i++) {
                var path = src + fileName + "_" + i + ".json";
                paths.push(path);
            }
        }
        else {
            var path = src + fileName + ".json";
            paths.push(path);
        }
        return paths;
    };
    ImageEffect.m_pAnimMap = {};
    return ImageEffect;
}());

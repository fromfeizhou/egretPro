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
var SoundItem = /** @class */ (function (_super_1) {
    __extends(SoundItem, _super_1);
    function SoundItem() {
        var _this = _super_1.call(this) || this;
        _this.isLoadRes = false;
        _this.isDestroy = false;
        return _this;
    }
    SoundItem.create = function () {
        return new SoundItem();
    };
    SoundItem.prototype.BindCall = function (callback, target) {
        this.callback = callback;
        this.target = target;
    };
    SoundItem.prototype.play = function (startTime, loops) {
        if (this.isDestroy) {
            return;
        }
        if (!this.isLoadRes) {
            return;
        }
        this.channel = this.sound.play(startTime, loops);
        this.sound.type = this.type;
        this.channel.once(egret.Event.SOUND_COMPLETE, this.onComplete, this);
        this.isPlay = true;
        this.loops = loops;
        startTime ? this.position = startTime : this.position = 0;
        //设置音量
        if (this.type == egret.Sound.MUSIC) {
            this.channel.volume = Sound.getBgValume();
        }
        else if (this.type == egret.Sound.EFFECT) {
            this.channel.volume = Sound.getEffectVolume();
        }
    };
    SoundItem.prototype.stop = function () {
        if (this.isPlay) {
            this.channel.stop();
            this.channel = null;
            this.isPlay = false;
        }
        this.loops = 1;
        this.callback = null;
        this.target = null;
    };
    SoundItem.prototype.setValume = function (valume) {
        if (this.isPlay) {
            this.channel.volume = valume;
        }
    };
    SoundItem.prototype.onComplete = function () {
        if (this.sound.type == egret.Sound.MUSIC) {
            this.stop();
            this.play(0, 0);
        }
        if (this.callback && this.target) {
            this.callback.call(this.target);
        }
        this.stop();
    };
    //播放前要调用这个函数
    SoundItem.prototype.startPlay = function () {
        this.isDestroy = false;
    };
    //停止播放
    SoundItem.prototype.onDestroy = function () {
        this.stop();
        this.isDestroy = true;
    };
    return SoundItem;
}(egret.HashObject));

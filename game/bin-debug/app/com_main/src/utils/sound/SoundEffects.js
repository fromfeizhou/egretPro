// /**
//  * Created by yangsong on 15-1-14.
//  * 音效类
//  */
// class SoundEffects extends BaseSound {
//     private _volume: number;
//     /**
//      * 构造函数
//      */
//     public constructor() {
//         super();
//     }
//     public stop() {
//     }
//     /**
//      * 播放一个音效
//      * @param effectName
//      */
//     public play(effectName: string) {
//         var sound: egret.Sound = this.getSound(effectName);
//         if (sound) return this.playSound(sound);
//     }
//     /**
//      * 播放
//      * @param sound
//      */
//     private playSound(sound: egret.Sound) {
//         var channel: egret.SoundChannel = sound.play(0, 1);
//         channel.volume = this._volume;
//         return channel;
//     }
//     /**
//      * 设置音量
//      * @param volume
//      */
//     public setVolume(volume: number): void {
//         this._volume = volume;
//     }
//     /**
//      * 资源加载完成后处理播放
//      * @param key
//      */
//     public loadedPlay(key: string) {
//         return this.playSound(RES.getRes(key));
//     }
// }

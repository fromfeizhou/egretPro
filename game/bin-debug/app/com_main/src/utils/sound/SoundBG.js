// /**
//  * Created by yangsong on 15-1-14.
//  * 背景音乐类
//  */
// class SoundBG extends BaseSound {
//     private m_pVolume: number;
//     private m_pCurrBG: string;
//     private m_pCurrSound: egret.Sound;
//     private m_pCurrSoundChannel: egret.SoundChannel;
//     /**
//      * 构造函数
//      */
//     public constructor() {
//         super();
//         this.m_pCurrBG = "";
//     }
//     /**
//      * 停止当前音乐
//      */
//     public stop(): void {
//         if (this.m_pCurrSoundChannel) {
//             this.m_pCurrSoundChannel.stop();
//         }
//         this.m_pCurrSoundChannel = null;
//         this.m_pCurrSound = null;
//         this.m_pCurrBG = "";
//     }
//     /**
//      * 播放某个音乐
//      * @param effectName
//      */
//     public play(effectName: string, loop: number): void {
//         if (this.m_pCurrBG == effectName)
//             return;
//         this.stop();
//         this.m_pCurrBG = effectName;
//         var sound: egret.Sound = this.getSound(effectName);
//         if (sound) {
//             this.playSound(sound, loop);
//         }
//     }
//     /**
//      * 播放
//      * @param sound
//      */
//     private playSound(sound: egret.Sound, loop: number): void {
//         this.m_pCurrSound = sound;
//         this.m_pCurrSoundChannel = this.m_pCurrSound.play(0, loop);
//         this.m_pCurrSoundChannel.volume = this.m_pVolume;
//     }
//     /**
//      * 设置音量
//      * @param volume
//      */
//     public setVolume(volume: number): void {
//         this.m_pVolume = volume;
//         if (this.m_pCurrSoundChannel) {
//             this.m_pCurrSoundChannel.volume = this.m_pVolume;
//         }
//     }
//     /**
//      * 资源加载完成后处理播放
//      * @param key
//      */
//     public loadedPlay(key: string, loop: number): void {
//         if (this.m_pCurrBG == key) {
//             this.playSound(RES.getRes(key), loop);
//         }
//     }
//     /**
//      * 检测一个文件是否要清除
//      * @param key
//      * @returns {boolean}
//      */
//     public checkCanClear(key: string): boolean {
//         return this.m_pCurrBG != key;
//     }
// }

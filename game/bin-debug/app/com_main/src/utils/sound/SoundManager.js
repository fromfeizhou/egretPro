// /**
//  * Created by yangsong on 15-1-14.
//  * Sound管理类
//  */
// class SoundManager extends BaseClass {
//     /**
//      * 音乐文件清理时间
//      * @type {number}
//      */
//     public static CLEAR_TIME: number = 3 * 60 * 1000;
//     private m_pBGOn: boolean;
//     private m_pEffectOn: boolean;
//     private m_pCurrBG: string;
//     private m_pBGVolume: number;
//     private m_pEffectVolume: number;
//     private m_pBG: SoundBG;
//     private m_pEffect: SoundEffects;
//     /**创建其他元素 */
//     private m_pFrameElement: FrameExecutor;
//     private m_pLimitSound: egret.SoundChannel[][];
//     /**
//      * 构造函数
//      */
//     public constructor() {
//         super();
//         this.init();
//     }
//     public init() {
//         this.m_pBGOn = true;
//         this.m_pEffectOn = true;
//         this.m_pBGVolume = 0.5;
//         this.m_pEffectVolume = 0.5;
//         this.m_pBG = new SoundBG();
//         this.m_pBG.setVolume(this.m_pBGVolume);
//         this.m_pEffect = new SoundEffects();
//         this.m_pEffect.setVolume(this.m_pEffectVolume);
//         this.m_pFrameElement = FrameExecutor.create(30);
//         this.m_pLimitSound = [];
//     }
//     public clear() {
//         this.m_pBGOn = true;
//         this.m_pEffectOn = true;
//         this.m_pBGVolume = 0.5;
//         this.m_pEffectVolume = 0.5;
//         this.m_pBG.stop();
//         this.m_pBG = null;
//         this.m_pEffect.stop();
//         this.m_pEffect = null;
//         this.m_pFrameElement.onDestroy();
//         this.m_pFrameElement = null;
//         for (let key1 in this.m_pLimitSound) {
//             if (this.m_pLimitSound.hasOwnProperty(key1)) {
//                 let datas = this.m_pLimitSound[key1];
//                 for (let key2 in datas) {
//                     if (datas.hasOwnProperty(key2)) {
//                         let channel = datas[key2];
//                         if (channel) channel.stop();
//                     }
//                 }
//             }
//         }
//         this.m_pLimitSound = null;
//         this.init();
//     }
//     /**
//      * 播放音效
//      * @param effectName
//      */
//     public playEffect(effectName: string) {
//         if (!this.m_pEffectOn) return;
//         // debug("SoundManager:playEffect--->>", effectName);
//         return this.m_pEffect.play(effectName);
//     }
//     /**根据ID播放音效 */
//     public playEffectID(id: number) {
//         if (id == 134) return;//test 过滤界面声音
//         // debug("SoundManager:playEffectID--->>", id);
//         let sound = SoundData.getSoundName(id);
//         return this.playEffect(sound);
//     }
//     /**根据ID播放音效（延迟帧） */
//     public playEffectFrame(id: number) {
//         // debug("SoundManager:playEffectFrame--->>", id);
//         let sound = SoundData.getSoundName(id);
//         this.m_pFrameElement.regist(this.playEffect, this, sound);
//         if (!this.m_pFrameElement.isExecute()) {
//             this.m_pFrameElement.execute();
//         }
//     }
//     /**根据ID播放音效(数量限制) */
//     public playEffectLimit(id: number, count: number = 1) {
//         // debug("SoundManager:playEffectLimit--->>", id);
//         let sounds = this.m_pLimitSound[id];
//         if (isNull(sounds)) {
//             sounds = [];
//             this.m_pLimitSound[id] = sounds;
//         }
//         if (sounds.length < count) {
//             let channel = this.playEffectID(id);
//             sounds.push(channel);
//             channel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
//                 // debug("SoundManager:playEffectLimit--->> 完成音效播放！！", id);
//                 sounds.shift();
//             }, this);
//         }
//     }
//     /**
//      * 播放背景音乐
//      * @param key
//      */
//     public playBG(bgName: string, loop: number = 0): void {
//         this.m_pCurrBG = bgName;
//         if (!this.m_pBGOn) return;
//         // debug("SoundManager:playBG--->>", bgName);
//         this.m_pBG.play(bgName, loop);
//     }
//     public playBGID(id: number, loop: number = 0): void {
//         // debug("SoundManager:playBGID--->>", id);
//         let sound = SoundData.getSoundName(id);
//         this.playBG(sound, loop);
//     }
//     /**
//      * 停止背景音乐
//      */
//     public stopBG(): void {
//         this.m_pBG.stop();
//     }
//     /**
//      * 设置音效是否开启
//      * @param $isOn
//      */
//     public setEffectOn($isOn: boolean): void {
//         this.m_pEffectOn = $isOn;
//     }
//     /**
//      * 设置背景音乐是否开启
//      * @param $isOn
//      */
//     public setBGOn($isOn: boolean): void {
//         this.m_pBGOn = $isOn;
//         if (!this.m_pBGOn) {
//             this.stopBG();
//         } else {
//             if (this.m_pCurrBG) {
//                 this.playBG(this.m_pCurrBG);
//             }
//         }
//     }
//     /**
//      * 设置背景音乐音量
//      * @param volume
//      */
//     public setBGVolume(volume: number): void {
//         volume = Math.min(volume, 1);
//         volume = Math.max(volume, 0);
//         this.m_pBGVolume = volume;
//         this.m_pBG.setVolume(this.m_pBGVolume);
//     }
//     /**
//      * 获取背景音乐音量
//      * @returns {number}
//      */
//     public getBGVolume(): number {
//         return this.m_pBGVolume;
//     }
//     /**
//      * 设置音效音量
//      * @param volume
//      */
//     public setEffectVolume(volume: number): void {
//         volume = Math.min(volume, 1);
//         volume = Math.max(volume, 0);
//         this.m_pEffectVolume = volume;
//         this.m_pEffect.setVolume(this.m_pEffectVolume);
//     }
//     /**
//      * 获取音效音量
//      * @returns {number}
//      */
//     public getEffectVolume(): number {
//         return this.m_pEffectVolume;
//     }
// }

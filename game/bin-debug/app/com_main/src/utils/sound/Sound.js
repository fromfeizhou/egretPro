var Sound = /** @class */ (function () {
    function Sound() {
    }
    Sound.init = function () {
        var soundDatas = RES.getGroupByName("sound");
        for (var i = 0; i < soundDatas.length; i++) {
            var soundItem = SoundItem.create();
            var sourceItem = soundDatas[i];
            var url = sourceItem.url;
            if (url.indexOf("/sound/music/") != -1) {
                soundItem.type = egret.Sound.MUSIC;
            }
            else if (url.indexOf("/sound/effect/") != -1) {
                soundItem.type = egret.Sound.EFFECT;
            }
            else if (url.indexOf("/sound/dialog/") != -1) {
                soundItem.type = egret.Sound.EFFECT;
            }
            else if (url.indexOf("/sound/GuideDialog/") != -1) {
                soundItem.type = egret.Sound.EFFECT;
            }
            soundItem.sourceItem = sourceItem;
            this.soundDatas[sourceItem.name] = soundItem;
        }
        // RES.destroyRes("sound");
    };
    Sound.getItem = function (soundName) {
        var soundItem = this.soundDatas[soundName];
        return soundItem;
    };
    /**根据ID立即播放 */
    Sound.playID = function (id, play, startTime, loops, callBack, target) {
        if (play === void 0) { play = true; }
        var filename = SoundData.getSoundName(id);
        this.playName(filename, play);
    };
    /**根据ID单个播放 */
    Sound.playID1 = function (id) {
        var filename = SoundData.getSoundName(id);
        if (this.isPlay(filename))
            return;
        this.playName(filename);
    };
    /**根据名字立即播放 */
    Sound.playName = function (soundName, play, startTime, loops, callBack, target) {
        if (play === void 0) { play = true; }
        var soundItem = this.getItem(soundName);
        if (!soundItem) {
            debug("unfind " + soundName);
            return;
        }
        soundItem.startPlay();
        this.loadSound(soundName, play, startTime, loops, callBack, target);
    };
    Sound.loadSound = function (soundName, play, startTime, loops, callBack, target) {
        if (play === void 0) { play = false; }
        var soundItem = this.getItem(soundName);
        if (soundItem.type === egret.Sound.EFFECT && !GameConfig.EffectIsPlay) {
            // debug("系统已经设置关闭声音");
            return;
        }
        if (soundItem.type === egret.Sound.MUSIC && !GameConfig.MusicIsPlay) {
            this.currMusic = soundName;
            return;
        }
        if (soundItem.sound && play) {
            this.play(soundName, startTime, loops);
        }
        else {
            var sound = new egret.Sound();
            soundItem.sound = sound;
            sound.addEventListener(egret.Event.COMPLETE, function loadOver(event) {
                soundItem.isLoadRes = true;
                if (play) {
                    Sound.play(soundName, startTime, loops, callBack, target);
                }
            }, this);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event) {
                console.log("loaded error!", event);
            }, this);
            sound.load(GameConfig.getResRemoteUrl() + this.soundDatas[soundName].sourceItem.url);
        }
        // var sound:egret.Sound = new egret.Sound();
        // // if(soundItem.type === egret.Sound.MUSIC)
        // // {
        // // 	this.playBg("resource/"+this.soundDatas[soundName].sourceItem.url);
        // // }else{
        // 	sound.addEventListener(egret.Event.COMPLETE, function loadOver(event:egret.Event) {
        // 		soundItem.sound = sound;
        // 		if (play) {
        // 			this.play(soundName, startTime, loops);
        // 		}
        // 		if (callBack) {
        // 			if (target) {
        // 				callBack.call(target);
        // 			} else {
        // 				callBack();
        // 			}
        // 		}
        // 	},this);
        // 	sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event:egret.IOErrorEvent) {
        // 		console.log("loaded error!");
        // 	}, this);
        // 	sound.load("resource/"+this.soundDatas[soundName].sourceItem.url);
        // // }
    };
    // //bg-----------------------------------------
    // private static soundChannel: egret.SoundChannel;
    // private static _bgValume = 1;
    // private static playBg(path) {
    //     //创建 URLLoader 对象
    //     var loader: egret.URLLoader = new egret.URLLoader();
    //     //设置加载方式为声音
    //     loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
    //     //添加加载完成侦听
    //     loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
    //     //音频资源放在resource文件夹下
    //     // var url: string = this.path + type + ".mp3";
    //     var request: egret.URLRequest = new egret.URLRequest(path);
    //     //开始加载
    //     loader.load(request);
    // }
    // private static onLoadComplete(event: egret.Event): void {
    //     var loader: egret.URLLoader = <egret.URLLoader>event.target;
    //     //获取加载到的 Sound 对象
    //     var sound: egret.Sound = <egret.Sound>loader.data;
    //     var channel: egret.SoundChannel = this.soundChannel;
    //     if (channel) {                     
    //         channel.stop();
    //         this.soundChannel = null;
    //     }
    //     //使用SoundChannel播放音频
    //     channel = sound.play(0, 0);
    //     channel.volume = this._bgValume;
    //     this.soundChannel = channel;
    // }
    // private static setBgValume(volume: number) {
    //     this._bgValume = volume;
    //     if(this.soundChannel){
    //         this.soundChannel.volume = this._bgValume;
    //     }
    // }
    Sound.play = function (soundName, startTime, loops, callback, target) {
        // debug("Sound:play--->>", soundName);
        // if (!this.isLoad(soundName)) return;
        if (soundName === void 0) { soundName = this.currMusic; }
        if (soundName == "dianji_mp3") {
            var nowTime = egret.getTimer();
            if (nowTime - this.lastClickTime < 100) {
                return;
            }
            this.lastClickTime = nowTime;
        }
        var soundItem = this.getItem(soundName);
        if (!soundItem || !soundItem.sound)
            return;
        if (soundItem.type === egret.Sound.MUSIC) {
            Sound.stop(this.currMusic);
            this.currMusic = soundName;
        }
        if (soundItem.type === egret.Sound.EFFECT && !GameConfig.EffectIsPlay
            || soundItem.type === egret.Sound.MUSIC && !GameConfig.MusicIsPlay) {
            return;
        }
        //默认设置一次
        if (soundItem.type === egret.Sound.EFFECT) {
            if (loops == undefined) {
                loops = 1;
            }
            else {
                loops = loops;
            }
        }
        else if (soundItem.type === egret.Sound.MUSIC) {
            if (loops == undefined) {
                loops = 0;
            }
        }
        if (soundItem.isPlay)
            soundItem.stop();
        soundItem.BindCall(callback, target);
        soundItem.play(startTime, loops);
    };
    Sound.isPlay = function (soundName) {
        if (soundName === void 0) { soundName = this.currMusic; }
        if (!this.getItem(soundName))
            error("soundName = ", soundName);
        //error("soundName = ",this.getItem(soundName))
        return this.getItem(soundName).isPlay;
    };
    Sound.stop = function (soundName) {
        if (soundName === void 0) { soundName = this.currMusic; }
        debug("Sound:stop--->>", soundName);
        var soundItem = this.getItem(soundName);
        if (soundItem) {
            soundItem.stop();
        }
    };
    Sound.stopAndDestoryById = function (id) {
        var filename = SoundData.getSoundName(id);
        var soundItem = this.getItem(filename);
        if (soundItem) {
            soundItem.onDestroy();
        }
    };
    Sound.stopAllEffect = function () {
        debug("stop all effect");
        for (var i in this.soundDatas) {
            var soundItem = this.soundDatas[i];
            if (soundItem.sound && soundItem.type === egret.Sound.EFFECT) {
                // let soundName = soundItem.sourceItem.name.slice(0, -4);
                Sound.stop(soundItem.sourceItem.name);
            }
        }
    };
    Sound.pauseBgMusic = function (soundName) {
        if (soundName === void 0) { soundName = this.currMusic; }
        var soundItem = this.getItem(soundName);
        if (!soundItem || !soundItem.isPlay) {
            return;
        }
        soundItem.position = soundItem.channel.position;
        Sound.stop(soundName);
    };
    Sound.resumeBgMusic = function (soundName) {
        if (soundName === void 0) { soundName = this.currMusic; }
        var soundItem = this.getItem(soundName);
        if (!soundItem)
            return;
        var loops = soundItem.loops, position = soundItem.position;
        this.playName(soundName, true, position, loops);
        // this.play(soundName, position, loops);
    };
    Sound.position = function (soundName) {
        var soundItem = this.getItem(soundName);
        return soundItem.channel.position;
    };
    /**
     * 设置音效音量大小  范围0 - 1
     */
    Sound.setEffectVolume = function (num) {
        if (num === void 0) { num = 1; }
        this.effectVolume = num;
    };
    Sound.getEffectVolume = function () {
        return this.effectVolume;
    };
    /**
     * 设置背景音量大小  范围0 - 1
     */
    Sound.setbgValume = function (num) {
        if (num === void 0) { num = 1; }
        this.bgValume = num;
        var soundItem = this.getItem(this.currMusic);
        if (soundItem) {
            soundItem.setValume(num);
        }
    };
    Sound.getBgValume = function () {
        return this.bgValume;
    };
    Sound.removeSound = function (soundName) {
        var soundItem = this.getItem(soundName);
        soundItem.sound.close();
        Sound.stop(soundName);
        // this.soundLoad.destroyRes(soundName);
    };
    //////////////////////////////////////////////////////////////////////
    /**点击声音 */
    Sound.playTap = function () {
        this.playName(SoundData.getTapSound());
    };
    Sound.playSceneBG = function (scene) {
        switch (scene) {
            case SceneEnums.NONE_MAP: {
                break;
            }
            case SceneEnums.AUTO_BATTLE_MAP: {
                Sound.playName(SoundData.getMainSound());
                break;
            }
            case SceneEnums.MAIN_CITY: {
                Sound.playName(SoundData.getMainSound());
                break;
            }
            case SceneEnums.WORLD_CITY: {
                Sound.playName(SoundData.getWorldSound());
                break;
            }
            case SceneEnums.BATTLE_MAP: {
                Sound.playName(SoundData.getBattleSound());
                break;
            }
            case SceneEnums.NOVICE_MAP: { //新手地图
                Sound.playName(SoundData.getWorldSound());
                break;
            }
            case SceneEnums.TEST_MAP: { //测试地图
                break;
            }
            case SceneEnums.ALL: {
                break;
            }
        }
    };
    /**战斗开始 */
    Sound.playStartFight = function () {
        this.playName(SoundData.getFightStart());
    };
    /**建筑建造 */
    Sound.playBuildCreate = function () {
        var sound = SoundData.getSoundName(111);
        this.playName(sound != "" ? sound : "jianzhujianzao_mp3");
    };
    /**建筑竣工 */
    Sound.playBuildFinish = function () {
        var sound = SoundData.getSoundName(230);
        this.playName(sound != "" ? sound : "jungong_mp3");
    };
    /**武将音效 */
    Sound.playGeneralSoundByID = function (id) {
        var sound = SoundData.getSoundName(id);
        this.playName(sound != "" ? sound : "jungong_mp3");
    };
    /**暂停武将音效 */
    Sound.stopGeneralSoundByID = function (id) {
        var sound = SoundData.getSoundName(id);
        this.stop(sound != "" ? sound : "jungong_mp3");
    };
    Sound.playSoldierStatus = function (mainType, status) {
        if (status == CSquare_Status.STATUS_ATTACK) { //战斗音效
            switch (mainType) {
                case SoldierMainType.FOOTSOLDIER: //步兵
                    Sound.playID1(210); //刀剑攻击
                    break;
                case SoldierMainType.RIDESOLDIER: //骑兵
                    Sound.playID1(210);
                    break;
                case SoldierMainType.ARROWSOLDIER: //弓箭
                    Sound.playID1(208); //弓箭释放
                    break;
                case SoldierMainType.PIKEMAN: //枪兵
                    Sound.playID1(209); //长矛攻击
                    break;
                default:
                    break;
            }
        }
    };
    Sound.playSoldierRun = function (mainType) {
        switch (mainType) {
            case SoldierMainType.FOOTSOLDIER: //步兵
                Sound.playID1(205); //刀剑攻击
                break;
            case SoldierMainType.RIDESOLDIER: //骑兵
                Sound.playID1(204);
                break;
            case SoldierMainType.ARROWSOLDIER: //弓箭
                Sound.playID1(205); //弓箭释放
                break;
            case SoldierMainType.PIKEMAN: //枪兵
                Sound.playID1(205); //长矛攻击
                break;
            case SoldierMainType.HITWALLSOLDIER: //投石车
                Sound.playID1(206); //长矛攻击
                break;
            default:
                break;
        }
    };
    /**新手对话音频 */
    Sound.playGialogById = function (id, callBack, obj) {
        if (this.m_lastGuideDialogId) {
            this.stopAndDestoryById(this.m_lastGuideDialogId);
        }
        // Sound.playID1(id);
        var filename = SoundData.getSoundName(id);
        if (!this.getItem(filename))
            return;
        if (this.isPlay(filename))
            return;
        Sound.playName(filename, true, 0, 1, callBack, obj);
        this.m_lastGuideDialogId = id;
    };
    // private static soundLoad = new RES.SoundAnalyzer();
    Sound.soundDatas = [];
    Sound.lastClickTime = 0;
    Sound.effectVolume = 1;
    Sound.bgValume = 1;
    /**新手对话音频 */
    Sound.m_lastGuideDialogId = 0;
    return Sound;
}());
